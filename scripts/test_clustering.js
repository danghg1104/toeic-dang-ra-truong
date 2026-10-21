const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('--- Testing Word Clustering & Table Detection ---');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Switch to take-note tab
    await page.evaluate(() => {
        if (typeof switchTab === 'function') switchTab('take-note');
    });

    // Read the sample PDF
    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    const result = await page.evaluate(async (base64) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        // Open in PDF.js directly to inspect page 1 canvas
        const loadingTask = window.pdfjsLib.getDocument({ data: bytes.slice(0) });
        const pdfDoc = await loadingTask.promise;
        const page1 = await pdfDoc.getPage(1);

        const viewport = page1.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page1.render({ canvasContext: ctx, viewport }).promise;

        // Run Tesseract offline worker
        await window.PdfStudio.init();
        const worker = await window.Tesseract.createWorker(['vie', 'eng'], 1, {
            workerPath: 'js/tesseract-dist/worker.min.js',
            corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
            langPath: window.location.origin + '/data/ocr_lang',
            cacheMethod: 'none',
            gzip: true
        });

        console.log('Tesseract worker initialized, recognizing...');
        const ocrRes = await worker.recognize(canvas);
        const words = (ocrRes.data && ocrRes.data.words) || [];
        const lines = (ocrRes.data && ocrRes.data.lines) || [];
        await worker.terminate();

        return {
            totalWords: words.length,
            totalLines: lines.length,
            sampleWords: words.slice(0, 30).map(w => ({ text: w.text, bbox: w.bbox, conf: w.confidence })),
            sampleLines: lines.slice(0, 15).map(l => ({ text: l.text, bbox: l.bbox }))
        };
    }, pdfBase64);

    console.log('Total Words:', result.totalWords, 'Total Lines:', result.totalLines);
    console.log('Sample Words:', JSON.stringify(result.sampleWords.slice(0, 15), null, 2));
    console.log('Sample Lines:', JSON.stringify(result.sampleLines.slice(0, 8), null, 2));

    await browser.close();
    console.log('--- Test Completed ---');
})();
