const fs = require('fs');

console.log('=== Checking PvP files ===');
const server = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');
console.log('Server has customRooms?', server.includes('this.customRooms'));
console.log('Server has onlineUsers?', server.includes('this.onlineUsers'));
console.log('Server has CREATE_ROOM?', server.includes('CREATE_ROOM'));

const client = fs.readFileSync('js/pvp-arena-client.js', 'utf8');
console.log('Client has createRoom?', client.includes('createRoom'));
console.log('Client has joinRoom?', client.includes('joinRoom'));
console.log('Client has inviteUser?', client.includes('inviteUser'));
console.log('Client has pvpTabNav?', client.includes('pvpTabNav'));
