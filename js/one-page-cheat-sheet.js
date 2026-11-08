/**
 * One-Page Cheat Sheet Generator (Feature F4 - R1)
 * Generates compact 1-page high-yield summary cards after lessons/practice sessions.
 * Includes: Top vocabulary + collocations, 3-second keyword rules, 12-trap alert summaries,
 * student diagnostic metrics, and export/print functionality.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OnePageCheatSheet = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class OnePageCheatSheet {
    constructor() {
      this.defaultStudent = {
        name: 'Học viên TOEIC',
        score: 650,
        target: 800
      };
    }

    /**
     * Escape HTML entities
     */
    escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
      }[m]));
    }

    /**
     * Generate 1-page cheat sheet HTML string
     * @param {Object} lessonData
     * @param {Object} options
     * @returns {string}
     */
    generateHtml(lessonData = {}, options = {}) {
      const data = lessonData || {};
      const opts = options || {};
      const title = this.escapeHtml(data.title || data.unit || 'Bản Tóm Tắt Bài Học 1 Trang');
      const student = Object.assign({}, this.defaultStudent, opts.student || data.student);
      const studentHeader = `Student: ${this.escapeHtml(String(student.name || 'Học viên'))} | Diagnostic: ${this.escapeHtml(String(student.score || 500))} | Target: ${this.escapeHtml(String(student.target || 650))}`;

      // Rules / Key Points
      const rules = Array.isArray(data.keyRules) && data.keyRules.length > 0
        ? data.keyRules
        : [
            'Quy tắc 8 giây quét trước câu hỏi trước khi nghe audio',
            'Cảnh giác từ đổi ý (Wait, Actually, On second thought)',
            'Phân biệt mệnh đề hoàn chỉnh vs cụm danh từ (Due to vs Because)'
          ];

      const rulesHtml = rules.map(r => `<li class="flex items-start gap-2"><span class="text-indigo-600 font-bold shrink-0">⚡</span><span>${this.escapeHtml(r)}</span></li>`).join('');

      // Top Vocabulary & Collocations
      const vocabList = Array.isArray(data.vocab) && data.vocab.length > 0
        ? data.vocab
        : [
            { word: 'abide by', ipa: '/əˈbaɪd baɪ/', meaning: 'tuân thủ hợp đồng', collocation: 'abide by the contract' },
            { word: 'accommodate', ipa: '/əˈkɑːmədeɪt/', meaning: 'đáp ứng yêu cầu', collocation: 'accommodate requests' },
            { word: 'expedite', ipa: '/ˈek.spə.daɪt/', meaning: 'xúc tiến, đẩy nhanh', collocation: 'expedite shipment' }
          ];

      const safeVocabList = vocabList.filter(v => v && typeof v === 'object');
    const vocabHtml = safeVocabList.map(v => `
        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div class="flex items-center justify-between">
            <strong class="text-slate-900 dark:text-white font-black">${this.escapeHtml(v.word)}</strong>
            <span class="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">${this.escapeHtml(v.ipa || '')}</span>
          </div>
          <div class="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">${this.escapeHtml(v.meaning || '')}</div>
          ${v.collocation ? `<div class="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1">Collocation: <i>${this.escapeHtml(v.collocation)}</i></div>` : ''}
        </div>
      `).join('');

      // Traps Summary
      const traps = Array.isArray(data.trapsSummary || data.traps) && (data.trapsSummary || data.traps).length > 0
        ? (data.trapsSummary || data.traps)
        : ['TRAP-03: Bẫy từ đồng âm & phát âm giống', 'TRAP-06: Bẫy đổi ý phút chót'];

      const trapsHtml = traps.map(t => `
        <span class="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[11px] font-bold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
          <span>${this.escapeHtml(t)}</span>
        </span>
      `).join('');

      const rawLessonId = (data.lessonId !== undefined && data.lessonId !== null && data.lessonId !== '') ? String(data.lessonId) : 'unit04';
      const sanitizedLessonId = rawLessonId.replace(/[^a-zA-Z0-9_-]/g, '');
      const safeLessonId = this.escapeHtml(sanitizedLessonId || 'unit04');

      return `
        <div class="cheat-sheet-page max-w-[800px] mx-auto bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl font-sans text-xs space-y-5 text-slate-800 dark:text-slate-200">
          <style>
            @media print {
              body * { visibility: hidden; }
              .cheat-sheet-page, .cheat-sheet-page * { visibility: visible; }
              .cheat-sheet-page {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 16px;
                border: none !important;
                box-shadow: none !important;
                page-break-inside: avoid;
                max-height: 100vh;
              }
              .no-print { display: none !important; }
            }
          </style>

          <!-- Top Sheet Header -->
          <div class="border-b-2 border-indigo-600 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                  ETS 2026 CHEAT SHEET
                </span>
                <span class="text-slate-400 font-mono text-[11px]">${new Date().toLocaleDateString('vi-VN')}</span>
              </div>
              <h1 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">${title}</h1>
            </div>
            <div class="text-right text-[11px] font-mono text-slate-500 dark:text-slate-400">
              ${studentHeader}
            </div>
          </div>

          <!-- Section 1: 3-Second Keyword Rules -->
          <div class="space-y-2">
            <h3 class="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <span>🎯 Mẹo 3 Giây & Quy Tắc Sống Còn</span>
            </h3>
            <ul class="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 leading-relaxed font-medium">
              ${rulesHtml}
            </ul>
          </div>

          <!-- Section 2: Top Vocabulary & Collocations -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span>📚 80/20 Từ Vựng & Collocation Trọng Tâm</span>
              </h3>
              <span class="text-[10px] text-slate-400">Tần suất xuất hiện cực cao</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              ${vocabHtml}
            </div>
          </div>

          <!-- Section 3: 12-Trap Alerts Encountered -->
          <div class="space-y-2">
            <h3 class="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <span>⚠️ Cảnh Báo Bẫy Đề Cần Lưu Ý</span>
            </h3>
            <div class="flex flex-wrap items-center gap-2">
              ${trapsHtml}
            </div>
          </div>

          <!-- Footer & Action Buttons -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tôi Đi Đâu Đó • EdTech Study Studio</span>
            <div class="flex items-center gap-2 no-print">
              <button onclick="window.OnePageCheatSheet.print()" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold transition flex items-center gap-1">
                <span>🖨️</span> In / Lưu PDF
              </button>
              <button onclick="window.OnePageCheatSheet.exportHtml('${safeLessonId}')" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1">
                <span>📥</span> Tải File
              </button>
            </div>
          </div>
        </div>
      `.trim();
    }

    /**
     * Export cheat sheet file (returns filename and triggers download if in browser)
     * @param {string} lessonId 
     * @param {string} [format='html'] 
     * @param {Object} [lessonData]
     * @returns {string} Downloaded file name
     */
    exportCheatSheet(lessonId = 'lesson', format = 'html', lessonData = {}) {
      const fileName = `toeic_cheatsheet_${lessonId}.${format}`;

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const content = this.generateHtml(lessonData);
        const blob = new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      return fileName;
    }

    /**
     * Static helper for browser print action
     */
    static print() {
      if (typeof window !== 'undefined' && typeof window.print === 'function') {
        window.print();
      }
    }

    /**
     * Static helper for export
     */
    static exportHtml(lessonId) {
      const inst = new OnePageCheatSheet();
      return inst.exportCheatSheet(lessonId, 'html');
    }
  }

  return OnePageCheatSheet;
}));
