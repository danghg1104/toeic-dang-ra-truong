const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'pdf-lib.min.js'), 'utf8');
const ctx = {
    window: {},
    console,
    Uint8Array,
    ArrayBuffer,
    Array,
    Promise,
    Math,
    String,
    Object,
    Buffer,
    setTimeout,
    clearTimeout
};
vm.createContext(ctx);
vm.runInContext(code, ctx);
const { PDFDocument } = ctx.PDFLib;

(async () => {
    try {
        const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
        const pdfBuf = fs.readFileSync(pdfPath);
        const doc = await PDFDocument.load(pdfBuf);
        
        console.log('Original PDF Page count:', doc.getPageCount());
        const pages = doc.getPages();
        const page1 = pages[0];
        console.log('Page 1 dimensions:', page1.getWidth(), 'x', page1.getHeight());

        // 1x1 transparent PNG
        const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        const img = await doc.embedPng(transparentPng);
        
        page1.drawImage(img, {
            x: 0,
            y: 0,
            width: page1.getWidth(),
            height: page1.getHeight()
        });

        const saved = await doc.save();
        console.log('Saved modified 7-page PDF. Total bytes:', saved.length);

        // Reload to verify it's a completely valid PDF
        const reloaded = await PDFDocument.load(saved);
        console.log('Reloaded PDF Page count:', reloaded.getPageCount());
        console.log('Reloaded Page 1 dimensions:', reloaded.getPages()[0].getWidth(), 'x', reloaded.getPages()[0].getHeight());
        console.log('TEST RESULT: SUCCESS');
    } catch (err) {
        console.error('TEST ERROR:', err);
        process.exit(1);
    }
})();
