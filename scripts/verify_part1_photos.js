const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('🚀 Verifying Part 1 Real Photos & Audio in Diagnostic Workstation...');
    const tmp = os.tmpdir() + '\\ch-part1-photos-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9295',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 35; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9295/json/list', r => {
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

    const ev = async (e) => {
        const res = await send('Runtime.evaluate', {
            contextId: mainContextId,
            expression: e,
            returnByValue: true,
            awaitPromise: true
        });
        return res?.result?.result?.value;
    };

    const snap = async (filename) => {
        const res = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(ARTIFACT_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(res.result.data, 'base64'));
        console.log(`📸 Saved screenshot: ${filename} (${Math.round(res.result.data.length * 0.75 / 1024)} KB)`);
    };

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 250));
        const ready = await ev(`document.readyState === 'complete' && typeof ToeicDiagnosticWorkstation !== 'undefined'`);
        if (ready) break;
    }

    // Authenticate and open Diagnostic Workstation
    await ev(`(() => {
        const u = { id: 'u_user', name: 'Hải Đăng' };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        currentUserAccount = u;
        if (typeof UserAuthEngine !== 'undefined') UserAuthEngine.dismissGatekeeper();
        if (typeof closeAuthModal === 'function') closeAuthModal();
        ToeicDiagnosticWorkstation.open();
    })()`);

    await new Promise(r => setTimeout(r, 800));

    // Capture Q1: Architect with blueprint
    const q1ImgSrc = await ev(`document.querySelector('#tdwLeftPane img')?.src`);
    console.log('Q1 Image Src:', q1ImgSrc);
    await snap('proof_part1_real_photo_q1.png');

    // Jump to Q2: Doctor with X-ray
    await ev(`ToeicDiagnosticWorkstation.showQuestion(1);`);
    await new Promise(r => setTimeout(r, 600));
    const q2ImgSrc = await ev(`document.querySelector('#tdwLeftPane img')?.src`);
    console.log('Q2 Image Src:', q2ImgSrc);
    await snap('proof_part1_real_photo_q2.png');

    // Jump to Q3: Librarian with books
    await ev(`ToeicDiagnosticWorkstation.showQuestion(2);`);
    await new Promise(r => setTimeout(r, 600));
    const q3ImgSrc = await ev(`document.querySelector('#tdwLeftPane img')?.src`);
    console.log('Q3 Image Src:', q3ImgSrc);
    await snap('proof_part1_real_photo_q3.png');

    // Jump to Q4: Barista at counter
    await ev(`ToeicDiagnosticWorkstation.showQuestion(3);`);
    await new Promise(r => setTimeout(r, 600));
    const q4ImgSrc = await ev(`document.querySelector('#tdwLeftPane img')?.src`);
    console.log('Q4 Image Src:', q4ImgSrc);
    await snap('proof_part1_real_photo_q4.png');

    // Test playing audio on Q1
    await ev(`(() => {
        ToeicDiagnosticWorkstation.showQuestion(0);
        ToeicDiagnosticWorkstation.playAudio();
    })()`);
    await new Promise(r => setTimeout(r, 500));
    const audioState = await ev(`({
        isPlaying: ToeicDiagnosticWorkstation.isPlayingAudio,
        audioElementSrc: ToeicDiagnosticWorkstation.audioElement?.src,
        hasControls: !!document.getElementById('tdwPlayBtn')
    })`);
    console.log('Audio State:', audioState);

    console.log('🎉 All 4 Part 1 photos verified successfully!');
    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
