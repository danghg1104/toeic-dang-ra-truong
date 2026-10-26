const fs = require('fs');

// Test basic CEFR classification logic
function testClassifier() {
  const sampleWords = [
    'water', 'house', 'happy', 'book', // A1
    'travel', 'flight', 'ticket', 'weather', // A2
    'convenient', 'experience', 'develop', 'schedule', // B1
    'negotiate', 'collaborate', 'innovative', 'sustainable', // B2
    'comprehensive', 'prerequisite', 'meticulous', 'ambiguous', // C1
    'serendipity', 'quintessential', 'ubiquitous', 'obfuscate' // C2
  ];

  console.log('Testing classifier on sample words:');
  sampleWords.forEach(w => {
    console.log(`- ${w}`);
  });
}

testClassifier();
