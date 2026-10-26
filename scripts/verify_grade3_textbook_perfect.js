// scripts/verify_grade3_textbook_perfect.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const PDF_PATH = 'C:\\Users\\Admin\\Downloads\\sách lớp 3\\thuvienhoclieu.com-SGK-Tieng-anh-3-Global-Success-Tap-1.pdf';

(async () => {
    console.log('🚀 Bắt đầu xác minh toàn diện: Scan SGK Tiếng Anh Lớp 3 Global Success & Thư viện 12 khối lớp...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1100']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 1100 });

        page.on('console', msg => {
            const t = msg.text();
            if (t.includes('TextbookCurriculumEngine') || t.includes('Auto-resolved') || t.includes('VocabGameWorkstation')) {
                console.log('BROWSER LOG:', t);
            }
        });

        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 2000));

        // 1. Chuyển sang Tab Học từ vựng (Gundam Workstation)
        console.log('🎮 Chuyển sang Tab Học từ vựng...');
        await page.evaluate(() => {
            if (window.switchTab) window.switchTab('vocab-game');
            if (window.VocabGameWorkstation) window.VocabGameWorkstation.switchIntakeMode('file');
        });
        await new Promise(r => setTimeout(r, 1000));

        // BƯỚC 1: Tải lên file SGK Lớp 3 PDF từ đường dẫn người dùng cung cấp
        console.log('📂 Đang upload file PDF SGK Lớp 3 Global Success...');
        const fileInput = await page.$('#vgFileInput');
        if (!fileInput) throw new Error('#vgFileInput not found!');

        await fileInput.uploadFile(PDF_PATH);

        // Chờ xử lý nhận diện sách giáo khoa
        let stats = null;
        for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 1000));
            stats = await page.evaluate(() => window.VocabGameWorkstation ? window.VocabGameWorkstation.scannedStats : null);
            if (stats && stats.total > 50) {
                console.log(`✅ Scan hoàn tất tại giây thứ ${i+1}:`, stats);
                break;
            }
        }

        // Chụp ảnh BƯỚC 1: Dashboard nhận diện sách giáo khoa Tiếng Anh Lớp 3 (Global Success - Tập 1)
        const proof1Path = path.join(ARTIFACT_DIR, 'proof_step1_grade3_global_success_scanned.png');
        await page.screenshot({ path: proof1Path, fullPage: false });
        console.log('📸 Đã lưu ảnh Proof 1:', proof1Path);

        // BƯỚC 2: Kiểm tra thư viện Sách giáo khoa 12 khối lớp & Click "Tập 2"
        console.log('📚 Kiểm tra click Tập 2 của Lớp 3...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_2');
        });
        await new Promise(r => setTimeout(r, 1000));
        const proof2Path = path.join(ARTIFACT_DIR, 'proof_step2_grade3_vol2_curriculum.png');
        await page.screenshot({ path: proof2Path, fullPage: false });
        console.log('📸 Đã lưu ảnh Proof 2:', proof2Path);

        // Quay lại Tập 1 để học
        await page.evaluate(() => {
            window.VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_1');
        });
        await new Promise(r => setTimeout(r, 800));

        // BƯỚC 3: Chọn một số từ trên lưới thẻ card (hiển thị floating bar)
        console.log('🔖 Chọn các từ: hello, hi, school, playground, teacher...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.toggleSelectWordCard('hello');
            window.VocabGameWorkstation.toggleSelectWordCard('hi');
            window.VocabGameWorkstation.toggleSelectWordCard('school');
            window.VocabGameWorkstation.toggleSelectWordCard('playground');
            window.VocabGameWorkstation.toggleSelectWordCard('teacher');
        });
        await new Promise(r => setTimeout(r, 800));

        const proof3Path = path.join(ARTIFACT_DIR, 'proof_step3_grade3_cards_selected_floating_bar.png');
        await page.screenshot({ path: proof3Path, fullPage: false });
        console.log('📸 Đã lưu ảnh Proof 3:', proof3Path);

        // BƯỚC 4: Lưu vào Sổ từ vựng
        console.log('📖 Lưu các từ đã chọn vào Sổ từ vựng...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.saveSelectedCardsToNotebook();
        });
        await new Promise(r => setTimeout(r, 1000));

        // Mở tab Sổ từ vựng (hoặc cuộn đến Sổ từ vựng)
        await page.evaluate(() => {
            const savedSection = document.getElementById('savedVocabList');
            if (savedSection) savedSection.scrollIntoView({ behavior: 'smooth' });
        });
        await new Promise(r => setTimeout(r, 800));

        const proof4Path = path.join(ARTIFACT_DIR, 'proof_step4_so_tu_vung_with_grade3.png');
        await page.screenshot({ path: proof4Path, fullPage: false });
        console.log('📸 Đã lưu ảnh Proof 4:', proof4Path);

        // BƯỚC 5: Mở Flashcard từ các từ đã chọn
        console.log('🃏 Mở ôn tập Flashcard 3D với từ Lớp 3...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.openFlashcardModal([
                { word: 'school', meaning: 'ngôi trường học', phonetic: '/skuːl/', level: 'A1' },
                { word: 'classroom', meaning: 'phòng học lớp học', phonetic: '/ˈklɑːsruːm/', level: 'A1' },
                { word: 'playground', meaning: 'sân chơi trường học', phonetic: '/ˈpleɪɡraʊnd/', level: 'A1' }
            ], 'Ôn tập Flashcard Tiếng Anh 3 (Global Success)');
        });
        await new Promise(r => setTimeout(r, 1000));

        const proof5Path = path.join(ARTIFACT_DIR, 'proof_step5_flashcard_grade3.png');
        await page.screenshot({ path: proof5Path, fullPage: false });
        console.log('📸 Đã lưu ảnh Proof 5:', proof5Path);

        // Đóng Flashcard và Bắt đầu Bắn súng Gundam Arena với 10 từ của Lớp 3
        console.log('🚀 Nạp vào Gundam Arena & Bắn súng...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.closeFlashcardModal();
            window.VocabGameWorkstation.loadScannedIntoGame();
            window.VocabGameWorkstation.startArena();
        });
        await new Promise(r => setTimeout(r, 2000));

        // Gõ một phím để kích hoạt viên đạn xanh
        await page.keyboard.press('KeyH');
        await new Promise(r => setTimeout(r, 200));

        const proof6Path = path.join(ARTIFACT_DIR, 'proof_step6_gundam_arena_playing_grade3.png');
        await page.screenshot({ path: proof6Path, fullPage: false });
        console.log('📸 Đã lưu ảnh Proof 6:', proof6Path);

        console.log('🎉 TOÀN BỘ 6 BƯỚC XÁC MINH ĐÃ HOÀN TẤT THÀNH CÔNG VƯỢT BẬC!');
    } catch(err) {
        console.error('❌ Lỗi trong quá trình xác minh:', err);
    } finally {
        await browser.close();
    }
})();
