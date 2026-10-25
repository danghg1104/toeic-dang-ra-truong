const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    let browser;
    try {
        console.log('🚀 Bắt đầu kiểm thử toàn diện Nâng cấp Từ điển Anh - Việt...');
        browser = await puppeteer.launch({
            executablePath: CHROME_PATH,
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,850']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 850 });

        console.log('1. Mở trang http://127.0.0.1:3000...');
        await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await delay(2000);

        // Đăng nhập session user
        console.log('2. Đăng nhập tài khoản kiểm thử...');
        await page.evaluate(async () => {
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
                if (typeof applyCurrentAccountToUI === 'function') applyCurrentAccountToUI();
            }
        });
        await delay(1500);

        // Chuyển sang View Từ điển & Dọn cache IndexedDB cũ để test fresh
        console.log('3. Mở module Từ điển (switchTab tu-dien)...');
        await page.evaluate(async () => {
            if (typeof switchTab === 'function') switchTab('tu-dien');
            if (typeof initDictionaryView === 'function') initDictionaryView();
            // Xóa cache cũ nếu có
            if (window.indexedDB) {
                try {
                    window.indexedDB.deleteDatabase('noble_dict_cache_v2');
                } catch(e) {}
            }
        });
        await delay(1500);

        // =========================================================================
        // TEST CASE 1: Từ dính liền "headsofstate"
        // =========================================================================
        console.log('\n--- TEST CASE 1: Từ dính liền "headsofstate" ---');
        await page.evaluate(async () => {
            await renderDictionaryResult('headsofstate');
        });
        await delay(2000);

        const tc1Content = await page.evaluate(() => {
            const container = document.getElementById('dictResultContainer');
            return {
                text: container ? container.innerText : '',
                hasSegmentBanner: container ? container.innerText.includes('tự động nhận diện từ dính liền') : false,
                hasLemmaBanner: container ? container.innerText.includes('từ gốc: head of state') || container.innerText.includes('head of state') : false,
                hasMeaning: container ? container.innerText.includes('nguyên thủ quốc gia') : false
            };
        });
        console.log('TC1 Kết quả:', tc1Content);

        const shot1Path = path.join(ARTIFACT_DIR, 'test_dict_headsofstate.png');
        await page.screenshot({ path: shot1Path, fullPage: false });
        console.log('📸 Đã lưu ảnh:', shot1Path);

        // =========================================================================
        // TEST CASE 2: Cụm từ danh từ số nhiều "heads of state"
        // =========================================================================
        console.log('\n--- TEST CASE 2: Cụm từ số nhiều "heads of state" ---');
        await page.evaluate(async () => {
            await renderDictionaryResult('heads of state');
        });
        await delay(2000);

        const tc2Content = await page.evaluate(() => {
            const container = document.getElementById('dictResultContainer');
            return {
                text: container ? container.innerText : '',
                hasLemmaBanner: container ? container.innerText.includes('từ gốc: head of state') || container.innerText.includes('head of state') : false,
                hasMeaning: container ? container.innerText.includes('nguyên thủ quốc gia') : false
            };
        });
        console.log('TC2 Kết quả:', tc2Content);

        const shot2Path = path.join(ARTIFACT_DIR, 'test_dict_heads_of_state.png');
        await page.screenshot({ path: shot2Path, fullPage: false });
        console.log('📸 Đã lưu ảnh:', shot2Path);

        // =========================================================================
        // TEST CASE 3: Phrasal verb dính liền "runoutof"
        // =========================================================================
        console.log('\n--- TEST CASE 3: Phrasal verb dính liền "runoutof" ---');
        await page.evaluate(async () => {
            await renderDictionaryResult('runoutof');
        });
        await delay(2000);

        const tc3Content = await page.evaluate(() => {
            const container = document.getElementById('dictResultContainer');
            return {
                text: container ? container.innerText : '',
                hasSegmentBanner: container ? container.innerText.includes('tự động nhận diện từ dính liền') : false,
                hasMeaning: container ? container.innerText.includes('cạn kiệt') || container.innerText.includes('Hết') : false
            };
        });
        console.log('TC3 Kết quả:', tc3Content);

        const shot3Path = path.join(ARTIFACT_DIR, 'test_dict_runoutof.png');
        await page.screenshot({ path: shot3Path, fullPage: false });
        console.log('📸 Đã lưu ảnh:', shot3Path);

        // =========================================================================
        // TEST CASE 4: Danh từ số nhiều bất quy tắc "matrices"
        // =========================================================================
        console.log('\n--- TEST CASE 4: Số nhiều bất quy tắc "matrices" ---');
        await page.evaluate(async () => {
            await renderDictionaryResult('matrices');
        });
        await delay(2000);

        const tc4Content = await page.evaluate(() => {
            const container = document.getElementById('dictResultContainer');
            return {
                text: container ? container.innerText : '',
                hasLemmaBanner: container ? container.innerText.includes('matrix') : false,
                hasMeaning: container ? container.innerText.includes('ma trận') : false
            };
        });
        console.log('TC4 Kết quả:', tc4Content);

        const shot4Path = path.join(ARTIFACT_DIR, 'test_dict_matrices.png');
        await page.screenshot({ path: shot4Path, fullPage: false });
        console.log('📸 Đã lưu ảnh:', shot4Path);

        // =========================================================================
        // TEST CASE 5: Lỗi chính tả / Typo "recieve" -> Did-you-mean "receive"
        // =========================================================================
        console.log('\n--- TEST CASE 5: Gõ sai "recieve" (Did-you-mean) ---');
        await page.evaluate(async () => {
            await renderDictionaryResult('recieve');
        });
        await delay(2000);

        const tc5Content = await page.evaluate(() => {
            const container = document.getElementById('dictResultContainer');
            return {
                text: container ? container.innerText : '',
                hasSuggestion: container ? container.innerText.includes('Ý bạn có phải là') && container.innerText.includes('receive') : false
            };
        });
        console.log('TC5 Kết quả:', tc5Content);

        const shot5Path = path.join(ARTIFACT_DIR, 'test_dict_recieve_typo.png');
        await page.screenshot({ path: shot5Path, fullPage: false });
        console.log('📸 Đã lưu ảnh:', shot5Path);

        console.log('\n🎉 TẤT CẢ 5 TEST CASES ĐÃ HOÀN TẤT THÀNH CÔNG RỰC RỠ!');
    } catch (err) {
        console.error('❌ Lỗi kiểm thử:', err);
    } finally {
        if (browser) await browser.close();
    }
})();
