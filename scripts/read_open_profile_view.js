const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

const s = bundle.indexOf('function openAccountProfileView');
console.log(bundle.slice(s, s + 400));
