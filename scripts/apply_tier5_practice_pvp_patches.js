const fs = require('fs');

// 1. Patch js/authentic-document-templates.js
let doc = fs.readFileSync('js/authentic-document-templates.js', 'utf8');

// GAP-1.2: bodyHtml and messageHtml
doc = doc.replace(
  `const bodyHtml = d.bodyHtml || (d.body ? \`<p>\${this.escapeHtml(d.body).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>')}</p>\` : '<p>No content provided.</p>');`,
  `const bodyHtml = d.bodyHtml ? \`<p>\${this.escapeHtml(d.bodyHtml).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>')}</p>\` : (d.body ? \`<p>\${this.escapeHtml(d.body).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>')}</p>\` : '<p>No content provided.</p>');`
);

doc = doc.replace(
  `const messageHtml = d.messageHtml || (d.message || d.content ? \`<p>\${this.escapeHtml(d.message || d.content).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>')}</p>\` : '<p>Hello team, please see latest notice.</p>');`,
  `const messageHtml = d.messageHtml ? \`<p>\${this.escapeHtml(d.messageHtml).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>')}</p>\` : (d.message || d.content ? \`<p>\${this.escapeHtml(d.message || d.content).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>')}</p>\` : '<p>Hello team, please see latest notice.</p>');`
);

// GAP-1.3 & GAP-1.4: renderInvoice items null and non-numeric price
const oldRowsHtml = `    let subtotalNum = 0;
    const rowsHtml = items.map((it, idx) => {
      const itName = this.escapeHtml(it.name || it.description || 'Item ' + (idx + 1));
      const qty = Math.max(1, parseInt(it.quantity || it.qty, 10) || 1);
      const price = Number(it.unitPrice || it.price || 0);
      const amount = Number(it.amount || it.total || (qty * price));
      subtotalNum += amount;`;

const newRowsHtml = `    let subtotalNum = 0;
    const safeItems = (items || []).filter(it => it && typeof it === 'object');
    const rowsHtml = safeItems.map((it, idx) => {
      const itName = this.escapeHtml(it.name || it.description || 'Item ' + (idx + 1));
      const qty = Math.max(1, parseInt(it.quantity || it.qty, 10) || 1);
      const rawPrice = Number(it.unitPrice || it.price);
      const price = (!isNaN(rawPrice) && isFinite(rawPrice)) ? Math.max(0, rawPrice) : 0;
      const rawAmount = Number(it.amount || it.total);
      const amount = (!isNaN(rawAmount) && isFinite(rawAmount)) ? rawAmount : (qty * price);
      subtotalNum += amount;`;

if (doc.includes(oldRowsHtml)) {
  doc = doc.replace(oldRowsHtml, newRowsHtml);
  console.log('✅ Patched renderInvoice in js/authentic-document-templates.js');
}

// GAP-1.5: renderBoardingPass passenger String coerce
doc = doc.replace(
  `const passenger = this.escapeHtml((d.passenger || d.passengerName || 'DAVID MILLER').toUpperCase());`,
  `const passenger = this.escapeHtml(String(d.passenger || d.passengerName || 'DAVID MILLER').toUpperCase());`
);

fs.writeFileSync('js/authentic-document-templates.js', doc, 'utf8');
if (fs.existsSync('www/js/authentic-document-templates.js')) {
  fs.writeFileSync('www/js/authentic-document-templates.js', doc, 'utf8');
}
console.log('✅ Patched js/authentic-document-templates.js');

// 2. Patch js/toeic-listening-sync.js
let sync = fs.readFileSync('js/toeic-listening-sync.js', 'utf8');

// GAP-2.1: parseSegments null filter
const oldParse = `    if (Array.isArray(raw)) {
      return raw.map((item, idx) => ({`;

const newParse = `    if (Array.isArray(raw)) {
      return raw.filter(item => item && typeof item === 'object').map((item, idx) => ({`;

if (sync.includes(oldParse)) {
  sync = sync.replace(oldParse, newParse);
  console.log('✅ Patched parseSegments in js/toeic-listening-sync.js');
}

// GAP-2.5: renderKaraokeLines escapeHtml
const oldKaraoke = `      \${seg.speaker ? \`<div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">\${seg.speaker}</div>\` : ''}
      <div class="karaoke-text text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 transition-all leading-relaxed">
        \${seg.text}
      </div>`;

