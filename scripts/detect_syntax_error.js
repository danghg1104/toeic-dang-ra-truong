const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-err2-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9286',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9286/json/list', r => {
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

    await send('Runtime.enable');
    ws.on('message', (d) => {
        const msg = JSON.parse(d);
        if (msg.method === 'Runtime.exceptionThrown') {
            console.error('🔥 EXCEPTION THROWN:', JSON.stringify(msg.params.exceptionDetails, null, 2));
        }
        if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value).join(' '));
        }
    });

    await send('Page.enable');
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 3000));

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
