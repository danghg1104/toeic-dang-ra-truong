const fs = require('fs');

try {
  const content = fs.readFileSync('js/dictionary-data.js', 'utf8');
  const sandbox = { window: {} };
  const fn = new Function('window', content);
  fn(sandbox.window);
  const words = Object.keys(sandbox.window.dictionaryData || {});
  console.log('Total words in window.dictionaryData:', words.length);
  console.log('Sample words:', words.slice(0, 30));
} catch (e) {
  console.error('Error loading dictionary-data.js:', e);
}
