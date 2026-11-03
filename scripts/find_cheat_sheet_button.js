const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('Cheat Sheet 1 Trang');
console.log('Location:', s);
if (s !== -1) {
    console.log(html.slice(s - 300, s + 200));
}
