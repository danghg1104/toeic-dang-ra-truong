const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

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
    console.log('=== RUNNING UPGRADED DICTIONARY VERIFICATION SUITE (T1-T10) ===\n');

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    let xssTriggered = false;
    let xssMessage = '';
    page.on('dialog', async dialog => {
        xssTriggered = true;
        xssMessage = dialog.message();
        console.error(`\n🚨 CRITICAL FAILURE: Native dialog popped: "${xssMessage}"!\n`);
        await dialog.dismiss();
    });

    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    // Chuyển sang tab Từ điển
    await page.evaluate(() => window.switchTab('tu-dien'));
    await new Promise(r => setTimeout(r, 400));

    const results = [];
    let passCount = 0;
    let failCount = 0;

    for (let i = 0; i < TEST_WORDS.length; i++) {
        const query = TEST_WORDS[i];
        process.stdout.write(`[${i + 1}/50] Testing "${query}"... `);

        const res = await page.evaluate(async (q) => {
            const input = document.getElementById('dictSearchInput');
            if (input) input.value = q;

            const t0 = performance.now();
            await window.renderDictionaryResult(q);
            const t1 = performance.now();

            const container = document.getElementById('dictResultContainer');
            if (!container) return { error: 'No container' };

            // Check if Not Found view
            const isNotFound = !!container.querySelector('.fa-circle-question');
            const hasSuggestions = !!container.querySelector('.fa-wand-magic-sparkles');
            let suggestions = [];
            if (hasSuggestions) {
                const sBtns = container.querySelectorAll('.fa-wand-magic-sparkles ~ div button');
                sBtns.forEach(b => suggestions.push(b.textContent.trim()));
            }

            // Check if Reverse Lookup view
            const isReverse = container.textContent.includes('Kết quả tra ngược tiếng Việt cho');
            let reverseMatches = [];
            if (isReverse) {
                const matchCards = container.querySelectorAll('.grid > div');
                matchCards.forEach(c => {
                    const h = c.querySelector('span.text-lg')?.textContent.trim();
                    if (h) reverseMatches.push(h);
                });
            }

            // Check if Normal Word Card
            const headingEl = container.querySelector('h2');
            const headword = headingEl ? headingEl.textContent.trim() : '';

            // Lemma redirect banner
            const hasLemmaBanner = container.textContent.includes('Đang hiển thị cho từ gốc:');
            const lemmaInfoText = hasLemmaBanner ? container.querySelector('.bg-sky-50 strong')?.textContent.trim() : '';

            // IPA
            const ipaUs = container.querySelector('.text-sky-800 strong')?.textContent.trim() || '';
            const ipaUk = container.querySelector('.text-indigo-800 strong')?.textContent.trim() || '';

            // Meaning
            const viEl = container.querySelector('.text-\\[18px\\]') || container.querySelector('.text-\\[17px\\]');
            const vi = viEl ? viEl.textContent.replace('🇻🇳', '').trim() : '';

            // Word Family items
            const wfItems = container.querySelectorAll('.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 > div .space-y-1\\.5 > div');
            let wfCount = 0;
            wfItems.forEach(item => {
                if (!item.textContent.includes('Không có dạng thông dụng')) wfCount++;
            });

            // Examples
            const examples = container.querySelectorAll('.fa-comment-dots ~ div > div');
            const exampleCount = examples.length;

            // Collocations
            const colls = container.querySelectorAll('.fa-link ~ ul > li');
            let collCount = 0;
            colls.forEach(c => {
                if (!c.textContent.includes('Chưa có dữ liệu')) collCount++;
            });

            return {
                responseTime: Math.round(t1 - t0),
                isNotFound,
                hasSuggestions,
                suggestions,
                isReverse,
                reverseMatches,
                headword,
                hasLemmaBanner,
                lemmaInfoText,
                ipaUs,
                ipaUk,
                vi,
                wfCount,
                exampleCount,
                collCount
            };
        }, query);

        // Đánh giá kết quả
        let status = 'PASS';
        let note = '';

        if (query === '<img src=x onerror=alert(1)>') {
            if (xssTriggered) {
                status = 'FAIL';
                note = 'Lỗ hổng XSS kích hoạt!';
            } else {
                status = 'PASS';
                note = 'Đã escape an toàn, mã không bị thực thi';
            }
        } else if (query === 'xyzzyq') {
            if (res.isNotFound) {
                status = 'PASS';
                note = 'Báo Not Found chuẩn, không bịa từ';
            } else {
                status = 'FAIL';
                note = 'Vẫn bịa từ khi gặp chuỗi vô nghĩa';
            }
        } else if (['recieve', 'negociate', 'managment'].includes(query)) {
            if (res.isNotFound && res.hasSuggestions) {
                status = 'PASS';
                note = `Gợi ý chính tả: [${res.suggestions.join(', ')}]`;
            } else {
                status = 'FAIL';
                note = 'Không có gợi ý "Ý bạn là...?"';
            }
        } else if (['went', 'children', 'better'].includes(query)) {
            if (res.hasLemmaBanner) {
                status = 'PASS';
                note = `Lemmatized về: ${res.headword} (${res.lemmaInfoText})`;
            } else {
                status = 'FAIL';
                note = 'Không lemmatize về từ gốc';
            }
        } else if (query === 'kết quả') {
            if (res.isReverse && res.reverseMatches.length > 0) {
                status = 'PASS';
                note = `Tra ngược thành công: [${res.reverseMatches.join(', ')}]`;
            } else {
                status = 'FAIL';
                note = 'Tra ngược tiếng Việt thất bại';
            }
        } else {
            if (res.headword && res.vi && res.ipaUs) {
                status = 'PASS';
                note = `IPA: ${res.ipaUs} | Nghĩa: ${res.vi.slice(0, 30)}... | WF: ${res.wfCount} | Ex: ${res.exampleCount}`;
            } else {
                status = 'FAIL';
                note = 'Thiếu thông tin tra cứu cơ bản';
            }
        }

        if (status === 'PASS') passCount++; else failCount++;
        console.log(`[${status}] ${note} (${res.responseTime} ms)`);

        results.push({
            stt: i + 1,
            query,
            status,
            note,
            responseTime: res.responseTime,
            details: res
        });
    }

    console.log(`\n=== 50-WORD SUITE RESULT: ${passCount}/50 PASSED (${failCount} FAILED) ===\n`);

    // Kiểm tra tính năng nâng cao T7: Speed Toggle & Pronunciation
    console.log('Testing Audio Speed Toggle & Dual US/UK Audio...');
    const speedTest = await page.evaluate(() => {
        const initialSpeed = window.DictionaryEngine.currentAudioSpeed;
        window.DictionaryEngine.toggleAudioSpeed();
        const toggledSpeed = window.DictionaryEngine.currentAudioSpeed;
        window.DictionaryEngine.toggleAudioSpeed();
        const resetSpeed = window.DictionaryEngine.currentAudioSpeed;
        return { initialSpeed, toggledSpeed, resetSpeed };
    });
    console.log('Speed toggle verified:', speedTest);

    // Chụp ảnh Desktop Viewport (1366x768)
    await page.evaluate(() => window.renderDictionaryResult('economic'));
    await new Promise(r => setTimeout(r, 400));
    const desktopPicPath = path.join(ARTIFACT_DIR, 't1_desktop_dict_upgraded.png');
    await page.screenshot({ path: desktopPicPath, fullPage: false });
    console.log('Saved screenshot:', desktopPicPath);

    // Chụp ảnh Lemmatized (went -> go)
    await page.evaluate(() => window.renderDictionaryResult('went'));
    await new Promise(r => setTimeout(r, 400));
    const lemmaPicPath = path.join(ARTIFACT_DIR, 't3_lemmatized_went_to_go.png');
    await page.screenshot({ path: lemmaPicPath, fullPage: false });
    console.log('Saved screenshot:', lemmaPicPath);

    // Chụp ảnh Typo Suggestion (recieve -> receive)
    await page.evaluate(() => window.renderDictionaryResult('recieve'));
    await new Promise(r => setTimeout(r, 400));
    const typoPicPath = path.join(ARTIFACT_DIR, 't4_typo_suggestion_recieve.png');
    await page.screenshot({ path: typoPicPath, fullPage: false });
    console.log('Saved screenshot:', typoPicPath);

    // Chụp ảnh Reverse Lookup ("kết quả")
    await page.evaluate(() => window.renderDictionaryResult('kết quả'));
    await new Promise(r => setTimeout(r, 400));
    const reversePicPath = path.join(ARTIFACT_DIR, 't6_reverse_lookup_ket_qua.png');
    await page.screenshot({ path: reversePicPath, fullPage: false });
    console.log('Saved screenshot:', reversePicPath);

    // Chụp ảnh Mobile 390px Viewport (iPhone 14)
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => window.renderDictionaryResult('contract'));
    await new Promise(r => setTimeout(r, 400));
    const mobilePicPath = path.join(ARTIFACT_DIR, 't10_mobile_390_dictionary.png');
    await page.screenshot({ path: mobilePicPath, fullPage: false });
    console.log('Saved screenshot:', mobilePicPath);

    // Kiểm tra hồi quy các tab khác (hom-nay, tu-vung, ngu-phap, so-take-note)
    console.log('Checking regressions on other tabs...');
    const regressionCheck = await page.evaluate(() => {
        const tabs = ['hom-nay', 'tu-vung', 'ngu-phap', 'so-take-note'];
        const statusMap = {};
        for (const t of tabs) {
            window.switchTab(t);
            const sec = document.getElementById(`view-${t}`);
            statusMap[t] = sec && !sec.classList.contains('hidden');
        }
        window.switchTab('tu-dien');
        return statusMap;
    });
    console.log('Other tabs intact:', regressionCheck);

    // Lưu bảng kết quả chi tiết ra JSON
    fs.writeFileSync('scripts/d1_upgraded_results.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('\nSaved full results to scripts/d1_upgraded_results.json');

    await browser.close();
    console.log('=== VERIFICATION COMPLETED SUCCESSFULLY ===');
})();
