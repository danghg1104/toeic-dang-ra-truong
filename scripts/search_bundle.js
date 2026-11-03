const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

const matches = [];
let idx = 0;
while ((idx = bundle.indexOf('Còn 47 ngày', idx)) !== -1) {
    console.log('--- in bundle at ' + idx + ' ---');
    console.log(bundle.substring(Math.max(0, idx - 300), Math.min(bundle.length, idx + 400)));
    idx += 11;
}
