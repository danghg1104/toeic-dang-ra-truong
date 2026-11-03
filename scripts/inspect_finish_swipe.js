const fs = require('fs');
const content = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');
const pos = content.indexOf('finishSwipe(');
console.log(content.slice(pos - 50, pos + 1500));
