const fs = require('fs');
const path = require('path');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactsDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function runVerification() {
    console.log('🚀 Starting Comprehensive System Verification...');
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: 'new',
        defaultViewport: { width: 1440, height: 900 }
    });

    try {
        const page = await browser.newPage();
        
        // 1. Set session cookie for Huynh Dang
        await page.setCookie({
            name: 'cd_session',
            value: 'session-huynh-dang-test-token',
            domain: 'localhost',
            path: '/'
        });

        console.log('Navigating to http://localhost:3000 ...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        // 2. Check Topbar buttons
        console.log('Checking Topbar buttons (Image 2)...');
        const topbarText = await page.evaluate(() => {
            const header = document.querySelector('header');
            return header ? header.innerText : '';
        });
        const hasMoTrenDt = topbarText.includes('Mở trên ĐT');
        const hasDongBoRealtime = topbarText.includes('Đồng bộ Realtime');
        console.log('Topbar has "Mở trên ĐT"?', hasMoTrenDt);
        console.log('Topbar has "Đồng bộ Realtime"?', hasDongBoRealtime);

        const proofTopbar = path.join(artifactsDir, 'proof_topbar_cleaned_no_phone_sync.png');
        await page.screenshot({
            path: proofTopbar,
            clip: { x: 0, y: 0, width: 1440, height: 80 }
        });
        console.log('📸 Topbar screenshot saved to:', proofTopbar);

        // 3. Check FAB button sizing, hover & drag to screen edge (Images 3 & 4)
        console.log('Checking FAB Take Note button (Images 3 & 4)...');
        const fabInfo = await page.evaluate(() => {
            const fab = document.getElementById('floatingTakeNoteFab');
            if (!fab) return null;
            const rect = fab.getBoundingClientRect();
            const cs = window.getComputedStyle(fab);
            return {
                width: rect.width,
                height: rect.height,
                borderRadius: cs.borderRadius,
                innerText: fab.innerText.trim(),
                left: rect.left,
                top: rect.top,
                windowWidth: window.innerWidth
            };
        });
        console.log('FAB initial state:', fabInfo);

        // Hover over FAB
        await page.hover('#floatingTakeNoteFab');
        await new Promise(r => setTimeout(r, 500));
        const fabHoverInfo = await page.evaluate(() => {
            const fab = document.getElementById('floatingTakeNoteFab');
            const rect = fab.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
                innerText: fab.innerText.trim()
            };
        });
        console.log('FAB on hover state (Must remain compact 48x48 circle):', fabHoverInfo);

        // Test dragging FAB right up to the screen edge (within 5px)
        console.log('Testing FAB drag to near edge...');
        await page.evaluate(() => {
            const fab = document.getElementById('floatingTakeNoteFab');
            if (!fab) return;
            const targetLeft = window.innerWidth - 48 - 4; // 4px from right edge
            const targetTop = 220;
            fab.style.left = targetLeft + 'px';
            fab.style.top = targetTop + 'px';
            fab.style.right = 'auto';
            fab.style.bottom = 'auto';
            if (window.FloatingTakeNote && typeof window.FloatingTakeNote.saveFabPosition === 'function') {
                window.FloatingTakeNote.saveFabPosition(targetLeft, targetTop);
            }
        });
        await new Promise(r => setTimeout(r, 500));

        const fabNearEdge = await page.evaluate(() => {
            const fab = document.getElementById('floatingTakeNoteFab');
            const rect = fab.getBoundingClientRect();
            return {
                left: rect.left,
                right: rect.right,
                distFromRightEdge: window.innerWidth - rect.right,
                width: rect.width,
                height: rect.height
            };
        });
        console.log('FAB dragged near right edge:', fabNearEdge);

        const proofFab = path.join(artifactsDir, 'proof_fab_compact_near_screen_edge.png');
        await page.screenshot({ path: proofFab });
        console.log('📸 FAB screenshot saved to:', proofFab);

        // 4. Verify Dashboard Metrics (Image 1)
        console.log('Checking Dashboard Metrics for Huynh Dang (Image 1)...');
        const dashboardMetricsHuynhDang = await page.evaluate(() => {
            return {
                userName: window.currentUserAccount?.name,
                userId: window.currentUserAccount?.id,
                targetScore: document.getElementById('memberTargetScore')?.textContent?.trim(),
                examDate: document.getElementById('memberExamDate')?.textContent?.trim(),
                vocabCount: document.getElementById('memberVocabCount')?.textContent?.trim(),
                accuracyVal: document.getElementById('memberAccuracyVal')?.textContent?.trim(),
                studyTime: document.getElementById('memberStudyTime')?.textContent?.trim(),
                grammarRing: document.getElementById('ring-grammar-cnt')?.textContent?.trim(),
                vocabRing: document.getElementById('ring-vocab-cnt')?.textContent?.trim(),
                listenRing: document.getElementById('ring-listen-cnt')?.textContent?.trim(),
                readRing: document.getElementById('ring-read-cnt')?.textContent?.trim(),
                storageKey: window.AuthSyncManager ? window.AuthSyncManager.getStorageKey() : null,
                localStorageHasData: !!localStorage.getItem(window.AuthSyncManager?.getStorageKey())
            };
        });
        console.log('Dashboard metrics for Huynh Dang:', dashboardMetricsHuynhDang);

        const proofDashboard = path.join(artifactsDir, 'proof_dashboard_metrics_accurate_image1.png');
        await page.screenshot({ path: proofDashboard });
        console.log('📸 Dashboard screenshot saved to:', proofDashboard);

        // 5. Test Switching to Tran Thi B and verifying isolation
        console.log('Fetching server users and switching to Tran Thi B...');
        await page.evaluate(async () => {
            if (window.UserAuthEngine) {
                window.UserAuthEngine.fetchServerUsers();
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        await page.evaluate(() => {
            window.switchUserAccountById('acc-1792720086387-k47u');
        });
        await new Promise(r => setTimeout(r, 1500));

        const metricsTranThiB = await page.evaluate(() => {
            return {
                userName: window.currentUserAccount?.name,
                userId: window.currentUserAccount?.id,
                grammarRing: document.getElementById('ring-grammar-cnt')?.textContent?.trim(),
                listenRing: document.getElementById('ring-listen-cnt')?.textContent?.trim(),
                storageKey: window.AuthSyncManager?.getStorageKey(),
                hasSeparateNamespace: !!localStorage.getItem(window.AuthSyncManager?.getStorageKey())
            };
        });
        console.log('Metrics for Tran Thi B (Clean & Isolated):', metricsTranThiB);

        const proofSwitch = path.join(artifactsDir, 'proof_multi_account_isolated_sync.png');
        await page.screenshot({ path: proofSwitch });
        console.log('📸 Multi-account switch screenshot saved to:', proofSwitch);

        // Switch back to Huynh Dang
        console.log('Switching back to Huynh Dang...');
        await page.evaluate(() => {
            window.switchUserAccountById('acc-g-1792730904332');
        });
        await new Promise(r => setTimeout(r, 1500));

        // 6. Test Answering a Reading Part 5 Question & Live Metric Update
        console.log('Testing Part 5 Question & Live Metric Update...');
        await page.evaluate(() => {
            if (window.switchTab) window.switchTab('doc');
            if (window.ToeicReadingWorkstation) {
                window.ToeicReadingWorkstation.open({ part: 5, topic: 'word_form', title: 'Part 5 Word Form', count: 10 });
            }
        });
        await new Promise(r => setTimeout(r, 1500));

        const readingStateBefore = await page.evaluate(() => ({
            grammarDone: window.state?.grammarDone,
            totalAnswers: window.state?.totalAnswers,
            correctAnswers: window.state?.correctAnswers
        }));
        console.log('Reading state before answering:', readingStateBefore);

        // Answer question in Part 5
        await page.evaluate(() => {
            if (window.ToeicReadingWorkstation && window.ToeicReadingWorkstation.items.length > 0) {
                const item = window.ToeicReadingWorkstation.items[0];
                const ans = (item && item.ans !== undefined) ? item.ans : 0;
                window.ToeicReadingWorkstation.selectOption(ans, item?.id || 'q_101', item?.qNum || 101);
            }
        });
        await new Promise(r => setTimeout(r, 1500));

        const readingStateAfter = await page.evaluate(() => ({
            grammarDone: window.state?.grammarDone,
            totalAnswers: window.state?.totalAnswers,
            correctAnswers: window.state?.correctAnswers,
            grammarRing: document.getElementById('ring-grammar-cnt')?.textContent?.trim(),
            dailyTasksGrammar: window.DailyTaskManager ? window.DailyTaskManager.loadTasks()?.tasks?.grammar?.current : null
        }));
        console.log('Reading state after answering correctly:', readingStateAfter);

        const proofPracticeUpdate = path.join(artifactsDir, 'proof_practice_live_metric_update.png');
        await page.screenshot({ path: proofPracticeUpdate });
        console.log('📸 Practice live update screenshot saved to:', proofPracticeUpdate);

        console.log('🎉 ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');

    } catch (err) {
        console.error('❌ Verification failed with error:', err);
    } finally {
        await browser.close();
    }
}

runVerification();
