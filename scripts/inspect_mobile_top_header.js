const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('toggleMobileSidebar'));
console.log('toggleMobileSidebar at line:', idx + 1);
console.log(lines.slice(idx - 5, idx + 25).join('\n'));
