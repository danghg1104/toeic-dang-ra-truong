const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    let browser;
    try {
        console.log('🚀 Bắt đầu kiểm thử tự động 4 lỗi theo yêu cầu...');
        browser = await puppeteer.launch({
            executablePath: CHROME_PATH,
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        console.log('1. Mở trang http://127.0.0.1:3000...');
        await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('DOM Content Loaded!');
        await delay(3000);

        // Đăng nhập bằng tài khoản test local
        console.log('2. Đăng nhập tài khoản kiểm thử...');
        const loginRes = await page.evaluate(async () => {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    loginId: 'usera_1792720086031',
                    password: 'password123'
                })
            });
            const data = await res.json();
            if (data.success && data.user) {
                window.currentUserAccount = data.user;
                localStorage.setItem('cung_dang_session_user', JSON.stringify(data.user));
                applyCurrentAccountToUI();
                if (data.streakInfo) renderStreakWeekDays(data.streakInfo);
                UserAuthEngine.loadUserProgress();
            }
            return data;
        });
        console.log('Kết quả đăng nhập API:', loginRes.success, loginRes.user?.name);
        await delay(2000);

        // KIỂM TRA 1: Thẻ Streak và 5 thẻ số liệu thật (Ảnh 4)
        console.log('\n=== KIỂM TRA LỖI 4: STREAK HÀNG NGÀY VÀ 5 THẺ SỐ LIỆU THẬT ===');
        const streakInfo = await page.evaluate(() => {
            const title = document.getElementById('sanhMemberStreakTitle')?.textContent?.trim() || '';
            const streakVal = document.getElementById('sanhMemberStreakVal')?.textContent?.trim() || '';
            const vocabCount = document.getElementById('memberVocabCount')?.textContent?.trim() || '';
            const accuracyVal = document.getElementById('memberAccuracyVal')?.textContent?.trim() || '';
            const studyTime = document.getElementById('memberStudyTime')?.textContent?.trim() || '';
            const days = Array.from(document.querySelectorAll('#memberStreakDaysRow > div')).map(el => {
                const label = el.querySelector('span')?.textContent?.trim() || '';
                const isActive = el.innerHTML.includes('🔥');
                return { label, isActive };
            });
            return { title, streakVal, vocabCount, accuracyVal, studyTime, days };
        });
        console.log('Kết quả Streak & 5 thẻ:', JSON.stringify(streakInfo, null, 2));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_anh_4_streak_va_so_lieu_that.png'), fullPage: false });

        // KIỂM TRA 2: Độ chính xác kỹ năng (Ảnh 2)
        console.log('\n=== KIỂM TRA LỖI 2: ĐỘ CHÍNH XÁC KỸ NĂNG (KHÔNG VIẾT CỨNG SỐ LIỆU ẢNH) ===');
        const skillGauges = await page.evaluate(() => {
            return {
                grammarPct: document.getElementById('skillAccuracyGrammarPct')?.textContent?.trim(),
                grammarCount: document.getElementById('skillAccuracyGrammarCount')?.textContent?.trim(),
                vocabPct: document.getElementById('skillAccuracyVocabPct')?.textContent?.trim(),
                vocabCount: document.getElementById('skillAccuracyVocabCount')?.textContent?.trim(),
                listenPct: document.getElementById('skillAccuracyListenPct')?.textContent?.trim(),
                listenCount: document.getElementById('skillAccuracyListenCount')?.textContent?.trim(),
                readPct: document.getElementById('skillAccuracyReadPct')?.textContent?.trim(),
                readCount: document.getElementById('skillAccuracyReadCount')?.textContent?.trim(),
            };
        });
        console.log('Kết quả 4 Gauges Độ chính xác kỹ năng:', JSON.stringify(skillGauges, null, 2));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_anh_2_do_chinh_xac_ky_nang.png'), fullPage: false });

        // KIỂM TRA 3: Lưu mục tiêu điểm số và ngày thi (Ảnh 1)
        console.log('\n=== KIỂM TRA LỖI 1: LƯU MỤC TIÊU ĐIỂM SỐ VÀ NGÀY THI ===');
        await page.evaluate(() => {
            openTargetModal();
        });
        await delay(500);

        await page.evaluate(() => {
            document.getElementById('inputTargetScore').value = '650';
            document.getElementById('inputTargetDate').value = '25/12/2026';
            saveTargetSettings();
        });
        await delay(1500);

        const savedTarget = await page.evaluate(() => {
            return {
                memberTargetScore: document.getElementById('memberTargetScore')?.textContent?.trim(),
                memberExamDate: document.getElementById('memberExamDate')?.textContent?.trim(),
                currentUserTarget: window.currentUserAccount?.targetScore,
                currentUserExamDate: window.currentUserAccount?.examDate,
                targetModalHidden: document.getElementById('targetModal')?.classList.contains('hidden')
            };
        });
        console.log('Kết quả Thẻ Mục tiêu sau khi lưu:', JSON.stringify(savedTarget, null, 2));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_anh_1_luu_muc_tieu_thanh_cong.png'), fullPage: false });

        // KIỂM TRA 4: Tiến độ bài học Các thì quá khứ (Ảnh 3)
        console.log('\n=== KIỂM TRA LỖI 3: TIẾN ĐỘ BÀI HỌC CÁC THÌ QUÁ KHỨ ===');
        await page.evaluate(() => {
            switchTab('ngu-phap');
        });
        await delay(2000);

        const pastTenseProgress = await page.evaluate(() => {
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
        console.log('Kết quả Tiến độ Các thì quá khứ:', JSON.stringify(pastTenseProgress, null, 2));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_anh_3_tien_do_bai_hoc_0_pct.png'), fullPage: false });

        await browser.close();
        console.log('\n🎉 Toàn bộ kiểm thử tự động ĐÃ HOÀN TẤT THÀNH CÔNG!');
    } catch (e) {
        if (browser) await browser.close();
        console.error('Lỗi kiểm thử:', e);
        process.exit(1);
    }
})();
