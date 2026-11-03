const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const modalIds = [
  'toeicAdaptiveTestModal',
  'toeicTrapHeatMatrixModal',
  'toeicRadarAnalyticsModal',
  'toeicCapsuleStationModal',
  'toeicTinderFlashcardModal',
  'toeicAuthenticDocumentModal',
  'toeicCheatSheetModal',
  'pomodoroHudModal',
  'aiTutorModal',
  'targetModal',
  'authModal',
  'iosPwaInstallModal'
];

for (const id of modalIds) {
    const s = html.indexOf(`id="${id}"`);
    if (s !== -1) {
        const tag = html.slice(s - 10, html.indexOf('>', s) + 1);
        console.log(`[${id}]:`, tag);
    } else {
        console.log(`[${id}]: NOT FOUND IN HTML`);
    }
}
