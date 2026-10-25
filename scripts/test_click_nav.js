const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-click-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9291',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9291/json/list', r => {
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

    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (await ev(`typeof window.DailyDictationWorkstation !== 'undefined'`)) break;
    }

    // Capture console logs
    await send('Console.enable');
    ws.on('message', (d) => {
        const msg = JSON.parse(d);
        if (msg.method === 'Console.messageAdded') {
            console.log('BROWSER LOG:', msg.params.message.text);
        }
    });

    // What happens if we click #nav-nghe-chinh-ta?
    const clickResult = await ev(`(() => {
        const btn = document.getElementById('nav-nghe-chinh-ta');
        if (!btn) return 'no button';
        btn.click();
        return {
            clicked: true,
            currentTab: typeof state !== 'undefined' ? state.currentTab : 'no state',
            currentUserAccount: typeof currentUserAccount !== 'undefined' ? currentUserAccount : 'no user',
            viewDictationDisplay: document.getElementById('view-nghe-chinh-ta')?.className,
            authModalDisplay: document.getElementById('authModal')?.className
        };
    })()`);
    console.log('Click result:', clickResult);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
