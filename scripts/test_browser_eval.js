const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-eval-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9293',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9293/json/list', r => {
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
    await send('Page.navigate', { url: 'http://localhost:3000/' });

    let ready = false;
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 250));
        const hasDb = await ev(`typeof window.DailyDictationDatabase !== 'undefined'`);
        if (hasDb) {
            console.log(`✅ Loaded DailyDictationDatabase at iteration ${i}!`);
            ready = true;
            break;
        }
    }

    if (!ready) {
        console.error('❌ Failed to load DailyDictationDatabase in time!');
        ws.close();
        chrome.kill();
        process.exit(1);
    }

    const info = await ev(`(() => {
        return {
            title: document.title,
            testsCount: window.DailyDictationDatabase.summary.length,
            hasWorkstation: typeof window.DailyDictationWorkstation !== 'undefined'
        };
    })()`);
    console.log('Browser Info:', info);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
