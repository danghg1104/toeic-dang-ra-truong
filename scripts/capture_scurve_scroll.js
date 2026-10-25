const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('🚀 Scrolling to Roadmap and capturing Stage 1 & Stage 4 view...');
    const tmp = os.tmpdir() + '\\ch-scroll-roadmap-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9290',
        '--disable-extensions',
        '--window-size=1440,1100',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 35; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9290/json/list', r => {
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
        const ready = await ev(`document.readyState === 'complete' && typeof switchTab === 'function' && typeof PersonalizedRoadmapEngine !== 'undefined'`);
        if (ready) break;
    }

    // Set user with diagnostic results of 715 points
    await ev(`(() => {
        const u = {
            id: 'u_dang_toeic',
            username: 'dang_toeic',
            name: 'Hải Đăng TOEIC',
            targetScore: '750',
            examDate: '20/12/2026',
            diagnosticResults: {
                listeningScore: 365,
                readingScore: 350,
                estimatedScore: 715,
                pillarScores: {
                    'gap-part12-listening': 63,
                    'gap-part34-paraphrase': 75,
                    'gap-part5-grammar': 67,
                    'gap-part5-vocab': 50,
                    'gap-part6-insertion': 67,
                    'gap-part7-multi': 75
                },
                bandTitle: 'Band 600 - 750 (Trung Cấp - Bứt Phá Doanh Nghiệp)',
                testDate: '25/10/2026'
            }
        };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        currentUserAccount = u;
        if (typeof applyCurrentAccountToUI === 'function') applyCurrentAccountToUI();
        if (typeof UserAuthEngine !== 'undefined') UserAuthEngine.dismissGatekeeper();
        if (typeof closeAuthModal === 'function') closeAuthModal();
        switchTab('lo-trinh');
        PersonalizedRoadmapEngine.renderRoadmapView();
    })()`);

    await new Promise(r => setTimeout(r, 600));

    // Scroll down to Stage 1 and Stage 2
    await ev(`(() => {
        const el = document.getElementById('roadmapVerticalMapContainer');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('roadmap_scurve_stage1_stage2.png');

    // Scroll further down to Stage 3 and Stage 4 (Active Stage where user is currently learning)
    await ev(`(() => {
        window.scrollBy(0, 750);
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await snap('roadmap_scurve_active_stage4.png');

    // Also take a screenshot of Diagnostic Workstation Q1 with Audio and Question Card
    await ev(`(() => {
        ToeicDiagnosticWorkstation.open();
    })()`);
    await new Promise(r => setTimeout(r, 600));
    await snap('diagnostic_workstation_q1_hd.png');

    // Jump to Q25 (Part 7 reading passage)
    await ev(`(() => {
        ToeicDiagnosticWorkstation.jumpToQuestion(24);
    })()`);
    await new Promise(r => setTimeout(r, 600));
    await snap('diagnostic_workstation_q25_part7_hd.png');

    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
