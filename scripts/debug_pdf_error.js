const puppeteer = require('puppeteer-core');
const path = require('path');
const TEST_PDF_PATH = path.join(__dirname, 'Danh-sach-3000-tu-vung-TOEIC.pdf');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
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
    await new Promise(r => setTimeout(r, 4000));
    await browser.close();
})();
