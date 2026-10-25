const fs = require('fs');
let c = fs.readFileSync('js/toeic-diagnostic-workstation.js', 'utf8');

const q1ToQ4 = `                {
                    id: 'diag_p1_q01',
                    part: 1,
                    partName: 'Part 1: Photographs (Mô tả tranh)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Jenny (US)',
                    image: 'assets/listening/part1/p1_sample_01_person.webp',
                    audio: '/audio/listening/part1/p1_q01.mp3',
                    audioScript: 'Number 1. Look at the picture marked number 1 in your test book. (A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.',
                    transcript: '(A) She is hanging a picture frame on the wall.\\n(B) A woman is examining a blueprint on a table.\\n(C) She is rolling up a sheet of paper.\\n(D) She is speaking into a telephone receiver.',
                    transcriptVi: '(A) Cô ấy đang treo khung tranh lên tường.\\n(B) Một người phụ nữ đang xem xét bản vẽ thiết kế trên bàn.\\n(C) Cô ấy đang cuộn một tờ giấy lại.\\n(D) Cô ấy đang nói chuyện qua ống nghe điện thoại.',
                    question: 'Look at the picture and choose the statement that best describes what you see:',
                    options: [
                        { key: 'A', text: '(A) She is hanging a picture frame on the wall.' },
                        { key: 'B', text: '(B) A woman is examining a blueprint on a table.' },
                        { key: 'C', text: '(C) She is rolling up a sheet of paper.' },
                        { key: 'D', text: '(D) She is speaking into a telephone receiver.' }
                    ],
                    correct: 'B',
                    explanation: 'Bẫy hành động sai trong tranh tả người: Người phụ nữ đang đứng cúi người đặt hai tay lên mặt bàn và chăm chú nhìn bản vẽ kiến trúc trải phẳng (examining a blueprint on a table). (A) sai vì không treo tranh. (C) sai vì giấy mở phẳng chứ không cuộn. (D) sai vì không dùng điện thoại.',
                    vocab: [
                        { word: 'examine', ipa: '/ɪɡˈzæm.ɪn/', meaning: 'xem xét kỹ lưỡng' },
                        { word: 'blueprint', ipa: '/ˈbluː.prɪnt/', meaning: 'bản vẽ thiết kế kỹ thuật' }
                    ]
                },
                {
                    id: 'diag_p1_q02',
                    part: 1,
                    partName: 'Part 1: Photographs (Mô tả tranh)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Guy (US)',
                    image: 'assets/listening/part1/p1_sample_05_doctor.webp',
                    audio: '/audio/listening/part1/p1_q02.mp3',
                    audioScript: 'Number 2. Look at the picture marked number 2 in your test book. (A) A physician is reviewing an X-ray on a wall display. (B) He is prescribing medication to a patient. (C) A stethoscope is lying on the examination table. (D) The lights in the laboratory have been switched off.',
                    transcript: '(A) A physician is reviewing an X-ray on a wall display.\\n(B) He is prescribing medication to a patient.\\n(C) A stethoscope is lying on the examination table.\\n(D) The lights in the laboratory have been switched off.',
                    transcriptVi: '(A) Bác sĩ đang xem xét phim chụp X-quang trên màn hình treo tường.\\n(B) Ông ấy đang kê đơn thuốc cho bệnh nhân.\\n(C) Ống nghe đang nằm trên bàn khám.\\n(D) Đèn trong phòng thí nghiệm đã bị tắt.',
                    question: 'Look at the picture and choose the statement that best describes what you see:',
                    options: [
                        { key: 'A', text: '(A) A physician is reviewing an X-ray on a wall display.' },
                        { key: 'B', text: '(B) He is prescribing medication to a patient.' },
                        { key: 'C', text: '(C) A stethoscope is lying on the examination table.' },
                        { key: 'D', text: '(D) The lights in the laboratory have been switched off.' }
                    ],
                    correct: 'A',
                    explanation: 'Bác sĩ nam đeo ống nghe trên cổ, đang đứng nhìn chăm chú tấm phim X-quang phổi gắn trên màn hình sáng treo tường ("reviewing an X-ray on a wall display"). (B) sai vì không có bệnh nhân trong phòng. (C) sai vì ống nghe đang quàng quanh cổ bác sĩ. (D) sai vì đèn trong phòng và màn hình X-quang đang bật sáng.',
                    vocab: [
                        { word: 'physician', ipa: '/fɪˈzɪʃ.ən/', meaning: 'bác sĩ điều trị' },
                        { word: 'wall display', ipa: '/wɔːl dɪˈspleɪ/', meaning: 'màn hình hiển thị treo tường' }
                    ]
                },
                {
                    id: 'diag_p1_q03',
                    part: 1,
                    partName: 'Part 1: Photographs (Mô tả tranh)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Jenny (US)',
                    image: 'assets/listening/part1/p1_sample_06_librarian.webp',
                    audio: '/audio/listening/part1/p1_q03.mp3',
                    audioScript: 'Number 3. Look at the picture marked number 3 in your test book. (A) A woman is checking out a library book. (B) She is stacking books onto a tall shelf. (C) Patrons are reading newspapers at a study carrel. (D) She is adjusting the lens of a photocopier.',
                    transcript: '(A) A woman is checking out a library book.\\n(B) She is stacking books onto a tall shelf.\\n(C) Patrons are reading newspapers at a study carrel.\\n(D) She is adjusting the lens of a photocopier.',
                    transcriptVi: '(A) Người phụ nữ đang làm thủ tục mượn sách thư viện.\\n(B) Cô ấy đang xếp các cuốn sách lên giá sách cao.\\n(C) Độc giả đang đọc báo tại bàn tự học.\\n(D) Cô ấy đang điều chỉnh ống kính của máy photocopy.',
                    question: 'Look at the picture and choose the statement that best describes what you see:',
                    options: [
                        { key: 'A', text: '(A) A woman is checking out a library book.' },
                        { key: 'B', text: '(B) She is stacking books onto a tall shelf.' },
                        { key: 'C', text: '(C) Patrons are reading newspapers at a study carrel.' },
                        { key: 'D', text: '(D) She is adjusting the lens of a photocopier.' }
                    ],
                    correct: 'B',
                    explanation: 'Người phụ nữ trong thư viện đứng giữa hai kệ sách lớn, tay giơ cao đặt một cuốn sách bìa xanh lên giá sách trên cao ("stacking books onto a tall shelf"). (A) sai vì không ở quầy mượn sách. (C) sai vì không có độc giả nào khác đọc báo. (D) sai vì không có máy photocopy trong ảnh.',
                    vocab: [
                        { word: 'stack', ipa: '/stæk/', meaning: 'xếp chồng, đặt lên giá' },
                        { word: 'tall shelf', ipa: '/tɔːl ʃelf/', meaning: 'giá sách cao' }
                    ]
                },
                {
                    id: 'diag_p1_q04',
                    part: 1,
                    partName: 'Part 1: Photographs (Mô tả tranh)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Jenny (US)',
                    image: 'assets/listening/part1/p1_sample_07_barista.webp',
                    audio: '/audio/listening/part1/p1_q04.mp3',
                    audioScript: 'Number 4. Look at the picture marked number 4 in your test book. (A) A server is wiping down a wooden counter. (B) He is pouring coffee into a customer\\'s mug. (C) Chairs are stacked on top of the dining tables. (D) A menu board is being replaced on the wall.',
                    transcript: '(A) A server is wiping down a wooden counter.\\n(B) He is pouring coffee into a customer\\'s mug.\\n(C) Chairs are stacked on top of the dining tables.\\n(D) A menu board is being replaced on the wall.',
                    transcriptVi: '(A) Nhân viên phục vụ đang lau sạch bề mặt quầy gỗ.\\n(B) Anh ấy đang rót cà phê vào cốc của khách hàng.\\n(C) Ghế được xếp chồng lên trên bàn ăn.\\n(D) Bảng thực đơn đang được thay thế trên tường.',
                    question: 'Look at the picture and choose the statement that best describes what you see:',
                    options: [
                        { key: 'A', text: '(A) A server is wiping down a wooden counter.' },
                        { key: 'B', text: '(B) He is pouring coffee into a customer\\'s mug.' },
                        { key: 'C', text: '(C) Chairs are stacked on top of the dining tables.' },
                        { key: 'D', text: '(D) A menu board is being replaced on the wall.' }
                    ],
                    correct: 'A',
                    explanation: 'Nhân viên quầy cà phê (phía sau bên trái) đang cúi người dùng khăn lau sạch bề mặt quầy pha chế bằng gỗ ("wiping down a wooden counter"). Người nam phía trước đang thao tác máy POS. (B) sai vì không rót cà phê. (C) sai vì bàn ghế không xếp chồng. (D) sai vì không thay bảng thực đơn.',
                    vocab: [
                        { word: 'wipe down', ipa: '/waɪp daʊn/', meaning: 'lau sạch bề mặt' },
                        { word: 'wooden counter', ipa: '/ˈwʊd.ən ˈkaʊn.tər/', meaning: 'quầy gỗ' }
                    ]
                }`;

