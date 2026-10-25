// Test DP segmentation
const COMMON_WORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
  'out', 'off', 'down', 'away', 'back', 'under', 'through', 'between', 'against', 'during', 'without', 'before',
  'head', 'heads', 'state', 'states', 'run', 'runs', 'running', 'ran', 'look', 'looks', 'looked', 'looking',
  'forward', 'carry', 'carries', 'carried', 'carrying', 'take', 'takes', 'took', 'taken', 'taking', 'care',
  'point', 'points', 'view', 'views', 'matter', 'matters', 'fact', 'facts', 'word', 'words', 'mouth',
  'rule', 'rules', 'thumb', 'cost', 'costs', 'living', 'standard', 'standards', 'break', 'through', 'breakthrough',
  'real', 'estate', 'part', 'time', 'full', 'job', 'market', 'economic', 'economy', 'growth',
  'social', 'distancing', 'project', 'manager', 'management', 'contract', 'contracts', 'require', 'required',
  'compete', 'competitive', 'apply', 'applied', 'negotiate', 'negotiated', 'succeed', 'hello', 'good', 'morning',
  'afternoon', 'evening', 'night', 'hand', 'made', 'well', 'known', 'high', 'tech', 'free', 'lance', 'overtime'
]);

function segmentJoinedWords(input) {
  const str = input.toLowerCase().replace(/[^a-z]/g, '');
  if (str.length < 5) return [input];

  const n = str.length;
  // dp[i] holds array of tokens for str[0...i-1] with highest score
  const dp = Array(n + 1).fill(null);
  const score = Array(n + 1).fill(-Infinity);

  dp[0] = [];
  score[0] = 0;

  for (let i = 0; i < n; i++) {
    if (dp[i] === null) continue;

    for (let j = i + 1; j <= n; j++) {
      const word = str.slice(i, j);
      if (COMMON_WORDS.has(word)) {
        // Scoring: longer words preferred, single letters penalised unless 'a'
        let wordScore = word.length * 2;
        if (word.length === 1 && word !== 'a') wordScore -= 10;
        
        const newScore = score[i] + wordScore - 2; // penalty for each word count
        if (newScore > score[j]) {
          score[j] = newScore;
          dp[j] = [...dp[i], word];
        }
      }
    }
  }

  return dp[n] || [input];
}

console.log('headsofstate ->', segmentJoinedWords('headsofstate').join(' '));
console.log('runoutof ->', segmentJoinedWords('runoutof').join(' '));
console.log('lookforwardto ->', segmentJoinedWords('lookforwardto').join(' '));
console.log('carryout ->', segmentJoinedWords('carryout').join(' '));
console.log('economicgrowth ->', segmentJoinedWords('economicgrowth').join(' '));
