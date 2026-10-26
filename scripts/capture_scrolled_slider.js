const puppeteer = require('puppeteer-core');
const path = require('path');
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const TEST_PDF_PATH = path.join(__dirname, 'Danh-sach-3000-tu-vung-TOEIC.pdf');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1440,1100']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100 });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
    
    // Auth & Navigate
    await page.evaluate(() => {
        const testUser = { uid: 'u1', email: 'test@cungdang.edu.vn', displayName: 'Đăng Totoro' };
        window.currentUserAccount = testUser;
        localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
        if (typeof window.switchTab === 'function') window.switchTab('hoc-tu-vung');
        if (window.VocabGameWorkstation) window.VocabGameWorkstation.switchIntakeMode('file');
    });
    await new Promise(r => setTimeout(r, 600));

    // Upload PDF
    const fileInput = await page.$('#vgFileInput');
    await fileInput.uploadFile(TEST_PDF_PATH);
    await page.waitForFunction(() => {
        const ws = window.VocabGameWorkstation;
        return ws && ws.uploadedFileWords && ws.uploadedFileWords.length > 0;
    });
    await new Promise(r => setTimeout(r, 600));

    // Chọn số lượng từ = 17 từ
    await page.evaluate(() => {
        const ws = window.VocabGameWorkstation;
        if (ws) ws.handleScannedCountSlider(17);
        const slider = document.querySelector('input[type="range"]');
        if (slider) slider.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_pdf_scan_slider_and_cards_scrolled.png') });
    console.log('📸 Đã chụp xong proof_pdf_scan_slider_and_cards_scrolled.png');
    await browser.close();
})();
