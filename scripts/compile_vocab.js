/**
 * COMPILER CHO js/vocab-decks-data.js
 * Kết hợp cả 6 nhóm chủ đề (48 bộ từ vựng, mỗi bộ 12 từ = 576 từ thực chiến)
 */
const fs = require('fs');

const g1 = require('./vocab_group1.js');
const g2 = require('./vocab_group2.js');
const g3 = require('./vocab_group3.js');
const g4 = require('./vocab_group4.js');
const g5 = require('./vocab_group5.js');
const g6 = require('./vocab_group6.js');

const allDecks = {
    ...g1,
    ...g2,
    ...g3,
    ...g4,
    ...g5,
    ...g6
};

const deckCount = Object.keys(allDecks).length;
let totalWords = 0;
for (let d in allDecks) {
    totalWords += allDecks[d].length;
}

const content = `/**
 * NGÂN HÀNG FLASHCARD TỪ VỰNG CHUYÊN SÂU — TOEIC & VSTEP
 * Chuẩn 6 Nhóm chủ đề, 48 Bộ từ vựng, hơn 576 từ vựng công sở & học thuật có phiên âm IPA,
 * dịch nghĩa tiếng Việt, câu ví dụ thực tế, collocations và mẹo ghi nhớ.
 */

window.vocabDecksDatabase = ${JSON.stringify(allDecks, null, 4)};
`;

fs.writeFileSync('./js/vocab-decks-data.js', content, 'utf8');
console.log(`✅ Compilation complete! Total decks: ${deckCount}, Total words: ${totalWords}`);
