const fs = require('fs');
const path = './data/dictionary_lexicon.json';
const lex = JSON.parse(fs.readFileSync(path, 'utf8'));

lex['head of state'] = {
  headword: 'head of state',
  rootForm: 'head of state',
  lemma: 'head of state',
  matchedForm: '',
  ipa: {
    us: '/ˌhed əv ˈsteɪt/',
    uk: '/ˌhed əv ˈsteɪt/'
  },
  audio: {
    us: '/api/tts?text=head%20of%20state&lang=en-US',
    uk: '/api/tts?text=head%20of%20state&lang=en-GB'
  },
  partOfSpeech: 'Compound Noun / Phrase',
  pos: 'compound noun / phrase',
  vi: 'Người đứng đầu nhà nước, nguyên thủ quốc gia',
  vietnameseMeaning: 'Người đứng đầu nhà nước, nguyên thủ quốc gia',
  definition: 'The official leader of a country, who represents it both domestically and internationally.',
  definitions: [
    {
      en: 'The official leader of a country, who represents it both domestically and internationally.',
      vi: 'Nhà lãnh đạo chính thức của một quốc gia, đại diện cho quốc gia cả trong và ngoài nước.',
      exampleEn: 'The head of state addressed the nation regarding international cooperation.',
      exampleVi: 'Nguyên thủ quốc gia đã phát biểu trước toàn dân về hợp tác quốc tế.'
    }
  ],
  senses: [
    {
      pos: 'Compound Noun',
      defEn: 'The official leader of a country, who represents it both domestically and internationally.',
      meaningVi: 'Người đứng đầu nhà nước, nguyên thủ quốc gia',
      level: 'B2-C1',
      examples: [
        {
          en: 'The head of state addressed the nation regarding international cooperation.',
          vi: 'Nguyên thủ quốc gia đã phát biểu trước toàn dân về hợp tác quốc tế.'
        }
      ]
    }
  ],
  wordFamily: {
    noun: [
      { term: 'head', vi: 'người đứng đầu, thủ lĩnh' },
      { term: 'state', vi: 'nhà nước, quốc gia' }
    ],
    verb: [
      { term: 'head', vi: 'chỉ huy, lãnh đạo' }
    ],
    adj: [],
    adv: []
  },
  synonyms: ['leader', 'president', 'monarch', 'sovereign', 'ruler'],
  antonyms: ['subordinate', 'citizen'],
  collocations: [
    { phrase: 'meeting of heads of state', vi: 'cuộc gặp của các nguyên thủ quốc gia' },
    { phrase: 'council of heads of state', vi: 'hội đồng các nguyên thủ quốc gia' },
    { phrase: 'visit of the head of state', vi: 'chuyến thăm của nguyên thủ quốc gia' }
  ],
  idioms: [],
  phrasalVerbs: [],
  lists: ['TOEIC / VSTEP Advanced Vocabulary'],
  examTag: 'TOEIC / VSTEP Advanced Vocabulary',
  examContext: 'Thường gặp trong TOEIC Part 7 / VSTEP Reading chủ đề Chính trị - Hợp tác quốc tế',
  toeicNote: '💡 Ngữ cảnh TOEIC: Thường gặp trong các bài đọc báo chí hoặc tin tức kinh tế - chính trị quốc tế (Part 7).',
  examples: [
    {
      en: 'The head of state addressed the nation regarding international cooperation.',
      vi: 'Nguyên thủ quốc gia đã phát biểu trước toàn dân về hợp tác quốc tế.'
    }
  ],
  sources: [
    { name: 'Wiktionary / AI Lexicographer', license: 'CC BY-SA 3.0', url: 'https://noblefranklin.edu.vn' }
  ],
  flags: {
    exactMatch: true,
    isAiGenerated: true,
    isLemmaRedirect: false,
    isSegmented: false,
    machineTranslated: false,
    incomplete: false
  }
};

lex['heads of state'] = {
  ...lex['head of state'],
  headword: 'head of state',
  rootForm: 'head of state',
  word: 'heads of state',
  query: 'heads of state',
  ipa: {
    us: '/ˌhedz əv ˈsteɪt/',
    uk: '/ˌhedz əv ˈsteɪt/'
  },
  vi: 'Các nguyên thủ quốc gia, những người đứng đầu nhà nước',
  vietnameseMeaning: 'Các nguyên thủ quốc gia, những người đứng đầu nhà nước',
  flags: {
    exactMatch: true,
    isAiGenerated: true,
    isLemmaRedirect: true,
    isSegmented: false
  },
  matchedForm: 'Dạng số nhiều của cụm danh từ "head of state"',
  searchedQuery: 'heads of state'
};

fs.writeFileSync(path, JSON.stringify(lex, null, 2), 'utf8');
console.log('Successfully updated dictionary_lexicon.json with head of state and heads of state');
