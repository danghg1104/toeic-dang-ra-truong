const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('function closeTinderFlashcardModal');
console.log('Function definition at:', s);
if (s !== -1) {
    console.log(html.slice(s, s + 500));
} else {
    let p = 0;
    while ((p = html.indexOf('closeTinderFlashcardModal', p)) !== -1) {
        console.log('closeTinderFlashcardModal at', p);
        console.log(html.slice(p - 30, p + 200));
        p += 25;
    }
}
