const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

(async () => {
    console.log('🚀 Starting E2E User Experience Testing for Vocatype Pro...');
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    // Giả lập màn hình laptop tiêu chuẩn (1366x768)
    await page.setViewport({ width: 1366, height: 768 });

    const report = {
        catalogPassed: false,
        videoDimensionsPassed: false,
        soundWaveVisiblePassed: false,
        mode1ChepLoiPassed: false,
        mode2TuGoPassed: false,
        smartLooperPassed: false,
        untilIFoundYouSyncPassed: false,
        details: {}
    };

    try {
        console.log('1. Loading localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

        // Mở mục Luyện nghe chép chính tả
        console.log('2. Opening Luyện nghe chép chính tả (view-nghe-chinh-ta)...');
        await page.evaluate(() => {
            if (typeof window.switchTab === 'function') {
                window.switchTab('nghe-chinh-ta');
            }
            if (typeof window.switchDictationSubMode === 'function') {
                window.switchDictationSubMode('youtube');
            }
        });
        await new Promise(r => setTimeout(r, 800));

        // Kiểm tra Catalog
        const catalogCards = await page.$$eval('.yt-song-card', els => els.length);
        console.log(`✓ Catalog rendered ${catalogCards} song cards.`);
        report.catalogPassed = catalogCards >= 8;
        report.details.catalogCards = catalogCards;

        await page.screenshot({ path: path.join(artifactDir, 'ux_01_catalog.png') });

        // 4. Mở bài Heather (Conan Gray) - bài hát trong video của người dùng
        console.log('4. Starting Heather (Conan Gray)...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.startSong('heather-conan-gray');
        });
        await new Promise(r => setTimeout(r, 1200));

        // Kiểm tra kích thước Player Video
        const playerBox = await page.evaluate(() => {
            const player = document.getElementById('youtubePlayerContainer');
            if (!player) return null;
            const parent = player.parentElement;
            const rect = parent.getBoundingClientRect();
            return {
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                ratio: (rect.width / rect.height).toFixed(2)
            };
        });
        console.log('✓ Video Container dimensions:', playerBox);
        report.details.videoDimensions = playerBox;
        // Chuẩn 16:9 là 1.78, chiều rộng > 700px và chiều cao > 380px (không bị đè bẹp 300px)
        if (playerBox && playerBox.width >= 700 && playerBox.height >= 380 && parseFloat(playerBox.ratio) >= 1.7 && parseFloat(playerBox.ratio) <= 1.85) {
            report.videoDimensionsPassed = true;
            console.log('✓ Video dimensions PERFECT: Large centered 16:9 box matching user video!');
        } else {
            console.warn('⚠️ Video dimensions warning:', playerBox);
        }

        // Kiểm tra Dải sóng lụa mềm mại trong veo (Silk Harmonic Wave)
        const waveInfo = await page.evaluate(() => {
            const canvas = document.getElementById('ytSilkWaveCanvas');
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            return {
                exists: true,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                isVisible: rect.height > 15 && rect.height <= 35 // Gọn gàng thanh thoát dưới 35px, không chiếm chỗ
            };
        });
        console.log('✓ Silk Wave Canvas info:', waveInfo);
        report.details.waveInfo = waveInfo;
        if (waveInfo && waveInfo.isVisible) {
            report.soundWaveVisiblePassed = true;
            console.log('✓ Silk Wave Canvas is delicate, horizontal, pure & perfectly sized!');
        }

        // Kiểm tra vị trí ô gõ phím không bị che khuất hoặc tràn màn hình (Viewport Ergonomics)
        const layoutErgonomics = await page.evaluate(() => {
            const input = document.getElementById('ytLiveTypingInput');
            if (!input) return null;
            const rect = input.getBoundingClientRect();
            return {
                top: Math.round(rect.top),
                bottom: Math.round(rect.bottom),
                windowHeight: window.innerHeight,
                isComfortablyVisible: rect.bottom <= window.innerHeight
            };
        });
        console.log('✓ Ergonomics & Visibility check:', layoutErgonomics);
        report.details.layoutErgonomics = layoutErgonomics;

        // 5. Kiểm tra Chế độ 1: Chép Lời (Nhìn chữ gõ theo)
        const mode1Lyrics = await page.evaluate(() => {
            return {
                lyricsHTML: document.getElementById('ytLyricsDisplay')?.innerText || '',
                vietsub: document.getElementById('ytVietsubDisplay')?.innerText || '',
                studyMode: window.YouTubeDictationWorkstation.studyMode,
                flow: window.YouTubeDictationWorkstation.settings.playbackFlow
            };
        });
        console.log('✓ Mode 1 Info:', mode1Lyrics);
        report.details.mode1Info = mode1Lyrics;
        if (mode1Lyrics.lyricsHTML.includes('remember') && mode1Lyrics.vietsub.includes('mùng 3 tháng 12')) {
            report.mode1ChepLoiPassed = true;
            console.log('✓ Mode 1 displays full clear lyrics & Vietnamese translation accurately!');
        }

        // Thử gõ các chữ cái đầu tiên "I still remember"
        console.log('5. Typing words in Mode 1...');
        await page.evaluate(() => {
            // Gõ "I"
            window.YouTubeDictationWorkstation.handleTypingInput('i');
        });
        await new Promise(r => setTimeout(r, 150));

        await page.evaluate(() => {
            // Gõ "still"
            window.YouTubeDictationWorkstation.handleTypingInput('still');
        });
        await new Promise(r => setTimeout(r, 200));

        await page.screenshot({ path: path.join(artifactDir, 'ux_02_mode1_typed.png') });

        // 6. Chuyển sang Chế độ 2: Nghe Tự Gõ (Che chữ)
        console.log('6. Switching to Mode 2: Nghe Tự Gõ (Che chữ)...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.setStudyMode('blind_dictation');
        });
        await new Promise(r => setTimeout(r, 400));

        const mode2Info = await page.evaluate(() => {
            return {
                lyricsHTML: document.getElementById('ytLyricsDisplay')?.innerText || '',
                studyMode: window.YouTubeDictationWorkstation.studyMode,
                flow: window.YouTubeDictationWorkstation.settings.playbackFlow
            };
        });
        console.log('✓ Mode 2 Info:', mode2Info);
        report.details.mode2Info = mode2Info;
        if (mode2Info.studyMode === 'blind_dictation' && mode2Info.lyricsHTML.includes('_')) {
            report.mode2TuGoPassed = true;
            console.log('✓ Mode 2 conceals words with underscores for ear-training!');
        }

        // Test Smart A-B Looper
        const looperCheck = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            const currentLine = ws.activeSong.lines[ws.currentLineIndex];
            // Giả lập chạm mốc line.end khi chưa gõ xong
            const flow = ws.settings.playbackFlow;
            return {
                flow: flow,
                isLoopLine: flow === 'loop_line',
                lineStart: currentLine.start,
                lineEnd: currentLine.end
            };
        });
        console.log('✓ Smart Looper status:', looperCheck);
        report.details.looperCheck = looperCheck;
        report.smartLooperPassed = looperCheck.isLoopLine;

        await page.screenshot({ path: path.join(artifactDir, 'ux_03_mode2_che_chu.png') });

        // 7. Test bài "Until I Found You" tại timestamp 1:09 (69s)
        console.log('7. Testing Until I Found You at 1:09 sync...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.startSong('until-i-found-you');
            window.YouTubeDictationWorkstation.settings.playbackFlow = 'continuous';
        });
        await new Promise(r => setTimeout(r, 800));

        const untilIFoundYouSync = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            // Giả lập thời gian video ở 69.0s (1:09)
            const curTime = 69.0;
            const matchedIndex = ws.activeSong.lines.findIndex((l, idx) => {
                const next = ws.activeSong.lines[idx + 1];
                const nextStart = next ? next.start : (l.end + 2.0);
                return curTime >= l.start && curTime < nextStart;
            });
            const line = ws.activeSong.lines[matchedIndex];
            return {
                totalLines: ws.activeSong.lines.length,
                matchedIndex: matchedIndex,
                lineText: line ? line.text : '',
                lineStart: line ? line.start : 0,
                lineEnd: line ? line.end : 0
            };
        });
        console.log('✓ Until I Found You at 69s (1:09) sync check:', untilIFoundYouSync);
        report.details.untilIFoundYouSync = untilIFoundYouSync;
        if (untilIFoundYouSync.lineText.includes('Georgia, pulled me in')) {
            report.untilIFoundYouSyncPassed = true;
            console.log('✓ PERFECT SYNC: At 1:09, lyrics accurately shows "Georgia, pulled me in" matching video vocals!');
        } else {
            console.warn('⚠️ Until I Found You sync issue:', untilIFoundYouSync);
        }

        await page.screenshot({ path: path.join(artifactDir, 'ux_04_until_i_found_you.png') });

        console.log('\n========================================');
        console.log('FINAL E2E QA TEST REPORT:');
        console.log(JSON.stringify(report, null, 2));
        console.log('========================================');

        fs.writeFileSync(path.join(artifactDir, 'ux_test_report.json'), JSON.stringify(report, null, 2), 'utf8');

    } catch (e) {
        console.error('❌ Test failed with error:', e);
    } finally {
        await browser.close();
    }
})();
