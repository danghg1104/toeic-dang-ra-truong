const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('=== STARTING COMPLETE PDF EXPORT VERIFICATION TEST ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1280,1024']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    // Ensure reports dir exists
    const reportsDir = path.join(__dirname, '..', 'reports_p4_screenshots');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
        if (typeof window.switchAppTab === 'function') window.switchAppTab('tailieu');
    });

    const pdfPath = path.join('data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    await page.evaluate(async (b64) => {
        const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'sample_lipovitan_7pages.pdf', noteId: 'test-export-verification' });
    }, pdfBytes.toString('base64'));

    console.log('Waiting for layout analysis & clusters on page 1...');
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const ok = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.some(c => c.text.includes('PR.WI'));
        });
        if (ok) {
            console.log(`Page 1 ready in ~${i+1}s`);
            break;
        }
    }

    // Edit PR.WI cluster to "PR.WI- 024"
    console.log('Editing PR.WI cluster to "PR.WI- 024"...');
    const editResult = await page.evaluate(async () => {
        const cluster = window.PdfStudio.pageClusters[1].find(c => c.text.includes('PR.WI'));
        window.PdfStudio.openInPlaceClusterEdit(cluster, 1);
        await window.PdfStudio.applyInPlaceClusterEdit("PR.WI- 024");
        return {
            clusterText: cluster.text,
            annotations: window.PdfStudio.annotations[1]
        };
    });
    console.log('Edit applied. Annotations count on page 1:', editResult.annotations.length);

    // Call exportPdf()
    console.log('Calling exportPdf()...');
    const exportResult = await page.evaluate(async () => {
        const exportedBytes = await window.PdfStudio.exportPdf();
        // Convert exportedBytes to base64
        let binary = '';
        const bytes = new Uint8Array(exportedBytes);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    });

    const exportedPdfBuffer = Buffer.from(exportResult, 'base64');
    const exportedPdfPath = path.join(reportsDir, 'exported_sample_lipovitan_7pages.pdf');
    fs.writeFileSync(exportedPdfPath, exportedPdfBuffer);
    console.log(`Saved exported PDF: ${exportedPdfPath} (${exportedPdfBuffer.length} bytes)`);

    // Verify the exported PDF with PDF.js
    console.log('Rendering exported PDF with PDF.js to verify page 1 visual rendering...');
    const verification = await page.evaluate(async (pdfB64) => {
        const bin = Uint8Array.from(atob(pdfB64), c => c.charCodeAt(0));
        const pdf = await window.pdfjsLib.getDocument({ data: bin }).promise;
        const numPages = pdf.numPages;

        const p1 = await pdf.getPage(1);
        const scale = 2.0;
        const vp = p1.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext('2d');
        await p1.render({ canvasContext: ctx, viewport: vp }).promise;

        // Header table crop (top 15% of page)
        const headerCanvas = document.createElement('canvas');
        headerCanvas.width = canvas.width;
        headerCanvas.height = Math.round(canvas.height * 0.15);
        const hCtx = headerCanvas.getContext('2d');
        hCtx.drawImage(canvas, 0, 0, canvas.width, headerCanvas.height, 0, 0, canvas.width, headerCanvas.height);

        // PR.WI cell crop (x: ~80%..98%, y: ~2.5%..6.5%)
        const cellCanvas = document.createElement('canvas');
        const cellX = Math.round(canvas.width * 0.80);
        const cellY = Math.round(canvas.height * 0.024);
        const cellW = Math.round(canvas.width * 0.18);
        const cellH = Math.round(canvas.height * 0.045);
        cellCanvas.width = cellW;
        cellCanvas.height = cellH;
        const cCtx = cellCanvas.getContext('2d');
        cCtx.drawImage(canvas, cellX, cellY, cellW, cellH, 0, 0, cellW, cellH);

        // Left margin crop (x: 0..10%, y: 15%..50%)
        const marginCanvas = document.createElement('canvas');
        const marginX = 0;
        const marginY = Math.round(canvas.height * 0.15);
        const marginW = Math.round(canvas.width * 0.12);
        const marginH = Math.round(canvas.height * 0.35);
        marginCanvas.width = marginW;
        marginCanvas.height = marginH;
        const mCtx = marginCanvas.getContext('2d');
        mCtx.drawImage(canvas, marginX, marginY, marginW, marginH, 0, 0, marginW, marginH);

        // Check darkness/ink in left margin: should be near zero (pure white or faint scanner background, no text)
        const mData = mCtx.getImageData(0, 0, marginW, marginH).data;
        let marginDarkPixels = 0;
        for (let i = 0; i < mData.length; i += 4) {
            const r = mData[i], g = mData[i+1], b = mData[i+2];
            if (r < 100 && g < 100 && b < 100) marginDarkPixels++;
        }

        return {
            numPages,
            page1Width: vp.width / scale,
            page1Height: vp.height / scale,
            headerCropDataUrl: headerCanvas.toDataURL('image/png'),
            cellCropDataUrl: cellCanvas.toDataURL('image/png'),
            marginCropDataUrl: marginCanvas.toDataURL('image/png'),
            marginDarkPixels
        };
    }, exportResult);

    console.log(`Exported PDF has ${verification.numPages} pages (expected 7).`);
    console.log(`Page 1 display dimensions: ${verification.page1Width} x ${verification.page1Height}`);
    console.log(`Left margin dark pixel count: ${verification.marginDarkPixels} (expected 0 misplaced text)`);

    // Save screenshots
    fs.writeFileSync(path.join(reportsDir, 'exported_pdf_page1_header.png'), Buffer.from(verification.headerCropDataUrl.split(',')[1], 'base64'));
    fs.writeFileSync(path.join(reportsDir, 'exported_pdf_prwi_cell.png'), Buffer.from(verification.cellCropDataUrl.split(',')[1], 'base64'));
    fs.writeFileSync(path.join(reportsDir, 'exported_pdf_left_margin.png'), Buffer.from(verification.marginCropDataUrl.split(',')[1], 'base64'));

    if (verification.numPages !== 7) {
        throw new Error(`FAIL: Page count is ${verification.numPages}, expected 7!`);
    }
    if (verification.marginDarkPixels > 50) {
        throw new Error(`FAIL: Left margin contains ${verification.marginDarkPixels} dark pixels, indicating misplaced text/mask!`);
    }

    console.log('=== TEST COMPLETED SUCCESSFULLY! ALL CHECKS PASSED! ===');
    await browser.close();
})();
