const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('openCheatSheetModal');
console.log('Location in html:', s);
let p = 0;
while ((p = html.indexOf('openCheatSheetModal', p)) !== -1) {
    console.log('openCheatSheetModal at', p);
    console.log(html.slice(p - 30, p + 500));
    p += 20;
}
