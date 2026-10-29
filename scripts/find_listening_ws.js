const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('toeicListeningWorkstation'));
console.log('toeicListeningWorkstation around line:', idx + 1);
if (idx !== -1) {
  console.log(lines.slice(idx, idx + 40).join('\n'));
}
