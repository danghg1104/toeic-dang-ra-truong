const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BRAIN_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome to verify all Totoro updates...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  // 1. Load Homepage
  console.log('Navigating to http://localhost:3000/#hom-nay...');
  await page.goto('http://localhost:3000/#hom-nay', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // Take proof of Desktop Sidebar (Logo + Mascot - Hình 4 & Hình 5)
  const sidebarEl = await page.$('aside');
  if (sidebarEl) {
    const sidebarPath = path.join(BRAIN_DIR, 'proof_totoro_sidebar_full.png');
    await sidebarEl.screenshot({ path: sidebarPath });
    console.log('Saved sidebar full proof to', sidebarPath);
  }

  // Close-up proof of Hình 4 (Sidebar Brand Logo)
  const logoEl = await page.$('aside a[href="#hom-nay"]');
  if (logoEl) {
    const logoPath = path.join(BRAIN_DIR, 'proof_totoro_sidebar_logo.png');
    await logoEl.screenshot({ path: logoPath });
    console.log('Saved Hình 4 logo proof to', logoPath);
  }

  // Close-up proof of Hình 5 (Bottom Sidebar Mascot Card)
  const mascotCardEl = await page.$('aside .glass-panel.rounded-\\[26px\\]');
  if (mascotCardEl) {
    const mascotPath = path.join(BRAIN_DIR, 'proof_totoro_bottom_mascot.png');
    await mascotCardEl.screenshot({ path: mascotPath });
    console.log('Saved Hình 5 mascot card proof to', mascotPath);
  }

  // Close-up proof of Dashboard AI Tutor (Hình 5 in Dashboard)
  const dashboardTutorEl = await page.$('#dashboardCatMascotContainer');
  if (dashboardTutorEl) {
    const tutorParent = await dashboardTutorEl.evaluateHandle(el => el.parentElement);
    const tutorPath = path.join(BRAIN_DIR, 'proof_dashboard_totoro_ai_tutor.png');
    await tutorParent.screenshot({ path: tutorPath });
    console.log('Saved Dashboard AI Tutor proof to', tutorPath);
  }

  // 2. Navigate to Lộ Trình Cá Nhân (Hình 1: 3 Chú Totoro Vượt Mốc 990)
  console.log('Switching to Lộ Trình Cá Nhân...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('lo-trinh');
  });
  await sleep(1500);

  // Capture S-Curve Roadmap with Totoro Trio Card
  const roadmapContainer = await page.$('#view-lo-trinh');
  if (roadmapContainer) {
    const roadmapPath = path.join(BRAIN_DIR, 'proof_roadmap_totoro_trio.png');
    await page.screenshot({ path: roadmapPath });
    console.log('Saved Hình 1 Roadmap Totoro Trio proof to', roadmapPath);
  }

  // 3. Navigate to Luyện Nghe Chính Tả (Hình 2: Totoro Ocarina Moonlight)
  console.log('Switching to Luyện Nghe Chính Tả...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('nghe-chinh-ta');
  });
  await sleep(1500);

  // Capture Listening Dictation view with Totoro Ocarina Moon Card
  const dictationView = await page.$('#view-nghe-chinh-ta');
  if (dictationView) {
    const dictationPath = path.join(BRAIN_DIR, 'proof_listening_totoro_ocarina.png');
    await page.screenshot({ path: dictationPath });
    console.log('Saved Hình 2 Listening Totoro Ocarina proof to', dictationPath);
  }

  await browser.close();
  console.log('All proofs captured successfully!');
}

run().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
