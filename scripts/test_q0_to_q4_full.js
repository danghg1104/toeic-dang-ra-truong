const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING COMPLETE Q0 -> Q3 SYSTEM ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const testResults = await page.evaluate(async (base64) => {
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const page1 = await pdfDoc.getPage(1);
        const viewport = page1.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page1.render({ canvasContext: ctx, viewport }).promise;

        const W = canvas.width;
        const H = canvas.height;
        const origImg = ctx.getImageData(0, 0, W, H);
        const d = origImg.data;

        // Otsu & line extraction
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
        // TYPOGRAPHY MEASUREMENT ENGINE (Q1)
        // -------------------------------------------------------------
        function measureClusterTypography(box, cell) {
            const x0 = Math.max(0, box.x0);
            const y0 = Math.max(0, box.y0);
            const x1 = Math.min(W, box.x1);
            const y1 = Math.min(H, box.y1);
            const bw = x1 - x0;
            const bh = y1 - y0;

            const patch = ctx.getImageData(x0, y0, bw, bh).data;

            // 1. Vertical ink projection profile
            const rowInk = new Int32Array(bh);
            const inkPixels = [];
            for (let y = 0; y < bh; y++) {
                for (let x = 0; x < bw; x++) {
                    const idx = (y * bw + x) * 4;
                    const lum = patch[idx] * 0.299 + patch[idx + 1] * 0.587 + patch[idx + 2] * 0.114;
                    if (lum < 165) {
                        rowInk[y]++;
                        inkPixels.push({
                            x: x0 + x, y: y0 + y,
                            r: patch[idx], g: patch[idx + 1], b: patch[idx + 2], lum
                        });
                    }
                }
            }

            // Find ink bounds
            let firstInkRow = 0;
            while (firstInkRow < bh && rowInk[firstInkRow] === 0) firstInkRow++;
            let lastInkRow = bh - 1;
            while (lastInkRow >= 0 && rowInk[lastInkRow] === 0) lastInkRow--;

            // Find baseline: bottom peak/cutoff of rowInk (excluding descenders)
            // For text without long descenders or typical lines, baseline is near 80-85% of ink height
            let baseRow = lastInkRow;
            // Detect if descenders exist: check if bottom rows have < 20% of max row ink
            let maxRowInk = 0;
            for (let y = firstInkRow; y <= lastInkRow; y++) {
                if (rowInk[y] > maxRowInk) maxRowInk = rowInk[y];
            }
            // Baseline is the row with strong ink transition near bottom
            for (let y = lastInkRow; y >= firstInkRow + (lastInkRow - firstInkRow) * 0.5; y--) {
                if (rowInk[y] >= maxRowInk * 0.25) {
                    baseRow = y;
                    break;
                }
            }

            const measuredBaselineY = y0 + baseRow;
            const measuredCapHeight = Math.max(10, baseRow - firstInkRow);
            const measuredXHeight = Math.round(measuredCapHeight * 0.68);

            // 2. Measure darkest 10% ink pixels
            inkPixels.sort((a, b) => a.lum - b.lum);
            const dark10Count = Math.max(1, Math.floor(inkPixels.length * 0.1));
            const dark10 = inkPixels.slice(0, dark10Count);
            const meanInkR = Math.round(dark10.reduce((a, b) => a + b.r, 0) / dark10.length);
            const meanInkG = Math.round(dark10.reduce((a, b) => a + b.g, 0) / dark10.length);
            const meanInkB = Math.round(dark10.reduce((a, b) => a + b.b, 0) / dark10.length);

            return {
                measuredBaselineY,
                measuredCapHeight,
                measuredXHeight,
                inkColor: `rgb(${meanInkR}, ${meanInkG}, ${meanInkB})`,
                meanInkR, meanInkG, meanInkB,
                boxWidth: bw,
                boxHeight: bh
            };
        }

        // -------------------------------------------------------------
        // INPAINTING ENGINE (Q0)
        // -------------------------------------------------------------
        function inpaintCluster(targetCanvas, bbox, cell, options = {}) {
            const tctx = targetCanvas.getContext('2d');
            const CW = targetCanvas.width;
            const CH = targetCanvas.height;

            const charH = Math.max(12, bbox.y1 - bbox.y0);
            const expandY = Math.round(charH * 0.55);
            const expandX = Math.round(charH * 0.35);

            const sx0 = Math.max(cell.x0 + 2, bbox.x0 - expandX);
            const sy0 = Math.max(cell.y0 + 2, bbox.y0 - expandY);
            const sx1 = Math.min(cell.x1 - 2, bbox.x1 + expandX);
            const sy1 = Math.min(cell.y1 - 2, bbox.y1 + expandY);

            const sw = sx1 - sx0;
            const sh = sy1 - sy0;
            if (sw <= 4 || sh <= 4) return null;

            const patchImg = tctx.getImageData(sx0, sy0, sw, sh);
            const pd = patchImg.data;

            // 1. Sample clean paper background in cell (lum >= 220)
            const bgRs = [], bgGs = [], bgBs = [], bgLums = [];
            for (let py = Math.max(cell.y0 + 2, sy0 - 15); py < Math.min(cell.y1 - 2, sy1 + 15); py += 2) {
                for (let px = Math.max(cell.x0 + 2, sx0 - 15); px < Math.min(cell.x1 - 2, sx1 + 15); px += 2) {
                    const gIdx = py * CW + px;
                    if (lineMask[gIdx] === 1) continue;
                    if (px >= bbox.x0 && px <= bbox.x1 && py >= bbox.y0 && py <= bbox.y1) continue;

                    const cIdx = gIdx * 4;
                    const r = d[cIdx], g = d[cIdx + 1], b = d[cIdx + 2];
                    const lum = r * 0.299 + g * 0.587 + b * 0.114;
                    if (lum >= 220) {
                        bgRs.push(r); bgGs.push(g); bgBs.push(b); bgLums.push(lum);
                    }
                }
            }

            if (bgLums.length === 0) {
                bgRs.push(253); bgGs.push(253); bgBs.push(253); bgLums.push(253);
            }

            const meanBgLum = bgLums.reduce((a, b) => a + b, 0) / bgLums.length;
            const meanR = bgRs.reduce((a, b) => a + b, 0) / bgRs.length;
            const meanG = bgGs.reduce((a, b) => a + b, 0) / bgGs.length;
            const meanB = bgBs.reduce((a, b) => a + b, 0) / bgBs.length;
            const bgVar = bgLums.reduce((a, b) => a + (b - meanBgLum) ** 2, 0) / bgLums.length;
            const bgStd = Math.max(1.5, Math.min(5.0, Math.sqrt(bgVar)));

            // 2. Relative darkness & Hysteresis Threshold
            const relDark = new Float32Array(sw * sh);
            const isColor = new Uint8Array(sw * sh);
            const eraseColor = options.eraseColor !== false;

            for (let y = 0; y < sh; y++) {
                const gy = sy0 + y;
                for (let x = 0; x < sw; x++) {
                    const gx = sx0 + x;
                    const pIdx = (y * sw + x) * 4;
                    const r = pd[pIdx], g = pd[pIdx + 1], b = pd[pIdx + 2];
                    const lum = r * 0.299 + g * 0.587 + b * 0.114;

                    relDark[y * sw + x] = Math.max(0, (meanBgLum - lum) / meanBgLum);

                    const isBlue = (b > 115 && b > r * 1.15 && b > g * 1.08);
                    const isRed = (r > 130 && r > g * 1.3 && r > b * 1.3);
                    if (isBlue || isRed) isColor[y * sw + x] = 1;
                }
            }

            const Thigh = 0.12;
            const Tlow = 0.055;
            const inkSeed = new Uint8Array(sw * sh);
            const inkCand = new Uint8Array(sw * sh);

            for (let i = 0; i < sw * sh; i++) {
                if (relDark[i] >= Thigh || (eraseColor && isColor[i] === 1)) inkSeed[i] = 1;
                if (relDark[i] >= Tlow || (eraseColor && isColor[i] === 1)) inkCand[i] = 1;
            }

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
                            if (inkCand[nIdx] === 1 && inkMask[nIdx] === 0) {
                                inkMask[nIdx] = 1;
                                queue.push(nIdx);
                            }
                        }
                    }
                }
            }

            // Dilate 3.5px
            let dilatedMask = new Uint8Array(sw * sh);
            const radius = 3;
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    if (inkMask[y * sw + x] === 1) {
                        for (let dy = -radius; dy <= radius; dy++) {
                            for (let dx = -radius; dx <= radius; dx++) {
                                if (dx * dx + dy * dy <= radius * radius + 1) {
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

            // Exclude table lines
            for (let y = 0; y < sh; y++) {
                const gy = sy0 + y;
                for (let x = 0; x < sw; x++) {
                    const gx = sx0 + x;
                    if (lineMask[gy * CW + gx] === 1) {
                        dilatedMask[y * sw + x] = 0;
                    }
                }
            }

            function randomGaussian(std) {
                let u = 0, v = 0;
                while (u === 0) u = Math.random();
                while (v === 0) v = Math.random();
                return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std;
            }

            // Distance transform for 2px feathering
            const feather = new Float32Array(sw * sh);
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
                        feather[y * sw + x] = Math.min(1.0, minD / 2.0);
                    }
                }
            }

            // Apply inpainting with noise matching background
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    const idx = y * sw + x;
                    if (dilatedMask[idx] === 1) {
                        const alpha = feather[idx];
                        const noise = randomGaussian(bgStd);
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

            // Measure difference between inpainted area and adjacent background (Q0.5)
            let inpaintLumSum = 0, inpaintCount = 0;
            const inpaintLums = [];
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    const idx = y * sw + x;
                    if (dilatedMask[idx] === 1 && feather[idx] > 0.8) {
                        const pIdx = idx * 4;
                        const lum = pd[pIdx] * 0.299 + pd[pIdx + 1] * 0.587 + pd[pIdx + 2] * 0.114;
                        inpaintLumSum += lum;
                        inpaintCount++;
                        inpaintLums.push(lum);
                    }
                }
            }

            const inpaintMeanLum = inpaintCount > 0 ? (inpaintLumSum / inpaintCount) : meanBgLum;
            const inpaintVar = inpaintCount > 0 ? inpaintLums.reduce((a, b) => a + (b - inpaintMeanLum) ** 2, 0) / inpaintCount : 0;
            const inpaintStd = Math.sqrt(inpaintVar);
            const lumDiff = Math.abs(inpaintMeanLum - meanBgLum);

            return {
                sx0, sy0, sx1, sy1, sw, sh,
                meanBgLum,
                inpaintMeanLum,
                lumDiff,
                bgStd,
                inpaintStd,
                stdDiffRatio: Math.abs(inpaintStd - bgStd) / bgStd,
                maskPixels: inpaintCount
            };
        }

        // -------------------------------------------------------------
        // SCAN-REALISTIC TEXT RENDERER (Q1 & Q2)
        // -------------------------------------------------------------
        function renderRealisticText(targetCanvas, newText, typo, cell, isCentered = false, alignLeftX = null) {
            const tctx = targetCanvas.getContext('2d');
            const CW = targetCanvas.width;
            const CH = targetCanvas.height;

            // Target cap-height: measuredCapHeight
            // In Times New Roman, font-size in px ~ cap-height / 0.70
            let fontSize = Math.round(typo.measuredCapHeight / 0.70);
            const fontFamily = "'Times New Roman', 'Tinos', 'Noto Serif', Georgia, serif";

            // Test text width
            tctx.font = `400 ${fontSize}px ${fontFamily}`;
            let textMetrics = tctx.measureText(newText);
            let textWidth = textMetrics.width;

            // Max available width = cell.x1 - cell.x0 - 2 * 8px
            const maxAvailableW = Math.max(50, (cell.x1 - cell.x0) - 16);
            let hscale = 1.0;

            if (textWidth > maxAvailableW) {
                hscale = maxAvailableW / textWidth;
                if (hscale < 0.85) {
                    hscale = 0.85;
                    // Proportional font-size reduction
                    fontSize = Math.floor(fontSize * (maxAvailableW / (textWidth * 0.85)));
                    tctx.font = `400 ${fontSize}px ${fontFamily}`;
                    textWidth = tctx.measureText(newText).width;
                }
            }

            // Calculate start X
            let startX = cell.x0 + 8;
            if (isCentered) {
                const cellMid = (cell.x0 + cell.x1) / 2;
                startX = Math.round(cellMid - (textWidth * hscale) / 2);
            } else if (alignLeftX !== null) {
                startX = alignLeftX;
            }

            // Ensure startX is at least 8px from left and text end is at least 8px from right
            startX = Math.max(cell.x0 + 8, startX);
            const endX = startX + textWidth * hscale;
            const rightMargin = (cell.x1 - endX);

            // Render text onto offscreen canvas with subtle scan softening
            const textOffscreen = document.createElement('canvas');
            const pad = 12;
            textOffscreen.width = Math.ceil(textWidth * hscale + pad * 2);
            textOffscreen.height = Math.ceil(fontSize * 1.6 + pad * 2);
            const octx = textOffscreen.getContext('2d');

            octx.save();
            octx.font = `400 ${fontSize}px ${fontFamily}`;
            octx.fillStyle = typo.inkColor || 'rgb(35, 38, 42)';
            octx.textBaseline = 'alphabetic';
            // Slight Gaussian blur matching scanner point spread function (sigma = 0.65px)
            octx.filter = 'blur(0.65px)';
            octx.scale(hscale, 1.0);
            octx.fillText(newText, pad / hscale, pad + fontSize * 0.85);
            octx.restore();

            // Draw offscreen text onto target canvas at exact baseline
            // Baseline in offscreen canvas is at pad + fontSize * 0.85
            const drawX = startX - pad;
            const drawY = typo.measuredBaselineY - (pad + fontSize * 0.85);

            tctx.drawImage(textOffscreen, drawX, drawY);

            // Measure actual rendered cap-height
            const renderedCapHeight = Math.round(fontSize * 0.70);
            const capHeightRatio = renderedCapHeight / typo.measuredCapHeight;

            return {
                fontSize,
                hscale,
                startX,
                endX,
                rightMargin,
                renderedCapHeight,
                capHeightRatio,
                baselineY: typo.measuredBaselineY
            };
        }

        // =============================================================
        // EXECUTE TESTS: VPĐD AND PR.WI
        // =============================================================

        // 1. VPĐD Test:
        const vpddCell = findCellBounds(400, 110);
        const vpddBbox = { x0: 299, y0: 99, x1: 824, y1: 121 };
        const vpddTypo = measureClusterTypography(vpddBbox, vpddCell);
        const vpddClean = inpaintCluster(canvas, vpddBbox, vpddCell, { eraseColor: true });
        const vpddRender = renderRealisticText(
            canvas,
            "VPĐD: 20 Nguyễn Đăng Giai, P. Thảo Điền, Tp. Thủ Đức, TP. HCM",
            vpddTypo,
            vpddCell,
            true // Centered in cell
        );

        // 2. PR.WI Test:
        const prwiCell = findCellBounds(1000, 50);
        const prwiBbox = { x0: 970, y0: 45, x1: 1090, y1: 65 };
        const prwiTypo = measureClusterTypography(prwiBbox, prwiCell);
        // "00(01/06/24)" cell below to match left edge
        const revCell = findCellBounds(1000, 85);
        const alignLeftX = 976; // Exact left edge of 00(01/06/24)
        const prwiClean = inpaintCluster(canvas, prwiBbox, prwiCell, { eraseColor: true });
        const prwiRender = renderRealisticText(
            canvas,
            "PR.WI- 024",
            prwiTypo,
            prwiCell,
            false,
            alignLeftX // Left-aligned with 00(01/06/24)
        );

        // Extract result crops for inspection
        const vpddCrop = document.createElement('canvas');
        vpddCrop.width = vpddCell.x1 - vpddCell.x0;
        vpddCrop.height = vpddCell.y1 - vpddCell.y0;
        vpddCrop.getContext('2d').drawImage(canvas, vpddCell.x0, vpddCell.y0, vpddCrop.width, vpddCrop.height, 0, 0, vpddCrop.width, vpddCrop.height);

        const prwiCrop = document.createElement('canvas');
        prwiCrop.width = prwiCell.x1 - prwiCell.x0;
        prwiCrop.height = prwiCell.y1 - prwiCell.y0;
        prwiCrop.getContext('2d').drawImage(canvas, prwiCell.x0, prwiCell.y0, prwiCrop.width, prwiCrop.height, 0, 0, prwiCrop.width, prwiCrop.height);

        return {
            vpdd: { typo: vpddTypo, clean: vpddClean, render: vpddRender },
            prwi: { typo: prwiTypo, clean: prwiClean, render: prwiRender },
            vpddCropData: vpddCrop.toDataURL('image/png'),
            prwiCropData: prwiCrop.toDataURL('image/png')
        };
    }, pdfBase64);

    console.log('=== TEST RESULTS ===');
    console.log('VPĐD Inpaint & Render:', JSON.stringify(testResults.vpdd, null, 2));
    console.log('PR.WI Inpaint & Render:', JSON.stringify(testResults.prwi, null, 2));

    const dir = path.join(__dirname, '..', 'reports_p4_screenshots');
    fs.writeFileSync(path.join(dir, 'q_test_vpdd_after.png'), Buffer.from(testResults.vpddCropData.replace(/^data:image\/png;base64,/, ''), 'base64'));
    fs.writeFileSync(path.join(dir, 'q_test_prwi_after.png'), Buffer.from(testResults.prwiCropData.replace(/^data:image\/png;base64,/, ''), 'base64'));
    console.log('Saved crops: q_test_vpdd_after.png, q_test_prwi_after.png');

    await browser.close();
})();
