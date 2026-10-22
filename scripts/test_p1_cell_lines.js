const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING PER-CELL LINE PROJECTION ===');
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

        // Grayscale & Otsu
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

        // Line detection
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

        // Stamps & black ink
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

        // Test in Address cell: [x0: 266, x1: 857, y0: 40, y1: 158]
        const addrCell = { x0: 266, y0: 40, x1: 857, y1: 158 };
        const rowInk = new Int32Array(addrCell.y1 - addrCell.y0);
        for (let y = addrCell.y0; y < addrCell.y1; y++) {
            let cnt = 0;
            for (let x = addrCell.x0; x < addrCell.x1; x++) {
                if (blackInk[y * W + x] === 1) cnt++;
            }
            rowInk[y - addrCell.y0] = cnt;
        }

        const cellLines = [];
        let inL = false, lStart = -1;
        for (let i = 0; i < rowInk.length; i++) {
            if (rowInk[i] >= 2) {
                if (!inL) { inL = true; lStart = i; }
            } else {
                if (inL) {
                    if (i - lStart >= 5) {
                        cellLines.push({ y0: addrCell.y0 + lStart, y1: addrCell.y0 + i });
                    }
                    inL = false;
                }
            }
        }
        if (inL && rowInk.length - lStart >= 5) {
            cellLines.push({ y0: addrCell.y0 + lStart, y1: addrCell.y0 + rowInk.length });
        }

        const recognizedLines = [];
        for (let li = 0; li < cellLines.length; li++) {
            const cln = cellLines[li];
            // find tight X bounds in this line
            let minX = addrCell.x1, maxX = addrCell.x0;
            for (let y = cln.y0; y < cln.y1; y++) {
                for (let x = addrCell.x0; x < addrCell.x1; x++) {
                    if (blackInk[y * W + x] === 1) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                    }
                }
            }

            if (maxX > minX + 5) {
                const pad = 4;
                const cx0 = Math.max(0, minX - pad);
                const cy0 = Math.max(0, cln.y0 - pad);
                const cx1 = Math.min(W, maxX + pad);
                const cy1 = Math.min(H, cln.y1 + pad);
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
                recognizedLines.push({
                    lineIndex: li,
                    box: { x0: minX, y0: cln.y0, x1: maxX, y1: cln.y1 },
                    text: (res.data && res.data.text || '').trim(),
                    conf: Math.round(res.data.confidence)
                });
            }
        }

        await worker.terminate();
        return recognizedLines;
    }, pdfBase64);

    console.log('=== ADDRESS CELL LINES RECOGNIZED ===');
    console.log(JSON.stringify(result, null, 2));

    await browser.close();
})();
