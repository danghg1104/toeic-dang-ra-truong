const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('📸 Capturing official DailyDictation proofs on real page target...');
    const tmp = os.tmpdir() + '\\ch-target-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9289',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9289/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej));
            if (list && list.length) {
                const found = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension'));
                if (found) {
                    list = [found];
                    break;
                }
            }
        } catch(e) {}
    }

    const pageTarget = list[0];
    console.log('Target page URL:', pageTarget.url);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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

    const snap = async (filename) => {
        const res = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(ARTIFACT_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
        console.log(`📸 Saved screenshot: ${filename} (${Math.round(res.data.length * 0.75 / 1024)} KB)`);
    };

    await send('Page.enable');

    // Wait until document and DailyDictation scripts are loaded
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 250));
        const ready = await ev(`typeof window.DailyDictationWorkstation !== 'undefined' && typeof window.DailyDictationDatabase !== 'undefined'`);
        if (ready) {
            console.log(`✅ Page scripts ready at ${i * 250}ms!`);
            break;
        }
    }

    // Authenticate user & close auth modal
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof currentUserAccount !== 'undefined') currentUserAccount = u;
        if (typeof closeAuthModal === 'function') closeAuthModal();
        const m = document.getElementById('authModal');
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
    })()`);

    // Switch to tab nghe-chinh-ta
    console.log('Switching to tab "nghe-chinh-ta"...');
    await ev(`(() => {
        switchTab('nghe-chinh-ta');
    })()`);
    await new Promise(r => setTimeout(r, 800));

    // =========================================================================
    // Proof 1: Test 1 Expanded Grid (Matching Image 3)
    // =========================================================================
    console.log('Proof 1: Capturing Practice Test 1 Expanded Grid (Matching Image 3)...');
    await ev(`(() => {
        window.DailyDictationWorkstation.openAccordions.clear();
        window.DailyDictationWorkstation.openAccordions.add(1);
        window.DailyDictationWorkstation.renderCatalog();
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('dailydictation_test1_expanded.png');

    // =========================================================================
    // Proof 2: All 30 Practice Tests Collapsed Catalog (Matching Image 1 & 2)
    // =========================================================================
    console.log('Proof 2: Capturing Collapsed Catalog (Matching Image 1 & 2)...');
    await ev(`(() => {
        window.DailyDictationWorkstation.openAccordions.clear();
        window.DailyDictationWorkstation.renderCatalog();
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('dailydictation_catalog_all_tests.png');

    // =========================================================================
    // Proof 3: Exercise Workstation for Conversation 1 (Matching Image 4)
    // =========================================================================
    console.log('Proof 3: Opening Conversation 1 (Office Copier Breakdown, Matching Image 4)...');
    await ev(`(async () => {
        await window.DailyDictationWorkstation.openLesson(1, 'conversation-1.1481');
    })()`);
    await new Promise(r => setTimeout(r, 1200));
    await snap('dailydictation_exercise_conversation1.png');

    // =========================================================================
    // Proof 4: Typing & Checking answer
    // =========================================================================
    console.log('Proof 4: Typing answer and checking...');
    await ev(`(() => {
        const input = document.getElementById('ddwInput');
        if (input) {
            input.value = 'Good morning, Jack.';
            window.DailyDictationWorkstation.onUserTyping(input.value);
            window.DailyDictationWorkstation.checkAnswer();
        }
    })()`);
    await new Promise(r => setTimeout(r, 800));
    await snap('dailydictation_exercise_checked.png');

    // =========================================================================
    // Proof 5: Full Transcript Tab
    // =========================================================================
    console.log('Proof 5: Switching to Full transcript tab...');
    await ev(`(() => {
        window.DailyDictationWorkstation.switchTab('transcript');
    })()`);
    await new Promise(r => setTimeout(r, 800));
    await snap('dailydictation_full_transcript.png');

    console.log('🎉 All 5 DailyDictation visual proofs captured successfully!');
    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
