const fs = require('fs');
const code = fs.readFileSync('js/toeic-diagnostic-workstation.js', 'utf8');
console.log('File length:', code.length);
// Find modal or overlay or render function
const lines = code.split('\n');
lines.slice(0, 100).forEach((l, i) => console.log(`${i+1}: ${l}`));
