const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING IN-CELL LINE RECOGNITION (CELL CROP -> LINE EXTRACTION -> PSM 7) ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const results = await page.evaluate(async (base64) => {
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

        // Line Masks
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

        // Dilate lineMask by 2px
        const lineMask = new Uint8Array(W * H);
        for (let y = 2; y < H - 2; y++) {
            for (let x = 2; x < W - 2; x++) {
                if (hLineMask[y * W + x] || vLineMask[y * W + x] ||
                    hLineMask[(y - 1) * W + x] || hLineMask[(y + 1) * W + x] ||
                    vLineMask[y * W + x - 1] || vLineMask[y * W + x + 1] ||
                    hLineMask[(y - 2) * W + x] || hLineMask[(y + 2) * W + x] ||
                    vLineMask[y * W + x - 2] || vLineMask[y * W + x + 2]) {
                    lineMask[y * W + x] = 1;
                }
            }
        }

        // Stamp & Black Ink
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

        // Helper: in a bounding box, find text lines using horizontal projection of blackInk
        function extractLinesFromRegion(rx0, ry0, rx1, ry1) {
            const x0 = Math.max(0, rx0);
            const y0 = Math.max(0, ry0);
            const x1 = Math.min(W, rx1);
            const y1 = Math.min(H, ry1);

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
                // threshold = 2 pixels to ignore stray dust
                if (rowCounts[i] >= 2) {
                    if (!inLine) { inLine = true; lStart = i; }
                } else {
                    if (inLine) {
                        if (i - lStart >= 4) { // minimum line height 4px
                            lines.push({ y0: y0 + lStart, y1: y0 + i });
                        }
                        inLine = false;
                    }
                }
            }
            if (inLine && (rowCounts.length - lStart >= 4)) {
                lines.push({ y0: y0 + lStart, y1: y0 + rowCounts.length });
            }

            // For each line, find tight horizontal ink bounds
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
                if (maxX > minX + 2) {
                    tightLines.push({
                        x0: minX,
                        y0: ln.y0,
                        x1: maxX,
                        y1: ln.y1
                    });
                }
            }
            return tightLines;
        }

        // Test on the key regions:
        const regionsToTest = [
            { name: 'Header Doc ID', x0: 860, y0: 38, x1: 962, y1: 66 },
            { name: 'Header PR.WI', x0: 966, y0: 38, x1: 1098, y1: 66 },
            { name: 'Header Rev. No', x0: 860, y0: 68, x1: 962, y1: 124 },
            { name: 'Header 00(01/06/24)', x0: 966, y0: 68, x1: 1098, y1: 124 },
            { name: 'VPĐD line', x0: 98, y0: 88, x1: 855, y1: 126 },
            { name: 'Footer Date 1', x0: 98, y0: 1400, x1: 346, y1: 1460 },
            { name: 'Footer Date 2', x0: 350, y0: 1400, x1: 597, y1: 1460 },
            { name: 'Footer Date 3', x0: 601, y0: 1400, x1: 847, y1: 1460 },
            { name: 'Footer Date 4', x0: 851, y0: 1400, x1: 1097, y1: 1460 }
        ];

        const ocrOutputs = [];
        for (const reg of regionsToTest) {
            const lines = extractLinesFromRegion(reg.x0, reg.y0, reg.x1, reg.y1);
            for (let li = 0; li < lines.length; li++) {
                const ln = lines[li];
                // Crop with 4px padding
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
                const words = (res.data && res.data.words || []).map(w => ({
                    text: w.text,
                    confidence: w.confidence,
                    bbox: {
                        x0: ln.x0 + Math.round(w.bbox.x0 / scale),
                        y0: ln.y0 + Math.round(w.bbox.y0 / scale),
                        x1: ln.x0 + Math.round(w.bbox.x1 / scale),
                        y1: ln.y0 + Math.round(w.bbox.y1 / scale)
                    }
                }));

                ocrOutputs.push({
                    region: reg.name,
                    lineIndex: li,
                    lineBox: ln,
                    fullText: (res.data && res.data.text || '').trim(),
                    confidence: Math.round(res.data.confidence),
                    words: words.map(w => w.text)
                });
            }
        }

        await worker.terminate();
        return ocrOutputs;
    }, pdfBase64);

    console.log('=== IN-CELL LINE OCR RESULTS ===');
    console.log(JSON.stringify(results, null, 2));

    await browser.close();
})();
