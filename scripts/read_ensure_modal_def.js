const fs = require('fs');
const code = fs.readFileSync('js/toeic-diagnostic-workstation.js', 'utf8');

const idx = code.indexOf('ensureModalContainer() {');
console.log(code.substring(idx, idx + 2500));
