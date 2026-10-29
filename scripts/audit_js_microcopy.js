const fs = require('fs');
const path = require('path');

const patterns = [/cố gắng nhé/i, /tích phước/i, /siêu tốc/i, /bắn súng/i, /👏/, /💪/, /gundam/i];

fs.readdirSync('js').forEach(file => {
  if (!file.endsWith('.js')) return;
  const content = fs.readFileSync(path.join('js', file), 'utf8');
  const lines = content.split('\n');
  patterns.forEach(p => {
    lines.forEach((l, idx) => {
      if (p.test(l)) {
        console.log(`js/${file} L${idx+1}: ${l.trim().slice(0, 100)}`);
      }
    });
  });
});
