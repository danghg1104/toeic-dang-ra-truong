const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const search = 'id=\x22sanhTopHeaderBar\x22';
const pos = content.indexOf(search);
console.log('Position:', pos);
if (pos !== -1) {
  console.log(content.slice(pos - 100, pos + 3000));
}
