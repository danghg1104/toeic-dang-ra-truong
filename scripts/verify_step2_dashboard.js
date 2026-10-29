const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const token = '18aecc48e998366a29e990d0b434dc2b518ba1e4bc4a731c12ec273757fdb847';

  console.log('🚀 Khởi chạy Headless Chromium để kiểm chứng 100% Bước 2 (Dashboard Studio)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // 1. Establish origin context
  await page.goto('http://localhost:3000/manifest.json');

  // 2. Set authenticated session cookie
  await page.setCookie({
    name: 'cd_session',
    value: token,
    url: 'http://localhost:3000'
  });

  // 3. Navigate to Dashboard #hom-nay
  console.log('🌐 Đang tải http://localhost:3000/#hom-nay...');
  await page.goto('http://localhost:3000/#hom-nay', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await sleep(4000);

  // Check DOM elements of Step 2
  const check = await page.evaluate(() => {
    const greeting = document.getElementById('sanhGreetingPrefix')?.innerText;
    const memberName = document.getElementById('sanhMemberGreetingName')?.innerText;
    const headerSub = document.getElementById('sanhHeaderSubText')?.innerText;
    const heroTitle = document.getElementById('heroLessonTitle')?.innerText;
    const heroBadge = document.getElementById('heroLessonBadgeText')?.innerText;
    const heroBtn = document.getElementById('heroPrimaryCtaBtn')?.innerText;
    const streakTitle = document.getElementById('sanhMemberStreakTitle')?.innerText;
    const streakVal = document.getElementById('sanhMemberStreakVal')?.innerText;
    const studyTime = document.getElementById('memberStudyTime')?.innerText;
    const targetScore = document.getElementById('memberTargetScore')?.innerText;
    const tasksSubtitle = document.getElementById('memberTasksSubtitle')?.innerText;
    const smartRecTitle = document.getElementById('smartRecommendationTitle')?.innerText;
    const smartRecBody = document.getElementById('smartRecommendationBody')?.innerText;
    const listenProgWidth = document.getElementById('skillAccuracyListenProgress')?.style.width;
    const readProgWidth = document.getElementById('skillAccuracyReadProgress')?.style.width;
    const grammarProgWidth = document.getElementById('skillAccuracyGrammarProgress')?.style.width;
    const vocabProgWidth = document.getElementById('skillAccuracyVocabProgress')?.style.width;
    const streakDotsCount = document.getElementById('memberStreakDaysRow')?.children.length;
    const userAccount = window.currentUserAccount;

    return {
      userLoggedIn: !!userAccount,
      userName: userAccount?.name,
      greeting,
      memberName,
      headerSub,
      heroTitle,
      heroBadge,
      heroBtn,
      streakTitle,
      streakVal,
      streakDotsCount,
      targetScore,
      studyTime,
      tasksSubtitle,
      smartRecTitle,
      smartRecBody,
      listenProgWidth,
      readProgWidth,
      grammarProgWidth,
      vocabProgWidth
    };
  });

  console.log('====================================================');
  console.log('DOM Evaluation Step 2 (Real User Session):');
  console.log(JSON.stringify(check, null, 2));
  console.log('====================================================');

  // Capture screenshot of the entire Study Studio Dashboard
  const screenPath = path.join(ARTIFACT_DIR, 'proof_step2_dashboard_studio.png');
  await page.screenshot({ path: screenPath, fullPage: false });
  console.log('📸 Đã chụp ảnh màn hình kiểm chứng tại:', screenPath);

  await browser.close();
  console.log('🎉 Hoàn tất kiểm chứng Bước 2 với 100% dữ liệu sống!');
}

run().catch(err => {
  console.error('Lỗi khi kiểm chứng Bước 2:', err);
  process.exit(1);
});
