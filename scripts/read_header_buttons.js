const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('btnEditorialToggle');
console.log(html.substring(sIdx, sIdx + 2000));
