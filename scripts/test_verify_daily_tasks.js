const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('--- TEST TIẾN ĐỘ THỜI GIAN THỰC CỦA BẢNG NHIỆM VỤ ---');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1280,900']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1000));

        // 1. Kiểm tra ban đầu (0/5)
        const sub0 = await page.$eval('#memberTasksSubtitle', el => el.textContent.trim());
        const xp0 = await page.$eval('#memberTasksTotalXp', el => el.textContent.trim());
        console.log('1. Ban đầu mới vào:', sub0, '--- XP:', xp0);

        // 2. Học 5 câu ngữ pháp
        await page.evaluate(() => DailyTaskManager.recordProgress('grammar', 5));
        const gText1 = await page.$$eval('#dailyTasksContainer > div', divs => divs[0].innerText.replace(/\n+/g, ' | '));
        console.log('2. Sau khi học 5 câu ngữ pháp:', gText1);

        // 3. Hoàn thành đủ 20/20 câu ngữ pháp
        await page.evaluate(() => DailyTaskManager.recordProgress('grammar', 15));
        const sub2 = await page.$eval('#memberTasksSubtitle', el => el.textContent.trim());
        const xp2 = await page.$eval('#memberTasksTotalXp', el => el.textContent.trim());
        const gText2 = await page.$$eval('#dailyTasksContainer > div', divs => divs[0].innerText.replace(/\n+/g, ' | '));
        console.log('3. Sau khi hoàn thành 20/20 câu:', sub2, '--- XP:', xp2, '---', gText2);

        // Chụp ảnh bằng chứng hoàn thành nhiệm vụ
        const shotPath = path.join(ARTIFACT_DIR, 'verified_task_completed_ui.png');
        await page.screenshot({ path: shotPath });
        console.log('4. Đã lưu ảnh chụp hoàn thành 1 nhiệm vụ:', shotPath);

    } finally {
        await browser.close();
    }
})();
