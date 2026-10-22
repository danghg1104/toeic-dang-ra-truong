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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'test-n' });
    }, pdfBytes.toString('base64'));

    await new Promise(r => setTimeout(r, 5000));
    const clusters = await page.evaluate(() => {
        return (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
    });
    console.log('Total clusters on page 1:', clusters.length);
    clusters.forEach((c, idx) => {
        console.log(`[${idx}] y=${Math.round(c.yRatio * 100)}% center=${c.isCentered} text: "${c.text}"`);
    });
    await browser.close();
})();
