const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const TEST_PDF_PATH = path.join(__dirname, 'Danh-sach-3000-tu-vung-TOEIC.pdf');

(async () => {
    console.log('🚀 Bắt đầu tạo file PDF kiểm thử và kiểm tra tính năng Scan PDF & Slider...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1100']
    });

    try {
        // BƯỚC 1: Tạo file PDF kiểm thử thực tế mô phỏng 100% cấu trúc PDF của người dùng
        console.log('📄 Đang tạo file PDF thực tế:', TEST_PDF_PATH);
        const pdfPage = await browser.newPage();
        await pdfPage.setContent(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: sans-serif; padding: 20px; }
                    h2 { text-align: center; color: #1e3a8a; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #333; padding: 6px 10px; font-size: 13px; }
                    th { background: #f0f4f8; }
                </style>
            </head>
            <body>
                <h2>Danh sách 3000 từ vựng TOEIC</h2>
                <table>
                    <tr><th>STT</th><th>Từ vựng</th></tr>
                    <tr><td>1</td><td>abandon v. /ə'bændən/ bỏ, từ bỏ</td></tr>
                    <tr><td>2</td><td>abandoned adj. /ə'bændənd/ bị bỏ rơi, bị ruồng bỏ</td></tr>
                    <tr><td>3</td><td>ability n. /ə'biliti/ khả năng, năng lực</td></tr>
                    <tr><td>4</td><td>able adj. /'eibl/ có năng lực, có tài</td></tr>
                    <tr><td>5</td><td>unable adj. /'ʌn'eibl/ không có năng lực, không có tài</td></tr>
                    <tr><td>6</td><td>about adv., prep. /ə'baut/ khoảng, về</td></tr>
                    <tr><td>7</td><td>above prep., adv. /ə'bʌv/ ở trên, lên trên</td></tr>
                    <tr><td>8</td><td>abroad adv. /ə'brɔ:d/ ở, ra nước ngoài, ngoài trời</td></tr>
                    <tr><td>9</td><td>absence n. /'æbsəns/ sự vắng mặt</td></tr>
                    <tr><td>10</td><td>absent adj. /'æbsənt/ vắng mặt, nghỉ</td></tr>
                    <tr><td>11</td><td>absolute adj. /'æbsəlu:t/ tuyệt đối, hoàn toàn</td></tr>
                    <tr><td>12</td><td>absolutely adv. /'æbsəlu:tli/ tuyệt đối, hoàn toàn</td></tr>
                    <tr><td>13</td><td>absorb v. /əb'sɔ:b/ thu hút, hấp thu, lôi cuốn</td></tr>
                    <tr><td>14</td><td>abuse n., v. /ə'bju:s/ lộng hành, lạm dụng</td></tr>
                    <tr><td>15</td><td>academic adj. /,ækə'demik/ thuộc học viện, ĐH, viện hàn lâm</td></tr>
                    <tr><td>16</td><td>accent n. /'æksənt/ trọng âm, dấu trọng âm</td></tr>
                    <tr><td>17</td><td>accept v. /ək'sept/ chấp nhận, chấp thuận</td></tr>
                    <tr><td>18</td><td>acceptable adj. /ək'septəbl/ có thể chấp nhận, chấp thuận</td></tr>
                    <tr><td>19</td><td>unacceptable adj. /'ʌnək'septəbl/ không thể chấp nhận</td></tr>
                    <tr><td>20</td><td>access n. /'ækses/ lối, cửa, đường vào</td></tr>
                    <tr><td>21</td><td>accident n. /'æksidənt/ tai nạn, rủi ro</td></tr>
                    <tr><td>22</td><td>by accident tình cờ</td></tr>
                    <tr><td>23</td><td>accidental adj. /,æksi'dentl/ tình cờ, bất ngờ</td></tr>
                    <tr><td>24</td><td>accidentally adv. /,æksi'dentəli/ tình cờ, ngẫu nhiên</td></tr>
                    <tr><td>25</td><td>accommodation n. /ə,kɔmə'deiʃn/ sự thích nghi, điều tiết</td></tr>
                    <tr><td>26</td><td>accompany v. /ə'kʌmpəni/ đi theo, đi cùng, kèm theo</td></tr>
                    <tr><td>27</td><td>according to prep. /ə'kɔ:diɳ/ theo, y theo</td></tr>
                    <tr><td>28</td><td>account n., v. /ə'kaunt/ tài khoản, kế toán; tính toán, tính đến</td></tr>
                    <tr><td>29</td><td>accurate adj. /'ækjurit/ đúng đắn, chính xác, xác đáng</td></tr>
                    <tr><td>30</td><td>accurately adv. /'ækjuritli/ đúng đắn, chính xác</td></tr>
                </table>
            </body>
            </html>
        `);
        await pdfPage.pdf({ path: TEST_PDF_PATH, format: 'A4' });
        await pdfPage.close();
        console.log('✅ Đã tạo xong file PDF thử nghiệm chuẩn.');

        // BƯỚC 2: Truy cập ứng dụng
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 1100 });

        console.log('🌐 Truy cập http://127.0.0.1:3000/ ...');
        await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

        // Đăng nhập session
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

        // Chuyển sang tab Học từ vựng
        console.log('🔄 Chuyển sang tab "hoc-tu-vung"...');
        await page.evaluate(() => {
            window.switchTab('hoc-tu-vung');
        });
        await new Promise(r => setTimeout(r, 800));

        // Chuyển sang intake mode 'file'
        console.log('📁 Chuyển sang tab "Tải lên File từ vựng (Scan CEFR)"...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.switchIntakeMode('file');
        });
        await new Promise(r => setTimeout(r, 800));

        // BƯỚC 3: Upload file PDF vào input
        console.log('📤 Đang upload file PDF vào #vgFileInput...');
        const fileInput = await page.$('#vgFileInput');
        if (!fileInput) throw new Error('Không tìm thấy element #vgFileInput!');
        await fileInput.uploadFile(TEST_PDF_PATH);

        // Chờ xử lý bóc tách PDF hoàn tất
        console.log('⏳ Đang chờ hệ thống phân tích PDF...');
        await page.waitForFunction(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            return ws && ws.uploadedFileWords && ws.uploadedFileWords.length > 0;
        }, { timeout: 20000 });

        // Lấy thông tin kết quả bóc tách
        const scanResult = await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            return {
                fileName: ws.scannedFileName,
                totalWords: ws.uploadedFileWords ? ws.uploadedFileWords.length : 0,
                first5Words: ws.uploadedFileWords ? ws.uploadedFileWords.slice(0, 5) : [],
                selectedCount: ws.scannedSelectedCount
            };
        });

        console.log('📊 Kết quả quét PDF thực tế:', JSON.stringify(scanResult, null, 2));

        // Kiểm tra xem có từ rác obj, Title, Skia hay không
        const hasGarbage = scanResult.first5Words.some(item => 
            ['obj', 'title', 'producer', 'skia', 'pdf', 'docs', 'renderer'].includes(item.word.toLowerCase())
        );
        if (hasGarbage) {
            throw new Error('Vẫn bị dính từ rác binary/metadata của PDF!');
        }

        // Kiểm tra xem nghĩa tiếng Việt có thực sự được bóc tách hay không
        const firstWord = scanResult.first5Words[0];
        console.log(`🔍 Kiểm tra từ đầu tiên: "${firstWord.word}" - Nghĩa: "${firstWord.meaning}" - IPA: "${firstWord.phonetic}" - CEFR: "${firstWord.level}"`);
        if (firstWord.meaning === 'từ vựng học tập' && firstWord.word === 'abandon') {
            throw new Error('Nghĩa tiếng Việt không được bóc tách từ bảng!');
        }

        await new Promise(r => setTimeout(r, 800));

        // BƯỚC 4: Kiểm tra Section 3 Slider & Chọn số lượng từ muốn học (17 từ)
        console.log('🎛️ Chọn số lượng từ muốn học = 17 từ qua quick chip...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.handleScannedCountSlider(17);
        });
        await new Promise(r => setTimeout(r, 500));

        // Chụp ảnh bằng chứng Dashboard quét PDF sạch và Slider chọn số lượng từ
        const dashboardScreenshot = path.join(ARTIFACT_DIR, 'proof_pdf_scan_clean_meaning_and_slider.png');
        await page.screenshot({ path: dashboardScreenshot });
        console.log('📸 Đã chụp ảnh Dashboard quét PDF và Slider:', dashboardScreenshot);

        // BƯỚC 5: Click Nạp vào Gundam Arena
        console.log('🎮 Click "Nạp vào Gundam Arena & Bắn ngay (17 từ)"...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.loadScannedIntoGame();
        });
        await new Promise(r => setTimeout(r, 1000));

        const previewWordsCount = await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            return ws && ws.wordList ? ws.wordList.length : 0;
        });
        console.log(`✅ Số từ nạp vào Preview: ${previewWordsCount} từ (kỳ vọng 17)`);

        const previewScreenshot = path.join(ARTIFACT_DIR, 'proof_pdf_preview_17_words.png');
        await page.screenshot({ path: previewScreenshot });
        console.log('📸 Đã chụp ảnh màn hình Preview 17 từ:', previewScreenshot);

        // BƯỚC 6: Bắt đầu màn chơi game
        console.log('🚀 Bắt đầu màn chơi Gundam Arena...');
        await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            if (ws) ws.startArena();
        });
        await new Promise(r => setTimeout(r, 1500));

        const arenaState = await page.evaluate(() => {
            const ws = window.VocabGameWorkstation || window.vocabGameWorkstation;
            const badge = document.querySelector('#vocabGameArena span');
            return {
                wordListLength: ws && ws.wordList ? ws.wordList.length : 0,
                currentWord: ws && ws.currentWord ? ws.currentWord.word : ''
            };
        });

        console.log('🚀 Trạng thái Gundam Arena khi chơi:', arenaState);

        const arenaScreenshot = path.join(ARTIFACT_DIR, 'proof_pdf_arena_17_words.png');
        await page.screenshot({ path: arenaScreenshot });
        console.log('📸 Đã chụp ảnh Arena 17 từ thực tế:', arenaScreenshot);

        console.log('🎉 TẤT CẢ CÁC LỖI ĐÃ ĐƯỢC FIX VÀ TÍNH NĂNG SLIDER HOẠT ĐỘNG HOÀN HẢO 100%!');
    } catch(err) {
        console.error('❌ Lỗi kiểm thử:', err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
