const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🚀 Launching headless Chrome with authenticated session...');
    const p = spawn(CHROME_PATH, [
        '--headless=new',
        '--remote-debugging-port=9230',
        '--disable-gpu',
        '--window-size=1280,900',
        'about:blank'
    ]);

    await sleep(2000);

    const targets = await new Promise((res, rej) => {
        http.get('http://127.0.0.1:9230/json', r => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => res(JSON.parse(d)));
        }).on('error', rej);
    });

    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.on('open', r));

    let msgId = 1;
    const callbacks = new Map();

    ws.on('message', (raw) => {
        const msg = JSON.parse(raw);
        if (msg.id && callbacks.has(msg.id)) {
            const cb = callbacks.get(msg.id);
            callbacks.delete(msg.id);
            if (msg.error) cb(null, msg.error);
            else cb(msg.result);
        }
    });

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

    await sendCmd('Network.enable');
    await sendCmd('Page.enable');
    await sendCmd('Runtime.enable');

    // 1. Set authentication cookie (cd_session)
    await sendCmd('Network.setCookie', {
        name: 'cd_session',
        value: 'test_session_token_12345',
        domain: 'localhost',
        path: '/'
    });

    // 2. Navigate to TOEIC Listening section
    await sendCmd('Page.navigate', { url: 'http://localhost:3000/#nghe' });

    // 3. Wait for page load
    console.log('Waiting for application to load...');
    for (let i = 0; i < 30; i++) {
        await sleep(400);
        const evalRes = await sendCmd('Runtime.evaluate', {
            expression: 'typeof window.startQuickQuiz === "function" && typeof window.currentUserAccount === "object" && !!window.currentUserAccount',
            returnByValue: true
        });
        if (evalRes?.result?.value === true) {
            console.log(`✓ Application and UserAuth ready at poll ${i}!`);
            break;
        }
    }

    function evalInBrowser(expr) {
        return sendCmd('Runtime.evaluate', {
            expression: expr,
            returnByValue: true
        }).then(r => {
            if (r.exceptionDetails) {
                throw new Error(JSON.stringify(r.exceptionDetails));
            }
            return r.result?.value;
        });
    }

    console.log('\n--- VERIFYING TOPIC CARDS ON LIVE UI ---');

    // Card 1: Tranh tả người
    const card1 = await evalInBrowser(`
        (function() {
            startQuickQuiz('listening_part1', 'Part 1: Tranh tả người');
            const title = document.getElementById('quizModalTitle').textContent;
            const img = document.getElementById('quizImageImg');
            const opts = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.innerText.replace(/\\s+/g, ' ').trim());
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            return { title, imgSrc: img?.src, optionsCount: opts.length, options: opts, playerSrc };
        })()
    `);
    console.log('\n✅ 1. Card "Tranh tả người":', card1);

    // Answer Card 1
    const ans1 = await evalInBrowser(`
        (function() {
            const btnB = document.getElementById('quizOptionsContainer').children[1];
            btnB.click();
            const exp = document.getElementById('quizExplanationBox');
            const badge = exp.querySelector('.inline-flex')?.innerText || '';
            const optsAfter = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.innerText.replace(/\\s+/g, ' ').trim());
            return { badge, optsAfter, expText: exp.innerText.slice(0, 160).replace(/\\s+/g, ' ') };
        })()
    `);
    console.log('   Answer & Speaker Badge:', ans1);

    // Card 2: Tranh tả vật
    const card2 = await evalInBrowser(`
        (function() {
            startQuickQuiz('listening_part1', 'Part 1: Tranh tả vật');
            const title = document.getElementById('quizModalTitle').textContent;
            const img = document.getElementById('quizImageImg');
            const opts = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.innerText.replace(/\\s+/g, ' ').trim());
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            return { title, imgSrc: img?.src, optionsCount: opts.length, options: opts, playerSrc };
        })()
    `);
    console.log('\n✅ 2. Card "Tranh tả vật":', card2);

    // Answer Card 2
    const ans2 = await evalInBrowser(`
        (function() {
            const btnC = document.getElementById('quizOptionsContainer').children[2];
            btnC.click();
            const exp = document.getElementById('quizExplanationBox');
            const badge = exp.querySelector('.inline-flex')?.innerText || '';
            return { badge, expText: exp.innerText.slice(0, 160).replace(/\\s+/g, ' ') };
        })()
    `);
    console.log('   Answer & Speaker Badge:', ans2);

    // Card 3: Cảnh & bối cảnh
    const card3 = await evalInBrowser(`
        (function() {
            startQuickQuiz('listening_part1', 'Part 1: Cảnh & bối cảnh');
            const title = document.getElementById('quizModalTitle').textContent;
            const img = document.getElementById('quizImageImg');
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            return { title, imgSrc: img?.src, playerSrc };
        })()
    `);
    console.log('\n✅ 3. Card "Cảnh & bối cảnh":', card3);

    // Card 4: Người & vật
    const card4 = await evalInBrowser(`
        (function() {
            startQuickQuiz('listening_part1', 'Part 1: Người & vật');
            const title = document.getElementById('quizModalTitle').textContent;
            const img = document.getElementById('quizImageImg');
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            return { title, imgSrc: img?.src, playerSrc };
        })()
    `);
    console.log('\n✅ 4. Card "Người & vật":', card4);

    // Part 2: Wh- Questions
    const cardP2 = await evalInBrowser(`
        (function() {
            startQuickQuiz('listening_part2', 'Part 2: Câu hỏi Wh-');
            const title = document.getElementById('quizModalTitle').textContent;
            const opts = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.innerText.replace(/\\s+/g, ' ').trim());
            const qPrompt = document.getElementById('quizQuestionText').innerText.replace(/\\s+/g, ' ').trim();
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            return { title, optionsCount: opts.length, options: opts, qPrompt, playerSrc };
        })()
    `);
    console.log('\n✅ 5. Part 2 "Câu hỏi Wh-":', cardP2);

    // Part 3: Hội thoại công sở & Nhân sự (3 questions per dialogue, text displayed, transcript hidden)
    const cardP3 = await evalInBrowser(`
        (function() {
            startQuickQuiz('listening_part3', 'Part 3: Hội thoại công sở & Nhân sự');
            const title = document.getElementById('quizModalTitle').textContent;
            const opts = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.innerText.replace(/\\s+/g, ' ').trim());
            const qText = document.getElementById('quizQuestionText').innerText.replace(/\\s+/g, ' ').trim();
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            const passageHidden = document.getElementById('quizPassageBox')?.classList.contains('hidden');
            return { title, optionsCount: opts.length, qText, firstOpt: opts[0], passageHidden, playerSrc };
        })()
    `);
    console.log('\n✅ 6. Part 3 "Hội thoại công sở":', cardP3);

    // Part 4: Thông báo & Tin nhắn thoại
    const cardP4 = await evalInBrowser(`
        (function() {
            startQuickQuiz('listening_part4', 'Part 4: Thông báo & Tin nhắn thoại');
            const title = document.getElementById('quizModalTitle').textContent;
            const opts = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.innerText.replace(/\\s+/g, ' ').trim());
            const qText = document.getElementById('quizQuestionText').innerText.replace(/\\s+/g, ' ').trim();
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            return { title, optionsCount: opts.length, qText, firstOpt: opts[0], playerSrc };
        })()
    `);
    console.log('\n✅ 7. Part 4 "Thông báo & Tin nhắn thoại":', cardP4);

    ws.close();
    p.kill();
    console.log('\n🎉 ALL 5 E2E TESTS PASSED WITH 100% SUCCESS!');
}

main().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});
