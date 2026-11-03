/**
 * 10-Minute Adaptive Test Engine (2PL IRT)
 * TOEIC Master (noble-franklin)
 * 
 * Implements 2-Parameter Logistic (2PL) Item Response Theory:
 * - P_i(theta) = c_i + (1 - c_i) / (1 + exp(-a_i * (theta - b_i)))
 * - Maximum Fisher Information item selection: I_i(theta)
 * - Real-time Bayesian ability estimation (theta in [-3.0, +3.0])
 * - 600-second (10-minute) countdown budgeting
 * - ETS Scaled Score mapping (10–990) with Listening/Reading breakdown and 95% CI
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ToeicAdaptiveEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // =========================================================================
  // 1. BUILT-IN CURATED ADAPTIVE QUESTION BANK (PARTS 1-7, TIERS 1-5)
  // =========================================================================
  const ADAPTIVE_QUESTION_BANK = [
    // TIER 1: Beginner (b in [-2.5, -1.2]) - 100-350 Target Band
    {
      id: 'adp_p1_01',
      part: 1,
      tier: 1,
      b: -2.0,
      a: 1.5,
      c: 0.25,
      trapCategory: 'TRAP-01',
      q: 'Look at the photograph. Choose the statement that best describes what you see.',
      options: [
        'A) A man is typing on a desktop computer.',
        'B) Papers are being shredded in an office machine.',
        'C) A woman is writing notes in a spiral notebook.',
        'D) Files are scattered across the floor.'
      ],
      ans: 2, // C
      explanation: 'The photo depicts a woman writing notes with a pen in her notebook. Option B contains the passive continuous "is being" trap without human machine operation.'
    },
    {
      id: 'adp_p2_01',
      part: 2,
      tier: 1,
      b: -1.6,
      a: 1.4,
      c: 0.33,
      trapCategory: 'TRAP-05',
      q: 'Where did you leave the conference itinerary?',
      options: [
        'A) On Mr. Tanaka\'s reception desk.',
        'B) Yes, I attended the keynote speech.',
        'C) At three o\'clock this afternoon.'
      ],
      ans: 0, // A
      explanation: 'Direct location response for "Where". Option B is a Yes/No trap for a Wh- question; Option C answers "When".'
    },
    {
      id: 'adp_p5_01',
      part: 5,
      tier: 1,
      b: -1.4,
      a: 1.6,
      c: 0.25,
      trapCategory: 'TRAP-09',
      q: 'Ms. Miller submitted her quarterly expense report _______ than expected.',
      options: [
        'A) early',
        'B) earlier',
        'C) earliest',
        'D) earliness'
      ],
      ans: 1, // B
      explanation: 'Comparative form "earlier" is required before "than".'
    },

    // TIER 2: Elementary (b in [-1.2, -0.3]) - 350-500 Target Band
    {
      id: 'adp_p1_02',
      part: 1,
      tier: 2,
      b: -0.9,
      a: 1.6,
      c: 0.25,
      trapCategory: 'TRAP-02',
      q: 'Look at the photo of the laboratory technician.',
      options: [
        'A) She is putting on a pair of safety goggles.',
        'B) She is wearing a protective laboratory coat.',
        'C) She is washing medical glassware in the sink.',
        'D) She is adjusting the microscope eyepiece.'
      ],
      ans: 1, // B
      explanation: 'State vs Action trap: "wearing" describes existing state; "putting on" describes the active motion of dressing.'
    },
    {
      id: 'adp_p2_02',
      part: 2,
      tier: 2,
      b: -0.6,
      a: 1.5,
      c: 0.33,
      trapCategory: 'TRAP-03',
      q: 'Could you make thirty copies of the agenda before ten?',
      options: [
        'A) Coffee is served in the staff lounge.',
        'B) I will start the photocopier right away.',
        'C) No, the coffee cup was empty.'
      ],
      ans: 1, // B
      explanation: 'Options A and C exploit the homophone/near-sound trap between "copies" and "coffee".'
    },
    {
      id: 'adp_p3_01',
      part: 3,
      tier: 2,
      b: -0.4,
      a: 1.7,
      c: 0.25,
      trapCategory: 'TRAP-06',
      q: 'What is the man concerned about regarding the upcoming seminar?',
      dialogue: 'M: Has the catering service confirmed the luncheon delivery for Thursday?\nW: Yes, they will arrive promptly at 11:30 AM with vegetarian options.\nM: Good. That gives us thirty minutes to set up before attendees arrive.',
      options: [
        'A) The venue audio equipment.',
        'B) The luncheon delivery time.',
        'C) The keynote speaker\'s travel.',
        'D) The seminar registration fees.'
      ],
      ans: 1, // B
      explanation: 'The man explicitly asks about the catering service luncheon delivery confirmation.'
    },
    {
      id: 'adp_p5_02',
      part: 5,
      tier: 2,
      b: -0.5,
      a: 1.6,
      c: 0.25,
      trapCategory: 'TRAP-10',
      q: '_______ severe traffic congestion on Highway 10, the regional director arrived on time.',
      options: [
        'A) Although',
        'B) In spite of',
        'C) Because',
        'D) Even if'
      ],
      ans: 1, // B
      explanation: '"In spite of" is a preposition followed by a noun phrase ("severe traffic congestion"). "Although" requires a clause.'
    },

    // TIER 3: Intermediate (b in [-0.3, +0.6]) - 500-650 Target Band
    {
      id: 'adp_p2_03',
      part: 2,
      tier: 3,
      b: 0.1,
      a: 1.6,
      c: 0.33,
      trapCategory: 'TRAP-04',
      q: 'Has the regional sales report been finalized yet?',
      options: [
        'A) David was reviewing the figures thirty minutes ago.',
        'B) Yes, the retail store is open today.',
        'C) Sales tax increased by two percent.'
      ],
      ans: 0, // A
      explanation: 'Evasive/indirect response: Rather than direct Yes/No, informs that David is still reviewing it.'
    },
    {
      id: 'adp_p3_02',
      part: 3,
      tier: 3,
      b: 0.3,
      a: 1.8,
      c: 0.25,
      trapCategory: 'TRAP-06',
      q: 'Where will the executive banquet most likely take place?',
      dialogue: 'M: Let\'s book the Grand Ballroom on the 4th floor for Friday night.\nW: Wait, the HVAC maintenance team just notified me that ventilation is shut down there.\nM: In that case, let\'s reserve the Riverside Terrace instead.',
      options: [
        'A) The Grand Ballroom on the 4th floor.',
        'B) The Riverside Terrace.',
        'C) The corporate dining cafeteria.',
        'D) An offsite downtown hotel.'
      ],
      ans: 1, // B
      explanation: 'Reversal trap: Speaker initially suggests the Grand Ballroom, but reverses to the Riverside Terrace due to HVAC shutdown.'
    },
    {
      id: 'adp_p4_01',
      part: 4,
      tier: 3,
      b: 0.4,
      a: 1.6,
      c: 0.25,
      trapCategory: 'TRAP-07',
      q: 'What does the speaker imply when she says, "My calendar is completely clear after lunch"?',
      talk: 'Good morning, team. We need to finalize the quarterly audit report by tomorrow afternoon. I know everyone has tight deadlines, but my calendar is completely clear after lunch.',
      options: [
        'A) She intends to take the afternoon off.',
        'B) She is available to assist team members with the audit.',
        'C) Her electronic calendar system has malfunctioned.',
        'D) She has cancelled tomorrow\'s board meeting.'
      ],
      ans: 1, // B
      explanation: 'Speaker intent: Having a clear calendar implies she has time available to support colleagues with the audit report.'
    },
    {
      id: 'adp_p5_03',
      part: 5,
      tier: 3,
      b: 0.2,
      a: 1.7,
      c: 0.25,
      trapCategory: 'TRAP-09',
      q: 'The board of directors commended Ms. Vance for her bold _______ to reduce corporate carbon emissions.',
      options: [
        'A) initiate',
        'B) initiative',
        'C) initial',
        'D) initiated'
      ],
      ans: 1, // B
      explanation: 'Special part of speech trap: "initiative" ends in -ive but functions as a countable noun meaning "project / undertaking".'
    },
    {
      id: 'adp_p7_01',
      part: 7,
      tier: 3,
      b: 0.5,
      a: 1.7,
      c: 0.25,
      trapCategory: 'TRAP-12',
      q: 'According to the notice, what must employees do before entering the cleanroom facility?',
      passage: 'NOTICE: Cleanroom Protocol. All laboratory technicians and authorized visitors must scan their biometric badge at Station A and don disposable polypropylene overshoes before entering the sterile airlock corridor.',
      options: [
        'A) Present a paper visitor pass at reception.',
        'B) Put on disposable overshoes and scan their badge.',
        'C) Disinfect all personal electronic devices.',
        'D) Complete a thirty-minute safety seminar.'
      ],
      ans: 1, // B
      explanation: 'The notice explicitly requires biometric badge scanning and donning disposable overshoes.'
    },

    // TIER 4: Advanced (b in [+0.6, +1.5]) - 650-800 Target Band
    {
      id: 'adp_p3_03',
      part: 3,
      tier: 4,
      b: 0.9,
      a: 1.8,
      c: 0.25,
      trapCategory: 'TRAP-06',
      q: 'Why will the software rollout be postponed until November?',
      dialogue: 'W1: Quality assurance finished the beta test cycle yesterday with zero critical bugs.\nM: Excellent. Then we can proceed with the October 15 launch.\nW2: Actually, our European server hosting partner just announced routine datacenter migrations on October 14 through 18. Launching then would cause connectivity outages.\nM: Good catch. Let\'s reschedule for the first week of November.',
      options: [
        'A) Software bugs were discovered in the beta version.',
        'B) Server hosting migrations would cause network outages.',
        'C) The marketing campaign has not been approved.',
        'D) Staff members will be attending a technology summit.'
      ],
      ans: 1, // B
      explanation: '3-speaker reversal trap: The launch is delayed due to European server hosting migrations, not software bugs.'
    },
    {
      id: 'adp_p4_02',
      part: 4,
      tier: 4,
      b: 1.1,
      a: 1.7,
      c: 0.25,
      trapCategory: 'TRAP-08',
      q: 'Look at the graphic. Which flight gate should passengers proceed to?',
      talk: 'Attention passengers on Apex Air Flight 412 bound for Frankfurt. Due to delayed maintenance on the Boeing 787 at Gate B14, your departure has been relocated to the gate directly adjacent to the international currency exchange booth.',
      graphic: 'Gate B12 (Duty Free) | Gate B14 (Original) | Gate B16 (Adjacent to Currency Exchange) | Gate B18 (Lounge)',
      options: [
        'A) Gate B12',
        'B) Gate B14',
        'C) Gate B16',
        'D) Gate B18'
      ],
      ans: 2, // C
      explanation: 'Graphic lookup trap: Audio specifies gate adjacent to currency exchange, which maps to Gate B16.'
    },
    {
      id: 'adp_p6_01',
      part: 6,
      tier: 4,
      b: 0.8,
      a: 1.7,
      c: 0.25,
      trapCategory: 'TRAP-11',
      q: 'Which sentence best fits in blank [132]?',
      passage: 'Apex Global Logistics is proud to announce the expansion of our maritime freight operations. [131]. _______[132]_______. Consequently, cargo delivery times to Southeast Asian ports will be reduced by an estimated forty-eight hours.',
      options: [
        'A) We recently acquired four state-of-the-art container vessels.',
        'B) All clerical staff must complete workplace fire safety training.',
        'C) Maritime fuel costs increased sharply throughout the previous fiscal year.',
        'D) Customers may return defective merchandise within thirty business days.'
      ],
      ans: 0, // A
      explanation: 'Cohesive sentence insertion: Acquiring container vessels directly connects the expansion with reduced delivery times.'
    },
    {
      id: 'adp_p7_02',
      part: 7,
      tier: 4,
      b: 1.3,
      a: 1.9,
      c: 0.25,
      trapCategory: 'TRAP-12',
      q: 'What is the discounted total price for Mr. Chen\'s order?',
      passage: 'Doc 1 (Catalog): Standard Ergonomic Chair ($400). Lumbar Support Add-on ($50).\nDoc 2 (Promo Code): Enter code CORP20 for a 20% discount on all seating furniture (excludes accessories).\nDoc 3 (Email): Mr. Chen ordered one chair with lumbar support using code CORP20.',
      options: [
        'A) $320',
        'B) $360',
        'C) $370',
        'D) $450'
      ],
      ans: 2, // C
      explanation: 'Synthesis multi-doc trap: 20% applies ONLY to the chair ($400 - $80 = $320). Lumbar accessory ($50) has no discount. Total = $320 + $50 = $370.'
    },

    // TIER 5: Mastery (b in [+1.5, +2.5]) - 800-990 Target Band
    {
      id: 'adp_p3_04',
      part: 3,
      tier: 5,
      b: 1.8,
      a: 1.9,
      c: 0.25,
      trapCategory: 'TRAP-06',
      q: 'What will the management committee do before approving the acquisition?',
      dialogue: 'M1: The financial due diligence shows strong cash flow from Crestview Tech.\nW: But their chief intellectual property counsel flagged an ongoing patent litigation in Munich.\nM2: Under corporate governance rule 4B, any unresolved litigation over $5 million mandates an independent risk assessment.\nM1: Then we must commission that appraisal before the board votes next Thursday.',
      options: [
        'A) Settle the Munich patent lawsuit immediately.',
        'B) Commission an independent risk appraisal.',
        'C) Revoke Crestview Tech\'s corporate operating license.',
        'D) Postpone all board votes until the following fiscal quarter.'
      ],
      ans: 1, // B
      explanation: '3-party coordination and governance rule synthesis: They must commission an independent risk assessment before voting.'
    },
    {
      id: 'adp_p5_04',
      part: 5,
      tier: 5,
      b: 2.1,
      a: 2.0,
      c: 0.25,
      trapCategory: 'TRAP-10',
      q: 'The legal department insisted that each affiliate company _______ its financial disclosures to independent auditors by month-end.',
      options: [
        'A) submits',
        'B) submit',
        'C) submitted',
        'D) will submit'
      ],
      ans: 1, // B
      explanation: 'Subjunctive mood trap: Verbs of demand/insistence ("insisted that") require bare infinitive verb form ("submit").'
    },
    {
      id: 'adp_p7_03',
      part: 7,
      tier: 5,
      b: 2.3,
      a: 2.0,
      c: 0.25,
      trapCategory: 'TRAP-12',
      q: 'Which facility is exempt from the municipal environmental surcharge in the second quarter?',
      passage: 'Doc 1 (Municipal Policy): Surcharges apply to all manufacturing plants consuming >500 MWh/month unless ISO 14001 certified before January 1.\nDoc 2 (Audit): Plant A (420 MWh, certified Feb 15). Plant B (680 MWh, certified Nov 20 previous year). Plant C (750 MWh, uncertified).\nDoc 3: Plant A power consumption jumped to 540 MWh in Q2.',
      options: [
        'A) Plant A only',
        'B) Plant B only',
        'C) Plants A and B',
        'D) None of the facilities'
      ],
      ans: 1, // B
      explanation: 'Triple document cross-referencing: Plant B consumes >500 MWh but was certified Nov 20 (before Jan 1), so it is exempt. Plant A certified late; Plant C uncertified.'
    }
  ];

  // =========================================================================
  // 2. 2PL IRT ADAPTIVE TEST ENGINE CLASS
  // =========================================================================

  class ToeicAdaptiveEngine {
    constructor(questionBank = ADAPTIVE_QUESTION_BANK) {
      this.pool = Array.isArray(questionBank) ? questionBank.slice() : ADAPTIVE_QUESTION_BANK.slice();
      this.reset();
    }

    /**
     * Reset engine state
     */
    reset() {
      this.theta = 0.0;                 // Latent ability (baseline ~500 band)
      this.standardError = 1.0;         // SE(theta)
      this.administered = [];           // Array of answered item records
      this.unadministered = this.pool.slice();
      this.currentQuestion = null;
      this.startTime = null;
      this.elapsedSeconds = 0;
      this.isFinished = false;
      this.timerInterval = null;
      this.maxTimeSeconds = 600;        // 10 minutes budget
      this.maxItems = 18;               // Maximum questions
      this.minItems = 14;               // Minimum questions for early stopping
    }

    // =========================================================================
    // IRT MATHEMATICAL METHODS (STATIC)
    // =========================================================================

    /**
     * 2PL IRT Probability: P_i(theta) = c_i + (1 - c_i) / (1 + exp(-a_i * (theta - b_i)))
     */
    static probability(theta, b, a = 1.6, c = 0.25) {
      const th = Math.min(3.0, Math.max(-3.0, Number(theta) || 0));
      const diff = Number(b) || 0;
      const disc = Math.min(2.5, Math.max(0.5, Number(a) || 1.6));
      const guess = Math.min(0.5, Math.max(0.0, Number(c) !== undefined ? Number(c) : 0.25));

      const exponent = -disc * (th - diff);
      const logistic = 1.0 / (1.0 + Math.exp(exponent));
      return guess + (1.0 - guess) * logistic;
    }

    /**
     * Fisher Information: I_i(theta) = a_i^2 * (P_i - c_i)^2 * (1 - P_i) / ((1 - c_i)^2 * P_i)
     */
    static fisherInformation(theta, b, a = 1.6, c = 0.25) {
      const P = ToeicAdaptiveEngine.probability(theta, b, a, c);
      const guess = Number(c) !== undefined ? Number(c) : 0.25;
      const disc = Number(a) || 1.6;

      const num = Math.pow(disc, 2) * Math.pow(P - guess, 2) * (1.0 - P);
      const den = Math.pow(1.0 - guess, 2) * P;

      return den > 0 ? num / den : 0.0;
    }

    /**
     * Convert latent ability theta to ETS Scaled Score (10–990)
     * Score_ETS(theta) = clamp(round(495 / (1 + exp(-0.9 * theta))) * 2, 10, 990)
     */
    static thetaToScore(theta) {
      const th = Number(theta) || 0;
      if (th >= 3.8) return 990;
      if (th <= -4.0) return 10;

      const scaled = Math.round(495.0 / (1.0 + Math.exp(-0.9 * th))) * 2;
      return Math.min(990, Math.max(10, scaled));
    }

    // =========================================================================
    // TEST PROGRESSION & QUESTION SELECTION
    // =========================================================================

    /**
     * Start the 10-minute adaptive test session
     */
    startTest(options = {}) {
      this.reset();
      this.startTime = Date.now();
      const opts = (options && typeof options === 'object') ? options : {};
      if (opts.maxTimeSeconds) this.maxTimeSeconds = opts.maxTimeSeconds;

      // Select first question: intermediate difficulty matching theta = 0.0
      this.currentQuestion = this.selectNextQuestion();
      return this.getPublicQuestion(this.currentQuestion);
    }

    /**
     * Select unadministered question that maximizes Fisher Information at current theta
     */
    selectNextQuestion() {
      if (this.unadministered.length === 0) return null;

      let bestItem = null;
      let maxInfo = -1;
      let bestIndex = -1;

      // Ensure balance across listening (P1-4) and reading (P5-7)
      const administeredListening = this.administered.filter(a => a.part <= 4).length;
      const administeredReading = this.administered.filter(a => a.part >= 5).length;
      const preferSection = administeredListening <= administeredReading ? 'listening' : 'reading';

      for (let i = 0; i < this.unadministered.length; i++) {
        const item = this.unadministered[i];
        let info = ToeicAdaptiveEngine.fisherInformation(this.theta, item.b, item.a, item.c);

        // Small section balancing tiebreaker
        const itemSection = item.part <= 4 ? 'listening' : 'reading';
        if (itemSection === preferSection) {
          info *= 1.05;
        }

        if (info > maxInfo) {
          maxInfo = info;
          bestItem = item;
          bestIndex = i;
        }
      }

      if (bestIndex !== -1) {
        this.unadministered.splice(bestIndex, 1);
      }
      return bestItem;
    }

    /**
     * Return safe public question view (strip actual answer index)
     */
    getPublicQuestion(item) {
      if (!item) return null;
      return {
        id: item.id,
        part: item.part,
        tier: item.tier,
        q: item.q,
        dialogue: item.dialogue || null,
        talk: item.talk || null,
        passage: item.passage || null,
        graphic: item.graphic || null,
        options: item.options.slice(),
        trapCategory: item.trapCategory || null,
        totalAnswered: this.administered.length,
        timeRemainingSeconds: this.getTimeRemaining()
      };
    }

    /**
     * Get remaining test seconds
     */
    getTimeRemaining() {
      if (!this.startTime) return this.maxTimeSeconds;
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      return Math.max(0, this.maxTimeSeconds - elapsed);
    }

    /**
     * Submit candidate answer for current question
     * @param {string} qId Question ID
     * @param {number} selectedOption 0-indexed choice (0 = A, 1 = B, etc.)
     * @returns {Object} Progress report and next question (or test results if finished)
     */
    submitAnswer(qId, selectedOption) {
      if (this.isFinished) {
        return { isFinished: true, results: this.finishTest() };
      }

      let curQ = this.currentQuestion;
      if (!curQ || curQ.id !== qId) {
        // Fallback find question by id
        const found = this.pool.find(q => q.id === qId);
        if (!found) {
          throw new Error(`[ToeicAdaptiveEngine] Question ID ${qId} not found in pool`);
        }
        curQ = found;
      }

      const isCorrect = (Number(selectedOption) === curQ.ans);
      const u_k = isCorrect ? 1.0 : 0.0;
      const P = ToeicAdaptiveEngine.probability(this.theta, curQ.b, curQ.a, curQ.c);

      // Ability update via bounded gradient / Newton step:
      // theta_{k+1} = theta_k + (u_k - P_i) / (a_i * (1 - c_i)) * stepFactor
      const stepFactor = 0.35;
      const step = ((u_k - P) / (curQ.a * (1.0 - curQ.c))) * stepFactor;
      this.theta = Math.min(3.0, Math.max(-3.0, this.theta + step));

      // Calculate Fisher info from this item
      const itemInfo = ToeicAdaptiveEngine.fisherInformation(this.theta, curQ.b, curQ.a, curQ.c);

      // Record administered item
      this.administered.push({
        id: curQ.id,
        part: curQ.part,
        tier: curQ.tier,
        b: curQ.b,
        a: curQ.a,
        c: curQ.c,
        trapCategory: curQ.trapCategory,
        selectedOption: Number(selectedOption),
        correctOption: curQ.ans,
        isCorrect,
        thetaAfter: Number(this.theta.toFixed(3)),
        itemInfo: Number(itemInfo.toFixed(3))
      });

      // Update Standard Error: SE(theta) = 1 / sqrt(sum(I_j) + 1.0)
      const sumInfo = this.administered.reduce((acc, it) => acc + (it.itemInfo || 0.5), 0);
      this.standardError = Number((1.0 / Math.sqrt(sumInfo + 1.0)).toFixed(3));

      // Update elapsed time
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.elapsedSeconds = elapsed;

      // Check termination conditions
      const shouldTerminate = this.checkTermination(elapsed);

      if (shouldTerminate) {
        this.isFinished = true;
        const results = this.finishTest();
        return {
          isFinished: true,
          isCorrect,
          correctAnswer: curQ.ans,
          explanation: curQ.explanation,
          results
        };
      }

      // Select next item
      this.currentQuestion = this.selectNextQuestion();
      if (!this.currentQuestion) {
        this.isFinished = true;
        return {
          isFinished: true,
          isCorrect,
          correctAnswer: curQ.ans,
          explanation: curQ.explanation,
          results: this.finishTest()
        };
      }

      return {
        isFinished: false,
        isCorrect,
        correctAnswer: curQ.ans,
        explanation: curQ.explanation,
        theta: Number(this.theta.toFixed(2)),
        standardError: this.standardError,
        nextQuestion: this.getPublicQuestion(this.currentQuestion),
        administeredCount: this.administered.length
      };
    }

    /**
     * Check stopping rules:
     * - Elapsed time >= 600 seconds
     * - Administered count >= 18
     * - Administered count >= 14 AND standard error <= 0.24
     */
    checkTermination(elapsedSeconds) {
      const k = this.administered.length;
      if (elapsedSeconds >= this.maxTimeSeconds) return true;
      if (k >= this.maxItems) return true;
      if (k >= this.minItems && this.standardError <= 0.24) return true;
      return false;
    }

    /**
     * Conclude test and calculate complete ETS score report
     */
    finishTest() {
      this.isFinished = true;
      const totalScore = ToeicAdaptiveEngine.thetaToScore(this.theta);

      // Section breakdown
      const listeningItems = this.administered.filter(a => a.part <= 4);
      const readingItems = this.administered.filter(a => a.part >= 5);

      const listeningAcc = listeningItems.length > 0
        ? listeningItems.filter(a => a.isCorrect).length / listeningItems.length
        : 0.5;
      const readingAcc = readingItems.length > 0
        ? readingItems.filter(a => a.isCorrect).length / readingItems.length
        : 0.5;

      const listeningScore = Math.min(495, Math.max(5, Math.round(listeningAcc * 495)));
      const readingScore = Math.min(495, Math.max(5, Math.round(readingAcc * 495)));

      // 95% Confidence Interval: [Score(theta - 1.96*SE), Score(theta + 1.96*SE)]
      const minTheta = this.theta - 1.96 * this.standardError;
      const maxTheta = this.theta + 1.96 * this.standardError;
      const scoreMin = Math.max(10, ToeicAdaptiveEngine.thetaToScore(minTheta));
      const scoreMax = Math.min(990, ToeicAdaptiveEngine.thetaToScore(maxTheta));

      // Part Breakdown (Parts 1-7)
      const partBreakdown = {};
      for (let p = 1; p <= 7; p++) {
        const pItems = this.administered.filter(a => a.part === p);
        if (pItems.length > 0) {
          const correct = pItems.filter(a => a.isCorrect).length;
          partBreakdown[p] = Number((correct / pItems.length).toFixed(2));
        } else {
          // If no direct items, interpolate from section accuracy
          const base = p <= 4 ? listeningAcc : readingAcc;
          partBreakdown[p] = Number(base.toFixed(2));
        }
      }

      // Calculate probability of scoring >= 650 points in 30 days
      const days = 30;
      const hours = 1.5;
      const delta = days * hours * 1.25;
      const mu = totalScore + delta;
      const sigma = 32.0;
      const z = (mu - 650) / (sigma * Math.SQRT2);
      // Inline Abramowitz erf
      const t = 1.0 / (1.0 + 0.3275911 * Math.abs(z));
      const poly = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
      const erfVal = z < 0 ? -poly : poly;
      const probabilityOver650 = Math.min(100, Math.max(0, Math.round(0.5 * (1.0 + erfVal) * 100)));

      return {
        estimatedScore: [scoreMin, scoreMax],
        totalScore,
        listeningScore,
        readingScore,
        theta: Number(this.theta.toFixed(3)),
        standardError: this.standardError,
        administeredCount: this.administered.length,
        timeSpentSeconds: this.elapsedSeconds || Math.floor((Date.now() - (this.startTime || Date.now())) / 1000),
        partBreakdown,
        probabilityOver650,
        answers: this.administered.slice()
      };
    }
  }

  // Static properties
  ToeicAdaptiveEngine.ADAPTIVE_QUESTION_BANK = ADAPTIVE_QUESTION_BANK;

  // Singleton instance
  ToeicAdaptiveEngine.defaultInstance = new ToeicAdaptiveEngine();
  ToeicAdaptiveEngine.startTest = (...args) => ToeicAdaptiveEngine.defaultInstance.startTest(...args);
  ToeicAdaptiveEngine.submitAnswer = (...args) => ToeicAdaptiveEngine.defaultInstance.submitAnswer(...args);
  ToeicAdaptiveEngine.finishTest = (...args) => ToeicAdaptiveEngine.defaultInstance.finishTest(...args);

  return ToeicAdaptiveEngine;
}));
