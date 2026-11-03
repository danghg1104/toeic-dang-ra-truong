const fs = require('fs');
const code = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');

const lines = code.split('\n');
console.log(lines.slice(550, 725).join('\n'));
