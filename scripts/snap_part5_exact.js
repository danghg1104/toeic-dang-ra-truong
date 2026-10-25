const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('🚀 Snapping exact Part 5 Workstation matching Image 2...');
    const tmp = os.tmpdir() + '\\ch-part5-exact-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9296',
        '--disable-extensions',
        '--window-size=1440,900',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9296/json/list', r => {
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

    const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }))?.result?.value;

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/#doc' });

    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (await ev(`typeof window.ToeicReadingWorkstation !== 'undefined'`)) break;
    }

    // Set auth session
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        window.localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof closeAuthModal === 'function') closeAuthModal();
        const m = document.getElementById('authModal');
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
    })()`);

    // Await open() completely
    console.log('Opening Part 5 Workstation...');
    const openRes = await ev(`(async () => {
        await window.ToeicReadingWorkstation.open({
            part: 5,
            isEts2026: false,
            title: 'Part 5 - Incomplete Sentences (Điền từ)',
            topic: ''
        });
        return {
            isOpen: window.ToeicReadingWorkstation.isOpen,
            itemCount: window.ToeicReadingWorkstation.items.length,
            firstQ: window.ToeicReadingWorkstation.items[0]?.q
        };
    })()`);
    console.log('Workstation state:', openRes);

    await new Promise(r => setTimeout(r, 600));

    // Select option (B) her
    const selRes = await ev(`(() => {
        const item = window.ToeicReadingWorkstation.items[0];
        window.ToeicReadingWorkstation.selectOption(item.id, 1, 101);
        return {
            answered: window.ToeicReadingWorkstation.userAnswers[item.id],
            state: window.ToeicReadingWorkstation.answeredState[item.id]
        };
    })()`);
    console.log('Selection state:', selRes);

    await new Promise(r => setTimeout(r, 600));

    const snapRes = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(ARTIFACT_DIR, 'reading_workstation_part5_verified.png');
    fs.writeFileSync(filePath, Buffer.from(snapRes.data, 'base64'));
    console.log('✅ Overwritten Part 5 screenshot successfully! Size:', fs.statSync(filePath).size);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
