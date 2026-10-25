const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function main() {
    const tmp = os.tmpdir() + '\\ch-chk-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9282',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9282/json/list', r => {
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
    await new Promise(r => setTimeout(r, 3000));

    const domInfo = await ev(`(() => {
        return {
            bodyChildren: document.body ? document.body.children.length : 0,
            hasToastBox: !!document.getElementById('toastBox'),
            scriptTagsInDoc: document.getElementsByTagName('script').length,
            lastScriptContent: document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1]?.innerHTML?.substring(0, 50)
        };
    })()`);
    console.log('DOM Info:', domInfo);

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(console.error);
