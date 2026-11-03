const fs = require('fs');
const server = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

const idx = server.indexOf('REGISTER_USER');
console.log(server.substring(idx - 50, idx + 800));
