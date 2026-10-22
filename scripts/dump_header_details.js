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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'test-dump' });
    }, pdfBytes.toString('base64'));

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.length >= 8;
        });
        if (ok) break;
    }

    const data = await page.evaluate(() => {
        const layout = window.PdfStudio.pageLayouts[1];
        const clusters = window.PdfStudio.pageClusters[1];
        const hLines = layout.tableLines.hLines.filter(l => l.y < 300);
        const vLines = layout.tableLines.vLines.filter(l => l.x > 800);
        const headerClusters = clusters.filter(c => c.yRatio < 0.12).map(c => ({
            id: c.id,
            text: c.text,
            pixelBox: c.pixelBox,
            cellBounds: c.cellBounds,
            yRatio: c.yRatio,
            xRatio: c.xRatio,
            wRatio: c.wRatio,
            hRatio: c.hRatio
        }));
        return { hLines, vLines, headerClusters };
    });

    console.log('Horizontal lines (y < 300):');
    data.hLines.forEach(l => console.log(`  y=${l.y} x0=${l.x0} x1=${l.x1}`));
    console.log('Vertical lines (x > 800):');
    data.vLines.forEach(l => console.log(`  x=${l.x} y0=${l.y0} y1=${l.y1}`));
    console.log('Header clusters:');
    data.headerClusters.forEach(c => {
        console.log(`  text: "${c.text}" pixelBox:`, JSON.stringify(c.pixelBox), 'cellBounds:', JSON.stringify(c.cellBounds), `yRatio: ${(c.yRatio*100).toFixed(2)}%`);
    });

    await browser.close();
})();
