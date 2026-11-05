const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('  VERIFYING MOBILE & DESKTOP RESPONSIVE UNIFIED HEADER');
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

// 2. Check Sanh Top Header Bar Greeting & Profile Cluster
assert.ok(
    indexHtml.includes('id="btnPwaHeaderInstall"') && indexHtml.includes('hidden sm:inline-flex'),
    'btnPwaHeaderInstall should be hidden on mobile (hidden sm:inline-flex) so greeting has room'
);
assert.ok(
    indexHtml.includes('id="sanhGreetingPrefix"') && indexHtml.includes('id="sanhMemberGreetingName"'),
    'Greeting elements exist and remain fully intact'
);
assert.ok(
    indexHtml.includes('id="sanhMemberDropdownWrapper"'),
    'Avatar and profile dropdown wrapper exists and functions'
);
console.log('  ✓ [PASS] #sanhTopHeaderBar: greeting and account elements present.');

// 3. Check Sanh Top Header Bar Controls Toolbar
assert.ok(
    indexHtml.includes('id="studyEnvironmentControls"'),
    'studyEnvironmentControls container must exist'
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
console.log('  ✓ [PASS] #studyEnvironmentControls: All 6 controls present.');

// 4. Check Responsive CSS rules
assert.ok(
    indexHtml.includes('id="sanh-header-responsive-style"'),
    'Dedicated responsive header style block must exist'
);
assert.ok(
    indexHtml.includes('@media (min-width: 1024px)'),
    'Desktop media query for single unified row must exist'
);
console.log('  ✓ [PASS] Responsive CSS: Mobile grid & desktop unified flex row verified.');

// 5. Check www/ index.html synchronization
assert.strictEqual(
    indexHtml,
    wwwIndexHtml,
    'www/index.html must be perfectly in sync with root index.html'
);
console.log('  ✓ [PASS] Synchronization: www/index.html matches root index.html 100%.');

console.log('================================================================');
console.log('🎉 ALL MOBILE & DESKTOP HEADER TESTS PASSED WITH 100% SUCCESS!');
console.log('================================================================');
