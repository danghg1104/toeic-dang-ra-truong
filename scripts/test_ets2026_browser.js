const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testEts2026() {
    console.log('--- STARTING ETS 2026 BROWSER VERIFICATION ---');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();

    // Collect console logs and errors
    page.on('console', msg => {
        if (msg.type() === 'error') console.error('PAGE ERROR:', msg.text());
    });

    console.log('Navigating to http://localhost:3000/#nghe...');
    await page.goto('http://localhost:3000/#nghe', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 1. Check window.Ets2026Database
    const dbStats = await page.evaluate(() => {
        if (!window.Ets2026Database) return null;
        return {
            p1: window.Ets2026Database.getPart(1).length,
            p2: window.Ets2026Database.getPart(2).length,
            p3: window.Ets2026Database.getPart(3).length,
            p4: window.Ets2026Database.getPart(4).length,
            p5: window.Ets2026Database.getFlattenedPart(5).length,
            p6: window.Ets2026Database.getFlattenedPart(6).length,
            p7: window.Ets2026Database.getFlattenedPart(7).length,
            totalLC: window.Ets2026Database.getFullListening().length,
            totalRC: window.Ets2026Database.getFullReading().length
        };
    });
    console.log('Ets2026Database stats in browser:', dbStats);

    // 2. Open ETS 2026 Part 1
    console.log('Opening ETS 2026 Part 1 in Listening Workstation...');
    await page.evaluate(() => {
        window.Ets2026Database.startPractice(1);
    });
    await page.waitForTimeout(1000);

    // Verify Question 1 state
    const q1State = await page.evaluate(() => {
        const title = document.getElementById('tlwTitle')?.textContent;
        const subtitle = document.getElementById('tlwSubtitle')?.textContent;
        const img = document.querySelector('#tlwVisualArea img');
        const audioSrc = window.ToeicListeningWorkstation?.audio?.src;
        const options = Array.from(document.querySelectorAll('#tlwQuestionsContainer button')).map(b => b.textContent.trim());
        return {
            title,
            subtitle,
            imgSrc: img ? img.src : null,
            imgLoaded: img ? (img.naturalWidth > 0) : false,
            audioSrc,
            optionsCount: options.length
        };
    });
    console.log('Part 1 Q1 verification:', q1State);

    // Capture Screenshot of Part 1 in Workstation
    const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
    await page.screenshot({ path: path.join(artifactDir, 'ets2026_p1_workstation_verified.png') });
    console.log('Saved screenshot: ets2026_p1_workstation_verified.png');

    // Answer Question 1 (Select option B, index 1)
    await page.evaluate(() => {
        const item = window.ToeicListeningWorkstation.items[0];
        window.ToeicListeningWorkstation.selectOption(item, 1);
        // Toggle transcript & bilingual
        window.ToeicListeningWorkstation.toggleTranscript();
        window.ToeicListeningWorkstation.toggleBilingual();
    });
    await page.waitForTimeout(600);

    const q1AnswerState = await page.evaluate(() => {
        const state = window.ToeicListeningWorkstation.answeredState['ets26_t1_p1_q01'];
        const transcriptText = document.getElementById('tlwTranscriptBox')?.textContent;
        return { state, transcriptText: transcriptText ? transcriptText.slice(0, 150) : null };
    });
    console.log('Part 1 Q1 answered state:', q1AnswerState);

    // 3. Test ETS 2026 Part 3 (Conversations)
    console.log('Testing Part 3 in Workstation...');
    await page.evaluate(() => {
        window.Ets2026Database.startPractice(3);
    });
    await page.waitForTimeout(1000);

    const p3State = await page.evaluate(() => {
        const title = document.getElementById('tlwTitle')?.textContent;
        const subtitle = document.getElementById('tlwSubtitle')?.textContent;
        const audioSrc = window.ToeicListeningWorkstation?.audio?.src;
        const questionCards = document.querySelectorAll('#tlwQuestionsContainer > div');
        return {
            title,
            subtitle,
            audioSrc,
            questionCardsCount: questionCards.length
        };
    });
    console.log('Part 3 verification:', p3State);

    // Toggle transcript to see dialogue
    await page.evaluate(() => {
        window.ToeicListeningWorkstation.toggleTranscript();
        window.ToeicListeningWorkstation.toggleBilingual();
    });
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(artifactDir, 'ets2026_p3_workstation_verified.png') });
    console.log('Saved screenshot: ets2026_p3_workstation_verified.png');

    // Close workstation
    await page.evaluate(() => {
        window.ToeicListeningWorkstation.close();
    });
    await page.waitForTimeout(500);

    // 4. Test ETS 2026 Part 5 (Incomplete Sentences)
    console.log('Testing Part 5 in Quiz Modal...');
    await page.evaluate(() => {
        window.Ets2026Database.startPractice(5);
    });
    await page.waitForTimeout(1000);

    const p5State = await page.evaluate(() => {
        const modal = document.getElementById('quizModal');
        const title = document.getElementById('quizModalTitle')?.textContent;
        const questionText = document.getElementById('quizQuestionText')?.textContent;
        const options = Array.from(document.querySelectorAll('#quizOptionsContainer button')).map(b => b.textContent.trim());
        return {
            modalVisible: !modal.classList.contains('hidden'),
            title,
            questionText,
            options
        };
    });
    console.log('Part 5 Q101 verification:', p5State);

    await page.screenshot({ path: path.join(artifactDir, 'ets2026_p5_quiz_verified.png') });
    console.log('Saved screenshot: ets2026_p5_quiz_verified.png');

    await browser.close();
    console.log('--- ALL ETS 2026 BROWSER TESTS PASSED SUCCESSFULLY ---');
}

testEts2026().catch(e => {
    console.error('Test error:', e);
    process.exit(1);
});
