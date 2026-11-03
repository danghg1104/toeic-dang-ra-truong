const fs = require('fs');
const code = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');

const lines = code.split('\n');
console.log(lines.slice(380, 540).join('\n'));
