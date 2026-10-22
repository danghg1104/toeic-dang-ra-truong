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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'test-all-header' });
    }, pdfBytes.toString('base64'));

    let clusters = [];
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 1000));
        clusters = await page.evaluate(() => (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || []);
        if (clusters.length >= 8) break;
    }

    clusters.forEach((c, idx) => {
        if (c.yRatio < 0.15) {
            console.log(`#${idx} id=${c.id} x=${(c.xRatio*100).toFixed(1)}% y=${(c.yRatio*100).toFixed(1)}% w=${(c.wRatio*100).toFixed(1)}% h=${(c.hRatio*100).toFixed(1)}% text="${c.text}"`);
        }
    });
    await browser.close();
})();
