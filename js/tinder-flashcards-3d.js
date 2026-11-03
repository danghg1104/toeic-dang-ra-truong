/**
 * Tinder-Style 3D Flashcards Engine (Feature F21 - R6)
 * Real-time 3D tilt gesture physics with FSRS v5 spaced-repetition integration.
 * Swipe Left = Chưa thuộc (Again, rating=1)
 * Swipe Right = Đã thuộc (Good, rating=3)
 * Tap = 3D 180° Flip to reveal meaning, phonetics, example
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TinderFlashcards3D = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class TinderFlashcards3D {
    constructor(options = {}) {
      this.options = Object.assign({
        threshold: 100, // min pixels to eject card
        badgeThreshold: 40,
        maxRotation: 25, // degrees
        onRate: null, // callback (card, rating, fsrsResult)
        onDeckComplete: null,
        soundEnabled: true
      }, options);

      this.deck = [];
      this.currentIndex = 0;
      this.isAnimating = false;
      this.ejectTimer = null;
      this.pendingDirection = null;
      this.pendingRating = null;
      this.isFlipped = false;
      this.combo = 0;
      this.stats = { known: 0, reviewAgain: 0, total: 0 };

      this.startX = 0;
      this.startY = 0;
      this.currentX = 0;
      this.currentY = 0;
      this.isDragging = false;
      this.hasDecidedDirection = false;
      this.isHorizontalSwipe = false;

      this.containerEl = null;
      this.cardEl = null;

      // Bind methods
      this.handleTouchStart = this.handleTouchStart.bind(this);
      this.handleTouchMove = this.handleTouchMove.bind(this);
      this.handleTouchEnd = this.handleTouchEnd.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    /**
     * Pure calculation of swipe state for given delta X
     * @param {number} dx 
     * @param {number} [containerWidth=360] 
     * @returns {{ rotation: number, badge: 'THUỘC'|'CHƯA THUỘC'|null, opacity: number }}
     */
    calculateSwipeState(dx, containerWidth = 360) {
      if (!dx || dx === 0) {
        return { rotation: 0, badge: null, opacity: 0 };
      }
      const rotation = (dx / (containerWidth || 360)) * this.options.maxRotation;
      let badge = null;
      if (dx > this.options.badgeThreshold) {
        badge = 'THUỘC';
      } else if (dx < -this.options.badgeThreshold) {
        badge = 'CHƯA THUỘC';
      }
      const opacity = Math.min(1.0, Math.abs(dx) / 120);
      return { rotation, badge, opacity };
    }

    /**
     * Evaluate action upon release
     * @param {number} dx 
     * @returns {{ action: 'EJECT_RIGHT'|'EJECT_LEFT'|'SNAP_BACK', rating: number|null, transform?: string }}
     */
    evaluateSwipeRelease(dx) {
      if (dx >= this.options.threshold) {
        return { action: 'EJECT_RIGHT', rating: 3 }; // Good
      }
      if (dx <= -this.options.threshold) {
        return { action: 'EJECT_LEFT', rating: 1 };  // Again
      }
      return { action: 'SNAP_BACK', rating: null, transform: 'translate3d(0,0,0) rotate(0deg)' };
    }

    /**
     * Mount deck into DOM container
     * @param {string|HTMLElement} container 
     * @param {Array<Object>} deckCards 
     */
    mount(container, deckCards = []) {
      this.containerEl = typeof container === 'string' ? document.getElementById(container) : container;
      if (!this.containerEl) return;

      if (this.ejectTimer) {
        clearTimeout(this.ejectTimer);
        this.ejectTimer = null;
      }
      this.pendingDirection = null;
      this.pendingRating = null;

      this.deck = Array.isArray(deckCards) ? deckCards.slice() : [];
      this.currentIndex = 0;
      this.isAnimating = false;
      this.isFlipped = false;
      this.combo = 0;
      this.stats = { known: 0, reviewAgain: 0, total: this.deck.length };

      this.injectStyles();
      this.renderCurrentCard();
    }

    /**
     * Inject CSS 3D perspective and card styling
     */
    injectStyles() {
      if (document.getElementById('tinder-flashcards-3d-styles')) return;
      const style = document.createElement('style');
      style.id = 'tinder-flashcards-3d-styles';
      style.textContent = `
        .flashcard-stage {
          perspective: 1000px;
          position: relative;
          width: 100%;
          max-width: 380px;
          height: 480px;
          margin: 0 auto;
          user-select: none;
          touch-action: pan-y;
        }
        .flashcard-card {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.2s ease;
          cursor: grab;
          will-change: transform;
        }
        .flashcard-card:active {
          cursor: grabbing;
        }
        .flashcard-card.is-dragging {
          transition: none !important;
        }
        .flashcard-card.flipped {
          transform: rotateY(180deg) !important;
        }
        .flashcard-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 28px;
          box-shadow: 0 16px 40px -12px rgba(15, 23, 42, 0.18);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .flashcard-back {
          transform: rotateY(180deg);
        }
        .swipe-badge-thuoc {
          position: absolute;
          top: 24px;
          right: 24px;
          transform: rotate(15deg);
          border: 3px solid #10b981;
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          font-weight: 900;
          font-size: 1.1rem;
          padding: 6px 14px;
          border-radius: 12px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.1s ease;
          z-index: 10;
        }
        .swipe-badge-chua {
          position: absolute;
          top: 24px;
          left: 24px;
          transform: rotate(-15deg);
          border: 3px solid #ef4444;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.12);
          font-weight: 900;
          font-size: 1.1rem;
          padding: 6px 14px;
          border-radius: 12px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.1s ease;
          z-index: 10;
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Render active card or completion screen
     */
    renderCurrentCard() {
      if (!this.containerEl) return;

      if (this.currentIndex >= this.deck.length) {
        this.renderCompletionScreen();
        return;
      }

      const card = this.deck[this.currentIndex];
      this.isFlipped = false;

      const word = this.escapeHtml(card.word || card.term || 'Word');
      const ipa = this.escapeHtml(card.ipa || card.phonetic || '/.../');
      const pos = this.escapeHtml(card.pos || card.type || 'v.');
      const meaning = this.escapeHtml(card.meaning || card.definition || 'Định nghĩa tiếng Việt');
      const example = this.escapeHtml(card.example || card.sentence || 'No example sentence.');
      const exampleVi = this.escapeHtml(card.exampleVi || card.translation || '');
      const collocation = this.escapeHtml(card.collocation || card.phrase || '');
      const tier = card.tier || 'Cực Cao';

      let tierBadgeClass = 'bg-rose-500/20 text-rose-500 border-rose-500/40';
      if (tier === 'Cao') tierBadgeClass = 'bg-amber-500/20 text-amber-500 border-amber-500/40';
      else if (tier === 'Trung Bình') tierBadgeClass = 'bg-slate-500/20 text-slate-400 border-slate-500/40';

      const progressPercent = Math.round(((this.currentIndex + 1) / this.deck.length) * 100);

      this.containerEl.innerHTML = `
        <div class="flashcard-stage">
          <div id="activeTinderCard" class="flashcard-card">
            <!-- Front Face -->
            <div class="flashcard-face flashcard-front bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 justify-between shadow-xl">
              <!-- Badges for visual swipe cues -->
              <div class="swipe-badge-thuoc" id="badgeThuoc">ĐÃ THUỘC ✓</div>
              <div class="swipe-badge-chua" id="badgeChua">CHƯA THUỘC ✕</div>

              <!-- Top Bar & Progress -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${tierBadgeClass}">
                    ${tier}
                  </span>
                  <span class="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">
                    ${this.currentIndex + 1} / ${this.deck.length}
                  </span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
                </div>
              </div>

              <!-- Center Word Info -->
              <div class="text-center my-auto py-3 space-y-2">
                <div class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  ${word}
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold">${ipa}</span>
                  <span class="text-xs text-slate-400 italic font-semibold">(${pos})</span>
                </div>
                ${collocation ? `
                  <div class="pt-1.5">
                    <span class="inline-block px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Collocation: <strong class="text-indigo-600 dark:text-indigo-400">${collocation}</strong>
                    </span>
                  </div>
                ` : ''}
              </div>

              <!-- Bottom Interactive Action Buttons -->
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('left')" class="flex-1 py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs" title="Chưa thuộc (Hoặc vuốt sang trái)">
                    <span>✕ Chưa thuộc</span>
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.flip()" class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs" title="Chạm để lật mặt sau">
                    <span>🔄 Lật nghĩa</span>
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('right')" class="flex-1 py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs" title="Đã thuộc (Hoặc vuốt sang phải)">
                    <span>✓ Đã thuộc</span>
                  </button>
                </div>
                <div class="text-[10px] text-slate-400 text-center font-medium">
                  👈 Vuốt trái = Chưa thuộc · 👉 Vuốt phải = Đã thuộc
                </div>
              </div>
            </div>

            <!-- Back Face -->
            <div class="flashcard-face flashcard-back bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 justify-between shadow-xl">
              <!-- Top Bar -->
              <div>
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-base font-black text-indigo-600 dark:text-indigo-400">${word}</span>
                    <span class="text-xs text-slate-400 font-mono">${ipa}</span>
                  </div>
                  <span class="text-xs font-mono text-slate-400 font-semibold">
                    Mặt sau
                  </span>
                </div>
              </div>

              <!-- Meaning & Context -->
              <div class="space-y-3 my-auto text-left">
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Nghĩa tiếng Việt</div>
                  <div class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">${meaning}</div>
                </div>

                <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div class="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">Ví dụ đề thi ETS</div>
                  <div class="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">${example}</div>
                  ${exampleVi ? `<div class="text-slate-500 italic text-[11px] pt-1 border-t border-slate-200/50 dark:border-slate-700/50">${exampleVi}</div>` : ''}
                </div>
              </div>

              <!-- Back Action Bar -->
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('left')" class="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                  <span>✕ Chưa thuộc</span>
                </button>
                <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.flip()" class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                  <span>🔄 Lật lại</span>
                </button>
                <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('right')" class="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                  <span>✓ Đã thuộc</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.cardEl = document.getElementById('activeTinderCard');
      this.attachEvents();
    }

    /**
     * Attach touch and mouse gesture listeners
     */
    attachEvents() {
      if (!this.cardEl) return;

      // Touch events
      this.cardEl.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      window.addEventListener('touchend', this.handleTouchEnd, { passive: true });

      // Mouse events
      this.cardEl.addEventListener('mousedown', this.handleMouseDown);
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    }

    detachEvents() {
      if (this.cardEl) {
        this.cardEl.removeEventListener('touchstart', this.handleTouchStart);
        this.cardEl.removeEventListener('mousedown', this.handleMouseDown);
      }
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('touchend', this.handleTouchEnd);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }

    // Gesture Handlers
    handleTouchStart(e) {
      if (this.isAnimating) {
        if (this.ejectTimer) {
          clearTimeout(this.ejectTimer);
          this.ejectTimer = null;
        }
        const dir = this.pendingDirection || 'right';
        const rat = this.pendingRating || (dir === 'right' ? 3 : 1);
        this.finishSwipe(dir, rat);
      }
      if (this.currentIndex >= this.deck.length) return;
      // Multi-touch guard: ignore 2+ fingers to avoid erratic rotation (F21.B5)
      if (e.touches && e.touches.length > 1) {
        this.isDragging = false;
        return;
      }
      const t = e.touches && e.touches[0];
      if (t) {
        this.startDrag(t.clientX, t.clientY);
      }
    }

    handleTouchMove(e) {
      if (!this.isDragging || !e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - this.startX;
      const dy = t.clientY - this.startY;

      // Vertical scroll check (F21.B3)
      if (!this.hasDecidedDirection) {
        if (Math.abs(dy) > Math.abs(dx)) {
          // Allow natural vertical scroll, cancel card horizontal drag
          this.isDragging = false;
          return;
        }
        this.hasDecidedDirection = true;
        this.isHorizontalSwipe = true;
      }

      if (this.isHorizontalSwipe && e.cancelable) {
        e.preventDefault();
      }

      this.moveDrag(t.clientX, t.clientY);
    }

    handleTouchEnd(e) {
      if (!this.isDragging) return;
      this.endDrag();
    }

    handleMouseDown(e) {
      if (this.isAnimating) {
        if (this.ejectTimer) {
          clearTimeout(this.ejectTimer);
          this.ejectTimer = null;
        }
        const dir = this.pendingDirection || 'right';
        const rat = this.pendingRating || (dir === 'right' ? 3 : 1);
        this.finishSwipe(dir, rat);
      }
      if (this.currentIndex >= this.deck.length || e.button !== 0) return;
      this.startDrag(e.clientX, e.clientY);
    }

    handleMouseMove(e) {
      if (!this.isDragging) return;
      this.moveDrag(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
      if (!this.isDragging) return;
      this.endDrag();
    }

    startDrag(x, y) {
      this.startX = x;
      this.startY = y;
      this.currentX = x;
      this.currentY = y;
      this.isDragging = true;
      this.hasDecidedDirection = false;
      this.isHorizontalSwipe = false;

      if (this.cardEl) {
        this.cardEl.classList.add('is-dragging');
      }
    }

    moveDrag(x, y) {
      this.currentX = x;
      this.currentY = y;
      const dx = this.currentX - this.startX;
      const dy = this.currentY - this.startY;

      if (!this.cardEl) return;

      const containerWidth = this.containerEl ? this.containerEl.clientWidth : 360;
      const state = this.calculateSwipeState(dx, containerWidth);

      // 3D tilt calculation
      this.cardEl.style.transform = `translate3d(${dx}px, ${dy * 0.2}px, 0) rotate(${state.rotation}deg)`;

      // Update badges
      const badgeThuoc = document.getElementById('badgeThuoc');
      const badgeChua = document.getElementById('badgeChua');
      if (badgeThuoc && badgeChua) {
        if (state.badge === 'THUỘC') {
          badgeThuoc.style.opacity = state.opacity;
          badgeChua.style.opacity = 0;
        } else if (state.badge === 'CHƯA THUỘC') {
          badgeChua.style.opacity = state.opacity;
          badgeThuoc.style.opacity = 0;
        } else {
          badgeThuoc.style.opacity = 0;
          badgeChua.style.opacity = 0;
        }
      }
    }

    endDrag() {
      this.isDragging = false;
      if (!this.cardEl) return;
      this.cardEl.classList.remove('is-dragging');

      const dx = this.currentX - this.startX;
      const dy = this.currentY - this.startY;

      // Tap detection (very small movement)
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        this.flip();
        return;
      }

      // Check boundary: 0px dx does not trigger swipe (F21.B1)
      if (dx === 0) {
        this.snapBack();
        return;
      }

      const release = this.evaluateSwipeRelease(dx);
      if (release.action === 'EJECT_RIGHT') {
        this.executeEject('right', release.rating);
      } else if (release.action === 'EJECT_LEFT') {
        this.executeEject('left', release.rating);
      } else {
        this.snapBack();
      }
    }

    snapBack() {
      if (!this.cardEl) return;
      this.cardEl.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)';
      this.cardEl.style.transform = 'translate3d(0,0,0) rotate(0deg)';
      const badgeThuoc = document.getElementById('badgeThuoc');
      const badgeChua = document.getElementById('badgeChua');
      if (badgeThuoc) badgeThuoc.style.opacity = 0;
      if (badgeChua) badgeChua.style.opacity = 0;
    }

    /**
     * Programmatic swipe or gesture completion
     * @param {'left'|'right'} direction 
     * @param {number} [customRating] 
     */
    swipe(direction, customRating) {
      if (this.isAnimating) {
        if (this.ejectTimer) {
          clearTimeout(this.ejectTimer);
          this.ejectTimer = null;
        }
        // Rapid swipe guard: finish current card immediately (F21.B2)
        this.finishSwipe(direction, customRating || (direction === 'right' ? 3 : 1));
        return;
      }
      if (this.currentIndex >= this.deck.length) {
        return;
      }
      const rating = customRating || (direction === 'right' ? 3 : 1);
      this.executeEject(direction, rating);
    }

    executeEject(direction, rating) {
      if (this.currentIndex >= this.deck.length) {
        this.isAnimating = false;
        return;
      }
      this.isAnimating = true;
      this.pendingDirection = direction;
      this.pendingRating = rating;
      const card = this.deck[this.currentIndex];
      const mult = direction === 'right' ? 1.5 : -1.5;
      const targetX = (window.innerWidth || 500) * mult;

      if (this.cardEl) {
        this.cardEl.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
        this.cardEl.style.transform = `translate3d(${targetX}px, 40px, 0) rotate(${direction === 'right' ? 35 : -35}deg)`;
        this.cardEl.style.opacity = '0';
      }

      if (this.ejectTimer) {
        clearTimeout(this.ejectTimer);
        this.ejectTimer = null;
      }
      this.ejectTimer = setTimeout(() => {
        this.ejectTimer = null;
        this.finishSwipe(direction, rating, card);
      }, 300);
    }

    finishSwipe(direction, rating, card) {
      if (this.currentIndex >= this.deck.length) {
        this.isAnimating = false;
        this.renderCurrentCard();
        return;
      }
      if (this.ejectTimer) {
        clearTimeout(this.ejectTimer);
        this.ejectTimer = null;
      }
      this.pendingDirection = null;
      this.pendingRating = null;
      const curCard = card || this.deck[this.currentIndex];
      this.detachEvents();

      try {
        // Sound & Combo feedback
        if (direction === 'right') {
          this.stats.known++;
          this.combo++;
          if (this.options.soundEnabled && window.WebAudioMicroEngine) {
            try {
              if (typeof window.WebAudioMicroEngine.playDing === 'function') {
                window.WebAudioMicroEngine.playDing();
              }
              if (this.combo >= 5) {
                if (typeof window.WebAudioMicroEngine.playComboCheer === 'function') {
                  window.WebAudioMicroEngine.playComboCheer();
                }
                if (typeof window.WebAudioMicroEngine.fireConfetti === 'function') {
                  window.WebAudioMicroEngine.fireConfetti();
                }
              }
            } catch (soundErr) {
              console.warn('Audio feedback failed:', soundErr);
            }
          }
        } else {
          this.stats.reviewAgain++;
          this.combo = 0;
          if (this.options.soundEnabled && window.WebAudioMicroEngine) {
            try {
              if (typeof window.WebAudioMicroEngine.playThud === 'function') {
                window.WebAudioMicroEngine.playThud();
              }
            } catch (soundErr) {
              console.warn('Audio feedback failed:', soundErr);
            }
          }
        }

        // FSRS v5 Integration
        let fsrsResult = null;
        if (window.FSRS5Engine && curCard) {
          try {
            const engine = window.FSRS5Engine.defaultInstance || new window.FSRS5Engine();
            fsrsResult = engine.rateCard(curCard, rating, 1.0);
            Object.assign(curCard, fsrsResult);
          } catch (e) {
            console.warn('FSRS rating update failed', e);
          }
        }

        if (typeof this.options.onRate === 'function') {
          try {
            this.options.onRate(curCard, rating, fsrsResult);
          } catch (e) {}
        }
      } catch (err) {
        console.error('Error during finishSwipe:', err);
      } finally {
        this.currentIndex++;
        this.isAnimating = false;
        this.renderCurrentCard();
      }
    }

    /**
     * Flip card 180 degrees
     */
    flip() {
      if (!this.cardEl || this.isAnimating) return;
      this.isFlipped = !this.isFlipped;
      if (this.isFlipped) {
        this.cardEl.classList.add('flipped');
      } else {
        this.cardEl.classList.remove('flipped');
      }
      try {
        if (this.options.soundEnabled && window.WebAudioMicroEngine && typeof window.WebAudioMicroEngine.playPop === 'function') {
          window.WebAudioMicroEngine.playPop();
        }
      } catch (e) {}
    }

    /**
     * Render deck completion screen (F21.B4)
     */
    renderCompletionScreen() {
      if (!this.containerEl) return;
      const pct = this.stats.total > 0 ? Math.round((this.stats.known / this.stats.total) * 100) : 100;

      this.containerEl.innerHTML = `
        <div class="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 max-w-[380px] mx-auto animate-fade-in">
          <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/30">
            🎉
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Hoàn Thành Ôn Tập!</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Đã áp dụng thuật toán ghi nhớ giãn cách FSRS v5</p>
          </div>

          <div class="grid grid-cols-2 gap-3 py-2">
            <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span class="text-[10px] font-bold text-emerald-600 uppercase block">Đã thuộc</span>
              <strong class="text-xl font-black text-emerald-600 font-mono">${this.stats.known}</strong>
            </div>
            <div class="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span class="text-[10px] font-bold text-rose-600 uppercase block">Cần ôn lại</span>
              <strong class="text-xl font-black text-rose-600 font-mono">${this.stats.reviewAgain}</strong>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <span class="text-slate-500">Độ nhớ bài:</span>
            <span class="font-extrabold text-indigo-600 font-mono text-sm">${pct}%</span>
          </div>

          <div class="pt-2 flex items-center gap-2">
            <button onclick="window.tinderFlashcardsInstance.resetDeck()" class="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition">
              🔄 Ôn Lại Bộ Này
            </button>
            <button onclick="if(window.closeTinderFlashcardModal) window.closeTinderFlashcardModal()" class="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition">
              Đóng
            </button>
          </div>
        </div>
      `;

      if (typeof this.options.onDeckComplete === 'function') {
        this.options.onDeckComplete(this.stats);
      }
    }

    getCurrentCard() {
      return this.deck[this.currentIndex] || null;
    }

    getDeckStats() {
      return Object.assign({}, this.stats);
    }

    resetDeck() {
      if (this.ejectTimer) {
        clearTimeout(this.ejectTimer);
        this.ejectTimer = null;
      }
      this.pendingDirection = null;
      this.pendingRating = null;
      this.currentIndex = 0;
      this.stats = { known: 0, reviewAgain: 0, total: this.deck.length };
      this.combo = 0;
      this.renderCurrentCard();
    }

    unmount() {
      if (this.ejectTimer) {
        clearTimeout(this.ejectTimer);
        this.ejectTimer = null;
      }
      this.pendingDirection = null;
      this.pendingRating = null;
      this.detachEvents();
      if (this.containerEl) {
        this.containerEl.innerHTML = '';
      }
    }

    destroy() {
      this.unmount();
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
      }[m]));
    }
  }

  return TinderFlashcards3D;
}));
