const fs = require('fs');
const path = require('path');

const summaryPath = path.join(__dirname, '..', 'js', 'dailydictation-toeic-data.js');
let content = fs.readFileSync(summaryPath, 'utf8');

const summaryMatch = content.match(/const TOEIC_DICTATION_SUMMARY = (\[[\s\S]*?\]);\s*\n\s*\/\//);
if (!summaryMatch) {
  console.error('Could not match TOEIC_DICTATION_SUMMARY');
  process.exit(1);
}

const summary = JSON.parse(summaryMatch[1]);

function classifyLesson(lesson, testNum) {
  const parts = lesson.partsCount || 10;
  const topic = (lesson.topic || '').toLowerCase();
  const name = (lesson.name || '').toLowerCase();

  const c2Keywords = [
    'm&a', 'merger', 'acquisition', 'macroeconomic', 'crisis', 'arbitration',
    'litigation', 'regulatory compliance', 'quarterly earnings', 'restructuring',
    'keynote', 'patent dispute', 'foreign exchange', 'antitrust', 'shareholder meeting',
    'board of directors', 'contingency plan', 'investigative report'
  ];

  const c1Keywords = [
    'financial report', 'quarterly', 'transition plan', 'compliance', 'patent',
    'audit', 'stock report', 'performance review', 'minimalist design', 'executive',
    'investment', 'consulting', 'board meeting', 'expansion strategy', 'feasibility study',
    'legal counsel', 'contract negotiation', 'architectural design', 'technical specification',
    'joint venture', 'clinical trial', 'corporate governance', 'budget deficit', 'revenue forecast'
  ];

  const b2Keywords = [
    'strategy', 'campaign', 'contract', 'logistics', 'negotiation', 'marketing',
    'manufacturing', 'budget', 'promotion', 'expansion', 'workshop', 'supplier',
    'renovation', 'inventory', 'distribution', 'efficiency', 'workplace policy',
    'recruitment', 'client feedback', 'presentation', 'product launch', 'operations',
    'warehouse', 'insurance policy', 'sales quota', 'advertising', 'overseas branch'
  ];

  const b1Keywords = [
    'breakdown', 'copier', 'printer', 'shipment', 'delay', 'vendor', 'repair',
    'conference', 'catering', 'it support', 'reimbursement', 'colleague',
    'facility', 'software', 'schedule change', 'overtime', 'maintenance',
    'invoice', 'billing', 'training session', 'office supplies', 'commute',
    'flight delay', 'rental car', 'refund', 'equipment', 'order confirmation'
  ];

  const a2Keywords = [
    'appointment', 'ticket', 'flight', 'dentist', 'clinic', 'hotel', 'reservation',
    'train', 'return', 'shoes', 'airport', 'gym', 'cleaning', 'car damage',
    'package', 'doctor', 'parking', 'reception', 'boarding', 'library', 'subway',
    'bus schedule', 'museum', 'store hours', 'dry cleaner', 'pharmacy'
  ];

  const a1Keywords = [
    'beginner', 'coffee', 'lunch', 'greeting', 'directions',
    'snack', 'cafe', 'weather', 'bus', 'simple', 'drop off', 'bookstore',
    'lost item', 'water cooler', 'morning', 'cafeteria', 'break room',
    'sandwich', 'tea', 'clock', 'desk'
  ];

  let score = parts; // 6 to 26

  // Later tests in ETS TOEIC are slightly denser
  if (testNum <= 5) score -= 1.0;
  else if (testNum >= 25) score += 1.0;

  if (c2Keywords.some(k => topic.includes(k))) score += 6.5;
  else if (c1Keywords.some(k => topic.includes(k))) score += 4.0;
  else if (b2Keywords.some(k => topic.includes(k))) score += 2.0;
  else if (b1Keywords.some(k => topic.includes(k))) score += 0.5;
  else if (a2Keywords.some(k => topic.includes(k))) score -= 1.8;
  else if (a1Keywords.some(k => topic.includes(k))) score -= 3.5;

  if (score < 8.5) return 'A1';
  if (score < 11.5) return 'A2';
  if (score < 14.0) return 'B1';
  if (score < 17.0) return 'B2';
  if (score < 20.5) return 'C1';
  return 'C2';
}

const dist = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

// 1. Update summary object
summary.forEach(t => {
  t.lessons.forEach(l => {
    const lvl = classifyLesson(l, t.testNum);
    l.vocabLevel = lvl;
    dist[lvl]++;
  });
});

console.log('Classified distribution:', dist);

// 2. Replace summary in js/dailydictation-toeic-data.js
const newSummaryJson = JSON.stringify(summary, null, 2);
const updatedFileContent = content.replace(
  /const TOEIC_DICTATION_SUMMARY = (\[[\s\S]*?\]);\s*\n\s*\/\//,
  'const TOEIC_DICTATION_SUMMARY = ' + newSummaryJson + ';\n    \n    //'
);

fs.writeFileSync(summaryPath, updatedFileContent, 'utf8');
console.log('Updated js/dailydictation-toeic-data.js successfully.');

// 3. Update all data/dailydictation/test_*.json files
const dataDir = path.join(__dirname, '..', 'data', 'dailydictation');
if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir).filter(f => f.startsWith('test_') && f.endsWith('.json'));
  files.forEach(f => {
    const filePath = path.join(dataDir, f);
    const testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const testNum = testData.testNum;
    if (testData.lessons) {
      testData.lessons.forEach(l => {
        l.vocabLevel = classifyLesson(l, testNum);
      });
      fs.writeFileSync(filePath, JSON.stringify(testData, null, 2), 'utf8');
    }
  });
  console.log(`Updated ${files.length} test files in data/dailydictation.`);
}

// 4. Update www/js/dailydictation-toeic-data.js if it exists
const wwwSummaryPath = path.join(__dirname, '..', 'www', 'js', 'dailydictation-toeic-data.js');
if (fs.existsSync(wwwSummaryPath)) {
  fs.writeFileSync(wwwSummaryPath, updatedFileContent, 'utf8');
  console.log('Updated www/js/dailydictation-toeic-data.js successfully.');
}

console.log('All files updated successfully!');
