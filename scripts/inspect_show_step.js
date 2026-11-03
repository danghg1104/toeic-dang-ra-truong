const fs = require('fs');
const code = fs.readFileSync('js/app-tour-guide.js', 'utf8');

const idx = code.indexOf('_showStep(');
console.log(code.substring(idx, idx + 3000));
