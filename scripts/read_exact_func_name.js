const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

const s = 385696;
console.log(bundle.slice(s - 250, s));
