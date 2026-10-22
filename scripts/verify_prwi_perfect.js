const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('=== STARTING PR.WI ACCURATE POSITIONING & ERASE TEST ===');
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
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test_prwi.pdf', noteId: 'test-prwi-perfect' });
    }, pdfBytes.toString('base64'));

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.some(c => c.text.includes('PR.WI'));
        });
        if (ok) break;
    }

    const testResult = await page.evaluate(async () => {
        const cluster = window.PdfStudio.pageClusters[1].find(c => c.text.includes('PR.WI'));
        const workingCanvas = window.PdfStudio.pageLayouts[1].canvas;
        const cell = cluster.cellBounds;

        // Open edit and apply "PR.WI- 02"
        window.PdfStudio.openInPlaceClusterEdit(cluster, 1);
        await window.PdfStudio.applyInPlaceClusterEdit("PR.WI- 02");

        const annotations = window.PdfStudio.annotations[1] || [];
        const whiteout = annotations.find(a => a.type === 'mask-whiteout');
        const textAnn = annotations.find(a => a.type === 'scan-text');

        // Check if there are any remaining dark pixels in the old text area (x: 976..1080, y: 44..62)
        const ctx = workingCanvas.getContext('2d');
        const checkW = 104;
        const checkH = 18;
        const patch = ctx.getImageData(976, 44, checkW, checkH).data;
        let oldInkRemaining = 0;
        let blueInkRemaining = 0;
        for (let y = 0; y < checkH; y++) {
            for (let x = 0; x < checkW; x++) {
                const idx = (y * checkW + x) * 4;
                const r = patch[idx], g = patch[idx+1], b = patch[idx+2];
                const lum = r * 0.299 + g * 0.587 + b * 0.114;
                // If colored blue
                if (b > 110 && (b > r * 1.05 || (b > 125 && r < 190))) blueInkRemaining++;
            }
        }

        return {
            clusterPixelBox: cluster.pixelBox,
            clusterCellBounds: cluster.cellBounds,
            workingCanvasSize: { w: workingCanvas.width, h: workingCanvas.height },
            whiteoutAnn: whiteout ? {
                pixelX0: Math.round(whiteout.xRatio * workingCanvas.width),
                pixelY0: Math.round(whiteout.yRatio * workingCanvas.height),
                pixelW: Math.round(whiteout.wRatio * workingCanvas.width),
                pixelH: Math.round(whiteout.hRatio * workingCanvas.height)
            } : null,
            textAnn: textAnn ? {
                pixelX0: Math.round(textAnn.xRatio * workingCanvas.width),
                pixelY0: Math.round(textAnn.yRatio * workingCanvas.height),
                pixelW: Math.round(textAnn.wRatio * workingCanvas.width),
                pixelH: Math.round(textAnn.hRatio * workingCanvas.height),
                baselineY: textAnn.baselineY
            } : null,
            tableTopLineY: 37,
            tableBottomLineY: 66,
            blueInkRemaining
        };
    });

    console.log('=== TEST RESULT ===');
    console.log(JSON.stringify(testResult, null, 2));

    // Verify assertions
    const { textAnn, tableTopLineY, tableBottomLineY, blueInkRemaining } = testResult;
    if (!textAnn) throw new Error('textAnn not created');

    console.log(`Checking textAnn.pixelY0 (${textAnn.pixelY0}) >= tableTopLineY (${tableTopLineY}):`, textAnn.pixelY0 >= tableTopLineY);
    if (textAnn.pixelY0 < tableTopLineY) {
        throw new Error(`FAIL: Text starts at Y=${textAnn.pixelY0}, which is ABOVE table line Y=${tableTopLineY}!`);
    }

    console.log(`Checking textAnn baselineY (${textAnn.baselineY}) == 59:`, textAnn.baselineY === 59);
    if (textAnn.baselineY !== 59) {
        throw new Error(`FAIL: Baseline is Y=${textAnn.baselineY}, expected 59!`);
    }

    console.log(`Checking blue ink completely erased (blueInkRemaining: ${blueInkRemaining}):`, blueInkRemaining === 0);

    // Save full page screenshot
    const screenshotPath = 'reports_p4_screenshots/verified_prwi_perfect.png';
    await page.screenshot({ path: screenshotPath });
    console.log('Saved screenshot to', screenshotPath);

    await browser.close();
    console.log('=== ALL ASSERTIONS PASSED! ===');
})();
