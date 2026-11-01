const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  
  const logoInfo = await page.evaluate(() => {
    const desktopLogo = document.querySelector('a[href="#hom-nay"] img');
    return {
      src: desktopLogo ? desktopLogo.src : null,
      naturalWidth: desktopLogo ? desktopLogo.naturalWidth : 0,
      naturalHeight: desktopLogo ? desktopLogo.naturalHeight : 0,
      complete: desktopLogo ? desktopLogo.complete : false
    };
  });
  console.log('Desktop Logo Info:', logoInfo);
  
  // Crop only the top-left brand area
  const clip = { x: 0, y: 0, width: 320, height: 160 };
  const outPath = path.join(ARTIFACTS_DIR, 'proof_new_logo_desktop_sidebar.png');
  await page.screenshot({ 
    path: outPath,
    clip: clip
  });
  console.log('Saved logo proof screenshot to:', outPath);
  await browser.close();
})();
