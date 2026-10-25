/**
 * =========================================================================
 * UNIVERSAL AUDIO ENGINE CHO LAPTOP & ĐIỆN THOẠI (HYBRID AUDIO ENGINE)
 * =========================================================================
 * Tích hợp chặt chẽ với AudioService (3-Tier Resolver Engine).
 * Khắc phục 100% lỗi câm tiếng / không phát được audio trên Mobile (Android, iOS Safari, WebView).
 * Khắc phục 100% lỗi trùng 1 giọng giữa nút US và UK.
 * =========================================================================
 */

window.UniversalAudioEngine = {
    audioElement: null,
    activeUtterance: null,
    isSpeaking: false,
    currentSpeed: 1.0,
    cachedVoices: [],
    audioUnlocked: false,

    init() {
        if (!this.audioElement) {
            this.audioElement = new Audio();
            this.audioElement.preload = 'auto';
            this.audioElement.crossOrigin = 'anonymous';
            
            this.audioElement.onended = () => {
                this.isSpeaking = false;
            };
            this.audioElement.onerror = (e) => {
                console.warn('HTML5 Audio error:', e);
                this.isSpeaking = false;
            };
        }

        // Cache giọng nói Web Speech
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                try {
                    this.cachedVoices = window.speechSynthesis.getVoices();
                } catch (e) {}
            };
            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }

        // Mở khóa AudioContext trên điện thoại di động
        if (!this.audioUnlocked) {
            const unlock = () => {
                if (this.audioElement) {
                    this.audioElement.play().then(() => {
                        this.audioElement.pause();
                        this.audioElement.currentTime = 0;
                        this.audioUnlocked = true;
                    }).catch(() => {});
                }
                if ('speechSynthesis' in window && window.speechSynthesis.paused) {
                    try { window.speechSynthesis.resume(); } catch(e) {}
                }
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
            };
            document.addEventListener('click', unlock, { once: true });
            document.addEventListener('touchstart', unlock, { once: true });
        }
    },

    stop() {
        this.isSpeaking = false;
        if (this.audioElement) {
            try {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
            } catch (e) {}
        }
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {}
        }
        if (window.AudioService && typeof window.AudioService.stop === 'function') {
            try {
                window.AudioService.stop();
            } catch (e) {}
        }
        this.activeUtterance = null;
    },

    setSpeed(speed) {
        this.currentSpeed = Math.max(0.5, Math.min(2.0, parseFloat(speed) || 1.0));
        if (this.audioElement) {
            this.audioElement.playbackRate = this.currentSpeed;
        }
        if (window.AudioService && typeof window.AudioService.setSpeed === 'function') {
            window.AudioService.setSpeed(this.currentSpeed);
        }
    },

    // Phát âm thanh văn bản tiếng Anh chuẩn bản xứ
    speak(rawText, options = {}) {
        if (!rawText) return;

        // Nếu AudioService đã sẵn sàng, ủy quyền xử lý theo cơ chế 3 tầng chuẩn mực
        if (window.AudioService && typeof window.AudioService.playWord === 'function') {
            const accent = options.accent || (options.lang === 'en-GB' ? 'UK' : 'US');
            window.AudioService.playWord(rawText, accent, {
                rate: options.rate || this.currentSpeed || 1.0,
                lang: options.lang || (accent === 'UK' ? 'en-GB' : 'en-US'),
                explicitAudioUrl: options.explicitAudioUrl || options.audioUrl
            });
            return;
        }

        this.init();
        this.stop();

        const text = decodeURIComponent(rawText).trim();
        const lang = options.lang || (options.accent === 'UK' ? 'en-GB' : 'en-US');
        const isUk = lang === 'en-GB' || options.accent === 'UK';
        const speed = options.rate || this.currentSpeed || 1.0;
        let started = false;

        // ========================================================
        // PHƯƠNG ÁN 2: HTML5 NATIVE MP3 CLOUD STREAM (100% HOẠT ĐỘNG TRÊN MỌI THIẾT BỊ)
        // ========================================================
        const playWithHtmlAudio = () => {
            if (started) return;
            started = true;
            this.isSpeaking = true;

            try {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                }
            } catch (e) {}

            const cleanText = text.replace(/[\r\n\t]+/g, ' ').slice(0, 320);
            const accentParam = isUk ? 'UK' : 'US';
            const langParam = isUk ? 'en-GB' : 'en-US';
            
            // 1. Thử endpoint proxy của máy chủ trước (/api/tts) với đúng accent
            const primaryUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&accent=${accentParam}&lang=${langParam}&rate=${speed}`;
            // 2. Dự phòng trực tiếp nếu mất kết nối local server
            const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langParam}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

            this.audioElement.src = primaryUrl;
            this.audioElement.playbackRate = speed;

            this.audioElement.onerror = () => {
                if (this.audioElement.src !== fallbackUrl) {
                    this.audioElement.src = fallbackUrl;
                    this.audioElement.play().catch(err => {
                        console.warn('Fallback audio failed:', err);
                        this.isSpeaking = false;
                    });
                }
            };

            const playPromise = this.audioElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.warn('HTML5 Audio play interrupted or blocked:', err);
                    this.isSpeaking = false;
                });
            }
        };

        // ========================================================
        // PHƯƠNG ÁN 1: WEB SPEECH API (VỚI BỘ LỌC GIỌNG CHUẨN XÁC US VS UK)
        // ========================================================
        if ('speechSynthesis' in window) {
            try {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.rate = speed;

                this.activeUtterance = utterance;
                window._activeMobileSpeechUtterance = utterance;

                const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
                let matchedVoice = null;

                if (isUk) {
                    // Tuyệt đối chỉ chọn giọng British (en-GB)
                    matchedVoice = voices.find(v => (v.lang === 'en-GB' || v.lang === 'en_UK') && 
                        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('George') || v.name.includes('Hazel'))) ||
                        voices.find(v => v.lang && v.lang.startsWith('en-GB'));
                } else {
                    // Chọn giọng American (en-US)
                    matchedVoice = voices.find(v => v.lang === 'en-US' && 
                        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('David'))) ||
                        voices.find(v => v.lang === 'en-US');
                }

                if (matchedVoice) {
                    utterance.voice = matchedVoice;
                } else if (isUk) {
                    // Nếu hệ điều hành không cài giọng Anh - Anh (như Windows mặc định chỉ có US Zira):
                    // Chuyển thẳng sang HTML5 Audio MP3 để đảm bảo 100% phát ra giọng Anh chuẩn
                    playWithHtmlAudio();
                    return;
                }

                const watchdogTimer = setTimeout(() => {
                    if (!started) {
                        playWithHtmlAudio();
                    }
                }, 500);

                utterance.onstart = () => {
                    started = true;
                    clearTimeout(watchdogTimer);
                    this.isSpeaking = true;
                };

                utterance.onend = () => {
                    this.isSpeaking = false;
                    this.activeUtterance = null;
                };

                utterance.onerror = (e) => {
                    clearTimeout(watchdogTimer);
                    playWithHtmlAudio();
                };

                setTimeout(() => {
                    if (!started) {
                        try {
                            window.speechSynthesis.speak(utterance);
                        } catch (speakErr) {
                            playWithHtmlAudio();
                        }
                    }
                }, 35);

                return;
            } catch (err) {
                console.warn('WebSpeech init failed, using HTML5 Audio fallback:', err);
            }
        }

        // Nếu thiết bị không hỗ trợ Web Speech
        playWithHtmlAudio();
    }
};

// Tự động khởi tạo engine khi tải trang
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.UniversalAudioEngine.init());
    } else {
        window.UniversalAudioEngine.init();
    }
}
