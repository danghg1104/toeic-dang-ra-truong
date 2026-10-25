/**
 * =========================================================================
 * 3-TIER AUDIO RESOLVER ENGINE (AUDIO SERVICE)
 * =========================================================================
 * Tầng 1: Native Audio File từ nguồn Từ điển uy tín (Human Voice: FreeDict, Cambridge, Oxford)
 * Tầng 2: Neural Cloud / Server TTS Service (Giọng AI chuẩn xác: US vs UK 100% khác biệt)
 * Tầng 3: Browser Web Speech API Fallback (Cứu cánh offline / lỗi mạng với bộ lọc voice nghiêm ngặt)
 * =========================================================================
 */

export interface PlayOptions {
  accent?: 'US' | 'UK';
  lang?: 'en-US' | 'en-GB';
  rate?: number;
  explicitAudioUrl?: string;
  onstart?: () => void;
  onended?: () => void;
  onerror?: (err: any) => void;
}

export interface AudioSources {
  us?: string;
  uk?: string;
}

export class AudioServiceEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentSpeed: number = 1.0;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private audioUnlocked: boolean = false;
  private audioSourceCache: Map<string, AudioSources> = new Map();
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.init();
  }

  public init(): void {
    if (typeof window === 'undefined') return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.crossOrigin = 'anonymous';

      this.audioElement.onended = () => {
        this.isPlaying = false;
      };

      this.audioElement.onerror = (e) => {
        this.isPlaying = false;
      };
    }

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

    if (!this.audioUnlocked && typeof document !== 'undefined') {
      const unlock = () => {
        if (this.audioElement) {
          this.audioElement.play().then(() => {
            this.audioElement?.pause();
            if (this.audioElement) this.audioElement.currentTime = 0;
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

  public stop(): void {
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

  public setSpeed(speed: number): void {
    this.currentSpeed = Math.max(0.5, Math.min(2.0, speed || 1.0));
    if (this.audioElement) {
      this.audioElement.playbackRate = this.currentSpeed;
    }
  }

  public getSpeed(): number {
    return this.currentSpeed;
  }

  /**
   * Lưu hoặc trích xuất nguồn audio chất lượng cao cho một từ
   */
  public registerAudioSources(word: string, sources: AudioSources): void {
    if (!word) return;
    const key = word.trim().toLowerCase();
    const existing = this.audioSourceCache.get(key) || {};
    this.audioSourceCache.set(key, { ...existing, ...sources });
  }

  /**
   * Phát âm thanh với kiến trúc 3 tầng chuẩn mực
   */
  public async playWord(word: string, accent: 'US' | 'UK' = 'US', options: PlayOptions = {}): Promise<boolean> {
    if (!word || !word.trim()) return false;
    this.init();
    this.stop();

    const cleanText = word.trim();
    const effectiveAccent: 'US' | 'UK' = accent === 'UK' || options.lang === 'en-GB' ? 'UK' : 'US';
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

    if (nativeUrl && this.isValidAudioUrl(nativeUrl)) {
      const tier1Success = await this.playViaAudioElement(nativeUrl, rate, options);
      if (tier1Success) {
        return true;
      }
    }

    // =========================================================================
    // TẦNG 2: NEURAL EDGE TTS / SERVER CLOUD TTS (GIỌNG AI CHUẨN XÁC KHÁC BIỆT 100%)
    // =========================================================================
    const serverTtsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&accent=${effectiveAccent}&lang=${effectiveLang}&rate=${rate}`;
    const directFallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${effectiveLang}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const tier2Success = await this.playViaAudioElement(serverTtsUrl, rate, options, directFallbackUrl);
    if (tier2Success) {
      return true;
    }

    // =========================================================================
    // TẦNG 3: BROWSER WEB SPEECH API FALLBACK (OFFLINE / DỰ PHÒNG MẠNG)
    // =========================================================================
    return this.playViaWebSpeech(cleanText, effectiveAccent, rate, options);
  }

  /**
   * Phát thông qua HTML5 Audio Element
   */
  private playViaAudioElement(url: string, rate: number, options: PlayOptions, fallbackUrl?: string): Promise<boolean> {
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
      }, 4500);

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

  /**
   * Phát thông qua Web Speech API theo đúng đặc tả kỹ thuật của User
   */
  private playViaWebSpeech(text: string, accent: 'US' | 'UK', rate: number, options: PlayOptions): boolean {
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

      if (accent === 'US') {
        utterance.voice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) || voices.find(v => v.lang === 'en-US') || null;
        utterance.lang = 'en-US';
      } else if (accent === 'UK') {
        utterance.voice = voices.find(v => (v.lang === 'en-GB' || v.lang === 'en_UK') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Oliver'))) || voices.find(v => v.lang.startsWith('en-GB')) || null;
        utterance.lang = 'en-GB';
      }

      this.activeUtterance = utterance;
      (window as any)._activeAudioServiceUtterance = utterance;

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
      }, 25);

      return true;
    } catch (e) {
      if (options.onerror) options.onerror(e);
      return false;
    }
  }

  private isValidAudioUrl(url: string): boolean {
    return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/api/tts') || url.startsWith('blob:'));
  }
}

export const AudioService = new AudioServiceEngine();
if (typeof window !== 'undefined') {
  (window as any).AudioService = AudioService;
}
