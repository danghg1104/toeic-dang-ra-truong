const fs = require('fs');
const content = fs.readFileSync('js/youtube-dictation-workstation.js', 'utf8');

// Verify that the code contains the smart auto-advance on loop:
const hasRepeatCount = content.includes('this.lineRepeatCount = 1');
const hasAutoAdvance = content.includes('TỰ ĐỘNG TUA QUA CÂU MỚI');
const hasCycleText = content.includes('Lặp 1 lần rồi chuyển tiếp');

console.log('✓ hasRepeatCount:', hasRepeatCount);
console.log('✓ hasAutoAdvance:', hasAutoAdvance);
console.log('✓ hasCycleText:', hasCycleText);
