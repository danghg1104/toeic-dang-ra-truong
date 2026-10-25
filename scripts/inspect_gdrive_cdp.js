const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const DRIVE_URL = 'https://drive.google.com/drive/folders/1pRLwACjO3OuvOS18DG44WnLl-zZa5mJ_?usp=drive_link';

async function run() {
    console.log('🚀 Navigating to Google Drive folder via Chrome CDP...');
    const tmpProfile = os.tmpdir() + '\\chrome-gdrive-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9248',
        '--disable-gpu',
        '--window-size=1600,1000',
        '--user-data-dir=' + tmpProfile,
        '--no-first-run'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 300));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9248/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej));
            if (list && list.length) break;
        } catch(e) {}
    }

    const pageTarget = list.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.on('open', r));

    let msgId = 1;
    function send(method, params = {}) {
        return new Promise((resolve) => {
            const id = msgId++;
            const handler = (data) => {
                const msg = JSON.parse(data);
                if (msg.id === id) {
                    ws.off('message', handler);
                    resolve(msg.result);
                }
            };
            ws.on('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    async function evaluate(expr) {
        const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
        return res && res.result ? res.result.value : undefined;
    }

    await send('Page.enable');
    console.log('Navigating to:', DRIVE_URL);
    await send('Page.navigate', { url: DRIVE_URL });

    // Wait 8 seconds for Google Drive to render its SPA
    for (let s = 1; s <= 8; s++) {
        await new Promise(r => setTimeout(r, 1000));
        const title = await evaluate(`document.title`);
        console.log(`[${s}s] Page title: ${title}`);
    }

    // Capture screenshot
    const shotRes = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(ARTIFACT_DIR, 'gdrive_view.png');
    fs.writeFileSync(shotPath, Buffer.from(shotRes.data, 'base64'));
    console.log(`📸 Screenshot saved: ${shotPath}`);

    // Extract text / items from the page
    const pageData = await evaluate(`
        (() => {
            const title = document.title;
            const bodyText = document.body.innerText;
            const items = Array.from(document.querySelectorAll('[data-id], [role="row"], [role="gridcell"], div[aria-label]'))
                .map(el => el.getAttribute('aria-label') || el.innerText)
                .filter(Boolean)
                .map(s => s.trim())
                .filter((v, i, a) => a.indexOf(v) === i && v.length < 200);

            const links = Array.from(document.querySelectorAll('a'))
                .map(a => ({ text: a.innerText.trim(), href: a.href }))
                .filter(l => l.text || l.href.includes('drive'));

            return { title, bodySnippet: bodyText.slice(0, 1000), items: items.slice(0, 50), links: links.slice(0, 20) };
        })()
    `);

    console.log('Page Data:', JSON.stringify(pageData, null, 2));

    ws.close();
    chrome.kill();
}

run().catch(console.error);
