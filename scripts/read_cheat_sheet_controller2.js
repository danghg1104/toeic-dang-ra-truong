const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('window.openCheatSheetModal = function');
console.log(html.slice(s, s + 1500));
