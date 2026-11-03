const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('startHeader idx:', html.indexOf('TOP HEADER BAR'));
console.log('hero action card idx:', html.indexOf('HERO ACTION CARD'));
console.log('view-hom-nay idx:', html.indexOf('id="view-hom-nay"'));
