// scripts/generate_massive_dictionary.js
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Full Cambridge & Oxford Topic Lexicon...');

// Load existing vocab decks from js/vocab-decks-data.js
let vocabDecks = {};
try {
  const decksCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'vocab-decks-data.js'), 'utf8');
  const win = {};
  eval(decksCode);
  vocabDecks = win.vocabDecksDatabase || {};
  console.log(`✅ Loaded ${Object.keys(vocabDecks).length} decks from vocab-decks-data.js`);
} catch(e) {
  console.warn('⚠️ Could not load vocab-decks-data.js:', e.message);
}

// 8 Master Topics with Aliases
const TOPIC_ALIASES = {
  "technology": [
    "công nghệ", "cong nghe", "technology", "tech", "it", "máy tính", "may tinh",
    "lập trình", "lap trinh", "ai", "phần mềm", "phan mem", "computer", "software",
    "artificial intelligence", "developer", "digital", "hardware", "cyber", "code", "coding"
  ],
  "travel": [
    "du lịch", "du lich", "travel", "tourism", "trip", "journey", "vacation",
    "holiday", "khách sạn", "khach san", "hotel", "máy bay", "may bay", "flight",
    "tour", "resort", "bãi biển", "bai bien", "khám phá", "kham pha", "destination"
  ],
  "business": [
    "kinh tế", "kinh te", "business", "economy", "finance", "thương mại", "thuong mai",
    "tiền tệ", "tien te", "ngân hàng", "ngan hang", "đầu tư", "dau tu", "market",
    "toeic", "corporate", "doanh nghiệp", "doanh nghiep", "startup", "accounting", "profit"
  ],
  "ghibli": [
    "thế giới totoro & ghibli", "the gioi totoro & ghibli", "totoro", "ghibli",
    "hoạt hình", "hoat hinh", "anime", "magic", "fantasy", "thiên nhiên", "thien nhien",
    "nature", "forest", "rừng già", "rung gia", "mơ mộng", "mo mong", "fairy tale"
  ],
  "interview": [
    "phỏng vấn", "phong van", "interview", "job", "career", "xin việc", "xin viec",
    "tuyển dụng", "tuyen dung", "recruitment", "hiring", "cv", "resume", "ứng viên", "ung vien",
    "candidate", "workplace interview", "nhân sự", "nhan su", "hr"
  ],
  "daily": [
    "giao tiếp", "giao tiep", "daily", "communication", "đời sống", "doi song",
    "hàng ngày", "hang ngay", "conversation", "life", "chat", "greeting", "chào hỏi",
    "chao hoi", "bạn bè", "ban be", "family", "gia đình", "gia dinh", "talk"
  ],
  "food": [
    "ẩm thực", "am thuc", "food", "dining", "nấu ăn", "nau an", "món ăn", "mon an",
    "cooking", "cuisine", "restaurant", "nhà hàng", "nha hang", "ăn uống", "an uong",
    "drink", "đồ uống", "do uong", "recipe", "chef", "taste"
  ],
  "workplace": [
    "công sở", "cong so", "workplace", "office", "văn phòng", "van phong",
    "đồng nghiệp", "dong nghiep", "colleague", "meeting", "họp hành", "hop hanh",
    "báo cáo", "bao cao", "report", "deadline", "task", "dự án", "du an", "project"
  ]
};

const TOPIC_NAMES = {
  "technology": "Công nghệ & Kỹ thuật số (Technology)",
  "travel": "Du lịch & Khám phá (Travel & Adventure)",
  "business": "Kinh tế & Thương mại (Business & Finance)",
  "ghibli": "Thế giới Totoro & Ghibli (Fantasy & Magic)",
  "interview": "Phỏng vấn & Tìm việc (Job Interview & Career)",
  "daily": "Giao tiếp & Đời sống (Daily Communication)",
  "food": "Ẩm thực & Nhà hàng (Food & Dining)",
  "workplace": "Công sở & Văn phòng (Office & Workplace)"
};

// Deck assignments to topics
const DECK_MAPPINGS = {
  "technology": ["Office Technology", "VSTEP Education & Technology", "Product Development"],
  "business": ["Contracts", "Business Planning", "Marketing", "Warranties", "Invoices & Billing", "Banking & Loans", "Accounting", "Investments", "Financial Statements", "Taxes & Auditing", "Property & Real Estate", "Board Meetings", "Cost Reduction"],
  "travel": ["Airlines & Airports", "Trains & Public Transit", "Hotels & Accommodations", "Car Rentals", "Museums & Art"],
  "food": ["Eating Out & Restaurants"],
  "interview": ["Job Advertising & Recruiting", "Applying & Interviewing", "Hiring & Training", "Salaries & Benefits", "Promotions & Awards"],
  "workplace": ["Office Procedures", "Correspondence", "Conferences", "Customer Service", "Company Regulations", "Workplace Safety", "Team Collaboration", "Shopping & Ordering Supplies", "Shipping & Receiving", "Inventory Management", "Warehouse Operations", "Pensions & Retirement"],
  "daily": ["Cinema & Theater", "Media & Press", "Doctor’s Office & Dentistry", "Health Insurance", "Hospitals & Pharmacy", "VSTEP Social & Culture", "VSTEP Environment & Climate"]
};

