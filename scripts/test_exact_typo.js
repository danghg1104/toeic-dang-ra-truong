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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'test-exact-typo' });
    }, pdfBytes.toString('base64'));

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.some(c => c.text.includes('PR.WI'));
        });
        if (ok) break;
    }

    const debugInfo = await page.evaluate(() => {
        const cluster = window.PdfStudio.pageClusters[1].find(c => c.text.includes('PR.WI'));
        const canvas = window.PdfStudio.pageLayouts[1].canvas;
        const ctx = canvas.getContext('2d');
        const box = cluster.pixelBox;
        const cell = cluster.cellBounds;

        const W = canvas.width;
        const H = canvas.height;
        const x0 = Math.max(0, box.x0);
        const y0 = Math.max(0, box.y0);
        const x1 = Math.min(W, box.x1);
        const y1 = Math.min(H, box.y1);
        const bw = x1 - x0;
        const bh = y1 - y0;

        const patch = ctx.getImageData(x0, y0, bw, bh).data;
        const rowInk = new Int32Array(bh);
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const idx = (y * bw + x) * 4;
                const lum = patch[idx] * 0.299 + patch[idx + 1] * 0.587 + patch[idx + 2] * 0.114;
                if (lum < 165) rowInk[y]++;
            }
        }

        let firstInkRow = 0;
        while (firstInkRow < bh && rowInk[firstInkRow] === 0) firstInkRow++;
        let lastInkRow = bh - 1;
        while (lastInkRow >= 0 && rowInk[lastInkRow] === 0) lastInkRow--;

        let baseRow = lastInkRow;
        let maxRowInk = 0;
        for (let y = firstInkRow; y <= lastInkRow; y++) {
            if (rowInk[y] > maxRowInk) maxRowInk = rowInk[y];
        }
        for (let y = lastInkRow; y >= firstInkRow + (lastInkRow - firstInkRow) * 0.5; y--) {
            if (rowInk[y] >= maxRowInk * 0.25) {
                baseRow = y;
                break;
            }
        }

        return {
            box,
            cell,
            firstInkRow,
            lastInkRow,
            baseRow,
            measuredBaselineY: y0 + baseRow,
            measuredCapHeight: Math.max(10, baseRow - firstInkRow),
            rowInk: Array.from(rowInk)
        };
    });

    console.log('=== EXACT TYPO DEBUG ===');
    console.log(JSON.stringify(debugInfo, null, 2));

    await browser.close();
})();
