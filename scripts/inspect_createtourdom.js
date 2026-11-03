const fs = require('fs');
const content = fs.readFileSync('js/app-tour-guide.js', 'utf8');
const pos = content.indexOf('_createTourDOM');
console.log(content.slice(pos + 1000, pos + 4000));
