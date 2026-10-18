const fs = require('fs');
const path = require('path');

function cleanFormula(str) {
  if (!str || typeof str !== 'string') return str;
  let s = str;

  // 1. Arrows
  s = s.replace(/\\rightarrow/g, ' → ');
  s = s.replace(/\\leftarrow/g, ' ← ');

  // 2. Subscripts like V_{ed}, V_{bare}, V_{inf}, V_3, V_2 first
  s = s.replace(/V_\{?ed\}?/gi, 'V-ed');
  s = s.replace(/V_\{?bare\}?/gi, 'V (bare)');
  s = s.replace(/V_\{?inf\}?/gi, 'V (inf)');
  s = s.replace(/V_\{?3\}?/g, 'V3');
  s = s.replace(/V_\{?2\}?/g, 'V2');
  s = s.replace(/V_\{([^}]+)\}/g, 'V ($1)');

  // 3. Unwrap \text{...}, \mathbf{...}, \textbf{...}, \mathit{...} iteratively
  let prev;
  do {
    prev = s;
    s = s.replace(/\\(?:text|mathbf|textbf|mathit)\{([^{}]+)\}/g, '$1');
  } while (s !== prev);

  // 4. Any leftover V_something
  s = s.replace(/V_\{([^}]+)\}/g, 'V ($1)');

  // 5. Backslash spaces and dashes
  s = s.replace(/\\\s/g, ' ');
  s = s.replace(/\\-/g, '-');

  // 6. Remove any leftover backslashes
  s = s.replace(/\\/g, '');

  // 7. Remove $ math delimiters (preserving actual currency like $150)
  s = s.replace(/(^|[^0-9$])\$([^\d$])/g, '$1$2');
  s = s.replace(/([^\d$])\$(?=[^0-9$]|$)/g, '$1');
  s = s.replace(/^\$(?!\d)/, '');
  s = s.replace(/(?<!\d)\$$/, '');
  s = s.replace(/\$(?!\d)/g, '');

  // 8. Normalize spaces
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function deepClean(obj) {
  if (typeof obj === 'string') {
    return cleanFormula(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepClean);
  }
  if (obj && typeof obj === 'object') {
    const res = {};
    for (const k of Object.keys(obj)) {
      res[k] = deepClean(obj[k]);
    }
    return res;
  }
  return obj;
}

const dataDir = path.join(__dirname, 'grammar_data');
const groupFiles = [
  'group1_tenses.js',
  'group2_pos.js',
  'group3_verbs.js',
  'group4_prep.js',
  'group5_clauses.js',
  'group6_comp.js',
  'group7_special.js',
  'group8_vstep.js'
];

console.log('Cleaning grammar group files...');
groupFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  delete require.cache[require.resolve(filePath)];
  const rawData = require(filePath);
  const cleanedData = deepClean(rawData);
  const fileContent = `module.exports = ${JSON.stringify(cleanedData, null, 2)};\n`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Cleaned ${file}: ${cleanedData.length} topics updated.`);
});

console.log('Rebuilding grammar database bundle...');
require('./build_all_grammar.js');
console.log('All grammar data successfully cleaned and rebuilt!');
