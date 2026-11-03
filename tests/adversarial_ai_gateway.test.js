/**
 * Adversarial Test Suite for AI Explanation Gateway (Feature 25 & server.js)
 * challenger_m4_2 — Empirical Adversarial Verification
 */

const assert = require('assert');
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const { explainMistake, OFFLINE_TRAP_EXPLANATIONS, aiExplanationEngineInstance } = require('../lib/ai-explanation-engine');

const TEST_PORT = 3999;
let serverProcess = null;

function makeHttpRequest({ method = 'POST', path = '/api/ai/explain-mistake', body = null, headers = {} }) {
    return new Promise((resolve, reject) => {
        const postData = typeof body === 'string' ? body : (body !== null ? JSON.stringify(body) : '');
        const reqHeaders = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            ...headers
        };

        const req = http.request({
            hostname: '127.0.0.1',
            port: TEST_PORT,
            path,
            method,
            headers: reqHeaders
        }, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(resBody);
                } catch (e) {
                    parsed = resBody;
                }
                resolve({ status: res.statusCode, headers: res.headers, body: parsed });
            });
        });

        req.on('error', reject);
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

async function startServer() {
    return new Promise((resolve, reject) => {
        serverProcess = spawn('node', ['server.js'], {
            cwd: path.resolve(__dirname, '..'),
            env: { ...process.env, PORT: String(TEST_PORT) }
        });

        let started = false;
        serverProcess.stdout.on('data', (d) => {
            const out = d.toString();
            if (out.includes('Truy cập Web Tôi Đi Đâu Đó') && !started) {
                started = true;
                resolve();
            }
        });

        serverProcess.stderr.on('data', (d) => {
            // Log stderr if needed
        });

        serverProcess.on('error', reject);
        setTimeout(() => {
            if (!started) reject(new Error('Server start timed out after 10s'));
        }, 10000);
    });
}

function stopServer() {
    if (serverProcess) {
        try {
            serverProcess.kill('SIGTERM');
        } catch (e) {}
    }
}

