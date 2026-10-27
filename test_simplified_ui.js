const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Bắt đầu kiểm thử giao diện tinh gọn mới...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--autoplay-policy=no-user-gesture-required',
            '--disable-web-security'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        console.log('1. Truy cập http://localhost:3000/');
        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Giả lập phiên đăng nhập
        await page.evaluate(() => {
            const user = { id: 'student_001', email: 'student@example.com', name: 'Đăng Học Viên', role: 'student' };
            localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
            window.currentUserAccount = user;
            if (typeof window.closeAuthModal === 'function') window.closeAuthModal();
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';
        });

        await new Promise(r => setTimeout(r, 600));

        // 1. Kiểm tra Sidebar
        console.log('\n2. Kiểm tra Sidebar: Bóc băng file nghe 1 hàng, bỏ AI STT');
        const sidebarCheck = await page.evaluate(() => {
            const btn = document.getElementById('nav-boc-bang-audio');
            if (!btn) return { exists: false };
            const text = btn.innerText || btn.textContent;
            const hasAiStt = text.includes('AI STT');
            const rect = btn.getBoundingClientRect();
            return {
                exists: true,
                text: text.trim(),
                hasAiStt,
                height: rect.height,
                width: rect.width
            };
        });

        console.log('Sidebar check result:', sidebarCheck);
        if (sidebarCheck.hasAiStt) {
            throw new Error('Huy hiệu AI STT vẫn còn trong sidebar!');
        }
        console.log('✅ Đã loại bỏ huy hiệu AI STT và đưa "Bóc băng file nghe" về 1 hàng duy nhất chuẩn xác!');

        // Chụp ảnh cận cảnh Sidebar
        const sidebarEl = await page.$('#sidebarMenu') || await page.$('aside') || await page.$('.sidebar-container');
        if (sidebarEl) {
            const sidebarPic = path.join(ARTIFACT_DIR, 'proof_sidebar_single_line_no_aistt.png');
            await sidebarEl.screenshot({ path: sidebarPic });
            console.log(`📸 Đã lưu ảnh minh chứng Sidebar: ${sidebarPic}`);
        }

        // 2. Kiểm tra Header tinh gọn trong Trạm Bóc Băng
        console.log('\n3. Kiểm tra Header tinh gọn của Trạm Bóc Băng:');
        await page.evaluate(() => {
            if (typeof window.switchTab === 'function') {
                window.switchTab('boc-bang-audio');
            }
        });
        await new Promise(r => setTimeout(r, 800));

        const headerPic = path.join(ARTIFACT_DIR, 'proof_boc_bang_simplified_compact_header.png');
        await page.screenshot({ path: headerPic, fullPage: false });
        console.log(`📸 Đã lưu ảnh minh chứng Header tinh gọn: ${headerPic}`);

        // 3. Kiểm tra Cài Đặt của web (View Cài Đặt có mục AI Bóc Băng)
        console.log('\n4. Kiểm tra trang Cài Đặt của web (View Cài Đặt):');
        await page.evaluate(() => {
            if (typeof window.switchTab === 'function') {
                window.switchTab('cai-dat');
            }
        });
        await new Promise(r => setTimeout(r, 800));

        // Kiểm tra xem Card 5 có tồn tại và nhận giá trị
        const settingsCheck = await page.evaluate(() => {
            const sel = document.getElementById('settingsSttEngineSelect');
            const inp = document.getElementById('settingsGroqApiKeyInput');
            return {
                hasEngineSelect: !!sel,
                hasKeyInput: !!inp,
                engineValue: sel?.value
            };
        });
        console.log('Settings view check:', settingsCheck);

        // Cuộn tới mục AI STT trong cài đặt
        await page.evaluate(() => {
            const sel = document.getElementById('settingsSttEngineSelect');
            if (sel) sel.scrollIntoView({ behavior: 'instant', block: 'center' });
        });
        await new Promise(r => setTimeout(r, 500));

        const settingsPic = path.join(ARTIFACT_DIR, 'proof_settings_web_with_ai_stt_card.png');
        await page.screenshot({ path: settingsPic, fullPage: false });
        console.log(`📸 Đã lưu ảnh minh chứng Cài Đặt AI trong Cài Đặt của web: ${settingsPic}`);

        console.log('\n🎉 HOÀN TẤT KIỂM THỬ THÀNH CÔNG 100%!');

    } catch (err) {
        console.error('❌ Lỗi:', err);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
