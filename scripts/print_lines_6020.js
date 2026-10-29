const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
for (let i = 6015; i <= 6035; i++) {
  console.log(i + ': ' + JSON.stringify(lines[i]));
}
