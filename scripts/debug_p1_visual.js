const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

(async () => {
    const tmp = os.tmpdir() + '\\ch-debug-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9277',
        '--user-data-dir=' + tmp
    ]);
    await new Promise(r => setTimeout(r, 1500));
    const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9277/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }));
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
    const ev = async (e) => {
        const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
        return r?.result?.value;
    };
    await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });
    await new Promise(r => setTimeout(r, 2000));
    await ev('window.Ets2026Database.startPractice(1)');
    await new Promise(r => setTimeout(r, 1000));

    const item = await ev('window.ToeicListeningWorkstation.items[0]');
    console.log('Workstation Item 0:', item);

    const visualHtml = await ev('document.getElementById("tlwVisualArea")?.innerHTML');
    console.log('tlwVisualArea HTML:', visualHtml);

    const currentPart = await ev('window.ToeicListeningWorkstation.part');
    console.log('Workstation Part:', currentPart);

    ws.close();
    chrome.kill();
    process.exit(0);
})().catch(e => {
    console.error(e);
    process.exit(1);
});
