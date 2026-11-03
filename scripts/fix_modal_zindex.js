const fs = require('fs');

console.log('=== FIXING MODAL Z-INDEX (FLASHCARD, AUTHENTIC DOC, CHEAT SHEET, ETC.) ===');
let html = fs.readFileSync('index.html', 'utf8');

// 1. UPDATE CSS SELECTOR IN <style>
const oldCssBlock = `        /* Workstations, Test & Practice Modals: Phải luôn có z-index tối thượng (10000) đè lên toàn bộ Header, Dashboard và Sidebar */
        #toeicDiagnosticWorkstation,
        #toeicListeningWorkstation,
        #toeicReadingWorkstation,
        #fullPartPracticeModal,
        #diagResultModal,
        #aiTutorModal,
        #vgFlashcardModal,
        #toeicRadarAnalyticsModal,
        #toeicTrapHeatMatrixModal,
        #toeicAdaptiveTestModal,
        #toeicCapsuleStationModal,
        #tinderFlashcardModal,
        #authenticDocumentModal,
        #onePageCheatSheetModal,
        .workstation-fullscreen-modal {
            z-index: 10000 !important;
        }`;

const newCssBlock = `        /* Workstations, Test & Practice Modals: Phải luôn có z-index tối thượng (10000) đè lên toàn bộ Header, Dashboard và Sidebar */
        #toeicDiagnosticWorkstation,
        #toeicListeningWorkstation,
        #toeicReadingWorkstation,
        #fullPartPracticeModal,
        #diagResultModal,
        #aiTutorModal,
        #vgFlashcardModal,
        #toeicRadarAnalyticsModal,
        #toeicTrapHeatMatrixModal,
        #toeicAdaptiveTestModal,
        #toeicCapsuleStationModal,
        #toeicTinderFlashcardModal,
        #tinderFlashcardModal,
        #toeicAuthenticDocumentModal,
        #authenticDocumentModal,
        #toeicCheatSheetModal,
        #onePageCheatSheetModal,
        #pomodoroHudModal,
        .workstation-fullscreen-modal {
            position: fixed !important;
            inset: 0 !important;
            z-index: 10000 !important;
        }`;

if (html.includes(oldCssBlock)) {
    html = html.replace(oldCssBlock, newCssBlock);
    console.log('✅ Updated modal CSS selectors to include #toeicTinderFlashcardModal and others with position: fixed and z-index: 10000 !important');
} else {
    console.log('⚠️ oldCssBlock exact match not found, inspecting marker');
}

// 2. ADD INLINE STYLES DIRECTLY TO MODAL HTML ELEMENTS TO PREVENT ANY TAILWIND MISSING UTILITY ISSUES
const modalReplacements = [
    {
        old: 'id="toeicTinderFlashcardModal" class="hidden fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"',
        new: 'id="toeicTinderFlashcardModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="position: fixed !important; inset: 0 !important; z-index: 10000 !important;"'
    },
    {
        old: 'id="toeicAuthenticDocumentModal" class="hidden fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"',
        new: 'id="toeicAuthenticDocumentModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="position: fixed !important; inset: 0 !important; z-index: 10000 !important;"'
    },
    {
        old: 'id="toeicCheatSheetModal" class="hidden fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"',
        new: 'id="toeicCheatSheetModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="position: fixed !important; inset: 0 !important; z-index: 10000 !important;"'
    },
    {
        old: 'id="toeicCapsuleStationModal" class="hidden fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"',
        new: 'id="toeicCapsuleStationModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="position: fixed !important; inset: 0 !important; z-index: 10000 !important;"'
    },
    {
        old: 'id="pomodoroHudModal" class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[9990] hidden items-center justify-center p-3 sm:p-4 animate-fadeIn"',
        new: 'id="pomodoroHudModal" class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 animate-fadeIn" style="position: fixed !important; inset: 0 !important; z-index: 10000 !important;"'
    }
];

for (const rep of modalReplacements) {
    if (html.includes(rep.old)) {
        html = html.replace(rep.old, rep.new);
        console.log(`✅ Added explicit inline z-index: 10000 to ${rep.old.slice(0, 35)}`);
    } else {
        console.log(`ℹ️ Could not find exact match for: ${rep.old.slice(0, 35)}`);
    }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('🎉 index.html modal z-index fix complete!');
