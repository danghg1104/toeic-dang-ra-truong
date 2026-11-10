const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function findEdgeOrChrome() {
    const paths = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];
    return paths.find((p) => fs.existsSync(p)) || null;
}

(async () => {
    console.log('====================================================');
    console.log('VERIFYING FIGMA BENTO UI & EDTECH DASHBOARD FIXES');
    console.log('====================================================\n');

    // 1. Static assertions
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    const appCore = fs.readFileSync(path.join(__dirname, '../js/app-core.bundle.js'), 'utf8');

    assert(html.includes('/css/app.bundle.css?v=20261110_v1'), 'Single consolidated CSS bundle must be loaded');
    assert(!html.includes('href="/css/celestial-artisan-theme.css?v=20261106_v3"'), 'Stray CSS before </head> must be gone');
    assert(html.includes('sizes="180x180"'), 'Apple touch icon must be 180x180');
    assert(!html.includes('0 từ · -- đúng') && !/skillAccuracy(?:Listen|Read|Grammar|Vocab)Pct[^>]*>--%/.test(html), 'Must not contain awkward -- đúng or --% placeholders in 4-skill balance');
    assert(html.includes('Độ nhớ: Chưa kiểm tra'), 'Empty vocab memory state must be clean');
    assert(html.includes('Khởi động nhanh 2 phút'), 'AI Analyzer default must offer 2-minute micro-learning instead of repeating diagnostic');
    assert(appCore.includes("setTxt('memberAccuracyVal', 'Độ nhớ: Chưa kiểm tra')"), 'JS empty state must set Độ nhớ: Chưa kiểm tra');
    assert(appCore.includes("setTxt('memberStudyTime', 'Chưa học')"), 'JS empty state must set Chưa học');
    assert(appCore.includes('getDynamicQuestionBankTotals'), 'Dynamic question bank total computation required');
    console.log('  ✓ PASS: Static DOM, CSS bundle, dynamic bank totals & empty-state copy invariants verified.');

    // 2. Runtime Browser DOM & Layout Geometry Verification
    const exePath = findEdgeOrChrome();
    assert(exePath, 'Edge/Chrome executable required for runtime layout check');

    const port = 3099;
    const serverProc = spawn(process.execPath, [path.join(__dirname, '../server.js')], {
        env: { ...process.env, PORT: String(port), HTTPS_PORT: '3499' },
        stdio: 'ignore'
    });

    const browser = await puppeteer.launch({
        executablePath: exePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
        let ready = false;
        for (let i = 0; i < 30; i++) {
            try {
                const res = await fetch(`http://localhost:${port}/`);
                if (res.ok) { ready = true; break; }
            } catch (e) {}
            await delay(250);
        }
        assert(ready, 'Local test server failed to start');

        const page = await browser.newPage();
        const pageErrors = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));

        await page.setViewport({ width: 1280, height: 850 });
        await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle2' });
        await delay(1000);

        const desktopAudit = await page.evaluate(() => {
            const header = document.getElementById('sanhTopHeaderBar');
            const greeting = document.getElementById('sanhGreetingArea');
            const hero = document.getElementById('heroActionCardContainer');
            const tools = document.getElementById('quickStudyToolsContainer');
            const lofi = document.getElementById('headerMiniMusicBoxBtn');
            const bubble = document.getElementById('heroSoiMayBubble');
            const heroImg = document.getElementById('heroSoiMayImg');
            const aiTutorImg = document.querySelector('img[alt="Gia sư Sói Mây AI"]');
            const sidebarImg = document.querySelector('#sidebarOwlContainer img');
            const accVal = document.getElementById('memberAccuracyVal');
            const studyTime = document.getElementById('memberStudyTime');
            const subText = document.getElementById('sanhHeaderSubText');
            const optA = document.getElementById('heroPrimaryCtaBtn');
            const optB = document.getElementById('heroQuickOnboardBtn');
            const tasksEl = document.getElementById('memberTasksSubtitle');
            const dailyTasksCard = document.getElementById('dailyTasksCard');
            const streakTitle = document.getElementById('sanhMemberStreakTitle');
            const targetCard = document.getElementById('heroTargetTracker');
            const navHome = document.getElementById('nav-hom-nay');
            const lofiSpan = lofi ? lofi.querySelector('span:last-child') : null;
            const skillListenPct = document.getElementById('skillAccuracyListenPct');
            const skillListenTotal = document.getElementById('skillBankTotalListen');

            return {
                headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
                headerSticky: header ? getComputedStyle(header).position : '',
                lofiLabelWidth: lofiSpan ? Math.round(lofiSpan.getBoundingClientRect().width) : 0,
                greetingInsideHeader: !!(header && greeting && header.contains(greeting)),
                lofiInsideHeader: !!(header && lofi && header.contains(lofi)),
                toolsOutsideHero: !!(hero && tools && !hero.contains(tools)),
                bubbleRemoved: bubble === null,
                targetCardCount: targetCard && targetCard.parentElement ? targetCard.parentElement.children.length : 0,
                tasksInChecklistCard: !!(dailyTasksCard && tasksEl && dailyTasksCard.contains(tasksEl)),
                streakText: streakTitle ? streakTitle.textContent.trim() : '',
                navHomeTag: navHome ? navHome.tagName : '',
                navHomeAriaCurrent: navHome ? navHome.getAttribute('aria-current') : '',
                heroImgSrc: heroImg ? heroImg.getAttribute('src') : '',
                aiTutorImgSrc: aiTutorImg ? aiTutorImg.getAttribute('src') : '',
                sidebarImgSrc: sidebarImg ? sidebarImg.getAttribute('src') : '',
                accText: accVal ? accVal.textContent.trim() : '',
                studyTimeText: studyTime ? studyTime.textContent.trim() : '',
                subText: subText ? subText.textContent.trim() : '',
                subTextTruncated: subText ? (subText.scrollWidth > subText.clientWidth + 1) : true,
                skillListenPctText: skillListenPct ? skillListenPct.textContent.trim() : '',
                skillListenTotalText: skillListenTotal ? skillListenTotal.textContent.trim() : '',
                hasOptA: !!optA,
                hasOptB: !!optB,
                overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth
            };
        });

        assert.ok(desktopAudit.headerHeight > 0 && desktopAudit.headerHeight <= 84, `Desktop global sticky header should be 1 unified compact row (<=84px), got ${desktopAudit.headerHeight}px`);
        assert.strictEqual(desktopAudit.headerSticky, 'sticky', 'Global header must be sticky on desktop');
        assert.ok(desktopAudit.lofiLabelWidth > 10, `Mini Lofi player label should be visible at 1280px, got ${desktopAudit.lofiLabelWidth}px`);
        assert.ok(desktopAudit.greetingInsideHeader, 'Greeting must be merged into left side of global sticky header (no double header)');
        assert.ok(desktopAudit.lofiInsideHeader, 'Mini Lofi player must live inside the Global Sticky Header');
        assert.ok(desktopAudit.toolsOutsideHero, 'Quick study tools section must NOT be nested inside Hero Card');
        assert.ok(desktopAudit.bubbleRemoved, 'Empty #heroSoiMayBubble DOM node must be removed completely');
        assert.strictEqual(desktopAudit.targetCardCount, 4, 'Bento Stat Row must have balanced 4 cards including Target tracker');
        assert.ok(desktopAudit.tasksInChecklistCard, 'Daily tasks count pill must sit inside #dailyTasksCard header');
        assert.strictEqual(desktopAudit.streakText, '0 ngày liên tiếp', 'Streak label must use clean Vietnamese copy');
        assert.strictEqual(desktopAudit.navHomeTag, 'A', 'Sidebar nav items must be semantic <a> links');
        assert.strictEqual(desktopAudit.navHomeAriaCurrent, 'page', 'Active home nav item must carry aria-current="page"');
        assert.strictEqual(desktopAudit.skillListenPctText, '0%', 'Skill balance empty percentage must be 0%');
        assert.ok(desktopAudit.skillListenTotalText.includes('Ngân hàng:') && !desktopAudit.skillListenTotalText.includes('Đang đồng bộ'), 'Skill bank totals must compute dynamically');
        assert.ok(desktopAudit.heroImgSrc.includes('may_guide.png'), `Hero mascot should be may_guide.png, got ${desktopAudit.heroImgSrc}`);
        assert.ok(desktopAudit.aiTutorImgSrc.includes('may_explorer.png'), `AI Tutor mascot should be may_explorer.png, got ${desktopAudit.aiTutorImgSrc}`);
        assert.ok(desktopAudit.sidebarImgSrc.includes('may_reading.png'), `Sidebar mascot should be may_reading.png, got ${desktopAudit.sidebarImgSrc}`);
        assert.strictEqual(desktopAudit.accText, 'Độ nhớ: Chưa kiểm tra', 'Guest empty state accuracy label must be clean');
        assert.strictEqual(desktopAudit.studyTimeText, 'Chưa học', 'Guest empty state study time must be Chưa học');
        assert.ok(!desktopAudit.subText.includes('Mục tiêu 600'), `Guest subtext must not hardcode 600 TOEIC, got: ${desktopAudit.subText}`);
        assert.ok(!desktopAudit.subTextTruncated, `1280px header subtitle must fit without ellipsis truncation ("${desktopAudit.subText}")`);
        assert.ok(desktopAudit.hasOptA && desktopAudit.hasOptB, 'Hero must provide both Option A (diagnostic) and Option B (quick 5 words)');
        assert.ok(!desktopAudit.overflowX, 'Zero horizontal overflow on 1280px desktop');
        assert.strictEqual(pageErrors.length, 0, `Zero page errors expected, got: ${pageErrors.join('; ')}`);

        // Verify done > 0 without recorded answer accuracy displays 'Chưa đủ dữ liệu' instead of misleading 0%
        const partialDonePct = await page.evaluate(() => {
            window.state.listenDone = 5;
            window.state.listenTotalAnswers = 0;
            window.updateDashboardMetrics();
            const txt = document.getElementById('skillAccuracyListenPct')?.textContent?.trim();
            window.state.listenDone = 0;
            window.updateDashboardMetrics();
            return txt;
        });
        assert.strictEqual(partialDonePct, 'Chưa đủ dữ liệu', 'Completed drills without recorded accuracy must render Chưa đủ dữ liệu instead of 0%');

        const artifactDir = os.tmpdir();
        await page.screenshot({ path: path.join(artifactDir, 'figma_fixed_desktop_1280.png'), fullPage: true });
        console.log('  ✓ PASS: Desktop (1280x850) unified header, non-truncated subtitle, 4-card Bento row & honest skill balance verified.');

        // Compact Laptop 1024px check
        await page.setViewport({ width: 1024, height: 768 });
        await delay(300);
        const laptop1024Audit = await page.evaluate(() => {
            const header = document.getElementById('sanhTopHeaderBar');
            const cluster = document.getElementById('sanhAccountCluster');
            return {
                headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
                clusterInside: header && cluster ? cluster.getBoundingClientRect().right <= header.getBoundingClientRect().right + 2 : false
            };
        });
        assert.ok(laptop1024Audit.headerHeight > 0 && laptop1024Audit.headerHeight <= 84, `1024px header should stay 1 row (<=84px), got ${laptop1024Audit.headerHeight}px`);
        assert.ok(laptop1024Audit.clusterInside, '1024px account cluster must fit inside header');

        // Mobile viewport check
        await page.setViewport({ width: 375, height: 812 });
        await delay(400);
        const mobileAudit = await page.evaluate(() => {
            const mobileHeader = document.getElementById('mobileStickyTopHeader');
            const loginBtn = document.getElementById('mobileUnauthLoginBtn');
            const accountCluster = document.getElementById('sanhAccountCluster');
            const dupPills = Array.from(document.querySelectorAll('#sanhTopHeaderBar .mobile-dup-stat-pill'));
            const dupPillsAllHidden = dupPills.length >= 2 && dupPills.every((el) => getComputedStyle(el).display === 'none');
            const headerRect = mobileHeader ? mobileHeader.getBoundingClientRect() : null;
            const loginRect = loginBtn ? loginBtn.getBoundingClientRect() : null;
            return {
                overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                loginRight: loginRect ? Math.round(loginRect.right) : 0,
                headerRight: headerRect ? Math.round(headerRect.right) : 0,
                loginInsideMobileHeader: headerRect && loginRect ? loginRect.right <= headerRect.right + 1 && loginRect.right <= window.innerWidth : false,
                duplicateClusterHidden: accountCluster ? getComputedStyle(accountCluster).display === 'none' : false,
                dupPillsAllHidden
            };
        });
        assert.ok(!mobileAudit.overflowX, 'Zero horizontal overflow on 375px mobile');
        assert.ok(mobileAudit.loginInsideMobileHeader, `Mobile Login button must not clip at 375px (loginRight=${mobileAudit.loginRight}, headerRight=${mobileAudit.headerRight})`);
        assert.ok(mobileAudit.duplicateClusterHidden, 'Duplicate desktop account cluster must be hidden on <1024px mobile');
        assert.ok(mobileAudit.dupPillsAllHidden, 'Duplicate Streak/XP pills in main header must be hidden on 375px mobile');
        await page.screenshot({ path: path.join(artifactDir, 'figma_fixed_mobile_375.png'), fullPage: false });
        console.log('  ✓ PASS: Laptop (1024px) & Mobile (375px) responsive headers & deduplication verified with zero clipping.');

        console.log('\n🎉 ALL FIGMA DESIGN SYSTEM & PRODUCTION EDTECH CHECKS PASSED!');
    } finally {
        await browser.close();
        try { serverProc.kill(); } catch (e) {}
    }
})();
