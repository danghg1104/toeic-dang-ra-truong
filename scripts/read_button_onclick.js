const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('<span>Cheat Sheet 1 Trang</span>');
console.log(html.slice(s - 400, s));
