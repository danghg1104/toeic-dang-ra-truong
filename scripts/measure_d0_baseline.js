const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const TEST_WORDS = [
    // 1-10: Từ gốc
    'economic', 'require', 'contract', 'produce', 'compete', 'apply', 'negotiate', 'manage', 'succeed', 'hello',
    // 11-18: Biến thể
    'economy', 'economical', 'requirement', 'contracts', 'required', 'managing', 'competitive', 'application',
    // 19-21: Bất quy tắc
    'went', 'children', 'better',
    // 22-24: Gõ sai
    'recieve', 'negociate', 'managment',
    // 25-27: Cụm từ
    'carry out', 'in charge of', 'look forward to',
    // 28-35: Đầu vào lạ
    'kết quả', '  Contract  ', "don't", 'well-known', 'COVID-19', 'a', 'xyzzyq', '<img src=x onerror=alert(1)>',
    // 36-50: 15 từ TOEIC thông dụng
    'invoice', 'schedule', 'postpone', 'candidate', 'confirm', 'deadline', 'implement', 'policy', 'warranty', 'budget',
    'announce', 'promote', 'inspect', 'feedback', 'eligible'
];

(async () => {
    console.log('=== STARTING D0 BASELINE MEASUREMENT (50 WORDS) ===\n');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    let dialogTriggered = false;
    let dialogMessage = '';
    page.on('dialog', async dialog => {
        dialogTriggered = true;
        dialogMessage = dialog.message();
        console.log(`\n  [VULNERABILITY ALERT] Native dialog popped: "${dialogMessage}" (XSS executed!)\n`);
        await dialog.dismiss();
    });
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    // Switch to Dictionary tab
    await page.evaluate(() => window.switchTab('tu-dien'));
    await new Promise(r => setTimeout(r, 400));

    const results = [];

    for (let i = 0; i < TEST_WORDS.length; i++) {
        const query = TEST_WORDS[i];
        process.stdout.write(`[${i + 1}/50] Testing "${query}"... `);

        const startTime = Date.now();

        // Perform search
        const measurement = await page.evaluate(async (q) => {
            const input = document.getElementById('dictSearchInput');
            if (input) input.value = q;
            
            const t0 = performance.now();
            await window.renderDictionaryResult(q);
            const t1 = performance.now();

            const container = document.getElementById('dictResultContainer');
            if (!container) return { error: 'No container' };

            const notFoundEl = container.querySelector('.fa-circle-question');
            if (notFoundEl) {
                return {
                    found: false,
                    responseTime: Math.round(t1 - t0),
                    ipa: '',
                    vi: '',
                    wordFamilyCount: 0,
                    exampleCount: 0,
                    collocationCount: 0,
                    error: 'Not found'
                };
            }

            const headingEl = container.querySelector('h2');
            const wordRendered = headingEl ? headingEl.textContent.trim() : '';

            // IPA
            const ipaEl = container.querySelector('strong');
            const ipa = ipaEl ? ipaEl.textContent.trim() : '';

            // Meaning
            const viEl = container.querySelector('.text-\\[17px\\]');
            const vi = viEl ? viEl.textContent.replace('🇻🇳', '').trim() : '';

            // Word Family items
            const wfItems = container.querySelectorAll('.grid-cols-1.sm\\:grid-cols-2 > div .space-y-1\\.5 > div');
            let wfCount = 0;
            wfItems.forEach(item => {
                if (!item.textContent.includes('Không có dạng thông dụng')) wfCount++;
            });

            // Collocations
            const collItems = container.querySelectorAll('ul li');
            let collCount = 0;
            collItems.forEach(item => {
                if (!item.textContent.includes('Chưa có dữ liệu') && !item.textContent.includes('Không có thành ngữ')) collCount++;
            });

            // Examples
            const exCards = container.querySelectorAll('.space-y-2 .p-3');
            const exCount = exCards.length;

            return {
                found: true,
                wordRendered,
                responseTime: Math.round(t1 - t0),
                ipa,
                vi,
                hasActualVi: /[àáảãạăắằẵặâấầẫậđèéẻẽẹêếềễệìíỉĩịòóỏõọôốồỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i.test(vi),
                wordFamilyCount: wfCount,
                exampleCount: exCount,
                collocationCount: collCount,
                error: ''
            };
        }, query);

        const elapsed = Date.now() - startTime;
        measurement.totalTimeMs = elapsed;
        measurement.query = query;
        if (dialogTriggered) {
            measurement.xssTriggered = true;
            measurement.dialogMessage = dialogMessage;
            dialogTriggered = false;
        }

        console.log(`found=${measurement.found}, IPA=${measurement.ipa ? 'YES' : 'NO'}, VI=${measurement.hasActualVi ? 'YES' : 'NO'}, WF=${measurement.wordFamilyCount}, EX=${measurement.exampleCount}, Coll=${measurement.collocationCount}, time=${measurement.responseTime}ms`);
        results.push(measurement);
    }

    await browser.close();

    fs.writeFileSync('scripts/d0_baseline_results.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('\n=== D0 BASELINE COMPLETE. Saved to scripts/d0_baseline_results.json ===');
})();
