const fs = require('fs');
const code = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');
console.log('File length:', code.length);
console.log(code.slice(0, 1500));
