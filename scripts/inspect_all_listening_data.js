const fs = require('fs');

const files = [
    'js/ets2026-data.js',
    'js/listening-data-v2.js',
    'js/toeic-listening-workout.js',
    'js/toeic-boc-bang-stats.js',
    'js/toeic-diagnostic-workout.js',
    'js/roadmap-and-traps.js'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        const content = fs.readFileSync(f, 'utf8');
        const imgMatches = content.match(/image\s*:\s*['"][^'"]+['"]/g) || [];
        const p1Matches = content.match(/part\s*1|listening_part1/gi) || [];
        console.log(`${f}:`);
        console.log(`  - Part 1 mentions: ${p1Matches.length}`);
        console.log(`  - Image properties: ${imgMatches.length}`);
        if (imgMatches.length > 0) {
            console.log('  - Sample images:', imgMatches.slice(0, 3));
        }
    }
});
