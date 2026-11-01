const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function runTest() {
    console.log('Launching browser to test full Đấu trường Từ vựng flow...');
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console Error:', msg.text());
            errors.push(msg.text());
        }
    });
    page.on('pageerror', err => {
        console.log('Page Error:', err.message);
        errors.push(err.message);
    });

    // 1. Load app
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    // 2. Switch to Đấu trường Từ vựng (tab: hoc-tu-vung)
    console.log('Navigating to Đấu trường Từ vựng...');
    await page.evaluate(() => {
        if (typeof switchTab === 'function') switchTab('hoc-tu-vung');
    });
    await new Promise(r => setTimeout(r, 800));

    // 3. Select Custom input mode
    console.log('Switching to Custom intake mode...');
    await page.evaluate(() => {
        window.VocabGameWorkstation.switchIntakeMode('custom');
    });
    await new Promise(r => setTimeout(r, 500));

    // 4. Fill in custom words
    console.log('Filling in custom vocab words...');
    await page.evaluate(() => {
        const area = document.getElementById('vgCustomInputArea');
        if (area) {
            area.value = 'negotiate - đàm phán, thương lượng\nsustainable - bền vững\ninnovative - đổi mới sáng tạo';
        }
        window.VocabGameWorkstation.handleCustomVocabSubmit();
    });
    await new Promise(r => setTimeout(r, 600));

    // Check preview view
    const previewStatus = await page.evaluate(() => {
        return {
            activeView: window.VocabGameWorkstation.activeView,
            wordListLen: window.VocabGameWorkstation.wordList.length,
            firstWord: window.VocabGameWorkstation.wordList[0].word
        };
    });
    console.log('Preview Status:', previewStatus);

    // 5. Start Arena
    console.log('Starting Arena...');
    await page.evaluate(() => {
        window.VocabGameWorkstation.startArena();
    });
    await new Promise(r => setTimeout(r, 800));

    // Measure Arena dimensions and elements
    const arenaMetrics = await page.evaluate(() => {
        const arena = document.getElementById('vgArenaContainer');
        const card = document.getElementById('vgFallingCard');
        const mascot = document.getElementById('vgReflexWrapper');
        const canvas = document.getElementById('vgParticleCanvas');
        const letters = document.getElementById('vgLettersDisplay');
        return {
            arenaFound: !!arena,
            arenaHeight: arena ? arena.offsetHeight : 0,
            arenaClientHeight: arena ? arena.clientHeight : 0,
            cardTop: card ? card.style.top : null,
            cardFound: !!card,
            mascotFound: !!mascot,
            lettersHtml: letters ? letters.innerHTML.trim().slice(0, 100) : '',
            currentWord: window.VocabGameWorkstation.currentWord ? window.VocabGameWorkstation.currentWord.word : null
        };
    });
    console.log('Arena Metrics during Playing:', arenaMetrics);

    const shotPath = path.join(ARTIFACTS_DIR, 'proof_vocab_arena_fixed_full.png');
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log('Saved screenshot:', shotPath);

    // 6. Test typing the next letter
    console.log('Simulating typing letter "e" for negotiate...');
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 400));

    const afterType = await page.evaluate(() => {
        return {
            typedLetters: window.VocabGameWorkstation.typedLetters,
            correctCount: window.VocabGameWorkstation.correctCount
        };
    });
    console.log('After typing letter "e":', afterType);

    await browser.close();
    console.log('Vocab Arena test finished! Error count:', errors.length);
}

runTest().catch(console.error);
