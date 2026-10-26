// scripts/update_workstation.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original size:', code.length);

// 1. Replace the massive old CURATED_FRONTEND_TOPIC_BANK
const startMarker = 'const CURATED_FRONTEND_TOPIC_BANK = {';
const endMarker = 'const SAMPLE_VOCAB_PRESETS = {';
const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `const CURATED_FRONTEND_TOPIC_BANK = (typeof window !== 'undefined' && window.CURATED_FRONTEND_TOPIC_BANK) 
        ? window.CURATED_FRONTEND_TOPIC_BANK 
        : {};\n\n    `;
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
  console.log('✅ Replaced CURATED_FRONTEND_TOPIC_BANK with dynamic reference to window.CURATED_FRONTEND_TOPIC_BANK');
} else {
  console.error('❌ Markers for CURATED_FRONTEND_TOPIC_BANK not found!');
  process.exit(1);
}

// 2. Update getCuratedWordsForTopicAndLevel
const oldGetCurated = `        getCuratedWordsForTopicAndLevel(topicName, level, count) {
            const normLevel = (level || 'A1').toUpperCase().replace('LEVEL ', '').trim();
            const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(normLevel) ? normLevel : 'A1';
            const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);

            const clean = (topicName || '').toLowerCase().trim();
            const cleanNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(clean) : clean;

            let topicData = null;
            for (const [key, data] of Object.entries(CURATED_FRONTEND_TOPIC_BANK)) {
                if (key === clean || key === cleanNorm) {
                    topicData = data;
                    break;
                }
                for (const alias of data.aliases) {
                    const aLower = alias.toLowerCase().trim();
                    const aNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(aLower) : aLower;
                    if (clean === aLower || cleanNorm === aNorm || clean.includes(aLower) || aLower.includes(clean) || cleanNorm.includes(aNorm) || aNorm.includes(cleanNorm)) {
                        topicData = data;
                        break;
                    }
                }
                if (topicData) break;
            }

            if (!topicData) topicData = CURATED_FRONTEND_TOPIC_BANK.technology;

            let pool = (topicData.words[validLevel] || []).slice();
            if (pool.length < targetCount) {
                const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                const curIdx = levels.indexOf(validLevel);
                const adjacent = [
                    levels[curIdx + 1],
                    levels[curIdx - 1],
                    levels[curIdx + 2],
                    levels[curIdx - 2],
                    levels[curIdx + 3],
                    levels[curIdx - 3]
                ].filter(Boolean);

                for (const adj of adjacent) {
                    if (topicData.words[adj]) {
                        pool = pool.concat(topicData.words[adj]);
                        if (pool.length >= targetCount) break;
                    }
                }
            }

            const shuffled = pool.slice().sort(() => 0.5 - Math.random());
            return shuffled.slice(0, targetCount);
        }`;

const newGetCurated = `        getCuratedWordsForTopicAndLevel(topicName, level, count) {
            const normLevel = (level || 'A1').toUpperCase().replace('LEVEL ', '').trim();
            const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(normLevel) ? normLevel : 'A1';
            const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);

            const bank = (typeof window !== 'undefined' && window.CURATED_FRONTEND_TOPIC_BANK) || CURATED_FRONTEND_TOPIC_BANK;
            const clean = (topicName || '').toLowerCase().trim();
            const cleanNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(clean) : clean;

            let topicData = null;
            for (const [key, data] of Object.entries(bank)) {
                if (key === clean || key === cleanNorm) {
                    topicData = data;
                    break;
                }
                if (Array.isArray(data.aliases)) {
                    for (const alias of data.aliases) {
                        const aLower = alias.toLowerCase().trim();
                        const aNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(aLower) : aLower;
                        if (clean === aLower || cleanNorm === aNorm || clean.includes(aLower) || aLower.includes(clean) || cleanNorm.includes(aNorm) || aNorm.includes(cleanNorm)) {
                            topicData = data;
                            break;
                        }
                    }
                }
                if (topicData) break;
            }

            if (!topicData) topicData = bank.technology || Object.values(bank)[0];

            const excludeSet = this.sessionUsedWords || new Set();
            let rawList = (topicData.words && topicData.words[validLevel]) || [];
            let pool = rawList.filter(item => !excludeSet.has(item.word.toLowerCase()));

            if (pool.length < targetCount) {
                const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                const curIdx = levels.indexOf(validLevel);
                const adjacent = [
                    levels[curIdx + 1],
                    levels[curIdx - 1],
                    levels[curIdx + 2],
                    levels[curIdx - 2],
                    levels[curIdx + 3],
                    levels[curIdx - 3]
                ].filter(Boolean);

                for (const adj of adjacent) {
                    if (topicData.words && topicData.words[adj]) {
                        const unused = topicData.words[adj].filter(item => !excludeSet.has(item.word.toLowerCase()));
                        pool = pool.concat(unused);
                        if (pool.length >= targetCount) break;
                    }
                }
            }

            if (pool.length === 0) {
                pool = rawList.slice();
            }

            const shuffled = pool.slice().sort(() => 0.5 - Math.random());
            return shuffled.slice(0, targetCount);
        }`;

