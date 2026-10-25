const fs = require('fs');

const html = fs.readFileSync('scripts/toeic_index.html', 'utf8');

// Look for practice test titles
const tests = [];
// DailyDictation structure: look for accordions, test titles, lessons
const ptestMatches = html.match(/Practice Test \d+/g);
console.log('Practice test occurrences:', ptestMatches ? [...new Set(ptestMatches)] : 'none');

// Look for lesson links
const lessonMatches = [...html.matchAll(/href="([^"]*exercises\/toeic\/[^"]*)"/g)].map(m => m[1]);
console.log('Total TOEIC lesson links found:', lessonMatches.length);
console.log('First 10 lesson links:', lessonMatches.slice(0, 10));

// Check a sample block around Practice Test 1
const idx1 = html.indexOf('Practice Test 1');
if (idx1 !== -1) {
    console.log('\n--- Slice around Practice Test 1 ---');
    console.log(html.substring(idx1 - 100, idx1 + 1500));
}
