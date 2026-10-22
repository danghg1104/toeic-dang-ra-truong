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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test.pdf', noteId: 'debug-prwi' });
    }, pdfBytes.toString('base64'));

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.some(c => c.text.includes('PR.WI'));
        });
        if (ok) break;
    }

    const result = await page.evaluate(async () => {
        const cluster = window.PdfStudio.pageClusters[1].find(c => c.text.includes('PR.WI'));
        console.log('Original cluster:', cluster);

        // Open edit
        window.PdfStudio.openInPlaceClusterEdit(cluster, 1);
        const input = document.getElementById('activeInPlacePdfInput');
        console.log('Input value before edit:', input.value);

        // Apply edit with new text "PR.WI- 02"
        await window.PdfStudio.applyInPlaceClusterEdit("PR.WI- 02");

        const annotations = window.PdfStudio.annotations[1] || [];
        const whiteout = annotations.find(a => a.type === 'mask-whiteout');
        const textAnn = annotations.find(a => a.type === 'scan-text');

        const wrapper = document.getElementById('pdfPageWrapper-1');
        const workingCanvas = window.PdfStudio.pageLayouts[1].canvas;

        const tableTopLineY = 36; // in workingCanvas px
        const tableBottomLineY = 66;

        return {
            clusterPixelBox: cluster.pixelBox,
            clusterCellBounds: cluster.cellBounds,
            workingCanvasSize: { w: workingCanvas.width, h: workingCanvas.height },
            wrapperSize: { w: wrapper.offsetWidth, h: wrapper.offsetHeight },
            whiteoutAnn: whiteout ? {
                xRatio: whiteout.xRatio,
                yRatio: whiteout.yRatio,
                wRatio: whiteout.wRatio,
                hRatio: whiteout.hRatio,
                pixelY0: whiteout.yRatio * workingCanvas.height,
                pixelY1: (whiteout.yRatio + whiteout.hRatio) * workingCanvas.height
            } : null,
            textAnn: textAnn ? {
                xRatio: textAnn.xRatio,
                yRatio: textAnn.yRatio,
                wRatio: textAnn.wRatio,
                hRatio: textAnn.hRatio,
                pixelY0: textAnn.yRatio * workingCanvas.height,
                pixelY1: (textAnn.yRatio + textAnn.hRatio) * workingCanvas.height,
                baselineY: textAnn.baselineY
            } : null,
            tableTopLineY,
            tableBottomLineY
        };
    });

    console.log('=== DEBUG PRWI EDIT RESULT ===');
    console.log(JSON.stringify(result, null, 2));

    // Also take screenshot of page 1 top-right area
    await page.evaluate(() => {
        const wrapper = document.getElementById('pdfPageWrapper-1');
        if (wrapper) wrapper.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));

    // Hover on .pdf-ann-text so we see the dashed outline in the screenshot
    const textEl = await page.$('.pdf-ann-text');
    if (textEl) await textEl.hover();

    const clip = await page.evaluate(() => {
        const wrapper = document.getElementById('pdfPageWrapper-1');
        const rect = wrapper.getBoundingClientRect();
        const w = rect.width > 0 ? rect.width : 800;
        const h = rect.height > 0 ? rect.height : 1100;
        return {
            x: Math.max(0, rect.left + w * 0.70),
            y: Math.max(0, rect.top),
            width: Math.max(10, w * 0.30),
            height: Math.max(10, h * 0.12)
        };
    });

    await page.screenshot({
        path: 'reports_p4_screenshots/debug_prwi_after_edit.png',
        clip
    });
    console.log('Saved debug_prwi_after_edit.png');

    await browser.close();
})();
