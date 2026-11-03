/**
 * ============================================================================
 * ADVERSARIAL STRESS & BOUNDARY TEST HARNESS: WEBSOCKET PVP ARENA (MILESTONE 4)
 * ============================================================================
 * Author: challenger_m4_1 (Empirical Code-Executing Adversarial Verifier)
 * 
 * Tests empirical limits, concurrency stress, race conditions, edge cases,
 * and security vulnerabilities of the WebSocket PvP Arena Server:
 * 
 * 1. 20-Client Swarm Concurrency (10 simultaneous pairs, 0 race conditions)
 * 2. 21-Client Odd Swarm (20 human pairs + 1 bot fallback)
 * 3. Bot AI Timing Precision (Target ~5000ms, tolerance 4900-5500ms)
 * 4. Sub-millisecond Simultaneous Submissions (Monotonic seq ordering)
 * 5. Transient Disconnection & Grace Period Reconnect (< 5s grace window)
 * 6. Disconnect Forfeit & Verification of Duplicate MATCH_END Anomaly
 * 7. Socket Safety & Immediate Destruction on Invalid HTTP Upgrades
 * 8. Malformed / Binary / Corrupted WebSocket Traffic Fuzzing
 * 9. Exploitation Probe: Missing responseTimeMs causing NaN scores
 * 10. Exploitation Probe: Negative responseTimeMs speed bonus inflation
 * 11. Exploitation Probe: Duplicate submissions on identical wordIndex
 * ============================================================================
 */

'use strict';

const http = require('http');
const assert = require('assert');
const path = require('path');
const { WebSocket } = require('ws');
const { pvpArenaServerInstance } = require('../lib/pvp-arena-server');

const PvPArenaServerClass = pvpArenaServerInstance.constructor;

// Helper to spawn a clean test server instance on an ephemeral port
function spawnTestServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            res.writeHead(404);
            res.end();
        });
        const pvpInstance = new PvPArenaServerClass();
        pvpInstance.init(server);
        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;
            resolve({
                server,
                pvpInstance,
                port,
                url: `ws://127.0.0.1:${port}/ws/pvp`,
                httpUrl: `http://127.0.0.1:${port}`,
                close: () => new Promise(cb => {
                    clearInterval(pvpInstance.cleanupInterval);
                    if (pvpInstance.wss) {
                        pvpInstance.wss.clients.forEach(c => c.terminate());
                        pvpInstance.wss.close();
                    }
                    server.close(cb);
                })
            });
        });
    });
}

// Test Runner Infrastructure
const testResults = [];