const p1Start = c.indexOf("id: 'diag_p1_q01'");
const p2Start = c.indexOf("id: 'diag_p2_q05'");

if (p1Start !== -1 && p2Start !== -1) {
    const beforeP1 = c.slice(0, c.lastIndexOf('{', p1Start));
    const afterP1 = c.slice(c.lastIndexOf('{', p2Start));
    c = beforeP1 + q1ToQ4.trim() + ',\n\n                ' + afterP1;
    console.log('Successfully replaced Q1-Q4 definition!');
} else {
    console.error('Markers not found: p1Start=', p1Start, 'p2Start=', p2Start);
    process.exit(1);
}

// 2. Update renderLeftColumnContent to always render real photo without SVG placeholder
c = c.replace(
    /\${q\.imageSvgPlaceholder\s*\|\|\s*`[\s\S]*?`\s*}/,
    `<img src="\${q.image}" alt="TOEIC Part 1 Photo" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.onerror=null; this.src='assets/listening/part1/p1_sample_01_person.webp';"/>
                            <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow pointer-events-none">
                                <i class="fa-solid fa-camera text-blue-400"></i>
                                <span>Ảnh Đề Thi Chuẩn ETS</span>
                            </div>`
);

// 3. Update playAudio to support direct MP3 playback and Edge TTS streaming
const oldPlayAudioStart = c.indexOf('playAudio(scriptText) {');
const oldToggleAudioStart = c.indexOf('toggleAudio() {');

