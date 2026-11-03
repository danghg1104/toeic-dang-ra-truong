const fs = require('fs');
const content = fs.readFileSync('js/app-tour-guide.js', 'utf8');
console.log(content.slice(0, 3000));
