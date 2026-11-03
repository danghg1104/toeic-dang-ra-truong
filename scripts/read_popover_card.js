const fs = require('fs');
const code = fs.readFileSync('js/app-tour-guide.js', 'utf8');

const idx = code.indexOf('id="tourPopoverCard"');
console.log(code.substring(Math.max(0, idx - 100), idx + 800));
