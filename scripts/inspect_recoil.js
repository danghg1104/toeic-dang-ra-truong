const fs = require('fs');
const content = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(3860, 3915).join('\n'));
