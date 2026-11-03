const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('.header-bar-elevation {');
console.log(content.slice(pos - 50, pos + 400));
