const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
    const p = spawn(CHROME_PATH, ['--headless=new', '--remote-debugging-port=9228', '--disable-gpu', 'http://localhost:3000/#nghe']);
    await new Promise(r => setTimeout(r, 2000));
    const targets = await new Promise((res, rej) => {
        http.get('http://127.0.0.1:9228/json', r => {
            let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
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
                    if (msg.result?.exceptionDetails) {
                        console.error('EXCEPTION IN BROWSER:', JSON.stringify(msg.result.exceptionDetails));
                    }
                    resolve(msg.result?.result?.value);
                }
            };
            ws.on('message', onMsg);
            ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
        });
    }

    await new Promise(r => setTimeout(r, 1500));
    await evalJs("localStorage.setItem('cung_dang_session_user', JSON.stringify({id:'u1', name:'User'})); true;");

    // Wait for document.readyState === 'complete'
    for (let i = 0; i < 30; i++) {
        const state = await evalJs('document.readyState');
        if (state === 'complete') {
            console.log(`Document ready (poll ${i})`);
            break;
        }
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n--- CALL: Part 1: Tranh tả vật ---');
    const result = await evalJs(`
        (function() {
            startQuickQuiz('listening_part1', 'Part 1: Tranh tả vật');
            const title = document.getElementById('quizModalTitle').textContent;
            const img = document.getElementById('quizImageImg');
            const options = Array.from(document.getElementById('quizOptionsContainer').children).map(c => c.textContent.trim());
            const playerSrc = window._quizToeicPlayer?.audio?.src || '';
            return {
                title,
                imgSrc: img?.src,
                optionsCount: options.length,
                firstOption: options[0],
                playerSrc
            };
        })()
    `);
    console.log('Result for Tranh tả vật:', result);

    ws.close();
    p.kill();
}
main().catch(console.error);
