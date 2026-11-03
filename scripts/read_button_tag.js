const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('<span>Cheat Sheet 1 Trang</span>');
const btnIdx = html.lastIndexOf('<button', s);
console.log(html.slice(btnIdx, s + 50));
