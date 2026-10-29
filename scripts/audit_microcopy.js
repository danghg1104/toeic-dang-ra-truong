const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const patterns = [/cố gắng/i, /tích phước/i, /siêu tốc/i, /bắn súng/i, /👏/, /💪/, /gundam/i];

patterns.forEach(p => {
  lines.forEach((l, idx) => {
    if (p.test(l)) {
      console.log(`P[${p}] L${idx+1}: ${l.trim().slice(0, 100)}`);
    }
  });
});
