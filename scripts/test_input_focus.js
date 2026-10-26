const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1050']
    });

    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 2000));

        await page.evaluate(() => {
            const testUser = {
                uid: 'user_totoro_vip',
                email: 'dang_totoro@cungdang.edu.vn',
                displayName: 'Đăng Totoro VIP',
                name: 'Đặng Totoro',
                role: 'admin'
            };
            window.currentUserAccount = testUser;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
            if (typeof closeAuthModal === 'function') closeAuthModal();
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';

            window.switchTab('tu-vung');
            window.VocabGameWorkstation.switchIntakeMode('file');
            window.VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_1');
        });

        await new Promise(r => setTimeout(r, 1500));

        const info = await page.evaluate(() => {
            const input = document.getElementById('vgFileSearchInput');
            if (!input) return { error: 'input not found' };
            
            // Try typing into it directly via input event
            input.focus();
            const focusedBefore = (document.activeElement === input);
            input.value = 'hello';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            const focusedAfter1 = (document.activeElement === input);
            const val1 = input.value;

            input.value = 'hello world';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            const focusedAfter2 = (document.activeElement === input);
            const val2 = input.value;

            return {
                focusedBefore,
                focusedAfter1,
                val1,
                focusedAfter2,
                val2,
                fileSearchQuery: window.VocabGameWorkstation.fileSearchQuery,
                cardsCount: document.getElementById('vgFileCardsGrid')?.children?.length
            };
        });

        console.log('DOM Evaluation result:', info);
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
