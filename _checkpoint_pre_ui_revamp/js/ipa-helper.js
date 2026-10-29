/**
 * =========================================================================
 * ISOMORPHIC IPA PHONETIC TRANSCRIBER & HELPER
 * =========================================================================
 * Provides accurate International Phonetic Alphabet (IPA) transcriptions
 * for English words, phrases, idioms, and compound expressions.
 * 
 * Supports:
 * 1. Rich lexicon of common English words & function words with US/UK variants.
 * 2. Multi-word phrase tokenization and prosodic stress assignment:
 *    e.g. "head of state meeting" -> "/ˌhed əv ˈsteɪt ˈmiː.tɪŋ/"
 * 3. Grapheme-to-Phoneme (G2P) rule-based synthesizer for unknown words
 *    guaranteeing standard phonetic symbols (zero raw underscores or glitch strings).
 * =========================================================================
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.IPAHelper = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // 1. TỪ ĐIỂN PHIÊN ÂM IPA CÁC TỪ THÔNG DỤNG (US & UK)
    const PHONETIC_LEXICON = {
        // Function words & prepositions
        'a': { us: 'ə', uk: 'ə' },
        'an': { us: 'ən', uk: 'ən' },
        'the': { us: 'ðə', uk: 'ðə' },
        'of': { us: 'əv', uk: 'əv' },
        'to': { us: 'tuː', uk: 'tuː' },
        'in': { us: 'ɪn', uk: 'ɪn' },
        'on': { us: 'ɒn', uk: 'ɒn' },
        'at': { us: 'æt', uk: 'æt' },
        'for': { us: 'fɔːr', uk: 'fɔː' },
        'with': { us: 'wɪð', uk: 'wɪð' },
        'by': { us: 'baɪ', uk: 'baɪ' },
        'from': { us: 'frʌm', uk: 'frɒm' },
        'up': { us: 'ʌp', uk: 'ʌp' },
        'down': { us: 'daʊn', uk: 'daʊn' },
        'out': { us: 'aʊt', uk: 'aʊt' },
        'off': { us: 'ɔːf', uk: 'ɒf' },
        'over': { us: 'ˈoʊvər', uk: 'ˈəʊvə' },
        'under': { us: 'ˈʌndər', uk: 'ˈʌndə' },
        'after': { us: 'ˈæftər', uk: 'ˈɑːftə' },
        'before': { us: 'bɪˈfɔːr', uk: 'bɪˈfɔː' },
        'between': { us: 'bɪˈtwiːn', uk: 'bɪˈtwiːn' },
        'through': { us: 'θruː', uk: 'θruː' },
        'during': { us: 'ˈdʊrɪŋ', uk: 'ˈdjʊərɪŋ' },
        'without': { us: 'wɪˈðaʊt', uk: 'wɪˈðaʊt' },
        'against': { us: 'əˈɡenst', uk: 'əˈɡenst' },
        'about': { us: 'əˈbaʊt', uk: 'əˈbaʊt' },
        'into': { us: 'ˈɪntuː', uk: 'ˈɪntuː' },
        'away': { us: 'əˈweɪ', uk: 'əˈweɪ' },
        'back': { us: 'bæk', uk: 'bæk' },

        // Pronouns & Auxiliaries
        'i': { us: 'aɪ', uk: 'aɪ' },
        'you': { us: 'juː', uk: 'juː' },
        'he': { us: 'hiː', uk: 'hiː' },
        'she': { us: 'ʃiː', uk: 'ʃiː' },
        'it': { us: 'ɪt', uk: 'ɪt' },
        'we': { us: 'wiː', uk: 'wiː' },
        'they': { us: 'ðeɪ', uk: 'ðeɪ' },
        'me': { us: 'miː', uk: 'miː' },
        'him': { us: 'hɪm', uk: 'hɪm' },
        'her': { us: 'hɜːr', uk: 'hɜː' },
        'us': { us: 'ʌs', uk: 'ʌs' },
        'them': { us: 'ðem', uk: 'ðem' },
        'is': { us: 'ɪz', uk: 'ɪz' },
        'am': { us: 'æm', uk: 'æm' },
        'are': { us: 'ɑːr', uk: 'ɑː' },
        'was': { us: 'wʌz', uk: 'wɒz' },
        'were': { us: 'wɜːr', uk: 'wɜː' },
        'be': { us: 'biː', uk: 'biː' },
        'been': { us: 'bɪn', uk: 'biːn' },
        'being': { us: 'ˈbiːɪŋ', uk: 'ˈbiːɪŋ' },
        'have': { us: 'hæv', uk: 'hæv' },
        'has': { us: 'hæz', uk: 'hæz' },
        'had': { us: 'hæd', uk: 'hæd' },
        'do': { us: 'duː', uk: 'duː' },
        'does': { us: 'dʌz', uk: 'dʌz' },
        'did': { us: 'dɪd', uk: 'dɪd' },
        'will': { us: 'wɪl', uk: 'wɪl' },
        'would': { us: 'wʊd', uk: 'wʊd' },
        'can': { us: 'kæn', uk: 'kæn' },
        'could': { us: 'kʊd', uk: 'kʊd' },
        'should': { us: 'ʃʊd', uk: 'ʃʊd' },
        'may': { us: 'meɪ', uk: 'meɪ' },
        'might': { us: 'maɪt', uk: 'maɪt' },
        'must': { us: 'mʌst', uk: 'mʌst' },

        // Common Nouns, Verbs, Adjectives & Phrase components
        'head': { us: 'hed', uk: 'hed' },
        'heads': { us: 'hedz', uk: 'hedz' },
        'state': { us: 'steɪt', uk: 'steɪt' },
        'states': { us: 'steɪts', uk: 'steɪts' },
        'meeting': { us: 'ˈmiːtɪŋ', uk: 'ˈmiː.tɪŋ' },
        'meetings': { us: 'ˈmiːtɪŋz', uk: 'ˈmiː.tɪŋz' },
        'conference': { us: 'ˈkɑːnfərəns', uk: 'ˈkɒnfərəns' },
        'summit': { us: 'ˈsʌmɪt', uk: 'ˈsʌmɪt' },
        'council': { us: 'ˈkaʊnsl', uk: 'ˈkaʊnsl' },
        'leader': { us: 'ˈliːdər', uk: 'ˈliːdə' },
        'leaders': { us: 'ˈliːdərz', uk: 'ˈliːdəz' },
        'government': { us: 'ˈɡʌvərnmənt', uk: 'ˈɡʌvənmənt' },
        'nation': { us: 'ˈneɪʃn', uk: 'ˈneɪʃn' },
        'nations': { us: 'ˈneɪʃnz', uk: 'ˈneɪʃnz' },
        'country': { us: 'ˈkʌntri', uk: 'ˈkʌntri' },
        'countries': { us: 'ˈkʌntriz', uk: 'ˈkʌntriz' },
        'world': { us: 'wɜːrld', uk: 'wɜːld' },
        'run': { us: 'rʌn', uk: 'rʌn' },
        'running': { us: 'ˈrʌnɪŋ', uk: 'ˈrʌnɪŋ' },
        'ran': { us: 'ræn', uk: 'ræn' },
        'carry': { us: 'ˈkæri', uk: 'ˈkæri' },
        'carried': { us: 'ˈkærid', uk: 'ˈkærid' },
        'carrying': { us: 'ˈkæriɪŋ', uk: 'ˈkæriɪŋ' },
        'look': { us: 'lʊk', uk: 'lʊk' },
        'looking': { us: 'ˈlʊkɪŋ', uk: 'ˈlʊkɪŋ' },
        'looked': { us: 'lʊkt', uk: 'lʊkt' },
        'forward': { us: 'ˈfɔːrwərd', uk: 'ˈfɔːwəd' },
        'charge': { us: 'tʃɑːrdʒ', uk: 'tʃɑːdʒ' },
        'take': { us: 'teɪk', uk: 'teɪk' },
        'taking': { us: 'ˈteɪkɪŋ', uk: 'ˈteɪkɪŋ' },
        'took': { us: 'tʊk', uk: 'tʊk' },
        'taken': { us: 'ˈteɪkən', uk: 'ˈteɪkən' },
        'care': { us: 'ker', uk: 'keər' },
        'point': { us: 'pɔɪnt', uk: 'pɔɪnt' },
        'view': { us: 'vjuː', uk: 'vjuː' },
        'views': { us: 'vjuːz', uk: 'vjuːz' },
        'cost': { us: 'kɔːst', uk: 'kɒst' },
        'costs': { us: 'kɔːsts', uk: 'kɒsts' },
        'living': { us: 'ˈlɪvɪŋ', uk: 'ˈlɪvɪŋ' },
        'life': { us: 'laɪf', uk: 'laɪf' },
        'time': { us: 'taɪm', uk: 'taɪm' },
        'year': { us: 'jɪr', uk: 'jɪə' },
        'day': { us: 'deɪ', uk: 'deɪ' },
        'man': { us: 'mæn', uk: 'mæn' },
        'men': { us: 'men', uk: 'men' },
        'woman': { us: 'ˈwʊmən', uk: 'ˈwʊmən' },
        'women': { us: 'ˈwɪmɪn', uk: 'ˈwɪmɪn' },
        'child': { us: 'tʃaɪld', uk: 'tʃaɪld' },
        'children': { us: 'ˈtʃɪldrən', uk: 'ˈtʃɪldrən' },
        'person': { us: 'ˈpɜːrsn', uk: 'ˈpɜːsn' },
        'people': { us: 'ˈpiːpl', uk: 'ˈpiːpl' },
        'matrix': { us: 'ˈmeɪtrɪks', uk: 'ˈmeɪtrɪks' },
        'matrices': { us: 'ˈmeɪtrɪsiːz', uk: 'ˈmeɪtrɪsiːz' },
        'analysis': { us: 'əˈnæləsɪs', uk: 'əˈnæləsɪs' },
        'analyses': { us: 'əˈnæləsiːz', uk: 'əˈnæləsiːz' },
        'criterion': { us: 'kraɪˈtɪriən', uk: 'kraɪˈtɪəriən' },
        'criteria': { us: 'kraɪˈtɪriə', uk: 'kraɪˈtɪəriə' },
        'schedule': { us: 'ˈskedʒuːl', uk: 'ˈʃedjuːl' },
        'scheduled': { us: 'ˈskedʒuːld', uk: 'ˈʃedjuːld' },
        'tomato': { us: 'təˈmeɪtoʊ', uk: 'təˈmɑːtəʊ' },
        'water': { us: 'ˈwɔːtər', uk: 'ˈwɔːtə' },
        'business': { us: 'ˈbɪznəs', uk: 'ˈbɪznəs' },
        'service': { us: 'ˈsɜːrvɪs', uk: 'ˈsɜːvɪs' },
        'system': { us: 'ˈsɪstəm', uk: 'ˈsɪstəm' },
        'program': { us: 'ˈproʊɡræm', uk: 'ˈprəʊɡræm' },
        'company': { us: 'ˈkʌmpəni', uk: 'ˈkʌmpəni' },
        'report': { us: 'rɪˈpɔːrt', uk: 'rɪˈpɔːt' },
        'order': { us: 'ˈɔːrdər', uk: 'ˈɔːdə' },
        'project': { us: 'ˈprɑːdʒekt', uk: 'ˈprɒdʒekt' },
        'agreement': { us: 'əˈɡriːmənt', uk: 'əˈɡriːmənt' },
        'contract': { us: 'ˈkɑːntrækt', uk: 'ˈkɒntrækt' },
        'market': { us: 'ˈmɑːrkɪt', uk: 'ˈmɑːkɪt' },
        'international': { us: 'ˌɪntərˈnæʃnəl', uk: 'ˌɪntəˈnæʃnəl' },
        'national': { us: 'ˈnæʃnəl', uk: 'ˈnæʃnəl' },
        'official': { us: 'əˈfɪʃl', uk: 'əˈfɪʃl' },
        'officials': { us: 'əˈfɪʃlz', uk: 'əˈfɪʃlz' },
        'peace': { us: 'piːs', uk: 'piːs' },
        'treaty': { us: 'ˈtriːti', uk: 'ˈtriːti' },
        'treaties': { us: 'ˈtriːtiz', uk: 'ˈtriːtiz' },
        'discuss': { us: 'dɪˈskʌs', uk: 'dɪˈskʌs' },
        'discussion': { us: 'dɪˈskʌʃn', uk: 'dɪˈskʌʃn' },
        'development': { us: 'dɪˈveləpmənt', uk: 'dɪˈveləpmənt' },
        'management': { us: 'ˈmænɪdʒmənt', uk: 'ˈmænɪdʒmənt' },
        'policy': { us: 'ˈpɑːləsi', uk: 'ˈpɒləsi' },
        'policies': { us: 'ˈpɑːləsiz', uk: 'ˈpɒləsiz' },
        'strategy': { us: 'ˈstrætədʒi', uk: 'ˈstrætədʒi' },
        'operation': { us: 'ˌɑːpəˈreɪʃn', uk: 'ˌɒpəˈreɪʃn' },
        'executive': { us: 'ɪɡˈzekjətɪv', uk: 'ɪɡˈzekjətɪv' },
        'president': { us: 'ˈprezɪdənt', uk: 'ˈprezɪdənt' },
        'minister': { us: 'ˈmɪnɪstər', uk: 'ˈmɪnɪstə' },
        'prime': { us: 'praɪm', uk: 'praɪm' },
        'foreign': { us: 'ˈfɔːrən', uk: 'ˈfɒrən' },
        'affairs': { us: 'əˈferz', uk: 'əˈfeəz' }
    };

    /**
     * Thuật toán Grapheme-to-Phoneme (G2P) tạo phiên âm ngữ âm học chuẩn cho từ chưa có trong từ điển
     * Cam kết: Luôn tạo ra ký hiệu ngữ âm học chuẩn (IPA characters), tuyệt đối KHÔNG bao giờ sinh dấu gạch dưới `_`.
     */
    function synthesizeWordIpa(word, accent = 'US') {
        const clean = word.toLowerCase().replace(/[^a-z]/g, '');
        if (!clean) return '';

        // Đã có trong từ điển
        if (PHONETIC_LEXICON[clean]) {
            return accent === 'UK' ? PHONETIC_LEXICON[clean].uk : PHONETIC_LEXICON[clean].us;
        }

        // Tách các tiền tố / hậu tố thông dụng
        let prefix = '';
        let root = clean;
        let suffix = '';

        const commonPrefixes = ['un', 're', 'in', 'im', 'dis', 'en', 'pre', 'pro', 'sub', 'inter', 'over'];
        for (const p of commonPrefixes) {
            if (root.startsWith(p) && root.length > p.length + 2) {
                prefix = p;
                root = root.slice(p.length);
                break;
            }
        }

        const commonSuffixes = ['tion', 'sion', 'ment', 'able', 'ible', 'ing', 'ed', 'ly', 'ness', 'ity', 'al', 'ous', 'ive'];
        for (const s of commonSuffixes) {
            if (root.endsWith(s) && root.length > s.length + 2) {
                suffix = s;
                root = root.slice(0, -s.length);
                break;
            }
        }

        // Xử lý ngữ âm từng phần
        const mapLetterClusters = (str, isUk) => {
            let res = str
                .replace(/tion/g, 'ʃn')
                .replace(/sion/g, 'ʒn')
                .replace(/ough/g, isUk ? 'ɔː' : 'ɔː')
                .replace(/igh/g, 'aɪ')
                .replace(/ight/g, 'aɪt')
                .replace(/ph/g, 'f')
                .replace(/ch/g, 'tʃ')
                .replace(/sh/g, 'ʃ')
                .replace(/th/g, 'θ')
                .replace(/ng/g, 'ŋ')
                .replace(/qu/g, 'kw')
                .replace(/ee/g, 'iː')
                .replace(/ea/g, 'iː')
                .replace(/oo/g, 'uː')
                .replace(/ou/g, 'aʊ')
                .replace(/ow/g, isUk ? 'əʊ' : 'oʊ')
                .replace(/oa/g, isUk ? 'əʊ' : 'oʊ')
                .replace(/ai/g, 'eɪ')
                .replace(/ay/g, 'eɪ')
                .replace(/oi/g, 'ɔɪ')
                .replace(/oy/g, 'ɔɪ')
                .replace(/ck/g, 'k')
                .replace(/ar/g, isUk ? 'ɑː' : 'ɑːr')
                .replace(/er/g, isUk ? 'ɜː' : 'ɜːr')
                .replace(/ir/g, isUk ? 'ɜː' : 'ɜːr')
                .replace(/or/g, isUk ? 'ɔː' : 'ɔːr')
                .replace(/ur/g, isUk ? 'ɜː' : 'ɜːr');

            // Nguyên âm đơn
            res = res
                .replace(/a/g, 'æ')
                .replace(/e/g, 'e')
                .replace(/i/g, 'ɪ')
                .replace(/o/g, isUk ? 'ɒ' : 'ɑː')
                .replace(/u/g, 'ʌ')
                .replace(/y$/g, 'i')
                .replace(/c([eiy])/g, 's$1')
                .replace(/c/g, 'k')
                .replace(/j/g, 'dʒ')
                .replace(/x/g, 'ks');

            return res;
        };

        const isUk = accent === 'UK';
        let phonemes = mapLetterClusters(root, isUk);
        if (prefix) {
            const prefIpa = mapLetterClusters(prefix, isUk);
            phonemes = prefIpa + phonemes;
        }
        if (suffix) {
            let sufIpa = suffix === 'ing' ? 'ɪŋ' : (suffix === 'ed' ? 'd' : (suffix === 'ly' ? 'li' : mapLetterClusters(suffix, isUk)));
            phonemes = phonemes + '.' + sufIpa;
        }

        // Thêm trọng âm chính
        return 'ˈ' + phonemes;
    }

    /**
     * Xử lý phiên âm cụm từ hoàn chỉnh (Multi-word phrase IPA builder)
     * e.g. "head of state meeting" -> "/ˌhed əv ˈsteɪt ˈmiː.tɪŋ/"
     */
    function transcribePhrase(phrase, accent = 'US') {
        if (!phrase || typeof phrase !== 'string') return '';
        const rawTokens = phrase.trim().split(/\s+/).filter(Boolean);
        if (rawTokens.length === 0) return '';

        const isUk = accent === 'UK';
        const functionWords = new Set(['of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'the', 'a', 'an', 'and', 'or', 'but']);

        const ipaTokens = rawTokens.map((tok, idx) => {
            const clean = tok.toLowerCase().replace(/[^a-z']/g, '');
            let ipa = '';
            if (PHONETIC_LEXICON[clean]) {
                ipa = isUk ? PHONETIC_LEXICON[clean].uk : PHONETIC_LEXICON[clean].us;
            } else {
                ipa = synthesizeWordIpa(clean, accent);
            }

            // Gỡ bỏ ký hiệu stress thô để chuẩn hóa vị trí trọng âm toàn cụm
            ipa = ipa.replace(/^[ˈˌ]/, '');

            // Trọng âm ngữ điệu:
            // - Từ chức năng (of, in, to, the) thường không nhận trọng âm
            // - Nếu là từ đầu tiên của cụm từ ghép dài, gán trọng âm phụ ˌ
            // - Từ nội dung quan trọng cuối cùng hoặc chính nhận trọng âm chính ˈ
            if (functionWords.has(clean)) {
                return ipa;
            }

            if (idx === 0 && rawTokens.length > 1) {
                return 'ˌ' + ipa;
            }

            if (idx === rawTokens.length - 1 || (!functionWords.has(clean) && idx > 0)) {
                return 'ˈ' + ipa;
            }

            return ipa;
        });

        const formatted = ipaTokens.join(' ').replace(/\s+/g, ' ').trim();
        return `/${formatted}/`;
    }

    /**
     * Lấy cặp IPA đầy đủ cho cả US và UK
     */
    function getPhonetics(query) {
        if (!query) return { us: '', uk: '' };
        return {
            us: transcribePhrase(query, 'US'),
            uk: transcribePhrase(query, 'UK')
        };
    }

    /**
     * Làm sạch và chuẩn hóa chuỗi IPA hiện có (loại bỏ triệt để raw underscore `_` hoặc lỗi `/'.../`)
     */
    function sanitizeIpaString(rawIpa, fallbackQuery = '', accent = 'US') {
        if (!rawIpa || typeof rawIpa !== 'string' || rawIpa.includes('_') || rawIpa.startsWith("/'") || rawIpa === '/.../') {
            return transcribePhrase(fallbackQuery || '', accent);
        }
        let clean = rawIpa.trim();
        if (!clean.startsWith('/')) clean = '/' + clean;
        if (!clean.endsWith('/')) clean = clean + '/';
        // Gỡ bỏ dấu gạch dưới còn sót lại
        clean = clean.replace(/_/g, ' ').replace(/\s+/g, ' ');
        return clean;
    }

    return {
        getPhonetics: getPhonetics,
        transcribePhrase: transcribePhrase,
        sanitizeIpaString: sanitizeIpaString,
        lexicon: PHONETIC_LEXICON
    };
}));
