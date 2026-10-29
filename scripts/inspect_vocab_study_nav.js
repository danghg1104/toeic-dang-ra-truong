const fs = require('fs');
const code = fs.readFileSync('js/vocabulary-module.js', 'utf8');
const lines = code.split('\n');

const idx = lines.findIndex(l => l.includes('showStudyView('));
console.log(lines.slice(idx, idx + 45).join('\n'));
