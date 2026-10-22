const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== BENCHMARKING COMPLETE P1 WORKER PIPELINE ===');
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

        // 5. Blob discovery
        const visited = new Uint8Array(W * H);
        const inkBlobs = [];
        for (let y = 2; y < H - 2; y += 2) {
            for (let x = 2; x < W - 2; x += 2) {
                const idx = y * W + x;
                if (blackInk[idx] === 1 && visited[idx] === 0) {
                    let bMinX = x, bMaxX = x, bMinY = y, bMaxY = y, blobPixels = 0;
                    const queue = [x, y];
                    visited[idx] = 1;
                    let head = 0;

                    while (head < queue.length) {
                        const qx = queue[head++];
                        const qy = queue[head++];
                        blobPixels++;
                        if (qx < bMinX) bMinX = qx;
                        if (qx > bMaxX) bMaxX = qx;
                        if (qy < bMinY) bMinY = qy;
                        if (qy > bMaxY) bMaxY = qy;

                        const neighbors = [
                            [qx - 2, qy], [qx + 2, qy],
                            [qx, qy - 2], [qx, qy + 2]
                        ];
                        for (let n = 0; n < 4; n++) {
                            const nx = neighbors[n][0];
                            const ny = neighbors[n][1];
                            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                                const nIdx = ny * W + nx;
                                if (blackInk[nIdx] === 1 && visited[nIdx] === 0) {
                                    visited[nIdx] = 1;
                                    queue.push(nx, ny);
                                }
                            }
                        }
                    }

                    if (blobPixels >= 4 && (bMaxX - bMinX >= 3 || bMaxY - bMinY >= 3)) {
                        inkBlobs.push({
                            x0: bMinX, y0: bMinY, x1: bMaxX, y1: bMaxY,
                            cx: Math.round((bMinX + bMaxX) / 2),
                            cy: Math.round((bMinY + bMaxY) / 2),
                            pixels: blobPixels
                        });
                    }
                }
            }
        }

        // 6. Partition into cells
        const cellsMap = new Map();
        for (const blob of inkBlobs) {
            const cell = findCellBounds(blob.cx, blob.cy);
            const cellKey = `${cell.x0}_${cell.y0}_${cell.x1}_${cell.y1}`;
            if (!cellsMap.has(cellKey)) {
                cellsMap.set(cellKey, { cell, blobs: [] });
            }
            cellsMap.get(cellKey).blobs.push(blob);
        }

        // 7. Extract lines per cell
        function extractLinesFromCell(cell, blobs) {
            const x0 = cell.x0 + 2;
            const y0 = cell.y0 + 2;
            const x1 = cell.x1 - 2;
            const y1 = cell.y1 - 2;
            if (x1 <= x0 || y1 <= y0) return [];

            const rowCounts = new Int32Array(y1 - y0);
            for (let y = y0; y < y1; y++) {
                let cnt = 0;
                for (let x = x0; x < x1; x++) {
                    if (blackInk[y * W + x] === 1) cnt++;
                }
                rowCounts[y - y0] = cnt;
            }

            const lines = [];
            let inLine = false, lStart = -1;
            for (let i = 0; i < rowCounts.length; i++) {
                if (rowCounts[i] >= 2) {
                    if (!inLine) { inLine = true; lStart = i; }
                } else {
                    if (inLine) {
                        if (i - lStart >= 6) { // min height 6px
                            lines.push({ y0: y0 + lStart, y1: y0 + i });
                        }
                        inLine = false;
                    }
                }
            }
            if (inLine && (rowCounts.length - lStart >= 6)) {
                lines.push({ y0: y0 + lStart, y1: y0 + rowCounts.length });
            }

            const tightLines = [];
            for (const ln of lines) {
                let minX = x1, maxX = x0;
                for (let y = ln.y0; y < ln.y1; y++) {
                    for (let x = x0; x < x1; x++) {
                        if (blackInk[y * W + x] === 1) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                        }
                    }
                }
                if (maxX > minX + 3) {
                    tightLines.push({
                        cell,
                        x0: minX,
                        y0: ln.y0,
                        x1: maxX,
                        y1: ln.y1
                    });
                }
            }
            return tightLines;
        }

        const allLines = [];
        for (const [key, entry] of cellsMap.entries()) {
            const lines = extractLinesFromCell(entry.cell, entry.blobs);
            allLines.push(...lines);
        }

        const tLayout = performance.now();
        console.log(`Layout completed in ${Math.round(tLayout - t0)}ms. Discovered ${allLines.length} text lines across ${cellsMap.size} cells.`);

        await worker.terminate();

        return {
            layoutTimeMs: Math.round(tLayout - t0),
            cellCount: cellsMap.size,
            lineCount: allLines.length,
            sampleLines: allLines.slice(0, 10).map(l => ({
                cell: l.cell,
                box: { x0: l.x0, y0: l.y0, x1: l.x1, y1: l.y1, w: l.x1 - l.x0, h: l.y1 - l.y0 }
            }))
        };
    }, pdfBase64);

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
