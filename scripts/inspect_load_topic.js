const fs = require('fs');
const code = fs.readFileSync('js/grammar-module.js', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(330, 375).join('\n'));
