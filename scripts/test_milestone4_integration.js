const http = require('http');
const { WebSocket } = require('ws');

console.log('🚀 Running Milestone 4 Integration Verification Tests...');

async function testAiExplanation() {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            question: 'The committee was pleased with the ___ of the new director.',
            userAnswer: 'impressive',
            correctAnswer: 'performance',
            part: 5,
            trapCategory: 'trap-part5-word-form'
        });

        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/ai/explain-mistake',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.success && json.explanation) {
                        console.log(`✅ [AI Engine] PASS — Provider: ${json.provider}`);
                        console.log(`   Sample explanation: "${json.explanation.substring(0, 100)}..."`);
                        resolve(true);
                    } else {
                        console.error('❌ [AI Engine] Failed response:', data);
                        reject(new Error('AI Explanation response invalid'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function testWebSocketPvP() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('ws://localhost:3000/ws/pvp');
        let matched = false;

        ws.on('open', () => {
            console.log('✅ [WebSocket PvP] Connected to ws://localhost:3000/ws/pvp');
            ws.send(JSON.stringify({
                type: 'JOIN_QUEUE',
                userId: 'test_player_1',
                username: 'Test Candidate',
                avatar: '/assets/mascot/soi_may_avt.png'
            }));
        });

        ws.on('message', (msg) => {
            const data = JSON.parse(msg.toString());
            // console.log('WS Received:', data.type);

            if (data.type === 'QUEUE_STATUS') {
                console.log('✅ [WebSocket PvP] Queue status received:', data.status);
            } else if (data.type === 'MATCH_FOUND') {
                matched = true;
                console.log('✅ [WebSocket PvP] Match found against:', data.opponent?.username);
                console.log('   Words in battle:', data.words?.length);

                // Gửi đáp án cho câu đầu tiên
                setTimeout(() => {
                    ws.send(JSON.stringify({
                        type: 'SUBMIT_ANSWER',
                        matchId: data.matchId,
                        wordIndex: 0,
                        answer: data.words[0].correctIndex,
                        responseTimeMs: 1200
                    }));
                }, 200);
            } else if (data.type === 'SCORE_UPDATE') {
                console.log(`✅ [WebSocket PvP] Score updated! My Score: ${data.myScore}, Combo: ${data.myCombo}`);
                ws.close();
                resolve(true);
            }
        });

        ws.on('error', (err) => {
            console.error('❌ [WebSocket PvP] Error:', err.message);
            reject(err);
        });

        setTimeout(() => {
            if (!matched) {
                ws.close();
                reject(new Error('Timeout waiting for match'));
            }
        }, 8000);
    });
}

async function runAll() {
    try {
        await testAiExplanation();
        await testWebSocketPvP();
        console.log('\n🎉 ALL MILESTONE 4 INTEGRATION TESTS PASSED 100%!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Integration Test Failed:', err.message);
        process.exit(1);
    }
}

runAll();
