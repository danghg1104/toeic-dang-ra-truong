const path = require('path');
const Preprocess = require(path.join(__dirname, '../lib/dictionary/preprocess.js'));

const EXPERT_PHRASE_BANK = {
  "head of state": {
    query: "head of state",
    rootForm: "head of state",
    ipa: { us: "/ˌhed əv ˈsteɪt/", uk: "/ˌhed əv ˈsteɪt/" },
    pos: "compound noun / phrase",
    vietnameseMeaning: "Người đứng đầu nhà nước, nguyên thủ quốc gia",
    definitions: [
      {
        en: "The official leader of a country, who represents it both domestically and internationally.",
        vi: "Nhà lãnh đạo chính thức của một quốc gia, đại diện cho quốc gia cả trong và ngoài nước.",
        exampleEn: "The heads of state met in Geneva to discuss the peace treaty.",
        exampleVi: "Các nguyên thủ quốc gia đã gặp nhau tại Geneva để thảo luận về hiệp ước hòa bình."
      }
    ],
    wordFamily: {
      noun: "head, state",
      verb: "head (lãnh đạo)",
      adjective: "-"
    },
    collocations: ["meeting of heads of state", "council of heads of state", "summit of heads of state"],
    examContext: "Thường gặp trong TOEIC Part 7 / VSTEP Reading chủ đề Chính trị - Hợp tác quốc tế"
  },
  "heads of state": {
    query: "heads of state",
    rootForm: "head of state",
    ipa: { us: "/ˌhedz əv ˈsteɪt/", uk: "/ˌhedz əv ˈsteɪt/" },
    pos: "compound noun / phrase",
    vietnameseMeaning: "Các nguyên thủ quốc gia, những người đứng đầu nhà nước",
    definitions: [
      {
        en: "The official leaders of countries, who represent them both domestically and internationally.",
        vi: "Các nhà lãnh đạo chính thức của các quốc gia, đại diện cho quốc gia cả trong và ngoài nước.",
        exampleEn: "The heads of state met in Geneva to discuss the peace treaty.",
        exampleVi: "Các nguyên thủ quốc gia đã gặp nhau tại Geneva để thảo luận về hiệp ước hòa bình."
      }
    ],
    wordFamily: {
      noun: "head, state",
      verb: "head (lãnh đạo)",
      adjective: "-"
    },
    collocations: ["meeting of heads of state", "council of heads of state", "summit of heads of state"],
    examContext: "Thường gặp trong TOEIC Part 7 / VSTEP Reading chủ đề Chính trị - Hợp tác quốc tế"
  },
  "run out of": {
    query: "run out of",
    rootForm: "run out of",
    ipa: { us: "/rʌn aʊt əv/", uk: "/rʌn aʊt əv/" },
    pos: "phrasal verb",
    vietnameseMeaning: "Hết, cạn kiệt (thời gian, tiền bạc, tài nguyên, nguyên liệu)",
    definitions: [
      {
        en: "To finish, use, or sell all of something, so that there is none left.",
        vi: "Dùng hết, cạn kiệt nguồn cung cấp hoặc tài nguyên, không còn lại gì.",
        exampleEn: "We are running out of printer ink and office stationery.",
        exampleVi: "Chúng ta sắp hết mực in và văn phòng phẩm công ty."
      }
    ],
    wordFamily: { noun: "run-out", verb: "run out of", adjective: "-" },
    collocations: ["run out of time", "run out of money", "run out of stock"],
    examContext: "Cụm phrasal verb kinh điển trong bài thi TOEIC Part 3, 4 & Part 5"
  },
  "running out of": {
    query: "running out of",
    rootForm: "run out of",
    ipa: { us: "/ˈrʌnɪŋ aʊt əv/", uk: "/ˈrʌnɪŋ aʊt əv/" },
    pos: "phrasal verb",
    vietnameseMeaning: "Đang cạn kiệt, đang hết dần (thì tiếp diễn)",
    definitions: [
      {
        en: "In the process of exhausting or finishing the available supply of something.",
        vi: "Đang trong tình trạng cạn kiệt hoặc sắp hết nguồn cung cấp.",
        exampleEn: "We are running out of time to finalize the project contract.",
        exampleVi: "Chúng ta đang sắp hết thời gian để hoàn thiện hợp đồng dự án."
      }
    ],
    wordFamily: { noun: "run-out", verb: "run out of", adjective: "-" },
    collocations: ["running out of time", "running out of budget", "running out of options"],
    examContext: "Dạng tiếp diễn rất hay xuất hiện trong TOEIC Part 3 và Part 5"
  },
  "carry out": {
    query: "carry out",
    rootForm: "carry out",
    ipa: { us: "/ˈkæri aʊt/", uk: "/ˈkæri aʊt/" },
    pos: "phrasal verb",
    vietnameseMeaning: "Tiến hành, thực hiện, triển khai (kế hoạch, dự án, khảo sát)",
    definitions: [
      {
        en: "To do and complete a task, survey, experiment, or planned activity.",
        vi: "Thực hiện và hoàn thành một nhiệm vụ, khảo sát hoặc kế hoạch.",
        exampleEn: "The research department will carry out an employee satisfaction survey.",
        exampleVi: "Phòng nghiên cứu sẽ tiến hành một cuộc khảo sát mức độ hài lòng của nhân viên."
      }
    ],
    wordFamily: { noun: "-", verb: "carry out", adjective: "-" },
    collocations: ["carry out a survey", "carry out an inspection", "carry out market research"],
    examContext: "Cụm từ xuất hiện với tần suất cực cao trong TOEIC Part 5 & 7"
  },
  "look forward to": {
    query: "look forward to",
    rootForm: "look forward to",
    ipa: { us: "/lʊk ˈfɔːrwərd tuː/", uk: "/lʊk ˈfɔːwəd tuː/" },
    pos: "phrasal verb",
    vietnameseMeaning: "Trông mong, háo hức chờ đợi (sau 'to' đi kèm V-ing hoặc Danh từ)",
    definitions: [
      {
        en: "To feel pleased and excited about something that is going to happen.",
        vi: "Háo hức và mong đợi một sự kiện tốt đẹp sắp diễn ra.",
        exampleEn: "We look forward to collaborating with your company on the upcoming tender.",
        exampleVi: "Chúng tôi rất mong được hợp tác với công ty bạn trong gói thầu sắp tới."
      }
    ],
    wordFamily: { noun: "-", verb: "look forward to", adjective: "-" },
    collocations: ["look forward to hearing from you", "look forward to the partnership"],
    examContext: "BẪY TOEIC KINH ĐIỂN: Sau 'look forward to' bắt buộc phải là V-ing hoặc Danh từ!"
  }
};

