const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('📸 Taking visual proof of Thi Thử Arena without fake tests...');
    const tmp = os.tmpdir() + '\\ch-arena-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9298',
        '--disable-extensions',
        '--window-size=1440,1100',
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

    const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }))?.result?.value;

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/#thi-thu' });

    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (await ev(`typeof window.switchTab === 'function'`)) break;
    }

    // Set auth and switch to thi-thu view cleanly
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        window.localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof closeAuthModal === 'function') closeAuthModal();
        const m = document.getElementById('authModal');
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
        switchTab('thi-thu');
        window.scrollTo(0, 300);
    })()`);

    await new Promise(r => setTimeout(r, 1200));

    const res = await send('Page.captureScreenshot', { format: 'png' });
    const targetPath = path.join(ARTIFACT_DIR, 'thi_thu_official_10_de_ets2026.png');
    fs.writeFileSync(targetPath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${targetPath}`);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
