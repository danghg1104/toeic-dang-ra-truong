const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const heroStart = indexHtml.indexOf('id=\x22heroActionCardContainer\x22');
console.log(indexHtml.slice(heroStart + 3500, heroStart + 6000));
