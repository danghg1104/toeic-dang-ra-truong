const path = require('path');
const Preprocess = require(path.join(__dirname, '../lib/dictionary/preprocess.js'));

console.log('Testing Preprocess Pipeline:');

const testCases = [
  'headsofstate',
  'heads of state',
  'runoutof',
  'running out of',
  'lookforwardto',
  'look forward to',
  'matrices',
  'children',
  'better',
  'recieve',
  'negociate'
];

testCases.forEach(tc => {
  const res = Preprocess.processInput(tc);
  console.log(`Input: "${tc}" => isSeg: ${res.isSegmented}, seg: "${res.segmented}", isLemma: ${res.isLemma}, lemma: "${res.lemma}", canonical: "${res.canonicalQuery}"`);
});

const typoRecieve = Preprocess.findFuzzySuggestions('recieve');
console.log('Fuzzy for "recieve":', typoRecieve);
