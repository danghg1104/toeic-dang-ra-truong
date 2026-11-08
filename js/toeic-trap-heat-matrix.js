/**
 * 12 Trap Categories & Time-Decayed Heat Matrix Engine
 * TOEIC Master (noble-franklin)
 * 
 * Features:
 * - Canonical 12 Trap Categories (8 Listening L1-L8, 4 Reading R9-R12)
 * - Exponential time-decay model: w_i = exp(-lambda * Delta_t), lambda = ln(2)/7 (7-day half-life)
 * - 4-Tier classification: Cold (0-19%), Warm (20-44%), Hot (45-69%), Critical (70-100%)
 * - Interactive Heat Matrix rendering and drill routing
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ToeicTrapHeatMatrix = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // Canonical 12 Trap Categories Catalog
  const TRAP_CATEGORIES_CATALOG = [
    {
      id: 'TRAP-01',
      code: 'P1-BEING',
      section: 'listening',
      part: 1,
      name: 'Tranh tĩnh không người (is being V3)',
      description: 'Bẫy dùng thì bị động tiếp diễn "is/are being + V3" trong ảnh không có người tương tác với đồ vật.',
      cheatTip: 'Ảnh không người -> Loại ngay đáp án có "BEING" (trừ ngoại lệ: goods being displayed).'
    },
    {
      id: 'TRAP-02',
      code: 'P1-ACTION',
      section: 'listening',
      part: 1,
      name: 'Trạng thái vs Hành động (wear / put on)',
      description: 'Nhầm lẫn giữa trạng thái đang mặc (wearing) và hành động đang mặc vào (putting on / trying on).',
      cheatTip: 'Nhìn cử chỉ tay: Tay chạm cúc/kéo khóa = putting on. Đã mặc ngay ngắn = wearing.'
    },
    {
      id: 'TRAP-03',
      code: 'P12-SOUND',
      section: 'listening',
      part: 2,
      name: 'Từ đồng âm & gần âm gây nhiễu',
      description: 'Bẫy dùng từ phát âm gần giống hoặc giống hệt nhưng khác nghĩa (coffee / copy, walk / work).',
      cheatTip: 'Nghe từ trong câu hỏi lặp lại y nguyên ở đáp án -> 80% là bẫy đồng âm distractor.'
    },
    {
      id: 'TRAP-04',
      code: 'P2-INDIRECT',
      section: 'listening',
      part: 2,
      name: 'Trả lời né tránh / gián tiếp',
      description: 'Người trả lời không đáp thẳng vào câu hỏi mà đưa ra thông tin bắc cầu hoặc đá trách nhiệm.',
      cheatTip: '"Tôi chưa kiểm tra", "Hỏi chị Linh xem", "Lịch trình bị đổi rồi" thường là đáp án đúng.'
    },
    {
      id: 'TRAP-05',
      code: 'P2-YESNO',
      section: 'listening',
      part: 2,
      name: 'Bẫy Yes/No cho câu hỏi Wh-',
      description: 'Dùng Yes / No để trả lời cho các câu hỏi lấy thông tin (Who, Where, When, Why, How).',
      cheatTip: 'Câu hỏi bắt đầu bằng Wh- -> Loại ngay tắp lự bất kỳ đáp án nào bắt đầu bằng Yes/No/Sure.'
    },
    {
      id: 'TRAP-06',
      code: 'P3-REVERSAL',
      section: 'listening',
      part: 3,
      name: 'Đổi ý phút chót (Wait / Actually)',
      description: 'Người nói đưa ra phương án ban đầu nhưng lập tức phủ định hoặc đổi ý bởi từ nối chuyển hướng.',
      cheatTip: 'Bắt ngay các từ bẻ lái: Wait, Actually, But, However, On second thought, In that case.'
    },
    {
      id: 'TRAP-07',
      code: 'P34-INTENT',
      section: 'listening',
      part: 4,
      name: 'Hàm ý người nói & câu trích dẫn',
      description: 'Câu hỏi "Why does the speaker say...?" yêu cầu suy luận ý đồ sâu xa thay vì nghĩa đen.',
      cheatTip: 'Đặt câu trích dẫn vào ngữ cảnh trước và sau: Speaker đang từ chối, than phiền hay nhắc nhở?'
    },
    {
      id: 'TRAP-08',
      code: 'P34-GRAPHIC',
      section: 'listening',
      part: 4,
      name: 'Bẫy nhìn nhầm bảng biểu đối chiếu',
      description: 'Bẫy đọc thông tin trên bảng biểu: Audio nhắc đến cột A nhưng câu hỏi lại hỏi giá trị ở cột B.',
      cheatTip: 'Quy tắc nhìn bảng biểu: Audio nói từ ở Cột 1 -> Đáp án đúng sẽ nằm ở Cột 2 đối diện.'
    },
    {
      id: 'TRAP-09',
      code: 'P5-POS',
      section: 'reading',
      part: 5,
      name: 'Từ loại đặc biệt (-ive, -al)',
      description: 'Danh từ có đuôi tính từ (initiative, representative, alternative) hoặc từ loại dễ nhầm.',
      cheatTip: 'Ghi nhớ các danh từ đuôi -ive: initiative, representative, objective, executive.'
    },
    {
      id: 'TRAP-10',
      code: 'P5-PREPCONJ',
      section: 'reading',
      part: 5,
      name: 'Liên từ vs Giới từ mệnh đề',
      description: 'Bẫy phân biệt giữa Giới từ (+ Danh từ/V-ing) và Liên từ (+ Mệnh đề S + V).',
      cheatTip: 'Nhìn phía sau chỗ trống: Có động từ chia thì -> Chọn liên từ (Although/Because). Cụm N -> Chọn giới từ (Despite/Due to).'
    },
    {
      id: 'TRAP-11',
      code: 'P6-INSERT',
      section: 'reading',
      part: 6,
      name: 'Điền câu & liên từ logic',
      description: 'Điền cả câu vào vị trí thích hợp dựa trên liên kết đại từ thay thế (this, these) và logic ý.',
      cheatTip: 'Tìm dấu vết liên kết: Nếu câu sau có "These changes", câu điền vào BẮT BUỘC phải nói về sự thay đổi.'
    },
    {
      id: 'TRAP-12',
      code: 'P7-CROSSREF',
      section: 'reading',
      part: 7,
      name: 'Bẫy xâu chuỗi đa văn bản',
      description: 'Câu hỏi yêu cầu kết hợp dữ kiện từ 2 hoặc 3 văn bản độc lập (Bài 1 + Bài 2) mới tìm ra đáp án.',
      cheatTip: 'Xâu chuỗi chéo: Ngày giờ ở Email 1 x Chính sách giảm giá ở Web 2 x Hóa đơn ở Doc 3.'
    }
  ];

  class ToeicTrapHeatMatrix {
    constructor(storageKey = 'toeic_trap_attempts') {
      this.storageKey = storageKey;
      this.catalog = TRAP_CATEGORIES_CATALOG.slice();
      this.validTrapIds = new Set(this.catalog.map(t => t.id));
      this.lambda = Math.LN2 / 7.0; // 7-day half-life decay constant (~0.099021)
    }

    /**
     * Calculate exponential weight w_i = exp(-lambda * Delta_t)
     * @param {number} elapsedDays Days elapsed since attempt
     */
    calcWeight(elapsedDays) {
      const days = Math.max(0, Number(elapsedDays) || 0);
      return Math.exp(-this.lambda * days);
    }

    /**
     * Record an attempt on a trap
     * @param {string} trapId e.g. "TRAP-01"
     * @param {boolean} isCorrect Whether candidate answered correctly
     * @param {number} [timestamp] UTC timestamp in milliseconds (defaults to now)
     */
    recordAttempt(trapId, isCorrect, timestamp = Date.now()) {
      if (!this.validTrapIds.has(trapId)) {
        // Unknown trap category string ignored safely
        return false;
      }

      const records = this.getStoredRecords();
      records.push({
        trapId,
        isCorrect: Boolean(isCorrect),
        timestamp: Number(timestamp) || Date.now()
      });

      this.saveRecords(records);
      return true;
    }

    /**
     * Read records from localStorage
     */
    getStoredRecords() {
      try {
        if (typeof localStorage === 'undefined') return [];
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    /**
     * Save records to localStorage
     */
    saveRecords(records) {
      try {
        if (typeof localStorage === 'undefined') return false;
        localStorage.setItem(this.storageKey, JSON.stringify(records));
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * Clear all recorded trap attempts
     */
    clearRecords() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(this.storageKey);
        }
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * Classify heat intensity into 4 canonical tiers:
     * - Cold: 0% - 19%
     * - Warm: 20% - 44%
     * - Hot: 45% - 69%
     * - Critical: 70% - 100%
     */
    static getHeatTier(heatPercentage) {
      const h = Math.min(100, Math.max(0, Math.round(Number(heatPercentage) || 0)));
      if (h < 20) {
        return {
          tier: 'COLD',
          name: 'Làm chủ (Cold)',
          color: 'emerald',
          cssClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          badgeClass: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50',
          advice: 'Mastery confirmed. Zero risk.'
        };
      } else if (h < 45) {
        return {
          tier: 'WARM',
          name: 'Cảnh báo nhẹ (Warm)',
          color: 'sky',
          cssClass: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
          badgeClass: 'bg-sky-500/30 text-sky-300 border-sky-500/50',
          advice: 'Occasional slips. Review cheat sheet.'
        };
      } else if (h < 70) {
        return {
          tier: 'HOT',
          name: 'Báo động (Hot)',
          color: 'amber',
          cssClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          badgeClass: 'bg-amber-500/30 text-amber-300 border-amber-500/50',
          advice: 'Frequent victim. Must do 180s capsule drills.'
        };
      } else {
        return {
          tier: 'CRITICAL',
          name: 'Mức độ cao (Dễ nhầm)',
          color: 'rose',
          cssClass: 'bg-rose-500/25 text-rose-400 border-rose-500/60 shadow-lg shadow-rose-500/20',
          badgeClass: 'bg-rose-500/40 text-rose-300 border-rose-500/70',
          advice: 'Critical weakness! High priority intervention.'
        };
      }
    }

    /**
     * Compute time-decayed heat intensity for all 12 traps
     * @param {number} [currentTimestamp] 
     * @returns {Array<Object>} 12-cell matrix data
     */
    getMatrixData(currentTimestamp = Date.now()) {
      const records = this.getStoredRecords();
      const now = Number(currentTimestamp) || Date.now();

      // Group records by trapId
      const grouped = {};
      this.catalog.forEach(t => {
        grouped[t.id] = { totalAttempts: 0, wrongAttempts: 0, wTot: 0.0, wErr: 0.0 };
      });

      records.forEach(rec => {
        if (!rec || !this.validTrapIds.has(rec.trapId)) return;
        const entry = grouped[rec.trapId];
        const elapsedDays = Math.max(0, (now - (rec.timestamp || now)) / 86400000);
        const w = this.calcWeight(elapsedDays);

        entry.totalAttempts++;
        entry.wTot += w;
        if (!rec.isCorrect) {
          entry.wrongAttempts++;
          entry.wErr += w;
        }
      });

      return this.catalog.map(cat => {
        const stats = grouped[cat.id];
        let heat = 0;
        let status = 'CHƯA_GHI_NHẬN';

        // Insufficient exposure rule (< 3 attempts) -> 0%
        if (stats.totalAttempts < 3) {
          heat = 0;
          status = stats.totalAttempts === 0 ? 'CHƯA_GHI_NHẬN' : 'THIẾU_DỮ_LIỆU';
        } else {
          status = 'GHI_NHẬN';
          if (stats.wTot > 0) {
            heat = Math.min(100, Math.max(0, Math.round((stats.wErr / stats.wTot) * 100)));
          }
        }

        const tierInfo = ToeicTrapHeatMatrix.getHeatTier(heat);

        return {
          trapId: cat.id,
          code: cat.code,
          name: cat.name,
          section: cat.section,
          part: cat.part,
          description: cat.description,
          cheatTip: cat.cheatTip,
          totalAttempts: stats.totalAttempts,
          wrongAttempts: stats.wrongAttempts,
          weightedTotal: Number(stats.wTot.toFixed(2)),
          weightedErrors: Number(stats.wErr.toFixed(2)),
          heat,
          status,
          tier: tierInfo.tier,
          tierName: tierInfo.name,
          cssClass: tierInfo.cssClass,
          badgeClass: tierInfo.badgeClass,
          advice: tierInfo.advice
        };
      });
    }

    /**
     * Filter traps belonging to a specific TOEIC Part (1..7)
     * @param {number} partNumber 
     */
    filterByPart(partNumber) {
      const p = parseInt(partNumber, 10);
      return this.catalog.filter(t => t.part === p);
    }

    /**
     * Render the 12-cell interactive Heat Matrix into a DOM element
     * @param {HTMLElement|string} containerOrId 
     * @param {Object} [options] 
     */
    renderMatrix(containerOrId, options = {}) {
      if (typeof document === 'undefined') {
        return this.getMatrixData();
      }

      const el = typeof containerOrId === 'string'
        ? document.getElementById(containerOrId) || document.querySelector(containerOrId)
        : containerOrId;

      if (!el) {
        console.warn(`[ToeicTrapHeatMatrix] Container "${containerOrId}" not found in DOM`);
        return null;
      }

      const cells = this.getMatrixData();
      const listeningCells = cells.filter(c => c.section === 'listening');
      const readingCells = cells.filter(c => c.section === 'reading');

      const renderCellHtml = (cell) => {
        return `
          <div class="trap-matrix-cell rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col justify-between ${cell.cssClass}"
               data-trap-id="${cell.trapId}" data-part="${cell.part}">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="font-mono font-black text-xs px-2 py-0.5 rounded-lg ${cell.badgeClass}">
                  ${cell.code}
                </span>
                <span class="font-extrabold text-sm font-mono">${cell.heat}%</span>
              </div>
              <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug mb-1">
                ${cell.name}
              </h4>
              <p class="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                ${cell.description}
              </p>
            </div>
            <div class="pt-2 border-t border-current/20 flex items-center justify-between text-[10px]">
              <span class="opacity-80">Part ${cell.part} | Lỗi: ${cell.wrongAttempts}/${cell.totalAttempts}</span>
              <span class="font-bold opacity-90">${cell.tierName}</span>
            </div>
          </div>
        `;
      };

      el.innerHTML = `
        <div class="trap-heat-matrix-container space-y-6">
          <!-- Listening Traps Section (L1 - L8) -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                <i class="fa-solid fa-headphones"></i>
              </div>
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Bẫy Đề Listening Thường Gặp (L1 – L8)
              </h3>
              <span class="text-xs text-slate-400 ml-auto font-mono">8 Danh mục</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              ${listeningCells.map(renderCellHtml).join('')}
            </div>
          </div>

          <!-- Reading Traps Section (R9 - R12) -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Bẫy Đề Reading Thường Gặp (R9 – R12)
              </h3>
              <span class="text-xs text-slate-400 ml-auto font-mono">4 Danh mục</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              ${readingCells.map(renderCellHtml).join('')}
            </div>
          </div>
        </div>
      `;

      // Attach cell click handler
      if (typeof options.onCellClick === 'function') {
        const domCells = el.querySelectorAll('.trap-matrix-cell');
        domCells.forEach(domCell => {
          domCell.addEventListener('click', (ev) => {
            const trapId = domCell.getAttribute('data-trap-id');
            const cellData = cells.find(c => c.trapId === trapId);
            options.onCellClick(cellData, ev);
          });
        });
      }

      return el;
    }
  }

  // Attach catalog static reference
  ToeicTrapHeatMatrix.TRAP_CATEGORIES_CATALOG = TRAP_CATEGORIES_CATALOG;

  // Singleton instance
  ToeicTrapHeatMatrix.defaultInstance = new ToeicTrapHeatMatrix();
  ToeicTrapHeatMatrix.recordAttempt = (...args) => ToeicTrapHeatMatrix.defaultInstance.recordAttempt(...args);
  ToeicTrapHeatMatrix.getMatrixData = (...args) => ToeicTrapHeatMatrix.defaultInstance.getMatrixData(...args);
  ToeicTrapHeatMatrix.filterByPart = (...args) => ToeicTrapHeatMatrix.defaultInstance.filterByPart(...args);
  ToeicTrapHeatMatrix.renderMatrix = (...args) => ToeicTrapHeatMatrix.defaultInstance.renderMatrix(...args);

  return ToeicTrapHeatMatrix;
}));
