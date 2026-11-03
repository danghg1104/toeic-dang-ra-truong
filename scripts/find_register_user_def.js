const fs = require('fs');
const server = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

const idx = server.indexOf('registerUser(');
console.log(server.substring(idx - 20, idx + 800));
