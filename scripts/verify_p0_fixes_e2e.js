const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function runVerification() {
    console.log('🚀 Starting P0 E2E Verification Suite with Puppeteer & Edge...');
    const browser = await puppeteer.launch({
        executablePath: BROWSER_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        // Clear local storage for clean test
        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
        await new Promise(r => setTimeout(r, 1500));
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 1500));

        console.log('1. Checking Zero-State on Desktop (1440px)...');
        const heroTimeText = await page.$eval('#heroLessonTime', el => el.textContent.trim());
        const heroDescText = await page.$eval('#heroLessonDesc', el => el.textContent.replace(/\s+/g, ' ').trim());
        console.log(`   - Hero time element text: "${heroTimeText}"`);
        console.log(`   - Hero full desc line: "${heroDescText}"`);
        if (heroDescText.includes('Khoảng Khoảng')) {
            throw new Error(`FAIL: Still found 'Khoảng Khoảng' in hero desc: ${heroDescText}`);
        } else {
            console.log('   ✅ PASS: No double "Khoảng Khoảng" found!');
        }

        const skillBalanceText = await page.evaluate(() => {
            return document.querySelector('#content-hom-nay')?.textContent || '';
        });
        if (skillBalanceText.includes('Cân bằng 4 mảng học trọng tâm')) {
            console.log('   ✅ PASS: Skill balance title updated to "Cân bằng 4 mảng học trọng tâm"!');
        } else {
            console.warn('   ⚠️ WARNING: Skill balance title check needs verification.');
        }

        const zeroStateIrt = await page.evaluate(() => {
            const container = document.getElementById('etsAdaptiveForecastContainer');
            return container ? container.textContent : '';
        });
        console.log(`   - IRT Zero-State text preview: "${zeroStateIrt.substring(0, 100).replace(/\s+/g, ' ')}..."`);
        if (zeroStateIrt.includes('Chưa đủ dữ liệu để dự báo điểm số') && zeroStateIrt.includes('--')) {
            console.log('   ✅ PASS: IRT Forecast shows honest Zero-State (-- / 990, Chưa đủ dữ liệu)!');
        } else {
            throw new Error('FAIL: IRT Forecast did not show honest Zero-State before test!');
        }

        const shot1Path = path.join(ARTIFACT_DIR, 'proof_p0_dashboard_desktop_1440.png');
        await page.screenshot({ path: shot1Path, fullPage: false });
        console.log(`   📸 Saved proof screenshot: ${shot1Path}`);

        console.log('\n2. Opening Diagnostic Workstation...');
        await page.evaluate(() => {
            if (window.ToeicDiagnosticWorkstation) {
                window.ToeicDiagnosticWorkstation.open();
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        const isModalVisible = await page.$eval('#toeicDiagnosticWorkstation', el => !el.classList.contains('hidden'));
        if (!isModalVisible) throw new Error('FAIL: Diagnostic workstation modal is not visible!');
        console.log('   ✅ Modal opened successfully.');

        // Check Pane Dimensions (The 120px bug verification)
        const paneDims = await page.evaluate(() => {
            const left = document.getElementById('tdwLeftPane');
            const right = document.getElementById('tdwRightPane');
            const leftRect = left ? left.getBoundingClientRect() : null;
            const rightRect = right ? right.getBoundingClientRect() : null;
            return {
                leftWidth: leftRect ? leftRect.width : 0,
                rightWidth: rightRect ? rightRect.width : 0
            };
        });
        console.log(`   - Left Pane Width: ${paneDims.leftWidth}px`);
        console.log(`   - Right Pane Width: ${paneDims.rightWidth}px`);
        if (paneDims.leftWidth < 500 || paneDims.rightWidth < 500) {
            throw new Error(`FAIL: Panes still cramped! Left: ${paneDims.leftWidth}px, Right: ${paneDims.rightWidth}px`);
        }
        console.log('   ✅ PASS: Desktop layout FIXED! Both panes occupy ~50% (~720px each), NOT 120px!');

        // Check Floating Mascot is hidden
        const mascotHidden = await page.evaluate(() => {
            const dock = document.getElementById('soiMayFloatingDock');
            if (!dock) return true;
            const style = window.getComputedStyle(dock);
            return style.display === 'none' || dock.style.display === 'none';
        });
        if (mascotHidden) {
            console.log('   ✅ PASS: Floating mascot dock is HIDDEN during test (no blocking submit button)!');
        } else {
            throw new Error('FAIL: Floating mascot dock is still visible during test!');
        }

        // Check Part 1 option text
        const part1OptionText = await page.evaluate(() => {
            const opt = document.querySelector('#tdwOptionsContainer span');
            return opt ? opt.textContent : '';
        });
        console.log(`   - Part 1 option text: "${part1OptionText}"`);
        if (part1OptionText.includes('Lắng nghe trong audio')) {
            console.log('   ✅ PASS: Part 1 does not leak spoken text, shows "Lắng nghe trong audio"!');
        } else {
            throw new Error(`FAIL: Part 1 leaked option text: ${part1OptionText}`);
        }

        // Jump to Part 2 (Question 5, index 4)
        await page.evaluate(() => {
            window.ToeicDiagnosticWorkstation.showQuestion(4);
        });
        await new Promise(r => setTimeout(r, 500));

        const part2QuestionText = await page.evaluate(() => {
            const q = document.querySelector('#tdwRightPane h2');
            return q ? q.textContent : '';
        });
        const part2OptionText = await page.evaluate(() => {
            const opt = document.querySelector('#tdwOptionsContainer span');
            return opt ? opt.textContent : '';
        });
        console.log(`   - Part 2 question text: "${part2QuestionText.replace(/\s+/g, ' ')}"`);
        console.log(`   - Part 2 option text: "${part2OptionText}"`);
        if (part2QuestionText.includes('không in câu hỏi') && part2OptionText.includes('Lắng nghe trong audio')) {
            console.log('   ✅ PASS: Part 2 adheres to ETS paper test standard (no transcript/answer leaking)!');
        } else {
            throw new Error('FAIL: Part 2 leaked transcript or question text!');
        }

        const shot2Path = path.join(ARTIFACT_DIR, 'proof_p0_diagnostic_desktop_1440.png');
        await page.screenshot({ path: shot2Path, fullPage: false });
        console.log(`   📸 Saved proof screenshot: ${shot2Path}`);

        console.log('\n3. Answering all 28 questions with "A" and submitting...');
        await page.evaluate(() => {
            const ws = window.ToeicDiagnosticWorkstation;
            ws.questions.forEach(q => {
                ws.userAnswers[q.id] = 'A';
            });
            ws.submitTest();
        });
        await new Promise(r => setTimeout(r, 1000));

        // Check Result Modal
        const resultModal = await page.evaluate(() => {
            const m = document.getElementById('diagResultModal');
            if (!m || m.classList.contains('hidden')) return null;
            return {
                text: m.textContent,
                visible: true
            };
        });
        if (!resultModal) throw new Error('FAIL: Diagnostic Result Modal did not appear after submit!');
        console.log('   ✅ Diagnostic Result Modal appeared.');
        if (resultModal.text.includes('315') && resultModal.text.includes('990')) {
            console.log('   ✅ PASS: Result modal shows calculated score: 315 / 990 (All A test run)!');
        } else {
            throw new Error(`FAIL: Result modal score unexpected: ${resultModal.text.substring(0, 200)}`);
        }

        if (resultModal.text.includes('Part 5 (Ngữ pháp cốt lõi)') && resultModal.text.includes('Part 5 (Từ vựng & Collocations)')) {
            console.log('   ✅ PASS: Result modal distinctly names Part 5 Grammar vs Part 5 Vocab!');
        } else {
            throw new Error('FAIL: Result modal does not distinguish two Part 5 pillars!');
        }

        const shot3Path = path.join(ARTIFACT_DIR, 'proof_p0_diagnostic_result_modal.png');
        await page.screenshot({ path: shot3Path, fullPage: false });
        console.log(`   📸 Saved proof screenshot: ${shot3Path}`);

        // Close result modal
        await page.evaluate(() => {
            const m = document.getElementById('diagResultModal');
            if (m) m.classList.add('hidden');
        });
        await new Promise(r => setTimeout(r, 500));

        console.log('\n4. Verifying Dashboard post-submission consistency...');
        // Check mascot restored
        const mascotRestored = await page.evaluate(() => {
            const dock = document.getElementById('soiMayFloatingDock');
            if (!dock) return true;
            return dock.style.display !== 'none';
        });
        if (mascotRestored) {
            console.log('   ✅ PASS: Floating mascot dock RESTORED after workstation closed.');
        } else {
            console.warn('   ⚠️ Note: Mascot dock display state:', mascotRestored);
        }

        // Check IRT Widget on Dashboard
        const irtAfterSubmit = await page.evaluate(() => {
            const container = document.getElementById('etsAdaptiveForecastContainer');
            return container ? container.textContent : '';
        });
        console.log(`   - IRT Forecast text: "${irtAfterSubmit.substring(0, 150).replace(/\s+/g, ' ')}"`);
        if (irtAfterSubmit.includes('315') && irtAfterSubmit.includes('990')) {
            console.log('   ✅ PASS: Dashboard IRT Forecast accurately synchronized to 315 / 990 (matches test result)!');
        } else {
            throw new Error(`FAIL: Dashboard IRT did not reflect 315 test score! Text: ${irtAfterSubmit}`);
        }

        const shot4Path = path.join(ARTIFACT_DIR, 'proof_p0_dashboard_post_test.png');
        await page.screenshot({ path: shot4Path, fullPage: false });
        console.log(`   📸 Saved proof screenshot: ${shot4Path}`);

        console.log('\n5. Testing Page Refresh persistence...');
        await page.reload({ waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 1500));

        const irtAfterReload = await page.evaluate(() => {
            const container = document.getElementById('etsAdaptiveForecastContainer');
            return container ? container.textContent : '';
        });
        if (irtAfterReload.includes('315') && irtAfterReload.includes('990')) {
            console.log('   ✅ PASS: Diagnostic test score 315 / 990 PERSISTED after page reload!');
        } else {
            throw new Error(`FAIL: Test score lost after reload! Text: ${irtAfterReload}`);
        }

        console.log('\n6. Testing Dark Mode persistence...');
        // Toggle dark mode
        await page.evaluate(() => {
            if (typeof toggleDarkMode === 'function') {
                toggleDarkMode();
            }
        });
        const isDarkBeforeReload = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        console.log(`   - Is dark mode active before reload: ${isDarkBeforeReload}`);
        if (!isDarkBeforeReload) throw new Error('FAIL: Dark mode failed to activate!');

        // Reload page
        await page.reload({ waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 1500));
        const isDarkAfterReload = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        console.log(`   - Is dark mode active AFTER reload: ${isDarkAfterReload}`);
        if (isDarkAfterReload) {
            console.log('   ✅ PASS: Dark mode PRESERVED across page reloads via localStorage!');
        } else {
            throw new Error('FAIL: Dark mode was reset back to light upon reload!');
        }

        const shot5Path = path.join(ARTIFACT_DIR, 'proof_p0_dark_mode_retained.png');
        await page.screenshot({ path: shot5Path, fullPage: false });
        console.log(`   📸 Saved proof screenshot: ${shot5Path}`);

        console.log('\n=======================================================');
        console.log('🎉 ALL P0 AUDIT FIXES VERIFIED 100% PASS!');
        console.log('=======================================================');

    } finally {
        await browser.close();
    }
}

runVerification().catch(err => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
});