if (oldPlayAudioStart !== -1 && oldToggleAudioStart !== -1) {
    const newAudioMethods = `playAudio(scriptText) {
            this.stopAudio();
            const q = this.questions[this.currentIndex];
            const textToSpeak = scriptText || q.audioScript;

            if (q.audio) {
                // Ưu tiên phát file Audio MP3 chuẩn giọng bản xứ ETS
                this.audioElement = new Audio(q.audio);
                this.audioElement.playbackRate = this.audioSpeed;
                this.audioElement.volume = this.audioVolume;
                this.audioElement.onended = () => {
                    this.isPlayingAudio = false;
                    if (this.isLooping && this.isOpen) {
                        setTimeout(() => this.playAudio(), 600);
                    } else {
                        this.updateAudioControlsUI();
                    }
                };
                this.audioElement.onerror = () => {
                    this.playWithTts(textToSpeak, q.accent);
                };
                this.audioElement.play().catch(() => {
                    this.playWithTts(textToSpeak, q.accent);
                });
                this.isPlayingAudio = true;
                this.updateAudioControlsUI();
            } else if (textToSpeak) {
                this.playWithTts(textToSpeak, q.accent);
            }
        }

        playWithTts(text, accent) {
            const lang = accent || 'en-US';
            const ttsUrl = \`/api/tts?text=\${encodeURIComponent(text)}&lang=\${lang}\`;
            this.audioElement = new Audio(ttsUrl);
            this.audioElement.playbackRate = this.audioSpeed;
            this.audioElement.volume = this.audioVolume;
            this.audioElement.onended = () => {
                this.isPlayingAudio = false;
                if (this.isLooping && this.isOpen) {
                    setTimeout(() => this.playAudio(), 600);
                } else {
                    this.updateAudioControlsUI();
                }
            };
            this.audioElement.onerror = () => {
                if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.speak === 'function') {
                    window.UniversalAudioEngine.speak(text, { rate: this.audioSpeed, volume: this.audioVolume });
                } else if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance(text);
                    u.lang = lang;
                    u.rate = this.audioSpeed;
                    window.speechSynthesis.speak(u);
                }
            };
            this.audioElement.play().catch(() => {
                if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.speak === 'function') {
                    window.UniversalAudioEngine.speak(text, { rate: this.audioSpeed, volume: this.audioVolume });
                }
            });
            this.isPlayingAudio = true;
            this.updateAudioControlsUI();
        }

        stopAudio() {
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
                this.audioElement = null;
            }
            if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.stop === 'function') {
                window.UniversalAudioEngine.stop();
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            this.isPlayingAudio = false;
            this.updateAudioControlsUI();
        }

        `;
    c = c.slice(0, oldPlayAudioStart) + newAudioMethods + c.slice(oldToggleAudioStart);
    console.log('Successfully replaced playAudio and stopAudio methods!');
}

fs.writeFileSync('js/toeic-diagnostic-workstation.js', c, 'utf8');
console.log('toeic-diagnostic-workstation.js updated!');
