const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('window.openOnePageCheatSheetModal');
console.log('Location in html:', s);
if (s !== -1) {
    console.log(html.slice(s, s + 1500));
}