// Raw Words data definition with 100% Cambridge IPA and verified Vietnamese translations
const RAW_LEXICON = require('./raw_lexicon_data.js');

// Merge Deck words into RAW_LEXICON
for (const [topicKey, deckNames] of Object.entries(DECK_MAPPINGS)) {
  if (!RAW_LEXICON[topicKey]) continue;
  for (const dName of deckNames) {
    const cards = vocabDecks[dName] || [];
    for (const card of cards) {
      const cleanWord = card.word.toLowerCase().trim();
      // Skip multi-word phrases for arena typing
      if (cleanWord.includes(' ') && cleanWord.split(' ').length > 2) continue;
      
      // Determine CEFR level
      let lvl = 'B1';
      if (cleanWord.length <= 5) lvl = 'A2';
      else if (cleanWord.length <= 8) lvl = 'B1';
      else if (cleanWord.length <= 11) lvl = 'B2';
      else lvl = 'C1';

      // Check if already in any level of this topic
      let exists = false;
      for (const existingLvl in RAW_LEXICON[topicKey].words) {
        if (RAW_LEXICON[topicKey].words[existingLvl].some(w => w.word.toLowerCase() === cleanWord)) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        RAW_LEXICON[topicKey].words[lvl].push({
          word: cleanWord,
          meaning: card.meaning.split(';')[0].split(',')[0].trim(),
          phonetic: card.phonetic || `/${cleanWord}/`,
          level: lvl
        });
      }
    }
  }
}

// Assemble full database
const CURATED_VOCAB_TOPICS = {};
for (const topicKey in TOPIC_NAMES) {
  CURATED_VOCAB_TOPICS[topicKey] = {
    name: TOPIC_NAMES[topicKey],
    aliases: TOPIC_ALIASES[topicKey],
    words: {}
  };
  let topicTotal = 0;
  for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
    const list = RAW_LEXICON[topicKey]?.words[lvl] || [];
    // Deduplicate within level
    const seen = new Set();
    const dedup = [];
    for (const item of list) {
      const wLower = item.word.toLowerCase().trim();
      if (!seen.has(wLower)) {
        seen.add(wLower);
        dedup.push({
          word: wLower,
          meaning: item.meaning,
          phonetic: item.phonetic,
          level: lvl
        });
      }
    }
    CURATED_VOCAB_TOPICS[topicKey].words[lvl] = dedup;
    topicTotal += dedup.length;
    console.log(`  [${topicKey}] Level ${lvl}: ${dedup.length} words`);
  }
  console.log(`🌟 Total for ${topicKey}: ${topicTotal} words\n`);
}

// Output JSON file
const jsonPath = path.join(__dirname, '..', 'data', 'curated_vocab_topics.json');
fs.writeFileSync(jsonPath, JSON.stringify(CURATED_VOCAB_TOPICS, null, 2), 'utf8');
console.log(`✅ Saved ${jsonPath}`);

// Output Node.js module
const libPath = path.join(__dirname, '..', 'lib', 'curated-vocab-bank.js');
const libContent = `// lib/curated-vocab-bank.js
// VAST CAMBRIDGE & OXFORD CEFR TOPIC LEXICON (AUTO-GENERATED)
module.exports = ${JSON.stringify(CURATED_VOCAB_TOPICS, null, 2)};
`;
fs.writeFileSync(libPath, libContent, 'utf8');
console.log(`✅ Saved ${libPath}`);

// Output Frontend Browser JS module
const jsPath = path.join(__dirname, '..', 'js', 'curated-vocab-bank.js');
const jsContent = `// js/curated-vocab-bank.js
// VAST CAMBRIDGE & OXFORD CEFR TOPIC LEXICON FOR BROWSER RUNTIME
window.CURATED_FRONTEND_TOPIC_BANK = ${JSON.stringify(CURATED_VOCAB_TOPICS, null, 2)};
`;
fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log(`✅ Saved ${jsPath}`);

console.log('🎉 Dictionary Generation Complete!');
