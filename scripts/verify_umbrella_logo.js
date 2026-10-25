const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BRAIN_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Verifying new umbrella Totoro logo...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Desktop Sidebar Logo
  console.log('Loading Homepage for Desktop Logo...');
  await page.goto('http://127.0.0.1:3000/#hom-nay', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await sleep(2000);

  const desktopLogoEl = await page.$('aside a[href="#hom-nay"]');
  if (desktopLogoEl) {
    const desktopLogoPath = path.join(BRAIN_DIR, 'proof_umbrella_logo_desktop.png');
    await desktopLogoEl.screenshot({ path: desktopLogoPath });
    console.log('Saved proof_umbrella_logo_desktop.png');
  }

  // 2. Mobile Header Logo
  console.log('Setting viewport to mobile...');
  await page.setViewport({ width: 390, height: 844 });
  await sleep(1000);

  const mobileLogoEl = await page.$('.lg\\:hidden.sticky.top-1\\.5 a[href="#hom-nay"]');
  if (mobileLogoEl) {
    const mobileLogoPath = path.join(BRAIN_DIR, 'proof_umbrella_logo_mobile.png');
    await mobileLogoEl.screenshot({ path: mobileLogoPath });
    console.log('Saved proof_umbrella_logo_mobile.png');
  }

  // Full Header screenshot on Mobile
  const mobileHeaderEl = await page.$('.lg\\:hidden.sticky.top-1\\.5');
  if (mobileHeaderEl) {
    const headerPath = path.join(BRAIN_DIR, 'proof_umbrella_logo_mobile_header.png');
    await mobileHeaderEl.screenshot({ path: headerPath });
    console.log('Saved proof_umbrella_logo_mobile_header.png');
  }

  await browser.close();
  console.log('Logo verification completed successfully!');
}

run().catch(err => {
  console.error('Error during logo verification:', err);
  process.exit(1);
});
