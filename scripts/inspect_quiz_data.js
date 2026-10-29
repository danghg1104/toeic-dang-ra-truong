const fs = require('fs');
const content = fs.readFileSync('js/grammar-quiz-data.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(0, 40).join('\n'));
