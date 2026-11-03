const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('Flashcard 3D Vuốt Tinder');
console.log(html.slice(s - 300, s + 500));
