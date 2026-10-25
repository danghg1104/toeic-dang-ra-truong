const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-html-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9280',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9280/json/list', r => {
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

    let mainContextId = null;
    ws.on('message', (d) => {
        const msg = JSON.parse(d);
        if (msg.method === 'Runtime.executionContextCreated') {
            const ctx = msg.params.context;
            if (ctx.origin.includes('localhost:3000')) {
                mainContextId = ctx.id;
            }
        }
    });

    await send('Runtime.enable');
    await send('Page.enable');

    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (mainContextId !== null) break;
    }

    // Wait until document.readyState is complete
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 250));
        const res = await send('Runtime.evaluate', {
            contextId: mainContextId,
            expression: `document.readyState`,
            returnByValue: true
        });
        if (res.result && res.result.result.value === 'complete') {
            console.log(`Document ready complete at ${i * 250}ms!`);
            break;
        }
    }

    const htmlRes = await send('Runtime.evaluate', {
        contextId: mainContextId,
        expression: `({
            title: document.title,
            bodyLength: document.body ? document.body.innerHTML.length : 0,
            bodyStart: document.body ? document.body.innerHTML.substring(0, 500) : '',
            scriptsCount: document.scripts.length
        })`,
        returnByValue: true
    });
    console.log('HTML details:', htmlRes.result ? htmlRes.result.result.value : htmlRes);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
