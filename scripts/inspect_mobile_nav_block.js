const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const start = lines.findIndex(l => l.includes('id="mobileBottomNav"'));
console.log('mobileBottomNav at line:', start + 1);
console.log(lines.slice(start, start + 30).join('\n'));
