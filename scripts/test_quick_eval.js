const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function test() {
    const tmp = os.tmpdir() + '\\ch-test-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9290',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9290/json/list', r => {
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

    // Wait until document.readyState === 'complete'
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 200));
        const readyState = await ev(`document.readyState`);
        if (readyState === 'complete') {
            console.log(`Document ready complete at ${i * 200}ms!`);
            break;
        }
    }

    const res = await ev(`(() => {
        return {
            href: window.location.href,
            btn: !!document.getElementById('nav-nghe-chinh-ta'),
            view: !!document.getElementById('view-nghe-chinh-ta'),
            workstation: !!window.DailyDictationWorkstation
        };
    })()`);
    console.log('Result:', res);

    ws.close();
    chrome.kill();
    process.exit(0);
}

test().catch(console.error);
