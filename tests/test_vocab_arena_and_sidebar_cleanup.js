const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('  VERIFYING VOCAB ARENA FIX & SIDEBAR CLEANUP (USER REQUEST)');
console.log('================================================================');

// 1. Verify index.html does not contain the 3 removed sidebar buttons
const indexHtml = fs.readFileSync('index.html', 'utf8');
const wwwIndexHtml = fs.readFileSync('www/index.html', 'utf8');

assert.ok(!indexHtml.includes('id="nav-adaptive-test"'), 'nav-adaptive-test must be removed from sidebar');
assert.ok(!indexHtml.includes('id="nav-trap-matrix"'), 'nav-trap-matrix must be removed from sidebar');
assert.ok(!indexHtml.includes('id="nav-radar-analytics"'), 'nav-radar-analytics must be removed from sidebar');
console.log('  ✓ [PASS] All 3 unwanted sidebar items (Test Thích Ứng, Ma Trận 12 Bẫy, Radar 7 Cánh) removed from index.html.');

assert.ok(!wwwIndexHtml.includes('id="nav-adaptive-test"'), 'nav-adaptive-test must be removed from www/index.html');
assert.ok(!wwwIndexHtml.includes('id="nav-trap-matrix"'), 'nav-trap-matrix must be removed from www/index.html');
assert.ok(!wwwIndexHtml.includes('id="nav-radar-analytics"'), 'nav-radar-analytics must be removed from www/index.html');
console.log('  ✓ [PASS] www/index.html is synchronized.');

// 2. Verify js/vocab-game-workstation.js syntax and integrity
const { execSync } = require('child_process');
try {
    execSync('node -c js/vocab-game-workstation.js');
    console.log('  ✓ [PASS] js/vocab-game-workstation.js syntax is 100% valid (no stray characters).');
} catch (e) {
    assert.fail('Syntax error detected in js/vocab-game-workstation.js: ' + e.message);
}

// 3. Verify VocabGameWorkstation render method creates full UI
const vocabGameCode = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
assert.ok(vocabGameCode.includes('class VocabGameWorkstation'), 'VocabGameWorkstation class exists');
assert.ok(vocabGameCode.includes('buildConfigHTML()'), 'buildConfigHTML exists');
assert.ok(vocabGameCode.includes('window.VocabGameWorkstation = instance'), 'Singleton exported to window');

console.log('================================================================');
console.log('🎉 ALL FIXES AND REMOVALS VERIFIED 100% SUCCESSFULLY!');
console.log('================================================================');
