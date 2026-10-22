const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING COLUMN-FIRST STRIP PROJECTION ===');
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

        // 2. Line detection
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

        // 3. Find unique columns on the page from vertical segments
        // We cluster vertical segments into column boundaries
        const vXs = [];
        for (const vs of vSegments) {
            if (!vXs.some(x => Math.abs(x - vs.x) <= 8)) vXs.push(vs.x);
        }
        vXs.sort((a, b) => a - b);
        const colDivs = [0, ...vXs, W];

        // 4. In each column strip, find horizontal bands and lines
        const allClusters = [];

        for (let ci = 0; ci < colDivs.length - 1; ci++) {
            const cx0 = colDivs[ci] + 2;
            const cx1 = colDivs[ci+1] - 2;
            if (cx1 <= cx0 + 6) continue;

            // Project ink in this column strip
            const colRowInk = new Int32Array(H);
            for (let y = 0; y < H; y++) {
                let cnt = 0;
                for (let x = cx0; x < cx1; x++) if (blackInk[y * W + x] === 1) cnt++;
                colRowInk[y] = cnt;
            }

            // Check if horizontal line exists in this column at y
            function hasColHLineAt(y) {
                return hSegments.some(hl => Math.abs(hl.y - y) <= 2 && hl.x0 <= cx1 && hl.x1 >= cx0);
            }

            let inL = false, lStart = -1;
            for (let y = 0; y < H; y++) {
                const hasInk = colRowInk[y] >= 2;
                const hitLine = hasColHLineAt(y);

                if (hasInk && !hitLine) {
                    if (!inL) { inL = true; lStart = y; }
                } else {
                    if (inL) {
                        if (y - lStart >= 5) {
                            processColLine(cx0, cx1, lStart, y);
                        }
                        inL = false;
                    }
                }
            }
            if (inL && H - lStart >= 5) processColLine(cx0, cx1, lStart, H);
        }

        function processColLine(cx0, cx1, ly0, ly1) {
            // Find tight X ink bounds
            let minX = cx1, maxX = cx0;
            for (let y = ly0; y < ly1; y++) {
                for (let x = cx0; x < cx1; x++) {
                    if (blackInk[y * W + x] === 1) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                    }
                }
            }

            if (maxX <= minX + 4) return;

            const colW = cx1 - cx0;
            const itemMid = (minX + maxX) / 2;
            const colMid = (cx0 + cx1) / 2;
            const isCentered = (colW < 400 && Math.abs(itemMid - colMid) / colW < 0.16);

            allClusters.push({
                x0: minX, y0: ly0, x1: maxX, y1: ly1,
                colX0: cx0, colX1: cx1,
                isCentered
            });
        }

        // Sort all clusters top-to-bottom, left-to-right
        allClusters.sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));

        console.log(`Discovered ${allClusters.length} candidate clusters via column-first strip projection in ${Math.round(performance.now() - t0)}ms`);

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
            const match = allClusters.find(it =>
                t.x >= it.x0 - 20 && t.x <= it.x1 + 20 &&
                t.y >= it.y0 - 6 && t.y <= it.y1 + 6
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
                box: { x0: match.x0, y0: match.y0, x1: match.x1, y1: match.y1 },
                text: txt,
                conf: Math.round(res.data.confidence),
                isCentered: match.isCentered
            });
        }

        await worker.terminate();

        return {
            totalClusters: allClusters.length,
            ocrResults
        };
    }, pdfBase64);

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
