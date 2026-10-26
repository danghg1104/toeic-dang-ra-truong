const fs = require('fs');
const path = require('path');

const targetPdf = path.join('C:', 'Users', 'Admin', 'Downloads', 'sách lớp 3', 'thuvienhoclieu.com-SGK-Tieng-anh-3-Global-Success-Tap-1.pdf');
console.log('PDF Path:', targetPdf);
console.log('Exists:', fs.existsSync(targetPdf));
if (!fs.existsSync(targetPdf)) {
    console.error('File not found');
    process.exit(1);
}

const stats = fs.statSync(targetPdf);
console.log('File size:', stats.size, 'bytes (~' + (stats.size / 1024 / 1024).toFixed(2) + ' MB)');

// Let's use pdfjs-dist if available, or pdf-parse
let pdfjsLib;
try {
    pdfjsLib = require('pdfjs-dist');
} catch (e) {
    try {
        pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    } catch(e2) {
        console.log('pdfjs-dist not directly requireable, searching node_modules...');
    }
}

async function run() {
    // Read first few KB to check PDF header and objects
    const fd = fs.openSync(targetPdf, 'r');
    const buf = Buffer.alloc(4096);
    fs.readSync(fd, buf, 0, 4096, 0);
    fs.closeSync(fd);
    console.log('PDF Header:', buf.slice(0, 50).toString());

    // Search for text vs image streams in PDF
    const fullBuffer = fs.readFileSync(targetPdf);
    console.log('Buffer read into memory. Searching keywords in raw bytes...');
    
    // Check occurrence of /Font, /Text, /Image, /DCTDecode, /JPXDecode, /FlateDecode
    const str = fullBuffer.toString('latin1');
    const fontMatches = (str.match(/\/Font\b/g) || []).length;
    const imageMatches = (str.match(/\/Subtype\s*\/Image\b/g) || []).length;
    const dctMatches = (str.match(/\/DCTDecode\b/g) || []).length;
    console.log('/Font count:', fontMatches);
    console.log('/Image count:', imageMatches);
    console.log('/DCTDecode count:', dctMatches);

    // Let's see if there are any Text operators like Tj, TJ, BT, ET
    const btMatches = (str.match(/\bBT\b/g) || []).length;
    console.log('BT (Begin Text) count:', btMatches);

    // Let's sample what text BT contains
    const btRegex = /BT[\s\S]*?ET/g;
    let match;
    let count = 0;
    console.log('Sample BT...ET text blocks:');
    while ((match = btRegex.exec(str)) !== null && count < 10) {
        count++;
        console.log(`--- Block #${count} ---`);
        console.log(match[0].slice(0, 300));
    }
}

run().catch(console.error);
