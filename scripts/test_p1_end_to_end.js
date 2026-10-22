const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING COMPLETE END-TO-END P1 PIPELINE ON PAGE 1 ===');
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

        // 5. Discover all active unique cells by sampling black ink on a 10px grid
        const cellsMap = new Map();
        for (let y = 10; y < H - 10; y += 10) {
            for (let x = 10; x < W - 10; x += 10) {
                if (blackInk[y * W + x] === 1) {
                    const c = findCellBounds(x, y);
                    const k = `${c.x0}_${c.y0}_${c.x1}_${c.y1}`;
                    if (!cellsMap.has(k)) {
                        cellsMap.set(k, c);
                    }
                }
            }
        }

        console.log(`Discovered ${cellsMap.size} unique cells with ink`);

        // 6. In each unique cell, extract lines using horizontal projection
        const candidateItems = [];

        for (const [k, cell] of cellsMap.entries()) {
            const x0 = cell.x0 + 2;
            const y0 = cell.y0 + 2;
            const x1 = cell.x1 - 2;
            const y1 = cell.y1 - 2;
            if (x1 <= x0 + 4 || y1 <= y0 + 4) continue;

            const rowInk = new Int32Array(y1 - y0);
            for (let y = y0; y < y1; y++) {
                let cnt = 0;
                for (let x = x0; x < x1; x++) {
                    if (blackInk[y * W + x] === 1) cnt++;
                }
                rowInk[y - y0] = cnt;
            }

            const cellLines = [];
            let inL = false, lStart = -1;
            for (let i = 0; i < rowInk.length; i++) {
                if (rowInk[i] >= 2) {
                    if (!inL) { inL = true; lStart = i; }
                } else {
                    if (inL) {
                        if (i - lStart >= 5) {
                            cellLines.push({ y0: y0 + lStart, y1: y0 + i });
                        }
                        inL = false;
                    }
                }
            }
            if (inL && rowInk.length - lStart >= 5) {
                cellLines.push({ y0: y0 + lStart, y1: y0 + rowInk.length });
            }

            // In each line, find words/clusters
            for (const cln of cellLines) {
                const colInk = new Int32Array(x1 - x0);
                for (let x = x0; x < x1; x++) {
                    let cnt = 0;
                    for (let y = cln.y0; y < cln.y1; y++) {
                        if (blackInk[y * W + x] === 1) cnt++;
                    }
                    colInk[x - x0] = cnt;
                }

                const words = [];
                let inW = false, wStart = -1;
                for (let x = 0; x < colInk.length; x++) {
                    if (colInk[x] >= 1) {
                        if (!inW) { inW = true; wStart = x; }
                    } else {
                        if (inW) {
                            if (x - wStart >= 3) {
                                words.push({ x0: x0 + wStart, x1: x0 + x });
                            }
                            inW = false;
                        }
                    }
                }
                if (inW && (colInk.length - wStart >= 3)) {
                    words.push({ x0: x0 + wStart, x1: x0 + colInk.length });
                }

                if (words.length === 0) continue;

                // If cell is narrow (width < 300px), treat line as single item
                const charH = cln.y1 - cln.y0;
                if (x1 - x0 < 300) {
                    const wx0 = words[0].x0;
                    const wx1 = words[words.length - 1].x1;
                    const cellMid = (cell.x0 + cell.x1) / 2;
                    const itemMid = (wx0 + wx1) / 2;
                    const isCentered = (Math.abs(itemMid - cellMid) / (cell.x1 - cell.x0) < 0.16);

                    candidateItems.push({
                        cell,
                        x0: wx0, y0: cln.y0, x1: wx1, y1: cln.y1,
                        isCentered
                    });
                } else {
                    // Wide cell: cluster words
                    let curCluster = [words[0]];
                    for (let wi = 1; wi < words.length; wi++) {
                        const prev = curCluster[curCluster.length - 1];
                        const curr = words[wi];
                        const gap = curr.x0 - prev.x1;

                        if (gap <= Math.max(16, charH * 1.25)) {
                            curCluster.push(curr);
                        } else {
                            saveCluster(curCluster, cln, cell);
                            curCluster = [curr];
                        }
                    }
                    if (curCluster.length > 0) saveCluster(curCluster, cln, cell);
                }
            }
        }

        function saveCluster(wordList, line, cell) {
            const x0 = wordList[0].x0;
            const x1 = wordList[wordList.length - 1].x1;
            candidateItems.push({
                cell,
                x0, y0: line.y0, x1, y1: line.y1,
                isCentered: false
            });
        }

        const tLayout = performance.now();
        console.log(`P1 layout finished in ${Math.round(tLayout - t0)}ms. Discovered ${candidateItems.length} candidate clusters.`);

        // Test the exact targets:
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
                t.x >= it.x0 - 25 && t.x <= it.x1 + 25 &&
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
            let txt = (res.data && res.data.text || '').trim();
            txt = txt.replace(/^['"`~.\-,;:_ |/\\]+/, '').replace(/['"`~_ |/\\]+$/, '').trim();

            ocrResults.push({
                name: t.name,
                found: true,
                cell: match.cell,
                box: { x0: match.x0, y0: match.y0, x1: match.x1, y1: match.y1 },
                text: txt,
                conf: Math.round(res.data.confidence),
                isCentered: match.isCentered
            });
        }

        await worker.terminate();

        return {
            layoutTimeMs: Math.round(tLayout - t0),
            cellCount: cellsMap.size,
            totalClusters: candidateItems.length,
            ocrResults
        };
    }, pdfBase64);

    console.log('=== FINAL PIPELINE VERIFICATION RESULT ===');
    console.log(JSON.stringify(result, null, 2));

    await browser.close();
})();
