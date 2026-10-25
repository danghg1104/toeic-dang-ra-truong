const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-ctx-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9285',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9285/json/list', r => {
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

    const contexts = [];
    ws.on('message', (d) => {
        const msg = JSON.parse(d);
        if (msg.method === 'Runtime.executionContextCreated') {
            contexts.push(msg.params.context);
            console.log('Created context:', msg.params.context.id, msg.params.context.name, msg.params.context.origin);
        }
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await new Promise(r => setTimeout(r, 2000));

    console.log('Total contexts:', contexts.length);
    for (const ctx of contexts) {
        const res = await send('Runtime.evaluate', {
            contextId: ctx.id,
            expression: `({
                url: window.location.href,
                hasSwitchTab: typeof window.switchTab,
                hasWorkstation: typeof window.DailyDictationWorkstation
            })`,
            returnByValue: true
        });
        console.log(`Context ${ctx.id} (${ctx.name}):`, res.result ? res.result.result.value : res);
    }

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
