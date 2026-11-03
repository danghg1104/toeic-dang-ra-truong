/**
 * FSRS v5 (Free Spaced Repetition Scheduler v5) Engine
 * Reference Implementation for TOEIC Master (noble-franklin)
 * 
 * Implements the 3-component memory model (Difficulty D, Stability S, Retrievability R)
 * with calibrated 19 parameters (w0..w18) for optimal vocabulary retention.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FSRS5Engine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // 19 Default Calibrated FSRS v5 Weights for English Language Acquisition
  const FSRS_DEFAULT_WEIGHTS = [
    0.40255,  // w[0]: Initial stability S0(Again)
    1.18385,  // w[1]: Initial stability S0(Hard)
    3.17300,  // w[2]: Initial stability S0(Good)
    15.69105, // w[3]: Initial stability S0(Easy)
    7.19490,  // w[4]: Initial difficulty D0 base
    0.53450,  // w[5]: Initial difficulty slope
    1.46040,  // w[6]: Difficulty step delta
    0.00460,  // w[7]: Mean reversion weight
    1.54575,  // w[8]: Recall stability coefficient
    0.11920,  // w[9]: Stability power exponent
    1.01925,  // w[10]: Retrievability exponent
    1.93950,  // w[11]: Lapse stability base
    0.11000,  // w[12]: Lapse difficulty exponent
    0.29605,  // w[13]: Lapse stability power
    0.22695,  // w[14]: Lapse retrievability exponent
    0.23150,  // w[15]: Hard penalty factor
    2.98980,  // w[16]: Easy bonus factor
    0.51655,  // w[17]: Short-term memory multiplier
    0.66210   // w[18]: Short-term power
  ];

  class FSRS5Engine {
    constructor(customWeights) {
      this.w = Array.isArray(customWeights) && customWeights.length === 19
        ? customWeights.slice()
        : FSRS_DEFAULT_WEIGHTS.slice();
    }

    /**
     * Clamp number within [min, max]
     */
    clamp(val, min, max) {
      if (isNaN(val) || val === null || val === undefined) return min;
      return Math.min(max, Math.max(min, val));
    }

    /**
     * Initial Stability S0(G) for review grade G in {1, 2, 3, 4}
     */
    initStability(grade) {
      const g = Math.min(4, Math.max(1, Math.round(Number(grade) || 3)));
      return this.w[g - 1];
    }

    /**
     * Initial Difficulty D0(G) for review grade G in {1, 2, 3, 4}
     */
    initDifficulty(grade) {
      const g = Math.min(4, Math.max(1, Math.round(Number(grade) || 3)));
      const rawD0 = this.w[4] - Math.exp(this.w[5] * (g - 1)) + 1;
      return this.clamp(rawD0, 1.0, 10.0);
    }

    /**
     * Initialize card tracking state
     * @param {string} cardId 
     * @param {number} initialGrade Optional initial assessment grade (default 3 = Good)
     * @returns {Object} Card state object
     */
    initCard(cardId = 'card_unknown', initialGrade = 3) {
      const d0 = this.initDifficulty(initialGrade);
      const s0 = this.initStability(initialGrade);
      const now = Date.now();
      const intervalDays = Math.max(1, Math.round(s0));

      return {
        cardId: String(cardId),
        difficulty: Number(d0.toFixed(2)),
        stability: Number(s0.toFixed(2)),
        retrievability: 1.0,
        reps: 0,
        lapses: 0,
        lastReview: now,
        intervalDays,
        nextReview: now + intervalDays * 86400000
      };
    }

    /**
     * Calculate retrievability probability R(t, S)
     * R(t, S) = (1 + 19*t / (9*S))^(-0.5)
     * @param {number} tDays Days elapsed since last review
     * @param {number} stability Current stability S
     */
    retrievability(tDays, stability) {
      const t = Math.max(0, Number(tDays) || 0);
      if (t === 0) return 1.0;

      const s = Math.max(0.1, Number(stability) || 0.1);
      const factor = (19.0 * t) / (9.0 * s);
      const r = Math.pow(1.0 + factor, -0.5);

      if (isNaN(r) || !isFinite(r)) return 0.0001;
      return Math.min(1.0, Math.max(0.0001, r));
    }

    /**
     * Calculate target interval for desired retention probability
     * Standard FSRS interval I(S, 0.90) = max(1, round(S))
     * @param {number} stability 
     * @param {number} targetRetention (default 0.90)
     */
    calcInterval(stability, targetRetention = 0.90) {
      const s = (typeof stability === 'number' && !isNaN(stability) && isFinite(stability))
        ? Math.max(0.1, stability)
        : 0.1;
      let r = (typeof targetRetention === 'number' && !isNaN(targetRetention) && isFinite(targetRetention) && targetRetention > 0 && targetRetention < 1.0)
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
    }

    /**
     * Sanitize card object to guard against corrupted or missing properties
     */
    sanitizeCard(card) {
      if (!card || typeof card !== 'object') {
        return this.initCard('repaired_card');
      }
      const cardId = card.cardId || 'repaired_card';
      const difficulty = (typeof card.difficulty === 'number' && !isNaN(card.difficulty) && isFinite(card.difficulty))
        ? this.clamp(card.difficulty, 1.0, 10.0)
        : 4.5;
      const stability = (typeof card.stability === 'number' && !isNaN(card.stability) && isFinite(card.stability))
        ? Math.max(0.1, Math.min(36500, card.stability))
        : 3.17;
      const reps = Math.max(0, parseInt(card.reps, 10) || 0);
      const lapses = Math.max(0, parseInt(card.lapses, 10) || 0);
      const lastReview = Number(card.lastReview) || Date.now();

      return {
        cardId,
        difficulty,
        stability,
        retrievability: typeof card.retrievability === 'number' ? card.retrievability : 1.0,
        reps,
        lapses,
        lastReview,
        intervalDays: card.intervalDays || Math.max(1, Math.round(stability)),
        nextReview: card.nextReview || (lastReview + Math.max(1, Math.round(stability)) * 86400000)
      };
    }

    /**
     * Process review rating and compute updated card state
     * @param {Object} rawCard 
     * @param {number|string} rating 1=Again, 2=Hard, 3=Good, 4=Easy
     * @param {number} [elapsedDays] Days since last review (auto-calculated if omitted)
     * @returns {Object} Updated card state
     */
    rateCard(rawCard, rating, elapsedDays) {
      const card = this.sanitizeCard(rawCard);
      const G = this.clamp(Math.round(Number(rating) || 3), 1, 4);

      let t = elapsedDays;
      if (t === undefined || t === null || isNaN(t)) {
        if (card.lastReview) {
          t = Math.max(0, (Date.now() - card.lastReview) / 86400000);
        } else {
          t = 1.0;
        }
      } else {
        t = Math.max(0, Number(t));
      }

      const D = card.difficulty;
      const S = card.stability;
      const R = this.retrievability(t, S);

      // Step 2: Next Review Difficulty Update
      // D' = clamp(w[7]*D0(3) + (1 - w[7])*(D - w[6]*(G - 3)), 1, 10)
      const d0_3 = this.w[4] - Math.exp(this.w[5] * 2) + 1; // Anchor at Good (G=3)
      const rawNewD = this.w[7] * d0_3 + (1 - this.w[7]) * (D - this.w[6] * (G - 3));
      const newD = this.clamp(rawNewD, 1.0, 10.0);

      // Step 3 & 4: Stability Update
      let newS;
      if (G === 1) {
        // Lapse (Again)
        const lapseS = this.w[11] *
          Math.pow(D, -this.w[12]) *
          (Math.pow(S + 1, this.w[13]) - 1) *
          Math.exp(this.w[14] * (1 - R));
        newS = Math.max(0.1, Math.min(S, lapseS));
      } else {
        // Recall (Hard, Good, Easy)
        let hG = 1.0;
        if (G === 2) hG = this.w[15]; // Hard penalty
        if (G === 4) hG = this.w[16]; // Easy bonus

        const recallS = S * (1 +
          Math.exp(this.w[8]) *
          (11 - D) *
          Math.pow(S, -this.w[9]) *
          (Math.exp(this.w[10] * (1 - R)) - 1) *
          hG
        );
        newS = Math.max(0.1, recallS);
      }

      // Step 5: Optimal Interval
      const intervalDays = Math.max(1, Math.round(newS));
      const now = Date.now();
      const nextReview = now + intervalDays * 86400000;
      const nextR = this.retrievability(intervalDays, newS);

      return {
        cardId: card.cardId,
        difficulty: Number(newD.toFixed(2)),
        stability: Number(newS.toFixed(2)),
        retrievability: Number(nextR.toFixed(4)),
        reps: card.reps + 1,
        lapses: G === 1 ? card.lapses + 1 : card.lapses,
        lastReview: now,
        intervalDays,
        nextReview
      };
    }

    /**
     * Retrieve due cards from list sorted by most urgent review
     * @param {Array} cardsList Array of card objects
     * @param {number} maxCount Maximum number of due cards to return
     * @returns {Array} Due cards
     */
    getDueCards(cardsList, maxCount = 20) {
      if (!Array.isArray(cardsList)) return [];
      const now = Date.now();
      return cardsList
        .filter(c => c && (Number(c.nextReview) || 0) <= now)
        .sort((a, b) => (Number(a.nextReview) || 0) - (Number(b.nextReview) || 0))
        .slice(0, maxCount);
    }

    /**
     * Storage helper: Save card to localStorage deck
     */
    saveCardToStorage(card, storageKey = 'toeic_fsrs_deck') {
      try {
        if (typeof localStorage === 'undefined') return false;
        const deck = JSON.parse(localStorage.getItem(storageKey) || '{}');
        deck[card.cardId] = card;
        localStorage.setItem(storageKey, JSON.stringify(deck));
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * Storage helper: Get all cards from localStorage deck
     */
    getCardsFromStorage(storageKey = 'toeic_fsrs_deck') {
      try {
        if (typeof localStorage === 'undefined') return [];
        const deck = JSON.parse(localStorage.getItem(storageKey) || '{}');
        return Object.values(deck);
      } catch (e) {
        return [];
      }
    }
  }

  // Attach static weights reference
  FSRS5Engine.DEFAULT_WEIGHTS = FSRS_DEFAULT_WEIGHTS;

  // Provide singleton default instance
  FSRS5Engine.defaultInstance = new FSRS5Engine();

  // Convenience proxy methods on class
  FSRS5Engine.initCard = (...args) => FSRS5Engine.defaultInstance.initCard(...args);
  FSRS5Engine.rateCard = (...args) => FSRS5Engine.defaultInstance.rateCard(...args);
  FSRS5Engine.retrievability = (...args) => FSRS5Engine.defaultInstance.retrievability(...args);
  FSRS5Engine.getDueCards = (...args) => FSRS5Engine.defaultInstance.getDueCards(...args);
  FSRS5Engine.calcInterval = (...args) => FSRS5Engine.defaultInstance.calcInterval(...args);

  return FSRS5Engine;
}));