if (code.includes(oldGetCurated)) {
  code = code.replace(oldGetCurated, newGetCurated);
  console.log('✅ Updated getCuratedWordsForTopicAndLevel');
} else {
  console.error('❌ Could not find exact oldGetCurated match');
  process.exit(1);
}

// 3. Update generateVocab to send excludeWords and prioritize freshList
const oldGenerateFetch = `                    body: JSON.stringify({
                        topic: this.selectedTopic,
                        level: this.selectedLevel,
                        count: this.selectedCount
                    })`;

const newGenerateFetch = `                    body: JSON.stringify({
                        topic: this.selectedTopic,
                        level: this.selectedLevel,
                        count: this.selectedCount,
                        excludeWords: Array.from(this.sessionUsedWords || [])
                    })`;

if (code.includes(oldGenerateFetch)) {
  code = code.replace(oldGenerateFetch, newGenerateFetch);
  console.log('✅ Updated generateVocab fetch payload to send excludeWords');
} else {
  console.error('❌ Could not find oldGenerateFetch');
  process.exit(1);
}

const oldFreshList = `                    // Lọc để đảm bảo TỪ MỚI 100% trong phiên học
                    const freshList = returnedWords.filter(item => !this.sessionUsedWords.has(item.word.toLowerCase()));
                    const pool = freshList.length >= Math.min(needed, 3) ? freshList : returnedWords;
                    this.wordList = pool.slice(0, needed);`;

const newFreshList = `                    // Lọc để đảm bảo TỪ MỚI 100% trong phiên học
                    const freshList = returnedWords.filter(item => !this.sessionUsedWords.has(item.word.toLowerCase()));
                    const pool = freshList.length >= needed ? freshList : (freshList.length > 0 ? freshList.concat(returnedWords.filter(w => !freshList.includes(w))) : returnedWords);
                    this.wordList = pool.slice(0, needed);`;

if (code.includes(oldFreshList)) {
  code = code.replace(oldFreshList, newFreshList);
  console.log('✅ Updated freshList pooling logic');
} else {
  console.error('❌ Could not find oldFreshList');
  process.exit(1);
}

// 4. Update loadScannedIntoGame to prioritize unlearned words
const oldScannedShuffle = `            // Lấy đúng số lượng từ theo thanh kéo slider hoặc input (this.scannedSelectedCount)
            const countToLearn = Math.min(Math.max(parseInt(this.scannedSelectedCount, 10) || 10, 1), candidates.length);
            const shuffled = [...candidates].sort(() => 0.5 - Math.random());
            this.wordList = shuffled.slice(0, countToLearn);`;

const newScannedShuffle = `            // Lấy đúng số lượng từ theo thanh kéo slider hoặc input (this.scannedSelectedCount)
            const countToLearn = Math.min(Math.max(parseInt(this.scannedSelectedCount, 10) || 10, 1), candidates.length);
            const excludeSet = this.sessionUsedWords || new Set();
            const unlearned = candidates.filter(w => !excludeSet.has(w.word.toLowerCase()));
            const pool = unlearned.length >= countToLearn ? unlearned : (unlearned.length > 0 ? unlearned.concat(candidates.filter(w => !unlearned.includes(w))) : candidates);
            const shuffled = [...pool].sort(() => 0.5 - Math.random());
            this.wordList = shuffled.slice(0, countToLearn);
            this.wordList.forEach(w => this.sessionUsedWords.add(w.word.toLowerCase()));`;

if (code.includes(oldScannedShuffle)) {
  code = code.replace(oldScannedShuffle, newScannedShuffle);
  console.log('✅ Updated loadScannedIntoGame to prioritize unlearned words');
} else {
  console.error('❌ Could not find oldScannedShuffle');
  process.exit(1);
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 Successfully updated js/vocab-game-workstation.js. New size:', code.length);
