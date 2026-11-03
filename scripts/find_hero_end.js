const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const heroStart = indexHtml.indexOf('id=\x22heroActionCardContainer\x22');
const nextSection = indexHtml.indexOf('<!-- 3. KHỐI 2 (DAILY FOCUS METRICS)', heroStart);
console.log('Next section found:', nextSection !== -1);
if (nextSection !== -1) {
    console.log(indexHtml.slice(nextSection - 500, nextSection + 100));
}
