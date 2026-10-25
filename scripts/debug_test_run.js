const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-debug-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9294',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9294/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej));
            if (list && list.length) break;
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
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(r => setTimeout(r, 2500));

    const check1 = await ev(`(() => {
        return {
            hasDailyDictationDatabase: typeof window.DailyDictationDatabase !== 'undefined',
            hasDailyDictationWorkstation: typeof window.DailyDictationWorkstation !== 'undefined',
            summaryCount: window.DailyDictationDatabase ? window.DailyDictationDatabase.summary.length : 0,
            viewEl: !!document.getElementById('view-nghe-chinh-ta')
        };
    })()`);
    console.log('Check 1 (Init state):', check1);

    // Call switchTab('nghe-chinh-ta')
    const switchRes = await ev(`(() => {
        // Set user
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof currentUserAccount !== 'undefined') currentUserAccount = u;
        
        switchTab('nghe-chinh-ta');
        const v = document.getElementById('view-nghe-chinh-ta');
        return {
            currentTab: state.currentTab,
            viewClasses: v ? v.className : 'null',
            viewInnerLength: v ? v.innerHTML.length : 0,
            firstHeading: v ? (v.querySelector('h1') ? v.querySelector('h1').textContent : 'no h1') : 'no v'
        };
    })()`);
    console.log('Switch result:', switchRes);

    await new Promise(r => setTimeout(r, 800));

    const res = await send('Page.captureScreenshot', { format: 'png' });
    const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'debug_nghe_chinh_ta.png'), Buffer.from(res.data, 'base64'));
    console.log('Saved debug_nghe_chinh_ta.png, size:', res.data.length);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
