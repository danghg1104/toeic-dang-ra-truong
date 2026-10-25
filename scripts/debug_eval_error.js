const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-err-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9287',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9287/json/list', r => {
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
            if (msg.id === i) { ws.off('message', h); r(msg); }
        });
        ws.send(JSON.stringify({ id: i, method: m, params: p }));
    });

    await send('Page.enable');
    await new Promise(r => setTimeout(r, 2000));

    // Try a simple evaluate
    const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
            return {
                user: window.currentUserAccount,
                fn: typeof switchTab,
                db: typeof window.DailyDictationDatabase,
                ws: typeof window.DailyDictationWorkstation
            };
        })()`,
        returnByValue: true
    });
    console.log('Eval 1:', JSON.stringify(evalRes, null, 2));

    // Now try switchTab directly
    const switchRes = await send('Runtime.evaluate', {
        expression: `(() => {
            try {
                // How does the app login normally?
                const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
                window.currentUserAccount = u;
                localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
                if (typeof switchTab === 'function') {
                    switchTab('nghe-chinh-ta');
                    return 'switched ok to: ' + state.currentTab;
                }
                return 'no switchTab';
            } catch(e) {
                return 'Error: ' + e.message + '\\n' + e.stack;
            }
        })()`,
        returnByValue: true
    });
    console.log('Eval 2 (switch):', JSON.stringify(switchRes, null, 2));

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
