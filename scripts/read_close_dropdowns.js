const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

const s = bundle.indexOf('closeAllProfileDropdowns');
console.log(bundle.slice(s - 100, s + 500));
