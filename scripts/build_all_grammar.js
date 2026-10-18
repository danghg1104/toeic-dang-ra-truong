const fs = require('fs');
const path = require('path');

const g1 = require('./grammar_data/group1_tenses.js');
const g2 = require('./grammar_data/group2_pos.js');
const g3 = require('./grammar_data/group3_verbs.js');
const g4 = require('./grammar_data/group4_prep.js');
const g5 = require('./grammar_data/group5_clauses.js');
const g6 = require('./grammar_data/group6_comp.js');
const g7 = require('./grammar_data/group7_special.js');
const g8 = require('./grammar_data/group8_vstep.js');

const allTopics = [...g1, ...g2, ...g3, ...g4, ...g5, ...g6, ...g7, ...g8];

console.log(`Loaded ${allTopics.length} topics across 8 groups.`);

// Verify unique slugs
const slugMap = new Map();
allTopics.forEach((t, index) => {
  if (slugMap.has(t.slug)) {
    throw new Error(`Duplicate slug detected: ${t.slug} at index ${index}`);
  }
  slugMap.set(t.slug, t);
});

console.log(`All ${slugMap.size} slugs are unique!`);

// Group categories metadata
const groupsMaster = [
  {
    id: 'verb-tenses',
    title: '1. Thì thời gian (Verb Tenses)',
    badge: 'Trọng tâm',
    badgeColor: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    icon: '⏳',
    description: 'Chinh phục 12 thì tiếng Anh với mô hình trục thời gian & quy tắc phối thì chuẩn xác.',
    topics: g1.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  },
  {
    id: 'parts-of-speech',
    title: '2. Từ loại (Parts of Speech - Chiếm 35% đề thi)',
    badge: 'Chiếm 35%',
    badgeColor: 'bg-rose-50 text-rose-600 border border-rose-200',
    icon: '🧱',
    description: 'Bản đồ vị trí & nhận diện đuôi danh từ, đại từ, tính từ, trạng từ và mạo từ trong Part 5.',
    topics: g2.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  },
  {
    id: 'verb-forms-and-passive',
    title: '3. Dạng thức Động từ & Câu Bị động (Verb Forms & Passive)',
    badge: 'Cốt lõi',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    icon: '🔄',
    description: 'Làm chủ câu bị động, sự hòa hợp S-V, To-V vs Gerunds và động từ khuyết thiếu.',
    topics: g3.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  },
  {
    id: 'prepositions-and-conjunctions',
    title: '4. Giới từ & Liên từ (Prepositions & Conjunctions)',
    badge: 'Bẫy điểm',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-200',
    icon: '🔗',
    description: 'Phân biệt giới từ đi với Cụm từ và liên từ đi với Mệnh đề (Despite vs Although, Due to vs Because).',
    topics: g4.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  },
  {
    id: 'clauses',
    title: '5. Các loại Mệnh đề (Clauses)',
    badge: 'Nâng cao',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-200',
    icon: '📜',
    description: 'Mệnh đề quan hệ, rút gọn mệnh đề quan hệ (V-ing/V3), mệnh đề danh từ và mệnh đề trạng ngữ.',
    topics: g5.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  },
  {
    id: 'comparisons-and-conditionals',
    title: '6. So sánh & Câu điều kiện (Comparisons & Conditionals)',
    badge: 'Phân loại',
    badgeColor: 'bg-purple-50 text-purple-600 border border-purple-200',
    icon: '⚖️',
    description: 'So sánh hơn/nhất, so sánh kép, bội số, các loại câu điều kiện và đảo ngữ điều kiện.',
    topics: g6.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  },
  {
    id: 'special-structures',
    title: '7. Cấu trúc Đặc biệt (Special Structures)',
    badge: 'Target 800+',
    badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-300',
    icon: '✨',
    description: 'Thức giả định (Subjunctive), cấu trúc cầu khiến (Causative) và cấu trúc song hành.',
    topics: g7.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  },
  {
    id: 'advanced-vstep-modifiers',
    title: '8. Cấu trúc Nâng cao VSTEP & TOEIC 800+',
    badge: 'VSTEP B2-C1',
    badgeColor: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200',
    icon: '🏆',
    description: 'Câu chẻ (Cleft), đảo ngữ phủ định, mệnh đề nhượng bộ nâng cao và động từ nối (Linking Verbs).',
    topics: g8.map(t => ({
      slug: t.slug,
      name: t.title,
      tags: t.targetTags,
      level: t.level,
      totalQuestions: t.totalQuestions
    }))
  }
];

