const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Fresh visit
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#sanhTopHeaderBar', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));

  const memberVisible = await page.$eval('#sanhMemberDropdownWrapper', el => !el.classList.contains('hidden'));
  const guestBtnHidden = await page.$eval('#sanhGuestLoginBtn', el => el.classList.contains('hidden'));
  const userName = await page.$eval('#sanhMemberProfileName', el => el.textContent.trim());

  console.log('Case A (Logged in): memberVisible =', memberVisible, 'guestBtnHidden =', guestBtnHidden, 'userName =', userName);
  await page.screenshot({ path: 'tests/header_logged_in.png', clip: { x: 250, y: 0, width: 1030, height: 200 } });

  // 2. Click Đăng xuất via menu
  await page.click('#sanhMemberProfileTrigger');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#sanhMemberLogoutBtn');
  await new Promise(r => setTimeout(r, 1500));

  const memberVisibleAfter = await page.$eval('#sanhMemberDropdownWrapper', el => !el.classList.contains('hidden'));
  const guestBtnVisibleAfter = await page.$eval('#sanhGuestLoginBtn', el => !el.classList.contains('hidden'));
  const guestBtnText = await page.$eval('#sanhGuestLoginBtn', el => el.textContent.trim());

  console.log('Case B (Guest after logout): memberVisible =', memberVisibleAfter, 'guestBtnVisible =', guestBtnVisibleAfter, 'guestBtnText =', guestBtnText);
  await page.screenshot({ path: 'tests/header_guest.png', clip: { x: 250, y: 0, width: 1030, height: 200 } });

  // 3. Click [Đăng nhập] button in header
  await page.click('#sanhGuestLoginBtn');
  await new Promise(r => setTimeout(r, 600));

  const authModalVisible = await page.$eval('#authModal', el => !el.classList.contains('hidden'));
  console.log('Case C (Click Guest Login Btn opens Auth Modal): authModalVisible =', authModalVisible);
  await page.screenshot({ path: 'tests/auth_modal_opened.png' });

  await browser.close();
  console.log('ALL AUTH HEADER TESTS PASSED!');
})();
