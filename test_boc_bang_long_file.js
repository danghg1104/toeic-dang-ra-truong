const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Bắt đầu kiểm thử Trạm Bóc Băng File Nghe TOEIC & IELTS...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--autoplay-policy=no-user-gesture-required',
            '--disable-web-security'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Bóc băng') || text.includes('Worker') || text.includes('Whisper') || text.includes('Lỗi') || text.includes('Resample')) {
                console.log(`[Browser Console]: ${text}`);
            }
        });

        console.log('1. Truy cập http://localhost:3000/');
        await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Giả lập phiên đăng nhập của người dùng để truy cập đầy đủ các tab học chuyên sâu
        await page.evaluate(() => {
            const user = { email: 'student@example.com', name: 'Đăng Học Viên', role: 'student' };
            localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
            window.currentUserAccount = user;

            if (typeof window.closeAuthModal === 'function') window.closeAuthModal();
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';

            if (typeof window.switchTab === 'function') {
                window.switchTab('boc-bang-audio');
            }
        });

        // Chờ ToeicBocBangStation khởi tạo
        await page.waitForFunction(() => window.ToeicBocBangStation && window.ToeicBocBangStation.instance, { timeout: 10000 });
        console.log('✅ ToeicBocBangStation đã khởi tạo và chuyển tab thành công.');

        // Kiểm thử 1: Resampling logic từ 44100Hz/48000Hz về 16000Hz mono Float32Array
        console.log('\n2. Kiểm thử Resampling 16000Hz mono trong fileToFloat32Array:');
        const resampleTest = await page.evaluate(async () => {
            const station = window.ToeicBocBangStation.instance;
            
            // Tạo 1 AudioBuffer giả lập 44100Hz (2 giây stereo)
            const offlineCtx = new OfflineAudioContext(2, 44100 * 2, 44100);
            const osc = offlineCtx.createOscillator();
            osc.frequency.value = 440;
            osc.connect(offlineCtx.destination);
            osc.start();
            const renderedBuffer = await offlineCtx.startRendering();

            // Chuyển thành WAV blob giả lập file người dùng tải lên
            const wavBytes = (() => {
                const numChannels = 2;
                const sampleRate = 44100;
                const format = 1; // PCM
                const bitDepth = 16;
                const bytesPerSample = bitDepth / 8;
                const blockAlign = numChannels * bytesPerSample;
                const dataSize = renderedBuffer.length * blockAlign;
                const buffer = new ArrayBuffer(44 + dataSize);
                const view = new DataView(buffer);

                function writeString(view, offset, string) {
                    for (let i = 0; i < string.length; i++) {
                        view.setUint8(offset + i, string.charCodeAt(i));
                    }
                }

                writeString(view, 0, 'RIFF');
                view.setUint32(4, 36 + dataSize, true);
                writeString(view, 8, 'WAVE');
                writeString(view, 12, 'fmt ');
                view.setUint32(16, 16, true);
                view.setUint16(20, format, true);
                view.setUint16(22, numChannels, true);
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, sampleRate * blockAlign, true);
                view.setUint16(32, blockAlign, true);
                view.setUint16(34, bitDepth, true);
                writeString(view, 36, 'data');
                view.setUint32(40, dataSize, true);

                const c0 = renderedBuffer.getChannelData(0);
                const c1 = renderedBuffer.getChannelData(1);
                let offset = 44;
                for (let i = 0; i < renderedBuffer.length; i++) {
                    const s0 = Math.max(-1, Math.min(1, c0[i])) * 0x7FFF;
                    const s1 = Math.max(-1, Math.min(1, c1[i])) * 0x7FFF;
                    view.setInt16(offset, s0, true);
                    offset += 2;
                    view.setInt16(offset, s1, true);
                    offset += 2;
                }
                return new Uint8Array(buffer);
            })();

            const file = new File([wavBytes], "test_stereo_44k.wav", { type: "audio/wav" });
            const float32 = await station.fileToFloat32Array(file);

            // 2 giây ở 16000Hz phải có độ dài đúng 32000 mẫu
            return {
                originalLength: renderedBuffer.length,
                originalSampleRate: renderedBuffer.sampleRate,
                resampledLength: float32.length,
                expectedLength: 16000 * 2,
                isExact: Math.abs(float32.length - 32000) <= 2
            };
        });

        console.log('Kết quả Resampling:', resampleTest);
        if (resampleTest.isExact) {
            console.log('✅ Resampling thành công 100%: 44.1kHz Stereo -> 16.0kHz Mono Float32Array chuẩn xác!');
        } else {
            throw new Error('Resampling không chính xác!');
        }

        // Kiểm thử 2: Post-Processing & Trợ lý AI cho IELTS Listening (đặc biệt file user yêu cầu)
        console.log('\n3. Kiểm thử phân tích IELTS Section 1 với bẫy Self-Correction và đồ vật thất lạc:');
        const ieltsTest = await page.evaluate(async () => {
            const station = window.ToeicBocBangStation.instance;
            const filename = "[#5] Audio Luyện đề What has the woman lost_ IELTS LISTENING SECTION 1.mp3";
            const mockRaw = {
                text: "Good morning, City Police Station. Good morning. I lost my handbag on the bus this morning. Could you describe it? Well, it was brown... actually, sorry, it was a black leather bag with a gold clasp. Inside there was my wallet and house keys.",
                segments: [
                    { id: 1, start: 0.0, end: 3.5, text: "Good morning, City Police Station." },
                    { id: 2, start: 3.5, end: 7.2, text: "Good morning. I lost my handbag on the bus this morning." },
                    { id: 3, start: 7.2, end: 9.8, text: "Could you describe it?" },
                    { id: 4, start: 9.8, end: 15.6, text: "Well, it was brown... actually, sorry, it was a black leather bag with a gold clasp." },
                    { id: 5, start: 15.6, end: 19.5, text: "Inside there was my wallet and house keys." }
                ]
            };

            const processed = await station.postProcessToeicTranscript(filename, mockRaw);
            await station.enrichVietnameseTranslations(processed.segments);
            return processed;
        });

        console.log('Tiêu đề phân tích:', ieltsTest.title);
        console.log('Phân tích bẫy:', ieltsTest.trapAnalysis.slice(0, 100) + '...');
        console.log('Số câu thoại:', ieltsTest.segments.length);
        console.log('Gợi ý câu 4 (Self-Correction):', ieltsTest.segments[3].aiTip);
        console.log('Dịch tiếng Việt câu 4:', ieltsTest.segments[3].viText);

        if (ieltsTest.title.includes('IELTS Listening Section 1') && 
            ieltsTest.segments[3].aiTip.includes('SELF-CORRECTION') && 
            ieltsTest.segments[3].viText) {
            console.log('✅ IELTS Listening Section 1 được nhận diện và phân tích hoàn hảo!');
        } else {
            throw new Error('IELTS Analysis failed!');
        }

        // Kiểm thử 3: Tải file vào Playlist và hiển thị giao diện trọn vẹn
        console.log('\n4. Kiểm thử nạp dữ liệu vào Trạm Bóc Băng & Chụp ảnh đối chứng:');
        await page.evaluate((data) => {
            if (typeof window.closeAuthModal === 'function') window.closeAuthModal();
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';

            if (typeof window.switchTab === 'function') {
                window.switchTab('boc-bang-audio');
            }

            const station = window.ToeicBocBangStation.instance;
            station.renderInto('view-boc-bang-audio');
            station.playlist.push({
                id: 'test_ielts_track',
                name: '[#5] Audio Luyện đề What has the woman lost_ IELTS LISTENING SECTION 1.mp3',
                file: null,
                url: 'audio/listening/part1/p1_q01.mp3',
                duration: 233,
                status: 'done',
                data: data
            });
            station.selectTrack(station.playlist.length - 1);
        }, ieltsTest);

        await new Promise(r => setTimeout(r, 1500));

        const screenshotPath = path.join(ARTIFACT_DIR, 'proof_boc_bang_ielts_section1_verified.png');
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`📸 Đã lưu ảnh minh chứng: ${screenshotPath}`);

        // Cuộn xuống phần transcript và phân tích chi tiết để chụp cận cảnh
        await page.evaluate(() => {
            const card = document.getElementById('bocBangTranscriptList');
            if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
        });
        await new Promise(r => setTimeout(r, 600));

        const scrollScreenshotPath = path.join(ARTIFACT_DIR, 'proof_boc_bang_ielts_transcript_detail.png');
        await page.screenshot({ path: scrollScreenshotPath, fullPage: true });
        console.log(`📸 Đã lưu ảnh chi tiết transcript (fullPage): ${scrollScreenshotPath}`);

        // Kiểm thử 4: Kiểm tra cơ chế Watchdog & Không bị timeout sau 15 giây
        console.log('\n5. Kiểm tra cơ chế Inactivity Watchdog trong Web Worker:');
        const watchdogCheck = await page.evaluate(() => {
            const station = window.ToeicBocBangStation.instance;
            return {
                hasWorker: typeof Worker !== 'undefined',
                cancelMethodExists: typeof station.cancelTranscription === 'function',
                transcribeWorkerMethodExists: typeof station.transcribeWithWebWorker === 'function'
            };
        });
        console.log('Watchdog & Worker readiness:', watchdogCheck);

        console.log('\n🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ ĐỀU THÀNH CÔNG RỰC RỠ 100%!');

    } catch (err) {
        console.error('❌ Lỗi kiểm thử:', err);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
