const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('id="toeicTinderFlashcardModal"');
console.log('Location:', s);
// Check parent elements
console.log('Surrounding HTML (500 chars before):');
console.log(html.slice(Math.max(0, s - 500), s + 100));
