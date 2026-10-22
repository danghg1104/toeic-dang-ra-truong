const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING LINE-LEVEL OCR BENCHMARK ===');
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

        // 1. Layout
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

        // Sampling cells on a 15px grid
        const cellsMap = new Map();
        for (let y = 15; y < H - 15; y += 15) {
            for (let x = 15; x < W - 15; x += 15) {
                if (blackInk[y * W + x] === 1) {
                    const c = findCellBounds(x, y);
                    const k = `${c.x0}_${c.y0}_${c.x1}_${c.y1}`;
                    if (!cellsMap.has(k)) cellsMap.set(k, c);
                }
            }
        }

        // Extract distinct text lines per cell
        const linesToOcr = [];
        for (const [k, cell] of cellsMap.entries()) {
            const x0 = cell.x0 + 2;
            const y0 = cell.y0 + 2;
            const x1 = cell.x1 - 2;
            const y1 = cell.y1 - 2;
            if (x1 <= x0 + 6 || y1 <= y0 + 6) continue;

            const rowInk = new Int32Array(y1 - y0);
            for (let y = y0; y < y1; y++) {
                let cnt = 0;
                for (let x = x0; x < x1; x++) if (blackInk[y * W + x] === 1) cnt++;
                rowInk[y - y0] = cnt;
            }

            let inL = false, lStart = -1;
            for (let i = 0; i < rowInk.length; i++) {
                if (rowInk[i] >= 2) {
                    if (!inL) { inL = true; lStart = i; }
                } else {
                    if (inL) {
                        if (i - lStart >= 6) {
                            saveLine(y0 + lStart, y0 + i, cell, x0, x1);
                        }
                        inL = false;
                    }
                }
            }
            if (inL && rowInk.length - lStart >= 6) {
                saveLine(y0 + lStart, y0 + rowInk.length, cell, x0, x1);
            }
        }

        function saveLine(ly0, ly1, cell, x0, x1) {
            let minX = x1, maxX = x0;
            for (let y = ly0; y < ly1; y++) {
                for (let x = x0; x < x1; x++) {
                    if (blackInk[y * W + x] === 1) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                    }
                }
            }
            if (maxX > minX + 6) {
                const cellMid = (cell.x0 + cell.x1) / 2;
                const itemMid = (minX + maxX) / 2;
                const isCentered = (cell.x1 - cell.x0 < 400 && Math.abs(itemMid - cellMid) / (cell.x1 - cell.x0) < 0.16);

                linesToOcr.push({
                    cell,
                    x0: minX, y0: ly0, x1: maxX, y1: ly1,
                    isCentered
                });
            }
        }

        // Sort lines top-to-bottom, left-to-right
        linesToOcr.sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));

        console.log(`Extracted ${linesToOcr.length} distinct lines. Running OCR...`);
        const tOcrStart = performance.now();

        const allRecognizedClusters = [];
        for (let i = 0; i < linesToOcr.length; i++) {
            const ln = linesToOcr[i];
            const pad = 4;
            const cx0 = Math.max(0, ln.x0 - pad);
            const cy0 = Math.max(0, ln.y0 - pad);
            const cx1 = Math.min(W, ln.x1 + pad);
            const cy1 = Math.min(H, ln.y1 + pad);
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
            let fullText = (res.data && res.data.text || '').trim();
            fullText = fullText.replace(/^['"`~.\-,;:_ |/\\]+/, '').replace(/['"`~_ |/\\]+$/, '').trim();

            if (!fullText || res.data.confidence < 12) continue;

            const words = (res.data && res.data.words || []).map(w => ({
                text: w.text.replace(/^['"`~.\-,;:_ |/\\]+/, '').replace(/['"`~_ |/\\]+$/, '').trim(),
                conf: w.confidence,
                x0: ln.x0 + Math.round(w.bbox.x0 / scale),
                x1: ln.x0 + Math.round(w.bbox.x1 / scale)
            })).filter(w => w.text.length > 0);

            // If line is narrow (< 300px) or words <= 2, save as single cluster
            if (ln.cell.x1 - ln.cell.x0 < 300 || words.length <= 2) {
                allRecognizedClusters.push({
                    cell: ln.cell,
                    box: { x0: ln.x0, y0: ln.y0, x1: ln.x1, y1: ln.y1 },
                    text: fullText,
                    conf: Math.round(res.data.confidence),
                    isCentered: ln.isCentered
                });
            } else {
                // Split into word clusters
                const charH = ln.y1 - ln.y0;
                let curWords = [words[0]];
                for (let wi = 1; wi < words.length; wi++) {
                    const prev = curWords[curWords.length - 1];
                    const curr = words[wi];
                    const gap = curr.x0 - prev.x1;
                    if (gap <= Math.max(16, charH * 1.25)) {
                        curWords.push(curr);
                    } else {
                        saveWordCluster(curWords, ln);
                        curWords = [curr];
                    }
                }
                if (curWords.length > 0) saveWordCluster(curWords, ln);
            }
        }

        function saveWordCluster(wList, ln) {
            allRecognizedClusters.push({
                cell: ln.cell,
                box: {
                    x0: wList[0].x0,
                    y0: ln.y0,
                    x1: wList[wList.length - 1].x1,
                    y1: ln.y1
                },
                text: wList.map(w => w.text).join(' '),
                conf: Math.round(wList.reduce((s, w) => s + w.conf, 0) / wList.length),
                isCentered: ln.isCentered
            });
        }

        const tEnd = performance.now();
        await worker.terminate();

        return {
            linesCount: linesToOcr.length,
            totalClusters: allRecognizedClusters.length,
            ocrTimeMs: Math.round(tEnd - tOcrStart),
            totalTimeMs: Math.round(tEnd - t0),
            sampleRecognized: allRecognizedClusters.slice(0, 15)
        };
    }, pdfBase64);

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
