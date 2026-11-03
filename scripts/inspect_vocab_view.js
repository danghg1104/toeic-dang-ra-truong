const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('id="view-tu-vung"'));
console.log('view-tu-vung at line:', start + 1);
console.log(lines.slice(start, start + 60).join('\n'));
