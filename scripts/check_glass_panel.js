const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const regex = /\.glass-panel|#sanhTopHeaderBar/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log(content.slice(m.index, m.index + 100));
}
