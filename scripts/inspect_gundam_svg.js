const fs = require('fs');
const content = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(l => l.includes('<!-- Bottom Launcher: GUNDAM'));
console.log('Bottom launcher at line:', idx + 1);
console.log(lines.slice(idx, idx + 180).join('\n'));
