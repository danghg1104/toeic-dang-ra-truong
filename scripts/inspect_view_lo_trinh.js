const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('id="view-lo-trinh"') || l.includes("id='view-lo-trinh'"));
console.log('view-lo-trinh at line:', idx + 1);
console.log(lines.slice(idx, idx + 50).join('\n'));
