const fs = require('fs');
const code = fs.readFileSync('js/app-tour-guide.js', 'utf8');
console.log('File length:', code.length);

const lines = code.split('\n');
lines.slice(0, 100).forEach((l, i) => console.log(`${i+1}: ${l}`));
