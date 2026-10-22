const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1280,1024']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
        if (typeof window.switchAppTab === 'function') window.switchAppTab('tailieu');
    });
    const pdfPath = path.join('data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    await page.evaluate(async (b64) => {
        const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'screenshot-page1' });
    }, pdfBytes.toString('base64'));

    await new Promise(r => setTimeout(r, 4000));

    // Scroll to top and take screenshot of header
    const clip = await page.evaluate(() => {
        const wrapper = document.getElementById('pdfPageWrapper-1');
        const rect = wrapper.getBoundingClientRect();
        return {
            x: Math.round(rect.left + rect.width * 0.68),
            y: Math.max(0, Math.round(rect.top)),
            width: Math.round(rect.width * 0.32),
            height: Math.round(rect.height * 0.15)
        };
    });

    console.log('Clip bounds:', clip);
    await page.screenshot({ path: 'reports_p4_screenshots/dom_header_crop.png', clip });
    console.log('Saved dom_header_crop.png');

    await browser.close();
})();