async function runAdversarialSuite() {
    console.log('================================================================');
    console.log('     CHALLENGER M4.2: ADVERSARIAL AI GATEWAY STRESS SUITE       ');
    console.log('================================================================\n');

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const failureLog = [];

    async function recordTest(name, fn) {
        totalTests++;
        try {
            await fn();
            console.log(`  ✅ PASS: ${name}`);
            passedTests++;
        } catch (err) {
            console.error(`  ❌ FAIL: ${name}`);
            console.error(`     Reason: ${err.message}`);
            failureLog.push({ test: name, error: err.message });
            failedTests++;
        }
    }

    console.log('[Phase 0] Starting HTTP server on port ' + TEST_PORT + '...');
    await startServer();
    console.log('[Phase 0] Server ready.\n');

    try {
        // =========================================================================
        // 1. EMPTY / MALFORMED QUESTION BOUNDARIES
        // =========================================================================
        console.log('--- 1. Testing Empty / Malformed Question Boundaries (HTTP 400) ---');

        await recordTest('1.1 Empty payload `{}` returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: {} });
            assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(res.body.error, 'Question is required');
        });

        await recordTest('1.2 `{ question: "" }` (empty string) returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: { question: '' } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(res.body.error, 'Question is required');
        });

        await recordTest('1.3 `{ question: "   \\t\\n  " }` (whitespace only) returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: { question: '   \t\n  ' } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(res.body.error, 'Question is required');
        });

        await recordTest('1.4 `{ question: null }` returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: { question: null } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
        });

        await recordTest('1.5 `{ question: 12345 }` (number) returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: { question: 12345 } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
        });

        await recordTest('1.6 `{ question: true }` (boolean) returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: { question: true } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
        });

        await recordTest('1.7 `{ question: [] }` (array) returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: { question: [] } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
        });

        await recordTest('1.8 `{ question: {} }` (object) returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: { question: {} } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
        });

        await recordTest('1.9 Malformed JSON string returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: '{ question: invalid json without quotes', headers: { 'Content-Type': 'application/json' } });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
            assert(res.body.error.includes('Định dạng JSON không hợp lệ') || res.body.error.includes('Question is required'));
        });

        await recordTest('1.10 Empty body string `""` returns HTTP 400', async () => {
            const res = await makeHttpRequest({ body: '' });
            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
        });

        await recordTest('1.11 Missing optional fields (userAnswer, correctAnswer, part, trapCategory) safely defaults', async () => {
            const res = await makeHttpRequest({ body: { question: 'Bare minimal question without options' } });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert(res.body.explanation.length > 0);
        });

        // =========================================================================
        // 2. MASSIVE QUESTION LENGTH TRUNCATION STRESS
        // =========================================================================
        console.log('\n--- 2. Testing Question Length Truncation Stress ---');

        await recordTest('2.1 Massive question (50,000 chars) succeeds without crash (HTTP 200)', async () => {
            const hugeQuestion = 'Part 5 TOEIC question: ' + 'A'.repeat(50000);
            const res = await makeHttpRequest({
                body: {
                    question: hugeQuestion,
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: 'TRAP-09'
                }
            });
            assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
            assert.strictEqual(res.body.success, true);
            assert(res.body.explanation.length > 0);
        });

        await recordTest('2.2 Ultra-massive question (200,000 chars) safely handled without memory explosion', async () => {
            const ultraQuestion = 'Q: ' + 'XYZ '.repeat(50000); // 200,000 chars
            const res = await makeHttpRequest({
                body: {
                    question: ultraQuestion,
                    userAnswer: 'C',
                    correctAnswer: 'D',
                    part: 7,
                    trapCategory: 'TRAP-12'
                }
            });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
        });

        await recordTest('2.3 Exact boundary: question of exactly 2,000 chars is not truncated', async () => {
            const exactQuestion = 'A'.repeat(2000);
            const res = await makeHttpRequest({
                body: {
                    question: exactQuestion,
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: 'TRAP-09'
                }
            });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
        });

        await recordTest('2.4 Boundary +1: question of 2,001 chars is cleanly sliced to 2,000 chars', async () => {
            const overQuestion = 'A'.repeat(2001);
            const res = await makeHttpRequest({
                body: {
                    question: overQuestion,
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: 'TRAP-09'
                }
            });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
        });

        await recordTest('2.5 Unicode & Emoji stress (5,000 emojis) safely handled', async () => {
            const emojiQuestion = '🔥🎯⚡'.repeat(2000);
            const res = await makeHttpRequest({
                body: {
                    question: emojiQuestion,
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: 'TRAP-09'
                }
            });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
        });

        // =========================================================================
        // 3. EXHAUSTIVE COVERAGE OF 12 CANONICAL TRAPS & CODE SLUGS
        // =========================================================================
        console.log('\n--- 3. Testing 100% Coverage of 12 Canonical Traps & Code Slugs ---');

        const canonicalTraps = [
            { id: 'TRAP-01', name: 'is being V3' },
            { id: 'TRAP-02', name: 'wearing vs putting on' },
            { id: 'TRAP-03', name: 'Similar Sound' },
            { id: 'TRAP-04', name: 'Indirect Answer' },
            { id: 'TRAP-05', name: 'Yes/No cho câu hỏi Wh-' },
            { id: 'TRAP-06', name: 'Wait/Actually' },
            { id: 'TRAP-07', name: 'Speaker Intent' },
            { id: 'TRAP-08', name: 'Graphic / Table Trap' },
            { id: 'TRAP-09', name: 'vị trí ngữ pháp (-ive, -al)' },
            { id: 'TRAP-10', name: 'Conjunction vs Preposition' },
            { id: 'TRAP-11', name: 'Bẫy điền câu & liên kết logic' },
            { id: 'TRAP-12', name: 'Cross-Reference Trap' }
        ];

        for (const trap of canonicalTraps) {
            await recordTest(`3.1.${trap.id} ${trap.id} returns dedicated trap explanation (no generic fallback)`, async () => {
                const res = await explainMistake({
                    question: 'Sample TOEIC question',
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: trap.id
                });
                assert.strictEqual(res.success, true);
                assert(res.explanation.includes(trap.name), `Expected ${trap.id} explanation to contain "${trap.name}"`);
            });
        }

        await recordTest('3.2 Case insensitivity: lowercase `trap-06` maps to TRAP-06', async () => {
            const res = await explainMistake({
                question: 'Sample',
                userAnswer: 'A',
                correctAnswer: 'Oak Suite',
                part: 3,
                trapCategory: 'trap-06'
            });
            assert(res.explanation.includes('Wait/Actually') || res.explanation.includes('Bẫy đổi ý phút chót'));
        });

        // Code slugs requested in dispatch
        const slugsToTest = [
            { slug: 'P1-BEING', expectedKeywords: ['is being V3', 'Tranh tĩnh không người'] },
            { slug: 'P1-ACTION', expectedKeywords: ['wearing vs putting on', 'hành động'] },
            { slug: 'P2-HOMOPHONE', expectedKeywords: ['Similar Sound', 'đồng âm'] },
            { slug: 'P2-OVERLAP', expectedKeywords: ['đồng âm', 'gần âm', 'Indirect', 'lặp từ'] },
            { slug: 'P34-REVERSAL', expectedKeywords: ['Wait/Actually', 'Bẫy đổi ý phút chót'] },
            { slug: 'P34-DISTRACTOR', expectedKeywords: ['Wait/Actually', 'phương án ban đầu', 'bẻ lái'] },
            { slug: 'P34-GRAPHIC', expectedKeywords: ['Graphic', 'Table', 'bảng biểu'] },
            { slug: 'P5-WORDFORM', expectedKeywords: ['-ive', '-al', 'từ loại'] },
            { slug: 'P5-PREPCONJ', expectedKeywords: ['Conjunction vs Preposition', 'liên từ vs giới từ'] },
            { slug: 'P5-TENSE', expectedKeywords: ['thì', 'động từ', 'tense'] },
            { slug: 'P7-CROSSREF', expectedKeywords: ['Cross-Reference', 'xâu chuỗi đa văn bản'] }
        ];

        console.log('\n  --- Checking Code Slugs against Generic Fallback ---');
        for (const item of slugsToTest) {
            await recordTest(`3.3.${item.slug} Code slug "${item.slug}" returns specialized explanation (no generic fallback)`, async () => {
                const res = await explainMistake({
                    question: 'Adversarial Question',
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: item.slug
                });
                assert.strictEqual(res.success, true);

                // Generic fallback detection:
                const isGenericFallback = (
                    res.explanation.includes('Bẫy từ loại và vị trí ngữ pháp cốt lõi') ||
                    res.explanation.includes('Bẫy từ đồng âm & câu trả lời gián tiếp') ||
                    res.explanation.includes('Bẫy đổi ý phút chót và phân tán thông tin') ||
                    res.explanation.includes('Bẫy xâu chuỗi thông tin và hàm ý gián tiếp')
                );

                const hasExpectedKeyword = item.expectedKeywords.some(kw => res.explanation.toLowerCase().includes(kw.toLowerCase()));

                assert(!isGenericFallback, `Slug "${item.slug}" hit generic fallback! Explanation: ${res.explanation.split('\n')[1]}`);
                assert(hasExpectedKeyword, `Slug "${item.slug}" missing expected keywords: ${item.expectedKeywords.join(', ')}`);
            });
        }

        // =========================================================================
        // 4. STRICT VERIFICATION OF 4-PART STRUCTURE
        // =========================================================================
        console.log('\n--- 4. Testing Strict 4-Part Structure Across All Responses ---');

        const partsToCheck = [
            '1. 🎭 TIẾNG LÒNG SINH VIÊN',
            '2. 🕳️ BÓC MẼ BẪY ETS',
            '3. 🎯 VÌ SAO ĐÚNG',
            '4. ⚡ MẸO 3 GIÂY'
        ];

        for (let i = 1; i <= 12; i++) {
            const trapId = 'TRAP-' + String(i).padStart(2, '0');
            await recordTest(`4.1.${trapId} Strict 4-part structure for ${trapId}`, async () => {
                const res = await explainMistake({
                    question: 'Part drill question',
                    userAnswer: 'X',
                    correctAnswer: 'CustomAnswer_' + trapId,
                    part: 5,
                    trapCategory: trapId
                });

                for (const header of partsToCheck) {
                    assert(res.explanation.includes(header), `${trapId} explanation must contain header "${header}"`);
                }
                assert(res.explanation.includes('CustomAnswer_' + trapId), `${trapId} explanation must dynamically inject correctAnswer`);
            });
        }

        await recordTest('4.2 Generic fallback adheres to strict 4-part structure for unknown traps', async () => {
            for (const p of [1, 3, 5, 7]) {
                const res = await explainMistake({
                    question: 'Unknown trap test',
                    userAnswer: 'X',
                    correctAnswer: 'Correct_P' + p,
                    part: p,
                    trapCategory: 'TRAP-UNKNOWN-999'
                });
                for (const header of partsToCheck) {
                    assert(res.explanation.includes(header), `Generic fallback Part ${p} must contain header "${header}"`);
                }
                assert(res.explanation.includes('Correct_P' + p));
            }
        });

        // =========================================================================
        // 5. SIMULATED FAILURE & OFFLINE 0% CRASH RESILIENCE
        // =========================================================================
        console.log('\n--- 5. Testing Simulated Failure & Offline 0% Crash Resilience ---');

        await recordTest('5.1 Offline with missing API keys returns success: true, provider: offline-rules', async () => {
            const origKey = aiExplanationEngineInstance.apiKey;
            const origOR = aiExplanationEngineInstance.openRouterKey;
            try {
                aiExplanationEngineInstance.apiKey = '';
                aiExplanationEngineInstance.openRouterKey = '';

                const res = await explainMistake({
                    question: 'Offline question',
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: 'TRAP-01'
                });
                assert.strictEqual(res.success, true);
                assert.strictEqual(res.provider, 'offline-rules');
            } finally {
                aiExplanationEngineInstance.apiKey = origKey;
                aiExplanationEngineInstance.openRouterKey = origOR;
            }
        });

        await recordTest('5.2 Invalid / rejected API keys fall back gracefully to Tier 3 (offline-rules)', async () => {
            const origKey = aiExplanationEngineInstance.apiKey;
            const origOR = aiExplanationEngineInstance.openRouterKey;
            try {
                aiExplanationEngineInstance.apiKey = 'AIzaSy_FAKE_INVALID_GEMINI_KEY_XYZ';
                aiExplanationEngineInstance.openRouterKey = 'sk-or-FAKE_INVALID_OPENROUTER_KEY_XYZ';

                const res = await explainMistake({
                    question: 'Invalid API key test',
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: 'TRAP-06'
                });
                assert.strictEqual(res.success, true);
                assert.strictEqual(res.provider, 'offline-rules');
                assert(res.explanation.includes('Wait/Actually'));
            } finally {
                aiExplanationEngineInstance.apiKey = origKey;
                aiExplanationEngineInstance.openRouterKey = origOR;
            }
        });

        await recordTest('5.3 HTTP endpoint with invalid keys returns HTTP 200 (never 500)', async () => {
            const res = await makeHttpRequest({
                body: {
                    question: 'Does server return 200 on API key failure?',
                    userAnswer: 'A',
                    correctAnswer: 'B',
                    part: 5,
                    trapCategory: 'TRAP-10'
                }
            });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.provider, 'offline-rules');
        });

        await recordTest('5.4 Concurrent burst stress: 50 simultaneous requests all return HTTP 200 (0% 500/crash)', async () => {
            const burstPromises = [];
            for (let i = 0; i < 50; i++) {
                burstPromises.push(makeHttpRequest({
                    body: {
                        question: `Burst question #${i} testing concurrency`,
                        userAnswer: 'Option A',
                        correctAnswer: 'Option B',
                        part: (i % 7) + 1,
                        trapCategory: `TRAP-${String((i % 12) + 1).padStart(2, '0')}`
                    }
                }));
            }

            const results = await Promise.all(burstPromises);
            assert.strictEqual(results.length, 50);
            const non200 = results.filter(r => r.status !== 200);
            assert.strictEqual(non200.length, 0, `Expected 0 non-200 responses, got ${non200.length}`);
            const failedBodies = results.filter(r => !r.body || r.body.success !== true);
            assert.strictEqual(failedBodies.length, 0, `Expected 0 failed bodies, got ${failedBodies.length}`);
        });

    } finally {
        console.log('\n[Phase Clean] Stopping test server...');
        stopServer();
        console.log('[Phase Clean] Server stopped.\n');
    }

    console.log('================================================================');
    console.log(`TOTAL ADVERSARIAL TESTS: ${totalTests}`);
    console.log(`PASSED: ${passedTests}`);
    console.log(`FAILED: ${failedTests}`);
    console.log('================================================================\n');

    if (failureLog.length > 0) {
        console.log('FAILED TESTS SUMMARY:');
        failureLog.forEach((f, idx) => {
            console.log(`  ${idx + 1}. [${f.test}] -> ${f.error}`);
        });
    }

    return { total: totalTests, passed: passedTests, failed: failedTests, failures: failureLog };
}

if (require.main === module) {
    runAdversarialSuite().then(res => {
        process.exit(res.failed > 0 ? 1 : 0);
    }).catch(err => {
        console.error('Test runner fatal error:', err);
        stopServer();
        process.exit(1);
    });
}

module.exports = { runAdversarialSuite };
