const fs = require('fs');
const content = fs.readFileSync('js/dailydictation-workstation.js', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(l => l.includes('TRẠM LUYỆN NGHE') || l.includes('Góc Luyện Nghe') || l.includes('assets/mascot'));
console.log('Match at line:', idx + 1);
console.log(lines.slice(idx - 5, idx + 40).join('\n'));
