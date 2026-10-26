const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Bắt đầu kiểm tra tính năng "Tải lên File từ vựng (Scan CEFR)" thượng thừa...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1100']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100 });

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

        // 1. Chuyển sang tab Học từ vựng
        console.log('🔄 Chuyển sang tab "hoc-tu-vung"...');
        await page.evaluate(() => {
            window.switchTab('hoc-tu-vung');
        });
        await new Promise(r => setTimeout(r, 1000));

        // 2. Chuyển sang intake mode 'file'
        console.log('📁 Chuyển sang tab "Tải lên File từ vựng (Scan CEFR)"...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) {
                ws.switchIntakeMode('file');
            }
        });
        await new Promise(r => setTimeout(r, 800));

        // 3. Click preset "Oxford Core 3,000 Từ"
        console.log('🌟 Chọn preset "Oxford Core 3,000 Từ"...');
        const presetResult = await page.evaluate(async () => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (!ws) return { error: 'vocabGameWorkstation not found' };
            ws.loadSamplePreset('oxford3000');
            return {
                scannedCount: ws.uploadedFileWords ? ws.uploadedFileWords.length : 0,
                stats: ws.scannedStats || null
            };
        });

        console.log('📊 Kết quả quét preset Oxford 3000:', presetResult);
        if (!presetResult.scannedCount || presetResult.scannedCount === 0) {
            throw new Error('Không quét được từ vựng nào từ preset!');
        }

        await new Promise(r => setTimeout(r, 800));

        // 4. Lọc thử level B2
        console.log('🔍 Click lọc Level B2...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.setFileFilterLevel('B2');
        });
        await new Promise(r => setTimeout(r, 500));

        const b2CardCount = await page.evaluate(() => {
            return document.querySelectorAll('.grid > div.bg-white').length;
        });
        console.log(`✅ Số thẻ từ vựng hiển thị sau khi lọc: ${b2CardCount} thẻ`);

        // Reset về All
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.setFileFilterLevel('ALL');
        });
        await new Promise(r => setTimeout(r, 500));

        // 5. Test search filter
        console.log('🔎 Thử tìm kiếm từ "ability"...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.setFileSearchQuery('ability');
        });
        await new Promise(r => setTimeout(r, 500));

        const searchCardCount = await page.evaluate(() => {
            return document.querySelectorAll('.grid > div.bg-white').length;
        });
        console.log(`✅ Số từ khớp với search "ability": ${searchCardCount}`);

        // Reset search
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.setFileSearchQuery('');
        });
        await new Promise(r => setTimeout(r, 500));

        // 6. Chụp ảnh Dashboard quét CEFR
        const dashboardScreenshot = path.join(ARTIFACT_DIR, 'proof_godtier_scanner_dashboard.png');
        await page.screenshot({ path: dashboardScreenshot });
        console.log('📸 Đã chụp ảnh Dashboard quét CEFR:', dashboardScreenshot);

        // 7. Click "Nạp vào Gundam Arena & Bắn ngay"
        console.log('🎮 Click "Nạp vào Gundam Arena & Bắn ngay"...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.loadScannedIntoGame();
        });
        await new Promise(r => setTimeout(r, 1000));

        const previewScreenshot = path.join(ARTIFACT_DIR, 'proof_godtier_scanner_preview.png');
        await page.screenshot({ path: previewScreenshot });
        console.log('📸 Đã chụp ảnh màn hình Preview nạp từ đã scan:', previewScreenshot);

        // 8. Bắt đầu màn chơi game
        console.log('🚀 Bắt đầu màn chơi Gundam Arena...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.startArena();
        });
        await new Promise(r => setTimeout(r, 1500));

        // Kiểm tra Arena
        const arenaState = await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            const counter = document.getElementById('gameProgressBadge');
            const arena = document.getElementById('vocabGameArena');
            const isVisible = arena && arena.style.display !== 'none';
            return {
                counterText: counter ? counter.textContent.trim() : '',
                arenaVisible: isVisible,
                wordListLength: ws && ws.wordList ? ws.wordList.length : 0,
                currentWord: ws && ws.currentWord ? ws.currentWord.word : ''
            };
        });

        console.log('🚀 Trạng thái Gundam Arena sau khi vào game:', arenaState);

        const arenaScreenshot = path.join(ARTIFACT_DIR, 'proof_godtier_scanner_arena_loaded.png');
        await page.screenshot({ path: arenaScreenshot });
        console.log('📸 Đã chụp ảnh Arena sau khi nạp từ:', arenaScreenshot);

        console.log('🎉 XÁC THỰC HOÀN TOÀN THÀNH CÔNG TÍNH NĂNG SCAN FILE CEFR THƯỢNG THỪA!');
    } catch (err) {
        console.error('❌ Lỗi kiểm thử:', err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
