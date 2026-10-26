// scripts/merge_and_export_dictionary.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🚀 Merging 8 Topics with 48 Decks from vocab-decks-data.js...');

const baseTopics = require('./base_curated_data.js');

// Load vocabDecksDatabase safely using vm
let vocabDecks = {};
try {
  const decksCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'vocab-decks-data.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(decksCode, sandbox);
  vocabDecks = sandbox.window.vocabDecksDatabase || {};
  console.log(`✅ Loaded ${Object.keys(vocabDecks).length} decks from vocab-decks-data.js`);
} catch(e) {
  console.warn('⚠️ Could not load vocab-decks-data.js:', e.message);
}

// Topic Deck Mappings
const DECK_TOPIC_MAP = {
  'technology': ['Office Technology', 'VSTEP Education & Technology', 'Product Development', 'Manufacturing', 'Quality Control'],
  'business': ['Contracts', 'Business Planning', 'Marketing', 'Warranties', 'Invoices & Billing', 'Banking & Loans', 'Accounting', 'Investments', 'Financial Statements', 'Taxes & Auditing', 'Property & Real Estate', 'Board Meetings', 'Cost Reduction'],
  'travel': ['Airlines & Airports', 'Trains & Public Transit', 'Hotels & Accommodations', 'Car Rentals', 'Museums & Art'],
  'food': ['Eating Out & Restaurants'],
  'interview': ['Job Advertising & Recruiting', 'Applying & Interviewing', 'Hiring & Training', 'Salaries & Benefits', 'Promotions & Awards'],
  'workplace': ['Office Procedures', 'Correspondence', 'Conferences', 'Customer Service', 'Company Regulations', 'Workplace Safety', 'Team Collaboration', 'Shopping & Ordering Supplies', 'Shipping & Receiving', 'Inventory Management', 'Warehouse Operations', 'Pensions & Retirement'],
  'daily': ['Cinema & Theater', 'Media & Press', 'Doctor’s Office & Dentistry', 'Health Insurance', 'Hospitals & Pharmacy', 'VSTEP Social & Culture', 'VSTEP Environment & Climate']
};

let deckWordsAdded = 0;

for (const [topicKey, deckNames] of Object.entries(DECK_TOPIC_MAP)) {
  if (!baseTopics[topicKey]) continue;

  for (const deckName of deckNames) {
    const cards = vocabDecks[deckName] || [];
    for (const card of cards) {
      const cleanWord = card.word.toLowerCase().trim();
      // Skip phrases longer than 2 words for smooth gundam typing
      if (cleanWord.includes(' ') && cleanWord.split(' ').length > 2) continue;

      // Assign level based on word structure
      let targetLevel = 'B1';
      if (cleanWord.length <= 5) targetLevel = 'A2';
      else if (cleanWord.length <= 8) targetLevel = 'B1';
      else if (cleanWord.length <= 11) targetLevel = 'B2';
      else targetLevel = 'C1';

      // Check if word already exists anywhere in this topic
      let exists = false;
      for (const lvl in baseTopics[topicKey].words) {
        if (baseTopics[topicKey].words[lvl].some(w => w.word.toLowerCase() === cleanWord)) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        baseTopics[topicKey].words[targetLevel].push({
          word: cleanWord,
          meaning: card.meaning.split(';')[0].split(',')[0].trim(),
          phonetic: card.phonetic || `/${cleanWord}/`,
          level: targetLevel
        });
        deckWordsAdded++;
      }
    }
  }
}

console.log(`✅ Integrated ${deckWordsAdded} deck words across topics.`);

// Deduplicate and finalize
const FINAL_DATABASE = {};
let grandTotal = 0;

for (const [topicKey, topicData] of Object.entries(baseTopics)) {
  FINAL_DATABASE[topicKey] = {
    name: topicData.name,
    aliases: topicData.aliases,
    words: {}
  };

  let topicTotal = 0;
  for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
    const wordsList = topicData.words[lvl] || [];
    const seen = new Set();
    const deduped = [];

    for (const item of wordsList) {
      const wClean = item.word.toLowerCase().trim();
      if (!seen.has(wClean) && wClean.length >= 2) {
        seen.add(wClean);
        deduped.push({
          word: wClean,
          meaning: item.meaning,
          phonetic: item.phonetic || `/${wClean}/`,
          level: lvl
        });
      }
    }

    FINAL_DATABASE[topicKey].words[lvl] = deduped;
    topicTotal += deduped.length;
  }

  grandTotal += topicTotal;
  console.log(`📊 [${topicKey}] Total words: ${topicTotal}`);
}

console.log(`\n🎉 Grand Total Across All 8 Topics: ${grandTotal} high-quality words!`);

// 1. Export JSON
const jsonPath = path.join(__dirname, '..', 'data', 'curated_vocab_topics.json');
fs.writeFileSync(jsonPath, JSON.stringify(FINAL_DATABASE, null, 2), 'utf8');
console.log(`💾 Saved ${jsonPath}`);

// 2. Export Node.js module
const libPath = path.join(__dirname, '..', 'lib', 'curated-vocab-bank.js');
const libContent = `// lib/curated-vocab-bank.js
// VAST CAMBRIDGE & OXFORD CEFR TOPIC LEXICON (AUTO-GENERATED)
module.exports = ${JSON.stringify(FINAL_DATABASE, null, 2)};
`;
fs.writeFileSync(libPath, libContent, 'utf8');
console.log(`💾 Saved ${libPath}`);

// 3. Export Frontend Browser script
const jsPath = path.join(__dirname, '..', 'js', 'curated-vocab-bank.js');
const jsContent = `// js/curated-vocab-bank.js
// VAST CAMBRIDGE & OXFORD CEFR TOPIC LEXICON FOR BROWSER RUNTIME
window.CURATED_FRONTEND_TOPIC_BANK = ${JSON.stringify(FINAL_DATABASE, null, 2)};
`;
fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log(`💾 Saved ${jsPath}`);
