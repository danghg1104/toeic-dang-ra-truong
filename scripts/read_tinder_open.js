const fs = require('fs');
const code = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');

const s = code.indexOf('open(');
console.log(code.slice(s, s + 1500));
