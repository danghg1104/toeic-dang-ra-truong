const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-eval2-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9281',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9281/json/list', r => {
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
                console.log('🎯 Found main context:', ctx.id, ctx.name, ctx.origin);
            }
        }
    });

    await send('Runtime.enable');
    await send('Page.enable');

    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (mainContextId !== null) break;
    }

    console.log('Evaluating in context:', mainContextId);

    const res = await send('Runtime.evaluate', {
        contextId: mainContextId,
        expression: `({
            url: window.location.href,
            hasToast: !!document.getElementById('toastBox'),
            hasNav: !!document.getElementById('nav-nghe-chinh-ta'),
            hasView: !!document.getElementById('view-nghe-chinh-ta'),
            hasWorkstation: !!window.DailyDictationWorkstation,
            hasDatabase: !!window.DailyDictationDatabase
        })`,
        returnByValue: true
    });
    console.log('Result in main context:', res.result ? res.result.result.value : res);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
