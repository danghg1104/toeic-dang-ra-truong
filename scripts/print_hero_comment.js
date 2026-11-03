const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('HERO ACTION CARD');
console.log(html.slice(s - 50, s + 100));
