const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

const s = 438821;
console.log(bundle.slice(s - 400, s + 300));
