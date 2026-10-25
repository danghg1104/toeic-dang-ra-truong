const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function captureAllProofs() {
    console.log('📸 Capturing Full Suite of ETS 2026 Verification Screenshots...');
    const tmp = os.tmpdir() + '\\ch-proofs-' + Date.now();
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

    const pageTarget = list.find(t => t.type === 'page') || list[0];
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
        console.log(`Saved screenshot: ${filename} (${Math.round(res.data.length * 0.75 / 1024)} KB)`);
    };

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });

    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (await ev(`typeof window.startQuickQuiz === 'function' && typeof window.Ets2026Database !== 'undefined'`)) break;
    }

    // Set auth and close auth modal if opened during initial hash routing
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        window.localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof closeAuthModal === 'function') closeAuthModal();
        const m = document.getElementById('authModal');
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
    })()`);

    // Screenshot 1: Listening Tab Showcase Banner with Test Selector
    await new Promise(r => setTimeout(r, 800));
    await snap('ets2026_banner_listening.png');

    // Screenshot 2: Switch to Test 02 and Launch Part 1 (verifies Test 2 photo & audio)
    await ev(`window.Ets2026Database.selectTest(2)`);
    await new Promise(r => setTimeout(r, 400));
    await ev(`window.Ets2026Database.startPractice(1, 2)`);
    await new Promise(r => setTimeout(r, 1500));
    await ev(`(() => {
        const item = window.ToeicListeningWorkstation.items[0];
        window.ToeicListeningWorkstation.selectOption(item, 1);
        window.ToeicListeningWorkstation.toggleTranscript();
        window.ToeicListeningWorkstation.toggleBilingual();
    })()`);
    await new Promise(r => setTimeout(r, 600));
    await snap('ets2026_workstation_part1_test2.png');

    // Screenshot 3: Part 3 in Listening Workstation (Test 2)
    await ev(`window.Ets2026Database.startPractice(3, 2)`);
    await new Promise(r => setTimeout(r, 1500));
    await ev(`(() => {
        window.ToeicListeningWorkstation.toggleTranscript();
        window.ToeicListeningWorkstation.toggleBilingual();
    })()`);
    await new Promise(r => setTimeout(r, 600));
    await snap('ets2026_workstation_part3_test2.png');

    // Close Workstation
    await ev(`window.ToeicListeningWorkstation.close()`);
    await new Promise(r => setTimeout(r, 400));

    // Ensure session is set & close auth modal
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        window.localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof closeAuthModal === 'function') closeAuthModal();
        const m = document.getElementById('authModal');
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
    })()`);

    // Screenshot 4: Reading Tab Showcase Banner with Test Selector
    await ev(`switchTab('doc')`);
    await new Promise(r => setTimeout(r, 800));
    await snap('ets2026_banner_reading.png');

    // Screenshot 5: Part 5 Incomplete Sentences Quiz Modal (Test 2)
    await ev(`window.Ets2026Database.startPractice(5, 2)`);
    await new Promise(r => setTimeout(r, 1500));
    await ev(`(() => {
        const btn = document.querySelectorAll('#quizOptionsContainer button')[1];
        if (btn) selectQuizAnswer(1, btn);
    })()`);
    await new Promise(r => setTimeout(r, 800));
    await snap('ets2026_quiz_part5_test2.png');

    // Close Quiz Modal
    await ev(`(() => {
        const m = document.getElementById('quizModal');
        if (m) m.classList.add('hidden');
    })()`);
    await new Promise(r => setTimeout(r, 400));

    // Screenshot 6: Exam Arena (#thi-thu) Mock Test Cards with 10 Tests Picker
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        window.localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof closeAuthModal === 'function') closeAuthModal();
        const m = document.getElementById('authModal');
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
        switchTab('thi-thu');
    })()`);
    await new Promise(r => setTimeout(r, 800));
    await ev(`(() => {
        const btnT03 = document.querySelectorAll('#etsArenaTestPicker button')[2];
        if (btnT03) setArenaEtsTest(3, btnT03);
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('ets2026_arena_mock_card.png');

    console.log('✅ All proofs captured successfully!');
    ws.close();
    chrome.kill();
    process.exit(0);
}

captureAllProofs().catch(e => {
    console.error(e);
    process.exit(1);
});
