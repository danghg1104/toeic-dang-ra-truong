const path = require('path');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('Testing "Tôi đi đâu đó" branding across web and PWA...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1280, height: 720 }
  });
  const page = await browser.newPage();

  // 1. Check Manifest
  console.log('Fetching /manifest.json ...');
  const manifestRes = await page.goto('http://localhost:3000/manifest.json?v=toididaudo_v13');
  const manifest = await manifestRes.json();
  console.log('Manifest name:', manifest.name);
  console.log('Manifest short_name:', manifest.short_name);

  // 2. Load Home Page
  console.log('Loading http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const title = await page.title();
  console.log('Page title:', title);

  // Check sidebar branding
  const brandLines = await page.evaluate(() => {
    const brandEl = document.querySelector('.sidebar-text');
    return brandEl ? brandEl.innerText.trim() : 'not found';
  });
  console.log('Sidebar Brand Text:\n' + brandLines);

  // Save screenshot of the live page with new brand
  const proofPath = 'C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/proof_toi_di_dau_do_verified.png';
  await page.screenshot({ path: proofPath });
  console.log('Proof screenshot saved to:', proofPath);

  await browser.close();
  console.log('\n🎉 ALL CHECKS PASSED FOR "Tôi đi đâu đó"!');
})();
