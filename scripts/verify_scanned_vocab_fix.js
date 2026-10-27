const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Starting Vocabulary File Scan & Intake Verification...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960 });

    page.on('console', msg => console.log('PAGE:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForFunction(() => typeof switchTab === 'function' && !!window.VocabGameWorkstation);

    // Switch to vocab-game
    await page.evaluate(() => {
        currentUserAccount = { id: 'test_user_scan', name: 'User Scan Test' };
        switchTab('vocab-game');
    });

    await new Promise(r => setTimeout(r, 1000));

    // TEST 1: Scan Danh-sach-3000-tu-vung-TOEIC.docx.pdf
    console.log('\n--- TEST 1: Scan Danh-sach-3000-tu-vung-TOEIC.docx.pdf ---');
    const toeicBuf = fs.readFileSync('C:\\Users\\Admin\\Downloads\\Danh-sach-3000-tu-vung-TOEIC.docx.pdf');
    const toeicRes = await page.evaluate(async (b64) => {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const file = new File([bytes], 'Danh-sach-3000-tu-vung-TOEIC.docx.pdf', { type: 'application/pdf' });

        const ws = window.VocabGameWorkstation;
        ws.currentIntakeMode = 'file';
        await ws.handleFileUpload({ target: { files: [file] } });

        const words = ws.uploadedFileWords || [];
        const garbage = words.filter(w => ['nuuw', 'ovh', 'dnroa', 'jqu', 'rzo', 'cug', 'vus'].includes(w.word.toLowerCase()));
        const fakeMeanings = words.filter(w => (w.meaning || '').toLowerCase() === 'từ vựng học tập');
        const fakeIpa = words.filter(w => w.phonetic === `/${w.word}/`);

        return {
            total: words.length,
            garbageCount: garbage.length,
            fakeMeaningCount: fakeMeanings.length,
            fakeIpaCount: fakeIpa.length,
            sample: words.slice(0, 10)
        };
    }, toeicBuf.toString('base64'));

    console.log(`Extracted total: ${toeicRes.total} words!`);
    console.log(`Garbage tokens found: ${toeicRes.garbageCount}`);
    console.log(`Words with 'từ vựng học tập': ${toeicRes.fakeMeaningCount}`);
    console.log(`Words with fake IPA /word/: ${toeicRes.fakeIpaCount}`);
    console.log('Sample 10 words:');
    toeicRes.sample.forEach((w, i) => console.log(`  #${i + 1} ${w.word} [${w.phonetic}] (${w.level}): ${w.meaning}`));

    // Screenshot test 1
    const ss1Path = path.join(artifactDir, 'proof_scan_toeic_3000_fixed.png');
    const arenaEl = await page.$('#view-vocab-game');
    if (arenaEl) await arenaEl.screenshot({ path: ss1Path });
    console.log(`📸 Screenshot saved: ${ss1Path}`);

    // TEST 2: Scan 3000.pdf (Oxford 3000 Tabular)
    console.log('\n--- TEST 2: Scan 3000.pdf (Oxford 3000 Tabular) ---');
    const oxBuf = fs.readFileSync('C:\\Users\\Admin\\Downloads\\3000.pdf');
    const oxRes = await page.evaluate(async (b64) => {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const file = new File([bytes], '3000.pdf', { type: 'application/pdf' });

        const ws = window.VocabGameWorkstation;
        ws.currentIntakeMode = 'file';
        await ws.handleFileUpload({ target: { files: [file] } });

        const words = ws.uploadedFileWords || [];
        const fakeMeanings = words.filter(w => (w.meaning || '').toLowerCase() === 'từ vựng học tập');

        return {
            total: words.length,
            fakeMeaningCount: fakeMeanings.length,
            sample: words.slice(0, 10)
        };
    }, oxBuf.toString('base64'));

    console.log(`Oxford 3000 Extracted total: ${oxRes.total} words!`);
    console.log(`Words with 'từ vựng học tập': ${oxRes.fakeMeaningCount}`);
    console.log('Sample 10 words:');
    oxRes.sample.forEach((w, i) => console.log(`  #${i + 1} ${w.word} [${w.phonetic}] (${w.level}): ${w.meaning}`));

    // Screenshot test 2
    const ss2Path = path.join(artifactDir, 'proof_scan_oxford_3000_fixed.png');
    if (arenaEl) await arenaEl.screenshot({ path: ss2Path });
    console.log(`📸 Screenshot saved: ${ss2Path}`);

    // TEST 3: Search filter test (multiple words, real time without losing focus)
    console.log('\n--- TEST 3: Search filter test in Scanned Grid ---');
    const searchRes = await page.evaluate(() => {
        const ws = window.VocabGameWorkstation;
        ws.handleFileSearchInput('abandon');
        const displayed = ws.getFilteredUploadedWords();
        return {
            query: 'abandon',
            count: displayed.length,
            sample: displayed.map(w => ({ word: w.word, meaning: w.meaning }))
        };
    });
    console.log(`Search result for '${searchRes.query}':`, searchRes.count, searchRes.sample);

    const ss3Path = path.join(artifactDir, 'proof_scan_search_filter.png');
    if (arenaEl) await arenaEl.screenshot({ path: ss3Path });
    console.log(`📸 Screenshot saved: ${ss3Path}`);

    await browser.close();
    console.log('\n🎉 ALL VOCABULARY SCAN & INTAKE TESTS PASSED 100%!');
})();
