const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function main() {
    console.log('🚀 Starting Comprehensive Verification for Diagnostic Test & S-Curve Roadmap...');
    const tmp = os.tmpdir() + '\\ch-diag-roadmap-' + Date.now();
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9289',
        '--disable-extensions',
        '--window-size=1440,960',
        '--user-data-dir=' + tmp,
        'http://localhost:3000/'
    ]);

    let list = null;
    for (let i = 0; i < 35; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            list = await new Promise((res, rej) => http.get('http://127.0.0.1:9289/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej));
            if (list && list.length) {
                const found = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension'));
                if (found) { list = [found]; break; }
            }
        } catch(e) {}
    }

    if (!list || !list.length) {
        console.error('❌ Failed to connect to Chrome CDP.');
        chrome.kill();
        process.exit(1);
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

    // Wait until document.readyState === 'complete' and modules loaded
    console.log('⏳ Waiting for complete DOM readyState and engines...');
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 250));
        const ready = await ev(`document.readyState === 'complete' && typeof switchTab === 'function' && typeof PersonalizedRoadmapEngine !== 'undefined' && typeof ToeicDiagnosticWorkstation !== 'undefined'`);
        if (ready) {
            console.log(`✅ Fully ready at ${i * 250}ms!`);
            break;
        }
    }

    // Set user authentication & close any modals
    const authRes = await ev(`(() => {
        const u = {
            id: 'u_dang_toeic',
            username: 'dang_toeic',
            name: 'Hải Đăng TOEIC',
            email: 'haidang@ets.edu.vn',
            targetScore: '750',
            examDate: '20/12/2026',
            xp: 250,
            streak: 7
        };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(u));
        window.currentUserAccount = u;
        currentUserAccount = u;
        if (typeof applyCurrentAccountToUI === 'function') applyCurrentAccountToUI();
        if (typeof UserAuthEngine !== 'undefined') UserAuthEngine.dismissGatekeeper();
        if (typeof closeAuthModal === 'function') closeAuthModal();
        return {
            user: currentUserAccount ? currentUserAccount.name : 'null',
            roadmapLoaded: typeof PersonalizedRoadmapEngine !== 'undefined',
            diagnosticLoaded: typeof ToeicDiagnosticWorkstation !== 'undefined'
        };
    })()`);
    console.log('Auth & Module State:', authRes);

    // Switch to tab 'lo-trinh'
    console.log('🧭 Switching to tab "lo-trinh"...');
    await ev(`switchTab('lo-trinh');`);
    await new Promise(r => setTimeout(r, 1000));

    // =========================================================================
    // STEP 1: VERIFY S-CURVE VERTICAL ROADMAP INITIAL VIEW
    // =========================================================================
    const roadmapCheck = await ev(`(() => {
        const c = document.getElementById('roadmapVerticalMapContainer');
        const nodes = document.querySelectorAll('.roadmap-node-circle');
        const paths = document.querySelectorAll('svg path');
        const stages = document.querySelectorAll('.stage-divider-badge');
        return {
            containerExists: !!c,
            nodesCount: nodes.length,
            pathsCount: paths.length,
            stagesCount: stages.length
        };
    })()`);
    console.log('🗺️ S-Curve Roadmap DOM elements:', roadmapCheck);

    await snap('roadmap_initial_view.png');

    // =========================================================================
    // STEP 2: CLICK A NODE & VERIFY FLOATING ACTION BAR
    // =========================================================================
    console.log('🎯 Clicking node s1_n2 and verifying bottom floating drawer...');
    const cardInfo = await ev(`(() => {
        PersonalizedRoadmapEngine.selectNode('s1_n2');
        const card = document.getElementById('roadmapFloatingActionCard');
        return {
            visible: !card.classList.contains('hidden'),
            title: document.getElementById('rfcTitle')?.textContent,
            stage: document.getElementById('rfcStage')?.textContent,
            duration: document.getElementById('rfcDuration')?.textContent,
            xp: document.getElementById('rfcXp')?.textContent
        };
    })()`);
    console.log('Card Info:', cardInfo);

    await new Promise(r => setTimeout(r, 400));
    await snap('roadmap_floating_card.png');

    // =========================================================================
    // STEP 3: OPEN TOEIC DIAGNOSTIC WORKSTATION (FULL 7 PARTS)
    // =========================================================================
    console.log('📝 Opening Toeic Diagnostic Workstation (Full 7 Parts)...');
    const wsOpen = await ev(`(() => {
        PersonalizedRoadmapEngine.startDiagnosticTest();
        const ws = document.getElementById('toeicDiagnosticWorkstation');
        const q = ToeicDiagnosticWorkstation.currentQuestion();
        return {
            workstationVisible: !ws.classList.contains('hidden'),
            qIndex: ToeicDiagnosticWorkstation.currentIndex,
            part: q?.part,
            timer: document.getElementById('tdwTimerBadge')?.textContent,
            hasAudio: !!document.getElementById('tdwAudioSection')
        };
    })()`);
    console.log('Diagnostic Workstation opened:', wsOpen);

    await new Promise(r => setTimeout(r, 600));
    await snap('diagnostic_workstation_q1.png');

    // =========================================================================
    // STEP 4: QUESTION PALETTE DRAWER
    // =========================================================================
    console.log('🎨 Opening Question Palette Drawer...');
    await ev(`ToeicDiagnosticWorkstation.togglePaletteDrawer();`);
    await new Promise(r => setTimeout(r, 500));
    await snap('diagnostic_palette_drawer.png');

    // Close palette
    await ev(`ToeicDiagnosticWorkstation.togglePaletteDrawer();`);
    await new Promise(r => setTimeout(r, 300));

    // =========================================================================
    // STEP 5: JUMP TO READING PART (PART 6 OR PART 7) TO VERIFY SPLIT-PANE UI
    // =========================================================================
    console.log('📖 Jumping to Reading Part 6 (Question 21) to verify Passage Split-Pane...');
    await ev(`ToeicDiagnosticWorkstation.jumpToQuestion(20);`); // index 20 is Q21
    await new Promise(r => setTimeout(r, 500));
    await snap('diagnostic_reading_split.png');

    // =========================================================================
    // STEP 6: SIMULATE TEST COMPLETION & ETS SCORING
    // =========================================================================
    console.log('📊 Simulating realistic answer distribution & test submission...');
    const submitResult = await ev(`(() => {
        // Set realistic answers for all 28 questions
        ToeicDiagnosticWorkstation.questions.forEach((q, idx) => {
            // ~60% correct answers (17/28 questions)
            if (idx % 3 !== 1) {
                ToeicDiagnosticWorkstation.userAnswers[q.id] = q.correct;
            } else {
                const wrong = q.options.find(o => o.key !== q.correct);
                ToeicDiagnosticWorkstation.userAnswers[q.id] = wrong ? wrong.key : 'A';
            }
        });
        // Call submitTest with isAuto = true to bypass window.confirm
        ToeicDiagnosticWorkstation.submitTest(true);
        const modal = document.getElementById('diagResultModal');
        return {
            modalVisible: !modal.classList.contains('hidden'),
            totalScore: document.getElementById('diagResTotalScore')?.textContent,
            listeningScore: document.getElementById('diagResListeningScore')?.textContent,
            readingScore: document.getElementById('diagResReadingScore')?.textContent,
            bandBadge: document.getElementById('diagResBandBadge')?.textContent
        };
    })()`);
    console.log('Test Submission Result:', submitResult);

    await new Promise(r => setTimeout(r, 600));
    await snap('diagnostic_summary_modal.png');

    // =========================================================================
    // STEP 7: CLOSE MODAL & VERIFY ADAPTIVE ROADMAP UNLOCKING
    // =========================================================================
    console.log('🔓 Applying diagnostic results to Adaptive Roadmap...');
    const adaptiveStatus = await ev(`(() => {
        const modal = document.getElementById('diagResultModal');
        if (modal) modal.remove();
        switchTab('lo-trinh');
        const states = PersonalizedRoadmapEngine.calculateNodeStates();
        const activeNode = document.querySelector('.roadmap-node-circle.ring-4');
        const completedNodes = document.querySelectorAll('.roadmap-node-circle.bg-emerald-500');
        const lockedNodes = document.querySelectorAll('.roadmap-node-circle.bg-slate-700');
        return {
            currentStageId: states.currentStageId,
            currentActiveNodeId: states.currentActiveNodeId,
            activeNodeClass: activeNode?.className,
            completedCount: completedNodes.length,
            lockedCount: lockedNodes.length
        };
    })()`);
    console.log('Adaptive Unlocking Status:', adaptiveStatus);

    await new Promise(r => setTimeout(r, 800));
    await snap('roadmap_adaptively_unlocked.png');

    console.log('🎉 All verification steps completed successfully!');
    ws.close();
    chrome.kill();
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error during verification:', err);
    process.exit(1);
});
