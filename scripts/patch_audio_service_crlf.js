const fs = require('fs');
const path = require('path');

function patchAudioService(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // 1. Kiểm tra getBestNaturalVoice
    const getBestNaturalVoiceMethod = `
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
    `;

    if (!code.includes('getBestNaturalVoice(voices')) {
        const target = 'playViaWebSpeech(text, accent, rate, options) {';
        code = code.replace(target, getBestNaturalVoiceMethod + '\n        ' + target);
        console.log(`[OK] Injected getBestNaturalVoice into ${filePath}`);
    }

    // 2. Nâng cấp playViaWebSpeech
    const oldVoiceFilterPattern = /\/\/\s*Lọc voice theo đúng đặc tả kỹ thuật của User[\s\S]*?utterance\.lang = 'en-GB';\s*\}/;
    const newVoiceFilter = `// Tự động chọn giọng đọc tự nhiên (Natural / Neural / Google Cloud) - Tuyệt đối loại bỏ robot David
                const isUK = accent === 'UK' || accent === 'en-GB';
                utterance.voice = this.getBestNaturalVoice(voices, isUK ? 'UK' : 'US');
                utterance.lang = isUK ? 'en-GB' : 'en-US';
                utterance.rate = rate || 0.92;
                utterance.pitch = 1.01;`;

    if (oldVoiceFilterPattern.test(code)) {
        code = code.replace(oldVoiceFilterPattern, newVoiceFilter);
        console.log(`[OK] Upgraded voice filter in playViaWebSpeech in ${filePath}`);
    }

    // 3. Khởi tạo UniversalAudioEngine và SpeechSynthesis Interceptor (Dùng Regex hỗ trợ CRLF)
    const endPattern = /const instance = new AudioServiceEngine\(\);\r?\n\s*return instance;/;
    const newEnd = `const instance = new AudioServiceEngine();

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
                        
                        // Nếu chưa có voice, hoặc voice đang là giọng robot (David / George / Desktop)
                        if (!utterance.voice || curVoiceName.includes('david') || curVoiceName.includes('george') || curVoiceName.includes('desktop')) {
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

    return instance;`;

    if (!code.includes('window.UniversalAudioEngine = {') && endPattern.test(code)) {
        code = code.replace(endPattern, newEnd);
        console.log(`[SUCCESS] Injected UniversalAudioEngine & Interceptor into ${filePath}`);
    }

    fs.writeFileSync(filePath, code, 'utf8');
}

patchAudioService(path.join(__dirname, '..', 'js', 'audio-service.js'));
patchAudioService(path.join(__dirname, '..', 'www', 'js', 'audio-service.js'));
console.log('AudioService patch finished.');
