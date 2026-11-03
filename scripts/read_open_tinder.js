const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('openTinderFlashcardModal');
console.log('openTinderFlashcardModal in html:', s);
if (s !== -1) {
    console.log(html.slice(s - 50, s + 1000));
}
