const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
        if (typeof window.switchAppTab === 'function') window.switchAppTab('tailieu');
    });
    const pdfPath = path.join('data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    await page.evaluate(async (b64) => {
        const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'crop-test' });
    }, pdfBytes.toString('base64'));

    await new Promise(r => setTimeout(r, 4000));

    // Crop the canvas directly from page 1
    const cropB64 = await page.evaluate(() => {
        const canvas = window.PdfStudio.pageCanvases[1] || document.getElementById('pdfCanvas-1');
        if (!canvas) return null;
        // Crop x: 65% to 100%, y: 0% to 15%
        const x = Math.floor(canvas.width * 0.65);
        const y = Math.floor(canvas.height * 0.0);
        const w = Math.floor(canvas.width * 0.35);
        const h = Math.floor(canvas.height * 0.15);

        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);
        return c.toDataURL('image/png');
    });

    if (cropB64) {
        const base64Data = cropB64.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync('reports_p4_screenshots/original_header_right.png', base64Data, 'base64');
        console.log('Saved original_header_right.png');
    }
    await browser.close();
})();
