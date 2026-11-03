const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('id="toeicCheatSheetModal"');
console.log('Location:', s);
if (s !== -1) {
    console.log(html.slice(s - 50, s + 400));
} else {
    console.log('toeicCheatSheetModal not found!');
}

// Check how openOnePageCheatSheetModal is implemented in index.html or js/
let p = 0;
while ((p = html.indexOf('openOnePageCheatSheetModal', p)) !== -1) {
    console.log('openOnePageCheatSheetModal at', p);
    console.log(html.slice(p - 30, p + 400));
    p += 25;
}
