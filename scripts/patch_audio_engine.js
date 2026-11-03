const fs = require('fs');

const path = 'js/web-audio-micro-engine.js';
let content = fs.readFileSync(path, 'utf8');

const target = 'playDing() {';
const methodsToAdd = `playThud() {
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(160, now);
                osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);

                const peakGain = 0.18 * this.masterVolume;
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(peakGain, now + 0.008);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.1);
            } catch (e) {
                console.warn('playThud audio error:', e);
            }
        }

        playPop() {
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(950, now + 0.06);

                const peakGain = 0.15 * this.masterVolume;
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(peakGain, now + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.07);
            } catch (e) {
                console.warn('playPop audio error:', e);
            }
        }

        playDing() {`;

if (!content.includes('playThud()')) {
    content = content.replace(target, methodsToAdd);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected playThud and playPop into js/web-audio-micro-engine.js');
} else {
    console.log('playThud already exists in js/web-audio-micro-engine.js');
}
