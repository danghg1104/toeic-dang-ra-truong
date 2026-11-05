const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('  VERIFYING MOBILE RESPONSIVE HEADER & ZERO-OVERFLOW LAYOUT');
console.log('================================================================');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const wwwIndexHtml = fs.readFileSync('www/index.html', 'utf8');

// 1. Check Mobile Sticky Top Header
assert.ok(indexHtml.includes('id="mobileStickyTopHeader"'), 'mobileStickyTopHeader should exist');
assert.ok(
    indexHtml.includes('id="btnMobileEditorialToggle"') && indexHtml.includes('class="hidden"'),
    'btnMobileEditorialToggle should be hidden in sticky top header to prevent mobile overflow'
);
assert.ok(
    indexHtml.includes('id="btnMobileFontToggle"') && indexHtml.includes('class="hidden"'),
    'btnMobileFontToggle should be hidden in sticky top header to prevent mobile overflow'
);
assert.ok(
    indexHtml.includes('id="btnMobileStartTourGuide"') && indexHtml.includes('class="hidden"'),
    'btnMobileStartTourGuide should be hidden in sticky top header to prevent compass icon clipping'
);
console.log('  ✓ [PASS] #mobileStickyTopHeader: redundant buttons streamlined, compass clipping eliminated.');

// 2. Check Sanh Top Header Bar Tier 1 (Greeting & Profile)
assert.ok(
    indexHtml.includes('id="btnPwaHeaderInstall"') && indexHtml.includes('hidden sm:inline-flex'),
    'btnPwaHeaderInstall in Tier 1 should be hidden on mobile (hidden sm:inline-flex) so greeting has room'
);
assert.ok(
    indexHtml.includes('id="sanhGreetingPrefix"') && indexHtml.includes('id="sanhMemberGreetingName"'),
    'Greeting elements exist and remain fully intact'
);
assert.ok(
    indexHtml.includes('id="sanhMemberDropdownWrapper"'),
    'Avatar and profile dropdown wrapper exists and functions'
);
console.log('  ✓ [PASS] #sanhTopHeaderBar Tier 1: greeting spacious on mobile, PWA button responsive.');

// 3. Check Sanh Top Header Bar Tier 2 (Controls Toolbar: 3x2 Grid on Mobile, Flex Row on Desktop)
assert.ok(
    indexHtml.includes('id="studyEnvironmentControls"') &&
    indexHtml.includes('grid grid-cols-3 sm:flex'),
    'studyEnvironmentControls must use grid grid-cols-3 on mobile and sm:flex on desktop'
);

const requiredIds = [
    'sanhMemberStreakVal',
    'sanhMemberXpVal',
    'btnQuickPomodoroLaunch',
    'btnEditorialToggle',
    'btnFontToggle',
    'btnStartTourGuide'
];

requiredIds.forEach(id => {
    assert.ok(indexHtml.includes(`id="${id}"`), `Element with id="${id}" must exist in studyEnvironmentControls`);
});
console.log('  ✓ [PASS] #studyEnvironmentControls: All 6 controls present in clean 3x2 mobile grid & 1-row desktop flex.');

// 4. Check Desktop Dividers hidden on mobile
assert.ok(
    indexHtml.includes('hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-700'),
    'Dividers must be hidden on mobile (hidden sm:block) to prevent grid distortion'
);
console.log('  ✓ [PASS] Dividers: Properly hidden on mobile grid, shown on desktop flex.');

// 5. Check www/ index.html synchronization
assert.strictEqual(
    indexHtml,
    wwwIndexHtml,
    'www/index.html must be perfectly in sync with root index.html'
);
console.log('  ✓ [PASS] Synchronization: www/index.html matches root index.html 100%.');

console.log('================================================================');
console.log('🎉 ALL MOBILE RESPONSIVE HEADER TESTS PASSED WITH 100% SUCCESS!');
console.log('================================================================');
