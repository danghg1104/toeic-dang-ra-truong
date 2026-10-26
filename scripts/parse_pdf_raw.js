const fs = require('fs');
const zlib = require('zlib');

const pdfPath = 'c:\\Users\\Admin\\Downloads\\từ điển\\AMA Quang Ngai - The Oxford Picture Dictionary English-Vietnamese.PDF';
console.log('Reading file...');
const buf = fs.readFileSync(pdfPath);

console.log('File read, size:', (buf.length / 1024 / 1024).toFixed(2), 'MB');

// Look for streams with /FlateDecode and decompress them
let streamCount = 0;
let textStreamCount = 0;
let extractedTextPieces = [];

let pos = 0;
while (pos < buf.length && streamCount < 200) {
  const streamStart = buf.indexOf('stream\r\n', pos);
  if (streamStart === -1) {
    const altStart = buf.indexOf('stream\n', pos);
    if (altStart === -1) break;
    pos = altStart + 7;
  } else {
    pos = streamStart + 8;
  }

  const streamEnd = buf.indexOf('endstream', pos);
  if (streamEnd === -1) break;

  const rawStream = buf.slice(pos, streamEnd);
  streamCount++;

  try {
    const uncompressed = zlib.inflateSync(rawStream);
    const uncompressedStr = uncompressed.toString('latin1');
    if (uncompressedStr.includes('BT') && uncompressedStr.includes('ET')) {
      textStreamCount++;
      // Extract text in parentheses ( ... ) Tj or TJ
      const matches = uncompressedStr.match(/\((.*?)\)\s*Tj/g) || [];
      if (matches.length > 0) {
        const words = matches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
        extractedTextPieces.push(words);
      }
    }
  } catch(e) {
    // Not a zlib compressed stream or image stream
  }

  pos = streamEnd + 9;
}

console.log({ streamCount, textStreamCount, sampleExtractedCount: extractedTextPieces.length });
if (extractedTextPieces.length > 0) {
  console.log('First 5 text pieces:');
  extractedTextPieces.slice(0, 5).forEach((p, idx) => console.log(`[${idx}]:`, p.slice(0, 200)));
} else {
  console.log('No text in first 200 streams. Let us check if this is an image-scanned book.');
}
