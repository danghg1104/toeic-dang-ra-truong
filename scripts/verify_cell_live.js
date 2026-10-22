const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1400,1000']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000 });
    await page.goto('http://localhost:3000');
    await page.evaluate(() => { if (typeof window.switchAppTab === 'function') window.switchAppTab('tailieu'); });
    const pdfPath = 'data/sample_documents/sample_lipovitan_7pages.pdf';
    const pdfBytes = fs.readFileSync(pdfPath);
    await page.evaluate(async (b64) => {
        const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'test-vis-live' });
    }, pdfBytes.toString('base64'));

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.some(c => c.text.includes('PR.WI'));
        });
        if (ok) break;
    }

    // Capture BEFORE edit
    const el = await page.$('#pdfPageWrapper-1');
    const boxBefore = await el.boundingBox();
    await page.screenshot({
        path: 'reports_p4_screenshots/live_cell_before.png',
        clip: { x: boxBefore.x + boxBefore.width * 0.70, y: boxBefore.y, width: boxBefore.width * 0.30, height: boxBefore.height * 0.12 }
    });

    // Run edit
    await page.evaluate(async () => {
        const cluster = window.PdfStudio.pageClusters[1].find(c => c.text.includes('PR.WI'));
        window.PdfStudio.openInPlaceClusterEdit(cluster, 1);
        await window.PdfStudio.applyInPlaceClusterEdit('PR.WI- 02');
    });

    await new Promise(r => setTimeout(r, 500));

    // Hover on .pdf-ann-text
    const annEl = await page.$('.pdf-ann-text');
    if (annEl) await annEl.hover();

    await page.screenshot({
        path: 'reports_p4_screenshots/live_cell_after.png',
        clip: { x: boxBefore.x + boxBefore.width * 0.70, y: boxBefore.y, width: boxBefore.width * 0.30, height: boxBefore.height * 0.12 }
    });

    console.log('Saved live_cell_before.png and live_cell_after.png');
    await browser.close();
})();
