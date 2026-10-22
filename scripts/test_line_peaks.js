const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING LINE PROJECTION & GRID EXTRACTION ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const res = await page.evaluate(async (base64) => {
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

        // Grayscale & binary
        const bin = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const lum = d[idx] * 0.299 + d[idx+1] * 0.587 + d[idx+2] * 0.114;
            bin[i] = lum < 165 ? 1 : 0;
        }

        // Horizontal lines (runs >= 40px)
        const hRows = new Int32Array(H);
        for (let y = 0; y < H; y++) {
            let run = 0;
            for (let x = 0; x < W; x++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= 40) hRows[y] += run;
                    run = 0;
                }
            }
            if (run >= 40) hRows[y] += run;
        }

        // Vertical lines (runs >= 30px)
        const vCols = new Int32Array(W);
        for (let x = 0; x < W; x++) {
            let run = 0;
            for (let y = 0; y < H; y++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= 30) vCols[x] += run;
                    run = 0;
                }
            }
            if (run >= 30) vCols[x] += run;
        }

        // Extract peaks
        const hPeaks = [];
        for (let y = 0; y < H; y++) {
            if (hRows[y] > 150) {
                if (hPeaks.length === 0 || y - hPeaks[hPeaks.length - 1] > 6) {
                    hPeaks.push(y);
                }
            }
        }

        const vPeaks = [];
        for (let x = 0; x < W; x++) {
            if (vCols[x] > 100) {
                if (vPeaks.length === 0 || x - vPeaks[vPeaks.length - 1] > 6) {
                    vPeaks.push(x);
                }
            }
        }

        return {
            W, H,
            hPeaksCount: hPeaks.length,
            hPeaks,
            vPeaksCount: vPeaks.length,
            vPeaks
        };
    }, pdfBase64);

    console.log('Result:', JSON.stringify(res, null, 2));
    await browser.close();
})();
