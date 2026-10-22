const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.addScriptTag({ path: 'js/pdf-lib.min.js' });

    const result = await page.evaluate(async () => {
        const res = await fetch('data/sample_documents/sample_lipovitan_7pages.pdf');
        const buf = await res.arrayBuffer();

        const { PDFDocument } = window.PDFLib;
        const pdfDoc = await PDFDocument.load(buf);
        const p1 = pdfDoc.getPage(0);
        const rawW = p1.getWidth(); // 841.92
        const rawH = p1.getHeight(); // 595.2
        const rot = (p1.getRotation().angle || 0) % 360; // 270

        const displayW = (rot === 90 || rot === 270) ? rawH : rawW;
        const displayH = (rot === 90 || rot === 270) ? rawW : rawH;

        // Simulate an annotation at PR.WI-02 position:
        // In the UI, PR.WI-02 cluster has:
        // xRatio: 0.825, yRatio: 0.038, wRatio: 0.12, hRatio: 0.035
        const ann = {
            xRatio: 0.825,
            yRatio: 0.038,
            wRatio: 0.12,
            hRatio: 0.035,
            text: 'PR.WI- 024'
        };

        const scaleFactor = 2.0;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = Math.round(rawW * scaleFactor);
        exportCanvas.height = Math.round(rawH * scaleFactor);
        const ctx = exportCanvas.getContext('2d');

        // Apply rotation transform
        if (rot === 90) {
            ctx.translate(0, rawH * scaleFactor);
            ctx.rotate(-Math.PI / 2);
        } else if (rot === 180) {
            ctx.translate(rawW * scaleFactor, rawH * scaleFactor);
            ctx.rotate(Math.PI);
        } else if (rot === 270) {
            ctx.translate(rawW * scaleFactor, 0);
            ctx.rotate(Math.PI / 2);
        }
        ctx.scale(scaleFactor, scaleFactor);

        // Draw annotation in display coordinates:
        const x = ann.xRatio * displayW;
        const y = ann.yRatio * displayH;
        const w = ann.wRatio * displayW;
        const h = ann.hRatio * displayH;

        // 1. Draw a whiteout box
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, w, h);

        // 2. Draw text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.textBaseline = 'middle';
        ctx.fillText(ann.text, x + 5, y + h / 2);

        // Embed in PDF
        const pngDataUrl = exportCanvas.toDataURL('image/png');
        const pngImage = await pdfDoc.embedPng(pngDataUrl);

        p1.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: rawW,
            height: rawH
        });

        const savedBytes = await pdfDoc.save();

        // Render back with PDF.js at scale 1.0
        const pdfJsDoc = await window.pdfjsLib.getDocument({ data: savedBytes }).promise;
        const pdfJsPage = await pdfJsDoc.getPage(1);
        const vp = pdfJsPage.getViewport({ scale: 1.0 });
        const testCanvas = document.createElement('canvas');
        testCanvas.width = vp.width;
        testCanvas.height = vp.height;
        const tCtx = testCanvas.getContext('2d');
        await pdfJsPage.render({ canvasContext: tCtx, viewport: vp }).promise;

        // Crop the header cell region around (x, y, w, h)
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = Math.round(w + 20);
        cropCanvas.height = Math.round(h + 20);
        const cCtx = cropCanvas.getContext('2d');
        cCtx.drawImage(testCanvas, Math.round(x - 10), Math.round(y - 10), cropCanvas.width, cropCanvas.height, 0, 0, cropCanvas.width, cropCanvas.height);

        // Also crop the left margin (where the old broken code accidentally drew text)
        const marginCanvas = document.createElement('canvas');
        marginCanvas.width = 100;
        marginCanvas.height = 300;
        const mCtx = marginCanvas.getContext('2d');
        mCtx.drawImage(testCanvas, 0, 200, 100, 300, 0, 0, 100, 300);

        return {
            displayW,
            displayH,
            targetBox: { x, y, w, h },
            cropDataUrl: cropCanvas.toDataURL('image/png'),
            marginDataUrl: marginCanvas.toDataURL('image/png')
        };
    });

    // Save screenshots to verify visually
    if (result.cropDataUrl) {
        fs.writeFileSync('reports_p4_screenshots/verified_header_crop_export.png', Buffer.from(result.cropDataUrl.split(',')[1], 'base64'));
    }
    if (result.marginDataUrl) {
        fs.writeFileSync('reports_p4_screenshots/verified_left_margin_export.png', Buffer.from(result.marginDataUrl.split(',')[1], 'base64'));
    }

    console.log('Test completed successfully! Target box:', result.targetBox);
    await browser.close();
})();
