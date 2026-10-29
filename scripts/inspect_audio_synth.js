const fs = require('fs');
const content = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(l => l.includes('KHỞI TẠO ÂM THANH GUNDAM'));
console.log('Audio init at line:', idx + 1);
console.log(lines.slice(idx, idx + 60).join('\n'));
