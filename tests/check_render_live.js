const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const resolutions = [
    { name: '1024x768', width: 1024, height: 768 },
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '1440x900', width: 1440, height: 900 }
  ];

  for (const res of resolutions) {
    const page = await browser.newPage();
    await page.setViewport({ width: res.width, height: res.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Get bounding boxes of header elements
    const headerBox = await page.$eval('#sanhTopHeaderBar', el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right };
    });

    const accountClusterBox = await page.$eval('#sanhAccountCluster', el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right };
    });

    const avatarBox = await page.$eval('#sanhMemberDropdownWrapper', el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right };
    });

    const isFullyInside = accountClusterBox.right <= headerBox.right + 2;

    console.log(`Resolution ${res.name}: Header Right=${headerBox.right.toFixed(1)}, AccountCluster Right=${accountClusterBox.right.toFixed(1)}, Fully Inside=${isFullyInside}`);
    await page.screenshot({ path: `tests/header_${res.name}.png`, clip: { x: 0, y: 0, width: res.width, height: 180 } });
    await page.close();
  }

  await browser.close();
  console.log('ALL RESOLUTIONS TESTED!');
})();
