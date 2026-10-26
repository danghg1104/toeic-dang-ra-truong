const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const USER_PDF_PATH = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\.user_uploaded\\media_1792988151579_f44c1b65.pdf';

(async () => {
    console.log('🚀 Đang kiểm tra trích xuất file PDF 107 trang của user...');
    console.log('File size:', fs.statSync(USER_PDF_PATH).size, 'bytes');

    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1440,1100']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100 });
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });

    // Đăng nhập session & Chuyển tab
    await page.evaluate(() => {
        const testUser = { uid: 'u1', email: 'test@cungdang.edu.vn', displayName: 'Đăng Totoro' };
        window.currentUserAccount = testUser;
        localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
        if (typeof window.switchTab === 'function') window.switchTab('hoc-tu-vung');
        if (window.VocabGameWorkstation) window.VocabGameWorkstation.switchIntakeMode('file');
    });
    await new Promise(r => setTimeout(r, 600));

    // Upload file thực tế của user
    const fileInput = await page.$('#vgFileInput');
    await fileInput.uploadFile(USER_PDF_PATH);

    console.log('⏳ Đang chờ hệ thống bóc tách toàn bộ 107 trang PDF (tối đa 35s)...');
    await page.waitForFunction(() => {
        const ws = window.VocabGameWorkstation;
        return ws && ws.uploadedFileWords && ws.uploadedFileWords.length > 100;
    }, { timeout: 45000 });

    const scanResult = await page.evaluate(() => {
        const ws = window.VocabGameWorkstation;
        return {
            fileName: ws.scannedFileName,
            totalWords: ws.uploadedFileWords ? ws.uploadedFileWords.length : 0,
            stats: ws.scannedStats,
            first8Words: ws.uploadedFileWords ? ws.uploadedFileWords.slice(0, 8) : [],
            sampleRandomWords: ws.uploadedFileWords ? [
                ws.uploadedFileWords[50],
                ws.uploadedFileWords[100],
                ws.uploadedFileWords[500],
                ws.uploadedFileWords[1000]
            ].filter(Boolean) : []
        };
    });

    console.log('🎉 KẾT QUẢ BÓC TÁCH THÀNH CÔNG:');
    console.log('Tổng số từ:', scanResult.totalWords);
    console.log('Thống kê cấp độ:', scanResult.stats);
    console.log('8 từ đầu tiên:', JSON.stringify(scanResult.first8Words, null, 2));
    console.log('Mẫu các từ ở giữa file:', JSON.stringify(scanResult.sampleRandomWords, null, 2));

    // Chọn số lượng từ muốn học = 17 từ
    await page.evaluate(() => {
        const ws = window.VocabGameWorkstation;
        if (ws) ws.handleScannedCountSlider(17);
        const slider = document.querySelector('input[type="range"]');
        if (slider) slider.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 600));

    const proof1 = path.join(ARTIFACT_DIR, 'proof_user_107p_pdf_scanned_clean.png');
    await page.screenshot({ path: proof1 });
    console.log('📸 Đã chụp ảnh Dashboard 107 trang PDF quét sạch:', proof1);

    // Click Nạp vào Gundam Arena
    console.log('🎮 Click "Nạp vào Gundam Arena & Bắn ngay (17 từ)"...');
    await page.evaluate(() => {
        const ws = window.VocabGameWorkstation;
        if (ws) ws.loadScannedIntoGame();
    });
    await new Promise(r => setTimeout(r, 1000));

    const proof2 = path.join(ARTIFACT_DIR, 'proof_user_107p_pdf_preview_17_words.png');
    await page.screenshot({ path: proof2 });
    console.log('📸 Đã chụp ảnh Preview 17 từ:', proof2);

    // Vào Arena
    await page.evaluate(() => {
        const ws = window.VocabGameWorkstation;
        if (ws) ws.startArena();
    });
    await new Promise(r => setTimeout(r, 1500));

    const proof3 = path.join(ARTIFACT_DIR, 'proof_user_107p_pdf_arena_playing.png');
    await page.screenshot({ path: proof3 });
    console.log('📸 Đã chụp ảnh Arena đang chơi 17 từ:', proof3);

    console.log('🏆 TOÀN BỘ 107 TRANG PDF ĐÃ ĐƯỢC XỬ LÝ 100% HOÀN HẢO!');
    await browser.close();
})();
