const fs = require('fs');
const content = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');
const pos = content.indexOf('finishSwipe(direction, rating, card) {');
console.log(content.slice(pos, pos + 2000));
