const fs = require('fs');
const path = require('path');

console.log('=== TOEIC PART 1 COMPREHENSIVE 100-AGENT AUDIT SCRIPT ===');

// 1. Audit Local Assets in assets/listening/part1/
const localImgDir = 'assets/listening/part1';
const localImgs = fs.readdirSync(localImgDir).filter(f => f.endsWith('.webp'));
console.log(`Local WebP images in ${localImgDir}: ${localImgs.length} files`);

// 2. Audit Local Audio in audio/listening/part1/
const localAudioDir = 'audio/listening/part1';
const localAudios = fs.readdirSync(localAudioDir).filter(f => f.endsWith('.mp3'));
console.log(`Local MP3 audio files in ${localAudioDir}: ${localAudios.length} files`);

// 3. Audit listening-data-v2.js
const v2Code = fs.readFileSync('js/listening-data-v2.js', 'utf8');
const v2DbStart = v2Code.indexOf('const RAW_DB =');
const v2DbEnd = v2Code.indexOf('};', v2DbStart);
let v2Db = null;
try {
    const rawJson = v2Code.slice(v2DbStart + 'const RAW_DB ='.length, v2DbEnd + 1).trim();
    v2Db = eval(`(${rawJson})`);
} catch (e) {
    console.error('Failed to parse listening-data-v2 DB:', e.message);
}

const v2Part1 = v2Db ? v2Db.part1 : [];
console.log(`listening-data-v2.js Part 1 questions: ${v2Part1.length}`);

// Check duplicates within listening-data-v2.js
const v2Images = v2Part1.map(q => q.image);
const v2Audios = v2Part1.map(q => q.audio_url);
const v2ImageSet = new Set(v2Images);
const v2AudioSet = new Set(v2Audios);
console.log(`- Unique images in listening-data-v2.js: ${v2ImageSet.size}/${v2Images.length}`);
console.log(`- Unique audios in listening-data-v2.js: ${v2AudioSet.size}/${v2Audios.length}`);

// Check physical existence of v2 assets
let missingV2Images = 0;
let missingV2Audios = 0;
v2Part1.forEach((q, idx) => {
    const imgPath = q.image;
    if (!fs.existsSync(imgPath)) missingV2Images++;
    // audio_url e.g. /audio/listening/part1/p1_q01.mp3 -> remove leading slash
    const audioPath = q.audio_url ? q.audio_url.replace(/^\//, '') : '';
    if (!fs.existsSync(audioPath)) missingV2Audios++;
});
console.log(`- Missing images on disk in listening-data-v2: ${missingV2Images}`);
console.log(`- Missing audios on disk in listening-data-v2: ${missingV2Audios}`);

// 4. Audit toeic-traps-data.js
const trapsCode = fs.readFileSync('js/toeic-traps-data.js', 'utf8');
const tStart = trapsCode.indexOf('const PART1_UNIQUE_SCENARIOS = [');
const tEnd = trapsCode.indexOf('];', tStart);
const trapScenarios = eval(trapsCode.slice(tStart + 'const PART1_UNIQUE_SCENARIOS = '.length, tEnd + 1));
console.log(`\ntoeic-traps-data.js PART1_UNIQUE_SCENARIOS: ${trapScenarios.length} scenarios`);
const trapImages = trapScenarios.map(s => s.image);
const trapUniq = new Set(trapImages);
console.log(`- Unique images in toeic-traps-data.js: ${trapUniq.size}/${trapImages.length}`);

// 5. Audit app-core.bundle.js listening_part1
const appCode = fs.readFileSync('js/app-core.bundle.js', 'utf8');
const p1Start = appCode.indexOf('listening_part1: [');
let appCoreP1 = [];
if (p1Start !== -1) {
    const p1End = appCode.indexOf('listening_part2: [', p1Start);
    const chunk = appCode.slice(p1Start, p1End);
    const regex = /image:\s*["'](.*?)["']/g;
    let m;
    while ((m = regex.exec(chunk)) !== null) {
        appCoreP1.push(m[1]);
    }
}
console.log(`\napp-core.bundle.js listening_part1 image count: ${appCoreP1.length}`);

// 6. Audit full-part-practice.js
const fullCode = fs.readFileSync('js/full-part-practice.js', 'utf8');
const regexFull = /image:\s*["'](.*?)["']/g;
let fullP1 = [];
let mf;
while ((mf = regexFull.exec(fullCode)) !== null) {
    fullP1.push(mf[1]);
}
console.log(`full-part-practice.js image count: ${fullP1.length}`);

// 7. Cross-module duplicate analysis
const allImagesCombined = [
    ...v2Images.map(img => ({ source: 'listening-data-v2.js', img })),
    ...trapImages.map(img => ({ source: 'toeic-traps-data.js', img })),
    ...appCoreP1.map(img => ({ source: 'app-core.bundle.js', img })),
    ...fullP1.map(img => ({ source: 'full-part-practice.js', img }))
];
console.log(`\nTotal Part 1 image references across ALL modules: ${allImagesCombined.length}`);
const imageCounts = {};
allImagesCombined.forEach(item => {
    if (!imageCounts[item.img]) imageCounts[item.img] = { count: 0, sources: [] };
    imageCounts[item.img].count++;
    imageCounts[item.img].sources.push(item.source);
});

const crossDuplicates = Object.entries(imageCounts).filter(([_, data]) => data.count > 1);
console.log(`Total duplicate image URLs/paths across modules: ${crossDuplicates.length}`);
crossDuplicates.forEach(([img, data]) => {
    console.log(`  - [${data.count}x] ${img} -> in: ${data.sources.join(', ')}`);
});

// 8. Analyze Voice Breakdown in listening-data-v2.js
const voiceDistribution = {};
const accentDistribution = {};
v2Part1.forEach(q => {
    voiceDistribution[q.voice_name] = (voiceDistribution[q.voice_name] || 0) + 1;
    accentDistribution[q.accent] = (accentDistribution[q.accent] || 0) + 1;
});
console.log('\nVoice distribution in listening-data-v2.js:', voiceDistribution);
console.log('Accent distribution in listening-data-v2.js:', accentDistribution);

// 9. Inspect Audio Size & Quality Metrics
let totalAudioBytes = 0;
localAudios.forEach(f => {
    const s = fs.statSync(path.join(localAudioDir, f));
    totalAudioBytes += s.size;
});
console.log(`\nLocal Part 1 Audio: ${localAudios.length} files, Total size: ${(totalAudioBytes / 1024 / 1024).toFixed(2)} MB, Average per file: ${(totalAudioBytes / localAudios.length / 1024).toFixed(1)} KB`);

fs.writeFileSync('scripts/part1_audit_data.json', JSON.stringify({
    localImgsCount: localImgs.length,
    localAudiosCount: localAudios.length,
    v2Count: v2Part1.length,
    trapsCount: trapScenarios.length,
    appCoreCount: appCoreP1.length,
    fullPracticeCount: fullP1.length,
    crossDuplicates,
    voiceDistribution,
    accentDistribution,
    totalAudioMb: (totalAudioBytes / 1024 / 1024).toFixed(2)
}, null, 2));

console.log('Saved audit results to scripts/part1_audit_data.json');
