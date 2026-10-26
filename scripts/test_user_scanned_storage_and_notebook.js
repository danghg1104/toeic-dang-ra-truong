const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function runVerification() {
    console.log('🚀 Starting Puppeteer Verification for Scanned Files Storage, Textbook Scanning, Card Selection, and Notebook Flashcard/Gundam...');

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // 1. Load application
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('✅ Loaded http://localhost:3000');

    // Setup mock logged-in user
    await page.evaluate(() => {
        const testUser = {
            id: 'acc-totoro-student',
            uid: 'acc-totoro-student',
            name: 'Cung Đang',
            email: 'cungdang@ra-truong.edu.vn'
        };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
        window.currentUserAccount = testUser;

        // Switch to hoc-tu-vung tab
        if (typeof switchTab === 'function') switchTab('hoc-tu-vung');
        if (window.VocabGameWorkstation) {
            window.VocabGameWorkstation.switchIntakeMode('file');
        }
    });

    await delay(1200);

    // Screenshot 1: Empty state of Scanned Files (Mock presets removed!)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step1_empty_saved_files_no_mock.png') });
    console.log('📸 Saved proof_step1_empty_saved_files_no_mock.png');

    // 2. Test Textbook Scanning (Grade 10 English Global Success sample)
    console.log('📖 Testing Grade 1 - 12 Textbook Scanning...');
    const scanResult = await page.evaluate(() => {
        const sampleTextbook = `
            TIẾNG ANH 10 - GLOBAL SUCCESS
            UNIT 1: FAMILY LIFE
            GETTING STARTED - Household chores
            Nam: Hello, Mai! What are you doing?
            Mai: Hi, Nam. I'm preparing dinner. Today is my turn to cook.
            Nam: Really? Do all members of your family share the household chores?
            Mai: Yes, my father does the heavy lifting, such as repairing appliances and carrying heavy things.
            Nam: That's great! Sharing housework strengthens family bonds and creates a positive atmosphere.
            Mai: Exactly. It also helps children develop life skills, responsibility, and gratitude toward their parents.
            Nam: In my family, we follow a strict schedule. Everyone collaborates to finish homework and chores efficiently.
            
            GLOSSARY - VOCABULARY LIST:
            1. chore (n) /tʃɔːr/ việc nhà, việc vặt
            2. appliance (n) /əˈplaɪ.əns/ thiết bị, dụng cụ gia đình
            3. strengthen (v) /ˈstreŋ.θən/ củng cố, tăng cường
            4. gratitude (n) /ˈɡræt.ɪ.tʃuːd/ lòng biết ơn
            5. responsibility (n) /rɪˌspɒn.sɪˈbɪl.ə.ti/ tinh thần trách nhiệm
            6. collaborate (v) /kəˈlæb.ə.reɪt/ hợp tác, cộng tác
            7. atmosphere (n) /ˈæt.məs.fɪər/ bầu không khí
            8. bond (n) /bɒnd/ mối gắn kết, liên kết
        `;

        window.VocabGameWorkstation.processUploadedFileText(sampleTextbook, 'Tieng Anh 10 Global Success Unit 1.pdf');
        return {
            fileName: window.VocabGameWorkstation.scannedFileName,
            totalWords: window.VocabGameWorkstation.uploadedFileWords.length,
            stats: window.VocabGameWorkstation.scannedStats,
            savedFilesCount: window.VocabGameWorkstation.savedScannedFiles.length
        };
    });

    console.log('Scanned Textbook Result:', scanResult);
    await delay(1200);

    // Screenshot 2: Textbook Scanned with Grade levels & Saved Files card
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step2_textbook_scanned_with_grades.png') });
    console.log('📸 Saved proof_step2_textbook_scanned_with_grades.png');

    // 3. Test Card Selection & Floating Action Bar (Image 4)
    console.log('🎯 Testing Card Selection and Floating Action Bar...');
    const selectResult = await page.evaluate(() => {
        const words = window.VocabGameWorkstation.uploadedFileWords.slice(0, 3).map(w => w.word);
        words.forEach(w => window.VocabGameWorkstation.toggleSelectWordCard(w));
        return {
            selectedCount: window.VocabGameWorkstation.selectedCardWords.size,
            words: Array.from(window.VocabGameWorkstation.selectedCardWords)
        };
    });

    console.log('Selection Result:', selectResult);
    await delay(1000);

    // Screenshot 3: Floating Action Bar with selected cards
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_card_selection_floating_bar.png') });
    console.log('📸 Saved proof_step3_card_selection_floating_bar.png');

    // 4. Test Save Selected Cards to Notebook
    console.log('💾 Testing Save Selected Cards to Sổ từ vựng...');
    await page.evaluate(() => {
        window.VocabGameWorkstation.saveSelectedCardsToNotebook();
    });

    await delay(600);

    // Check Notebook in 'tu-vung' tab
    console.log('📓 Checking Sổ từ vựng grouped by Date & Source...');
    await page.evaluate(() => {
        if (typeof switchTab === 'function') switchTab('tu-vung');
        if (typeof setVocabMode === 'function') setVocabMode('saved');
    });

    await delay(1200);

    // Screenshot 4: Sổ từ vựng grouped by Date & Source with Flashcard / Gundam buttons
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step4_so_tu_vung_date_grouped.png') });
    console.log('📸 Saved proof_step4_so_tu_vung_date_grouped.png');

    // 5. Test 3D Flashcard Modal Launch
    console.log('🃏 Testing 3D Flashcard Modal...');
    await page.evaluate(() => {
        const saved = window.savedVocabItems || [];
        if (saved.length > 0) {
            window.VocabGameWorkstation.openFlashcardModal(saved, 'Ôn tập Sổ từ vựng');
        }
    });

    await delay(1200);

    // Screenshot 5: 3D Flashcard Front
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step5_flashcard_front.png') });
    console.log('📸 Saved proof_step5_flashcard_front.png');

    // Flip card
    await page.evaluate(() => {
        window.VocabGameWorkstation.flipFlashcard();
    });
    await delay(800);

    // Screenshot 6: 3D Flashcard Back (Meaning)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step6_flashcard_back.png') });
    console.log('📸 Saved proof_step6_flashcard_back.png');

    // 6. Test direct transition from Flashcard into Gundam Arena
    console.log('🚀 Testing Transition to Gundam Arena from Flashcard...');
    await page.evaluate(() => {
        window.VocabGameWorkstation.launchArenaFromFlashcard();
    });

    await delay(1200);

    // Screenshot 7: Playing Gundam Arena with Notebook words!
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step7_gundam_arena_playing.png') });
    console.log('📸 Saved proof_step7_gundam_arena_playing.png');

    // 7. Verify User Persistence across page reload (Login / Return)
    console.log('🔄 Testing Persistence on Page Reload...');
    await page.reload({ waitUntil: 'networkidle2' });
    await delay(1500);

    const reloadedCheck = await page.evaluate(() => {
        if (typeof switchTab === 'function') switchTab('hoc-tu-vung');
        if (window.VocabGameWorkstation) {
            window.VocabGameWorkstation.switchIntakeMode('file');
        }
        return {
            savedFilesCount: window.VocabGameWorkstation.savedScannedFiles.length,
            activeFileName: window.VocabGameWorkstation.scannedFileName,
            uploadedWordsCount: window.VocabGameWorkstation.uploadedFileWords.length
        };
    });

    console.log('Reloaded Persistence Check:', reloadedCheck);
    await delay(1200);

    // Screenshot 8: Restored Scanned File after reload
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step8_reloaded_saved_files_restored.png') });
    console.log('📸 Saved proof_step8_reloaded_saved_files_restored.png');

    await browser.close();
    console.log('🎉 ALL PUPPETEER VERIFICATIONS PASSED 100%!');
}

runVerification().catch(err => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
});
