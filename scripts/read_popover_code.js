const fs = require('fs');
const code = fs.readFileSync('js/app-tour-guide.js', 'utf8');

console.log(code.substring(13500, 17200));
