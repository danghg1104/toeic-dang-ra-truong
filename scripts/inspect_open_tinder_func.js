const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('window.openTinderFlashcardModal = function');
console.log(content.slice(pos, pos + 2200));
