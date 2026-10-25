const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-switch-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9288',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9288/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej));
            if (list && list.length) {
                const found = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension'));
                if (found) { list = [found]; break; }
            }
        } catch(e) {}
    }

    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
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

    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (await ev(`typeof window.DailyDictationWorkstation !== 'undefined'`)) break;
    }

    const res = await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        window.currentUserAccount = u;
        localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        if (typeof currentUserAccount !== 'undefined') currentUserAccount = u;
        if (typeof applyCurrentAccountToUI === 'function') applyCurrentAccountToUI();
        if (typeof UserAuthEngine !== 'undefined') UserAuthEngine.dismissGatekeeper();
        if (typeof closeAuthModal === 'function') closeAuthModal();

        switchTab('nghe-chinh-ta');
        const v = document.getElementById('view-nghe-chinh-ta');
        return {
            currentTab: state.currentTab,
            vHidden: v?.classList.contains('hidden'),
            vLength: v?.innerHTML.length,
            title: v?.querySelector('h1')?.textContent
        };
    })()`);
    console.log('Switch test result:', res);

    await new Promise(r => setTimeout(r, 500));
    const snapRes = await send('Page.captureScreenshot', { format: 'png' });
    const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'test_switch_nghe_chinh_ta.png'), Buffer.from(snapRes.data, 'base64'));
    console.log('Saved test_switch_nghe_chinh_ta.png, size:', fs.statSync(path.join(ARTIFACT_DIR, 'test_switch_nghe_chinh_ta.png')).size);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
