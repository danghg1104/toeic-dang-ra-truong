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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'debug-inpaint' });
    }, pdfBytes.toString('base64'));

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.some(c => c.text.includes('PR.WI'));
        });
        if (ok) break;
    }

    const inpaintDebug = await page.evaluate(async () => {
        const cluster = window.PdfStudio.pageClusters[1].find(c => c.text.includes('PR.WI'));
        const workingCanvas = window.PdfStudio.pageLayouts[1].canvas;
        const cell = cluster.cellBounds;

        // Save canvas crop BEFORE edit
        const beforeCrop = document.createElement('canvas');
        beforeCrop.width = cell.x1 - cell.x0;
        beforeCrop.height = cell.y1 - cell.y0;
        beforeCrop.getContext('2d').drawImage(workingCanvas, cell.x0, cell.y0, beforeCrop.width, beforeCrop.height, 0, 0, beforeCrop.width, beforeCrop.height);

        // Run applyInPlaceClusterEdit
        window.PdfStudio.openInPlaceClusterEdit(cluster, 1);
        await window.PdfStudio.applyInPlaceClusterEdit("PR.WI- 02");

        // Save canvas crop AFTER edit
        const afterCrop = document.createElement('canvas');
        afterCrop.width = cell.x1 - cell.x0;
        afterCrop.height = cell.y1 - cell.y0;
        afterCrop.getContext('2d').drawImage(workingCanvas, cell.x0, cell.y0, afterCrop.width, afterCrop.height, 0, 0, afterCrop.width, afterCrop.height);

        const annotations = window.PdfStudio.annotations[1] || [];
        const whiteout = annotations.find(a => a.type === 'mask-whiteout');
        const textAnn = annotations.find(a => a.type === 'scan-text');

        return {
            beforePng: beforeCrop.toDataURL('image/png'),
            afterPng: afterCrop.toDataURL('image/png'),
            maskDataUrl: whiteout ? whiteout.maskDataUrl : null,
            textPng: textAnn ? textAnn.pngDataUrl : null,
            textAnn
        };
    });

    fs.writeFileSync('reports_p4_screenshots/prwi_cell_before.png', inpaintDebug.beforePng.replace(/^data:image\/png;base64,/, ''), 'base64');
    fs.writeFileSync('reports_p4_screenshots/prwi_cell_after.png', inpaintDebug.afterPng.replace(/^data:image\/png;base64,/, ''), 'base64');
    if (inpaintDebug.maskDataUrl) {
        fs.writeFileSync('reports_p4_screenshots/prwi_mask.png', inpaintDebug.maskDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
    }
    if (inpaintDebug.textPng) {
        fs.writeFileSync('reports_p4_screenshots/prwi_text.png', inpaintDebug.textPng.replace(/^data:image\/png;base64,/, ''), 'base64');
    }

    console.log('Saved prwi_cell_before.png, prwi_cell_after.png, prwi_mask.png, prwi_text.png');
    await browser.close();
})();
