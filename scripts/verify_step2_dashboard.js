const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Đang kiểm chứng Dashboard Bước 2 trực tiếp qua Headless Chromium...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Fake login user session with real profile
  await page.evaluateOnNewDocument(() => {
    const testUser = {
      id: 'acc-g-1792730904332',
      uid: 'acc-g-1792730904332',
      displayName: 'Huỳnh Đăng',
      name: 'Huỳnh Đăng',
      email: 'danghg1104@gmail.com',
      photoURL: 'assets/mascot/may_avatar.png',
      targetScore: 600,
      examDate: '20/12/2026',
      daysRemaining: 52,
      studyMinutes: 16,
      streak: 7,
      xp: 40,
      diagnosticResults: {
        totalScore: 540,
        listening: 310,
        reading: 230
      }
    };
    localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
    window.currentUserAccount = testUser;
  });

  await page.goto('http://localhost:3000/#hom-nay', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2000);

  // Check DOM elements of Step 2
  const check = await page.evaluate(() => {
    const heroTitle = document.getElementById('heroLessonTitle')?.innerText;
    const heroBtn = document.getElementById('heroPrimaryCtaBtn')?.innerText;
    const streakTitle = document.getElementById('sanhMemberStreakTitle')?.innerText;
    const studyTime = document.getElementById('memberStudyTime')?.innerText;
    const tasksSubtitle = document.getElementById('memberTasksSubtitle')?.innerText;
    const smartRecTitle = document.getElementById('smartRecommendationTitle')?.innerText;
    const listenProgWidth = document.getElementById('skillAccuracyListenProgress')?.style.width;
    const readProgWidth = document.getElementById('skillAccuracyReadProgress')?.style.width;

    return {
      heroTitle,
      heroBtn,
      streakTitle,
      studyTime,
      tasksSubtitle,
      smartRecTitle,
      listenProgWidth,
      readProgWidth
    };
  });

  console.log('DOM Evaluation Step 2:', JSON.stringify(check, null, 2));

  // Capture screenshot of the entire Study Studio Dashboard
  const screenPath = path.join(ARTIFACT_DIR, 'proof_step2_dashboard_studio.png');
  await page.screenshot({ path: screenPath, fullPage: false });
  console.log('📸 Đã chụp ảnh màn hình kiểm chứng tại:', screenPath);

  await browser.close();
  console.log('🎉 Hoàn tất kiểm chứng Bước 2!');
}

run().catch(err => {
  console.error('Lỗi khi kiểm chứng Bước 2:', err);
  process.exit(1);
});
