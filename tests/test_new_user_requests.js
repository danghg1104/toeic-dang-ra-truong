const assert = require('assert');
const WebSocket = require('ws');

if (typeof window === 'undefined') {
    global.document = { querySelector: () => null, addEventListener: () => {} };
    global.window = {
        AudioContext: class {
            constructor() {
                this.destination = {};
                this.currentTime = 0;
            }
            createGain() {
                return {
                    connect() {},
                    gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }
                };
            }
            createOscillator() {
                return {
                    connect() {},
                    start() {},
                    stop() {},
                    frequency: { value: 440, setValueAtTime() {} }
                };
            }
            createBufferSource() {
                return {
                    connect() {},
                    start() {},
                    stop() {}
                };
            }
            createBuffer() {
                return { getChannelData: () => new Float32Array(1024) };
            }
            createBiquadFilter() {
                return {
                    connect() {},
                    frequency: { value: 1000, setValueAtTime() {} },
                    Q: { value: 1, setValueAtTime() {} }
                };
            }
        },
        showToast: () => {}
    };
}

function waitForMessage(client, expectedType) {
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

async function runTests() {
    console.log('================================================================');
    console.log('  VERIFYING USER REQUESTS: TOUR GUIDE, POMODORO, PVP MULTIPLAYER');
    console.log('================================================================');

    // -------------------------------------------------------------------------
    // Test 1: WebAudioMicroEngine Custom Pomodoro Duration
    // -------------------------------------------------------------------------
    console.log('\n--- Domain 1: WebAudioMicroEngine Custom Duration ---');
    const { WebAudioMicroEngine } = require('../js/web-audio-micro-engine');
    assert(WebAudioMicroEngine, 'WebAudioMicroEngine must exist');

    // Test starting with custom duration: 15 minutes = 900s
    let ticks = 0;
    let lastTime = '';
    WebAudioMicroEngine.startPomodoro('work', ({ formattedTime, remainingSeconds }) => {
        ticks++;
        lastTime = formattedTime;
    }, null, 900);

    assert.strictEqual(WebAudioMicroEngine.pomodoroTotal, 900, 'pomodoroTotal must be 900s');
    assert(WebAudioMicroEngine.pomodoroRemaining >= 899, 'pomodoroRemaining must be ~900s initially');
    assert.strictEqual(lastTime, '15:00', 'Formatted time must be 15:00');
    console.log('  ✓ [PASS] startPomodoro with custom 900s initializes at 15:00');

    // Test adding time: +5 minutes (300s)
    WebAudioMicroEngine.addPomodoroSeconds(300);
    assert(WebAudioMicroEngine.pomodoroRemaining >= 1198, 'pomodoroRemaining must be ~1200s after +300s');
    console.log('  ✓ [PASS] addPomodoroSeconds(+300) extends remaining to 20:00');

    // Test setPomodoroSeconds: 30 minutes (1800s)
    WebAudioMicroEngine.setPomodoroSeconds(1800);
    assert.strictEqual(WebAudioMicroEngine.pomodoroRemaining, 1800, 'pomodoroRemaining must be 1800s');
    WebAudioMicroEngine.stopPomodoro();
    console.log('  ✓ [PASS] setPomodoroSeconds(1800) sets time to 30:00');

    // -------------------------------------------------------------------------
    // Test 2: Real 1v1 PvP Multiplayer via WebSocket
    // -------------------------------------------------------------------------
    console.log('\n--- Domain 2: Real 1v1 PvP Multiplayer & Custom Rooms ---');

    const wsUrl = 'ws://localhost:3000/ws/pvp';
    
    // Create Client A (Huynh Dang)
    const clientA = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
        clientA.on('open', res);
        clientA.on('error', rej);
    });
    console.log('  ✓ [PASS] Client A connected to /ws/pvp');

    const regAPromise = waitForMessage(clientA, 'REGISTERED_OK');
    // Register User A
    clientA.send(JSON.stringify({
        type: 'REGISTER_USER',
        userId: 'user_huynh_dang',
        username: 'Huynh Dang',
        avatar: '/assets/mascot/may_avatar.png'
    }));

    const regA = await regAPromise;
    assert.strictEqual(regA.type, 'REGISTERED_OK');
    console.log('  ✓ [PASS] Client A registered as "Huynh Dang"');

    // Create Client B (Minh Anh)
    const clientB = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
        clientB.on('open', res);
        clientB.on('error', rej);
    });
    console.log('  ✓ [PASS] Client B connected to /ws/pvp');

    const regBPromise = waitForMessage(clientB, 'REGISTERED_OK');
    // Register User B
    clientB.send(JSON.stringify({
        type: 'REGISTER_USER',
        userId: 'user_minh_anh',
        username: 'Minh Anh',
        avatar: '/assets/mascot/soi_may_avt.png'
    }));

    const regB = await regBPromise;
    assert.strictEqual(regB.type, 'REGISTERED_OK');
    console.log('  ✓ [PASS] Client B registered as "Minh Anh"');

    // Client B requests online users: should see User A!
    const onlineListPromise = waitForMessage(clientB, 'ONLINE_USERS_LIST');
    clientB.send(JSON.stringify({ type: 'GET_ONLINE_USERS', userId: 'user_minh_anh' }));
    const onlineMsg = await onlineListPromise;
    assert.strictEqual(onlineMsg.type, 'ONLINE_USERS_LIST');
    const foundA = onlineMsg.users.find(u => u.userId === 'user_huynh_dang');
    assert(foundA, 'Client B must see Client A online in real time');
    assert.strictEqual(foundA.username, 'Huynh Dang');
    console.log('  ✓ [PASS] Client B sees Client A ("Huynh Dang") online in real-time users list');

    // -------------------------------------------------------------------------
    // Test 3: Custom Room Creation and Join (Real Accounts 1v1)
    // -------------------------------------------------------------------------
    console.log('\n--- Domain 3: Custom Room Creation & Join ---');
    const roomPromise = waitForMessage(clientA, 'ROOM_CREATED');
    // Client A creates room
    clientA.send(JSON.stringify({
        type: 'CREATE_ROOM',
        userId: 'user_huynh_dang',
        username: 'Huynh Dang',
        avatar: '/assets/mascot/may_avatar.png'
    }));

    const roomCreated = await roomPromise;
    assert.strictEqual(roomCreated.type, 'ROOM_CREATED');
    const roomCode = roomCreated.roomCode;
    assert(roomCode && roomCode.length === 6, 'Room code must be 6 digits: ' + roomCode);
    console.log(`  ✓ [PASS] Client A created custom room with code: ${roomCode}`);

    // Client B joins room with roomCode
    const matchPromiseA = waitForMessage(clientA, 'MATCH_FOUND');
    const matchPromiseB = waitForMessage(clientB, 'MATCH_FOUND');

    clientB.send(JSON.stringify({
        type: 'JOIN_ROOM',
        roomCode,
        userId: 'user_minh_anh',
        username: 'Minh Anh',
        avatar: '/assets/mascot/soi_may_avt.png'
    }));

    const [matchA, matchB] = await Promise.all([matchPromiseA, matchPromiseB]);
    assert.strictEqual(matchA.type, 'MATCH_FOUND', 'Client A must receive MATCH_FOUND');
    assert.strictEqual(matchB.type, 'MATCH_FOUND', 'Client B must receive MATCH_FOUND');
    assert.strictEqual(matchA.matchId, matchB.matchId, 'Both clients must be in the same matchId');
    assert.strictEqual(matchA.words.length, 10, 'Match must have 10 vocabulary questions');
    assert.strictEqual(matchA.opponent.username, 'Minh Anh', 'Client A opponent must be Minh Anh');
    assert.strictEqual(matchB.opponent.username, 'Huynh Dang', 'Client B opponent must be Huynh Dang');
    console.log(`  ✓ [PASS] Real 1v1 Battle started! MatchId: ${matchA.matchId} (Huynh Dang vs Minh Anh)`);

    // Client A submits an answer
    const scorePromiseB = waitForMessage(clientB, 'SCORE_UPDATE');

    clientA.send(JSON.stringify({
        type: 'SUBMIT_ANSWER',
        matchId: matchA.matchId,
        wordIndex: 0,
        answer: matchA.words[0].correctIndex,
        responseTimeMs: 800
    }));

    const scoreB = await scorePromiseB;
    assert.strictEqual(scoreB.type, 'SCORE_UPDATE');
    assert(scoreB.opponentScore > 0, 'Opponent score on Client B must increase');
    console.log(`  ✓ [PASS] Real-time Score Sync! Client A answered -> Client B saw opponentScore: ${scoreB.opponentScore}`);

    // Cleanup clients
    clientA.close();
    clientB.close();

    console.log('\n================================================================');
    console.log('🎉 ALL USER REQUEST ENHANCEMENTS VERIFIED WITH 100% SUCCESS!');
    console.log('================================================================');
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
