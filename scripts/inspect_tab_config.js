const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('const tabConfig ='));
console.log('tabConfig at line:', idx + 1);
console.log(lines.slice(idx, idx + 50).join('\n'));
