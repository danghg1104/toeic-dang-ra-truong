const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING LINE-FIRST FAST LAYOUT PIPELINE ON PAGE 1 ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const result = await page.evaluate(async (base64) => {
        if (!window.Tesseract) {
            await new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = 'js/tesseract.min.js';
                s.onload = res;
                s.onerror = rej;
                document.head.appendChild(s);
            });
        }

        const worker = await window.Tesseract.createWorker(['vie', 'eng'], 1, {
            workerPath: 'js/tesseract-dist/worker.min.js',
            corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
            langPath: window.location.origin + '/data/ocr_lang',
            cacheMethod: 'none',
            gzip: true
        });
        await worker.setParameters({ tessedit_pageseg_mode: '7' });

        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const page1 = await pdfDoc.getPage(1);
        const rotation = (page1.rotate || 0) % 360;
        const viewport = page1.getViewport({ scale: 2.0, rotation });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page1.render({ canvasContext: ctx, viewport }).promise;

        const W = canvas.width;
        const H = canvas.height;
        const d = ctx.getImageData(0, 0, W, H).data;

        const t0 = performance.now();

        // 1. Grayscale & Otsu
        const gray = new Uint8Array(W * H);
        const hist = new Int32Array(256);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const g = Math.round(d[idx] * 0.299 + d[idx+1] * 0.587 + d[idx+2] * 0.114);
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

        // 2. Line detection (Horizontal >= 30px, Vertical >= 20px)
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

        // Fast separable dilation (2px radius)
        const rawLines = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) if (hLineMask[i] || vLineMask[i]) rawLines[i] = 1;

        const dilatedH = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            const rowOffset = y * W;
            for (let x = 0; x < W; x++) {
                if (rawLines[rowOffset + x] ||
                    (x > 0 && rawLines[rowOffset + x - 1]) ||
                    (x < W - 1 && rawLines[rowOffset + x + 1]) ||
                    (x > 1 && rawLines[rowOffset + x - 2]) ||
                    (x < W - 2 && rawLines[rowOffset + x + 2])) {
                    dilatedH[rowOffset + x] = 1;
                }
            }
        }

        const lineMask = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const idx = y * W + x;
                if (dilatedH[idx] ||
                    (y > 0 && dilatedH[idx - W]) ||
                    (y < H - 1 && dilatedH[idx + W]) ||
                    (y > 1 && dilatedH[idx - 2 * W]) ||
                    (y < H - 2 && dilatedH[idx + 2 * W])) {
                    lineMask[idx] = 1;
                }
            }
        }

        // 3. Stamp & Black ink
        const stampMask = new Uint8Array(W * H);
        const blackInk = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const r = d[idx], g = d[idx+1], b = d[idx+2];
            const isRed = (r > 130 && r > g * 1.3 && r > b * 1.3);
            const isBlue = (b > 130 && b > r * 1.2 && b > g * 1.15);
            if (isRed || isBlue) stampMask[i] = 1;
            if (bin[i] === 1 && lineMask[i] === 0 && stampMask[i] === 0) blackInk[i] = 1;
        }

        // Clean Canvas with pure black ink on white
        const cleanCanvas = document.createElement('canvas');
        cleanCanvas.width = W;
        cleanCanvas.height = H;
        const clCtx = cleanCanvas.getContext('2d');
        clCtx.fillStyle = '#ffffff';
        clCtx.fillRect(0, 0, W, H);
        const clImg = clCtx.getImageData(0, 0, W, H);
        const clData = clImg.data;
        for (let i = 0; i < W * H; i++) {
            if (blackInk[i] === 1) {
                const idx = i * 4;
                clData[idx] = 0;
                clData[idx+1] = 0;
                clData[idx+2] = 0;
            }
        }
        clCtx.putImageData(clImg, 0, 0);

        // 4. Line segments
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

        // 5. Horizontal projection of black ink across the page
        // Dividing into line strips, cutting at horizontal table lines
        const rowInk = new Int32Array(H);
        for (let y = 0; y < H; y++) {
            let cnt = 0;
            for (let x = 0; x < W; x++) if (blackInk[y * W + x] === 1) cnt++;
            rowInk[y] = cnt;
        }

        // Check if row y intersects any major horizontal table line
        function hasHLineAt(y) {
            return hSegments.some(hl => Math.abs(hl.y - y) <= 1 && (hl.x1 - hl.x0 > 150));
        }

        const pageLines = [];
        let inLine = false, lStart = -1;
        for (let y = 0; y < H; y++) {
            const hasInk = rowInk[y] >= 3;
            const hitHLine = hasHLineAt(y);

            if (hasInk && !hitHLine) {
                if (!inLine) { inLine = true; lStart = y; }
            } else {
                if (inLine) {
                    if (y - lStart >= 6) {
                        pageLines.push({ y0: lStart, y1: y });
                    }
                    inLine = false;
                }
            }
        }
        if (inLine && H - lStart >= 6) pageLines.push({ y0: lStart, y1: H });

        // 6. Within each line, find vertical dividers that cross it
        const candidateItems = [];

        for (const line of pageLines) {
            // Find vertical lines crossing this line
            const vLinesInLine = vSegments
                .filter(vl => vl.y0 <= line.y1 + 4 && vl.y1 >= line.y0 - 4)
                .map(vl => vl.x)
                .sort((a, b) => a - b);

            // Deduplicate vertical divider x coordinates within 8px
            const divX = [0];
            for (const x of vLinesInLine) {
                if (x - divX[divX.length - 1] > 8) divX.push(x);
            }
            divX.push(W);

            // In each column strip between divX[i] and divX[i+1]:
            for (let i = 0; i < divX.length - 1; i++) {
                const colX0 = divX[i] + 3;
                const colX1 = divX[i+1] - 3;
                if (colX1 <= colX0 + 5) continue;

                // Column projection of ink in this strip
                const colInk = new Int32Array(colX1 - colX0);
                for (let x = colX0; x < colX1; x++) {
                    let cnt = 0;
                    for (let y = line.y0; y < line.y1; y++) {
                        if (blackInk[y * W + x] === 1) cnt++;
                    }
                    colInk[x - colX0] = cnt;
                }

                // Find word segments
                const words = [];
                let inW = false, wStart = -1;
                for (let x = 0; x < colInk.length; x++) {
                    if (colInk[x] >= 1) {
                        if (!inW) { inW = true; wStart = x; }
                    } else {
                        if (inW) {
                            if (x - wStart >= 3) {
                                words.push({ x0: colX0 + wStart, x1: colX0 + x });
                            }
                            inW = false;
                        }
                    }
                }
                if (inW && (colInk.length - wStart >= 3)) {
                    words.push({ x0: colX0 + wStart, x1: colX0 + colInk.length });
                }

                if (words.length === 0) continue;

                // Cluster words if horizontal gap <= 1.25 * charHeight
                const charH = line.y1 - line.y0;
                let curCluster = [words[0]];

                for (let wi = 1; wi < words.length; wi++) {
                    const prev = curCluster[curCluster.length - 1];
                    const curr = words[wi];
                    const gap = curr.x0 - prev.x1;

                    if (gap <= Math.max(16, charH * 1.25)) {
                        curCluster.push(curr);
                    } else {
                        saveCandidateCluster(curCluster, line, colX0, colX1);
                        curCluster = [curr];
                    }
                }
                if (curCluster.length > 0) saveCandidateCluster(curCluster, line, colX0, colX1);
            }
        }

        function saveCandidateCluster(wordList, line, colX0, colX1) {
            const x0 = wordList[0].x0;
            const x1 = wordList[wordList.length - 1].x1;
            const w = x1 - x0;
            const h = line.y1 - line.y0;

            if (w >= 4 && h >= 5) {
                // Determine if centered in column
                const colW = colX1 - colX0;
                const colMid = (colX0 + colX1) / 2;
                const itemMid = (x0 + x1) / 2;
                const isCentered = (colW < 400 && Math.abs(itemMid - colMid) / colW < 0.15);

                candidateItems.push({
                    x0, y0: line.y0, x1, y1: line.y1,
                    colX0, colX1,
                    isCentered
                });
            }
        }

        const tLayout = performance.now();
        console.log(`Pipeline layout completed in ${Math.round(tLayout - t0)}ms. Discovered ${candidateItems.length} candidate clusters.`);

        // Now test OCR on key clusters:
        const targets = [
            { name: 'Doc. ID', x: 910, y: 52 },
            { name: 'PR.WI- 02', x: 1020, y: 52 },
            { name: 'Rev. No', x: 910, y: 95 },
            { name: '00(01/06/24)', x: 1020, y: 85 },
            { name: 'VPĐD line', x: 400, y: 108 },
            { name: 'Date 1', x: 170, y: 1435 },
            { name: 'Date 2', x: 420, y: 1435 },
            { name: 'Date 3', x: 670, y: 1435 },
            { name: 'Date 4', x: 920, y: 1435 }
        ];

        const ocrResults = [];
        for (const t of targets) {
            const match = candidateItems.find(it =>
                t.x >= it.x0 - 20 && t.x <= it.x1 + 20 &&
                t.y >= it.y0 - 8 && t.y <= it.y1 + 8
            );

            if (!match) {
                ocrResults.push({ name: t.name, found: false });
                continue;
            }

            const pad = 4;
            const cx0 = Math.max(0, match.x0 - pad);
            const cy0 = Math.max(0, match.y0 - pad);
            const cx1 = Math.min(W, match.x1 + pad);
            const cy1 = Math.min(H, match.y1 + pad);
            const cw = cx1 - cx0;
            const ch = cy1 - cy0;

            const scale = Math.max(1.0, 36 / ch);
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = Math.round(cw * scale);
            cropCanvas.height = Math.round(ch * scale);
            const cctx = cropCanvas.getContext('2d');
            cctx.fillStyle = '#ffffff';
            cctx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
            cctx.imageSmoothingEnabled = true;
            cctx.imageSmoothingQuality = 'high';
            cctx.drawImage(cleanCanvas, cx0, cy0, cw, ch, 0, 0, cropCanvas.width, cropCanvas.height);

            const res = await worker.recognize(cropCanvas);
            ocrResults.push({
                name: t.name,
                found: true,
                box: { x0: match.x0, y0: match.y0, x1: match.x1, y1: match.y1 },
                text: (res.data && res.data.text || '').trim(),
                conf: Math.round(res.data.confidence),
                isCentered: match.isCentered
            });
        }

        await worker.terminate();

        return {
            layoutTimeMs: Math.round(tLayout - t0),
            totalClusters: candidateItems.length,
            ocrResults
        };
    }, pdfBase64);

    console.log('=== TEST RESULT ===');
    console.log(JSON.stringify(result, null, 2));

    await browser.close();
})();
