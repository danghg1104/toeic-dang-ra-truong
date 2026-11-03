const fs = require('fs');
const content = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');
const pos = content.indexOf('renderCurrentCard() {');
const pos2 = content.indexOf('attachEvents() {', pos);
console.log(content.slice(pos, pos2));
