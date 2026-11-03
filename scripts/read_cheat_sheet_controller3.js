const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('requisition form');
console.log(html.slice(s, s + 1500));
