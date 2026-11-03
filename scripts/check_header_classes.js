const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('id=\x22sanhTopHeaderBar\x22');
console.log(content.slice(pos - 50, pos + 400));
