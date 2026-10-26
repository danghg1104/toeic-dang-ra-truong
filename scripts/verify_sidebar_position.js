const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Bắt đầu kiểm tra vị trí mục "Học từ vựng" trên Sidebar...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1000']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });

    try {
        console.log('🌐 Truy cập http://127.0.0.1:3000/ ...');
        await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

        // Đăng nhập session nếu cần
        await page.evaluate(() => {
            const testUser = {
                uid: 'user_totoro_vip',
                email: 'dang_totoro@cungdang.edu.vn',
                displayName: 'Đăng Totoro',
                photoURL: 'assets/mascot/totoro_umbrella_logo.png'
            };
            window.currentUserAccount = testUser;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
            if (typeof window.closeAuthModal === 'function') window.closeAuthModal();
            const modal = document.getElementById('authModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                modal.style.display = 'none';
            }
        });
        await new Promise(r => setTimeout(r, 600));

        // Kiểm tra thứ tự các mục trong nav
        const navItems = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('nav button'));
            return buttons.map(b => ({
                id: b.id,
                text: b.querySelector('.sidebar-text') ? b.querySelector('.sidebar-text').textContent.trim() : b.textContent.trim()
            }));
        });

        console.log('📋 Thứ tự các mục menu trên Sidebar:', navItems);

        const loTrinhIdx = navItems.findIndex(item => item.id === 'nav-lo-trinh');
        const hocTuVungIdx = navItems.findIndex(item => item.id === 'nav-hoc-tu-vung');
        const nguPhapIdx = navItems.findIndex(item => item.id === 'nav-ngu-phap');

        console.log(`📍 Vị trí: Lộ trình cá nhân = ${loTrinhIdx}, Học từ vựng = ${hocTuVungIdx}, Ngữ pháp = ${nguPhapIdx}`);

        if (hocTuVungIdx !== loTrinhIdx + 1) {
            throw new Error(`"Học từ vựng" không nằm ngay dưới "Lộ trình cá nhân"! (loTrinhIdx=${loTrinhIdx}, hocTuVungIdx=${hocTuVungIdx})`);
        }

        if (nguPhapIdx !== hocTuVungIdx + 1) {
            throw new Error(`"Học từ vựng" không nằm ngay trên "Ngữ pháp"! (hocTuVungIdx=${hocTuVungIdx}, nguPhapIdx=${nguPhapIdx})`);
        }

        // Chụp ảnh bằng chứng Sidebar
        const sidebarEl = await page.$('aside, #sidebarContainer, .sidebar-container, nav');
        const screenshotPath = path.join(ARTIFACT_DIR, 'proof_sidebar_hoc_tu_vung_below_lo_trinh.png');
        
        // Chụp full page hoặc crop khu vực sidebar
        await page.screenshot({ path: screenshotPath });
        console.log('📸 Đã chụp ảnh Sidebar xác thực vị trí:', screenshotPath);

        console.log('🎉 XÁC THỰC HOÀN TOÀN THÀNH CÔNG: "Học từ vựng" đã nằm ngay dưới "Lộ trình cá nhân"!');
    } catch (err) {
        console.error('❌ Lỗi kiểm thử:', err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
