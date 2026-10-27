const path = require('path');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const images = [
  { name: 'Image 1 (media_1793088041901_b3ccdc30.png)', path: 'C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/.user_uploaded/media_1793088041901_b3ccdc30.png' },
  { name: 'Image 2 (media_1793088052417_8af48196.png)', path: 'C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/.user_uploaded/media_1793088052417_8af48196.png' },
  { name: 'Image 3 (media_1793088061529_35e03677.png)', path: 'C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/.user_uploaded/media_1793088061529_35e03677.png' },
  { name: 'Image 4 (media_1793088157742_bca73389.png)', path: 'C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/.user_uploaded/media_1793088157742_bca73389.png' },
  { name: 'User Screenshot (media_1793098421926_67cd35e8.png)', path: 'C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/.user_uploaded/media_1793098421926_67cd35e8.png' }
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' });
  const page = await browser.newPage();

  for (const img of images) {
    await page.goto('file:///' + img.path);
    const dim = await page.evaluate(() => {
      const el = document.querySelector('img');
      return { width: el.naturalWidth, height: el.naturalHeight };
    });
    console.log(img.name, 'Dimensions:', dim);
  }
  await browser.close();
})();