const newKaraoke = `      \${seg.speaker ? \`<div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">\${this.escapeHtml(seg.speaker)}</div>\` : ''}
      <div class="karaoke-text text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 transition-all leading-relaxed">
        \${this.escapeHtml(seg.text)}
      </div>`;

if (sync.includes(oldKaraoke)) {
  sync = sync.replace(oldKaraoke, newKaraoke);
  console.log('✅ Patched renderKaraokeLines in js/toeic-listening-sync.js');
}

// GAP-2.6: renderAccentBadge escape accent
sync = sync.replace(
  `onclick="if(typeof showToast==='function') showToast('\${pFlag} \${accent}: \${pTip}')"`,
  `onclick="if(typeof showToast==='function') showToast('\${pFlag} \${this.escapeHtml(accent)}: \${this.escapeHtml(pTip).replace(/'/g, \"\\\\'\")}')"`
);

fs.writeFileSync('js/toeic-listening-sync.js', sync, 'utf8');
if (fs.existsSync('www/js/toeic-listening-sync.js')) {
  fs.writeFileSync('www/js/toeic-listening-sync.js', sync, 'utf8');
}
console.log('✅ Patched js/toeic-listening-sync.js');

// 3. Patch js/one-page-cheat-sheet.js
let sheet = fs.readFileSync('js/one-page-cheat-sheet.js', 'utf8');

// GAP-4.2: studentHeader escaping
sheet = sheet.replace(
  `const studentHeader = \`Student: \${this.escapeHtml(student.name)} | Diagnostic: \${student.score} | Target: \${student.target}\`;`,
  `const studentHeader = \`Student: \${this.escapeHtml(String(student.name || 'Học viên'))} | Diagnostic: \${this.escapeHtml(String(student.score || 500))} | Target: \${this.escapeHtml(String(student.target || 650))}\`;`
);

// GAP-4.3: vocab array null filter
const oldVocabMap = `    const vocabHtml = vocabList.map(v => \``;
const newVocabMap = `    const safeVocabList = vocabList.filter(v => v && typeof v === 'object');
    const vocabHtml = safeVocabList.map(v => \``;

if (sheet.includes(oldVocabMap)) {
  sheet = sheet.replace(oldVocabMap, newVocabMap);
  console.log('✅ Patched vocabList map in js/one-page-cheat-sheet.js');
}

fs.writeFileSync('js/one-page-cheat-sheet.js', sheet, 'utf8');
if (fs.existsSync('www/js/one-page-cheat-sheet.js')) {
  fs.writeFileSync('www/js/one-page-cheat-sheet.js', sheet, 'utf8');
}
console.log('✅ Patched js/one-page-cheat-sheet.js');

// 4. Patch lib/pvp-arena-server.js
let pvp = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

// GAP-5.1: duplicate SUBMIT_ANSWER exploit prevention
const oldProcessAnsTop = `    processAnswer(ws, { matchId, wordIndex, answer, responseTimeMs }) {
        const match = this.activeMatches.get(matchId);
        if (!match || match.remainingSeconds <= 0) return;`;

const newProcessAnsTop = `    processAnswer(ws, { matchId, wordIndex, answer, responseTimeMs }) {
        const match = this.activeMatches.get(matchId);
        if (!match || match.remainingSeconds <= 0) return;

        const isP1 = match.player1.ws === ws;
        const player = isP1 ? match.player1 : match.player2;
        if (!player) return;

        if (!player.answeredIndices) player.answeredIndices = new Set();
        if (player.answeredIndices.has(wordIndex)) {
            return; // Reject duplicate answer submission for same word
        }
        player.answeredIndices.add(wordIndex);`;

if (pvp.includes(oldProcessAnsTop)) {
  pvp = pvp.replace(oldProcessAnsTop, newProcessAnsTop);
  console.log('✅ Patched duplicate SUBMIT_ANSWER in lib/pvp-arena-server.js');
}

fs.writeFileSync('lib/pvp-arena-server.js', pvp, 'utf8');
if (fs.existsSync('www/lib/pvp-arena-server.js')) {
  fs.writeFileSync('www/lib/pvp-arena-server.js', pvp, 'utf8');
}
console.log('✅ Patched lib/pvp-arena-server.js');

console.log('🎉 All 10 Tier 5 practice and PvP patches applied!');
