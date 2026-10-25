const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
    const p = spawn(CHROME_PATH, [
        '--headless=new',
        '--remote-debugging-port=9227',
        '--disable-gpu',
        'http://localhost:3000/#nghe'
    ]);
    await new Promise(r => setTimeout(r, 2000));
    const targets = await new Promise((res, rej) => {
        http.get('http://127.0.0.1:9227/json', r => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => res(JSON.parse(d)));
        }).on('error', rej);
    });
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.on('open', r));

    function evalJs(expr) {
        return new Promise(resolve => {
            const id = Math.floor(Math.random() * 1000000);
            const onMsg = (raw) => {
                const msg = JSON.parse(raw);
                if (msg.id === id) {
                    ws.off('message', onMsg);
                    resolve(msg.result);
                }
            };
            ws.on('message', onMsg);
            ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
        });
    }

    await new Promise(r => setTimeout(r, 1500));
    await evalJs("window.currentUserAccount = { id: 'u1', name: 'User' }; true;");

    console.log('--- CALL 1: Tranh tả người ---');
    const r1 = await evalJs(`
        try {
            startQuickQuiz('listening_part1', 'Part 1: Tranh tả người');
            ({ ok: true, title: document.getElementById('quizModalTitle').textContent });
        } catch(e) {
            ({ err: e.message, stack: e.stack });
        }
    `);
    console.log('Call 1:', r1?.result?.value);

    console.log('--- CALL 2: Tranh tả vật ---');
    const r2 = await evalJs(`
        try {
            startQuickQuiz('listening_part1', 'Part 1: Tranh tả vật');
            ({ ok: true, title: document.getElementById('quizModalTitle').textContent });
        } catch(e) {
            ({ err: e.message, stack: e.stack });
        }
    `);
    console.log('Call 2:', r2?.result?.value);

    ws.close();
    p.kill();
}
main().catch(console.error);
