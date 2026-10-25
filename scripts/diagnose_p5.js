const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

(async () => {
    const tmp = os.tmpdir() + '\\ch-clean-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9298',
        '--disable-extensions',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9298/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej));
            if (list && list.length) break;
        } catch(e) {}
    }

    const pageTarget = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.on('open', r));

    let id = 1;
    const send = (m, p = {}) => new Promise(r => {
        const i = id++;
        ws.on('message', function h(d) {
            const msg = JSON.parse(d);
            if (msg.id === i) { ws.off('message', h); r(msg.result); }
        });
        ws.send(JSON.stringify({ id: i, method: m, params: p }));
    });

    const ev = async (e) => {
        const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
        return r?.result?.value;
    };

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/#doc' });

    console.log('Waiting for page scripts to load...');
    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        const ready = await ev(`typeof window.startQuickQuiz === 'function' && typeof window.Ets2026Database !== 'undefined'`);
        if (ready) {
            console.log(`Page ready after ${i * 200}ms!`);
            break;
        }
    }

    // Inject logged in user in browser context
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang', name: 'Dang Official' };
        window.localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
    })()`);

    console.log('Testing startPractice(5)...');
    await ev(`window.Ets2026Database.startPractice(5)`);
    await new Promise(r => setTimeout(r, 1200));

    const modalState = await ev(`(() => {
        const m = document.getElementById('quizModal');
        return {
            modalVisible: m ? !m.classList.contains('hidden') : false,
            title: document.getElementById('quizModalTitle')?.textContent,
            qText: document.getElementById('quizQuestionText')?.textContent,
            options: Array.from(document.querySelectorAll('#quizOptionsContainer button')).map(b => b.textContent.trim())
        };
    })()`);
    console.log('Part 5 Modal Result:', modalState);

    // Answer Q101 with option B (index 1)
    await ev(`(() => {
        const btn = document.querySelectorAll('#quizOptionsContainer button')[1];
        if (btn) selectQuizAnswer(1, btn);
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const explText = await ev(`document.getElementById('quizExplanationBox')?.textContent.slice(0, 200)`);
    console.log('Q101 Explanation:', explText);

    ws.close();
    chrome.kill();
    process.exit(0);
})().catch(e => {
    console.error('Test error:', e);
    process.exit(1);
});
