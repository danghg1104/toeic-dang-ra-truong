const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('🚀 Running User Fix Verification...');
    const tmp = os.tmpdir() + '\\ch-user-fix-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9292',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 35; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9292/json/list', r => {
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

    // Wait until document.readyState === 'complete'
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 250));
        const ready = await ev(`document.readyState === 'complete' && typeof switchTab === 'function' && typeof PersonalizedRoadmapEngine !== 'undefined'`);
        if (ready) break;
    }

    // Set user account and go to lo-trinh
    const setupRes = await ev(`(() => {
        const u = {
            id: 'u_dang_toeic',
            username: 'dang_toeic',
            name: 'Hải Đăng TOEIC',
            targetScore: '750',
            examDate: '20/12/2026'
        };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        currentUserAccount = u;
        if (typeof applyCurrentAccountToUI === 'function') applyCurrentAccountToUI();
        if (typeof UserAuthEngine !== 'undefined') UserAuthEngine.dismissGatekeeper();
        if (typeof closeAuthModal === 'function') closeAuthModal();
        switchTab('lo-trinh');
        PersonalizedRoadmapEngine.renderRoadmapView();
        return {
            tab: state.currentTab,
            user: currentUserAccount ? currentUserAccount.name : 'none'
        };
    })()`);
    console.log('Setup Result:', setupRes);

    await new Promise(r => setTimeout(r, 800));
    await snap('proof_user_fix_roadmap.png');

    // Now click "Làm test chẩn đoán" via DOM click to see exact user interaction!
    console.log('Simulating user clicking "Làm test chẩn đoán" button...');
    const clickRes = await ev(`(() => {
        const btn = document.querySelector('button[onclick*="startDiagnosticTest"]');
        if (btn) btn.click();
        else PersonalizedRoadmapEngine.startDiagnosticTest();

        const oldModal = document.getElementById('diagnosticTestModal');
        const newWs = document.getElementById('toeicDiagnosticWorkstation');
        return {
            oldModalExists: !!oldModal,
            newWsExists: !!newWs,
            newWsVisible: newWs ? !newWs.classList.contains('hidden') : false,
            title: document.getElementById('tdwHeaderTitle')?.textContent,
            timer: document.getElementById('tdwTimerBadge')?.textContent,
            totalQ: ToeicDiagnosticWorkstation?.questions?.length
        };
    })()`);
    console.log('Click Diagnostic Button Result:', clickRes);

    await new Promise(r => setTimeout(r, 800));
    await snap('proof_user_fix_diagnostic_workstation.png');

    console.log('🎉 Verification completed!');
    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
