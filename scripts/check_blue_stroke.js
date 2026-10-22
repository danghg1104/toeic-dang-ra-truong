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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'test-blue' });
    }, pdfBytes.toString('base64'));

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.some(c => c.text.includes('PR.WI'));
        });
        if (ok) break;
    }

    const bluePixels = await page.evaluate(() => {
        const canvas = window.PdfStudio.pageLayouts[1].canvas;
        const ctx = canvas.getContext('2d');
        const img = ctx.getImageData(1065, 40, 30, 24).data;
        const samples = [];
        for (let y = 0; y < 24; y++) {
            for (let x = 0; x < 30; x++) {
                const idx = (y * 30 + x) * 4;
                const r = img[idx], g = img[idx+1], b = img[idx+2];
                const lum = r * 0.299 + g * 0.587 + b * 0.114;
                if (lum < 220) {
                    samples.push({ x: 1065 + x, y: 40 + y, r, g, b, lum, isBlueCondition: (b > 115 && b > r * 1.15 && b > g * 1.08) });
                }
            }
        }
        return samples;
    });

    console.log('Total non-white pixels in blue stroke area:', bluePixels.length);
    console.log('Sample pixels from stroke:');
    bluePixels.slice(0, 15).forEach(p => console.log('  (' + p.x + ', ' + p.y + '): rgb(' + p.r + ',' + p.g + ',' + p.b + ') lum=' + p.lum.toFixed(1) + ' matchIsBlue=' + p.isBlueCondition));

    await browser.close();
})();