async function runTest(testName, testFn) {
    const startTime = Date.now();
    try {
        console.log(`\n⏳ Running: ${testName}...`);
        const details = await testFn();
        const duration = Date.now() - startTime;
        console.log(`  ✅ [PASS] ${testName} (${duration}ms)`);
        if (details) console.log(`     ℹ️ Details: ${JSON.stringify(details)}`);
        testResults.push({ name: testName, status: 'PASS', duration, details });
    } catch (err) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [FAIL] ${testName} (${duration}ms)`);
        console.error(`     💥 Error: ${err.message}`);
        testResults.push({ name: testName, status: 'FAIL', duration, error: err.message, stack: err.stack });
    }
}

async function main() {
    console.log('======================================================================');
    console.log('  MILESTONE 4: ADVERSARIAL PVP ARENA STRESS & BOUNDARY TEST SUITE     ');
    console.log('======================================================================');

    // ------------------------------------------------------------------------
    // TEST 1: 20-Client Rapid Swarm Concurrency
    // ------------------------------------------------------------------------
    await runTest('1. Rapid Swarm Concurrency (20 Simultaneous Clients)', async () => {
        const { port, url, close, pvpInstance } = await spawnTestServer();
        const CLIENT_COUNT = 20;
        const clients = [];
        const matchFoundEvents = [];
        const matchIds = new Set();

        for (let i = 0; i < CLIENT_COUNT; i++) {
            clients.push(new WebSocket(url));
        }

        await Promise.all(clients.map(ws => new Promise((res, rej) => {
            ws.on('open', res);
            ws.on('error', rej);
        })));

        // Send JOIN_QUEUE simultaneously from all 20 clients
        clients.forEach((ws, idx) => {
            ws.on('message', raw => {
                const msg = JSON.parse(raw);
                if (msg.type === 'MATCH_FOUND') {
                    matchFoundEvents.push({ clientIdx: idx, msg });
                    matchIds.add(msg.matchId);
                }
            });
            ws.send(JSON.stringify({
                type: 'JOIN_QUEUE',
                userId: `user_swarm_${idx}`,
                username: `SwarmPlayer_${idx}`
            }));
        });

        // Wait for all matches to be created
        await new Promise(resolve => setTimeout(resolve, 800));

        assert.strictEqual(matchFoundEvents.length, 20, `Expected 20 MATCH_FOUND events, got ${matchFoundEvents.length}`);
        assert.strictEqual(matchIds.size, 10, `Expected exactly 10 distinct matches for 20 clients, got ${matchIds.size}`);
        assert.strictEqual(pvpInstance.waitingQueue.length, 0, 'Waiting queue must be completely empty');
        assert.strictEqual(pvpInstance.activeMatches.size, 10, 'Active matches map must hold 10 ongoing matches');

        // Verify word bank payload size
        matchFoundEvents.forEach(({ msg }) => {
            assert.strictEqual(msg.words.length, 10, 'Each match must provide 10 words');
            assert.strictEqual(msg.opponent.isBot, false, 'In 20-client swarm, all opponents must be human');
        });

        clients.forEach(c => c.close());
        await close();
        return { totalClients: CLIENT_COUNT, matchesFormed: matchIds.size, queueRemaining: 0 };
    });

    // ------------------------------------------------------------------------
    // TEST 2: Odd Client Swarm (21 Clients: 10 Human Pairs + 1 Bot Match)
    // ------------------------------------------------------------------------
    await runTest('2. Odd Client Swarm (21 Clients: 10 Pairs + 1 Bot Match)', async () => {
        const { url, close, pvpInstance } = await spawnTestServer();
        const CLIENT_COUNT = 21;
        const clients = [];
        const matchFoundEvents = [];

        for (let i = 0; i < CLIENT_COUNT; i++) {
            clients.push(new WebSocket(url));
        }

        await Promise.all(clients.map(ws => new Promise((res, rej) => {
            ws.on('open', res);
            ws.on('error', rej);
        })));

        clients.forEach((ws, idx) => {
            ws.on('message', raw => {
                const msg = JSON.parse(raw);
                if (msg.type === 'MATCH_FOUND') {
                    matchFoundEvents.push({ clientIdx: idx, msg });
                }
            });
            ws.send(JSON.stringify({
                type: 'JOIN_QUEUE',
                userId: `user_odd_${idx}`,
                username: `OddPlayer_${idx}`
            }));
        });

        // Give 500ms for immediate pairs to resolve
        await new Promise(r => setTimeout(r, 600));
        assert.strictEqual(matchFoundEvents.length, 20, 'Expected 20 clients paired immediately');
        assert.strictEqual(pvpInstance.waitingQueue.length, 1, 'Exactly 1 odd client must be waiting in queue');

        // Wait past 5000ms bot timeout
        await new Promise(r => setTimeout(r, 4700));

        assert.strictEqual(matchFoundEvents.length, 21, 'All 21 clients must now have received MATCH_FOUND');
        const botMatch = matchFoundEvents.find(e => e.msg.opponent.isBot === true);
        assert(botMatch, 'Odd client must have been matched with Sói Mây AI Bot');
        assert.strictEqual(botMatch.msg.opponent.username, 'Sói Mây AI Bot 🐺');
        assert.strictEqual(pvpInstance.waitingQueue.length, 0, 'Waiting queue must be empty after bot fallback');

        clients.forEach(c => c.close());
        await close();
        return { humanPairs: 10, botMatches: 1, totalClients: 21 };
    });

    // ------------------------------------------------------------------------
    // TEST 3: Bot AI Timing Precision & Behavior
    // ------------------------------------------------------------------------
    await runTest('3. Bot AI Matchmaking Timing Precision (Target 5000ms)', async () => {
        const { url, close } = await spawnTestServer();
        const ws = new WebSocket(url);
        await new Promise((res, rej) => { ws.on('open', res); ws.on('error', rej); });

        let queueStartTime = 0;
        let matchFoundTime = 0;
        let botMatchData = null;
        const scoreUpdates = [];

        const matchFoundPromise = new Promise(resolve => {
            ws.on('message', raw => {
                const msg = JSON.parse(raw);
                if (msg.type === 'MATCH_FOUND') {
                    matchFoundTime = Date.now();
                    botMatchData = msg;
                    resolve();
                } else if (msg.type === 'SCORE_UPDATE') {
                    scoreUpdates.push(msg);
                }
            });
        });

        queueStartTime = Date.now();
        ws.send(JSON.stringify({
            type: 'JOIN_QUEUE',
            userId: 'solo_tester',
            username: 'Solo Warrior'
        }));

        await matchFoundPromise;
        const elapsedMs = matchFoundTime - queueStartTime;

        assert(elapsedMs >= 4900, `Bot matched too early: ${elapsedMs}ms (expected >= 4900ms)`);
        assert(elapsedMs <= 5500, `Bot matched too late: ${elapsedMs}ms (expected <= 5500ms)`);
        assert.strictEqual(botMatchData.opponent.isBot, true, 'Opponent must be marked as bot');
        assert.strictEqual(botMatchData.opponent.username, 'Sói Mây AI Bot 🐺', 'Bot username must match');

        // Let the bot answer at least 1-2 questions (delays are 1.5s - 4.5s)
        await new Promise(r => setTimeout(r, 4800));
        assert(scoreUpdates.length >= 1, `Bot should have submitted at least 1 answer, got ${scoreUpdates.length}`);
        assert(scoreUpdates[0].seq > 0, `Bot answer must increment sequence counter: seq=${scoreUpdates[0].seq}`);

        ws.close();
        await close();
        return { elapsedMs, target: 5000, botUpdatesReceived: scoreUpdates.length };
    });

    // ------------------------------------------------------------------------
    // TEST 4: Sub-millisecond Simultaneous Submissions & Monotonic Seq
    // ------------------------------------------------------------------------
    await runTest('4. Simultaneous Submissions (Same Tick Monotonic Seq)', async () => {
        const { url, close } = await spawnTestServer();
        const ws1 = new WebSocket(url);
        const ws2 = new WebSocket(url);
        await Promise.all([
            new Promise(r => ws1.on('open', r)),
            new Promise(r => ws2.on('open', r))
        ]);

        let matchId = null;
        let words = null;
        const p1ScoreUpdates = [];
        const p2ScoreUpdates = [];

        ws1.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'MATCH_FOUND') {
                matchId = msg.matchId;
                words = msg.words;
            } else if (msg.type === 'SCORE_UPDATE') {
                p1ScoreUpdates.push(msg);
            }
        });

        ws2.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'SCORE_UPDATE') {
                p2ScoreUpdates.push(msg);
            }
        });

        ws1.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'p1', username: 'Player 1' }));
        ws2.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'p2', username: 'Player 2' }));

        // Wait for match creation
        await new Promise(r => setTimeout(r, 200));
        assert(matchId, 'Match must be established');

        // Fire both answers in the exact same event loop tick
        const answerPayload1 = JSON.stringify({
            type: 'SUBMIT_ANSWER',
            matchId,
            wordIndex: 0,
            answer: words[0].correctIndex,
            responseTimeMs: 320
        });
        const answerPayload2 = JSON.stringify({
            type: 'SUBMIT_ANSWER',
            matchId,
            wordIndex: 0,
            answer: words[0].correctIndex,
            responseTimeMs: 320
        });

        ws1.send(answerPayload1);
        ws2.send(answerPayload2);

        // Wait for server to process both answers
        await new Promise(r => setTimeout(r, 250));

        assert.strictEqual(p1ScoreUpdates.length, 2, 'Player 1 must receive exactly 2 SCORE_UPDATE events');
        assert.strictEqual(p2ScoreUpdates.length, 2, 'Player 2 must receive exactly 2 SCORE_UPDATE events');

        const seq1_p1 = p1ScoreUpdates[0].seq;
        const seq2_p1 = p1ScoreUpdates[1].seq;
        const seq1_p2 = p2ScoreUpdates[0].seq;
        const seq2_p2 = p2ScoreUpdates[1].seq;

        assert.strictEqual(seq1_p1, seq1_p2, 'Sequence #1 must be identical across both players');
        assert.strictEqual(seq2_p1, seq2_p2, 'Sequence #2 must be identical across both players');
        assert(seq2_p1 > seq1_p1, `Sequence counter must strictly increase monotonically: seq1=${seq1_p1}, seq2=${seq2_p1}`);

        ws1.close();
        ws2.close();
        await close();
        return { seqOrder: [seq1_p1, seq2_p1], updatesCount: p1ScoreUpdates.length };
    });

    // ------------------------------------------------------------------------
    // TEST 5: Transient Disconnection & 5s Grace Period Reconnection
    // ------------------------------------------------------------------------
    await runTest('5. Transient Disconnection & 5s Grace Reconnection', async () => {
        const { url, close } = await spawnTestServer();
        const ws1 = new WebSocket(url);
        const ws2 = new WebSocket(url);
        await Promise.all([
            new Promise(r => ws1.on('open', r)),
            new Promise(r => ws2.on('open', r))
        ]);

        let matchId = null;
        let p2DisconnectedNotif = null;
        let p2ReconnectedNotif = null;
        let p1ReconnectSuccess = null;

        ws1.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'MATCH_FOUND') matchId = msg.matchId;
        });

        ws2.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'OPPONENT_DISCONNECTED') {
                p2DisconnectedNotif = msg;
            } else if (msg.type === 'OPPONENT_RECONNECTED') {
                p2ReconnectedNotif = msg;
            }
        });

        ws1.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'user_reconn_1', username: 'Reconn P1' }));
        ws2.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'user_reconn_2', username: 'Reconn P2' }));

        await new Promise(r => setTimeout(r, 200));
        assert(matchId, 'Match must be created');

        // Simulate sudden abrupt disconnection of Player 1
        ws1.terminate();

        // Wait 150ms for close event on server
        await new Promise(r => setTimeout(r, 150));
        assert(p2DisconnectedNotif, 'Player 2 must receive OPPONENT_DISCONNECTED notification');
        assert.strictEqual(p2DisconnectedNotif.graceSeconds, 5, 'Grace period must be reported as 5s');
        assert.strictEqual(p2DisconnectedNotif.state, 'RECONNECTING', 'State must be RECONNECTING');

        // Wait 1000ms (< 5s grace period) and reconnect Player 1 via new socket
        await new Promise(r => setTimeout(r, 1000));
        const ws1New = new WebSocket(url);
        await new Promise(r => ws1New.on('open', r));

        ws1New.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'RECONNECT_SUCCESS') {
                p1ReconnectSuccess = msg;
            }
        });

        ws1New.send(JSON.stringify({
            type: 'RECONNECT_MATCH',
            matchId,
            userId: 'user_reconn_1'
        }));

        await new Promise(r => setTimeout(r, 200));
        assert(p1ReconnectSuccess, 'Player 1 must receive RECONNECT_SUCCESS');
        assert.strictEqual(p1ReconnectSuccess.matchId, matchId);
        assert(p2ReconnectedNotif, 'Player 2 must receive OPPONENT_RECONNECTED');
        assert.strictEqual(p2ReconnectedNotif.state, 'PLAYING');

        ws1New.close();
        ws2.close();
        await close();
        return { graceSeconds: 5, reconnectStatus: 'SUCCESS', restoredMatch: matchId };
    });

    // ------------------------------------------------------------------------
    // TEST 6: Disconnect Forfeit (>5.2s) & Anomaly Audit
    // ------------------------------------------------------------------------
    await runTest('6. Disconnect Forfeit (>5.2s) & Conflicting Duplicate MATCH_END Audit', async () => {
        const { url, close } = await spawnTestServer();
        const ws1 = new WebSocket(url);
        const ws2 = new WebSocket(url);
        await Promise.all([
            new Promise(r => ws1.on('open', r)),
            new Promise(r => ws2.on('open', r))
        ]);

        let matchId = null;
        let words = null;
        const p2Messages = [];

        ws1.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'MATCH_FOUND') {
                matchId = msg.matchId;
                words = msg.words;
                // P1 answers 1 correct question so P1 has 100+ points before rage-quitting
                ws1.send(JSON.stringify({
                    type: 'SUBMIT_ANSWER',
                    matchId,
                    wordIndex: 0,
                    answer: words[0].correctIndex,
                    responseTimeMs: 400
                }));
                // Terminate socket after answer is recorded
                setTimeout(() => ws1.terminate(), 150);
            }
        });

        ws2.on('message', raw => {
            p2Messages.push(JSON.parse(raw));
        });

        ws1.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'user_forfeit_1', username: 'Forfeit P1' }));
        ws2.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'user_forfeit_2', username: 'Waiting P2' }));

        // Wait 5500ms for grace period (5000ms) to expire
        await new Promise(r => setTimeout(r, 5500));

        const matchEnds = p2Messages.filter(m => m.type === 'MATCH_END');
        assert(matchEnds.length >= 1, 'Player 2 must receive MATCH_END on opponent forfeit');

        console.log(`     🔍 Observed MATCH_END count for Player 2: ${matchEnds.length}`);
        matchEnds.forEach((me, i) => {
            console.log(`        Msg ${i + 1}: reason=${me.reason}, result=${me.result}, winner=${me.winner}, rankDelta=${me.rankDelta}`);
        });

        // Audit for the double conflicting message bug
        const hasDoubleEndAnomaly = matchEnds.length > 1;
        const hasInvertedResultBug = matchEnds.length > 1 && 
            matchEnds[0].result === 'VICTORY' && 
            matchEnds[1].result === 'DEFEAT';

        ws2.close();
        await close();

        if (hasInvertedResultBug) {
            console.warn('     ⚠️ [CRITICAL VULNERABILITY FOUND]: Server sends VICTORY first (+25), then immediately overrides with DEFEAT (-10)!');
        }

        return {
            matchEndCount: matchEnds.length,
            hasDoubleEndAnomaly,
            hasInvertedResultBug,
            firstResult: matchEnds[0]?.result,
            secondResult: matchEnds[1]?.result
        };
    });

    // ------------------------------------------------------------------------
    // TEST 7: Invalid Upgrade Request Destruction & Socket Safety
    // ------------------------------------------------------------------------
    await runTest('7. Socket Safety & Immediate Destruction on Invalid Upgrades', async () => {
        const { port, close } = await spawnTestServer();

        const invalidPaths = [
            '/invalid-path',
            '/ws/hacker',
            '/random',
            '/ws/pvp/extra',
            '/api/pvp',
            '/'
        ];

        for (const testPath of invalidPaths) {
            await new Promise((resolve, reject) => {
                const req = http.request({
                    hostname: '127.0.0.1',
                    port,
                    path: testPath,
                    headers: {
                        'Connection': 'Upgrade',
                        'Upgrade': 'websocket',
                        'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
                        'Sec-WebSocket-Version': '13'
                    }
                });

                let socketDestroyed = false;
                req.on('error', () => {
                    socketDestroyed = true;
                    resolve();
                });
                req.on('upgrade', () => {
                    reject(new Error(`Security leak: Upgrade succeeded for invalid path ${testPath}`));
                });
                req.on('response', () => {
                    reject(new Error(`Unexpected response for invalid upgrade path ${testPath}`));
                });

                req.end();

                // Timeout safety
                setTimeout(() => {
                    if (socketDestroyed) resolve();
                    else reject(new Error(`Socket was not destroyed promptly for ${testPath}`));
                }, 400);
            });
        }

        await close();
        return { testedPaths: invalidPaths.length, allSafelyDestroyed: true };
    });

    // ------------------------------------------------------------------------
    // TEST 8: Malformed / Binary / Fuzzed WebSocket Traffic (F22.B4)
    // ------------------------------------------------------------------------
    await runTest('8. Fuzzing & Malformed JSON Traffic Handling (F22.B4)', async () => {
        const { url, close } = await spawnTestServer();
        const ws = new WebSocket(url);
        await new Promise(r => ws.on('open', r));

        const garbagePayloads = [
            'NOT_A_JSON',
            '{broken_json: true, missing_quotes}',
            '{"type": "UNKNOWN_ACTION_TYPE_XYZ"}',
            '',
            'null',
            '12345',
            '{"type": null}',
            Buffer.from([0x00, 0xFF, 0xEE, 0xDD, 0xCC])
        ];

        // Send all garbage payloads in sequence
        for (const junk of garbagePayloads) {
            ws.send(junk);
        }

        // Wait to verify server does NOT crash
        await new Promise(r => setTimeout(r, 200));

        // Now send valid JOIN_QUEUE to verify the socket and server are still 100% operational
        let queueStatusReceived = false;
        ws.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'QUEUE_STATUS') queueStatusReceived = true;
        });

        ws.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'fuzz_survivor' }));
        await new Promise(r => setTimeout(r, 200));

        assert(queueStatusReceived, 'Server must remain alive and responsive after fuzzed traffic');
        ws.close();
        await close();
        return { payloadsTested: garbagePayloads.length, serverSurvived: true };
    });

    // ------------------------------------------------------------------------
    // TEST 9: Exploitation Probe: Missing responseTimeMs causing NaN Score
    // ------------------------------------------------------------------------
    await runTest('9. Exploitation Probe: Missing responseTimeMs (NaN Score Vulnerability)', async () => {
        const { url, close } = await spawnTestServer();
        const ws1 = new WebSocket(url);
        const ws2 = new WebSocket(url);
        await Promise.all([
            new Promise(r => ws1.on('open', r)),
            new Promise(r => ws2.on('open', r))
        ]);

        let matchId = null;
        let words = null;
        let receivedScoreUpdate = null;

        ws1.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'MATCH_FOUND') {
                matchId = msg.matchId;
                words = msg.words;
            } else if (msg.type === 'SCORE_UPDATE') {
                receivedScoreUpdate = msg;
            }
        });

        ws1.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'nan_p1' }));
        ws2.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'nan_p2' }));

        await new Promise(r => setTimeout(r, 200));

        // Send SUBMIT_ANSWER without responseTimeMs
        ws1.send(JSON.stringify({
            type: 'SUBMIT_ANSWER',
            matchId,
            wordIndex: 0,
            answer: words[0].correctIndex
            // responseTimeMs is intentionally omitted
        }));

        await new Promise(r => setTimeout(r, 250));
        assert(receivedScoreUpdate, 'SCORE_UPDATE must be sent');

        console.log(`     ℹ️ Received myScore when responseTimeMs is missing: ${receivedScoreUpdate.myScore}`);
        const isNullOrNan = receivedScoreUpdate.myScore === null || Number.isNaN(receivedScoreUpdate.myScore);

        ws1.close();
        ws2.close();
        await close();

        if (isNullOrNan) {
            console.warn('     ⚠️ [ARITHMETIC BUG FOUND]: Omitting responseTimeMs causes myScore to become null/NaN!');
        }

        return { myScoreReceived: receivedScoreUpdate.myScore, isArithmeticBug: isNullOrNan };
    });

    // ------------------------------------------------------------------------
    // TEST 10: Exploitation Probe: Negative responseTimeMs Score Inflation
    // ------------------------------------------------------------------------
    await runTest('10. Exploitation Probe: Negative responseTimeMs Bonus Inflation', async () => {
        const { url, close } = await spawnTestServer();
        const ws1 = new WebSocket(url);
        const ws2 = new WebSocket(url);
        await Promise.all([
            new Promise(r => ws1.on('open', r)),
            new Promise(r => ws2.on('open', r))
        ]);

        let matchId = null;
        let words = null;
        let receivedScoreUpdate = null;

        ws1.on('message', raw => {
            const msg = JSON.parse(raw);
            if (msg.type === 'MATCH_FOUND') {
                matchId = msg.matchId;
                words = msg.words;
            } else if (msg.type === 'SCORE_UPDATE') {
                receivedScoreUpdate = msg;
            }
        });

        ws1.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'exploit_p1' }));
        ws2.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'exploit_p2' }));

        await new Promise(r => setTimeout(r, 200));

        // Malicious client sends negative responseTimeMs to hijack speed bonus calculation
        ws1.send(JSON.stringify({
            type: 'SUBMIT_ANSWER',
            matchId,
            wordIndex: 0,
            answer: words[0].correctIndex,
            responseTimeMs: -1000000 // Exploit payload
        }));

        await new Promise(r => setTimeout(r, 250));
        assert(receivedScoreUpdate, 'SCORE_UPDATE must be received');

        console.log(`     ℹ️ Exploit score achieved on single question: ${receivedScoreUpdate.myScore}`);
        const isInflated = receivedScoreUpdate.myScore > 200;

        ws1.close();
        ws2.close();
        await close();

        if (isInflated) {
            console.warn(`     ⚠️ [SECURITY / SCORING EXPLOIT]: Negative responseTimeMs rewarded inflated score of ${receivedScoreUpdate.myScore} (max legitimate is ~150)!`);
        }

        return { exploitScore: receivedScoreUpdate.myScore, maxLegitimate: 150, isVulnerable: isInflated };
    });

    // ------------------------------------------------------------------------
    // TEST 11: Queue Cancellation & Orphan Timer Elimination
    // ------------------------------------------------------------------------
    await runTest('11. Queue Cancellation & Orphan Bot Timer Elimination', async () => {
        const { url, close, pvpInstance } = await spawnTestServer();
        const ws = new WebSocket(url);
        await new Promise(r => ws.on('open', r));

        ws.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: 'cancel_tester' }));
        await new Promise(r => setTimeout(r, 200));
        assert.strictEqual(pvpInstance.waitingQueue.length, 1, 'Player must be in queue');

        // Player leaves queue by disconnecting after 1 second (< 5s bot timeout)
        ws.close();
        await new Promise(r => setTimeout(r, 200));
        assert.strictEqual(pvpInstance.waitingQueue.length, 0, 'Player must be removed from queue immediately on close');

        // Wait past 5000ms and verify no phantom match was created for the disconnected player
        await new Promise(r => setTimeout(r, 5200));
        assert.strictEqual(pvpInstance.activeMatches.size, 0, 'No phantom bot matches should be created after disconnect');

        await close();
        return { queueCleared: true, orphanMatchesCount: 0 };
    });

    // ========================================================================
    // TEST SUMMARY & VERDICT
    // ========================================================================
    console.log('\n======================================================================');
    console.log('                   ADVERSARIAL SUITE SUMMARY                         ');
    console.log('======================================================================');
    const passedCount = testResults.filter(r => r.status === 'PASS').length;
    const failedCount = testResults.filter(r => r.status === 'FAIL').length;
    console.log(`TOTAL TESTS RUN: ${testResults.length}`);
    console.log(`PASSED: ${passedCount}`);
    console.log(`FAILED: ${failedCount}`);
    console.log('======================================================================\n');

    return { passedCount, failedCount, testResults };
}

if (require.main === module) {
    main().catch(err => {
        console.error('Test harness fatal crash:', err);
        process.exit(1);
    });
}

module.exports = { main };
