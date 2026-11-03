/**
 * 7-Axis Competency Radar Chart & Score Predictor Engine
 * TOEIC Master (noble-franklin)
 * 
 * Features:
 * - F11: 7-Axis Competency Radar Chart (Parts 1–7) with glowing orange weak-part alert
 * - F12: Real Test Score Predictor using Gaussian Normal CDF
 * - F13: Weekly Progress Report Generator
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ToeicRadarChart = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const PART_METADATA = [
    { part: 1, name: 'Part 1: Photographs', short: 'P1 Ảnh', section: 'listening', targetQuestions: 6 },
    { part: 2, name: 'Part 2: Question-Response', short: 'P2 Hỏi-Đáp', section: 'listening', targetQuestions: 25 },
    { part: 3, name: 'Part 3: Conversations', short: 'P3 Hội thoại', section: 'listening', targetQuestions: 39 },
    { part: 4, name: 'Part 4: Short Talks', short: 'P4 Bài nói', section: 'listening', targetQuestions: 30 },
    { part: 5, name: 'Part 5: Incomplete Sentences', short: 'P5 Điền câu', section: 'reading', targetQuestions: 30 },
    { part: 6, name: 'Part 6: Text Completion', short: 'P6 Đoạn văn', section: 'reading', targetQuestions: 16 },
    { part: 7, name: 'Part 7: Reading Comprehension', short: 'P7 Đọc hiểu', section: 'reading', targetQuestions: 54 }
  ];

  class ToeicRadarChart {
    constructor(options = {}) {
      this.radius = options.radius || 120;
      this.cx = options.cx || 150;
      this.cy = options.cy || 150;
      this.width = options.width || 300;
      this.height = options.height || 300;
      this.theme = options.theme || 'indigo';
    }

    // =========================================================================
    // 1. GEOMETRIC 7-AXIS RADAR ENGINE (FEATURE F11)
    // =========================================================================

    /**
     * Compute vertex coordinates for 7 equilateral axes
     * alpha_p = -pi/2 + p * (2*pi / 7)
     * @param {Array|Object} masteries Array of 7 values or map { 1: m1, ..., 7: m7 }
     * @param {number} [radius=120] 
     * @param {number} [cx=150] 
     * @param {number} [cy=150] 
     * @returns {Array<Object>} Vertex objects with coordinates and mastery
     */
    static getVertices(masteries, radius = 120, cx = 150, cy = 150) {
      const vertices = [];
      const normalized = ToeicRadarChart.normalizeMasteries(masteries);
      const weakParts = ToeicRadarChart.findWeakParts(normalized);

      for (let p = 0; p < 7; p++) {
        const alpha = -Math.PI / 2 + p * ((2 * Math.PI) / 7);
        const m = normalized[p];
        const x = cx + radius * m * Math.cos(alpha);
        const y = cy + radius * m * Math.sin(alpha);
        const isWeak = weakParts.includes(p + 1);

        vertices.push({
          part: p + 1,
          meta: PART_METADATA[p],
          alpha,
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          mastery: m,
          isWeak
        });
      }
      return vertices;
    }

    /**
     * Normalize masteries input to array of 7 numbers in [0.0, 1.0]
     */
    static normalizeMasteries(masteries) {
      const res = [];
      for (let p = 0; p < 7; p++) {
        let val;
        if (Array.isArray(masteries)) {
          val = masteries[p];
        } else if (masteries && typeof masteries === 'object') {
          val = masteries[p + 1] !== undefined ? masteries[p + 1] : masteries[String(p + 1)];
        }
        const num = Number(val);
        if (isNaN(num) || !isFinite(num) || num === null || num === undefined) {
          res.push(0.0);
        } else {
          // If given as percentage > 1 (e.g. 75 instead of 0.75), scale down
          const scaled = num > 1.0 ? num / 100.0 : num;
          res.push(Math.max(0.0, Math.min(1.0, scaled)));
        }
      }
      return res;
    }

    /**
     * Identify weak parts: Any part with score < 60% OR minimum part
     * Tied lowest parts all receive weak status
     * @param {Array|Object} masteries 
     * @returns {Array<number>} Sorted array of 1-based part numbers
     */
    static findWeakParts(masteries) {
      const normalized = ToeicRadarChart.normalizeMasteries(masteries);
      let minIdx = 0;
      let minVal = normalized[0] !== undefined ? normalized[0] : 1.0;
      const weak = [];

      for (let p = 0; p < 7; p++) {
        const val = normalized[p];
        if (val < minVal) {
          minVal = val;
          minIdx = p;
        }
        if (val < 0.60) {
          weak.push(p + 1);
        }
      }

      // Ensure minimum part is included
      if (!weak.includes(minIdx + 1)) {
        weak.push(minIdx + 1);
      }

      // Check for tied lowest parts
      for (let p = 0; p < 7; p++) {
        if (Math.abs(normalized[p] - minVal) < 0.0001 && !weak.includes(p + 1)) {
          weak.push(p + 1);
        }
      }

      return weak.sort((a, b) => a - b);
    }

    /**
     * Generate SVG markup for the 7-axis radar chart
     * @param {Array|Object} masteries 
     * @param {Object} [options] 
     * @returns {string} SVG HTML string
     */
    static generateSVG(masteries, options = {}) {
      const radius = options.radius || 110;
      const cx = options.cx || 150;
      const cy = options.cy || 150;
      const width = options.width || 300;
      const height = options.height || 300;
      const showLabels = options.showLabels !== false;

      const normalized = ToeicRadarChart.normalizeMasteries(masteries);
      const vertices = ToeicRadarChart.getVertices(normalized, radius, cx, cy);
      const weakParts = ToeicRadarChart.findWeakParts(normalized);

      // Web rings (20%, 40%, 60%, 80%, 100%)
      const webRings = [0.2, 0.4, 0.6, 0.8, 1.0].map(ratio => {
        const ringPts = [];
        for (let p = 0; p < 7; p++) {
          const a = -Math.PI / 2 + p * ((2 * Math.PI) / 7);
          const rx = cx + radius * ratio * Math.cos(a);
          const ry = cy + radius * ratio * Math.sin(a);
          ringPts.push(`${rx.toFixed(2)},${ry.toFixed(2)}`);
        }
        const strokeColor = ratio === 0.6 ? 'rgba(249, 115, 22, 0.35)' : 'rgba(148, 163, 184, 0.25)';
        const strokeDash = ratio === 0.6 ? 'stroke-dasharray="3,3"' : '';
        return `<polygon points="${ringPts.join(' ')}" fill="none" stroke="${strokeColor}" stroke-width="${ratio === 1.0 ? 1.5 : 1}" ${strokeDash} />`;
      }).join('\n');

      // Radial axis lines
      const axisLines = [];
      const labelElements = [];
      for (let p = 0; p < 7; p++) {
        const a = -Math.PI / 2 + p * ((2 * Math.PI) / 7);
        const endX = cx + radius * Math.cos(a);
        const endY = cy + radius * Math.sin(a);
        const isWeak = weakParts.includes(p + 1);

        axisLines.push(`<line x1="${cx}" y1="${cy}" x2="${endX.toFixed(2)}" y2="${endY.toFixed(2)}" stroke="${isWeak ? 'rgba(249,115,22,0.4)' : 'rgba(148, 163, 184, 0.3)'}" stroke-width="1" />`);

        if (showLabels) {
          const labelDist = radius + 22;
          const lx = cx + labelDist * Math.cos(a);
          const ly = cy + labelDist * Math.sin(a) + 4;
          const textAnchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end');
          const partPct = Math.round(normalized[p] * 100);
          const labelColor = isWeak ? '#F97316' : '#64748B';
          const labelFontWeight = isWeak ? 'bold' : 'normal';

          labelElements.push(`
            <text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="${textAnchor}" fill="${labelColor}" font-size="10" font-weight="${labelFontWeight}" font-family="system-ui, sans-serif" class="radar-label" data-part="${p + 1}">
              P${p + 1} (${partPct}%)
            </text>
          `);
        }
      }

      // User Mastery Polygon
      const polygonPoints = vertices.map(v => `${v.x},${v.y}`).join(' ');

      // Glowing vertex markers
      const vertexMarkers = vertices.map(v => {
        if (v.isWeak) {
          return `
            <g class="weak-vertex-pulse" data-part="${v.part}">
              <circle cx="${v.x}" cy="${v.y}" r="8" fill="rgba(249, 115, 22, 0.25)" class="animate-ping" />
              <circle cx="${v.x}" cy="${v.y}" r="5" fill="#F97316" stroke="#FFFFFF" stroke-width="2" />
            </g>
          `;
        }
        return `<circle cx="${v.x}" cy="${v.y}" r="4" fill="#6366F1" stroke="#FFFFFF" stroke-width="1.5" data-part="${v.part}" />`;
      }).join('\n');

      return `
        <svg viewBox="0 0 ${width} ${height}" class="toeic-radar-svg w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6366F1" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.15" />
            </radialGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g class="radar-web">
            ${webRings}
            ${axisLines.join('\n')}
          </g>
          <polygon points="${polygonPoints}" fill="url(#radarFillGrad)" stroke="#4F46E5" stroke-width="2.5" stroke-linejoin="round" />
          <g class="radar-vertices">
            ${vertexMarkers}
          </g>
          <g class="radar-labels">
            ${labelElements.join('\n')}
          </g>
        </svg>
      `;
    }

    /**
     * Render radar chart into a DOM element (container or canvas)
     * @param {HTMLElement|string} containerOrId 
     * @param {Array|Object} masteries 
     * @param {Object} [options] 
     */
    static render(containerOrId, masteries, options = {}) {
      if (typeof document === 'undefined') {
        return ToeicRadarChart.generateSVG(masteries, options);
      }

      const el = typeof containerOrId === 'string'
        ? document.getElementById(containerOrId) || document.querySelector(containerOrId)
        : containerOrId;

      if (!el) {
        console.warn(`[ToeicRadarChart] Target container "${containerOrId}" not found in DOM`);
        return null;
      }

      const svgHtml = ToeicRadarChart.generateSVG(masteries, options);
      const normalized = ToeicRadarChart.normalizeMasteries(masteries);
      const weakParts = ToeicRadarChart.findWeakParts(normalized);

      let weakNoticeHtml = '';
      if (options.showLegend !== false) {
        const weakBadges = weakParts.map(p => {
          const meta = PART_METADATA[p - 1];
          const pct = Math.round(normalized[p - 1] * 100);
          return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <i class="fa-solid fa-triangle-exclamation text-[11px]"></i> Part ${p} (${pct}%): ⚠️ Cần củng cố gấp
          </span>`;
        }).join(' ');

        weakNoticeHtml = `
          <div class="radar-legend mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            ${weakBadges}
          </div>
        `;
      }

      el.innerHTML = `
        <div class="radar-chart-wrapper relative flex flex-col items-center">
          ${svgHtml}
          ${weakNoticeHtml}
        </div>
      `;

      // Attach optional click callback
      if (typeof options.onPartClick === 'function') {
        const markers = el.querySelectorAll('[data-part]');
        markers.forEach(m => {
          m.style.cursor = 'pointer';
          m.addEventListener('click', (ev) => {
            const p = parseInt(m.getAttribute('data-part'), 10);
            options.onPartClick(p, normalized[p - 1], PART_METADATA[p - 1], ev);
          });
        });
      }

      return el;
    }

    // =========================================================================
    // 2. GAUSSIAN REAL TEST SCORE PREDICTION (FEATURE F12)
    // =========================================================================

    /**
     * Abramowitz and Stegun error function approximation
     * Maximum error: 1.5 x 10^-7
     */
    static erf(x) {
      const a1 =  0.254829592;
      const a2 = -0.284496736;
      const a3 =  1.421413741;
      const a4 = -1.453152027;
      const a5 =  1.061405429;
      const p  =  0.3275911;

      const sign = x < 0 ? -1 : 1;
      const absX = Math.abs(x);
      const t = 1.0 / (1.0 + p * absX);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
      return sign * y;
    }

    /**
     * Calculate base score from listening and reading accuracy
     */
    static calcBaseScore(listeningAcc, readingAcc) {
      const lScore = Math.round((Number(listeningAcc) || 0) * 495);
      const rScore = Math.round((Number(readingAcc) || 0) * 495);
      return Math.min(990, Math.max(10, lScore + rScore));
    }

    /**
     * Calculate velocity gain Delta = days * hours * 1.25 pts/hr
     */
    static calcVelocityGain(daysUntilExam = 30, dailyHours = 1.5) {
      const days = Math.max(0, Number(daysUntilExam) || 0);
      const hours = Math.max(0, Number(dailyHours) || 0);
      return days * hours * 1.25;
    }

    /**
     * Predict probability of achieving score >= target on real exam
     * Models score as Gaussian distribution N(mu + Delta, sigma^2)
     * P(Score >= T) = 0.5 * (1 + erf((mu + Delta - T) / (sigma * sqrt(2))))
     * 
     * @param {number} currentScore Current estimated score [10, 990]
     * @param {number} [daysUntilExam=30] 
     * @param {number} [dailyHours=1.5] 
     * @param {number} [target=650] Target score threshold (default 650)
     * @returns {number} Probability percentage clamped in [0, 100]
     */
    static predictOverTarget(currentScore, daysUntilExam = 30, dailyHours = 1.5, target = 650) {
      const score = Math.min(990, Math.max(10, Number(currentScore) || 500));
      const delta = ToeicRadarChart.calcVelocityGain(daysUntilExam, dailyHours);
      const mu = score + delta;
      const sigma = 32.0; // Standard combined std deviation (test variability + prep factor)
      const targetScore = (typeof target === 'number' && !isNaN(target)) ? target : (Number(target) || 650);
      if (targetScore <= 0) return 100;
      if (targetScore >= 1500) return 0;

      const z = (mu - targetScore) / (sigma * Math.SQRT2);
      const prob = 0.5 * (1.0 + ToeicRadarChart.erf(z));
      const pct = Math.round(prob * 100);

      return Math.min(100, Math.max(0, pct));
    }

    /**
     * Predict from 7-axis part proficiencies
     */
    static predictFromProficiencies(partProficiencies, daysUntilExam = 30, dailyHours = 1.5, target = 650) {
      const norm = ToeicRadarChart.normalizeMasteries(partProficiencies);
      const listeningAcc = (norm[0] * 6 + norm[1] * 25 + norm[2] * 39 + norm[3] * 30) / 100;
      const readingAcc = (norm[4] * 30 + norm[5] * 16 + norm[6] * 54) / 100;
      const baseScore = ToeicRadarChart.calcBaseScore(listeningAcc, readingAcc);
      return {
        baseScore,
        listeningScore: Math.round(listeningAcc * 495),
        readingScore: Math.round(readingAcc * 495),
        target,
        probabilityOverTarget: ToeicRadarChart.predictOverTarget(baseScore, daysUntilExam, dailyHours, target)
      };
    }

    // =========================================================================
    // 3. WEEKLY PROGRESS REPORT GENERATOR (FEATURE F13)
    // =========================================================================

    /**
     * Generate weekly summary report over 7-day rolling window
     * @param {Array} activityLogs Array of daily/session activity records
     * @param {Object} [options] 
     */
    static generateWeeklyReport(rawLogs = [], options = {}) {
      const activityLogs = (Array.isArray(rawLogs) ? rawLogs : []).filter(l => l && typeof l === 'object');
      if (activityLogs.length === 0) {
        return {
          isEmpty: true,
          weekStart: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
          questionsCount: 0,
          correctCount: 0,
          accuracy: 0,
          streak: 0,
          estimatedScore: 500,
          bestPart: null,
          worstPart: null,
          message: 'Chưa có hoạt động học tập nào trong 7 ngày qua. Hãy bắt đầu ngay!'
        };
      }

      const validLogs = (activityLogs || []).filter(l => l && typeof l === 'object');
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 86400000;

      // Filter activities in 7-day rolling window
      const recentLogs = validLogs.filter(log => {
        const ts = log.timestamp || log.time || log.date;
        return !ts || Number(ts) >= sevenDaysAgo;
      });

      let totalQuestions = 0;
      let totalCorrect = 0;
      const partCorrect = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
      const partTotal = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
      const trapMistakes = {};

      recentLogs.forEach(log => {
        const qCount = Number(log.questionsCount || log.count || (log.answers ? log.answers.length : 1)) || 0;
        const cCount = Number(log.correctCount || log.correct || 0);
        totalQuestions += qCount;
        totalCorrect += cCount;

        if (log.part && partTotal[log.part] !== undefined) {
          partTotal[log.part] += qCount;
          partCorrect[log.part] += cCount;
        }

        if (log.trapCategory) {
          trapMistakes[log.trapCategory] = (trapMistakes[log.trapCategory] || 0) + 1;
        }
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      // Calculate streak from activity logs
      let streak = 0;
      // Sort logs descending by timestamp
      const sortedByTime = validLogs
        .map(l => Number(l.timestamp || l.time || Date.now()))
        .sort((a, b) => b - a);

      if (sortedByTime.length > 0) {
        const mostRecent = sortedByTime[0];
        // Streak is broken if gap between now and most recent activity exceeds 48 hours
        if ((now - mostRecent) < 48 * 3600 * 1000) {
          // Count active calendar days
          const daysSet = new Set();
          sortedByTime.forEach(ts => {
            const dateStr = new Date(ts).toISOString().split('T')[0];
            daysSet.add(dateStr);
          });
          streak = Math.min(daysSet.size, 30);
        }
      }
      if (options.manualStreak !== undefined) {
        streak = options.manualStreak;
      }

      // Determine best improved/highest accuracy Part
      let bestPart = 5;
      let bestAcc = -1;
      let worstPart = 1;
      let worstAcc = 999;
      for (let p = 1; p <= 7; p++) {
        if (partTotal[p] > 0) {
          const acc = partCorrect[p] / partTotal[p];
          if (acc > bestAcc) {
            bestAcc = acc;
            bestPart = p;
          }
          if (acc < worstAcc) {
            worstAcc = acc;
            worstPart = p;
          }
        }
      }

      // Most vulnerable trap
      let mostVulnerableTrap = 'TRAP-06';
      let maxTrapErrors = 0;
      Object.entries(trapMistakes).forEach(([trap, errCount]) => {
        if (errCount > maxTrapErrors) {
          maxTrapErrors = errCount;
          mostVulnerableTrap = trap;
        }
      });

      // Estimated score
      const estimatedScore = Math.min(990, Math.max(10, Math.round((accuracy / 100) * 980 + 10)));
      const message = `🔥 Streak ${streak} ngày! Điểm dự đoán tuần này: ${estimatedScore} (Tăng mạnh Part ${bestPart}). Cố lên!`;

      return {
        isEmpty: totalQuestions === 0,
        weekStart: new Date(sevenDaysAgo).toISOString().split('T')[0],
        questionsCount: totalQuestions,
        correctCount: totalCorrect,
        accuracy,
        streak,
        estimatedScore,
        bestPart,
        worstPart,
        mostVulnerableTrap,
        message,
        json: {
          week: new Date(sevenDaysAgo).toISOString().split('T')[0],
          questionsCount: totalQuestions,
          accuracy,
          streak,
          scoreEst: estimatedScore,
          bestPart
        }
      };
    }
  }

  // Bind static methods for convenient usage
  ToeicRadarChart.PART_METADATA = PART_METADATA;

  return ToeicRadarChart;
}));
