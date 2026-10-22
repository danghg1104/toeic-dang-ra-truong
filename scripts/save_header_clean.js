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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'test-header-view' });
    }, pdfBytes.toString('base64'));

    await new Promise(r => setTimeout(r, 4000));

    // Get rendered page 1 canvas directly
    const imgData = await page.evaluate(() => {
        const c = window.PdfStudio.pageCanvases[1] || document.getElementById('pdfCanvas-1');
        if (!c) return null;
        // crop x: 70% to 100%, y: 0% to 15%
        const x = Math.floor(c.width * 0.70);
        const y = 0;
        const w = Math.floor(c.width * 0.30);
        const h = Math.floor(c.height * 0.15);

        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        off.getContext('2d').drawImage(c, x, y, w, h, 0, 0, w, h);
        return off.toDataURL('image/png');
    });

    if (imgData) {
        fs.writeFileSync('reports_p4_screenshots/original_header_clean.png', imgData.replace(/^data:image\/png;base64,/, ''), 'base64');
        console.log('Saved original_header_clean.png');
    }

    await browser.close();
})();
