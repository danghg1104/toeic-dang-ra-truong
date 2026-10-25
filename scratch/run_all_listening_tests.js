/**
 * Master Verification Test Suite for TOEIC Listening Engine (All Phases 1 to 5)
 */
const { execSync } = require('child_process');

console.log('================================================================');
console.log('MASTER VERIFICATION SUITE: TOEIC LISTENING UPGRADE (PHASES 1-5)');
console.log('================================================================\n');

const testSuites = [
    { name: 'Phase 1 & Phase 2: Audio Engine & ETS 2026 Database', script: 'node scratch/test_listening_phase1_phase2.js' },
    { name: 'Phase 4: Listening Dashboard, Stats, Heatmap & Mock Tests', script: 'node scratch/test_listening_phase4.js' },
    { name: 'Phase 5: Smart SRS Review, Dictation Diff & Gamification', script: 'node scratch/test_listening_phase5.js' }
];

let allPassed = true;
testSuites.forEach((suite, idx) => {
    console.log(`[TEST SUITE ${idx + 1}/3] ${suite.name}`);
    try {
        const output = execSync(suite.script, { stdio: 'pipe' }).toString();
        console.log(output);
        console.log(`✅ Passed Suite ${idx + 1}\n----------------------------------------------------------------\n`);
    } catch (e) {
        console.error(`❌ FAILED Suite ${idx + 1}:`, e.stdout ? e.stdout.toString() : e.message);
        allPassed = false;
    }
});

if (allPassed) {
    console.log('🏆 ALL TOEIC LISTENING ENGINE TEST SUITES PASSED 100%!');
    process.exit(0);
} else {
    console.error('💥 SOME TEST SUITES FAILED!');
    process.exit(1);
}
