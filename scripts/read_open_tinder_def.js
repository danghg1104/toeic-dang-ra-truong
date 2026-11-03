const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('window.openTinderFlashcardModal =');
console.log('Definition at:', s);
if (s !== -1) {
    console.log(html.slice(s, s + 1500));
}
