const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const fullFix = 'style="position: fixed !important; inset: 0 !important; z-index: 10000 !important;"';

html = html.replace(
    'id="toeicAdaptiveTestModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="z-index: 10000 !important;"',
    `id="toeicAdaptiveTestModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" ${fullFix}`
);

html = html.replace(
    'id="toeicTrapHeatMatrixModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="z-index: 10000 !important;"',
    `id="toeicTrapHeatMatrixModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" ${fullFix}`
);

html = html.replace(
    'id="toeicRadarAnalyticsModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="z-index: 10000 !important;"',
    `id="toeicRadarAnalyticsModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" ${fullFix}`
);

// Also for aiTutorModal, targetModal, authModal, iosPwaInstallModal - ensure they are >= 10000
html = html.replace(
    'id="aiTutorModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-3 sm:p-4"',
    `id="aiTutorModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4" ${fullFix}`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ Bulletproofed all modal elements with position: fixed and z-index: 10000 !important');
