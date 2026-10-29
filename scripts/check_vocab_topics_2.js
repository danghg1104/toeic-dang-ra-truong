const fs = require('fs');
const content = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(l => l.includes('popularTopics =') || l.includes('const topics =') || l.includes('Gợi ý nhanh'));
console.log('Topics around line:', idx + 1);
if (idx !== -1) {
  console.log(lines.slice(idx - 5, idx + 25).join('\n'));
}
