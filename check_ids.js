const fs = require('fs');
const content = fs.readFileSync('userscript_v27_supreme.js', 'utf8');
const ids = content.match(/['"]\d{9,12}['"]/g) || [];
console.log(JSON.stringify([...new Set(ids)], null, 2));
