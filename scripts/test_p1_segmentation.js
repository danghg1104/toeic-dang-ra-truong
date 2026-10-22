const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING P1 CELL SEGMENTATION & IN-CELL LINE EXTRACTION ===');
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

        // 2. Line Masks (Horizontal >= 35px, Vertical >= 22px)
        const Kh = 35, Kv = 22;
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

        // Dilate lineMask slightly by 1px
        const lineMask = new Uint8Array(W * H);
        for (let y = 1; y < H - 1; y++) {
            for (let x = 1; x < W - 1; x++) {
                const idx = y * W + x;
                if (hLineMask[idx] || vLineMask[idx] ||
                    hLineMask[idx - 1] || hLineMask[idx + 1] ||
                    vLineMask[idx - W] || vLineMask[idx + W]) {
                    lineMask[idx] = 1;
                }
            }
        }

        // 3. Stamp & Black Ink
        const stampMask = new Uint8Array(W * H);
        const blackInk = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const r = d[idx], g = d[idx+1], b = d[idx+2];
            const isRed = (r > 135 && r > g * 1.3 && r > b * 1.3);
            const isBlue = (b > 135 && b > r * 1.2 && b > g * 1.15);
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

        // 4. Extract table lines list for bounding checks
        const hLineSegments = [];
        for (let y = 0; y < H; y++) {
            let start = -1;
            for (let x = 0; x < W; x++) {
                if (hLineMask[y * W + x]) {
                    if (start === -1) start = x;
                } else {
                    if (start !== -1) {
                        if (x - start >= Kh) hLineSegments.push({ y, x0: start, x1: x });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && W - start >= Kh) hLineSegments.push({ y, x0: start, x1: W });
        }

        const vLineSegments = [];
        for (let x = 0; x < W; x++) {
            let start = -1;
            for (let y = 0; y < H; y++) {
                if (vLineMask[y * W + x]) {
                    if (start === -1) start = y;
                } else {
                    if (start !== -1) {
                        if (y - start >= Kv) vLineSegments.push({ x, y0: start, y1: y });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && H - start >= Kv) vLineSegments.push({ x, y0: start, y1: H });
        }

        function hasVLineBetween(x0, x1, y0, y1) {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            return vLineSegments.some(vl => vl.x >= minX - 2 && vl.x <= maxX + 2 && vl.y0 <= y1 + 4 && vl.y1 >= y0 - 4);
        }

        function hasHLineBetween(y0, y1, x0, x1) {
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            return hLineSegments.some(hl => hl.y >= minY - 2 && hl.y <= maxY + 2 && hl.x0 <= x1 + 4 && hl.x1 >= x0 - 4);
        }

        // 5. Test specific targets to see how ink line profile works!
        // Target 1: The date footer row (y in [1400, 1465])
        // Target 2: Header info box (x in [850, 1100], y in [35, 130])
        // Target 3: VPĐD address line (x in [95, 850], y in [80, 125])

        const testBBoxes = [
            { name: 'Doc. ID', x0: 858, y0: 38, x1: 964, y1: 67 },
            { name: 'PR.WI- 02', x0: 964, y0: 38, x1: 1099, y1: 67 },
            { name: 'Rev. No', x0: 858, y0: 67, x1: 964, y1: 125 },
            { name: '00(01/06/24)', x0: 964, y0: 67, x1: 1099, y1: 125 },
            { name: 'VPĐD line', x0: 97, y0: 85, x1: 855, y1: 125 },
            { name: 'Date 1', x0: 97, y0: 1400, x1: 348, y1: 1460 },
            { name: 'Date 2', x0: 348, y0: 1400, x1: 599, y1: 1460 },
            { name: 'Date 3', x0: 599, y0: 1400, x1: 849, y1: 1460 },
            { name: 'Date 4', x0: 849, y0: 1400, x1: 1099, y1: 1460 }
        ];

        const testResults = [];
        for (const target of testBBoxes) {
            // Find ink bounds in target
            let minX = W, maxX = 0, minY = H, maxY = 0, inkCount = 0;
            for (let y = target.y0; y <= target.y1; y++) {
                for (let x = target.x0; x <= target.x1; x++) {
                    if (blackInk[y * W + x] === 1) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                        inkCount++;
                    }
                }
            }

            if (inkCount < 4) {
                testResults.push({ name: target.name, text: '(empty)', inkCount });
                continue;
            }

            // Crop tightly around ink with 4px padding
            const pad = 4;
            const cx0 = Math.max(0, minX - pad);
            const cy0 = Math.max(0, minY - pad);
            const cx1 = Math.min(W, maxX + pad);
            const cy1 = Math.min(H, maxY + pad);
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
            testResults.push({
                name: target.name,
                text: (res.data && res.data.text || '').trim(),
                conf: Math.round(res.data.confidence),
                tightBox: { x0: minX, y0: minY, x1: maxX, y1: maxY }
            });
        }

        await worker.terminate();
        return testResults;
    }, pdfBase64);

    console.log('Results:');
    console.log(JSON.stringify(result, null, 2));

    await browser.close();
})();
