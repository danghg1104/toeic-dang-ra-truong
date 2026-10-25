const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('function startQuickQuiz') || l.includes('function renderQuizQuestion') || l.includes('function selectQuizOption') || l.includes('function openFullPartPracticeModal')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});
