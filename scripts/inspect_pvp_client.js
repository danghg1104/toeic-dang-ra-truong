const fs = require('fs');
const client = fs.readFileSync('js/pvp-arena-client.js', 'utf8');

const idx = client.indexOf('renderLobby');
if (idx !== -1) {
    console.log(client.substring(idx, idx + 2000));
} else {
    console.log('renderLobby not found');
}
