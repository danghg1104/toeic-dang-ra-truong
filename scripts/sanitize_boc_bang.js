const fs = require('fs');

const file = 'js/toeic-boc-bang-station.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/'💪 Cố lên!'/g, "'🎯 Tiếp tục rèn luyện!'");
fs.writeFileSync(file, content, 'utf8');
console.log('Sanitized toeic-boc-bang-station.js');
