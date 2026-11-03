const fs = require('fs');

// 1. Patch js/fsrs-v5-engine.js
let fsrs = fs.readFileSync('js/fsrs-v5-engine.js', 'utf8');

// A. calcInterval guard against NaN or degenerate targetRetention
const oldCalcInterval = `    calcInterval(stability, targetRetention = 0.90) {
      const s = Math.max(0.1, Number(stability) || 0.1);
      if (targetRetention === 0.90) {
        return Math.max(1, Math.round(s));
      }
      const factor = 19.0 / 9.0;
      const power = 0.5;
      const days = (s / factor) * (Math.pow(targetRetention, -1 / power) - 1);
      return Math.max(1, Math.round(days));
    }`;

const newCalcInterval = `    calcInterval(stability, targetRetention = 0.90) {
      const s = (typeof stability === 'number' && !isNaN(stability) && isFinite(stability))
        ? Math.max(0.1, stability)
        : 0.1;
      let r = (typeof targetRetention === 'number' && !isNaN(targetRetention) && isFinite(targetRetention))
        ? targetRetention
        : 0.90;
      r = Math.max(0.01, Math.min(0.99, r));
      if (Math.abs(r - 0.90) < 1e-6) {
        return Math.max(1, Math.round(s));
      }
      const factor = 19.0 / 9.0;
      const power = 0.5;
      const days = (s / factor) * (Math.pow(r, -1 / power) - 1);
      return (isNaN(days) || !isFinite(days)) ? Math.max(1, Math.round(s)) : Math.max(1, Math.round(days));
    }`;

if (fsrs.includes(oldCalcInterval)) {
  fsrs = fsrs.replace(oldCalcInterval, newCalcInterval);
  console.log('✅ Patched calcInterval in js/fsrs-v5-engine.js');
}

// B. sanitizeCard infinity clamp
const oldSanitizeCard = `      const difficulty = (typeof card.difficulty === 'number' && !isNaN(card.difficulty))
        ? this.clamp(card.difficulty, 1.0, 10.0)
        : 4.5;
      const stability = (typeof card.stability === 'number' && !isNaN(card.stability))
        ? Math.max(0.1, card.stability)
        : 3.17;`;

const newSanitizeCard = `      const difficulty = (typeof card.difficulty === 'number' && !isNaN(card.difficulty) && isFinite(card.difficulty))
        ? this.clamp(card.difficulty, 1.0, 10.0)
        : 4.5;
      const stability = (typeof card.stability === 'number' && !isNaN(card.stability) && isFinite(card.stability))
        ? Math.max(0.1, Math.min(36500, card.stability))
        : 3.17;`;

if (fsrs.includes(oldSanitizeCard)) {
  fsrs = fsrs.replace(oldSanitizeCard, newSanitizeCard);
  console.log('✅ Patched sanitizeCard in js/fsrs-v5-engine.js');
}

fs.writeFileSync('js/fsrs-v5-engine.js', fsrs, 'utf8');
if (fs.existsSync('www/js/fsrs-v5-engine.js')) {
  fs.writeFileSync('www/js/fsrs-v5-engine.js', fsrs, 'utf8');
}

// 2. Patch js/toeic-adaptive-engine.js
let adp = fs.readFileSync('js/toeic-adaptive-engine.js', 'utf8');

// A. startTest(options)
const oldStartTest = `    startTest(options = {}) {
      this.reset();
      this.startTime = Date.now();
      if (options.maxTimeSeconds) this.maxTimeSeconds = options.maxTimeSeconds;`;

const newStartTest = `    startTest(options = {}) {
      this.reset();
      this.startTime = Date.now();
      const opts = (options && typeof options === 'object') ? options : {};
      if (opts.maxTimeSeconds) this.maxTimeSeconds = opts.maxTimeSeconds;`;

if (adp.includes(oldStartTest)) {
  adp = adp.replace(oldStartTest, newStartTest);
  console.log('✅ Patched startTest in js/toeic-adaptive-engine.js');
}

// B. submitAnswer curQ assignment
const oldSubmitAns = `      const curQ = this.currentQuestion;
      if (!curQ || curQ.id !== qId) {
        // Fallback find question by id
        const found = this.pool.find(q => q.id === qId);
        if (!found) {
          throw new Error(\`[ToeicAdaptiveEngine] Question ID \${qId} not found in pool\`);
        }
      }`;

const newSubmitAns = `      let curQ = this.currentQuestion;
      if (!curQ || curQ.id !== qId) {
        // Fallback find question by id
        const found = this.pool.find(q => q.id === qId);
        if (!found) {
          throw new Error(\`[ToeicAdaptiveEngine] Question ID \${qId} not found in pool\`);
        }
        curQ = found;
      }`;

if (adp.includes(oldSubmitAns)) {
  adp = adp.replace(oldSubmitAns, newSubmitAns);
  console.log('✅ Patched submitAnswer in js/toeic-adaptive-engine.js');
}

fs.writeFileSync('js/toeic-adaptive-engine.js', adp, 'utf8');
if (fs.existsSync('www/js/toeic-adaptive-engine.js')) {
  fs.writeFileSync('www/js/toeic-adaptive-engine.js', adp, 'utf8');
}

// 3. Patch js/toeic-radar-chart.js
let radar = fs.readFileSync('js/toeic-radar-chart.js', 'utf8');

// A. predictOverTarget
const oldPredict = `      const score = Math.min(990, Math.max(10, Number(currentScore) || 500));
      const delta = ToeicRadarChart.calcVelocityGain(daysUntilExam, dailyHours);
      const mu = score + delta;
      const sigma = 32.0; // Standard combined std deviation (test variability + prep factor)
      const targetScore = Number(target) || 650;

      const z = (mu - targetScore) / (sigma * Math.SQRT2);`;

const newPredict = `      const score = Math.min(990, Math.max(10, Number(currentScore) || 500));
      const delta = ToeicRadarChart.calcVelocityGain(daysUntilExam, dailyHours);
      const mu = score + delta;
      const sigma = 32.0; // Standard combined std deviation (test variability + prep factor)
      const targetScore = (typeof target === 'number' && !isNaN(target)) ? target : 650;
      if (targetScore <= 0) return 100;
      if (targetScore >= 1500) return 0;

      const z = (mu - targetScore) / (sigma * Math.SQRT2);`;

if (radar.includes(oldPredict)) {
  radar = radar.replace(oldPredict, newPredict);
  console.log('✅ Patched predictOverTarget in js/toeic-radar-chart.js');
}

// B. generateWeeklyReport filter null
const oldFilter = `      // Filter activities in 7-day rolling window
      const recentLogs = activityLogs.filter(log => {
        const ts = log.timestamp || log.time || log.date;
        return !ts || Number(ts) >= sevenDaysAgo;
      });`;

const newFilter = `      // Filter activities in 7-day rolling window
      const recentLogs = activityLogs.filter(log => {
        if (!log || typeof log !== 'object') return false;
        const ts = log.timestamp || log.time || log.date;
        return !ts || Number(ts) >= sevenDaysAgo;
      });`;

if (radar.includes(oldFilter)) {
  radar = radar.replace(oldFilter, newFilter);
  console.log('✅ Patched generateWeeklyReport in js/toeic-radar-chart.js');
}

fs.writeFileSync('js/toeic-radar-chart.js', radar, 'utf8');
if (fs.existsSync('www/js/toeic-radar-chart.js')) {
  fs.writeFileSync('www/js/toeic-radar-chart.js', radar, 'utf8');
}

console.log('🎉 All Tier 5 algorithm patches applied!');
