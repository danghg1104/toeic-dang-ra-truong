const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('id=\x22sanhTopHeaderBar\x22');
const endPos = content.indexOf('<!-- MAIN DASHBOARD CONTENT GRID', pos);
console.log(content.slice(pos, endPos));
