const fs = require('fs');
let code = fs.readFileSync('tests/test_new_user_requests.js', 'utf8');

// Replace roomCreated with a filter helper
const oldRoomCreated = `    const roomCreated = await new Promise(res => {
        clientA.once('message', data => res(JSON.parse(data)));
    });`;

const newRoomCreated = `    function waitForMessage(client, expectedType) {
        return new Promise(resolve => {
            const handler = data => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === expectedType) {
                        client.removeListener('message', handler);
                        resolve(parsed);
                    }
                } catch(e) {}
            };
            client.on('message', handler);
        });
    }

    const roomPromise = waitForMessage(clientA, 'ROOM_CREATED');`;

code = code.replace(oldRoomCreated, newRoomCreated);
code = code.replace('const roomCreated = await new Promise', '// roomCreated');
code = code.replace('const roomCode = roomCreated.roomCode;', 'const roomCreated = await roomPromise;\n    const roomCode = roomCreated.roomCode;');

// Also for MATCH_FOUND:
code = code.replace(
`    const matchPromiseA = new Promise(res => {
        clientA.once('message', data => res(JSON.parse(data)));
    });
    const matchPromiseB = new Promise(res => {
        clientB.once('message', data => res(JSON.parse(data)));
    });`,
`    const matchPromiseA = waitForMessage(clientA, 'MATCH_FOUND');
    const matchPromiseB = waitForMessage(clientB, 'MATCH_FOUND');`
);

fs.writeFileSync('tests/test_new_user_requests.js', code, 'utf8');
console.log('✅ Updated test helper with waitForMessage');
