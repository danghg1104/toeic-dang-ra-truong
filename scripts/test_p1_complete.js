const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== RUNNING COMPLETE P1 PIPELINE TEST ===');
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

        // 2. Line Masks (Horizontal >= 35px, Vertical >= 25px)
        const Kh = 35, Kv = 25;
        const hLineMask = new Uint8Array(W * H);
        const vLineMask = new Uint8Array(W * H);

        for (let y = 0; y < H; y++) {
            let run = 0;
            for (let x = 0; x < W; x++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= Kh) {
                        for (let rx = x - run; rx < x; rx++) hLineMask[y * W + rx] = 1;
                    }
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
                    if (run >= Kv) {
                        for (let ry = y - run; ry < y; ry++) vLineMask[ry * W + x] = 1;
                    }
                    run = 0;
                }
            }
            if (run >= Kv) for (let ry = H - run; ry < H; ry++) vLineMask[ry * W + x] = 1;
        }

        const lineMask = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) if (hLineMask[i] || vLineMask[i]) lineMask[i] = 1;

        // 3. Stamp & Black Ink
        const stampMask = new Uint8Array(W * H);
        const blackInk = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const r = d[idx], g = d[idx+1], b = d[idx+2];
            const isRed = (r > 140 && r > g * 1.35 && r > b * 1.35);
            const isBlue = (b > 140 && b > r * 1.25 && b > g * 1.15);
            if (isRed || isBlue) stampMask[i] = 1;
            if (bin[i] === 1 && lineMask[i] === 0 && stampMask[i] === 0) blackInk[i] = 1;
        }

        // 4. OCR Clean Canvas (pure black ink on white)
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

        // 5. Grid extraction (finding vertical & horizontal dividers)
        const vCols = new Int32Array(W);
        for (let x = 0; x < W; x++) {
            let sum = 0;
            for (let y = 0; y < H; y++) if (vLineMask[y * W + x]) sum++;
            vCols[x] = sum;
        }
        const vDividers = [];
        for (let x = 0; x < W; x++) {
            if (vCols[x] > 40) {
                if (vDividers.length === 0 || x - vDividers[vDividers.length - 1] > 8) {
                    vDividers.push(x);
                }
            }
        }

        const hRows = new Int32Array(H);
        for (let y = 0; y < H; y++) {
            let sum = 0;
            for (let x = 0; x < W; x++) if (hLineMask[y * W + x]) sum++;
            hRows[y] = sum;
        }
        const hDividers = [];
        for (let y = 0; y < H; y++) {
            if (hRows[y] > 60) {
                if (hDividers.length === 0 || y - hDividers[hDividers.length - 1] > 8) {
                    hDividers.push(y);
                }
            }
        }

        console.log(`vDividers (${vDividers.length}): ${vDividers.join(', ')}`);
        console.log(`hDividers (${hDividers.length}): ${hDividers.join(', ')}`);

        // Helper: get table cell bounds for any ink point
        function getCellForPoint(px, py) {
            // Find vertical lines to left and right
            let x0 = 0, x1 = W;
            for (let i = 0; i < vDividers.length; i++) {
                if (vDividers[i] <= px && vDividers[i] > x0) x0 = vDividers[i];
                if (vDividers[i] >= px && vDividers[i] < x1) {
                    x1 = vDividers[i];
                    break;
                }
            }
            let y0 = 0, y1 = H;
            for (let i = 0; i < hDividers.length; i++) {
                if (hDividers[i] <= py && hDividers[i] > y0) y0 = hDividers[i];
                if (hDividers[i] >= py && hDividers[i] < y1) {
                    y1 = hDividers[i];
                    break;
                }
            }
            return { x0, y0, x1, y1 };
        }

        // 6. Test specific key cells:
        // Date 1..4 (py ~ 1430, px ~ 200, 470, 720, 970)
        const dateTestPoints = [
            { name: 'Date 1', px: 200, py: 1430 },
            { name: 'Date 2', px: 470, py: 1430 },
            { name: 'Date 3', px: 720, py: 1430 },
            { name: 'Date 4', px: 970, py: 1430 }
        ];

        const dateResults = [];
        for (const pt of dateTestPoints) {
            const cell = getCellForPoint(pt.px, pt.py);
            // Crop cell
            const cw = cell.x1 - cell.x0 - 4;
            const ch = cell.y1 - cell.y0 - 4;
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = cw;
            cropCanvas.height = Math.max(ch, 34);
            const cc = cropCanvas.getContext('2d');
            cc.fillStyle = '#ffffff';
            cc.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
            cc.drawImage(cleanCanvas, cell.x0 + 2, cell.y0 + 2, cw, ch, 0, 0, cw, cropCanvas.height);

            const res = await worker.recognize(cropCanvas);
            dateResults.push({
                name: pt.name,
                cellBounds: cell,
                text: (res.data && res.data.text || '').trim()
            });
        }

        // Header tests: Doc ID, Rev No, PR.WI, 00(01/06/24)
        const headerTestPoints = [
            { name: 'Doc. ID', px: 900, py: 50 },
            { name: 'PR.WI- 02', px: 1020, py: 50 },
            { name: 'Rev. No', px: 900, py: 95 },
            { name: '00(01/06/24)', px: 1020, py: 95 },
            { name: 'VPĐD line', px: 400, py: 105 }
        ];

        const headerResults = [];
        for (const pt of headerTestPoints) {
            const cell = getCellForPoint(pt.px, pt.py);
            const cw = cell.x1 - cell.x0 - 4;
            const ch = cell.y1 - cell.y0 - 4;
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = cw;
            cropCanvas.height = Math.max(ch, 34);
            const cc = cropCanvas.getContext('2d');
            cc.fillStyle = '#ffffff';
            cc.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
            cc.drawImage(cleanCanvas, cell.x0 + 2, cell.y0 + 2, cw, ch, 0, 0, cw, cropCanvas.height);

            const res = await worker.recognize(cropCanvas);
            headerResults.push({
                name: pt.name,
                cellBounds: cell,
                text: (res.data && res.data.text || '').trim()
            });
        }

        await worker.terminate();

        return {
            dateResults,
            headerResults
        };
    }, pdfBase64);

    console.log('=== P1 FINAL PIPELINE TEST RESULTS ===');
    console.log('Date Cells:');
    console.log(JSON.stringify(evalResult.dateResults, null, 2));
    console.log('Header Cells:');
    console.log(JSON.stringify(evalResult.headerResults, null, 2));

    await browser.close();
})();
