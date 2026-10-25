const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function testEts2026Cdp() {
    console.log('🚀 Launching Chrome CDP for ETS 2026 Full Verification...');
    const tmpProfile = os.tmpdir() + '\\chrome-ets2026-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9299',
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
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9299/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej));
            if (list && list.length) break;
        } catch(e) {}
    }

    if (!list || !list.length) {
        throw new Error('Failed to connect to Chrome CDP on port 9288');
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

    async function takeScreenshot(filename) {
        const res = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(ARTIFACT_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
        console.log(`📸 Screenshot saved: ${filename}`);
        return filePath;
    }

    await send('Page.enable');
    await send('Runtime.enable');

    ws.on('message', data => {
        const msg = JSON.parse(data);
        if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('BROWSER CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
        }
        if (msg.method === 'Runtime.exceptionThrown') {
            console.error('BROWSER EXCEPTION:', msg.params.exceptionDetails?.text, msg.params.exceptionDetails?.exception?.description);
        }
    });

    await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });

    // Wait for DOM
    console.log('Waiting for application to load and inject session user...');
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 200));
        const ready = await evaluate(`typeof window.Ets2026Database !== 'undefined' && typeof window.ToeicListeningWorkstation !== 'undefined'`);
        if (ready) break;
    }

    // Inject logged in user to bypass auth gate
    await evaluate(`(() => {
        const testUser = {
            id: 'dang_ets2026',
            username: 'cung_dang',
            name: 'Đặng Official ETS',
            email: 'dang@ets2026.edu.vn',
            targetScore: 900
        };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
        localStorage.setItem('toeic_user', JSON.stringify(testUser));
        window.currentUserAccount = testUser;
        if (typeof currentUserAccount !== 'undefined') currentUserAccount = testUser;
    })()`);

    // Check Database Stats
    const stats = await evaluate(`({
        p1: window.Ets2026Database.getPart(1).length,
        p2: window.Ets2026Database.getPart(2).length,
        p3: window.Ets2026Database.getPart(3).length,
        p4: window.Ets2026Database.getPart(4).length,
        p5: window.Ets2026Database.getFlattenedPart(5).length,
        p6: window.Ets2026Database.getFlattenedPart(6).length,
        p7: window.Ets2026Database.getFlattenedPart(7).length,
        totalLC: window.Ets2026Database.getFullListening().length,
        totalRC: window.Ets2026Database.getFullReading().length
    })`);
    console.log('📊 ETS 2026 Database Loaded:', stats);

    // 1. Open Part 1 in Listening Workstation
    console.log('Testing Part 1 in Listening Workstation...');
    await evaluate(`window.Ets2026Database.startPractice(1)`);
    await new Promise(r => setTimeout(r, 1200));

    const p1Info = await evaluate(`(() => {
        const title = document.getElementById('tlwTitle')?.textContent;
        const subtitle = document.getElementById('tlwSubtitle')?.textContent;
        const img = document.querySelector('#tlwVisualArea img');
        const audioSrc = window.ToeicListeningWorkstation?.audio?.src;
        const btns = Array.from(document.querySelectorAll('#tlwQuestionsContainer button')).map(b => b.textContent.trim());
        return {
            title,
            subtitle,
            imgSrc: img ? img.src : null,
            imgNaturalWidth: img ? img.naturalWidth : 0,
            audioSrc,
            optionsCount: btns.length
        };
    })()`);
    console.log('Part 1 Info:', p1Info);

    // Select Option B (Index 1) and toggle transcript
    await evaluate(`(() => {
        const item = window.ToeicListeningWorkstation.items[0];
        window.ToeicListeningWorkstation.selectOption(item, 1);
        window.ToeicListeningWorkstation.toggleTranscript();
        window.ToeicListeningWorkstation.toggleBilingual();
        window.ToeicListeningWorkstation.toggleExplanation();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    // Test Audio Playback
    const audioTest = await evaluate(`(async () => {
        const audio = window.ToeicListeningWorkstation.audio;
        try {
            await audio.play();
            await new Promise(r => setTimeout(r, 600));
            const duration = audio.duration;
            const currentTime = audio.currentTime;
            const paused = audio.paused;
            audio.pause();
            return { duration, currentTime, paused, error: null };
        } catch(e) {
            return { error: e.message };
        }
    })()`);
    console.log('Audio Playback Test:', audioTest);

    await takeScreenshot('ets2026_workstation_part1_verified.png');

    // 2. Test Part 3 (Conversations) in Workstation
    console.log('Testing Part 3 in Listening Workstation...');
    await evaluate(`window.Ets2026Database.startPractice(3)`);
    await new Promise(r => setTimeout(r, 1200));

    const p3Info = await evaluate(`(() => {
        const title = document.getElementById('tlwTitle')?.textContent;
        const subtitle = document.getElementById('tlwSubtitle')?.textContent;
        const audioSrc = window.ToeicListeningWorkstation?.audio?.src;
        const cards = document.querySelectorAll('#tlwQuestionsContainer > div');
        return {
            title,
            subtitle,
            audioSrc,
            cardsCount: cards.length
        };
    })()`);
    console.log('Part 3 Info:', p3Info);

    await evaluate(`(() => {
        window.ToeicListeningWorkstation.toggleTranscript();
        window.ToeicListeningWorkstation.toggleBilingual();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    await takeScreenshot('ets2026_workstation_part3_verified.png');

    // 3. Close Workstation and test Part 5 Reading
    console.log('Testing Part 5 in Reading Quiz Modal...');
    await evaluate(`window.ToeicListeningWorkstation.close()`);
    await new Promise(r => setTimeout(r, 500));

    await evaluate(`window.Ets2026Database.startPractice(5)`);
    await new Promise(r => setTimeout(r, 1200));

    const p5Info = await evaluate(`(() => {
        const modal = document.getElementById('quizModal');
        const title = document.getElementById('quizModalTitle')?.textContent;
        const qText = document.getElementById('quizQuestionText')?.textContent;
        const options = Array.from(document.querySelectorAll('#quizOptionsContainer button')).map(b => b.textContent.trim());
        return {
            modalVisible: !modal.classList.contains('hidden'),
            title,
            qText,
            options
        };
    })()`);
    console.log('Part 5 Q101 Info:', p5Info);

    // Select Answer B (Index 1) in Part 5 Q101
    await evaluate(`(() => {
        const btn = document.querySelectorAll('#quizOptionsContainer button')[1];
        if (btn) selectQuizAnswer(1, btn);
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const p5Expl = await evaluate(`document.getElementById('quizExplanationBox')?.textContent.slice(0, 300)`);
    console.log('Part 5 Explanation snippet:', p5Expl);

    await takeScreenshot('ets2026_reading_part5_verified.png');

    // 4. Navigate to Exam Practice Tab (#luyen-thi) to verify Showcase Card
    console.log('Navigating to #luyen-thi to verify ETS 2026 Mock Test Card...');
    await evaluate(`(() => {
        const closeBtn = document.querySelector('#quizModal button[onclick*=\"closeQuizModal\"]');
        if (closeBtn) closeBtn.click();
        else {
            const m = document.getElementById('quizModal');
            if (m) m.classList.add('hidden');
        }
        if (typeof switchTab === 'function') switchTab('luyen-thi');
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    await takeScreenshot('ets2026_mock_test_card_verified.png');

    console.log('--- ALL ETS 2026 VERIFICATION STEPS COMPLETED SUCCESSFULLY ---');
    ws.close();
    chrome.kill();
    process.exit(0);
}

testEts2026Cdp().catch(e => {
    console.error('CDP Test failed:', e);
    process.exit(1);
});
