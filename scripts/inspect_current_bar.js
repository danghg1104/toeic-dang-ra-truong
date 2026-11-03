const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('id="sanhTopHeaderBar"');
console.log(html.slice(s, s + 3500));
