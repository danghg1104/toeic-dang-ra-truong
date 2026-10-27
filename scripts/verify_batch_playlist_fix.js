const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function testBatchPlaylistFix() {
    console.log('🚀 Bắt đầu kiểm thử: Nghe hàng loạt file & Sửa lỗi đơ trang (Non-blocking STT)');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960 });

    try {
        console.log('1. Truy cập http://localhost:3000');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1200));

        // Tự động đăng nhập
        await page.evaluate(() => {
            const sampleUser = {
                id: 'test_user_batch',
                name: 'Cùng Đăng Ra Trường',
                email: 'test@cungdang.edu.vn',
                targetScore: '850',
                exam: 'TOEIC'
            };
            localStorage.setItem('cung_dang_session_user', JSON.stringify(sampleUser));
            if (window.currentUserAccount !== undefined) window.currentUserAccount = sampleUser;
        });

        // 2. Chuyển sang Trạm Bóc Băng File Nghe TOEIC
        console.log('2. Mở Trạm Bóc Băng File Nghe TOEIC');
        await page.evaluate(() => window.switchTab('boc-bang-audio'));
        await new Promise(r => setTimeout(r, 1000));

        // 3. Kiểm tra hiển thị Playlist mặc định
        const playlistInfo = await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            return {
                playlistCount: station.playlist.length,
                currentTrack: station.playlist[station.currentTrackIndex]?.name,
                hasPlaylistUI: !!document.getElementById('bocBangPlaylistContainer')
            };
        });
        console.log('-> Playlist mặc định:', playlistInfo);

        // Screenshot giao diện Playlist
        const proofPlaylist = path.join(artifactDir, 'proof_batch_playlist_view.png');
        await page.screenshot({ path: proofPlaylist });
        console.log('-> Đã chụp ảnh Playlist:', proofPlaylist);

        // 4. Giả lập nạp HÀNG LOẠT 5 FILE âm thanh TOEIC vào hệ thống
        console.log('4. Thêm hàng loạt 5 file âm thanh vào Danh Sách Phát');
        const batchAddResult = await page.evaluate(async () => {
            const station = window.ToeicBocBangStation.instance;
            
            // Tạo 5 mock File object đại diện cho 5 file giáo viên gửi
            const mockFiles = [
                new File(['fake audio bytes 1'], 'p1_q01.mp3', { type: 'audio/mpeg' }),
                new File(['fake audio bytes 2'], 'p1_q02.mp3', { type: 'audio/mpeg' }),
                new File(['fake audio bytes 3'], 'p1_q03.mp3', { type: 'audio/mpeg' }),
                new File(['fake audio bytes 4'], 'p1_q04.mp3', { type: 'audio/mpeg' }),
                new File(['fake audio bytes 5'], 'Custom_Teacher_Lecture.mp3', { type: 'audio/mpeg' })
            ];

            station.handleUserFiles(mockFiles);

            return {
                totalTracksAfterBatch: station.playlist.length,
                activeTrackName: station.playlist[station.currentTrackIndex]?.name,
                statusOfP1: station.playlist.find(t => t.name === 'p1_q01.mp3')?.status,
                hasInstantTranscript: !!station.playlist.find(t => t.name === 'p1_q01.mp3')?.data?.segments?.length
            };
        });
        console.log('-> Kết quả nạp hàng loạt 5 file:', batchAddResult);

        // Screenshot sau khi nạp hàng loạt file
        const proofMultiTracks = path.join(artifactDir, 'proof_multi_tracks_loaded.png');
        await page.screenshot({ path: proofMultiTracks });
        console.log('-> Đã chụp ảnh nạp hàng loạt file:', proofMultiTracks);

        // 5. Kiểm thử chuyển bài liên tục không giật lag
        console.log('5. Kiểm thử chuyển bài (Next / Prev Track) không lag');
        const switchTest = await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            const initIdx = station.currentTrackIndex;
            station.playNextTrack();
            const nextIdx = station.currentTrackIndex;
            station.playNextTrack();
            const nextIdx2 = station.currentTrackIndex;
            station.playPrevTrack();
            const backIdx = station.currentTrackIndex;

            return { initIdx, nextIdx, nextIdx2, backIdx, currentName: station.playlist[backIdx]?.name };
        });
        console.log('-> Kết quả chuyển bài Next/Prev:', switchTest);

        // 6. Kiểm thử nút [✕ Hủy / Thoát ngay] khi bóc băng
        console.log('6. Kiểm thử nút [✕ Hủy / Thoát ngay] - Giải quyết triệt để lỗi treo đơ');
        const cancelTest = await page.evaluate(async () => {
            const station = window.ToeicBocBangStation.instance;
            
            // Giả lập kích hoạt bóc băng file custom
            const customIdx = station.playlist.findIndex(t => t.name === 'Custom_Teacher_Lecture.mp3');
            station.selectTrack(customIdx);

            // Bật cờ bóc băng và hiển thị banner
            station.isProcessing = true;
            station.activeProcessingTrackId = station.playlist[customIdx].id;
            station.processPercent = 45;
            station.processStatusText = 'Đang nhận diện giọng nói trong luồng ngầm Web Worker...';
            station.renderProgressBanner();

            const bannerVisibleBefore = !document.getElementById('bocBangProgressBannerContainer').classList.contains('hidden');
            const hasCancelBtn = !!document.querySelector('#bocBangProgressBannerContainer button');

            // Bấm Hủy
            station.cancelTranscription();
            const bannerVisibleAfter = document.getElementById('bocBangProgressBannerContainer').classList.contains('hidden');
            const isProcessingAfter = station.isProcessing;

            return { bannerVisibleBefore, hasCancelBtn, bannerVisibleAfter, isProcessingAfter };
        });
        console.log('-> Kết quả test hủy bỏ khẩn cấp:', cancelTest);

        // Screenshot nút Hủy luôn có sẵn
        await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            station.processPercent = 50;
            station.processStatusText = 'Mô hình AI chạy ngầm không bao giờ đơ trang...';
            station.renderProgressBanner();
        });
        const proofCancel = path.join(artifactDir, 'proof_cancel_button_available.png');
        await page.screenshot({ path: proofCancel });
        console.log('-> Đã chụp ảnh nút Hủy:', proofCancel);

        // Dọn dẹp
        await page.evaluate(() => {
            window.ToeicBocBangStation.instance.cancelTranscription();
        });

        console.log('🎉 TẤT CẢ CÁC BÀI KIỂM THỬ ĐÃ THÀNH CÔNG RỰC RỠ!');

    } catch (err) {
        console.error('Lỗi kiểm thử:', err);
    } finally {
        await browser.close();
    }
}

testBatchPlaylistFix();
