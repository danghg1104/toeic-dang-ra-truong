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
  }
};

function resolvePhrase(raw) {
  const prep = Preprocess.processInput(raw);
  const cleanKey = prep.cleaned;
  const canonical = prep.canonicalQuery;
  const seg = prep.segmented;

  let entry = EXPERT_PHRASE_BANK[cleanKey] || EXPERT_PHRASE_BANK[canonical] || EXPERT_PHRASE_BANK[seg];
  if (entry) {
    const clone = JSON.parse(JSON.stringify(entry));
    clone.flags = {
      exactMatch: true,
      isAiGenerated: true,
      isSegmented: prep.isSegmented,
      isLemmaRedirect: prep.isLemma
    };
    clone.originalQuery = raw;
    clone.searchedQuery = raw;
    clone.segmentedWord = prep.segmented;
    clone.matchedForm = prep.note || '';
    return clone;
  }
  return null;
}

console.log('Testing "headsofstate":', resolvePhrase('headsofstate'));
console.log('Testing "heads of state":', resolvePhrase('heads of state'));
console.log('Testing "head of state":', resolvePhrase('head of state'));
