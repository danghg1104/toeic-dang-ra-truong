const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('cung_dang_session_user', JSON.stringify({ id: 'test' }));
    });
    page.on('console', m => console.log('LOG:', m.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.evaluate(() => switchTab('tu-dien'));
    console.log('Now triggering renderDictionaryResult("happy new year")...');
    const res = await page.evaluate(async () => {
        try {
            await renderDictionaryResult('happy new year');
            const container = document.getElementById('dictResultContainer');
            return {
                htmlLength: container ? container.innerHTML.length : 0,
                hasSpinner: container ? container.innerHTML.includes('fa-spinner') : false,
                text: container ? container.innerText.substring(0, 300).replace(/\n+/g, ' ') : ''
            };
        } catch(e) {
            return { error: e.message, stack: e.stack };
        }
    });
    console.log('Result:', JSON.stringify(res, null, 2));
    await browser.close();
})();
