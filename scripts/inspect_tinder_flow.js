const fs = require('fs');
const code = fs.readFileSync('js/tinder-flashcards-3d.js', 'utf8');

console.log('Searching for swipe, eject, render in js/tinder-flashcards-3d.js...');
const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('eject') || l.includes('nextCard') || l.includes('onDeckComplete') || l.includes('renderCard') || l.includes('render(')) {
        console.log(`Line ${i+1}: ${l.trim().slice(0, 100)}`);
    }
}
