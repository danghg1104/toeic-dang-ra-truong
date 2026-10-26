const http = require('http');

const words = [
  'curios',
  'curio',
  'curious',
  'curiosity',
  'curiously',
  'supreme leaders',
  'supreme leader',
  'head of state meeting',
  'head of state',
  'head of government',
  'lease',
  'leasing',
  'lessor',
  'lessee'
];

async function checkWord(w) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000/api/dictionary/lookup?word=${encodeURIComponent(w)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ word: w, success: json.success, data: json.data, error: json.error });
        } catch (e) {
          resolve({ word: w, success: false, error: e.message });
        }
      });
    }).on('error', (err) => {
      resolve({ word: w, success: false, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing /api/dictionary/lookup endpoint...');
  for (const w of words) {
    const res = await checkWord(w);
    if (res.success && res.data) {
      console.log(`[PASS] "${w}":`);
      console.log(`       IPA: ${res.data.ipa?.us || res.data.phonetic}`);
      console.log(`       POS: ${res.data.partOfSpeech || res.data.pos}`);
      console.log(`       Vi:  ${res.data.vi || res.data.vietnameseMeaning}`);
      console.log(`       Source: ${res.data.fromTier1 ? 'Tier 1' : 'Tier 2/3'}`);
    } else {
      console.error(`[FAIL] "${w}":`, res.error || 'No data');
    }
  }
}

run();
