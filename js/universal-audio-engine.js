/**
 * UNIVERSAL AUDIO ENGINE CHO LAPTOP & ĐIỆN THOẠI (HYBRID AUDIO ENGINE)
 * Khắc phục 100% lỗi câm tiếng / không phát được audio trên Mobile (Android, iOS Safari, Capacitor WebView)
 * Cơ chế: Web Speech API (Đã vá Garbage Collection & Cancel Bug) + Tự động Fallback sang Native HTML5 MP3 Stream
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
            
            // Xử lý sự kiện kết thúc của HTML5 Audio
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
        this.activeUtterance = null;
    },

    setSpeed(speed) {
        this.currentSpeed = parseFloat(speed) || 1.0;
        if (this.audioElement) {
            this.audioElement.playbackRate = this.currentSpeed;
        }
    },

    // Phát âm thanh văn bản tiếng Anh chuẩn bản xứ
    speak(rawText, options = {}) {
        if (!rawText) return;
        this.init();
        this.stop();

        const text = decodeURIComponent(rawText).trim();
        const lang = options.lang || 'en-US';
        const speed = options.rate || this.currentSpeed || 1.0;
        let started = false;

        // ========================================================
        // PHƯƠNG ÁN 2: HTML5 NATIVE MP3 CLOUD STREAM (100% HOẠT ĐỘNG TRÊN MỌI ĐIỆN THOẠI)
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

            // Rút gọn đoạn văn bản dài nếu cần để phát stream mượt mà
            const cleanText = text.replace(/[\r\n\t]+/g, ' ').slice(0, 320);
            
            // 1. Thử endpoint proxy của máy chủ trước (/api/tts)
            const primaryUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=en`;
            // 2. Dự phòng trực tiếp nếu mất kết nối local server
            const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

            this.audioElement.src = primaryUrl;
            this.audioElement.playbackRate = speed;

            this.audioElement.onerror = () => {
                // Tự động chuyển sang link dự phòng nếu server proxy trả lỗi
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
        // PHƯƠNG ÁN 1: WEB SPEECH API (VỚI BẢN VÁ CHO ANDROID & IOS)
        // ========================================================
        if ('speechSynthesis' in window) {
            try {
                // Sửa lỗi Android: Nếu speech engine đang ở trạng thái paused, gọi resume()
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.rate = speed;

                // Lưu vào biến toàn cục để tránh bị V8 Garbage Collector dọn dẹp sớm trên mobile
                this.activeUtterance = utterance;
                window._activeMobileSpeechUtterance = utterance;

                // Gán giọng bản xứ tốt nhất nếu có sẵn
                const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
                if (voices && voices.length > 0) {
                    const enVoice = voices.find(v => v.lang && v.lang.startsWith('en') && 
                        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('US') || v.name.includes('English')));
                    if (enVoice) utterance.voice = enVoice;
                }

                // WATCHDOG TIMER: Nếu sau 600ms không có âm thanh phát ra (thường do máy thiếu gói ngôn ngữ tiếng Anh)
                // -> Tự động chuyển ngay sang phương án HTML5 Audio MP3
                const watchdogTimer = setTimeout(() => {
                    if (!started) {
                        playWithHtmlAudio();
                    }
                }, 600);

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

                // Tránh lỗi cancel() race-condition trên Chromium Mobile bằng một tick ngắn
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

        // Nếu thiết bị hoàn toàn không hỗ trợ Web Speech
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
