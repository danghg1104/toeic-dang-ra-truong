const fs = require('fs');

const path = 'js/tinder-flashcards-3d.js';
let content = fs.readFileSync(path, 'utf8');

// Replace finishSwipe
const oldFinishSwipe = `    finishSwipe(direction, rating, card) {
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

      // Sound & Combo feedback
      if (direction === 'right') {
        this.stats.known++;
        this.combo++;
        if (this.options.soundEnabled && window.WebAudioMicroEngine) {
          window.WebAudioMicroEngine.playDing();
          if (this.combo >= 5) {
            window.WebAudioMicroEngine.playComboCheer();
            window.WebAudioMicroEngine.fireConfetti();
          }
        }
      } else {
        this.stats.reviewAgain++;
        this.combo = 0;
        if (this.options.soundEnabled && window.WebAudioMicroEngine) {
          window.WebAudioMicroEngine.playThud();
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
        this.options.onRate(curCard, rating, fsrsResult);
      }

      this.currentIndex++;
      this.isAnimating = false;
      this.renderCurrentCard();
    }`;

const newFinishSwipe = `    finishSwipe(direction, rating, card) {
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
    }`;

// Replace flip
const oldFlip = `    flip() {
      if (!this.cardEl || this.isAnimating) return;
      this.isFlipped = !this.isFlipped;
      if (this.isFlipped) {
        this.cardEl.classList.add('flipped');
      } else {
        this.cardEl.classList.remove('flipped');
      }
      if (this.options.soundEnabled && window.WebAudioMicroEngine) {
        window.WebAudioMicroEngine.playPop();
      }
    }`;

const newFlip = `    flip() {
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
    }`;

if (content.includes('finishSwipe(direction, rating, card) {')) {
  content = content.replace(oldFinishSwipe, newFinishSwipe);
  content = content.replace(oldFlip, newFlip);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully hardened finishSwipe and flip in js/tinder-flashcards-3d.js');
} else {
  console.error('Target not found in js/tinder-flashcards-3d.js');
}