function formatTier3StandardEntry(rawQuery, item, prepInfo) {
  const rootForm = item.rootForm || prepInfo.lemma || prepInfo.segmented || rawQuery;
  const word = item.query || rawQuery;
  const ipaUs = item.ipa?.us || `/ˈ${rootForm.replace(/\s+/g, '_')}/`;
  const ipaUk = item.ipa?.uk || ipaUs;
  const pos = item.pos || 'Compound Phrase';
  const vi = item.vietnameseMeaning || item.vi || 'Thuật ngữ tiếng Anh';
  const definitions = Array.isArray(item.definitions) && item.definitions.length > 0 ? item.definitions : [
    {
      en: item.definition || 'Essential English term.',
      vi: vi,
      exampleEn: item.examples?.[0]?.en || `Usage of "${rootForm}" is common in business.`,
      exampleVi: item.examples?.[0]?.vi || `Cách dùng "${rootForm}" phổ biến trong công việc.`
    }
  ];

  return {
    query: word,
    rootForm: rootForm,
    ipa: { us: ipaUs, uk: ipaUk },
    pos: pos,
    vietnameseMeaning: vi,
    definitions: definitions,
    wordFamily: item.wordFamily || { noun: '-', verb: '-', adjective: '-' },
    collocations: item.collocations || [],
    examContext: item.examContext || 'TOEIC / VSTEP Advanced Vocabulary',

    // Compatibility fields
    headword: rootForm,
    lemma: rootForm,
    word: rootForm,
    phonetic: ipaUs,
    partOfSpeech: pos,
    vi: vi,
    definition: definitions[0]?.en || '',
    senses: definitions.map(d => ({
      pos: pos,
      defEn: d.en,
      meaningVi: d.vi,
      level: 'B2-C1',
      examples: [{ en: d.exampleEn, vi: d.exampleVi }]
    })),
    examples: definitions.map(d => ({ en: d.exampleEn, vi: d.exampleVi })),
    lists: [item.examContext || 'TOEIC / VSTEP Core Vocabulary'],
    examTag: item.examContext || 'TOEIC / VSTEP Core Vocabulary',
    toeicNote: item.examContext || '',
    sources: [
      { name: 'AI Dynamic Lexicographer / Open Vocabulary', license: 'Creative Commons / AI Enhanced', url: 'https://noblefranklin.edu.vn' }
    ],
    flags: {
      exactMatch: true,
      isAiGenerated: true,
      isSegmented: !!prepInfo.isSegmented,
      isLemmaRedirect: !!prepInfo.isLemma,
      machineTranslated: false,
      incomplete: false
    },
    matchedForm: prepInfo.note || '',
    searchedQuery: rawQuery,
    segmentedWord: prepInfo.segmented
  };
}

const test1 = formatTier3StandardEntry('headsofstate', EXPERT_PHRASE_BANK['heads of state'], Preprocess.processInput('headsofstate'));
console.log('Formatted headsofstate:');
console.log('headword:', test1.headword);
console.log('rootForm:', test1.rootForm);
console.log('isSegmented:', test1.flags.isSegmented);
console.log('isLemmaRedirect:', test1.flags.isLemmaRedirect);
console.log('vietnameseMeaning:', test1.vietnameseMeaning);
console.log('collocations count:', test1.collocations.length);
