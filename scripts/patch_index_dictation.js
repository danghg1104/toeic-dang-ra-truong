const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add script tags after toeic-reading-workstation.js
const targetScript = '<script src="js/toeic-reading-workstation.js?v=2026-v1"></script>';
const replacementScript = `<script src="js/toeic-reading-workstation.js?v=2026-v1"></script>
    <script src="js/dailydictation-toeic-data.js?v=2026-v1"></script>
    <script src="js/dailydictation-workstation.js?v=2026-v1"></script>`;

if (!html.includes('dailydictation-workstation.js')) {
    html = html.replace(targetScript, replacementScript);
    console.log('✅ Added DailyDictation script tags.');
} else {
    console.log('DailyDictation script tags already present.');
}

// 2. Replace the old static content of view-nghe-chinh-ta
const sectionStartRegex = /<section id="view-nghe-chinh-ta"[\s\S]*?<\/section>/;
const newSection = `<section id="view-nghe-chinh-ta" class="hidden space-y-4 min-h-[700px]">
                <div id="dailyDictationContainer"></div>
            </section>`;

if (sectionStartRegex.test(html)) {
    html = html.replace(sectionStartRegex, newSection);
    console.log('✅ Replaced view-nghe-chinh-ta with DailyDictation workstation mount.');
} else {
    console.log('Could not find view-nghe-chinh-ta section.');
}

// 3. Update switchTab to render DailyDictationWorkstation
const oldSwitchSnippet = `if (tabId === 'luyen-nghe-chinh-ta' && typeof renderDictationWorkspace === 'function') {
                renderDictationWorkspace();
            }`;

const newSwitchSnippet = `if (tabId === 'nghe-chinh-ta' || tabId === 'luyen-nghe-chinh-ta') {
                if (window.DailyDictationWorkstation) {
                    window.DailyDictationWorkstation.renderInto('view-nghe-chinh-ta');
                }
            }`;

if (html.includes(oldSwitchSnippet)) {
    html = html.replace(oldSwitchSnippet, newSwitchSnippet);
    console.log('✅ Updated switchTab for DailyDictationWorkstation.');
} else {
    // Check with normalized line endings
    const normHtml = html.replace(/\r\n/g, '\n');
    const normTarget = oldSwitchSnippet.replace(/\r\n/g, '\n');
    if (normHtml.includes(normTarget)) {
        html = normHtml.replace(normTarget, newSwitchSnippet);
        console.log('✅ Updated switchTab with normalized line endings.');
    } else {
        console.log('Warning: could not find oldSwitchSnippet in switchTab.');
    }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Saved index.html successfully!');
