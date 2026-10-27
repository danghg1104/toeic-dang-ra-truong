const fs = require('fs');
const path = require('path');
const { createIcoFromPngs } = require('./create_ico');

const sizes = [16, 32, 48, 64, 128, 256];
const pngBuffers = sizes.map(s => {
  const p = path.join(__dirname, '..', 'scratch', 'ico_sizes', `icon-${s}.png`);
  return {
    width: s,
    height: s,
    buffer: fs.readFileSync(p)
  };
});

const outIco1 = path.join(__dirname, '..', 'favicon.ico');
const outIco2 = path.join(__dirname, '..', 'app.ico');

createIcoFromPngs(pngBuffers, outIco1);
createIcoFromPngs(pngBuffers, outIco2);

console.log('Built favicon.ico and app.ico successfully!');
