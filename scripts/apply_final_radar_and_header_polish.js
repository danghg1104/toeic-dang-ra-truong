const fs = require('fs');

// 1. Update index.html to add id to mobileStickyTopHeader
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('class="lg:hidden sticky top-1.5 z-30 mb-2.5 glass-panel')) {
    html = html.replace('class="lg:hidden sticky top-1.5 z-30 mb-2.5 glass-panel', 'id="mobileStickyTopHeader" class="lg:hidden sticky top-1.5 z-30 mb-2.5 glass-panel');
    console.log('✅ Added id mobileStickyTopHeader in index.html');
}

// Ensure mobileStickyTopHeader is hidden in workstation mode
const oldHideRule = 'body.in-workstation-mode #sanhTopHeaderBar,';
const newHideRule = 'body.in-workstation-mode #sanhTopHeaderBar,\n        body.in-workstation-mode #mobileStickyTopHeader,';
if (html.includes(oldHideRule) && !html.includes('body.in-workstation-mode #mobileStickyTopHeader,')) {
    html = html.replace(oldHideRule, newHideRule);
    console.log('✅ Added mobileStickyTopHeader to in-workstation-mode hide rules');
}

fs.writeFileSync('index.html', html, 'utf8');

// 2. Update js/roadmap-and-traps.js to clearly label Part 5 Grammar vs Part 5 Vocab
let rm = fs.readFileSync('js/roadmap-and-traps.js', 'utf8');
const oldLabel = '<h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">${g.name.split(\':\')[0]}</h4>';
const newLabel = '<h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">${g.id === \'gap-part5-grammar\' ? \'Part 5 (Ngữ pháp)\' : g.id === \'gap-part5-vocab\' ? \'Part 5 (Từ vựng)\' : g.name.split(\':\')[0]}</h4>';

if (rm.includes(oldLabel)) {
    rm = rm.replace(oldLabel, newLabel);
    fs.writeFileSync('js/roadmap-and-traps.js', rm, 'utf8');
    console.log('✅ Differentiated Part 5 (Ngữ pháp) and Part 5 (Từ vựng) in Weakness Radar');
} else {
    console.log('ℹ️ Old label was not found or already updated.');
}
