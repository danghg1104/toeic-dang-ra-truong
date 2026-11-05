const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

function findChromePath() {
  const commonPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const delay = ms => new Promise(r => setTimeout(r, ms));

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(destPath); });
    }).on('error', reject);
  });
}

(async () => {
  const chromePath = findChromePath();
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Set Googlebot user agent so Pinterest serves the raw indexed content without login modal
  await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating with Googlebot UA...');
  await page.goto('https://www.pinterest.com/pin/997125173771992861/', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(2000);

  const title = await page.title();
  console.log('Title:', title);

  const artifactDir = path.resolve('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283');
  const screenshotPath = path.join(artifactDir, 'pinterest_googlebot.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  const pinInfo = await page.evaluate(() => {
    const ogImg = document.querySelector('meta[property="og:image"]')?.content ||
                  document.querySelector('meta[name="og:image"]')?.content;
    const desc = document.querySelector('meta[property="og:description"]')?.content ||
                 document.querySelector('meta[name="description"]')?.content;
    const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
      src: i.src,
      alt: i.alt,
      width: i.naturalWidth || i.width,
      height: i.naturalHeight || i.height
    })).filter(i => i.src && i.src.includes('pinimg.com'));

    return { ogImg, desc, imgs };
  });

  console.log('OG Image:', pinInfo.ogImg);
  console.log('Description:', pinInfo.desc);
  console.log('Found pinimg images:', pinInfo.imgs.length);

  if (pinInfo.ogImg) {
    const dest = path.join(artifactDir, 'pinterest_pin_main.jpg');
    console.log('Downloading main pin image:', pinInfo.ogImg);
    await downloadImage(pinInfo.ogImg, dest);
    console.log('Main pin image saved to:', dest);
  }

  for (let i = 0; i < Math.min(pinInfo.imgs.length, 5); i++) {
    const img = pinInfo.imgs[i];
    console.log(`Pinimg [${i+1}]: ${img.src}`);
    const dest = path.join(artifactDir, `pinterest_related_${i+1}.jpg`);
    await downloadImage(img.src, dest).catch(() => {});
  }

  await browser.close();
  console.log('Done!');
})().catch(err => {
  console.error('Err:', err.message);
  process.exit(1);
});
