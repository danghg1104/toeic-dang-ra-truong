const fs = require('fs');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer-core');

const code = fs.readFileSync('js/pdf-lib.min.js', 'utf8');
const ctx = { window: {}, console, Uint8Array, ArrayBuffer, Array, Promise, Math, String, Object, Buffer, setTimeout, clearTimeout };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const { PDFDocument, degrees } = ctx.PDFLib;

(async () => {
    const bytes = fs.readFileSync('data/sample_documents/sample_lipovitan_7pages.pdf');
    const doc = await PDFDocument.load(bytes);
    const p1 = doc.getPage(0);
    const rawW = p1.getWidth(); // 841.92
    const rawH = p1.getHeight(); // 595.2
    const rot = (p1.getRotation().angle || 0) % 360; // 270

    console.log(`Page 1: rawW=${rawW}, rawH=${rawH}, rot=${rot}`);

    // In display portrait: width is 595.2, height is 841.92
    const displayW = (rot === 90 || rot === 270) ? rawH : rawW;
    const displayH = (rot === 90 || rot === 270) ? rawW : rawH;

    console.log(`Display portrait: displayW=${displayW}, displayH=${displayH}`);

    // Let's create an image with a solid magenta square in the top-right corner in display space:
    // x: displayW - 120 .. displayW - 20 (xRatio: 0.80 .. 0.96)
    // y: 20 .. 80 (yRatio: 0.024 .. 0.095)
    // This is EXACTLY where PR.WI-02 is!
    const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const pngBase64 = await page.evaluate((dW, dH) => {
        const c = document.createElement('canvas');
        c.width = Math.round(dW);
        c.height = Math.round(dH);
        const ctx = c.getContext('2d');
        // Clear transparent
        ctx.clearRect(0, 0, c.width, c.height);
        // Draw solid bright magenta marker at the PR.WI cell position
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(Math.round(dW * 0.81), Math.round(dH * 0.024), Math.round(dW * 0.13), Math.round(dH * 0.035));
        return c.toDataURL('image/png');
    }, displayW, displayH);

    const pngImg = await doc.embedPng(pngBase64.replace(/^data:image\/png;base64,/, ''));

    // Now, how to place pngImg (which is displayW x displayH) onto p1?
    // Let's test the transformation for rot:
    // When rot === 270:
    // If we rotate the image by degrees(270) or degrees(90):
    // In pdf-lib, drawImage rotates counter-clockwise or clockwise?
    // Let's test!
    if (rot === 270) {
        // If image is displayW x displayH:
        // Rotating by 270 counter-clockwise:
        // The image origin (0, 0) in canvas is TOP-LEFT in display.
        // In PDF coordinates:
        // Let's draw with:
        p1.drawImage(pngImg, {
            x: 0,
            y: rawH,
            width: displayW,
            height: displayH,
            rotate: degrees(270)
        });
    }

    const testPdfBytes = await doc.save();
    fs.writeFileSync('reports_p4_screenshots/test_rotation_270.pdf', testPdfBytes);
    console.log('Saved test_rotation_270.pdf');

    // Now render page 1 of test_rotation_270.pdf in browser using PDF.js and check where the magenta pixel lands!
    await page.goto('http://localhost:3000');
    const renderedResult = await page.evaluate(async (b64) => {
        const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        const pdf = await window.pdfjsLib.getDocument({ data: bin }).promise;
        const p = await pdf.getPage(1);
        const viewport = p.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await p.render({ canvasContext: ctx, viewport }).promise;

        // Check if there are magenta pixels (r > 200, g < 50, b > 200)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const magentaPixels = [];
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const idx = (y * canvas.width + x) * 4;
                if (imgData[idx] > 200 && imgData[idx+1] < 50 && imgData[idx+2] > 200) {
                    magentaPixels.push({ x, y });
                }
            }
        }
        return {
            viewport: { w: viewport.width, h: viewport.height },
            magentaCount: magentaPixels.length,
            sample: magentaPixels.slice(0, 5),
            minX: magentaPixels.length > 0 ? Math.min(...magentaPixels.map(p => p.x)) : -1,
            maxX: magentaPixels.length > 0 ? Math.max(...magentaPixels.map(p => p.x)) : -1,
            minY: magentaPixels.length > 0 ? Math.min(...magentaPixels.map(p => p.y)) : -1,
            maxY: magentaPixels.length > 0 ? Math.max(...magentaPixels.map(p => p.y)) : -1
        };
    }, Buffer.from(testPdfBytes).toString('base64'));

    console.log('Rendered Result in PDF.js viewport:', renderedResult);
    console.log('Expected magenta box around x: ~480..560, y: ~20..50');

    await browser.close();
})();