// Build topic database object
const databaseObject = {};
allTopics.forEach(t => {
  databaseObject[t.slug] = t;
});

// Legacy aliases mapping to ensure backwards compatibility
const aliases = {
  'cac-thi-hien-tai': 'present-tenses',
  'cac-thi-qua-khu': 'past-tenses',
  'cac-thi-tuong-lai': 'future-tenses',
  'cac-thi-hoan-thanh': 'perfect-tenses',
  'su-phoi-hop-thi': 'sequence-of-tenses',
  'danh-tu-cum-danh-tu': 'nouns-and-noun-phrases',
  'dai-tu': 'pronouns-reflexive-possessive',
  'tinh-tu': 'adjectives-ing-ed',
  'trang-tu': 'adverbs-and-positions',
  'mao-tu-luong-tu': 'articles-and-quantifiers',
  'cau-bi-dong': 'passive-voice',
  'su-hoa-hop-s-v': 'subject-verb-agreement',
  'dong-tu-nguyen-mau': 'to-infinitive-and-bare-v',
  'danh-dong-tu': 'gerunds-v-ing',
  'dong-tu-khuyet-thieu': 'modal-verbs',
  'gioi-tu': 'prepositions-time-place',
  'gioi-tu-nang-cao': 'advanced-toeic-prepositions',
  'lien-tu-ket-hop': 'coordinating-correlative-conjunctions',
  'lien-tu-phu-thuoc': 'subordinating-conjunctions',
  'menh-de-quan-he': 'relative-clauses',
  'rut-gon-menh-de-quan-he': 'reduced-relative-clauses',
  'menh-de-danh-tu': 'noun-clauses',
  'menh-de-trang-ngu': 'adverbial-clauses',
  'cau-so-sanh': 'comparisons-equal-higher-superlative',
  'so-sanh-kep': 'double-comparisons-and-multiples',
  'cau-dieu-kien': 'conditional-sentences',
  'dao-ngu-dieu-kien': 'conditional-inversion',
  'thuc-gia-dinh': 'subjunctive-mood',
  'cau-truc-cau-khien': 'causative-structures',
  'dao-ngu-song-hanh': 'inversion-and-parallelism',
  'cau-che': 'cleft-sentences',
  'dao-ngu-phu-dinh': 'negative-inversion',
  'menh-de-nhuong-bo': 'concession-purpose-clauses',
  'cau-gian-tiep': 'reported-speech-variants',
  'dong-tu-noi': 'linking-verbs'
};

// Generate js/grammar-database.js
const jsOutputPath = path.join(__dirname, '..', 'js', 'grammar-database.js');
const jsCode = `/**
 * Grammar Database & Master Taxonomy for "Cùng Đăng ra trường"
 * Auto-generated with 35 Comprehensive Topics across 8 Groups.
 */
(function() {
  'use strict';

  var topicsData = ${JSON.stringify(databaseObject, null, 2)};
  var groupsMaster = ${JSON.stringify(groupsMaster, null, 2)};
  var aliases = ${JSON.stringify(aliases, null, 2)};

  // Register aliases
  Object.keys(aliases).forEach(function(alias) {
    var targetSlug = aliases[alias];
    if (topicsData[targetSlug] && !topicsData[alias]) {
      topicsData[alias] = topicsData[targetSlug];
    }
  });

  // Attach to window
  window.grammarDatabase = topicsData;
  window.grammarGroupsMaster = groupsMaster;

  // Helper APIs
  window.getGrammarTopic = function(slug) {
    if (!slug) return null;
    return window.grammarDatabase[slug] || null;
  };

  window.getAllGrammarTopics = function() {
    return Object.keys(window.grammarDatabase)
      .filter(function(key) { return !aliases[key]; }) // unique canonical topics
      .map(function(key) { return window.grammarDatabase[key]; });
  };

  window.getGrammarGroups = function() {
    return window.grammarGroupsMaster;
  };

  console.log('[GrammarDatabase] Initialized with ' + Object.keys(window.grammarDatabase).length + ' topic keys (including aliases).');
})();
`;

