const fs = require('fs');
const content = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
const lines = content.split('\n');

const start = lines.findIndex(l => l.includes('<!-- Bottom Launcher: GUNDAM MOBILE SUIT'));
const end = lines.findIndex(l => l.includes('// KHỞI TẠO GAME & LOOP CHUYỂN ĐỘNG'));

console.log('Start:', start + 1, 'End:', end + 1);
console.log(lines.slice(start, start + 20).join('\n'));
console.log('---');
console.log(lines.slice(end - 20, end).join('\n'));
