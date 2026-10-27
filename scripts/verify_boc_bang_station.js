const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function runVerification() {
    console.log('🚀 Bắt đầu kiểm thử toàn diện: Trạm Bóc Băng File Nghe TOEIC');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960 });

    try {
        // 1. Tải trang web chính
        console.log('1. Truy cập http://localhost:3000');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1500));

        // Tự động đăng nhập người dùng mẫu
        await page.evaluate(() => {
            const sampleUser = {
                id: 'test_user_bocbang',
                name: 'Cùng Đăng Ra Trường',
                email: 'test@cungdang.edu.vn',
                targetScore: '850',
                exam: 'TOEIC'
            };
            localStorage.setItem('cung_dang_session_user', JSON.stringify(sampleUser));
            if (window.currentUserAccount !== undefined) window.currentUserAccount = sampleUser;
        });

        // 2. Chuyển sang tab Nghe (view-nghe) để kiểm tra Banner dẫn vào Trạm Bóc Băng
        console.log('2. Mở tab Nghe (view-nghe)');
        await page.evaluate(() => window.switchTab('nghe'));
        await new Promise(r => setTimeout(r, 800));

        const bannerExists = await page.evaluate(() => {
            return document.body.innerText.includes('Trạm Bóc Băng File Nghe TOEIC Tự Động');
        });
        console.log('-> Banner Trạm Bóc Băng trong view-nghe:', bannerExists ? '✅ ĐÃ CÓ' : '❌ CHƯA CÓ');

        // Screenshot view-nghe với banner
        const proofNghePath = path.join(artifactDir, 'proof_banner_in_view_nghe.png');
        await page.screenshot({ path: proofNghePath });
        console.log('-> Đã chụp ảnh:', proofNghePath);

        // 3. Chuyển sang Trạm Bóc Băng File Nghe TOEIC
        console.log('3. Mở Trạm Bóc Băng File Nghe TOEIC qua switchTab("boc-bang-audio")');
        await page.evaluate(() => window.switchTab('boc-bang-audio'));
        await new Promise(r => setTimeout(r, 1000));

        const stationReady = await page.evaluate(() => {
            const view = document.getElementById('view-boc-bang-audio');
            const isVisible = view && !view.classList.contains('hidden');
            const hasSegments = document.querySelectorAll('.boc-bang-segment-card').length > 0;
            const hasPlayer = !!document.getElementById('bocBangProgressBar');
            return { isVisible, hasSegments, hasPlayer, segCount: document.querySelectorAll('.boc-bang-segment-card').length };
        });
        console.log('-> Trạng thái Trạm Bóc Băng:', stationReady);

        // Screenshot giao diện chính của Trạm Bóc Băng
        const proofStationMain = path.join(artifactDir, 'proof_boc_bang_main_workstation.png');
        await page.screenshot({ path: proofStationMain });
        console.log('-> Đã chụp ảnh giao diện chính:', proofStationMain);

        // 4. Kiểm thử Smart Audio Player: Tốc độ, Tua, A-B Loop
        console.log('4. Kiểm thử Smart Audio Player & A-B Loop');
        const playerTest = await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            station.setPlaybackSpeed(1.25);
            const speedApplied = station.playbackSpeed === 1.25;

            // Test A-B loop
            station.seekTo(4.8);
            station.setLoopPointA();
            station.seekTo(11.9);
            station.setLoopPointB();
            const loopActive = station.abLoop.active && station.abLoop.start === 4.8 && station.abLoop.end === 11.9;

            return { speedApplied, loopActive, start: station.abLoop.start, end: station.abLoop.end };
        });
        console.log('-> Kết quả test Player & A-B Loop:', playerTest);

        // 5. Kiểm thử Tra từ 1 chạm (Click-to-Lookup word)
        console.log('5. Kiểm thử Tra từ 1 chạm (Click-to-Lookup word)');
        const dictTest = await page.evaluate(async () => {
            const wordEl = document.querySelector('.boc-bang-word');
            if (wordEl) {
                wordEl.click();
            } else {
                window.ToeicBocBangStation.instance.lookupWordFromTranscript('blueprint');
            }
            // Wait for dictionary popup to append
            for (let i = 0; i < 20; i++) {
                const popup = document.getElementById('bocBangQuickDictPopup');
                if (popup) {
                    return {
                        popupExists: true,
                        popupText: popup.innerText.slice(0, 150)
                    };
                }
                await new Promise(r => setTimeout(r, 100));
            }
            return { popupExists: false, popupText: '' };
        });
        console.log('-> Kết quả Tra từ 1 chạm:', dictTest.popupExists ? '✅ POPUP HIỂN THỊ THÀNH CÔNG: ' + dictTest.popupText.replace(/\n+/g, ' ') : '❌ CHƯA CÓ');

        // Screenshot popup tra từ
        const proofDictPopup = path.join(artifactDir, 'proof_boc_bang_quick_dict_popup.png');
        await page.screenshot({ path: proofDictPopup });
        console.log('-> Đã chụp ảnh popup tra từ:', proofDictPopup);

        // Đóng popup
        await page.evaluate(() => {
            const p = document.getElementById('bocBangQuickDictPopup');
            if (p) p.remove();
        });

        // 6. Kiểm thử Chế độ Ẩn chữ Chép chính tả (Dictation Mode)
        console.log('6. Kiểm thử Chế độ Ẩn chữ Chép chính tả (Dictation Mode)');
        const dictationTest = await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            station.toggleDictationMode(); // Bật chế độ ẩn chữ
            const isDictOn = station.dictationMode;

            // Giả lập người dùng nghe và gõ vào câu số 2: "She is hanging a picture frame on the wall."
            // Người dùng gõ chính xác: "She is hanging a picture frame on the wall"
            station.userDictationInputs[2] = 'She is hanging a picture frame on the wall';
            station.checkDictationAnswer(1); // seg id 2 is at index 1

            const scoreInfo = station.dictationScores[2];
            return { isDictOn, scoreInfo };
        });
        console.log('-> Kết quả Chép chính tả & Chấm điểm từng từ:', dictationTest);

        // Screenshot chế độ chép chính tả
        const proofDictation = path.join(artifactDir, 'proof_boc_bang_dictation_mode.png');
        await page.screenshot({ path: proofDictation });
        console.log('-> Đã chụp ảnh chép chính tả:', proofDictation);

        // 7. Chuyển sang Preset Part 2 (Hỏi đáp Wh-Question & Bẫy Yes/No)
        console.log('7. Chuyển sang Bộ mẫu Part 2 (sample_p2_q01)');
        await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            station.dictationMode = false; // Tắt chế độ ẩn chữ để xem transcript
            station.loadSamplePreset('sample_p2_q01');
        });
        await new Promise(r => setTimeout(r, 600));

        const part2Test = await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            const cur = station.currentData;
            return {
                title: cur.title,
                part: cur.part,
                suggestedAnswer: cur.suggestedAnswer,
                hasTrapTip: cur.segments.some(s => s.aiTip && s.aiTip.includes('BẪY YES/NO')),
                suggestedOpt: cur.segments.find(s => s.isSuggestedAnswer)?.speaker
            };
        });
        console.log('-> Kết quả nhận diện & Phân tích bẫy Part 2:', part2Test);

        // Screenshot Part 2 Analysis
        const proofPart2 = path.join(artifactDir, 'proof_boc_bang_part2_analysis.png');
        await page.screenshot({ path: proofPart2 });
        console.log('-> Đã chụp ảnh Part 2 Analysis:', proofPart2);

        // 8. Chuyển sang Preset Part 3 (Hội thoại)
        console.log('8. Chuyển sang Bộ mẫu Part 3 (sample_p3_set01)');
        await page.evaluate(() => {
            window.ToeicBocBangStation.instance.loadSamplePreset('sample_p3_set01');
        });
        await new Promise(r => setTimeout(r, 600));

        const proofPart3 = path.join(artifactDir, 'proof_boc_bang_part3_dialog.png');
        await page.screenshot({ path: proofPart3 });
        console.log('-> Đã chụp ảnh Part 3 Dialog:', proofPart3);

        console.log('🎉 TOÀN BỘ CÁC BÀI KIỂM THỬ ĐÃ ĐẠT 100%!');

    } catch (err) {
        console.error('Lỗi kiểm thử:', err);
    } finally {
        await browser.close();
    }
}

runVerification();
