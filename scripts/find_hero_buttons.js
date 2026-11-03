const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('Tr\u1ea1m 180s');
console.log('Pos:', pos);
if (pos !== -1) {
  console.log(content.slice(pos - 300, pos + 800));
}
