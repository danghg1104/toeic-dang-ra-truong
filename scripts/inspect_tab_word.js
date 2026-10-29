const fs = require('fs');
const code = fs.readFileSync('js/vocabulary-module.js', 'utf8');
const lines = code.split('\n');

const idx = lines.findIndex(l => l.includes('renderTabWordHtml('));
console.log('renderTabWordHtml at line:', idx + 1);
console.log(lines.slice(idx, idx + 50).join('\n'));
