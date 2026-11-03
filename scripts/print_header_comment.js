const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('TOP HEADER BAR');
console.log(html.slice(s - 10, s + 100));
