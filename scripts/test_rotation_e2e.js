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
        // Load sample PDF
        const res = await fetch('data/sample_documents/sample_lipovitan_7pages.pdf');
        const buf = await res.arrayBuffer();

        const { PDFDocument, degrees } = window.PDFLib;
        const pdfDoc = await PDFDocument.load(buf);
        const p1 = pdfDoc.getPage(0);
        const rawW = p1.getWidth(); // 841.92
        const rawH = p1.getHeight(); // 595.2
        const rot = (p1.getRotation().angle || 0) % 360; // 270

        const displayW = (rot === 90 || rot === 270) ? rawH : rawW;
        const displayH = (rot === 90 || rot === 270) ? rawW : rawH;

        // Target spot in display coordinates:
        // xd = Math.round(displayW * 0.85) = ~506
        // yd = Math.round(displayH * 0.04) = ~34
        // wd = 80, hd = 25
        const targetX = Math.round(displayW * 0.85);
        const targetY = Math.round(displayH * 0.04);
        const targetW = 80;
        const targetH = 25;

        const tests = [
            {
                name: '1. Canvas transform: translate(0, rawH), rotate(-Math.PI/2)',
                setup: (ctx) => { ctx.translate(0, rawH); ctx.rotate(-Math.PI / 2); }
            },
            {
                name: '2. Canvas transform: translate(rawW, 0), rotate(Math.PI/2)',
                setup: (ctx) => { ctx.translate(rawW, 0); ctx.rotate(Math.PI / 2); }
            },
            {
                name: '3. Canvas transform: translate(rawW, rawH), rotate(Math.PI)',
                setup: (ctx) => { ctx.translate(rawW, rawH); ctx.rotate(Math.PI); }
            },
            {
                name: '4. Canvas transform: rotate(0) [CURRENT BROKEN CODE]',
                setup: (ctx) => {}
            },
            {
                name: '5. PDF-Lib drawImage rotate: degrees(270) at (0, rawH)',
                usePdfLibRotate: 270
            },
            {
                name: '6. PDF-Lib drawImage rotate: degrees(90) at (rawW, 0)',
                usePdfLibRotate: 90
            }
        ];

        const results = [];

        for (const t of tests) {
            const docCopy = await PDFDocument.load(buf);
            const p = docCopy.getPage(0);

            let pngImg;
            if (t.usePdfLibRotate) {
                const c = document.createElement('canvas');
                c.width = Math.round(displayW);
                c.height = Math.round(displayH);
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(targetX, targetY, targetW, targetH);
                const pngB64 = c.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
                pngImg = await docCopy.embedPng(pngB64);
                
                if (t.usePdfLibRotate === 270) {
                    p.drawImage(pngImg, {
                        x: 0,
                        y: rawH,
                        width: displayW,
                        height: displayH,
                        rotate: degrees(270)
                    });
                } else if (t.usePdfLibRotate === 90) {
                    p.drawImage(pngImg, {
                        x: rawW,
                        y: 0,
                        width: displayW,
                        height: displayH,
                        rotate: degrees(90)
                    });
                }
            } else {
                const c = document.createElement('canvas');
                c.width = Math.round(rawW);
                c.height = Math.round(rawH);
                const ctx = c.getContext('2d');
                t.setup(ctx);
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(targetX, targetY, targetW, targetH);
                const pngB64 = c.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
                pngImg = await docCopy.embedPng(pngB64);
                p.drawImage(pngImg, {
                    x: 0,
                    y: 0,
                    width: rawW,
                    height: rawH
                });
            }

            const savedBytes = await docCopy.save();

            // Render with PDF.js
            const pdfJsDoc = await window.pdfjsLib.getDocument({ data: savedBytes }).promise;
            const pdfJsPage = await pdfJsDoc.getPage(1);
            const vp = pdfJsPage.getViewport({ scale: 1.0 });
            const testCanvas = document.createElement('canvas');
            testCanvas.width = vp.width;
            testCanvas.height = vp.height;
            const tCtx = testCanvas.getContext('2d');
            await pdfJsPage.render({ canvasContext: tCtx, viewport: vp }).promise;

            const idata = tCtx.getImageData(0, 0, vp.width, vp.height).data;
            let minX = 9999, maxX = -1, minY = 9999, maxY = -1, count = 0;
            for (let y = 0; y < vp.height; y++) {
                for (let x = 0; x < vp.width; x++) {
                    const idx = (y * vp.width + x) * 4;
                    if (idata[idx] > 200 && idata[idx+1] < 50 && idata[idx+2] > 200) {
                        count++;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            results.push({
                test: t.name,
                count,
                box: count > 0 ? { minX, maxX, minY, maxY } : null,
                target: {
                    expectedX: targetX,
                    expectedY: targetY,
                    expectedW: targetW,
                    expectedH: targetH
                }
            });
        }

        return results;
    });

    console.log('Results:\n', JSON.stringify(result, null, 2));
    await browser.close();
})();
