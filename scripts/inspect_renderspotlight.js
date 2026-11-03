const fs = require('fs');
const content = fs.readFileSync('js/app-tour-guide.js', 'utf8');
const pos = content.indexOf('_showStep(index)');
console.log(content.slice(pos, pos + 3500));
