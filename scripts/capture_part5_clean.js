const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
    const tmp = os.tmpdir() + '\\ch-part5-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9297',
        '--disable-extensions',
        '--window-size=1440,900',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9297/json/list', r => {
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
    await send('Page.navigate', { url: 'http://localhost:3000/#doc' });
    await new Promise(r => setTimeout(r, 2500));

    // Open Part 5 reference set
    const openRes = await ev(`(() => {
        if (!window.ToeicReadingWorkstation) return 'no workstation';
        window.ToeicReadingWorkstation.open({
            part: 5,
            isEts2026: false,
            title: 'Part 5 - Incomplete Sentences (Điền từ)',
            topic: ''
        });
        return 'opened ok, total: ' + window.ToeicReadingWorkstation.items.length;
    })()`);
    console.log('Open result:', openRes);

    await new Promise(r => setTimeout(r, 800));

    // Select option (B) her
    const selRes = await ev(`(() => {
        const item = window.ToeicReadingWorkstation.items[0];
        window.ToeicReadingWorkstation.selectOption(item.id, 1, 101);
        return 'selected: ' + item.question_number + ' - ' + item.question;
    })()`);
    console.log('Selection result:', selRes);

    await new Promise(r => setTimeout(r, 600));

    const snapRes = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(ARTIFACT_DIR, 'reading_workstation_part5_verified.png');
    fs.writeFileSync(filePath, Buffer.from(snapRes.data, 'base64'));
    console.log('Saved Part 5 verified screenshot! Size:', fs.statSync(filePath).size);

    ws.close();
    chrome.kill();
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
