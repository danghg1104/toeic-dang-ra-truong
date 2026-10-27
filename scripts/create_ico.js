const fs = require('fs');
const path = require('path');

// Generates a valid Windows .ico file containing PNG-compressed images
function createIcoFromPngs(pngBuffers, outputPath) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // Number of images

  let offset = 6 + (16 * pngBuffers.length);
  const dirEntries = [];
  const imageBuffers = [];

  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    dirEntries.push(entry);
    imageBuffers.push(buffer);
    offset += buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...imageBuffers]);
  fs.writeFileSync(outputPath, icoBuffer);
  console.log('Created ICO at:', outputPath, 'Total bytes:', icoBuffer.length);
}

module.exports = { createIcoFromPngs };
