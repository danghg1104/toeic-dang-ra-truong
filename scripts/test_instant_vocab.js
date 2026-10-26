const service = require('../lib/vocab-ai-service');
const t0 = Date.now();

service.generateAIVocabularyList('Du lịch', 'B1', 10, (res1) => {
  console.log('1. Du lịch completed in:', (Date.now() - t0) + 'ms, source:', res1.source, 'count:', res1.words.length);
});

service.generateAIVocabularyList('travel', 'B2', 10, (res2) => {
  console.log('2. travel (English) completed in:', (Date.now() - t0) + 'ms, source:', res2.source, 'count:', res2.words.length);
});

service.generateAIVocabularyList('Job Interview', 'B2', 10, (res3) => {
  console.log('3. Job Interview (English) completed in:', (Date.now() - t0) + 'ms, source:', res3.source, 'count:', res3.words.length);
});

service.generateAIVocabularyList('Thế giới Totoro & Ghibli', 'B1', 10, (res4) => {
  console.log('4. Ghibli completed in:', (Date.now() - t0) + 'ms, source:', res4.source, 'count:', res4.words.length);
});
