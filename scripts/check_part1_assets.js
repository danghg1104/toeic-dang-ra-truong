const fs = require('fs');
const path = require('path');

console.log('--- CHECKING ALL PART 1 QUESTIONS & IMAGES ---');

// 1. app-core.bundle.js
const appCode = fs.readFileSync('js/app-core.bundle.js', 'utf8');
const p1Start = appCode.indexOf('listening_part1: [');
let appCoreP1Images = [];
if (p1Start !== -1) {
    const p1End = appCode.indexOf('listening_part2: [', p1Start);
    const chunk = appCode.slice(p1Start, p1End);
    const regex = /image:\s*["'](.*?)["']/g;
    let m;
    while ((m = regex.exec(chunk)) !== null) {
        appCoreP1Images.push(m[1]);
    }
}
console.log('1. app-core.bundle.js listening_part1 images:', appCoreP1Images.length);
console.log('   Sample:', appCoreP1Images);

// Check if these assets exist locally on disk
appCoreP1Images.forEach(img => {
    const exists = fs.existsSync(img);
    console.log(`   - ${img}: ${exists ? 'EXISTS LOCALLY' : 'MISSING ON DISK'}`);
});

// 2. toeic-traps-data.js
const trapsCode = fs.readFileSync('js/toeic-traps-data.js', 'utf8');
const tStart = trapsCode.indexOf('const PART1_UNIQUE_SCENARIOS = [');
const tEnd = trapsCode.indexOf('];', tStart);
const tArr = eval(trapsCode.slice(tStart + 'const PART1_UNIQUE_SCENARIOS = '.length, tEnd + 1));
console.log('\n2. toeic-traps-data.js PART1_UNIQUE_SCENARIOS:', tArr.length);
const trapImages = tArr.map(s => s.image);
const trapUniq = new Set(trapImages);
console.log('   Unique images count:', trapUniq.size);

// 3. full-part-practice.js
const fullCode = fs.readFileSync('js/full-part-practice.js', 'utf8');
const regexFull = /image:\s*["'](.*?)["']/g;
let fullImages = [];
let mf;
while ((mf = regexFull.exec(fullCode)) !== null) {
    fullImages.push(mf[1]);
}
console.log('\n3. full-part-practice.js images:', fullImages.length);
console.log('   Sample:', fullImages.slice(0, 5));

// 4. Check for duplicates across all datasets
const allCollected = [...appCoreP1Images, ...trapImages, ...fullImages];
const allUniq = new Set(allCollected);
console.log(`\nTOTAL COLLECTED IMAGES: ${allCollected.length} (Unique: ${allUniq.size})`);

const counts = {};
allCollected.forEach(url => {
    counts[url] = (counts[url] || 0) + 1;
});
const dupes = Object.entries(counts).filter(([_, count]) => count > 1);
console.log('Duplicate image occurrences:', dupes.length);
dupes.forEach(([url, count]) => {
    console.log(`   [${count}x]: ${url}`);
});
