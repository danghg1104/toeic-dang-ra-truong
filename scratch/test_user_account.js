const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    let browser;
    try {
        console.log('🚀 Kiểm thử với tài khoản thực tế của người dùng: Huynh Dang (danghg20008@gmail.com)...');
        browser = await puppeteer.launch({
            executablePath: CHROME_PATH,
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await delay(2000);

        // Thiết lập session cho tài khoản danghg20008@gmail.com
        const setupRes = await page.evaluate(async () => {
            const userObj = {
                id: 'acc-g-1792730904332',
                name: 'Huynh Dang',
                email: 'danghg20008@gmail.com',
                username: 'danghg20008',
                avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIqf3GZEx2d0AUkcqFTnPvvecQ6MTf9v89adahm3RECplz0HQ=s96-c',
                avatarColor: 'bg-emerald-600',
                exam: 'TOEIC',
                targetScore: '',
                examDate: '',
                authProvider: 'google'
            };
            window.currentUserAccount = userObj;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(userObj));
            applyCurrentAccountToUI();

            // Gọi /api/user/record-activity hoặc load profile
            const res = await fetch('/api/user/load-progress');
            const data = await res.json();
            if (data && data.success && data.data) {
                if (data.data.streakInfo) renderStreakWeekDays(data.data.streakInfo);
            }
            UserAuthEngine.loadUserProgress();
            return { user: userObj };
        });

        await delay(2000);

        // 1. Kiểm tra Sảnh hôm nay (Ảnh 4 & Ảnh 2)
        const dashboardState = await page.evaluate(() => {
            return {
                targetScore: document.getElementById('memberTargetScore')?.textContent?.trim(),
                examDate: document.getElementById('memberExamDate')?.textContent?.trim(),
                vocabCount: document.getElementById('memberVocabCount')?.textContent?.trim(),
                accuracyVal: document.getElementById('memberAccuracyVal')?.textContent?.trim(),
                studyTime: document.getElementById('memberStudyTime')?.textContent?.trim(),
                streakTitle: document.getElementById('sanhMemberStreakTitle')?.textContent?.trim(),
                skillGauges: {
                    grammar: {
                        pct: document.getElementById('skillAccuracyGrammarPct')?.textContent?.trim(),
                        count: document.getElementById('skillAccuracyGrammarCount')?.textContent?.trim()
                    },
                    vocab: {
                        pct: document.getElementById('skillAccuracyVocabPct')?.textContent?.trim(),
                        count: document.getElementById('skillAccuracyVocabCount')?.textContent?.trim()
                    },
                    listen: {
                        pct: document.getElementById('skillAccuracyListenPct')?.textContent?.trim(),
                        count: document.getElementById('skillAccuracyListenCount')?.textContent?.trim()
                    },
                    read: {
                        pct: document.getElementById('skillAccuracyReadPct')?.textContent?.trim(),
                        count: document.getElementById('skillAccuracyReadCount')?.textContent?.trim()
                    }
                }
            };
        });
        console.log('Dashboard State:', JSON.stringify(dashboardState, null, 2));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'user_account_dashboard_full.png'), fullPage: false });

        // 2. Lưu mục tiêu điểm số (Ảnh 1)
        console.log('Lưu mục tiêu: 600 điểm, Thi: 20/12/2026...');
        await page.evaluate(() => {
            openTargetModal();
        });
        await delay(500);
        await page.evaluate(() => {
            document.getElementById('inputTargetScore').value = '600';
            document.getElementById('inputTargetDate').value = '20/12/2026';
            saveTargetSettings();
        });
        await delay(1500);

        const targetAfterSave = await page.evaluate(() => {
            return {
                targetScore: document.getElementById('memberTargetScore')?.textContent?.trim(),
                examDate: document.getElementById('memberExamDate')?.textContent?.trim(),
                userTarget: window.currentUserAccount?.targetScore,
                userDate: window.currentUserAccount?.examDate
            };
        });
        console.log('Target Sau Khi Lưu:', JSON.stringify(targetAfterSave, null, 2));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'user_account_target_saved.png'), fullPage: false });

        // 3. Kiểm tra bài học Các thì quá khứ (Ảnh 3)
        await page.evaluate(() => {
            switchTab('ngu-phap');
        });
        await delay(2000);

        const grammarTopicState = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.glass-panel'));
            for (const card of cards) {
                if (card.textContent.includes('Các thì quá khứ')) {
                    const pctSpan = card.querySelector('.text-purple-600.font-bold')?.textContent?.trim() || '';
                    const countSpan = card.querySelector('span.text-\\[11\\.5px\\]')?.textContent?.trim() || '';
                    return { found: true, pctSpan, countSpan };
                }
            }
            return { found: false };
        });
        console.log('Tiến độ Các thì quá khứ của tài khoản mới:', JSON.stringify(grammarTopicState, null, 2));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'user_account_grammar_progress_0_pct.png'), fullPage: false });

        await browser.close();
        console.log('✅ Hoàn tất kiểm thử tài khoản Huynh Dang!');
    } catch (e) {
        if (browser) await browser.close();
        console.error('Lỗi:', e);
        process.exit(1);
    }
})();
