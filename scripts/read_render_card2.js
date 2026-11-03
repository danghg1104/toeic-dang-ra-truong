const fs = require('fs');
const code = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');

const lines = code.split('\n');
console.log(lines.slice(220, 360).join('\n'));
