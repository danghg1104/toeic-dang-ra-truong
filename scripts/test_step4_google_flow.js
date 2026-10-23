const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('--- BẮT ĐẦU KIỂM TRA TRÌNH DUYỆT THẬT (PUPPETEER / PLAYWRIGHT) ---');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1280,900']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        const consoleLogs = [];
        page.on('console', msg => consoleLogs.push(msg.text()));

        // 1. Mở localhost:3000
        console.log('1. Đang mở http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

        // Chờ modal xuất hiện
        await page.waitForSelector('#authModal', { timeout: 5000 });
        console.log('2. Đã mở trang và hiển thị #authModal.');

        // Kiểm tra xem nút Google có bị ẩn khi chưa có GOOGLE_CLIENT_ID không
        const isGoogleSectionHidden = await page.evaluate(() => {
            const sec = document.getElementById('googleSignInSectionLogin');
            return sec ? sec.classList.contains('hidden') : null;
        });
        console.log('3. Trạng thái ẩn của khu vực Google (#googleSignInSectionLogin):', isGoogleSectionHidden);

        // Kiểm tra xem còn bất kỳ bảng chọn tài khoản giả nào trong DOM không
        const fakeElements = await page.evaluate(() => {
            const allText = document.body.innerText;
            const keywords = ['Chọn tài khoản', 'doncry152', 'danghg20008', 'neveralonevp', 'Sử dụng một tài khoản khác'];
            return keywords.filter(k => allText.includes(k));
        });
        console.log('4. Kiểm tra các chuỗi giả trong DOM:', fakeElements);

        // Chụp ảnh bằng chứng 1: Khi chưa có GOOGLE_CLIENT_ID (Nút Google bị ẩn, form sạch sẽ)
        const shot1Path = path.join(ARTIFACT_DIR, 'step1c_auth_modal_clean_no_client_id.png');
        await page.screenshot({ path: shot1Path, fullPage: false });
        console.log('5. Đã lưu ảnh chụp khi chưa có Client ID:', shot1Path);

        // 2. Giả lập thử nghiệm có Client ID để kiểm tra khung/iframe của Google GIS
        console.log('\n--- KIỂM TRA LUỒNG GOOGLE GIS KHI ĐƯỢC CẤP CLIENT ID ---');
        // Test client ID chuẩn Web Application format
        const testClientId = '123456789012-abcdefghijklmnopqrstuvwxyz012345.apps.googleusercontent.com';
        
        // Khởi tạo Google GIS trực tiếp trên trang bằng thư viện chính thức accounts.google.com
        const gisResult = await page.evaluate(async (cid) => {
            window.googleAuthClientId = cid;
            const loginSec = document.getElementById('googleSignInSectionLogin');
            if (loginSec) loginSec.classList.remove('hidden');

            return new Promise((resolve) => {
                if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
                    return resolve({ success: false, reason: 'Google GIS SDK chưa nạp' });
                }

                google.accounts.id.initialize({
                    client_id: cid,
                    callback: (response) => {
                        console.log('[Google Credential Response]', response);
                    },
                    auto_select: false
                });

                const container = document.getElementById('googleOfficialBtnContainerLogin');
                if (container) {
                    container.innerHTML = '';
                    container.classList.remove('hidden');
                    google.accounts.id.renderButton(container, {
                        type: 'standard',
                        shape: 'pill',
                        theme: 'outline',
                        text: 'continue_with',
                        size: 'large',
                        width: 320
                    });
                }

                const customBtn = document.getElementById('customGoogleSignInBtnLogin');
                if (customBtn) customBtn.classList.add('hidden');

                // Gọi prompt để xem One Tap / Iframe popup Google
                google.accounts.id.prompt((notification) => {
                    resolve({
                        success: true,
                        displayed: notification.isDisplayed(),
                        notDisplayedReason: notification.getNotDisplayedReason ? notification.getNotDisplayedReason() : null
                    });
                });

                setTimeout(() => {
                    resolve({ success: true, timeout: true });
                }, 3000);
            });
        }, testClientId);

        console.log('6. Kết quả khởi tạo Google GIS:', gisResult);

        // Đợi 2 giây để iframe Google GIS hiển thị
        await new Promise(r => setTimeout(r, 2000));

        // Lấy tất cả iframe trên trang để kiểm tra domain
        const frames = page.frames();
        const frameUrls = frames.map(f => f.url()).filter(u => u.length > 0);
        console.log('7. Danh sách URL iframe đang nhúng trên trang:', frameUrls);

        const googleFrames = frameUrls.filter(u => u.includes('accounts.google.com'));
        console.log('8. Iframe thuộc accounts.google.com:', googleFrames);

        // Chụp ảnh bằng chứng 2: Nút bấm và iframe do Google chính thức render
        const shot2Path = path.join(ARTIFACT_DIR, 'step4_google_official_gis_rendered.png');
        await page.screenshot({ path: shot2Path, fullPage: false });
        console.log('9. Đã lưu ảnh chụp Google GIS thật:', shot2Path);

    } finally {
        await browser.close();
    }
})();
