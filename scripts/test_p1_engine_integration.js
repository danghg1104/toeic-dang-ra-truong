const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING LAYOUT ANALYSIS ENGINE ACROSS MULTIPLE PAGES ===');
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
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const pageCount = pdfDoc.numPages;

        const pagesSummary = [];

        for (let p = 1; p <= Math.min(pageCount, 3); p++) {
            const pdfPage = await pdfDoc.getPage(p);
            const rotation = (pdfPage.rotate || 0) % 360;
            const viewport = pdfPage.getViewport({ scale: 2.0, rotation });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await pdfPage.render({ canvasContext: ctx, viewport }).promise;

            const W = canvas.width;
            const H = canvas.height;
            const d = ctx.getImageData(0, 0, W, H).data;

            // Otsu
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

            // Morphological opening
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

            // Line segments
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

            // Dilated lineMask (2px)
            const lineMask = new Uint8Array(W * H);
            for (let y = 2; y < H - 2; y++) {
                for (let x = 2; x < W - 2; x++) {
                    let hit = false;
                    for (let dy = -2; dy <= 2 && !hit; dy++) {
                        for (let dx = -2; dx <= 2 && !hit; dx++) {
                            const idx = (y + dy) * W + (x + dx);
                            if (hLineMask[idx] || vLineMask[idx]) hit = true;
                        }
                    }
                    if (hit) lineMask[y * W + x] = 1;
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

            pagesSummary.push({
                page: p,
                width: W,
                height: H,
                hSegmentsCount: hSegments.length,
                vSegmentsCount: vSegments.length,
                hasStamp: stampMask.some(v => v === 1)
            });
        }

        return { pageCount, pagesSummary };
    }, pdfBase64);

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
