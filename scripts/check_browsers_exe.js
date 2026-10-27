const fs = require('fs');

const browsers = [
  { name: 'CocCoc', exe: 'C:/Program Files/CocCoc/Browser/Application/browser.exe' },
  { name: 'Edge', exe: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' },
  { name: 'Chrome', exe: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }
];

browsers.forEach(b => {
  console.log(b.name, fs.existsSync(b.exe));
});
