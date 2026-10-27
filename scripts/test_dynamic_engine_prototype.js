const fs = require('fs');
const IPAHelper = require('../js/ipa-helper.js');

const DynamicTopicVocabEngine = {
    topicPoolCache: {},

    async translateTopicToEnglish(rawTopic) {
        if (!rawTopic) return 'technology';
        const clean = rawTopic.trim().toLowerCase();

        const TOPIC_PRESETS = {
            'công nghệ': 'technology',
            'du lịch': 'travel tourism',
            'kinh tế': 'business economy',
            'kinh tế & doanh nghiệp': 'business corporate',
            'thế giới totoro & ghibli': 'nature fantasy animation',
            'phim hoạt hình ghibli': 'nature fantasy animation',
            'phỏng vấn': 'job interview employment',
            'phỏng vấn xin việc': 'job interview employment',
            'giao tiếp': 'daily life conversation',
            'giao tiếp đời sống': 'daily life conversation',
            'ẩm thực': 'food dining cuisine restaurant',
            'công sở': 'workplace corporate office',
            'hàng không': 'aviation flight airline airplane',
            'bóng đá': 'football soccer sports',
            'vũ trụ': 'space astronomy universe galaxy',
            'y tế': 'medical healthcare doctor hospital medicine',
            'sức khỏe': 'health fitness wellness medicine',
            'giáo dục': 'education university school student',
            'môi trường': 'environment nature climate ecology',
            'thời trang': 'fashion clothing apparel style'
        };

        for (const [k, v] of Object.entries(TOPIC_PRESETS)) {
            if (clean === k || clean.includes(k) || k.includes(clean)) {
                return v;
            }
        }

        return clean;
    },

    async fetchWordsForTopic(englishTopic) {
        const cacheKey = englishTopic.toLowerCase().trim();
        if (this.topicPoolCache[cacheKey]) {
            return this.topicPoolCache[cacheKey];
        }

        try {
            const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(englishTopic)}&md=fpd&max=250`;
            const r = await fetch(url);
            if (!r.ok) throw new Error(`Datamuse HTTP ${r.status}`);
            const data = await r.json();
            if (Array.isArray(data) && data.length > 0) {
                this.topicPoolCache[cacheKey] = data;
                return data;
            }
        } catch (e) {
            console.warn('Datamuse API error:', e);
        }

        return [];
    },

    classifyWordsIntoCEFR(rawWordList) {
        const buckets = {
            A1: [],
            A2: [],
            B1: [],
            B2: [],
            C1: [],
            C2: []
        };

        const seen = new Set();

        for (const item of rawWordList) {
            if (!item || !item.word) continue;
            const w = item.word.trim().toLowerCase();
            if (!/^[a-zA-Z-]{3,22}$/.test(w) || seen.has(w)) continue;
            seen.add(w);

            let f = 5.0;
            if (Array.isArray(item.tags)) {
                for (const t of item.tags) {
                    if (typeof t === 'string' && t.startsWith('f:')) {
                        const val = parseFloat(t.substring(2));
                        if (!isNaN(val)) f = val;
                        break;
                    }
                }
            }

            let level = 'C2';
            if (f >= 30 && w.length <= 8) {
                level = 'A1';
            } else if (f >= 15) {
                level = 'A2';
            } else if (f >= 7) {
                level = 'B1';
            } else if (f >= 3) {
                level = 'B2';
            } else if (f >= 1) {
                level = 'C1';
            } else {
                level = 'C2';
            }

            buckets[level].push({
                word: w,
                score: item.score || 0,
                frequency: f,
                level: level,
                defs: item.defs || []
            });
        }

        return buckets;
    },

    selectNonRepeatingWords(buckets, requestedLevel, requestedCount, usedSet = new Set()) {
        const targetLevel = (requestedLevel || 'A2').toUpperCase().replace('LEVEL ', '').trim();
        const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(targetLevel) ? targetLevel : 'A2';
        const needed = Math.min(Math.max(parseInt(requestedCount, 10) || 10, 1), 50);

        const EXPANSION_ORDER = {
            A1: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
            A2: ['A2', 'A1', 'B1', 'B2', 'C1', 'C2'],
            B1: ['B1', 'A2', 'B2', 'A1', 'C1', 'C2'],
            B2: ['B2', 'B1', 'C1', 'A2', 'C2', 'A1'],
            C1: ['C1', 'B2', 'C2', 'B1', 'A2', 'A1'],
            C2: ['C2', 'C1', 'B2', 'B1', 'A2', 'A1']
        };

        let candidatePool = [];
        const levelsToScan = EXPANSION_ORDER[validLevel] || ['A2', 'B1', 'A1', 'B2', 'C1', 'C2'];
        for (const lvl of levelsToScan) {
            const list = buckets[lvl] || [];
            for (const item of list) {
                if (!candidatePool.some(x => x.word === item.word)) {
                    candidatePool.push(item);
                }
            }
        }

        let freshPool = candidatePool.filter(item => !usedSet.has(item.word.toLowerCase()));

        if (freshPool.length < needed) {
            usedSet.clear();
            freshPool = [...candidatePool];
        }

        const selected = freshPool.slice(0, needed);
        selected.forEach(item => usedSet.add(item.word.toLowerCase()));

        return { selected, usedSet };
    }
};

(async () => {
    console.log('Testing Dynamic Topic Engine for "Công nghệ" A2 (count: 10)...');
    const enTopic = await DynamicTopicVocabEngine.translateTopicToEnglish('Công nghệ');
    console.log('Translated topic:', enTopic);

    const rawWords = await DynamicTopicVocabEngine.fetchWordsForTopic(enTopic);
    console.log('Datamuse fetched words count:', rawWords.length);

    const buckets = DynamicTopicVocabEngine.classifyWordsIntoCEFR(rawWords);
    console.log('Distribution:');
    for (const [lvl, list] of Object.entries(buckets)) {
        console.log(`- ${lvl}: ${list.length} words (Sample: ${list.slice(0, 3).map(w => w.word).join(', ')})`);
    }

    // Run 1: 10 words
    const used = new Set();
    const r1 = DynamicTopicVocabEngine.selectNonRepeatingWords(buckets, 'A2', 10, used);
    console.log('\n--- Round 1 (10 words) ---');
    console.log(r1.selected.map(w => `${w.word} (${w.level}, f=${w.frequency})`).join(', '));

    // Run 2: Reset -> next 10 words (MUST BE COMPLETELY DIFFERENT)
    const r2 = DynamicTopicVocabEngine.selectNonRepeatingWords(buckets, 'A2', 10, r1.usedSet);
    console.log('\n--- Round 2 Reset (Next 10 words) ---');
    console.log(r2.selected.map(w => `${w.word} (${w.level}, f=${w.frequency})`).join(', '));

    const intersection = r1.selected.filter(w1 => r2.selected.some(w2 => w2.word === w1.word));
    console.log('\nDuplicate words between Round 1 and Round 2:', intersection.length === 0 ? '✅ 0 DUPLICATES (100% FRESH!)' : '❌ Duplicates found');

    // Run 3: 50 words in Hàng không (Aviation) C1
    console.log('\nTesting "Hàng không" (Aviation) C1 (count: 20)...');
    const avTopic = await DynamicTopicVocabEngine.translateTopicToEnglish('Hàng không');
    const avWords = await DynamicTopicVocabEngine.fetchWordsForTopic(avTopic);
    const avBuckets = DynamicTopicVocabEngine.classifyWordsIntoCEFR(avWords);
    const r3 = DynamicTopicVocabEngine.selectNonRepeatingWords(avBuckets, 'C1', 20, new Set());
    console.log(`Got ${r3.selected.length} words for Aviation C1:`);
    console.log(r3.selected.map(w => `${w.word} (${w.level})`).join(', '));
})();
