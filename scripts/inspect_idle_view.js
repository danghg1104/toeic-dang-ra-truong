const fs = require('fs');
const client = fs.readFileSync('js/pvp-arena-client.js', 'utf8');

const sIdx = client.indexOf('renderIdleView() {');
console.log(client.substring(sIdx, sIdx + 3000));
