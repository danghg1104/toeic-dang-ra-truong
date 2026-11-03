const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const matches = [];
let idx = 0;
while ((idx = content.indexOf('profileDropdownMenu', idx + 1)) !== -1) {
  matches.push({ idx, snippet: content.slice(idx - 50, idx + 200) });
}
console.log(matches);
