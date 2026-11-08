/**
 * TOEIC Listening Sync & Indirect Traps Engine (Features F2, F3, F23, F24 - R1, R7)
 * Implements:
 * 1. Karaoke Lyrics Sync (Timestamp boundaries, auto-scroll, text-fill progress)
 * 2. Accent Classifier Indicator (US/UK/AU/CA flags, phonological shift tips, multi-accent dialogues)
 * 3. Part 3 & 4 Complex Indirect Traps (Reversals, Speaker Intent, 3-Party, Graphic Matrix)
 * 4. 8-Second Golden Pre-Listening Protocol (Scan cues, synonym anticipation, target voice binding)
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ToeicListeningSync = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class ToeicListeningSync {
    constructor() {
      this.reversalRegex = /\b(wait|actually|on second thought|hold on|let's switch|instead|change of plans)\b/i;
      
      this.accentMap = {
        'US': { flag: '🇺🇸', name: 'US American', tip: 'Nuốt âm /t/ thành /d/ lướt (water -> wader) & Rhotic R (uốn lưỡi rõ âm /r/ cuối từ)' },
        'UK': { flag: '🇬🇧', name: 'UK British', tip: 'Nuốt âm /r/ cuối từ (car -> /kɑː/), âm /t/ phát âm rõ, Broad A (/ɑː/: fast, ask)' },
        'AU': { flag: '🇦🇺', name: 'AU Australian', tip: 'Biến âm /eɪ/ thành /aɪ/ (today -> /təˈdaɪ/, mate -> /maɪt/), ngữ điệu lên giọng cuối câu' },
        'CA': { flag: '🇨🇦', name: 'CA Canadian', tip: 'Canadian Raising (/aʊ/ & /aɪ/ nâng trước âm vô thanh: about, out, ice), phát âm /r/ rõ giống Mỹ' }
      };

      this.synonymDict = {
        'delay': ['pushed back', 'rescheduled', 'deferred', 'put off', 'held in abeyance'],
        'postpone': ['delay', 'push back', 'reschedule', 'defer', 'put off until'],
        'renovation': ['remodeling', 'refurbishment', 'overhaul', 'restoration'],
        'deficit': ['budget shortfall', 'overrun', 'in the red', 'financial gap'],
        'discount': ['promotional rate', 'reduced fee', 'concession', 'rebate', 'special price'],
        'inspect': ['walk through', 'tour the site', 'examine the premises', 'audit', 'assess'],
        'replacement': ['spare part', 'substitute hardware', 'backup unit', 'alternative']
      };

      this.activeTimer = null;
    }

    // =========================================================================
    // 1. KARAOKE LYRICS SYNC (Feature F23 - R7)
    // =========================================================================

    /**
     * Parse raw transcript array or formatted timestamped text
     * @param {Array|string} raw 
     * @returns {Array<{ id: number|string, start: number, end: number, speaker?: string, text: string }>}
     */
    parseSegments(raw) {
      if (Array.isArray(raw)) {
        return raw.filter(item => item && typeof item === 'object').map((item, idx) => ({
          id: item.id || (idx + 1),
          start: typeof item.start === 'number' ? item.start : parseFloat(item.start) || 0,
          end: typeof item.end === 'number' ? item.end : parseFloat(item.end) || 0,
          speaker: item.speaker || (item.role || 'Speaker'),
          text: String(item.text || item.line || '').trim()
        }));
      }

      if (typeof raw === 'string') {
        const lines = raw.split('\n');
        const parsed = [];
        let curTime = 0;

        lines.forEach((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return;

          // Check for format: [00:02.50 -> 00:05.80] Speaker: text or [00:02.50] text
          const rangeMatch = trimmed.match(/\[(\d+):(\d+\.?\d*)\s*(?:->|–|-)\s*(\d+):(\d+\.?\d*)\](?:\s*([^:]+):)?\s*(.*)/);
          if (rangeMatch) {
            const start = parseInt(rangeMatch[1], 10) * 60 + parseFloat(rangeMatch[2]);
            const end = parseInt(rangeMatch[3], 10) * 60 + parseFloat(rangeMatch[4]);
            const speaker = rangeMatch[5] ? rangeMatch[5].trim() : 'Speaker';
            const text = rangeMatch[6].trim();
            parsed.push({ id: idx + 1, start, end, speaker, text });
            return;
          }

          const singleMatch = trimmed.match(/\[(\d+):(\d+\.?\d*)\](?:\s*([^:]+):)?\s*(.*)/);
          if (singleMatch) {
            const start = parseInt(singleMatch[1], 10) * 60 + parseFloat(singleMatch[2]);
            const speaker = singleMatch[3] ? singleMatch[3].trim() : 'Speaker';
            const text = singleMatch[4].trim();
            const end = start + 3.0; // fallback default
            parsed.push({ id: idx + 1, start, end, speaker, text });
            return;
          }

          // Plain text fallback
          const duration = Math.max(2.5, trimmed.split(' ').length * 0.35);
          parsed.push({
            id: idx + 1,
            start: curTime,
            end: curTime + duration,
            speaker: 'Speaker',
            text: trimmed
          });
          curTime += duration + 0.5;
        });

        return parsed;
      }

      return [];
    }

    /**
     * Find segment matching current audio playback time
     * @param {number} currentTime Seconds
     * @param {Array} segments 
     * @returns {Object|null}
     */
    getActiveSegment(currentTime, segments) {
      if (!Array.isArray(segments) || isNaN(currentTime)) return null;
      const t = Number(currentTime);
      return segments.find(s => t >= s.start && t <= s.end) || null;
    }

    /**
     * Calculate 0..1 completion progress within the active line
     */
    calculateLineProgress(currentTime, start, end) {
      if (end <= start) return 1.0;
      const prog = (currentTime - start) / (end - start);
      return Math.min(1.0, Math.max(0.0, prog));
    }

    /**
     * Seek audio playback to given segment start time
     */
    seekToSegment(segment, audioElement) {
      if (!segment || typeof segment.start !== 'number') return;
      if (audioElement && typeof audioElement.currentTime === 'number') {
        audioElement.currentTime = segment.start;
        if (typeof audioElement.play === 'function') {
          audioElement.play().catch(() => {});
        }
      }
      return segment.start;
    }

    /**
     * Render interactive karaoke transcript DOM
     * @param {Array} segments 
     * @param {string|HTMLElement} container 
     * @param {Function} [onLineClick] 
     */
    renderKaraokeLines(segments, container, onLineClick) {
      const parent = typeof container === 'string' ? document.getElementById(container) : container;
      if (!parent) return '';

      const itemsHtml = segments.map((seg, idx) => {
        return `
          <div id="karaoke-line-${seg.id}" 
               data-segment-id="${seg.id}"
               data-start="${seg.start}"
               data-end="${seg.end}"
               class="karaoke-line group p-3 rounded-2xl border border-transparent hover:border-amber-400/50 hover:bg-amber-500/5 transition cursor-pointer flex items-start gap-3">
            <span class="w-14 shrink-0 font-mono text-[11px] text-slate-400 group-hover:text-amber-500 transition">
              ${this.formatTime(seg.start)}
            </span>
            <div class="flex-1 space-y-0.5">
              ${seg.speaker ? `<div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${this.escapeHtml(seg.speaker)}</div>` : ''}
              <div class="karaoke-text text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 transition-all leading-relaxed">
                ${this.escapeHtml(seg.text)}
              </div>
            </div>
          </div>
        `;
      }).join('');

      parent.innerHTML = itemsHtml;

      if (typeof onLineClick === 'function') {
        const lineEls = parent.querySelectorAll('.karaoke-line');
        lineEls.forEach((el, idx) => {
          el.addEventListener('click', () => {
            onLineClick(segments[idx], el);
          });
        });
      }

      return itemsHtml;
    }

    /**
     * Synchronize audio element with karaoke view
     * @param {HTMLAudioElement} audio 
     * @param {Array} segments 
     * @param {Object} options { container, onSegmentChange, onProgress }
     */
    bindAudio(audio, segments, options = {}) {
      if (!audio) return;
      let lastActiveId = null;

      const handler = () => {
        const curTime = audio.currentTime;
        const active = this.getActiveSegment(curTime, segments);

        if (active) {
          const prog = this.calculateLineProgress(curTime, active.start, active.end);

          if (active.id !== lastActiveId) {
            // Remove active class from previous
            if (options.container) {
              const cont = typeof options.container === 'string' ? document.getElementById(options.container) : options.container;
              if (cont) {
                const prev = cont.querySelector('.karaoke-active-line');
                if (prev) {
                  prev.classList.remove('karaoke-active-line', 'border-amber-500/40', 'bg-amber-500/10');
                }
                const curEl = cont.querySelector(`[data-segment-id="${active.id}"]`);
                if (curEl) {
                  curEl.classList.add('karaoke-active-line', 'border-amber-500/40', 'bg-amber-500/10');
                  if (typeof curEl.scrollIntoView === 'function') {
                    curEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              }
            }

            lastActiveId = active.id;
            if (typeof options.onSegmentChange === 'function') {
              options.onSegmentChange(active);
            }
          }

          if (typeof options.onProgress === 'function') {
            options.onProgress(prog, active);
          }
        }
      };

      audio.addEventListener('timeupdate', handler);
      return () => audio.removeEventListener('timeupdate', handler);
    }

    formatTime(sec) {
      if (!Number.isFinite(sec) || sec < 0) return '00:00';
      const s = Math.max(0, Math.floor(sec || 0));
      const m = Math.floor(s / 60);
      const rem = s % 60;
      return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    }

    // =========================================================================
    // 2. ACCENT CLASSIFIER INDICATOR (Feature F24 - R7)
    // =========================================================================

    /**
     * Extract accent metadata from audio item
     */
    extractAccent(item) {
      if (!item || typeof item !== 'object') return { accent: 'US', secondaryAccent: null };
      const raw = String(item.accent || 'US').trim().toUpperCase();
      let accent = 'US';
      if (raw.includes('UK') || raw.includes('GB')) accent = 'UK';
      else if (raw.includes('AU')) accent = 'AU';
      else if (raw.includes('CA')) accent = 'CA';
      else if (raw.includes('US')) accent = 'US';

      const secRaw = item.secondaryAccent ? String(item.secondaryAccent).trim().toUpperCase() : null;
      let secondaryAccent = null;
      if (secRaw) {
        if (secRaw.includes('UK') || secRaw.includes('GB')) secondaryAccent = 'UK';
        else if (secRaw.includes('AU')) secondaryAccent = 'AU';
        else if (secRaw.includes('CA')) secondaryAccent = 'CA';
        else if (secRaw.includes('US')) secondaryAccent = 'US';
      }

      return { accent, secondaryAccent };
    }

    /**
     * Get national flag emoji for accent code
     */
    getFlag(accent) {
      const acc = String(accent || '').toUpperCase();
      const map = { 'US': '🇺🇸', 'UK': '🇬🇧', 'AU': '🇦🇺', 'CA': '🇨🇦' };
      return map[acc] || '🌐';
    }

    /**
     * Get regional accent phonological shift tips
     */
    getAccentTips(accent) {
      const acc = String(accent || '').toUpperCase();
      if (acc === 'UK') return 'Nuốt âm /r/ cuối từ (car -> /kɑː/), âm /t/ phát âm rõ';
      if (acc === 'AU') return 'Biến âm /eɪ/ thành /aɪ/ (today -> /təˈdaɪ/)';
      if (acc === 'CA') return 'Canadian Raising (/aʊ/ & /aɪ/ biến đổi trước phụ âm vô thanh)';
      if (acc === 'US') return 'Biến âm Flap T (/t/ thành /d/ lướt: water) & uốn lưỡi âm /r/ rõ';
      return 'Giọng phổ thông chuẩn';
    }

    /**
     * Extract distinct accents from speakers list
     */
    getDistinctAccents(speakers) {
      if (!Array.isArray(speakers)) return ['US'];
      const accents = speakers.map(s => {
        const a = (s.accent || 'US').toUpperCase();
        return a.includes('UK') || a.includes('GB') ? 'UK' : (a.includes('AU') ? 'AU' : (a.includes('CA') ? 'CA' : 'US'));
      });
      return Array.from(new Set(accents));
    }

    /**
     * Filter practice sets by accent
     */
    filterByAccent(sets, accent) {
      if (!Array.isArray(sets)) return [];
      const target = String(accent).toUpperCase();
      return sets.filter(s => {
        const a = (s.accent || '').toUpperCase();
        const sec = (s.secondaryAccent || '').toUpperCase();
        return a === target || sec === target;
      });
    }

    /**
     * Render Accent pill badge HTML
     */
    renderAccentBadge(accent, secondaryAccent = null) {
      const pFlag = this.getFlag(accent);
      const pTip = this.escapeHtml(this.getAccentTips(accent));
      let badgeHtml = `
        <div class="accent-badge-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs cursor-pointer hover:border-indigo-400"
             title="${pTip}" onclick="if(typeof showToast==='function') showToast('${pFlag} ${this.escapeHtml(accent)}: ${this.escapeHtml(pTip).replace(/'/g, "\\'")}')">
          <span class="text-sm">${pFlag}</span>
          <span>${accent}</span>
          ${secondaryAccent ? `
            <span class="text-slate-400">/</span>
            <span class="text-sm">${this.getFlag(secondaryAccent)}</span>
            <span>${secondaryAccent}</span>
          ` : ''}
        </div>
      `;
      return badgeHtml.trim();
    }

    // =========================================================================
    // 3. PART 3 & 4 INDIRECT TRAPS ARCHITECTURE (Feature F2 - R1)
    // =========================================================================

    /**
     * 1. Reversal Trap ("Đổi ý phút chót"):
     * Checks if dialogue text contains change-of-mind trigger tokens
     */
    detectReversal(dialogue) {
      if (!dialogue || typeof dialogue !== 'string') return { hasReversal: false, token: null };
      const match = dialogue.match(this.reversalRegex);
      if (match) {
        return {
          hasReversal: true,
          token: match[0].toLowerCase(),
          index: match.index
        };
      }
      return { hasReversal: false, token: null };
    }

    /**
     * 2. Speaker Intent Trap ("Hàm ý người nói"):
     * Evaluates pragmatic implication vs literal meaning
     */
    evaluateSpeakerIntent(utterance, options = []) {
      const lower = String(utterance || '').toLowerCase();
      // Common ETS idiom checks
      let impliedMeaning = '';
      if (lower.includes('copier') && (lower.includes('paper') || lower.includes('look like'))) {
        impliedMeaning = 'Cannot assist because the copier is broken or empty';
      } else if (lower.includes('is it friday already') || lower.includes('busy schedule')) {
        impliedMeaning = 'The speaker is overwhelmed with workload';
      } else if (lower.includes('do i look like') || lower.includes('why not ask')) {
        impliedMeaning = 'Refusing request or redirecting to someone else';
      } else {
        impliedMeaning = 'Non-literal conversational intention';
      }

      return {
        utterance,
        impliedMeaning,
        options: options.map(opt => ({
          text: opt.text || opt,
          isLiteralDistractor: (opt.text || opt).toLowerCase().includes('paper') && lower.includes('paper'),
          isPragmaticCorrect: (opt.text || opt).toLowerCase().includes('cannot assist')
        }))
      };
    }

    /**
     * 3. 3-Party Coordination:
     * Verifies that dialogue set has 3 distinct speakers and valid roles
     */
    validateThreePartySet(dialogueSet) {
      const speakers = (dialogueSet && Array.isArray(dialogueSet.speakers)) ? dialogueSet.speakers : [];
      const distinctNames = new Set(speakers.map(s => s.name));
      const hasThree = distinctNames.size >= 3;
      return {
        isValid: hasThree,
        speakerCount: distinctNames.size,
        speakers
      };
    }

    /**
     * 4. Graphic Matrix Lookup Trap:
     * Checks revised values vs scheduled/initial values
     */
    lookupGraphicMatrix(matrix, queryKey, targetVal) {
      if (!Array.isArray(matrix)) return null;
      const target = matrix.find(row => row[queryKey] === targetVal || row.flight === targetVal);
      if (!target) return null;

      return {
        matchedRow: target,
        distractorValue: target.scheduled || target.originalTime,
        correctValue: target.actual || target.revisedTime || target.newGate || target.actualTime
      };
    }

    // =========================================================================
    // 4. GOLDEN PRE-LISTENING STRATEGY (8-SECOND WINDOW RULE - Feature F3 - R1)
    // =========================================================================

    /**
     * Scan first 2 words of question prompt to determine category
     */
    scanQuestionCue(questionPrompt) {
      if (!questionPrompt || typeof questionPrompt !== 'string') return 'DETAIL_CUE';
      const clean = questionPrompt.trim().toLowerCase();
      if (clean.startsWith('where does') || clean.startsWith('where is') || clean.startsWith('where are')) {
        return 'LOCATION_CUE';
      }
      if (clean.startsWith('who most') || clean.startsWith('who is') || clean.startsWith('who are')) {
        return 'ROLE_CUE';
      }
      if (clean.startsWith('why did') || clean.startsWith('why is') || clean.startsWith('why are') || clean.startsWith('why does')) {
        return 'REASON_CUE';
      }
      return 'DETAIL_CUE';
    }

    /**
     * Extract key noun and anticipate spoken office synonyms
     */
    extractProblemSynonyms(keyNoun) {
      if (!keyNoun) return [];
      const k = String(keyNoun).trim().toLowerCase();
      return this.synonymDict[k] || [];
    }

    /**
     * Target voice binding: female vs male voice routing
     */
    getTargetVoice(questionPrompt) {
      if (!questionPrompt || typeof questionPrompt !== 'string') return 'BOTH_VOICES';
      if (/\bwoman\b|\bshe\b|\bher\b/i.test(questionPrompt)) return 'FEMALE_VOICE';
      if (/\bman\b|\bhe\b|\bhis\b/i.test(questionPrompt)) return 'MALE_VOICE';
      return 'BOTH_VOICES';
    }

    /**
     * Start 8-second countdown timer for pre-listening window
     */
    startPreListeningTimer(duration = 8, onTick, onComplete) {
      if (this.activeTimer) {
        clearInterval(this.activeTimer);
        this.activeTimer = null;
      }

      let remaining = duration;
      if (typeof onTick === 'function') onTick(remaining);

      this.activeTimer = setInterval(() => {
        remaining--;
        if (typeof onTick === 'function') onTick(remaining);
        if (remaining <= 0) {
          clearInterval(this.activeTimer);
          this.activeTimer = null;
          if (typeof onComplete === 'function') onComplete();
        }
      }, 1000);

      return () => {
        if (this.activeTimer) {
          clearInterval(this.activeTimer);
          this.activeTimer = null;
        }
      };
    }

    /**
     * Render Pre-listening Tips Card
     */
    renderPreListeningCard(questions = [], containerId) {
      const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
      if (!container) return;

      const cues = questions.map((q, idx) => {
        const qText = q.q || q.prompt || q;
        const cue = this.scanQuestionCue(qText);
        const voice = this.getTargetVoice(qText);
        let voiceBadge = '👥 Cả hai';
        if (voice === 'FEMALE_VOICE') voiceBadge = '👩 Chú ý giọng NỮ';
        if (voice === 'MALE_VOICE') voiceBadge = '👨 Chú ý giọng NAM';

        return `
          <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <span class="font-bold text-slate-800 dark:text-slate-200">Q${idx + 1}: ${cue}</span>
            <span class="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px]">${voiceBadge}</span>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div id="preListeningHUD" class="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-amber-500 font-black text-sm">⚡</span>
              <span class="font-black text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">Quy tắc vàng 8s quét trước đề</span>
            </div>
            <div class="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono font-black text-xs" id="preListeningTimerVal">8s</div>
          </div>
          <div class="space-y-1.5">
            ${cues}
          </div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 italic">
            💡 Mẹo: Khi audio bắt đầu, thẻ này sẽ tự động thu gọn để bạn tập trung nghe 100%.
          </div>
        </div>
      `;
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
      }[m]));
    }
  }

  return ToeicListeningSync;
}));
