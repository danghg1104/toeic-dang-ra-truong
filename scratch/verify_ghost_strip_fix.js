const path = require('path');
const fs = require('fs');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Launching Puppeteer-core to verify ghost strip / empty callout fix...');
    const browser = await puppeteer.launch({
        executablePath,
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--window-size=1400,900'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    try {
        await page.setCookie({
            name: 'cd_session',
            value: '045bd5f723d5594d813fd43698acc239a32f26e419ddd9a0a367200f498d25a9',
            domain: 'localhost',
            path: '/'
        });

        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 1500));

        // Authenticate session & switch tab
        await page.evaluate(() => {
            const user = {
                id: 'acc-g-1792730904332',
                email: 'danghg20008@gmail.com',
                name: 'Đăng',
                role: 'admin'
            };
            localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
            window.currentUserAccount = user;
            const authModal = document.getElementById('authModal');
            if (authModal) authModal.classList.add('hidden');
            if (typeof window.switchTab === 'function') {
                window.switchTab('take-note');
            }
        });

        await new Promise(r => setTimeout(r, 1500));

        console.log('📝 Injecting test content matching the user scenario...');
        // Test Case 1: Reproduce exact user situation with empty callout at the bottom
        const result1 = await page.evaluate(() => {
            const paper = document.getElementById('takeNoteEditorPaper');
            if (!paper) return { error: 'Paper not found' };

            // User content: Top paragraph, Callout, Todo, Toggle, and Empty Callout at the bottom
            paper.innerHTML = `
                <p>Dòng mở đầu bài học</p>
                <div class="tn-callout tn-callout-formula">
                    <div class="tn-callout-icon">📌</div>
                    <div class="tn-callout-content">
                        <strong>CÔNG THỨC NGỮ PHÁP THEN CHỐT:</strong>
                        <div>Nhập nội dung ghi chú mẹo hoặc công thức trọng tâm vào đây...</div>
                    </div>
                </div>
                <div class="tn-todo-item completed">
                    <input type="checkbox" class="tn-todo-checkbox" checked>
                    <div class="tn-todo-text"><s>Nội dung bài tập hoặc công việc cần hoàn thành...</s></div>
                </div>
                <details class="tn-toggle-block" open>
                    <summary class="tn-toggle-summary">▶ Bấm vào đây</summary>
                    <div class="tn-toggle-content"><p>Nội dung chi tiết</p></div>
                </details>
                <!-- EMPTY GHOST CALLOUT AS SEEN IN USER SCREENSHOT -->
                <div class="tn-callout tn-callout-formula" id="testGhostCallout">
                    <div class="tn-callout-icon">📌</div>
                    <div class="tn-callout-content"><br></div>
                </div>
            `;

            const beforeCount = paper.querySelectorAll('.tn-callout').length;

            // Trigger sanitize
            window.TakeNoteHybridEditor.sanitizeTakeNoteDom(paper);

            const afterCount = paper.querySelectorAll('.tn-callout').length;
            const ghostExists = !!document.getElementById('testGhostCallout');

            return {
                beforeCount,
                afterCount,
                ghostExists
            };
        });

        console.log('Result 1 (Sanitize empty callout):', result1);
        if (result1.beforeCount === 2 && result1.afterCount === 1 && !result1.ghostExists) {
            console.log('✅ TEST 1 PASSED: Empty callout capsule was successfully purged from DOM!');
        } else {
            console.error('❌ TEST 1 FAILED:', result1);
        }

        // Test Case 2: User presses Backspace inside an empty callout
        console.log('📝 Test 2: User presses Backspace inside an empty callout...');
        const result2 = await page.evaluate(() => {
            const paper = document.getElementById('takeNoteEditorPaper');

            // Append a new callout and empty it
            const newCallout = document.createElement('div');
            newCallout.className = 'tn-callout tn-callout-tip';
            newCallout.id = 'calloutToBeDeleted';
            newCallout.innerHTML = `
                <div class="tn-callout-icon">💡</div>
                <div class="tn-callout-content"></div>
            `;
            paper.appendChild(newCallout);

            // Put caret inside
            const r = document.createRange();
            r.selectNodeContents(newCallout);
            r.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(r);

            // Dispatch Backspace keydown
            const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true });
            paper.dispatchEvent(event);

            const exists = !!document.getElementById('calloutToBeDeleted');
            return {
                exists,
                activeAnchorTag: sel.anchorNode ? sel.anchorNode.parentElement?.tagName : null
            };
        });

        console.log('Result 2 (Backspace inside empty callout):', result2);
        if (!result2.exists) {
            console.log('✅ TEST 2 PASSED: Hitting Backspace inside empty callout removed the block completely!');
        } else {
            console.error('❌ TEST 2 FAILED:', result2);
        }

        // Capture clean UI screenshot to artifact directory
        const screenshotPath = path.join(artifactDir, 'test_fixed_empty_ghost_strip.png');
        await page.evaluate(() => {
            const paper = document.getElementById('takeNoteEditorPaper');
            if (paper) paper.scrollIntoView({ behavior: 'instant', block: 'center' });
        });
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`📸 Screenshot captured to ${screenshotPath}`);

    } catch (err) {
        console.error('Error during test:', err);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
})();
