/**
 * =========================================================================
 * 3-TIER AUDIO RESOLVER ENGINE (AUDIO SERVICE - RUNTIME)
 * =========================================================================
 * Tầng 1: Native Audio File từ nguồn Từ điển uy tín (Human Voice)
 *   - Free Dictionary API / Wiktionary: phonetics[].audio chứa -us.mp3 và -uk.mp3
 *   - Cambridge / Oxford Audio CDNs (/media/english/us_pron/ & /media/english/uk_pron/)
 * Tầng 2: Neural Edge TTS / Server TTS Service (Giọng AI chuẩn xác, không máy móc)
 *   - US: en-US (JennyNeural / Google US)
 *   - UK: en-GB (SoniaNeural / Google UK)
 *   - Khác biệt 100% về ngữ điệu, trọng âm và âm sắc Anh - Anh & Anh - Mỹ
 * Tầng 3: Browser Web Speech API Fallback (Cứu cánh offline/lỗi mạng)
 *   - Tải danh sách getVoices() và lọc chính xác theo accent US vs UK
 * =========================================================================
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.AudioService = factory();
        // Cầu nối toàn cục
        if (typeof window !== 'undefined') {
            window.AudioService = root.AudioService;
        }
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    class AudioServiceEngine {
        constructor() {
            this.audioElement = null;
            this.isPlaying = false;
            this.currentSpeed = 1.0;
            this.cachedVoices = [];
            this.audioUnlocked = false;
            this.audioSourceCache = new Map();
            this.activeUtterance = null;
            this.init();
        }

        init() {
            if (typeof window === 'undefined') return;

            if (!this.audioElement) {
                this.audioElement = new Audio();
                this.audioElement.preload = 'auto';
                this.audioElement.crossOrigin = 'anonymous';

                this.audioElement.onended = () => {
                    this.isPlaying = false;
                };

                this.audioElement.onerror = () => {
                    this.isPlaying = false;
                };
            }

            // Load and cache browser voices
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

            // Mobile AudioContext unlock
            if (!this.audioUnlocked && typeof document !== 'undefined') {
                const unlock = () => {
                    if (this.audioElement) {
                        this.audioElement.play().then(() => {
                            this.audioElement.pause();
                            this.audioElement.currentTime = 0;
                            this.audioUnlocked = true;
                        }).catch(() => {});
                    }
                    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
                        try { window.speechSynthesis.resume(); } catch (e) {}
                    }
                    document.removeEventListener('click', unlock);
                    document.removeEventListener('touchstart', unlock);
                };
                document.addEventListener('click', unlock, { once: true });
                document.addEventListener('touchstart', unlock, { once: true });
            }
        }

        stop() {
            this.isPlaying = false;
            if (this.audioElement) {
                try {
                    this.audioElement.pause();
                    this.audioElement.currentTime = 0;
                } catch (e) {}
            }
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try {
                    window.speechSynthesis.cancel();
                } catch (e) {}
            }
            this.activeUtterance = null;
        }

        setSpeed(speed) {
            this.currentSpeed = Math.max(0.5, Math.min(2.0, parseFloat(speed) || 1.0));
            if (this.audioElement) {
                this.audioElement.playbackRate = this.currentSpeed;
            }
        }

        getSpeed() {
            return this.currentSpeed;
        }

        registerAudioSources(word, sources) {
            if (!word) return;
            const key = word.trim().toLowerCase();
            const existing = this.audioSourceCache.get(key) || {};
            this.audioSourceCache.set(key, { ...existing, ...sources });
        }

        /**
         * Phát âm thanh với cơ chế 3 tầng ưu tiên
         * @param {string} word - Từ vựng, cụm từ hoặc câu cần đọc
         * @param {string} accent - 'US' hoặc 'UK' (hoặc 'en-US' / 'en-GB')
         * @param {object} options - Tùy chọn mở rộng
         */
        async playWord(word, accent = 'US', options = {}) {
            if (!word) return false;
            this.init();
            this.stop();

            const cleanText = decodeURIComponent(word).trim().replace(/[\r\n\t]+/g, ' ');
            const effectiveAccent = (accent === 'UK' || options.lang === 'en-GB') ? 'UK' : 'US';
            const effectiveLang = effectiveAccent === 'UK' ? 'en-GB' : 'en-US';
            const rate = options.rate || this.currentSpeed || 1.0;

            // =========================================================================
            // TẦNG 1: NATIVE AUDIO FILE TỪ NGUỒN TỪ ĐIỂN UY TÍN (HUMAN VOICE)
            // =========================================================================
            let nativeUrl = options.explicitAudioUrl;
            if (!nativeUrl) {
                const cached = this.audioSourceCache.get(cleanText.toLowerCase());
                if (cached) {
                    nativeUrl = effectiveAccent === 'UK' ? cached.uk : cached.us;
                }
            }

            // Kiểm tra trong từ điển đang mở (DictionaryEngine.currentEntry)
            if (!nativeUrl && typeof window !== 'undefined' && window.DictionaryEngine && window.DictionaryEngine.currentEntry) {
                const entry = window.DictionaryEngine.currentEntry;
                if ((entry.headword && entry.headword.toLowerCase() === cleanText.toLowerCase()) || 
                    (entry.word && entry.word.toLowerCase() === cleanText.toLowerCase())) {
                    if (effectiveAccent === 'UK' && entry.audio && entry.audio.uk) {
                        nativeUrl = entry.audio.uk;
                    } else if (effectiveAccent === 'US' && entry.audio && entry.audio.us) {
                        nativeUrl = entry.audio.us;
                    }
                }
            }

            if (nativeUrl && this.isValidAudioUrl(nativeUrl)) {
                const tier1Success = await this.playViaAudioElement(nativeUrl, rate, options);
                if (tier1Success) {
                    return true;
                }
            }

            // =========================================================================
            // TẦNG 2: NEURAL EDGE TTS / SERVER CLOUD TTS (GIỌNG AI CHUẨN XÁC)
            // =========================================================================
            // Đảm bảo gửi rõ accent và lang để server phân luồng giọng US vs UK 100% khác biệt
            const serverTtsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&accent=${effectiveAccent}&lang=${effectiveLang}&rate=${rate}`;
            const directFallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${effectiveLang}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

            const tier2Success = await this.playViaAudioElement(serverTtsUrl, rate, options, directFallbackUrl);
            if (tier2Success) {
                return true;
            }

            // =========================================================================
            // TẦNG 3: BROWSER WEB SPEECH API FALLBACK (OFFLINE / LỖI MẠNG)
            // =========================================================================
            return this.playViaWebSpeech(cleanText, effectiveAccent, rate, options);
        }

        speak(text, options = {}) {
            const accent = options.accent || (options.lang === 'en-GB' ? 'UK' : 'US');
            return this.playWord(text, accent, options);
        }

        playViaAudioElement(url, rate, options, fallbackUrl) {
            return new Promise((resolve) => {
                if (!this.audioElement) {
                    return resolve(false);
                }

                let resolved = false;
                const audio = this.audioElement;
                audio.playbackRate = rate;

                const cleanup = () => {
                    audio.onplaying = null;
                    audio.onended = null;
                    audio.onerror = null;
                };

                const timer = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        cleanup();
                        resolve(false);
                    }
                }, 4000);

                audio.onplaying = () => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timer);
                        this.isPlaying = true;
                        if (options.onstart) options.onstart();
                        resolve(true);
                    }
                };

                audio.onended = () => {
                    this.isPlaying = false;
                    cleanup();
                    if (options.onended) options.onended();
                };

                audio.onerror = () => {
                    if (fallbackUrl && audio.src !== fallbackUrl) {
                        audio.src = fallbackUrl;
                        audio.play().catch(() => {
                            if (!resolved) {
                                resolved = true;
                                clearTimeout(timer);
                                cleanup();
                                resolve(false);
                            }
                        });
                    } else {
                        if (!resolved) {
                            resolved = true;
                            clearTimeout(timer);
                            cleanup();
                            resolve(false);
                        }
                    }
                };

                try {
                    audio.src = url;
                    const p = audio.play();
                    if (p !== undefined) {
                        p.catch(() => {
                            if (fallbackUrl && audio.src !== fallbackUrl) {
                                audio.src = fallbackUrl;
                                audio.play().catch(() => {
                                    if (!resolved) {
                                        resolved = true;
                                        clearTimeout(timer);
                                        cleanup();
                                        resolve(false);
                                    }
                                });
                            } else {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(timer);
                                    cleanup();
                                    resolve(false);
                                }
                            }
                        });
                    }
                } catch (err) {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timer);
                        cleanup();
                        resolve(false);
                    }
                }
            });
        }

        playViaWebSpeech(text, accent, rate, options) {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
                return false;
            }

            try {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = rate;

                const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();

                // Lọc voice theo đúng đặc tả kỹ thuật của User
                if (accent === 'US') {
                    utterance.voice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('David'))) || voices.find(v => v.lang === 'en-US') || null;
                    utterance.lang = 'en-US';
                } else if (accent === 'UK') {
                    utterance.voice = voices.find(v => (v.lang === 'en-GB' || v.lang === 'en_UK') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('George') || v.name.includes('Hazel'))) || voices.find(v => v.lang.startsWith('en-GB')) || null;
                    utterance.lang = 'en-GB';
                }

                this.activeUtterance = utterance;
                window._activeAudioServiceUtterance = utterance;

                utterance.onstart = () => {
                    this.isPlaying = true;
                    if (options.onstart) options.onstart();
                };

                utterance.onend = () => {
                    this.isPlaying = false;
                    this.activeUtterance = null;
                    if (options.onended) options.onended();
                };

                utterance.onerror = (e) => {
                    this.isPlaying = false;
                    this.activeUtterance = null;
                    if (options.onerror) options.onerror(e);
                };

                setTimeout(() => {
                    try {
                        window.speechSynthesis.speak(utterance);
                    } catch (e) {
                        if (options.onerror) options.onerror(e);
                    }
                }, 30);

                return true;
            } catch (e) {
                if (options.onerror) options.onerror(e);
                return false;
            }
        }

        isValidAudioUrl(url) {
            return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/api/tts') || url.startsWith('blob:'));
        }
    }

    const instance = new AudioServiceEngine();
    return instance;
}));