fs.writeFileSync(jsOutputPath, jsCode, 'utf8');
console.log(`Saved browser database to ${jsOutputPath}`);

// Generate TypeScript definitions & file in src/data/grammarDatabase.ts
const tsDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(tsDir)) {
  fs.mkdirSync(tsDir, { recursive: true });
}
const tsOutputPath = path.join(tsDir, 'grammarDatabase.ts');

const tsCode = `/**
 * Grammar Database TypeScript Definition & Store
 * 35 Comprehensive Grammar Topics across 8 Academic Groups
 */

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  explanation: string;
}

export interface ThreeStepReasoning {
  step1: string;
  step2: string;
  step3: string;
}

export interface PracticeQuestion {
  id: number;
  part: number;
  targetTags: string[];
  level: '0-500' | '600+' | '800+';
  question: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  threeStepReasoning: ThreeStepReasoning;
}

export interface GoldenRule {
  title: string;
  formulas: string[];
  note: string;
}

export interface MentalModelFlowStep {
  step: number;
  label: string;
  action: string;
}

export interface MentalModel {
  flowSteps: MentalModelFlowStep[];
  explanation: string;
}

export interface QuickFormula {
  id: string;
  formula: string;
}

export interface UsageBox {
  title: string;
  items: string[];
  note: string;
}

export interface UsageComparison {
  leftBox: UsageBox;
  rightBox: UsageBox;
}

export interface GrammarTrap {
  id: number;
  title: string;
  explanation: string;
  wrongExample: string;
  rightExample: string;
}

export interface GrammarExample {
  id: number;
  sentenceEn: string;
  sentenceVi: string;
  highlightRule: string;
}

export interface GrammarTopicDetail {
  slug: string;
  categorySlug: string;
  categoryTitle: string;
  title: string;
  targetTags: string[];
  level: '0-500' | '600+' | '800+';
  totalQuestions: number;
  description: string;
  goldenRule: GoldenRule;
  quickTips: string[];
  mascotTip: string;
  mentalModel: MentalModel;
  quickFormulas: QuickFormula[];
  usageComparison: UsageComparison;
  traps: GrammarTrap[];
  examples: GrammarExample[];
  questions: PracticeQuestion[];
}

export interface GrammarTopicSummary {
  slug: string;
  name: string;
  tags: string[];
  level: '0-500' | '600+' | '800+';
  totalQuestions: number;
}

export interface GrammarGroupMaster {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  topics: GrammarTopicSummary[];
}

export const grammarGroupsMaster: GrammarGroupMaster[] = ${JSON.stringify(groupsMaster, null, 2)};

export const grammarDatabase: Record<string, GrammarTopicDetail> = ${JSON.stringify(databaseObject, null, 2)};

export const grammarAliases: Record<string, string> = ${JSON.stringify(aliases, null, 2)};

export function getGrammarTopic(slug: string): GrammarTopicDetail | undefined {
  if (!slug) return undefined;
  const canonicalSlug = grammarAliases[slug] || slug;
  return grammarDatabase[canonicalSlug];
}

export function getAllGrammarTopics(): GrammarTopicDetail[] {
  return Object.values(grammarDatabase);
}

export function getTopicsByCategory(categorySlug: string): GrammarTopicDetail[] {
  return Object.values(grammarDatabase).filter(t => t.categorySlug === categorySlug);
}
`;

fs.writeFileSync(tsOutputPath, tsCode, 'utf8');
console.log(`Saved TypeScript database to ${tsOutputPath}`);
console.log('Build complete!');
