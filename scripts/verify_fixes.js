const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sCss = html.indexOf('Khóa cứng font-family');
console.log('--- CSS Snippet ---');
console.log(html.slice(sCss - 10, sCss + 1200));

const sBar = html.indexOf('id="sanhTopHeaderBar"');
console.log('--- Header Bar Snippet ---');
console.log(html.slice(sBar, sBar + 1000));
