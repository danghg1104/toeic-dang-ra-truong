const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('📸 Taking visual proof of TOEIC Reading Workstation...');
    const tmp = os.tmpdir() + '\\ch-reading-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9299',
        '--disable-extensions',
        '--window-size=1440,900',
        '--user-data-dir=' + tmp
    ]);

    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9299/json/list', r => {
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
    await send('Page.navigate', { url: 'http://localhost:3000/#doc' });

    for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (await ev(`typeof window.ToeicReadingWorkstation !== 'undefined'`)) break;
    }

    // Set auth session
    await ev(`(() => {
        const u = { id: 'u1', username: 'dang_ets', name: 'Đăng Official' };
        window.localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        if (typeof closeAuthModal === 'function') closeAuthModal();
        const m = document.getElementById('authModal');
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
    })()`);

    // =========================================================================
    // Proof 1: Part 5 Incomplete Sentences (Matching Image 2)
    // =========================================================================
    console.log('Testing Part 5 Workstation (matching Image 2)...');
    await ev(`(() => {
        window.ToeicReadingWorkstation.open({
            part: 5,
            isEts2026: false,
            title: 'Part 5 - Incomplete Sentences (Điền từ)',
            topic: ''
        });
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // Select option (B) her
    await ev(`(() => {
        const item = window.ToeicReadingWorkstation.items[0];
        window.ToeicReadingWorkstation.selectOption(item.id, 1, 101);
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('reading_workstation_part5_verified.png');

    // =========================================================================
    // Proof 2: Part 6 Text Completion (Matching Image 3)
    // =========================================================================
    console.log('Testing Part 6 Workstation (matching Image 3)...');
    await ev(`(() => {
        window.ToeicReadingWorkstation.open({
            part: 6,
            isEts2026: false,
            title: 'Part 6 - Text Completion (Điền đoạn văn)',
            topic: ''
        });
    })()`);
    await new Promise(r => setTimeout(r, 600));
    await ev(`(() => {
        const set = window.ToeicReadingWorkstation.items[0];
        window.ToeicReadingWorkstation.selectOption(set.questions[0].id, 0, 131);
        window.ToeicReadingWorkstation.selectOption(set.questions[1].id, 1, 132);
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('reading_workstation_part6_verified.png');

    // =========================================================================
    // Proof 3: Part 7 Reading Comprehension with Evidence (Matching Image 4)
    // =========================================================================
    console.log('Testing Part 7 Workstation (matching Image 4)...');
    await ev(`(() => {
        window.ToeicReadingWorkstation.open({
            part: 7,
            isEts2026: false,
            title: 'Part 7 - Reading Comprehension (Đọc hiểu)',
            topic: ''
        });
    })()`);
    await new Promise(r => setTimeout(r, 600));
    await ev(`(() => {
        const set = window.ToeicReadingWorkstation.items[0];
        window.ToeicReadingWorkstation.selectOption(set.questions[0].id, 1, 147);
        window.ToeicReadingWorkstation.selectOption(set.questions[1].id, 0, 148);
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('reading_workstation_part7_verified.png');

    // =========================================================================
    // Proof 4: Subtopic practice from Image 5 (e.g. Câu hỏi Từ loại 135+ câu)
    // =========================================================================
    console.log('Testing Subtopic Practice from Image 5 (Câu hỏi Từ loại)...');
    await ev(`(() => {
        window.ToeicReadingWorkstation.open({
            part: 5,
            topic: 'word_form',
            title: 'Part 5 - Câu hỏi Từ loại (Word Form)'
        });
    })()`);
    await new Promise(r => setTimeout(r, 600));
    await snap('reading_workstation_subtopic_wordform.png');

    console.log('✅ All Reading Workstation proofs captured successfully!');
    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
