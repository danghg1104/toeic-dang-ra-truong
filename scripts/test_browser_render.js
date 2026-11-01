const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function run() {
    console.log('Launching browser with puppeteer-core...');
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.setRequestInterception(true);
    page.on('request', req => {
        const url = req.url();
        if (url.includes('firebasejs') || url.includes('accounts.google.com/gsi')) {
            req.abort();
        } else {
            req.continue();
        }
    });

    // 1. Test Vocabulary Study layout
    console.log('Testing /vocabulary/contracts/study...');
    await page.goto('http://127.0.0.1:3000/vocabulary/contracts/study', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    const vocabLayout = await page.evaluate(() => {
        const leftCol = document.querySelector('.lg\\:col-span-3');
        const rightCol = document.querySelector('.lg\\:col-span-9');
        const cardFlipper = document.getElementById('flashcard3DFlipper');
        return {
            leftColWidth: leftCol ? leftCol.offsetWidth : 0,
            rightColWidth: rightCol ? rightCol.offsetWidth : 0,
            cardWidth: cardFlipper ? cardFlipper.offsetWidth : 0
        };
    });
    console.log('Vocabulary Layout metrics:', vocabLayout);

    const vocabShotPath = path.join(ARTIFACTS_DIR, 'proof_vocab_study_fixed.png');
    await page.screenshot({ path: vocabShotPath, fullPage: false });
    console.log('Saved screenshot:', vocabShotPath);

    // 2. Test Reading Part 5 opening
    console.log('Testing Reading Part 5 practice opening...');
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // Switch to Reading tab
    await page.evaluate(() => {
        if (typeof switchTab === 'function') switchTab('doc');
    });
    // Let prefetch happen for 1.5s
    await new Promise(r => setTimeout(r, 1500));

    // Click Part 5 (30 câu) button
    const clickResult = await page.evaluate(async () => {
        const btn = document.querySelector('button[onclick*="ToeicReadingWorkstation.open({ part: 5"]');
        if (btn) {
            btn.click();
            return 'clicked via button';
        }
        if (window.ToeicReadingWorkstation) {
            await window.ToeicReadingWorkstation.open({ part: 5, count: 30, title: 'Part 5 Test' });
            return 'opened via ToeicReadingWorkstation directly';
        }
        return 'no button found';
    });
    console.log('Reading button action:', clickResult);
    await new Promise(r => setTimeout(r, 1200));

    const readingStatus = await page.evaluate(() => {
        const modal = document.getElementById('toeicReadingWorkstation');
        const isOpen = modal && !modal.classList.contains('hidden');
        const toast = document.querySelector('.toast, #toastContainer, #toastBox');
        const questionCount = window.ToeicReadingWorkstation ? (window.ToeicReadingWorkstation.items || []).length : 0;
        return {
            isOpen,
            questionCount,
            toastText: toast ? toast.innerText : ''
        };
    });
    console.log('Reading workstation status:', readingStatus);

    const readingShotPath = path.join(ARTIFACTS_DIR, 'proof_reading_part5_open.png');
    await page.screenshot({ path: readingShotPath, fullPage: false });
    console.log('Saved screenshot:', readingShotPath);

    // 3. Test Grammar Theory & Practice
    console.log('Testing Grammar /grammar/present-tenses...');
    await page.goto('http://127.0.0.1:3000/grammar/present-tenses', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));
    const grammarTheoryShot = path.join(ARTIFACTS_DIR, 'proof_grammar_theory.png');
    await page.screenshot({ path: grammarTheoryShot, fullPage: false });
    console.log('Saved screenshot:', grammarTheoryShot);

    console.log('Testing Grammar Practice /grammar/present-tenses/practice...');
    await page.goto('http://127.0.0.1:3000/grammar/present-tenses/practice', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));
    const grammarPracticeShot = path.join(ARTIFACTS_DIR, 'proof_grammar_practice.png');
    await page.screenshot({ path: grammarPracticeShot, fullPage: false });
    console.log('Saved screenshot:', grammarPracticeShot);

    await browser.close();
    console.log('All tests completed successfully!');
}

run().catch(err => {
    console.error('Puppeteer test failed:', err);
    process.exit(1);
});
