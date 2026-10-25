const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
    console.log('🚀 Testing Audio Playback in Chrome via CDP...');
    const tmpProfile = os.tmpdir() + '\\chrome-audio-test-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9247',
        '--disable-gpu',
        '--window-size=1440,900',
        '--user-data-dir=' + tmpProfile,
        '--no-first-run',
        '--autoplay-policy=no-user-gesture-required'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 300));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9247/json/list', r => {
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
    await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });

    // Wait for scripts
    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        const ready = await evaluate(`typeof window.ToeicListeningWorkstation !== 'undefined' && typeof window.startQuickQuiz === 'function'`);
        if (ready) break;
    }

    // Set auth
    await evaluate(`
        window.testUser = { email: 'admin@pass.edu', name: 'Đăng' };
        window.getCurrentUser = () => window.testUser;
        currentUserAccount = window.testUser;
        window.currentUserAccount = window.testUser;
    `);

    // Start Part 1
    console.log('Launching Part 1...');
    await evaluate(`startQuickQuiz('listening_part1', 'Part 1: Tranh tả người');`);
    await new Promise(r => setTimeout(r, 1000));

    // Inspect audio player
    const audioInfo = await evaluate(`
        (() => {
            const ws = window.ToeicListeningWorkstation;
            if (!ws || !ws.audio) return { error: 'Workstation or audio not found' };
            const audio = ws.audio;
            return {
                src: audio.src,
                currentSrc: audio.currentSrc,
                readyState: audio.readyState,
                paused: audio.paused,
                duration: audio.duration,
                currentTime: audio.currentTime,
                error: audio.error ? audio.error.message : null
            };
        })()
    `);
    console.log('Audio Info before play:', audioInfo);

    // Play audio and wait 3 seconds
    console.log('Triggering audio play...');
    await evaluate(`window.ToeicListeningWorkstation.togglePlay();`);
    await new Promise(r => setTimeout(r, 2500));

    const audioProgress = await evaluate(`
        (() => {
            const ws = window.ToeicListeningWorkstation;
            const audio = ws.audio;
            const timeDisplay = document.getElementById('tlwTimeDisplay')?.textContent;
            return {
                paused: audio.paused,
                duration: audio.duration,
                currentTime: audio.currentTime,
                timeDisplay: timeDisplay,
                error: audio.error ? audio.error.message : null
            };
        })()
    `);
    console.log('Audio Progress after 2.5s:', audioProgress);

    // Capture screenshot
    const shotRes = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(ARTIFACT_DIR, 'audio_fixed_workstation_playback.png');
    fs.writeFileSync(shotPath, Buffer.from(shotRes.data, 'base64'));
    console.log(`📸 Screenshot saved: ${shotPath}`);

    ws.close();
    chrome.kill();
    console.log('✅ Chrome CDP Audio Playback Test Completed!');
}

run().catch(console.error);
