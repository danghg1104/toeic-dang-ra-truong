const fs = require('fs');
const content = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(l => l.includes('Phim hoạt hình Ghibli') || l.includes('Thế giới Totoro'));
console.log('Topic match at line:', idx + 1);
if (idx !== -1) {
  console.log(lines.slice(idx - 5, idx + 15).join('\n'));
} else {
  console.log('No Ghibli topic found in vocab-game-workstation.js');
}
