const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Pre-set user session in localStorage before page loads
  await page.evaluateOnNewDocument(() => {
    const mockUser = {
      id: 'acc-test-1',
      email: 'danghg20008@gmail.com',
      name: 'Huynh Dang',
      streak: 10,
      xp: 0
    };
    localStorage.setItem('cung_dang_session_user', JSON.stringify(mockUser));
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    localStorage.setItem('toeic_user_session', JSON.stringify(mockUser));
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // Set mock user and apply UI
  await page.evaluate(() => {
    const mockUser = {
      id: 'acc-test-1',
      email: 'danghg20008@gmail.com',
      name: 'Huynh Dang',
      streak: 10,
      xp: 0
    };
    window.currentUserAccount = mockUser;
    localStorage.setItem('cung_dang_session_user', JSON.stringify(mockUser));
    if (typeof applyCurrentAccountToUI === 'function') {
      applyCurrentAccountToUI();
    }
  });

  await sleep(400);

  // Click on the user profile button
  await page.evaluate(() => {
    const btn = document.querySelector('#sanhMemberDropdownWrapper button');
    if (btn) btn.click();
  });

  await sleep(600);

  // Take screenshot of the top right section
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'reproduce_dropdown_overlap.png'),
    clip: { x: 800, y: 0, width: 640, height: 500 }
  });
  console.log('Saved reproduce_dropdown_overlap.png');

  await browser.close();
})();
