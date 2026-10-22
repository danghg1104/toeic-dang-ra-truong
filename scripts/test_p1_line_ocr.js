const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING LINE-BY-LINE OCR PER CELL (PSM 7) ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const testResults = await page.evaluate(async (base64) => {
        // Ensure Tesseract
        if (!window.Tesseract) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'js/tesseract.min.js';
                s.onload = resolve;
                s.onerror = reject;
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

        // Set PSM 7 (treat the image as a single text line)
        await worker.setParameters({
            tessedit_pageseg_mode: '7'
        });

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

        // Test crops:
        // 1. Doc. ID cell (x: 858..964, y: 38..67)
        // 2. PR.WI- 02 cell (x: 964..1099, y: 38..67)
        // 3. Rev. No cell (x: 858..964, y: 67..125)
        // 4. 00(01/06/24) cell (x: 964..1099, y: 67..125)
        // 5. Date cell 1 (x: 97..348, y: 1400..1460)
        // 6. Date cell 2 (x: 348..599, y: 1400..1460)
        // 7. Date cell 3 (x: 599..849, y: 1400..1460)
        // 8. Date cell 4 (x: 849..1099, y: 1400..1460)
        // 9. VPDD line (x: 100..850, y: 80..130)

        const testCrops = [
            { name: 'Doc. ID', x: 862, y: 38, w: 98, h: 28 },
            { name: 'PR.WI- 02', x: 968, y: 38, w: 125, h: 28 },
            { name: 'Rev. No', x: 862, y: 68, w: 98, h: 45 },
            { name: '00(01/06/24)', x: 968, y: 68, w: 125, h: 45 },
            { name: 'Date Col 1', x: 105, y: 1415, w: 235, h: 40 },
            { name: 'Date Col 2', x: 355, y: 1415, w: 235, h: 40 },
            { name: 'Date Col 3', x: 605, y: 1415, w: 235, h: 40 },
            { name: 'Date Col 4', x: 855, y: 1415, w: 235, h: 40 },
            { name: 'VPĐD line', x: 105, y: 92, w: 745, h: 32 }
        ];

        const ocrResults = [];

        for (const crop of testCrops) {
            const cropCanvas = document.createElement('canvas');
            // Upscale if h < 32
            const scaleFactor = Math.max(1.0, 36 / crop.h);
            cropCanvas.width = Math.round(crop.w * scaleFactor);
            cropCanvas.height = Math.round(crop.h * scaleFactor);
            const cCtx = cropCanvas.getContext('2d');
            cCtx.imageSmoothingEnabled = true;
            cCtx.imageSmoothingQuality = 'high';
            cCtx.drawImage(canvas, crop.x, crop.y, crop.w, crop.h, 0, 0, cropCanvas.width, cropCanvas.height);

            const res = await worker.recognize(cropCanvas);
            const text = (res.data && res.data.text || '').trim();
            ocrResults.push({
                name: crop.name,
                recognized: text,
                conf: Math.round(res.data.confidence)
            });
        }

        await worker.terminate();
        return ocrResults;
    }, pdfBase64);

    console.log('=== OCR PER LINE/CELL RESULTS ===');
    console.log(JSON.stringify(testResults, null, 2));

    await browser.close();
})();
