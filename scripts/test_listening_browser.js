const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
    console.log('🚀 Starting Chrome headless with remote debugging on port 9222...');
    const chromeProc = spawn(CHROME_PATH, [
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--no-sandbox',
        '--window-size=1280,900',
        'http://localhost:3000/#nghe'
    ]);

    await sleep(2500);

    // Fetch WebSocket debugger URL from Chrome
    const targets = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9222/json', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    console.log('Connected to target:', pageTarget.title, pageTarget.url);

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.on('message', (raw) => {
        const msg = JSON.parse(raw);
        if (msg.id && callbacks.has(msg.id)) {
            const cb = callbacks.get(msg.id);
            callbacks.delete(msg.id);
            cb(msg.result, msg.error);
        }
    });

    await new Promise(r => ws.on('open', r));

    function sendCmd(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = msgId++;
            callbacks.set(id, (res, err) => {
                if (err) reject(err);
                else resolve(res);
            });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    await sendCmd('Runtime.enable');
    await sendCmd('Page.enable');

    console.log('Evaluating UI tests in browser...');

    // 1. Simulate login so user account gate is passed
    await sendCmd('Runtime.evaluate', {
        expression: `
            window.currentUserAccount = { id: 'test_user', name: 'Tester', email: 'test@toeic.vn', role: 'admin' };
            localStorage.setItem('cung_dang_ra_truong_session_user', JSON.stringify(window.currentUserAccount));
            true;
        `
    });

    // 2. Test Part 1: Tranh tả người
    const res1 = await sendCmd('Runtime.evaluate', {
        expression: `
            (function() {
                startQuickQuiz('listening_part1', 'Part 1: Tranh tả người');
                const modal = document.getElementById('quizModal');
                const img = document.getElementById('quizImageImg');
                const title = document.getElementById('quizModalTitle').textContent;
                const opts = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.textContent.trim());
                return {
                    title,
                    imgSrc: img ? img.src : null,
                    optsCount: opts.length,
                    firstOptText: opts[0]
                };
            })()
        `,
        returnByValue: true
    });
    console.log('\n[Test Card 1: Tranh tả người]', JSON.stringify(res1));
    console.log('Answer explanation & badge:', JSON.stringify(resAns1));
    console.log('\n[Test Card 2: Tranh tả vật]', JSON.stringify(res2));
    console.log('\n[Test Card 3: Cảnh & bối cảnh]', JSON.stringify(res3));
    console.log('\n[Test Card 4: Người & vật]', JSON.stringify(res4));
    console.log('\n[Test Part 2: Câu hỏi Wh-]', JSON.stringify(resP2));

    ws.close();
    chromeProc.kill();
    console.log('\n🎉 UI tests completed successfully!');
    process.exit(0);
}

runTest().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});
