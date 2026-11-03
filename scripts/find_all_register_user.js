const fs = require('fs');
const server = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

let p = 0;
while ((p = server.indexOf('registerUser', p)) !== -1) {
    console.log('registerUser found at:', p);
    console.log(server.substring(Math.max(0, p - 30), Math.min(server.length, p + 200)));
    p += 12;
}
