/**
 * =========================================================================
 * DICTIONARY PREPROCESSING & NLP PIPELINE (BROWSER RUNTIME)
 * =========================================================================
 * 1. Clean: Normalize whitespace, lowercasing, normalize punctuation & smart quotes.
 * 2. Compound & Segmentation Check: Viterbi / DP algorithm splitting stuck words (e.g. "headsofstate" -> "heads of state").
 * 3. Lemmatization / Stemming: Single words & multi-word phrases (e.g. "heads of state" -> "head of state", "running out of" -> "run out of", "matrices" -> "matrix").
 * 4. Fuzzy Search & Did-You-Mean: Levenshtein distance for typos.
 * =========================================================================
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.DictionaryPreprocess = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // 1. TỪ ĐIỂN CÁC TỪ THÔNG DỤNG PHỤC VỤ TÁCH TỪ (SEGMENTATION WORD BANK)
    const COMMON_WORDS_ARRAY = [
        // Giới từ, liên từ, mạo từ & từ chức năng
        'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
        'out', 'off', 'down', 'away', 'back', 'under', 'through', 'between', 'against', 'during', 'without', 'before', 'across',
        'and', 'or', 'but', 'so', 'as', 'if', 'than', 'then', 'not', 'no', 'all', 'any', 'each', 'every', 'both', 'few', 'more',
        'it', 'its', 'me', 'us', 'you', 'your', 'him', 'his', 'her', 'them', 'their', 'this', 'that', 'these', 'those',

        // Nouns, Verbs, Adjectives cốt lõi cho idioms, phrasal verbs, TOEIC/VSTEP
        'head', 'heads', 'state', 'states', 'leader', 'leaders', 'nation', 'nations', 'country', 'countries',
        'run', 'runs', 'running', 'ran', 'look', 'looks', 'looked', 'looking', 'forward',
        'carry', 'carries', 'carried', 'carrying', 'take', 'takes', 'took', 'taken', 'taking', 'care',
        'point', 'points', 'view', 'views', 'matter', 'matters', 'fact', 'facts', 'word', 'words', 'mouth', 'mouths',
        'rule', 'rules', 'thumb', 'thumbs', 'cost', 'costs', 'living', 'standard', 'standards',
        'break', 'breaks', 'broke', 'broken', 'breaking', 'part', 'time', 'full', 'job', 'jobs', 'market', 'markets',
        'real', 'estate', 'social', 'distancing', 'project', 'projects', 'manager', 'managers', 'management',
        'economic', 'economies', 'economy', 'economical', 'growth', 'develop', 'development',
        'compete', 'competes', 'competed', 'competing', 'competition', 'competitive', 'competitor', 'competitors',
        'apply', 'applies', 'applied', 'applying', 'application', 'applications', 'applicant', 'applicants',
        'require', 'requires', 'required', 'requiring', 'requirement', 'requirements',
        'contract', 'contracts', 'contractual', 'produce', 'produces', 'produced', 'producing', 'product', 'products',
        'production', 'productive', 'productivity', 'producer', 'producers',
        'negotiate', 'negotiates', 'negotiated', 'negotiating', 'negotiation', 'negotiations',
        'succeed', 'succeeds', 'succeeded', 'succeeding', 'success', 'successful', 'successfully',
        'hello', 'good', 'morning', 'afternoon', 'evening', 'night', 'hand', 'made', 'handmade', 'well', 'known',
        'high', 'tech', 'free', 'lance', 'freelance', 'overtime', 'understand', 'understanding', 'understood',
        'work', 'works', 'worked', 'working', 'worker', 'workers', 'workplace', 'force', 'business', 'trade',
        'company', 'companies', 'service', 'services', 'system', 'systems', 'customer', 'customers', 'client', 'clients',
        'sale', 'sales', 'price', 'prices', 'finance', 'financial', 'budget', 'budgets', 'report', 'reports',
        'meeting', 'meetings', 'office', 'offices', 'team', 'teams', 'staff', 'member', 'members',
        'policy', 'policies', 'strategy', 'strategies', 'plan', 'plans', 'secure', 'security',
        'data', 'base', 'database', 'soft', 'ware', 'software', 'hard', 'hardware', 'web', 'site', 'website',
        'matrix', 'matrices', 'criterion', 'criteria', 'phenomenon', 'phenomena', 'analysis', 'analyses',
        'crisis', 'crises', 'thesis', 'theses', 'alumnus', 'alumni', 'child', 'children', 'person', 'people',
        'foot', 'feet', 'tooth', 'teeth', 'man', 'men', 'woman', 'women', 'life', 'lives', 'leaf', 'leaves'
    ];

    const SEGMENTATION_WORD_SET = new Set(COMMON_WORDS_ARRAY);

    // 2. TỪ ĐIỂN LEMMAS BẤT QUY TẮC (IRREGULAR LEMMAS MAPPING)
    const IRREGULAR_NOUNS = {
        'matrices': { lemma: 'matrix', note: 'Danh từ số nhiều của "matrix"' },
        'criteria': { lemma: 'criterion', note: 'Danh từ số nhiều của "criterion"' },
        'phenomena': { lemma: 'phenomenon', note: 'Danh từ số nhiều của "phenomenon"' },
        'analyses': { lemma: 'analysis', note: 'Danh từ số nhiều của "analysis"' },
        'crises': { lemma: 'crisis', note: 'Danh từ số nhiều của "crisis"' },
        'theses': { lemma: 'thesis', note: 'Danh từ số nhiều của "thesis"' },
        'hypotheses': { lemma: 'hypothesis', note: 'Danh từ số nhiều của "hypothesis"' },
        'oases': { lemma: 'oasis', note: 'Danh từ số nhiều của "oasis"' },
        'alumni': { lemma: 'alumnus', note: 'Danh từ số nhiều của "alumnus"' },
        'bacteria': { lemma: 'bacterium', note: 'Danh từ số nhiều của "bacterium"' },
        'curricula': { lemma: 'curriculum', note: 'Danh từ số nhiều của "curriculum"' },
        'data': { lemma: 'datum', note: 'Danh từ số nhiều của "datum"' },
        'media': { lemma: 'medium', note: 'Danh từ số nhiều của "medium"' },
        'children': { lemma: 'child', note: 'Danh từ số nhiều của "child"' },
        'teeth': { lemma: 'tooth', note: 'Danh từ số nhiều của "tooth"' },
        'feet': { lemma: 'foot', note: 'Danh từ số nhiều của "foot"' },
        'men': { lemma: 'man', note: 'Danh từ số nhiều của "man"' },
        'women': { lemma: 'woman', note: 'Danh từ số nhiều của "woman"' },
        'people': { lemma: 'person', note: 'Danh từ số nhiều của "person"' },
        'mice': { lemma: 'mouse', note: 'Danh từ số nhiều của "mouse"' },
        'geese': { lemma: 'goose', note: 'Danh từ số nhiều của "goose"' },
        'oxen': { lemma: 'ox', note: 'Danh từ số nhiều của "ox"' },
        'leaves': { lemma: 'leaf', note: 'Danh từ số nhiều của "leaf"' },
        'lives': { lemma: 'life', note: 'Danh từ số nhiều của "life"' },
        'knives': { lemma: 'knife', note: 'Danh từ số nhiều của "knife"' },
        'wives': { lemma: 'wife', note: 'Danh từ số nhiều của "wife"' },
        'halves': { lemma: 'half', note: 'Danh từ số nhiều của "half"' },
        'shelves': { lemma: 'shelf', note: 'Danh từ số nhiều của "shelf"' },
        'wolves': { lemma: 'wolf', note: 'Danh từ số nhiều của "wolf"' },
        'thieves': { lemma: 'thief', note: 'Danh từ số nhiều của "thief"' }
    };

    const IRREGULAR_VERBS = {
        'went': { lemma: 'go', note: 'Quá khứ đơn của "go"' },
        'gone': { lemma: 'go', note: 'Quá khứ phân từ của "go"' },
        'came': { lemma: 'come', note: 'Quá khứ đơn của "come"' },
        'ran': { lemma: 'run', note: 'Quá khứ đơn của "run"' },
        'bought': { lemma: 'buy', note: 'Quá khứ / phân từ của "buy"' },
        'took': { lemma: 'take', note: 'Quá khứ đơn của "take"' },
        'taken': { lemma: 'take', note: 'Quá khứ phân từ của "take"' },
        'saw': { lemma: 'see', note: 'Quá khứ đơn của "see"' },
        'seen': { lemma: 'see', note: 'Quá khứ phân từ của "see"' },
        'wrote': { lemma: 'write', note: 'Quá khứ đơn của "write"' },
        'written': { lemma: 'write', note: 'Quá khứ phân từ của "write"' },
        'fell': { lemma: 'fall', note: 'Quá khứ đơn của "fall"' },
        'fallen': { lemma: 'fall', note: 'Quá khứ phân từ của "fall"' },
        'spoke': { lemma: 'speak', note: 'Quá khứ đơn của "speak"' },
        'spoken': { lemma: 'speak', note: 'Quá khứ phân từ của "speak"' },
        'built': { lemma: 'build', note: 'Quá khứ / phân từ của "build"' },
        'made': { lemma: 'make', note: 'Quá khứ / phân từ của "make"' },
        'paid': { lemma: 'pay', note: 'Quá khứ / phân từ của "pay"' },
        'met': { lemma: 'meet', note: 'Quá khứ / phân từ của "meet"' },
        'thought': { lemma: 'think', note: 'Quá khứ / phân từ của "think"' },
        'taught': { lemma: 'teach', note: 'Quá khứ / phân từ của "teach"' },
        'brought': { lemma: 'bring', note: 'Quá khứ / phân từ của "bring"' },
        'caught': { lemma: 'catch', note: 'Quá khứ / phân từ của "catch"' },
        'felt': { lemma: 'feel', note: 'Quá khứ / phân từ của "feel"' },
        'found': { lemma: 'find', note: 'Quá khứ / phân từ của "find"' },
        'gave': { lemma: 'give', note: 'Quá khứ đơn của "give"' },
        'given': { lemma: 'give', note: 'Quá khứ phân từ của "give"' },
        'got': { lemma: 'get', note: 'Quá khứ / phân từ của "get"' },
        'gotten': { lemma: 'get', note: 'Quá khứ phân từ của "get"' },
        'held': { lemma: 'hold', note: 'Quá khứ / phân từ của "hold"' },
        'kept': { lemma: 'keep', note: 'Quá khứ / phân từ của "keep"' },
        'knew': { lemma: 'know', note: 'Quá khứ đơn của "know"' },
        'known': { lemma: 'know', note: 'Quá khứ phân từ của "know"' },
        'led': { lemma: 'lead', note: 'Quá khứ / phân từ của "lead"' },
        'left': { lemma: 'leave', note: 'Quá khứ / phân từ của "leave"' },
        'lost': { lemma: 'lose', note: 'Quá khứ / phân từ của "lose"' },
        'said': { lemma: 'say', note: 'Quá khứ / phân từ của "say"' },
        'sent': { lemma: 'send', note: 'Quá khứ / phân từ của "send"' },
        'stood': { lemma: 'stand', note: 'Quá khứ / phân từ của "stand"' },
        'told': { lemma: 'tell', note: 'Quá khứ / phân từ của "tell"' },
        'understood': { lemma: 'understand', note: 'Quá khứ / phân từ của "understand"' },
        'won': { lemma: 'win', note: 'Quá khứ / phân từ của "win"' }
    };

    const IRREGULAR_ADJECTIVES = {
        'better': { lemma: 'good', note: 'Dạng so sánh hơn của "good / well"' },
        'best': { lemma: 'good', note: 'Dạng so sánh nhất của "good / well"' },
        'worse': { lemma: 'bad', note: 'Dạng so sánh hơn của "bad / badly"' },
        'worst': { lemma: 'bad', note: 'Dạng so sánh nhất của "bad / badly"' },
        'more': { lemma: 'much', note: 'Dạng so sánh hơn của "much / many"' },
        'most': { lemma: 'much', note: 'Dạng so sánh nhất của "much / many"' },
        'less': { lemma: 'little', note: 'Dạng so sánh hơn của "little"' },
        'least': { lemma: 'little', note: 'Dạng so sánh nhất của "little"' }
    };

    // Typo fix mapping
    const COMMON_TYPO_FIXES = {
        'recieve': 'receive',
        'recieved': 'received',
        'recieving': 'receiving',
        'negociate': 'negotiate',
        'negociated': 'negotiated',
        'negociation': 'negotiation',
        'managment': 'management',
        'seperate': 'separate',
        'occured': 'occurred',
        'untill': 'until',
        'calender': 'calendar',
        'definitly': 'definitely',
        'goverment': 'government',
        'enviroment': 'environment',
        'sucess': 'success',
        'sucessful': 'successful'
    };

    // =========================================================================
    // PIPELINE API METHODS
    // =========================================================================

    /**
     * 1. Clean: Cắt khoảng trắng đầu/cuối, chuyển về lowercase, chuẩn hóa dấu câu.
     */
    function clean(rawInput) {
        if (!rawInput || typeof rawInput !== 'string') return '';
        return rawInput
            .trim()
            .toLowerCase()
            .normalize('NFC')
            .replace(/[‘’´`]/g, "'") // Chuẩn hóa smart apostrophes
            .replace(/[“”]/g, '"')
            .replace(/\s+/g, ' ');   // Gộp khoảng trắng thừa
    }

    /**
     * 2. Compound & Segmentation Check:
     * Nhận diện từ dính liền nếu query không có khoảng trắng, độ dài >= 6 ký tự
     * và không có trong từ điển đơn lẻ.
     * Sử dụng Dynamic Programming (Viterbi word-break) với scoring tối ưu.
     */
    function segmentJoinedWords(inputStr, customWordSet = null) {
        const cleaned = clean(inputStr);
        if (!cleaned || cleaned.includes(' ') || cleaned.length < 6) {
            return {
                isSegmented: false,
                original: inputStr,
                segmented: cleaned,
                tokens: cleaned ? [cleaned] : []
            };
        }

        // Loại bỏ ký tự đặc biệt ngoài chữ cái để kiểm tra phân đoạn
        const alphaOnly = cleaned.replace(/[^a-z]/g, '');
        if (alphaOnly.length < 6) {
            return {
                isSegmented: false,
                original: inputStr,
                segmented: cleaned,
                tokens: [cleaned]
            };
        }

        const wordSet = customWordSet || SEGMENTATION_WORD_SET;
        const n = alphaOnly.length;
        const dp = Array(n + 1).fill(null);
        const score = Array(n + 1).fill(-Infinity);

        dp[0] = [];
        score[0] = 0;

        for (let i = 0; i < n; i++) {
            if (dp[i] === null) continue;

            for (let j = i + 1; j <= n; j++) {
                const word = alphaOnly.slice(i, j);
                if (wordSet.has(word)) {
                    // Trọng số: ưu tiên từ dài, phạt từ 1 chữ cái nếu không phải 'a'
                    let wordScore = word.length * 2.5;
                    if (word.length === 1 && word !== 'a') wordScore -= 12;

                    // Thưởng nếu kết hợp tạo thành cụm từ tự nhiên (vd: giới từ đứng giữa 2 danh từ)
                    const prevWord = dp[i].length > 0 ? dp[i][dp[i].length - 1] : null;
                    if (['of', 'in', 'on', 'at', 'to', 'for', 'with', 'out', 'up'].includes(word) && prevWord) {
                        wordScore += 4;
                    }

                    const newScore = score[i] + wordScore - 2; // Chi phí chia từ
                    if (newScore > score[j]) {
                        score[j] = newScore;
                        dp[j] = [...dp[i], word];
                    }
                }
            }
        }

        const tokens = dp[n];
        // Chỉ chấp nhận phân đoạn nếu chia thành 2 từ trở lên và mỗi từ đều có ý nghĩa
        if (tokens && tokens.length > 1) {
            const segmentedStr = tokens.join(' ');
            return {
                isSegmented: true,
                original: inputStr,
                segmented: segmentedStr,
                tokens: tokens
            };
        }

        return {
            isSegmented: false,
            original: inputStr,
            segmented: cleaned,
            tokens: [cleaned]
        };
    }

    /**
     * 3. Lemmatization / Stemming:
     * Hỗ trợ cả từ đơn và cụm từ phức hợp (Phrasal Verbs, Noun + prep + Noun).
     */
    function lemmatize(queryStr) {
        const cleaned = clean(queryStr);
        if (!cleaned) return { lemma: '', isLemma: false, note: '' };

        // 3.1. Cụm từ có khoảng trắng (Multi-word phrase)
        if (cleaned.includes(' ')) {
            const tokens = cleaned.split(' ');

            // Dạng Noun + Preposition + Noun: "heads of state" -> "head of state"
            if (tokens.length >= 3 && ['of', 'in', 'at'].includes(tokens[1])) {
                const headNoun = tokens[0];
                const singleHead = lemmatizeSingleWord(headNoun);
                if (singleHead.isLemma) {
                    const phraseLemma = [singleHead.lemma, ...tokens.slice(1)].join(' ');
                    return {
                        lemma: phraseLemma,
                        isLemma: true,
                        rootForm: phraseLemma,
                        searchedQuery: cleaned,
                        note: `Dạng số nhiều của cụm danh từ "${phraseLemma}"`
                    };
                }
            }

            // Dạng Phrasal Verb: Động từ chia thì đứng đầu cụm (vd: "running out of" -> "run out of", "carried out" -> "carry out")
            const firstWord = tokens[0];
            const verbLemma = lemmatizeSingleWord(firstWord);
            if (verbLemma.isLemma) {
                const phraseLemma = [verbLemma.lemma, ...tokens.slice(1)].join(' ');
                return {
                    lemma: phraseLemma,
                    isLemma: true,
                    rootForm: phraseLemma,
                    searchedQuery: cleaned,
                    note: `${verbLemma.note} trong cụm "${phraseLemma}"`
                };
            }

            return {
                lemma: cleaned,
                isLemma: false,
                rootForm: cleaned,
                note: ''
            };
        }

        // 3.2. Từ đơn (Single word)
        const singleResult = lemmatizeSingleWord(cleaned);
        return {
            ...singleResult,
            rootForm: singleResult.lemma,
            searchedQuery: cleaned
        };
    }

    /**
     * Helper: Lemmatize từ đơn lẻ
     */
    function lemmatizeSingleWord(word) {
        if (!word) return { lemma: '', isLemma: false, note: '' };

        // Tra cứu bảng bất quy tắc
        if (IRREGULAR_NOUNS[word]) {
            return { lemma: IRREGULAR_NOUNS[word].lemma, isLemma: true, note: IRREGULAR_NOUNS[word].note };
        }
        if (IRREGULAR_VERBS[word]) {
            return { lemma: IRREGULAR_VERBS[word].lemma, isLemma: true, note: IRREGULAR_VERBS[word].note };
        }
        if (IRREGULAR_ADJECTIVES[word]) {
            return { lemma: IRREGULAR_ADJECTIVES[word].lemma, isLemma: true, note: IRREGULAR_ADJECTIVES[word].note };
        }

        // Quy tắc biến thể số nhiều / thì động từ thông dụng
        // -ies -> -y (economies -> economy, categories -> category)
        if (word.endsWith('ies') && word.length > 5) {
            const base = word.slice(0, -3) + 'y';
            return { lemma: base, isLemma: true, note: `Dạng số nhiều / ngôi thứ 3 của "${base}"` };
        }

        // -ves -> -f hoặc -fe (leaves -> leaf, lives -> life)
        if (word.endsWith('ves') && word.length > 5) {
            const baseF = word.slice(0, -3) + 'f';
            return { lemma: baseF, isLemma: true, note: `Dạng số nhiều của "${baseF}"` };
        }

        // -ying -> -ie (tying -> tie, lying -> lie)
        if (word.endsWith('ying') && word.length >= 5) {
            const base = word.slice(0, -4) + 'ie';
            return { lemma: base, isLemma: true, note: `Dạng V-ing của "${base}"` };
        }

        // -ing -> -e hoặc nguyên thể (managing -> manage, negotiating -> negotiate, running -> run)
        if (word.endsWith('ing') && word.length > 5) {
            const trimmed = word.slice(0, -3);
            // Gấp đôi phụ âm: running -> run, swimming -> swim
            if (trimmed.length >= 3 && trimmed[trimmed.length - 1] === trimmed[trimmed.length - 2]) {
                const singleC = trimmed.slice(0, -1);
                return { lemma: singleC, isLemma: true, note: `Dạng V-ing của "${singleC}"` };
            }
            // Thêm đuôi 'e': managing -> manage, competing -> compete
            const withE = trimmed + 'e';
            return { lemma: withE, isLemma: true, note: `Dạng V-ing của "${withE}" / "${trimmed}"` };
        }

        // -ied -> -y (carried -> carry, applied -> apply)
        if (word.endsWith('ied') && word.length > 5) {
            const base = word.slice(0, -3) + 'y';
            return { lemma: base, isLemma: true, note: `Dạng quá khứ / phân từ của "${base}"` };
        }

        // -ed -> -e hoặc nguyên thể (managed -> manage, required -> require, carried -> carry)
        if (word.endsWith('ed') && word.length > 4) {
            const c1 = word.slice(0, -2); // e.g. walk
            const c2 = word.slice(0, -1); // e.g. manage
            return { lemma: c2, isLemma: true, note: `Dạng quá khứ / phân từ của "${c2}"` };
        }

        // -es -> nguyên thể (boxes -> box, processes -> process)
        if (word.endsWith('es') && word.length > 4) {
            const base = word.slice(0, -2);
            return { lemma: base, isLemma: true, note: `Dạng số nhiều / ngôi thứ 3 của "${base}"` };
        }

        // -s -> nguyên thể (heads -> head, requirements -> requirement, contracts -> contract)
        if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) {
            const base = word.slice(0, -1);
            return { lemma: base, isLemma: true, note: `Dạng số nhiều / số ít của "${base}"` };
        }

        return { lemma: word, isLemma: false, note: '' };
    }

    /**
     * 4. Tính khoảng cách Levenshtein (Damerau-Levenshtein)
     */
    function calcLevenshtein(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;

        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // Thay thế
                        Math.min(
                            matrix[i][j - 1] + 1,     // Chèn
                            matrix[i - 1][j] + 1      // Xóa
                        )
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    /**
     * 4b. Fuzzy Search & Did-You-Mean Suggestions:
     * Trả về danh sách 3-5 từ gợi ý gần nhất thay vì màn hình trống.
     */
    function findFuzzySuggestions(rawQuery, wordPool = []) {
        const cleaned = clean(rawQuery);
        if (!cleaned) return [];

        // Kiểm tra typo trực tiếp
        if (COMMON_TYPO_FIXES[cleaned]) {
            return [COMMON_TYPO_FIXES[cleaned]];
        }

        const candidatePool = Array.isArray(wordPool) && wordPool.length > 0 ? wordPool : COMMON_WORDS_ARRAY;
        const scored = [];

        for (const candidate of candidatePool) {
            const candClean = clean(candidate);
            if (!candClean || candClean === cleaned) continue;

            const dist = calcLevenshtein(cleaned, candClean);
            // Giới hạn khoảng cách: <= 2 với từ ngắn (<8), <= 3 với từ dài
            const maxAllowed = cleaned.length >= 8 ? 3 : 2;
            if (dist <= maxAllowed && dist < cleaned.length) {
                scored.push({ word: candidate, dist });
            }
        }

        scored.sort((a, b) => a.dist - b.dist);
        return Array.from(new Set(scored.map(s => s.word))).slice(0, 5);
    }

    /**
     * Pipeline Wrapper: Tiền xử lý toàn diện một query
     */
    function processInput(rawQuery, customLexiconSet = null) {
        const cleaned = clean(rawQuery);

        // 1. Kiểm tra từ dính liền
        const seg = segmentJoinedWords(cleaned, customLexiconSet);
        const queryToLemmatize = seg.isSegmented ? seg.segmented : cleaned;

        // 2. Lemmatization
        const lem = lemmatize(queryToLemmatize);

        return {
            raw: rawQuery,
            cleaned: cleaned,
            isSegmented: seg.isSegmented,
            segmented: seg.segmented,
            isLemma: lem.isLemma,
            lemma: lem.lemma,
            note: lem.note,
            canonicalQuery: lem.lemma || seg.segmented || cleaned
        };
    }

    return {
        clean,
        segmentJoinedWords,
        lemmatize,
        lemmatizeSingleWord,
        calcLevenshtein,
        findFuzzySuggestions,
        processInput,
        COMMON_WORDS_ARRAY,
        IRREGULAR_NOUNS,
        IRREGULAR_VERBS,
        IRREGULAR_ADJECTIVES,
        COMMON_TYPO_FIXES
    };
}));
