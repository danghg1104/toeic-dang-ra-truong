const fs = require('fs');
const lines = fs.readFileSync('tests/adversarial_tier5_practice_pvp.test.js', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('1.2') || lines[i].includes('4.2')) {
    console.log(lines.slice(i, i + 20).join('\n'));
    console.log('-------------------------------------------');
  }
}
