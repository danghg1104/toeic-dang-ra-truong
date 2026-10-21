const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('--- Starting Page 1 Diagnosis Script ---');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Read the 7-page PDF file
    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    console.log('Opening sample_lipovitan_7pages.pdf in PdfStudio...');

    const diagResult = await page.evaluate(async (base64) => {
        // Convert base64 to ArrayBuffer
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const arrayBuffer = bytes.buffer;

        // Open in PdfStudio
        await window.PdfStudio.openPdf(arrayBuffer, {
            fileName: 'sample_lipovitan_7pages.pdf',
            noteId: 'test-note'
        });

        // Wait for page 1 render
        await new Promise(r => setTimeout(r, 1500));

        const p1Wrapper = document.getElementById('pdfPageWrapper-1');
        const canvas1 = document.getElementById('pdfCanvas-1');

        return {
            numPages: window.PdfStudio.numPages,
            isScanned: window.PdfStudio.isScannedPdf,
            wrapperW: p1Wrapper ? p1Wrapper.offsetWidth : 0,
            wrapperH: p1Wrapper ? p1Wrapper.offsetHeight : 0,
            canvasW: canvas1 ? canvas1.width : 0,
            canvasH: canvas1 ? canvas1.height : 0
        };
    }, pdfBase64);

    console.log('Diagnosis Result:', diagResult);
    await browser.close();
    console.log('--- Diagnosis Finished ---');
})();
