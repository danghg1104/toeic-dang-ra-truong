const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('toastBox');
console.log('toastBox index:', idx);
if (idx !== -1) {
    console.log('toastBox line:', html.substring(0, idx).split('\n').length);
    console.log('Surrounding code:');
    console.log(html.substring(idx - 100, idx + 200));
}
