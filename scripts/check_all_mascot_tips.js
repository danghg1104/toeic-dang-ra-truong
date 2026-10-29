const fs = require('fs');
const content = fs.readFileSync('js/grammar-database.js', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('"mascotTip":')) {
    console.log(`L${idx+1}: ${l.trim().slice(0, 100)}`);
  }
});
