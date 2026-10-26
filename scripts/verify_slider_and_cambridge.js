const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Bắt đầu kiểm thử Range Slider 1-50 & Vốn từ Cambridge...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1000']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });

    try {
        console.log('🌐 Đang truy cập http://127.0.0.1:3000/ ...');
        await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

        // Đăng nhập session & Chuyển tab học từ vựng
        console.log('📚 Chuyển sang tab Học từ vựng...');
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
            window.switchTab('hoc-tu-vung');
        });
        await new Promise(r => setTimeout(r, 800));

        // 1. Kiểm tra sự hiện diện của Range Slider & Ô nhập số
        console.log('🔍 Kiểm tra DOM Range Slider & Number Input...');
        const hasSlider = await page.$('#vgCountSlider');
        const hasNumInput = await page.$('#vgCountNumInput');
        const hasBadge = await page.$('#vgCountBadgeNum');

        if (!hasSlider || !hasNumInput || !hasBadge) {
            throw new Error('Không tìm thấy #vgCountSlider hoặc #vgCountNumInput hoặc #vgCountBadgeNum');
        }

        // 2. Thử nghiệm kéo slider về 17 từ (số lẻ tùy chọn theo yêu cầu user)
        console.log('🎚️ Thiết lập số lượng từ về 17 (số lẻ theo user request)...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.handleSliderInput('17');
        });
        await new Promise(r => setTimeout(r, 400));

        const countValues = await page.evaluate(() => {
            return {
                slider: document.getElementById('vgCountSlider').value,
                numInput: document.getElementById('vgCountNumInput').value,
                badge: document.getElementById('vgCountBadgeNum').textContent.trim(),
                selectedCount: window.VocabGameWorkstation.selectedCount
            };
        });
        console.log('📊 Giá trị sau khi gán 17 qua slider:', countValues);

        if (countValues.slider !== '17' || countValues.numInput !== '17' || countValues.badge !== '17' || countValues.selectedCount !== 17) {
            throw new Error('Range slider đồng bộ không chuẩn xác: ' + JSON.stringify(countValues));
        }

        // Chụp ảnh bằng chứng 1: Bảng điều khiển cấu hình với thanh kéo 17 từ
        const configScreenshotPath = path.join(ARTIFACT_DIR, 'proof_slider_17_words_config.png');
        await page.screenshot({ path: configScreenshotPath });
        console.log('📸 Đã chụp ảnh cấu hình thanh trượt:', configScreenshotPath);

        // 3. Bấm "Tạo bộ từ & Học ngay" với chủ đề Công nghệ (A1, 17 từ)
        console.log('✨ Chọn Công nghệ A1 và Tạo bộ từ...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.selectLevel('A1');
            window.VocabGameWorkstation.selectQuickTopic('technology');
        });
        await new Promise(r => setTimeout(r, 300));

        await page.click('#vgGenerateBtn');
        await new Promise(r => setTimeout(r, 800));

        // Kiểm tra danh sách từ trong view Preview
        const previewInfo = await page.evaluate(() => {
            const list = window.VocabGameWorkstation.wordList || [];
            return {
                wordCount: list.length,
                words: list.map(w => w.word),
                phonetics: list.map(w => w.phonetic),
                sampleWords: list.slice(0, 5)
            };
        });
        console.log('📋 Danh sách từ Preview trả về:', previewInfo.wordCount, 'từ.');
        console.log('🔍 Mẫu từ:', previewInfo.sampleWords);

        if (previewInfo.wordCount !== 17) {
            throw new Error(`Kỳ vọng đúng 17 từ, thực tế trả về: ${previewInfo.wordCount} từ`);
        }

        // Chụp ảnh bằng chứng 2: Màn hình Preview với đúng 17 từ vựng
        const previewScreenshotPath = path.join(ARTIFACT_DIR, 'proof_preview_17_words_cambridge.png');
        await page.screenshot({ path: previewScreenshotPath });
        console.log('📸 Đã chụp ảnh màn Preview 17 từ:', previewScreenshotPath);

        // 4. Bấm "Bắt đầu màn chơi" để vào Game Arena
        console.log('🎮 Bấm Bắt đầu màn chơi...');
        const startBtn = await page.$('button[onclick*="startArena"]');
        if (startBtn) {
            await startBtn.click();
        } else {
            await page.evaluate(() => window.VocabGameWorkstation.startArena());
        }
        await new Promise(r => setTimeout(r, 800));

        // Kiểm tra Badge đếm trong Game Arena
        const arenaInfo = await page.evaluate(() => {
            const counter = document.getElementById('vgCurrentCounter');
            const totalText = counter ? counter.parentElement.textContent.trim() : '';
            const cardWord = window.VocabGameWorkstation.currentWord ? window.VocabGameWorkstation.currentWord.word : '';
            return {
                counterText: totalText,
                currentWord: cardWord,
                totalInList: window.VocabGameWorkstation.wordList.length
            };
        });
        console.log('🎯 Thông tin Arena:', arenaInfo);

        if (!arenaInfo.counterText.includes('/17')) {
            throw new Error(`Game Arena không hiển thị /17, thực tế: ${arenaInfo.counterText}`);
        }

        // Gõ phím để kích hoạt đạn xanh bay lên
        console.log('⌨️ Nhấn phím để kích hoạt đạn xanh...');
        await page.keyboard.press('KeyA');
        await new Promise(r => setTimeout(r, 150));

        // Chụp ảnh bằng chứng 3: Game Arena với 1/17 và Gundam
        const arenaScreenshotPath = path.join(ARTIFACT_DIR, 'proof_game_arena_17_words_counter.png');
        await page.screenshot({ path: arenaScreenshotPath });
        console.log('📸 Đã chụp ảnh Game Arena 1/17:', arenaScreenshotPath);

        // 5. Thử nghiệm thêm: Kiểm tra nạp 50 từ chuẩn Cambridge
        console.log('🧪 Kiểm tra nạp 50 từ chuẩn Cambridge...');
        const test50 = await page.evaluate(() => {
            const res = window.VocabGameWorkstation.getCuratedWordsForTopicAndLevel('Công nghệ', 'B1', 50);
            return {
                count: res.length,
                allUnique: new Set(res.map(w => w.word.toLowerCase())).size === res.length
            };
        });
        console.log('✅ Thử nghiệm 50 từ:', test50);
        if (test50.count !== 50 || !test50.allUnique) {
            throw new Error('Thử nghiệm 50 từ không đạt chuẩn: ' + JSON.stringify(test50));
        }

        // 6. Thử nghiệm chip chọn nhanh: chọn 15 từ
        console.log('⚡ Thử nghiệm chip chọn nhanh 15 từ...');
        await page.evaluate(() => {
            window.VocabGameWorkstation.selectCount(15);
        });
        const test15 = await page.evaluate(() => {
            return {
                selectedCount: window.VocabGameWorkstation.selectedCount,
                badge: document.getElementById('vgCountBadgeNum') ? document.getElementById('vgCountBadgeNum').textContent.trim() : null
            };
        });
        console.log('✅ Thử nghiệm chip chọn nhanh 15 từ:', test15);
        if (test15.selectedCount !== 15) {
            throw new Error('Chip chọn 15 từ thất bại');
        }

        console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ ĐÃ THÀNH CÔNG RỰC RỠ 100%!');
    } catch (err) {
        console.error('❌ Lỗi kiểm thử:', err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
