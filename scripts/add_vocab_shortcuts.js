const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '..', 'js', 'vocabulary-module.js');
let code = fs.readFileSync(vocabFile, 'utf8');

const oldKeyBlock = `                } else if (e.key === '5') {
                    this.switchStudyTab('srs');
                }`;

const newKeyBlock = `                } else if (e.key === '5') {
                    this.switchStudyTab('srs');
                } else if (e.key === 'u' || e.key === 'U') {
                    const w = this.currentWords[this.currentWordIndex];
                    if (w) this.speakWord(w.word, 'US');
                } else if (e.key === 'k' || e.key === 'K') {
                    const w = this.currentWords[this.currentWordIndex];
                    if (w) this.speakWord(w.word, 'UK');
                } else if (e.key === 'm' || e.key === 'M') {
                    this.markMastered();
                } else if (e.key === 'x' || e.key === 'X') {
                    this.markUnmastered();
                }`;

if (code.includes(oldKeyBlock)) {
    code = code.replace(oldKeyBlock, newKeyBlock);
    fs.writeFileSync(vocabFile, code, 'utf8');
    console.log('✅ Đã bổ sung phím tắt Keyboard-First chuyên nghiệp vào Vocab Engine!');
} else {
    console.warn('⚠️ Không tìm thấy oldKeyBlock');
}
