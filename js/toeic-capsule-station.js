/**
 * TOEIC Capsule Station, 80/20 Frequency & Paraphrase Clusters (Features F17, F19, F20 - R5, R6)
 * Implements:
 * 1. 180-second Micro-Capsules (Type A: 3-Trap Drill, Type B: 5-Vocab Audio Recall)
 * 2. 80/20 Frequency Tiering (Cực Cao, Cao, Trung Bình with priority sorting and badge styles)
 * 3. 10 Core Office Paraphrase Clusters (Bidirectional lookup, synonym distractor discriminator, text highlighter)
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ToeicCapsuleStation = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // 10 Core Office Paraphrase Clusters
  const OFFICE_PARAPHRASE_CLUSTERS = [
    {
      id: 'POSTPONE',
      title: 'Trì hoãn / Đổi lịch',
      terms: ['delay', 'postpone', 'push back', 'defer', 'reschedule', 'put off', 'hold in abeyance']
    },
    {
      id: 'SALARY',
      title: 'Lương bổng / Thù lao',
      terms: ['salary', 'remuneration', 'compensation', 'wage', 'stipend', 'earnings']
    },
    {
      id: 'PROCURE',
      title: 'Mua sắm / Thu mua',
      terms: ['purchase', 'procure', 'acquire', 'place an order', 'requisition', 'source supplies']
    },
    {
      id: 'EXPEDITE',
      title: 'Đẩy nhanh / Tăng tốc tiến độ',
      terms: ['accelerate', 'expedite', 'fast-track', 'hasten', 'rush delivery', 'step up']
    },
    {
      id: 'INSPECT',
      title: 'Thanh tra / Kiểm định',
      terms: ['examine', 'inspect', 'review', 'audit', 'assess', 'appraise', 'scrutinize']
    },
    {
      id: 'CANCEL',
      title: 'Hủy bỏ / Chấm dứt',
      terms: ['call off', 'cancel', 'revoke', 'terminate', 'nullify', 'discontinue', 'rescind']
    },
    {
      id: 'COMPLY',
      title: 'Tuân thủ / Đáp ứng chuẩn',
      terms: ['comply with', 'abide by', 'adhere to', 'conform to', 'satisfy criteria', 'meet specifications']
    },
    {
      id: 'DEFECT',
      title: 'Lỗi kỹ thuật / Sự cố',
      terms: ['malfunction', 'glitch', 'flaw', 'defective component', 'breakdown', 'anomaly']
    },
    {
      id: 'DISCOUNT',
      title: 'Giảm giá / Ưu đãi',
      terms: ['rebate', 'markdown', 'concession', 'promotional rate', 'price reduction', 'special discount']
    },
    {
      id: 'SUBMIT',
      title: 'Nộp hồ sơ / Đệ trình',
      terms: ['turn in', 'file', 'lodge', 'forward', 'tender', 'submit documentation', 'hand in']
    }
  ];

  // 80/20 Curated Vocabulary Bank
  const VOCAB_BANK_8020 = [
    { word: 'abide by', ipa: '/əˈbaɪd baɪ/', meaning: 'tuân thủ (hợp đồng)', tier: 'Cực Cao', category: 'contract', collocation: 'abide by the contract terms' },
    { word: 'accommodate', ipa: '/əˈkɑːmədeɪt/', meaning: 'đáp ứng nhu cầu, chứa được', tier: 'Cực Cao', category: 'hospitality', collocation: 'accommodate special requests' },
    { word: 'implement', ipa: '/ˈɪm.plə.ment/', meaning: 'triển khai, thi hành', tier: 'Cực Cao', category: 'management', collocation: 'implement new policies' },
    { word: 'designate', ipa: '/ˈdez.ɪɡ.neɪt/', meaning: 'chỉ định, bổ nhiệm', tier: 'Cực Cao', category: 'personnel', collocation: 'designated parking area' },
    { word: 'eligible', ipa: '/ˈel.ɪ.dʒə.bəl/', meaning: 'đủ điều kiện, thích hợp', tier: 'Cực Cao', category: 'personnel', collocation: 'eligible for promotion' },
    { word: 'prospective', ipa: '/prəˈspek.tɪv/', meaning: 'tiềm năng, tương lai', tier: 'Cực Cao', category: 'sales', collocation: 'prospective clients' },
    { word: 'preliminary', ipa: '/prɪˈlɪm.ə.ner.i/', meaning: 'sơ bộ, ban đầu', tier: 'Cực Cao', category: 'research', collocation: 'preliminary findings' },
    { word: 'expedite', ipa: '/ˈek.spə.daɪt/', meaning: 'xúc tiến, thúc đẩy nhanh', tier: 'Cực Cao', category: 'logistics', collocation: 'expedite the delivery' },

    { word: 'contingency', ipa: '/kənˈtɪn.dʒən.si/', meaning: 'tình huống khẩn cấp dự phòng', tier: 'Cao', category: 'risk', collocation: 'contingency plan' },
    { word: 'oversight', ipa: '/ˈoʊ.vɚ.saɪt/', meaning: 'sự giám sát, sơ suất', tier: 'Cao', category: 'governance', collocation: 'regulatory oversight' },
    { word: 'overhaul', ipa: '/ˈoʊ.vɚ.hɑːl/', meaning: 'đại tu toàn diện', tier: 'Cao', category: 'maintenance', collocation: 'system overhaul' },
    { word: 'discrepancy', ipa: '/dɪˈskrep.ən.si/', meaning: 'sự bất đồng, chênh lệch số liệu', tier: 'Cao', category: 'accounting', collocation: 'discrepancy in the budget' },
    { word: 'statutory', ipa: '/ˈstætʃ.ə.tɔːr.i/', meaning: 'theo luật định', tier: 'Cao', category: 'legal', collocation: 'statutory requirement' },
    { word: 'requisition', ipa: '/ˌrek.wəˈzɪʃ.ən/', meaning: 'giấy yêu cầu vật tư', tier: 'Cao', category: 'procurement', collocation: 'requisition form' },
    { word: 'tenure', ipa: '/ˈten.jɚ/', meaning: 'nhiệm kỳ, thời gian công tác', tier: 'Cao', category: 'personnel', collocation: 'during her tenure' },
    { word: 'consensus', ipa: '/kənˈsen.səs/', meaning: 'sự đồng thuận chung', tier: 'Cao', category: 'meeting', collocation: 'reach a consensus' },

    { word: 'indemnify', ipa: '/ɪnˈdem.nə.faɪ/', meaning: 'bồi thường tổn thất', tier: 'Trung Bình', category: 'legal', collocation: 'indemnify against losses' },
    { word: 'fiduciary', ipa: '/fɪˈduː.ʃi.er.i/', meaning: 'ủy thác tài chính', tier: 'Trung Bình', category: 'finance', collocation: 'fiduciary duty' },
    { word: 'proprietary', ipa: '/prəˈpraɪ.ə.ter.i/', meaning: 'độc quyền sở hữu', tier: 'Trung Bình', category: 'patents', collocation: 'proprietary software' },
    { word: 'demurrage', ipa: '/dɪˈmɝː.ɪdʒ/', meaning: 'phí lưu container quá hạn', tier: 'Trung Bình', category: 'shipping', collocation: 'demurrage charges' },
    { word: 'moratorium', ipa: '/ˌmɔːr.əˈtɔːr.i.əm/', meaning: 'lệnh tạm hoãn nợ', tier: 'Trung Bình', category: 'finance', collocation: 'debt moratorium' },
    { word: 'adjudicate', ipa: '/əˈdʒuː.də.keɪt/', meaning: 'xét xử tranh chấp', tier: 'Trung Bình', category: 'legal', collocation: 'adjudicate a claim' }
  ];

  class ToeicCapsuleStation {
    constructor() {
      this.clusters = OFFICE_PARAPHRASE_CLUSTERS;
      this.vocabBank = VOCAB_BANK_8020;
      this.tierOrder = { 'Cực Cao': 1, 'Cao': 2, 'Trung Bình': 3 };
      this.activeCapsule = null;
      this.timerInterval = null;
    }

    // =========================================================================
    // 1. 180-SECOND MICRO-CAPSULES (Feature F17 - R5)
    // =========================================================================

    /**
     * Create capsule blueprint
     * @param {'TRAP_DRILL'|'VOCAB_AUDIO'} type 
     * @param {Object} [customOptions] 
     */
    createCapsule(type = 'TRAP_DRILL', customOptions = {}) {
      if (type === 'TRAP_DRILL' || type === 'A') {
        return {
          id: 'capsule_trap_' + Date.now(),
          type: 'TRAP_DRILL',
          totalBudgetSeconds: 180,
          currentPhaseIndex: 0,
          phases: [
            { name: 'theory', duration: 30, title: 'Spotlight Lý Thuyết Bẫy' },
            { name: 'drill', duration: 120, questionsCount: 3, timePerQuestion: 40, title: 'Thực Chiến 3 Câu Tốc Độ' },
            { name: 'wrap_up', duration: 30, title: 'Đánh Giá & Trừ Điểm Bẫy' }
          ],
          questions: customOptions.questions || [
            {
              id: 'cap_q1',
              trapCategory: 'TRAP-06',
              q: 'The conference venue was ____ to the Oak Ballroom at the last moment.',
              options: ['cancelled', 'switched', 'constructed', 'dismissed'],
              ans: 1,
              explanation: 'Bẫy đổi ý phút chót: chuyển đổi phòng thay vì hủy bỏ.'
            },
            {
              id: 'cap_q2',
              trapCategory: 'TRAP-01',
              q: 'Look at the photograph. The document is ____ by the manager.',
              options: ['being reviewed', 'been reviewed', 'reviewing', 'reviews'],
              ans: 0,
              explanation: 'Bẫy Being vs Been trong Part 1.'
            },
            {
              id: 'cap_q3',
              trapCategory: 'TRAP-10',
              q: 'The shipment was delayed ____ severe weather grounded all cargo planes.',
              options: ['due to', 'because', 'owing to', 'in spite of'],
              ans: 1,
              explanation: 'Mệnh đề S+V -> chọn liên từ "because".'
            }
          ]
        };
      }

      // Type B: 5 Vocab with native audio
      return {
        id: 'capsule_vocab_' + Date.now(),
        type: 'VOCAB_AUDIO',
        totalBudgetSeconds: 180,
        wordsCount: 5,
        perWordBudget: 36,
        words: (customOptions.words || this.vocabBank.slice(0, 5)).slice(0, 5)
      };
    }

    /**
     * Award XP / streak for capsule completion
     * @param {boolean} isPerfect 
     * @returns {number} Awarded XP
     */
    awardCapsuleXP(isPerfect) {
      const xp = isPerfect ? 50 : 25;
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const cur = parseInt(window.localStorage.getItem('toeic_user_xp') || '100', 10);
          window.localStorage.setItem('toeic_user_xp', String(cur + xp));
        } catch (e) {}
      }
      return xp;
    }

    /**
     * Log completed capsule results to Heat Matrix
     */
    syncResultsToHeatMatrix(results = {}) {
      if (typeof window !== 'undefined' && window.ToeicTrapHeatMatrix) {
        const matrix = window.ToeicTrapHeatMatrix.defaultInstance || window.ToeicTrapHeatMatrix;
        if (Array.isArray(results.answered)) {
          results.answered.forEach(item => {
            if (item.trapCategory && typeof matrix.recordAttempt === 'function') {
              matrix.recordAttempt(item.trapCategory, item.isCorrect);
            }
          });
        }
      }
    }

    // =========================================================================
    // 2. 80/20 FREQUENCY TIERING (Feature F19 - R6)
    // =========================================================================

    /**
     * Check if tier string is valid
     */
    isValidTier(tier) {
      return ['Cực Cao', 'Cao', 'Trung Bình'].includes(tier);
    }

    /**
     * Get CSS badge class for tier
     */
    getBadgeClass(tier) {
      if (tier === 'Cực Cao') return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      if (tier === 'Cao') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }

    /**
     * Filter vocabulary items by tier
     */
    filterByTier(tier, list = this.vocabBank) {
      return list.filter(item => item.tier === tier);
    }

    /**
     * 80/20 Priority sorting: Cực Cao -> Cao -> Trung Bình
     */
    sortVocabBy8020(items) {
      const copy = items.slice();
      copy.sort((a, b) => {
        const orderA = this.tierOrder[a.tier] || 99;
        const orderB = this.tierOrder[b.tier] || 99;
        return orderA - orderB;
      });
      return copy;
    }

    // =========================================================================
    // 3. TOP 10 OFFICE PARAPHRASE CLUSTERS (Feature F20 - R6)
    // =========================================================================

    /**
     * Return all 10 clusters
     */
    getClusters() {
      return this.clusters.slice();
    }

    /**
     * Bidirectional lookup: find parent cluster containing term
     */
    findClusterByTerm(term) {
      if (!term || typeof term !== 'string') return null;
      const lower = term.trim().toLowerCase();
      return this.clusters.find(c => c.terms.some(t => t.toLowerCase() === lower)) || null;
    }

    /**
     * Return all synonym siblings of term (excluding term itself)
     */
    findSiblings(term) {
      const cluster = this.findClusterByTerm(term);
      if (!cluster) return [];
      const lower = term.trim().toLowerCase();
      return cluster.terms.filter(t => t.toLowerCase() !== lower);
    }

    /**
     * Distractor discriminator: checks if termB is a genuine synonym of termA
     */
    isSynonym(termA, termB) {
      if (!termA || !termB) return false;
      const clusterA = this.findClusterByTerm(termA);
      if (!clusterA) return false;
      const lowerB = termB.trim().toLowerCase();
      return clusterA.terms.some(t => t.toLowerCase() === lowerB);
    }

    /**
     * Highlight matching cluster terms in text with <mark class="cluster-match">
     */
    highlightClusterMatches(text) {
      if (!text || typeof text !== 'string') return '';
      let result = text;

      // Extract all unique terms from all clusters
      const allTerms = [];
      this.clusters.forEach(c => {
        c.terms.forEach(t => allTerms.push(t));
      });

      // Sort by length descending to match longest phrases first (e.g. "push back" before "push")
      allTerms.sort((a, b) => b.length - a.length);

      allTerms.forEach(t => {
        const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');
        result = result.replace(regex, '<mark class="cluster-match">$1</mark>');
      });

      return result;
    }

    /**
     * Generate synonym matching question from cluster data
     */
    generateSynonymQuiz(clusterName, term, correctSynonym, wrongTerms = []) {
      return {
        prompt: `Từ nào sau đây đồng nghĩa với "${term}" trong ngữ cảnh công sở?`,
        options: [correctSynonym, ...wrongTerms],
        correctAnswer: correctSynonym
      };
    }
  }

  return ToeicCapsuleStation;
}));
