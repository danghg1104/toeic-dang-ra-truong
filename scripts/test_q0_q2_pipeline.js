const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== RUNNING COMPLETE Q0 -> Q2 TEST ON PR_WI-21 ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const evalResult = await page.evaluate(async (base64) => {
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const page1 = await pdfDoc.getPage(1);
        const viewport = page1.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page1.render({ canvasContext: ctx, viewport }).promise;

        // Use PdfStudio's analyzeDocumentLayout from window
        // Let's create an offscreen canvas to test inpainting and text generation
        const W = canvas.width;
        const H = canvas.height;
        const imgData = ctx.getImageData(0, 0, W, H);
        const d = imgData.data;

        // 1. Otsu & Morphological line masks (same as P1)
        const gray = new Uint8Array(W * H);
        const hist = new Int32Array(256);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const g = Math.round(d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114);
            gray[i] = g;
            hist[g]++;
        }
        let total = W * H, sum = 0;
        for (let t = 0; t < 256; t++) sum += t * hist[t];
        let sumB = 0, wB = 0, wF = 0, varMax = 0, otsu = 160;
        for (let t = 0; t < 256; t++) {
            wB += hist[t];
            if (wB === 0) continue;
            wF = total - wB;
            if (wF === 0) break;
            sumB += t * hist[t];
            let mB = sumB / wB;
            let mF = (sum - sumB) / wF;
            let vb = wB * wF * (mB - mF) * (mB - mF);
            if (vb > varMax) { varMax = vb; otsu = t; }
        }

        const bin = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) bin[i] = gray[i] < otsu ? 1 : 0;

        const Kh = 30, Kv = 20;
        const hLineMask = new Uint8Array(W * H);
        const vLineMask = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            let run = 0;
            for (let x = 0; x < W; x++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= Kh) for (let rx = x - run; rx < x; rx++) hLineMask[y * W + rx] = 1;
                    run = 0;
                }
            }
            if (run >= Kh) for (let rx = W - run; rx < W; rx++) hLineMask[y * W + rx] = 1;
        }
        for (let x = 0; x < W; x++) {
            let run = 0;
            for (let y = 0; y < H; y++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= Kv) for (let ry = y - run; ry < y; ry++) vLineMask[ry * W + x] = 1;
                    run = 0;
                }
            }
            if (run >= Kv) for (let ry = H - run; ry < H; ry++) vLineMask[ry * W + x] = 1;
        }

        const rawLines = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) if (hLineMask[i] || vLineMask[i]) rawLines[i] = 1;

        const lineMask = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const idx = y * W + x;
                if (rawLines[idx] ||
                    (x > 0 && rawLines[idx - 1]) || (x < W - 1 && rawLines[idx + 1]) ||
                    (y > 0 && rawLines[idx - W]) || (y < H - 1 && rawLines[idx + W])) {
                    lineMask[idx] = 1;
                }
            }
        }

        // Geometric table line segments
        const hSegments = [];
        for (let y = 0; y < H; y++) {
            let start = -1;
            for (let x = 0; x < W; x++) {
                if (hLineMask[y * W + x]) {
                    if (start === -1) start = x;
                } else {
                    if (start !== -1) {
                        if (x - start >= Kh) hSegments.push({ y, x0: start, x1: x });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && W - start >= Kh) hSegments.push({ y, x0: start, x1: W });
        }
        const vSegments = [];
        for (let x = 0; x < W; x++) {
            let start = -1;
            for (let y = 0; y < H; y++) {
                if (vLineMask[y * W + x]) {
                    if (start === -1) start = y;
                } else {
                    if (start !== -1) {
                        if (y - start >= Kv) vSegments.push({ x, y0: start, y1: y });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && H - start >= Kv) vSegments.push({ x, y0: start, y1: H });
        }

        function findCellBounds(px, py) {
            let topY = 0, bottomY = H;
            let leftX = 0, rightX = W;
            for (const hl of hSegments) {
                if (hl.x0 <= px + 8 && hl.x1 >= px - 8) {
                    if (hl.y <= py && hl.y > topY) topY = hl.y;
                    if (hl.y >= py && hl.y < bottomY) bottomY = hl.y;
                }
            }
            for (const vl of vSegments) {
                if (vl.y0 <= py + 8 && vl.y1 >= py - 8) {
                    if (vl.x <= px && vl.x > leftX) leftX = vl.x;
                    if (vl.x >= px && vl.x < rightX) rightX = vl.x;
                }
            }
            return { x0: leftX, y0: topY, x1: rightX, y1: bottomY };
        }

        // -------------------------------------------------------------
        // ADVANCED Q0 INPAINTING ENGINE: Local Background Estimation & Hysteresis
        // -------------------------------------------------------------
        function inpaintClusterRegion(targetCanvas, bbox, cell, options = {}) {
            const tctx = targetCanvas.getContext('2d');
            const CW = targetCanvas.width;
            const CH = targetCanvas.height;

            const charH = Math.max(12, bbox.y1 - bbox.y0);
            const expandY = Math.round(charH * 0.55);
            const expandX = Math.round(charH * 0.35);

            // Bounded strictly within cell boundaries (with 2px margin away from table border lines)
            const sx0 = Math.max(cell.x0 + 2, bbox.x0 - expandX);
            const sy0 = Math.max(cell.y0 + 2, bbox.y0 - expandY);
            const sx1 = Math.min(cell.x1 - 2, bbox.x1 + expandX);
            const sy1 = Math.min(cell.y1 - 2, bbox.y1 + expandY);

            const sw = sx1 - sx0;
            const sh = sy1 - sy0;
            if (sw <= 4 || sh <= 4) return null;

            const patchImg = tctx.getImageData(sx0, sy0, sw, sh);
            const pd = patchImg.data;

            // 1. Estimate background color and noise from non-line, non-ink pixels in the cell
            const bgRs = [], bgGs = [], bgBs = [], bgLums = [];
            // Sample from perimeter of the patch or surrounding cell area
            for (let py = Math.max(cell.y0 + 2, sy0 - 15); py < Math.min(cell.y1 - 2, sy1 + 15); py += 2) {
                for (let px = Math.max(cell.x0 + 2, sx0 - 15); px < Math.min(cell.x1 - 2, sx1 + 15); px += 2) {
                    const gIdx = py * CW + px;
                    if (lineMask[gIdx] === 1) continue;
                    // Outside the current text bbox
                    if (px >= bbox.x0 && px <= bbox.x1 && py >= bbox.y0 && py <= bbox.y1) continue;

                    const cIdx = gIdx * 4;
                    const r = d[cIdx], g = d[cIdx + 1], b = d[cIdx + 2];
                    const lum = r * 0.299 + g * 0.587 + b * 0.114;
                    if (lum > 190) {
                        bgRs.push(r); bgGs.push(g); bgBs.push(b); bgLums.push(lum);
                    }
                }
            }

            if (bgLums.length === 0) {
                bgRs.push(252); bgGs.push(252); bgBs.push(252); bgLums.push(252);
            }

            const meanBgLum = bgLums.reduce((a, b) => a + b, 0) / bgLums.length;
            const meanR = bgRs.reduce((a, b) => a + b, 0) / bgRs.length;
            const meanG = bgGs.reduce((a, b) => a + b, 0) / bgGs.length;
            const meanB = bgBs.reduce((a, b) => a + b, 0) / bgBs.length;
            const bgVar = bgLums.reduce((a, b) => a + (b - meanBgLum) ** 2, 0) / bgLums.length;
            const bgStd = Math.sqrt(bgVar);

            // 2. Relative darkness and Hysteresis Thresholding
            // relDarkness = (meanBgLum - pixelLum) / meanBgLum
            const relDark = new Float32Array(sw * sh);
            const isBlueOrRed = new Uint8Array(sw * sh);
            const eraseColor = options.eraseColor !== false;

            for (let y = 0; y < sh; y++) {
                const gy = sy0 + y;
                for (let x = 0; x < sw; x++) {
                    const gx = sx0 + x;
                    const pIdx = (y * sw + x) * 4;
                    const r = pd[pIdx], g = pd[pIdx + 1], b = pd[pIdx + 2];
                    const lum = r * 0.299 + g * 0.587 + b * 0.114;

                    relDark[y * sw + x] = Math.max(0, (meanBgLum - lum) / meanBgLum);

                    // Check for handwritten blue ink or stamps
                    const isBlue = (b > 115 && b > r * 1.15 && b > g * 1.08);
                    const isRed = (r > 130 && r > g * 1.3 && r > b * 1.3);
                    if (isBlue || isRed) isBlueOrRed[y * sw + x] = 1;
                }
            }

            // Hysteresis: Seeds (relDark >= 0.14), Candidates (relDark >= 0.06)
            const Thigh = 0.13;
            const Tlow = 0.06;
            const inkSeed = new Uint8Array(sw * sh);
            const inkCandidate = new Uint8Array(sw * sh);

            for (let i = 0; i < sw * sh; i++) {
                if (relDark[i] >= Thigh || (eraseColor && isBlueOrRed[i] === 1)) {
                    inkSeed[i] = 1;
                }
                if (relDark[i] >= Tlow || (eraseColor && isBlueOrRed[i] === 1)) {
                    inkCandidate[i] = 1;
                }
            }

            // Flood-fill expansion from seeds to connected candidates
            const inkMask = new Uint8Array(sw * sh);
            const queue = [];
            for (let i = 0; i < sw * sh; i++) {
                if (inkSeed[i] === 1) {
                    inkMask[i] = 1;
                    queue.push(i);
                }
            }

            let qHead = 0;
            while (qHead < queue.length) {
                const cur = queue[qHead++];
                const cy = Math.floor(cur / sw);
                const cx = cur % sw;

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const ny = cy + dy;
                        const nx = cx + dx;
                        if (nx >= 0 && nx < sw && ny >= 0 && ny < sh) {
                            const nIdx = ny * sw + nx;
                            if (inkCandidate[nIdx] === 1 && inkMask[nIdx] === 0) {
                                inkMask[nIdx] = 1;
                                queue.push(nIdx);
                            }
                        }
                    }
                }
            }

            // 3. Dilation: 3.5px at 300 DPI (radius 3)
            let dilatedMask = new Uint8Array(sw * sh);
            const dilateRadius = options.extraDilate ? 4 : 3;
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    if (inkMask[y * sw + x] === 1) {
                        for (let dy = -dilateRadius; dy <= dilateRadius; dy++) {
                            for (let dx = -dilateRadius; dx <= dilateRadius; dx++) {
                                if (dx * dx + dy * dy <= dilateRadius * dilateRadius + 1) {
                                    const ny = y + dy;
                                    const nx = x + dx;
                                    if (nx >= 0 && nx < sw && ny >= 0 && ny < sh) {
                                        dilatedMask[ny * sw + nx] = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 4. Strict border preservation: subtract lineMask
            for (let y = 0; y < sh; y++) {
                const gy = sy0 + y;
                for (let x = 0; x < sw; x++) {
                    const gx = sx0 + x;
                    if (lineMask[gy * CW + gx] === 1) {
                        dilatedMask[y * sw + x] = 0;
                    }
                }
            }

            // 5. Inpaint background with noise and soft 2px feathering
            // Box-Muller Gaussian Noise generator
            function randomGaussian(mean, std) {
                let u = 0, v = 0;
                while (u === 0) u = Math.random();
                while (v === 0) v = Math.random();
                const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
                return mean + z * std;
            }

            // Distance transform for 2px feathering
            const featherDist = new Float32Array(sw * sh);
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    if (dilatedMask[y * sw + x] === 1) {
                        let minD = 999;
                        for (let dy = -2; dy <= 2; dy++) {
                            for (let dx = -2; dx <= 2; dx++) {
                                const ny = y + dy;
                                const nx = x + dx;
                                if (nx < 0 || nx >= sw || ny < 0 || ny >= sh || dilatedMask[ny * sw + nx] === 0) {
                                    const d = Math.sqrt(dx * dx + dy * dy);
                                    if (d < minD) minD = d;
                                }
                            }
                        }
                        featherDist[y * sw + x] = Math.min(1.0, minD / 2.0);
                    }
                }
            }

            // Write inpainted pixels directly to patchImg
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    const idx = y * sw + x;
                    if (dilatedMask[idx] === 1) {
                        const alpha = featherDist[idx];
                        const noise = randomGaussian(0, Math.min(bgStd, 4.5));
                        const synthR = Math.min(255, Math.max(0, Math.round(meanR + noise)));
                        const synthG = Math.min(255, Math.max(0, Math.round(meanG + noise)));
                        const synthB = Math.min(255, Math.max(0, Math.round(meanB + noise)));

                        const pIdx = idx * 4;
                        pd[pIdx] = Math.round(synthR * alpha + pd[pIdx] * (1 - alpha));
                        pd[pIdx + 1] = Math.round(synthG * alpha + pd[pIdx + 1] * (1 - alpha));
                        pd[pIdx + 2] = Math.round(synthB * alpha + pd[pIdx + 2] * (1 - alpha));
                    }
                }
            }

            tctx.putImageData(patchImg, sx0, sy0);

            // 6. Check residual ink (Q0.4)
            let residualDarkCount = 0;
            let checkCount = 0;
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    const idx = y * sw + x;
                    if (dilatedMask[idx] === 1) {
                        checkCount++;
                        const pIdx = idx * 4;
                        const lum = pd[pIdx] * 0.299 + pd[pIdx + 1] * 0.587 + pd[pIdx + 2] * 0.114;
                        const rD = (meanBgLum - lum) / meanBgLum;
                        if (rD > 0.03) residualDarkCount++;
                    }
                }
            }
            const residualFraction = checkCount > 0 ? (residualDarkCount / checkCount) : 0;

            return {
                sx0, sy0, sx1, sy1, sw, sh,
                meanBgLum, bgStd,
                residualFraction,
                maskPixels: checkCount
            };
        }

        // Test 1: Inpaint VPĐD line: x0: 299, y0: 99, x1: 824, y1: 121
        const vpddCell = findCellBounds(400, 110);
        const vpddBbox = { x0: 299, y0: 99, x1: 824, y1: 121 };
        const vpddCleanRes = inpaintClusterRegion(canvas, vpddBbox, vpddCell, { eraseColor: true });

        // Test 2: Inpaint PR.WI- 02 cell: x0: 970, y0: 45, x1: 1090, y1: 65
        const prwiCell = findCellBounds(1000, 50);
        const prwiBbox = { x0: 970, y0: 45, x1: 1090, y1: 65 };
        const prwiCleanRes = inpaintClusterRegion(canvas, prwiBbox, prwiCell, { eraseColor: true });

        // Extract crops for inspection
        const vpddCropCanvas = document.createElement('canvas');
        vpddCropCanvas.width = vpddCell.x1 - vpddCell.x0;
        vpddCropCanvas.height = vpddCell.y1 - vpddCell.y0;
        vpddCropCanvas.getContext('2d').drawImage(canvas, vpddCell.x0, vpddCell.y0, vpddCropCanvas.width, vpddCropCanvas.height, 0, 0, vpddCropCanvas.width, vpddCropCanvas.height);

        const prwiCropCanvas = document.createElement('canvas');
        prwiCropCanvas.width = prwiCell.x1 - prwiCell.x0;
        prwiCropCanvas.height = prwiCell.y1 - prwiCell.y0;
        prwiCropCanvas.getContext('2d').drawImage(canvas, prwiCell.x0, prwiCell.y0, prwiCropCanvas.width, prwiCropCanvas.height, 0, 0, prwiCropCanvas.width, prwiCropCanvas.height);

        return {
            vpddCleanRes,
            prwiCleanRes,
            vpddCropData: vpddCropCanvas.toDataURL('image/png'),
            prwiCropData: prwiCropCanvas.toDataURL('image/png')
        };
    }, pdfBase64);

    console.log('Inpainting results:');
    console.log('VPĐD:', evalResult.vpddCleanRes);
    console.log('PR.WI:', evalResult.prwiCleanRes);

    // Save crops to inspect
    const dir = path.join(__dirname, '..', 'reports_p4_screenshots');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const vpddPng = Buffer.from(evalResult.vpddCropData.replace(/^data:image\/png;base64,/, ''), 'base64');
    fs.writeFileSync(path.join(dir, 'test_vpdd_clean_crop.png'), vpddPng);

    const prwiPng = Buffer.from(evalResult.prwiCropData.replace(/^data:image\/png;base64,/, ''), 'base64');
    fs.writeFileSync(path.join(dir, 'test_prwi_clean_crop.png'), prwiPng);

    console.log('Saved test crops to reports_p4_screenshots/');
    await browser.close();
})();
