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
            if (typeof window !== 'undefined' && window.AudioManager && typeof window.AudioManager.pauseLofi === 'function') {
                window.AudioManager.pauseLofi();
            }
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

        
        getBestNaturalVoice(voices, accent = 'US') {
            if (!voices || voices.length === 0) return null;
            const isUK = accent === 'UK' || accent === 'en-GB';

            const isRobotic = (name) => {
                const lower = (name || '').toLowerCase();
                return lower.includes('david') || lower.includes('george') || lower.includes('mark') || lower.includes('espeak') || lower.includes('desktop');
            };

            const targetVoices = voices.filter(v => {
                const lang = (v.lang || '').toLowerCase().replace('_', '-');
                return isUK ? (lang === 'en-gb' || lang.startsWith('en-gb')) : (lang === 'en-us' || lang.startsWith('en-us') || lang.startsWith('en'));
            });

            // 1. Ưu tiên cao nhất: Natural Neural Online voices (Edge / Windows 11 Natural)
            const neuralOnline = targetVoices.find(v => {
                const n = (v.name || '').toLowerCase();
                return (n.includes('natural') || n.includes('online') || n.includes('neural')) && !isRobotic(v.name);
            });
            if (neuralOnline) return neuralOnline;

            // 2. Ưu tiên thứ hai: Google Cloud Voices (Chrome / Cốc Cốc)
            const googleVoice = targetVoices.find(v => {
                const n = (v.name || '').toLowerCase();
                return n.includes('google') && !isRobotic(v.name);
            });
            if (googleVoice) return googleVoice;

            // 3. Ưu tiên thứ ba: Apple Enhanced / Premium / Siri voices (macOS / iOS)
            const appleEnhanced = targetVoices.find(v => {
                const n = (v.name || '').toLowerCase();
                return (n.includes('enhanced') || n.includes('premium') || n.includes('siri') || n.includes('samantha') || n.includes('karen') || n.includes('daniel')) && !isRobotic(v.name);
            });
            if (appleEnhanced) return appleEnhanced;

            // 4. Ưu tiên thứ tư: Giọng nữ êm ái Zira / Hazel / Jenny (Không bao giờ chọn David robot)
            const smoothFemale = targetVoices.find(v => {
                const n = (v.name || '').toLowerCase();
                return (n.includes('zira') || n.includes('hazel') || n.includes('jenny') || n.includes('aria') || n.includes('sonia')) && !isRobotic(v.name);
            });
            if (smoothFemale) return smoothFemale;

            // 5. Bất kỳ giọng nào không phải robot
            const nonRobotic = targetVoices.find(v => !isRobotic(v.name));
            if (nonRobotic) return nonRobotic;

            return targetVoices[0] || voices[0] || null;
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

                // Tự động chọn giọng đọc tự nhiên (Natural / Neural / Google Cloud) - Tuyệt đối loại bỏ robot David
                const isUK = accent === 'UK' || accent === 'en-GB';
                utterance.voice = this.getBestNaturalVoice(voices, isUK ? 'UK' : 'US');
                utterance.lang = isUK ? 'en-GB' : 'en-US';
                utterance.rate = rate || 0.92;
                utterance.pitch = 1.01;

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

    // =========================================================================
    // UNIVERSAL AUDIO ENGINE & NATURAL SPEECH INTERCEPTOR (GLOBAL BRIDGE)
    // =========================================================================
    if (typeof window !== 'undefined') {
        window.UniversalAudioEngine = {
            currentSpeed: 0.95,
            setSpeed(speed) {
                this.currentSpeed = speed;
                instance.setSpeed(speed);
            },
            speak(text, options = {}) {
                const accent = options.accent || (options.lang === 'en-GB' ? 'UK' : 'US');
                const rate = options.rate || this.currentSpeed || 0.92;
                return instance.playWord(text, accent, { ...options, rate });
            }
        };

        // Centralized Audio Manager (Chống đè nhạc Lofi & Dọn dẹp Ghost Audio khi chuyển Tab)
        window.AudioManager = {
            currentAudio: null,
            lofiPlayer: null,
            lofiWasPausedByAudio: false,

            pauseLofi() {
                try {
                    if (this.lofiPlayer && typeof this.lofiPlayer.pause === 'function' && !this.lofiPlayer.paused) {
                        this.lofiPlayer.pause();
                        this.lofiWasPausedByAudio = true;
                    }
                    if (window.WebAudioMicroEngine) {
                        if (window.WebAudioMicroEngine.pomodoroIsRunning && typeof window.WebAudioMicroEngine.pausePomodoro === 'function') {
                            window.WebAudioMicroEngine.pausePomodoro();
                            this.lofiWasPausedByAudio = true;
                        }
                        if (window.WebAudioMicroEngine.pomodoroAmbientNodes && typeof window.WebAudioMicroEngine._stopAmbientAudio === 'function') {
                            window.WebAudioMicroEngine._stopAmbientAudio();
                            this.lofiWasPausedByAudio = true;
                        }
                    }
                    if (window._miniLofiActive) {
                        window._miniLofiActive = false;
                        if (typeof document !== 'undefined') {
                            document.querySelectorAll('.artisan-vinyl-disc').forEach(el => el.classList.remove('is-playing'));
                            document.querySelectorAll('.artisan-tonearm').forEach(el => el.classList.remove('is-active'));
                        }
                    }
                    if (window.StudyFocusEngine && window.StudyFocusEngine.isSoundPlaying) {
                        if (typeof window.StudyFocusEngine.stopAmbientSound === 'function') {
                            window.StudyFocusEngine.stopAmbientSound();
                            this.lofiWasPausedByAudio = true;
                        }
                    }
                } catch (e) {}
            },

            playExamAudio(src, onEnded) {
                this.pauseLofi();
                this.stopAll();
                try {
                    const audio = new Audio(src);
                    this.currentAudio = audio;
                    if (typeof onEnded === 'function') {
                        audio.onended = onEnded;
                    }
                    audio.play().catch(() => {});
                    return audio;
                } catch (e) {
                    return null;
                }
            },

            speakText(text, lang = 'en-US', rate = 0.95, onEnded) {
                this.pauseLofi();
                this.stopAll();
                if (!('speechSynthesis' in window)) return null;

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.rate = rate;
                if (typeof onEnded === 'function') {
                    utterance.onend = onEnded;
                }
                window.speechSynthesis.speak(utterance);
                return utterance;
            },

            // Đa giọng đọc Part 3 & 4: Tách lượt đối thoại Man / Woman, loại bỏ phát âm nhãn "Man colon" và tránh giới hạn 15s Chrome
            _dialogueToken: 0,

            speakDialogue(transcript, options = {}, onComplete) {
                this.pauseLofi();
                this.stopAll();
                const token = ++this._dialogueToken;
                if (!('speechSynthesis' in window) || !transcript) {
                    if (typeof onComplete === 'function') onComplete();
                    return;
                }

                // Tách từng lượt thoại theo Man: / Woman: / M: / W: / Speaker:
                const lines = transcript.split(/\n+/).map(l => l.trim()).filter(Boolean);
                const rawTurns = [];

                lines.forEach((line, idx) => {
                    const match = line.match(/^(Man|Woman|Female|Male|M|W|Speaker\s*\d*|Person\s*[A-B]):\s*(.+)$/i);
                    if (match) {
                        rawTurns.push({ speaker: match[1].toLowerCase(), text: match[2].trim(), lineIdx: idx });
                    } else if (rawTurns.length > 0) {
                        rawTurns[rawTurns.length - 1].text += ' ' + line;
                    } else {
                        rawTurns.push({ speaker: 'neutral', text: line, lineIdx: idx });
                    }
                });

                if (rawTurns.length === 0) {
                    rawTurns.push({ speaker: 'neutral', text: transcript, lineIdx: 0 });
                }

                // Tách câu dài > 140 ký tự để tránh Chrome ngắt âm thanh sau 15 giây
                const turns = [];
                rawTurns.forEach(t => {
                    if (t.text.length <= 140) {
                        turns.push(t);
                    } else {
                        const sentences = t.text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [t.text];
                        let buf = '';
                        sentences.forEach(s => {
                            if ((buf + ' ' + s).trim().length > 140 && buf.trim()) {
                                turns.push({ speaker: t.speaker, text: buf.trim(), lineIdx: t.lineIdx });
                                buf = s;
                            } else {
                                buf = (buf ? buf + ' ' : '') + s.trim();
                            }
                        });
                        if (buf.trim()) turns.push({ speaker: t.speaker, text: buf.trim(), lineIdx: t.lineIdx });
                    }
                });

                let currentTurn = 0;
                const voices = window.speechSynthesis.getVoices();
                const playNextTurn = () => {
                    if (token !== this._dialogueToken) return;
                    if (currentTurn >= turns.length) {
                        if (typeof onComplete === 'function') onComplete();
                        return;
                    }

                    const turnIdx = currentTurn++;
                    const turn = turns[turnIdx];
                    const u = new SpeechSynthesisUtterance(turn.text);
                    u.lang = options.lang || 'en-US';
                    u.rate = options.rate || 0.95;

                    // Phân biệt âm sắc / pitch giữa giọng Nam & Nữ để rèn phản xạ phân vai
                    if (/^(woman|female|w|speaker\s*2|person\s*b)$/i.test(turn.speaker)) {
                        u.pitch = 1.22;
                        u._preserveVoice = true;
                        const femaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Female') || v.name.includes('Google UK English Female')));
                        if (femaleVoice) u.voice = femaleVoice;
                    } else if (/^(man|male|m|speaker\s*1|person\s*a)$/i.test(turn.speaker)) {
                        u.pitch = 0.88;
                        u._preserveVoice = true;
                        const maleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Male') || v.name.includes('Google US English')));
                        if (maleVoice) u.voice = maleVoice;
                    }

                    u.onstart = () => {
                        if (token !== this._dialogueToken) return;
                        if (typeof options.onTurnStart === 'function') options.onTurnStart(turn.lineIdx, turn);
                    };
                    u.onboundary = (e) => {
                        if (token !== this._dialogueToken) return;
                        if (typeof options.onBoundary === 'function') options.onBoundary(e, turn.lineIdx, turn);
                    };
                    u.onend = () => {
                        if (token !== this._dialogueToken) return;
                        if (typeof options.onTurnEnd === 'function') options.onTurnEnd(turn.lineIdx, turn);
                        setTimeout(playNextTurn, 350);
                    };
                    u.onerror = () => {
                        if (token !== this._dialogueToken) return;
                        setTimeout(playNextTurn, 200);
                    };

                    window.speechSynthesis.speak(u);
                };

                playNextTurn();
            },

            // Dọn dẹp sạch sẽ toàn bộ audio ngầm (Ghost Audio) khi đổi Tab hoặc thoát bài thi
            stopAll() {
                this._dialogueToken = (this._dialogueToken || 0) + 1;
                if (this.currentAudio) {
                    try {
                        this.currentAudio.pause();
                        this.currentAudio.currentTime = 0;
                    } catch (e) {}
                    this.currentAudio = null;
                }
                if (window._adpAudioEl) {
                    try {
                        window._adpAudioEl.pause();
                        window._adpAudioEl.currentTime = 0;
                    } catch (e) {}
                }
                if (window.ToeicListeningWorkstation) {
                    try {
                        if (typeof window.ToeicListeningWorkstation.pause === 'function') window.ToeicListeningWorkstation.pause();
                        if (window.ToeicListeningWorkstation.audioPlayer) window.ToeicListeningWorkstation.audioPlayer.pause();
                    } catch (e) {}
                }
                if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.stopAudio === 'function') {
                    try { window.ToeicDiagnosticWorkstation.stopAudio(); } catch (e) {}
                }
                if (window.DailyDictationWorkstation) {
                    if (window.DailyDictationWorkstation.audioEl) {
                        try { window.DailyDictationWorkstation.audioEl.pause(); } catch (e) {}
                    }
                    if (window.DailyDictationWorkstation.audio) {
                        try { window.DailyDictationWorkstation.audio.pause(); } catch (e) {}
                    }
                }
                if (window._quizToeicPlayer && typeof window._quizToeicPlayer.pause === 'function') {
                    try { window._quizToeicPlayer.pause(); } catch (e) {}
                }
                if ('speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch (e) {}
                }
            }
        };

        // Hook window.speechSynthesis.speak để đảm bảo mọi đoạn văn hay từ vựng
        // phát bằng SpeechSynthesis đều tự động chọn Natural Voice và loại bỏ robot
        if ('speechSynthesis' in window) {
            const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
            window.speechSynthesis.speak = function(utterance) {
                try {
                    if (utterance && utterance instanceof SpeechSynthesisUtterance) {
                        const voices = window.speechSynthesis.getVoices();
                        const isUK = utterance.lang && (utterance.lang === 'en-GB' || utterance.lang.startsWith('en-GB'));
                        const curVoiceName = utterance.voice ? utterance.voice.name.toLowerCase() : '';
                        
                        // Nếu chưa có voice, hoặc voice đang là giọng robot (nhưng giữ nguyên nếu hội thoại đã phân vai)
                        if (!utterance._preserveVoice && (!utterance.voice || curVoiceName.includes('david') || curVoiceName.includes('george') || curVoiceName.includes('desktop'))) {
                            const bestVoice = instance.getBestNaturalVoice(voices, isUK ? 'UK' : 'US');
                            if (bestVoice) {
                                utterance.voice = bestVoice;
                            }
                        }

                        // Điều chỉnh tốc độ và âm vực tự nhiên chuẩn Oxford / Cambridge
                        if (!utterance.rate || utterance.rate === 1.0) {
                            utterance.rate = 0.92;
                        }
                        if (!utterance.pitch || utterance.pitch === 1.0) {
                            utterance.pitch = 1.01;
                        }
                    }
                } catch(e) {}
                return originalSpeak(utterance);
            };
        }
    }

    return instance;
}));
