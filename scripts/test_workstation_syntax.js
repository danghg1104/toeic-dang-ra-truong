const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');

const mockWindow = {
  addEventListener: () => {},
  removeEventListener: () => {},
  AudioContext: class {
    createOscillator() { return { frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
    createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
  },
  savedVocabItems: []
};

try {
  const context = vm.createContext({ window: mockWindow });
  vm.runInContext(code, context);
  console.log('✅ Syntax Check PASSED! VocabGameWorkstation initialized:', !!context.window.VocabGameWorkstation);
  console.log('✅ CEFRClassifier initialized:', !!context.window.CEFRClassifier);
  console.log('Test classify "serendipity":', context.window.CEFRClassifier.classify('serendipity'));
  console.log('Test classify "water":', context.window.CEFRClassifier.classify('water'));
  console.log('Test classify "negotiate":', context.window.CEFRClassifier.classify('negotiate'));
} catch (e) {
  console.error('❌ Syntax check failed:', e);
  process.exit(1);
}
