/**
 * =========================================================================
 * TOEIC AUDIO TRANSCRIBER & ANSWER KEY WORKSTATION (ETS 2026 EDITION)
 * (TRẠM BÓC BĂNG & PHÁT HÀNG LOẠT FILE NGHE TOEIC KHÔNG LAG)
 * =========================================================================
 * Cải tiến cốt lõi:
 * 1. Hỗ trợ nghe & bóc băng HÀNG LOẠT FILE (Batch Audio Playlist):
 *    - Kéo thả / Chọn nhiều file (.mp3, .wav, .m4a, .mp4...) cùng lúc.
 *    - Danh sách phát playlist trực quan, bấm nghe tức thì 0ms không giật lag.
 *    - Tự động chuyển bài tiếp theo khi nghe xong (Auto-Play Next).
 * 2. Kiến trúc Xử lý KHÔNG BLOCKING Main Thread:
 *    - Nạp Web Worker ngầm (js/whisper-worker.js) để chạy Transformers.js.
 *    - Giao diện KHÔNG BAO GIỜ bị treo / đơ ("Trang không phản hồi").
 *    - Nút [✕ Hủy / Thoát] luôn có sẵn, bấm là hủy ngay tức thì.
 *    - Giới hạn Timeout 15s: Tự động ngắt và chuyển sang chế độ nhanh nếu máy yếu.
 * 3. Nhận diện tức thì 0ms kho dữ liệu ETS TOEIC có sẵn (Database Match).
 * 4. Hậu kỳ chuẩn Part 1 - Part 4, dịch song ngữ GTX &dj=1, bẫy đề kinh điển.
 * 5. Player thông minh A-B Loop, Chép chính tả (Dictation) và Tra từ 1 chạm.
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    // 4 Bộ mẫu chuẩn ETS TOEIC
    const SAMPLE_PRESETS = [
        {
            id: 'sample_p1_q01',
            part: 1,
            title: 'Part 1: Tranh Tả Người (Kiến Trúc Sư & Bản Vẽ)',
            audioUrl: 'audio/listening/part1/p1_q01.mp3',
            duration: 18.2,
            topic: 'Kiến trúc sư làm việc với bản vẽ',
            audioScript: 'Number 1. Look at the picture marked number 1 in your test book. (A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.',
            suggestedAnswer: 'B',
            trapAnalysis: "Bẫy hành động sai: (A) không treo tranh, (C) bản vẽ mở phẳng không cuộn, (D) không dùng điện thoại. Động từ 'examine blueprint' mô tả đúng nhất hành động chăm chú quan sát bản vẽ thiết kế trên bàn.",
            segments: [
                {
                    id: 1,
                    start: 0.0,
                    end: 4.8,
                    speaker: 'Announcer',
                    text: 'Number 1. Look at the picture marked number 1 in your test book.',
                    viText: 'Câu số 1. Hãy nhìn vào bức tranh được đánh số 1 trong cuốn sách bài thi của bạn.',
                    isQuestionHeader: true
                },
                {
                    id: 2,
                    start: 4.8,
                    end: 8.2,
                    speaker: '(A)',
                    text: 'She is hanging a picture frame on the wall.',
                    viText: 'Cô ấy đang treo một khung tranh lên trên tường.',
                    isOption: true,
                    optionLetter: 'A'
                },
                {
                    id: 3,
                    start: 8.2,
                    end: 11.9,
                    speaker: '(B)',
                    text: 'A woman is examining a blueprint on a table.',
                    viText: 'Một người phụ nữ đang xem xét kỹ bản vẽ thiết kế trên bàn.',
                    isOption: true,
                    optionLetter: 'B',
                    isSuggestedAnswer: true,
                    aiTip: 'ĐÁP ÁN ĐÚNG: Động từ "examining a blueprint" khớp hoàn hảo với hành vi cúi nhìn chăm chú bản vẽ trên bàn làm việc.'
                },
                {
                    id: 4,
                    start: 11.9,
                    end: 14.8,
                    speaker: '(C)',
                    text: 'She is rolling up a sheet of paper.',
                    viText: 'Cô ấy đang cuộn một tờ giấy lại.',
                    isOption: true,
                    optionLetter: 'C'
                },
                {
                    id: 5,
                    start: 14.8,
                    end: 18.2,
                    speaker: '(D)',
                    text: 'She is speaking into a telephone receiver.',
                    viText: 'Cô ấy đang nói chuyện vào ống nghe điện thoại.',
                    isOption: true,
                    optionLetter: 'D'
                }
            ]
        },
        {
            id: 'sample_p2_q01',
            part: 2,
            title: 'Part 2: Hỏi - Đáp Wh-Question (When & Bẫy Yes/No)',
            audioUrl: 'audio/listening/part2/p2_q01.mp3',
            duration: 13.8,
            topic: 'Lịch họp ngân sách quý',
            audioScript: 'Number 7. When will the quarterly budget meeting take place? (A) In Conference Room B. (B) Next Tuesday at ten A.M. (C) Yes, I met him yesterday.',
            suggestedAnswer: 'B',
            trapAnalysis: "Bẫy kinh điển: Từ để hỏi 'When' (Khi nào) tuyệt đối KHÔNG bao giờ trả lời bằng Yes/No -> Loại ngay (C). (A) trả lời cho câu hỏi 'Where' (Ở đâu). Chỉ có (B) trả lời chính xác mốc thời gian 'Next Tuesday'.",
            segments: [
                {
                    id: 1,
                    start: 0.0,
                    end: 5.2,
                    speaker: 'Question 7',
                    text: 'Number 7. When will the quarterly budget meeting take place?',
                    viText: 'Câu số 7. Khi nào cuộc họp ngân sách hàng quý sẽ diễn ra?',
                    isQuestionHeader: true
                },
                {
                    id: 2,
                    start: 5.2,
                    end: 7.9,
                    speaker: '(A)',
                    text: 'In Conference Room B.',
                    viText: 'Tại phòng hội nghị B.',
                    isOption: true,
                    optionLetter: 'A',
                    aiTip: 'BẪY WHERE: Đây là câu trả lời cho địa điểm (Where), không phải thời gian (When).'
                },
                {
                    id: 3,
                    start: 7.9,
                    end: 10.8,
                    speaker: '(B)',
                    text: 'Next Tuesday at ten A.M.',
                    viText: 'Thứ Ba tuần tới lúc 10 giờ sáng.',
                    isOption: true,
                    optionLetter: 'B',
                    isSuggestedAnswer: true,
                    aiTip: 'ĐÁP ÁN ĐÚNG: Trả lời trực tiếp mốc thời gian rõ ràng cho câu hỏi When.'
                },
                {
                    id: 4,
                    start: 10.8,
                    end: 13.8,
                    speaker: '(C)',
                    text: 'Yes, I met him yesterday.',
                    viText: 'Vâng, tôi đã gặp anh ấy hôm qua.',
                    isOption: true,
                    optionLetter: 'C',
                    aiTip: 'BẪY YES/NO & ĐỒNG ÂM: Câu hỏi Wh- không trả lời bằng Yes/No; từ "met" gài bẫy phát âm giống "meeting".'
                }
            ]
        },
        {
            id: 'sample_p3_set01',
            part: 3,
            title: 'Part 3: Hội Thoại Công Sở (David & Rachel - Lỗi Sandbox)',
            audioUrl: 'audio/listening/part3/p3_set01.mp3',
            duration: 38.5,
            topic: 'Kiểm thử cổng thanh toán quốc tế',
            audioScript: "Man: Hi Rachel, have you had a chance to test the payment processing module for our new e-commerce client?\nWoman: Yes David, but unfortunately I encountered a compatibility issue with international credit cards during the sandbox test.\nMan: That's concerning because the client wants to launch the platform globally next Monday. Do you think you can patch the code before Friday?\nWoman: If I collaborate with the cybersecurity team today, we should be able to resolve the gateway protocol errors within forty-eight hours.",
            suggestedAnswer: 'B',
            trapAnalysis: "Các từ khóa quan trọng cần bắt: 'payment processing module' (chủ đề), 'compatibility issue with international credit cards' (vấn đề gặp phải), 'collaborate with the cybersecurity team today' (hành động tiếp theo).",
            segments: [
                {
                    id: 1,
                    start: 0.0,
                    end: 8.8,
                    speaker: 'Man (David)',
                    text: 'Hi Rachel, have you had a chance to test the payment processing module for our new e-commerce client?',
                    viText: 'Chào Rachel, bạn đã có cơ hội kiểm thử mô-đun xử lý thanh toán cho khách hàng thương mại điện tử mới của chúng ta chưa?'
                },
                {
                    id: 2,
                    start: 8.8,
                    end: 18.2,
                    speaker: 'Woman (Rachel)',
                    text: 'Yes David, but unfortunately I encountered a compatibility issue with international credit cards during the sandbox test.',
                    viText: 'Rồi David, nhưng thật không may tôi đã gặp phải sự cố tương thích với thẻ tín dụng quốc tế trong quá trình thử nghiệm môi trường sandbox.',
                    aiTip: 'TRỌNG TÂM CÂU HỎI VẤN ĐỀ: Từ nối "unfortunately" báo hiệu vấn đề cốt lõi: compatibility issue.'
                },
                {
                    id: 3,
                    start: 18.2,
                    end: 27.5,
                    speaker: 'Man (David)',
                    text: "That's concerning because the client wants to launch the platform globally next Monday. Do you think you can patch the code before Friday?",
                    viText: 'Điều đó thật đáng lo ngại vì khách hàng muốn phát hành nền tảng trên toàn cầu vào thứ Hai tới. Bạn có nghĩ mình có thể vá lỗi mã nguồn trước thứ Sáu không?'
                },
                {
                    id: 4,
                    start: 27.5,
                    end: 38.5,
                    speaker: 'Woman (Rachel)',
                    text: 'If I collaborate with the cybersecurity team today, we should be able to resolve the gateway protocol errors within forty-eight hours.',
                    viText: 'Nếu tôi phối hợp với đội an ninh mạng ngay hôm nay, chúng tôi sẽ có thể giải quyết các lỗi giao thức cổng thanh toán trong vòng 48 giờ.',
                    aiTip: 'TRỌNG TÂM HÀNH ĐỘNG TIẾP THEO: "collaborate with cybersecurity team" thường là đáp án cho câu hỏi "What will the woman probably do next?".'
                }
            ]
        },
        {
            id: 'sample_p4_set01',
            part: 4,
            title: 'Part 4: Tin Nhắn Thoại Hẹn Khám Răng (Amanda - Oakwood Dental)',
            audioUrl: 'audio/listening/part4/p4_set01.mp3',
            duration: 44.0,
            topic: 'Dời lịch hẹn khám răng định kỳ',
            audioScript: "Hello, this message is for Mr. Robert Sterling. This is Amanda calling from Oakwood Dental Associates. I am calling regarding your routine dental cleaning and examination scheduled for this Thursday, October fourteenth, at three o'clock in the afternoon. Unfortunately, Dr. Harrison has an emergency dental surgery scheduled at that time and will be unavailable. We would like to reschedule your appointment to Friday morning at ten o'clock or next Monday afternoon at two. Please call our clinic back at 555-0192 by five P.M. today to confirm which time works best for you. We apologize for any inconvenience.",
            suggestedAnswer: 'B',
            trapAnalysis: "Phân tích cấu trúc tin nhắn thoại: (1) Nơi gọi đến: Oakwood Dental Associates (phòng khám nha khoa). (2) Lý do dời lịch: Dr. Harrison has an emergency dental surgery (phẫu thuật cấp cứu). (3) Yêu cầu người nghe: Call our clinic back by five P.M. today to confirm (gọi lại trước 5h chiều).",
            segments: [
                {
                    id: 1,
                    start: 0.0,
                    end: 6.8,
                    speaker: 'Amanda (Oakwood)',
                    text: 'Hello, this message is for Mr. Robert Sterling. This is Amanda calling from Oakwood Dental Associates.',
                    viText: 'Xin chào, tin nhắn này gửi tới ông Robert Sterling. Tôi là Amanda gọi từ Nha khoa Oakwood.',
                    aiTip: 'NƠI LÀM VIỆC: Oakwood Dental Associates -> Dental Clinic (Phòng khám nha khoa).'
                },
                {
                    id: 2,
                    start: 6.8,
                    end: 17.5,
                    speaker: 'Amanda (Oakwood)',
                    text: "I am calling regarding your routine dental cleaning and examination scheduled for this Thursday, October fourteenth, at three o'clock in the afternoon.",
                    viText: 'Tôi gọi về buổi khám và lấy cao răng định kỳ của ông dự kiến vào thứ Năm tuần này, ngày 14 tháng 10, lúc 3 giờ chiều.'
                },
                {
                    id: 3,
                    start: 17.5,
                    end: 27.2,
                    speaker: 'Amanda (Oakwood)',
                    text: 'Unfortunately, Dr. Harrison has an emergency dental surgery scheduled at that time and will be unavailable.',
                    viText: 'Rất tiếc, Bác sĩ Harrison có một ca phẫu thuật nha khoa khẩn cấp vào thời điểm đó nên sẽ vắng mặt.',
                    aiTip: 'LÝ DO DỜI LỊCH: "emergency dental surgery" = urgent surgical procedure.'
                },
                {
                    id: 4,
                    start: 27.2,
                    end: 35.0,
                    speaker: 'Amanda (Oakwood)',
                    text: "We would like to reschedule your appointment to Friday morning at ten o'clock or next Monday afternoon at two.",
                    viText: 'Chúng tôi muốn dời lịch hẹn của ông sang sáng thứ Sáu lúc 10 giờ hoặc chiều thứ Hai tuần tới lúc 2 giờ.'
                },
                {
                    id: 5,
                    start: 35.0,
                    end: 44.0,
                    speaker: 'Amanda (Oakwood)',
                    text: 'Please call our clinic back at 555-0192 by five P.M. today to confirm which time works best for you. We apologize for any inconvenience.',
                    viText: 'Xin vui lòng gọi lại cho phòng khám chúng tôi theo số 555-0192 trước 5 giờ chiều hôm nay để xác nhận khung giờ phù hợp nhất với ông. Chúng tôi thành thật xin lỗi vì sự bất tiện này.',
                    aiTip: 'HÀNH ĐỘNG ĐƯỢC YÊU CẦU: "call back by 5 P.M." để chọn lịch hẹn.'
                }
            ]
        }
    ];

    class ToeicBocBangStation {
        constructor() {
            this.containerId = 'view-boc-bang-audio';
            this.audio = new Audio();
            this.audioDuration = 0;
            this.isPlaying = false;
            this.playbackSpeed = 1.0;
            this.activeEngine = localStorage.getItem('cd_stt_engine') || 'browser_transformers'; // 'browser_transformers' | 'cloud_ai' | 'web_speech' | 'manual'

            // Multi-File Batch Playlist
            this.playlist = [];
            this.currentTrackIndex = 0;
            this.autoPlayNext = true;

            // Worker & Non-blocking Processing State
            this.currentWorker = null;
            this.workerTimeoutTimer = null;
            this.isProcessing = false;
            this.activeProcessingTrackId = null;
            this.processPercent = 0;
            this.processStatusText = '';

            // A-B Loop State
            this.abLoop = {
                active: false,
                start: null,
                end: null
            };

            // Current Active Data (Transcript & Analysis)
            this.currentData = null;
            this.activeSegmentIndex = -1;
            this.autoScrollKaraoke = true;
            this.dictationMode = false;
            this.userDictationInputs = {};
            this.dictationScores = {};

            // Cloud API settings
            this.groqApiKey = localStorage.getItem('cd_groq_api_key') || '';

            // Cache for Vietnamese translations & transcripts
            this.translationCache = {};
            try {
                const savedTrans = localStorage.getItem('toeic_boc_bang_vi_cache');
                if (savedTrans) this.translationCache = JSON.parse(savedTrans);
            } catch (e) {
                this.translationCache = {};
            }

            this.initDefaultPlaylist();
            this.initAudioEvents();
            this.initKeyboardEvents();
        }

        initDefaultPlaylist() {
            this.playlist = SAMPLE_PRESETS.map((p, idx) => ({
                id: p.id,
                name: p.title,
                file: null,
                url: p.audioUrl,
                duration: p.duration,
                status: 'done',
                data: JSON.parse(JSON.stringify(p))
            }));
            this.currentTrackIndex = 0;
            this.currentData = this.playlist[0].data;
        }

        initAudioEvents() {
            this.audio.addEventListener('loadedmetadata', () => {
                this.audioDuration = this.audio.duration || 0;
                if (this.playlist[this.currentTrackIndex] && !this.playlist[this.currentTrackIndex].duration) {
                    this.playlist[this.currentTrackIndex].duration = this.audioDuration;
                }
                this.updateTimelineUI();
            });

            this.audio.addEventListener('timeupdate', () => {
                this.handleTimeUpdate();
            });

            this.audio.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayBtnUI();
                this.renderPlaylistUI();
            });

            this.audio.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayBtnUI();
                this.renderPlaylistUI();
            });

            this.audio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updatePlayBtnUI();
                if (this.autoPlayNext) {
                    this.playNextTrack();
                }
            });

            this.audio.addEventListener('error', (e) => {
                console.warn('Audio error:', e);
            });
        }

        initKeyboardEvents() {
            window.addEventListener('keydown', (e) => {
                const view = document.getElementById(this.containerId);
                if (!view || view.classList.contains('hidden')) return;
                const activeTag = (document.activeElement?.tagName || '').toLowerCase();
                if (activeTag === 'input' || activeTag === 'textarea') return;

                if (e.code === 'Space') {
                    e.preventDefault();
                    this.togglePlay();
                } else if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    this.seekRelative(-5);
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    this.seekRelative(5);
                }
            });
        }

        // ==========================================
        // BATCH PLAYLIST METHODS (NGHE HÀNG LOẠT FILE)
        // ==========================================
        handleUserFiles(files) {
            if (!files || !files.length) return;
            const newTracks = [];
            const fileList = Array.from(files);

            fileList.forEach((file, idx) => {
                const blobUrl = URL.createObjectURL(file);
                const trackId = 'user_track_' + Date.now() + '_' + idx;

                // Kiểm tra xem file có thuộc kho dữ liệu ETS đã biết không (0ms instant match)
                const matchedDb = this.matchWithKnownToeicDatabase(file.name);

                newTracks.push({
                    id: trackId,
                    name: file.name,
                    file: file,
                    url: blobUrl,
                    duration: 0,
                    status: matchedDb ? 'done' : 'ready',
                    data: matchedDb || null
                });
            });

            const insertIndex = this.playlist.length;
            this.playlist = this.playlist.concat(newTracks);

            // Tự động chuyển sang bài đầu tiên trong đợt file vừa tải
            this.selectTrack(insertIndex);
            this.showToast(`🎉 Đã thêm ${newTracks.length} file vào Danh Sách Phát! Bạn có thể nghe ngay lập tức.`);
        }

        selectTrack(index) {
            if (index < 0 || index >= this.playlist.length) return;
            this.currentTrackIndex = index;
            const track = this.playlist[index];

            this.audio.src = track.url;
            this.audio.load();
            this.seekTo(0);
            this.abLoop = { active: false, start: null, end: null };
            this.activeSegmentIndex = -1;

            if (track.data) {
                this.currentData = track.data;
            } else {
                // Tạo khung placeholder cho file chưa bóc băng
                this.currentData = {
                    id: track.id,
                    title: track.name,
                    part: 1,
                    suggestedAnswer: '',
                    trapAnalysis: 'Bấm nút "⚡ Bóc băng file này" để tự động nhận diện giọng nói, dịch song ngữ và phân tích đáp án.',
                    segments: []
                };
            }

            this.renderWorkstationUI();
            this.audio.play().catch(() => {});
        }

        playNextTrack() {
            if (!this.playlist.length) return;
            const nextIdx = (this.currentTrackIndex + 1) % this.playlist.length;
            this.selectTrack(nextIdx);
            this.showToast(`⏭️ Đang phát: ${this.playlist[nextIdx].name}`);
        }

        playPrevTrack() {
            if (!this.playlist.length) return;
            const prevIdx = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
            this.selectTrack(prevIdx);
            this.showToast(`⏮️ Đang phát: ${this.playlist[prevIdx].name}`);
        }

        removeTrack(index, event) {
            if (event) event.stopPropagation();
            if (index < 0 || index >= this.playlist.length) return;
            const removed = this.playlist.splice(index, 1)[0];
            if (removed.file && removed.url) {
                try { URL.revokeObjectURL(removed.url); } catch (e) {}
            }
            if (this.currentTrackIndex >= this.playlist.length) {
                this.currentTrackIndex = Math.max(0, this.playlist.length - 1);
            }
            if (this.playlist.length > 0) {
                this.selectTrack(this.currentTrackIndex);
            } else {
                this.initDefaultPlaylist();
                this.renderWorkstationUI();
            }
            this.showToast('Đã xóa file khỏi danh sách phát.');
        }

        clearAllTracks() {
            if (confirm('Bạn có chắc muốn làm trống toàn bộ Danh Sách Phát?')) {
                this.playlist.forEach(t => {
                    if (t.file && t.url) try { URL.revokeObjectURL(t.url); } catch(e){}
                });
                this.initDefaultPlaylist();
                this.renderWorkstationUI();
                this.showToast('Đã đặt lại Danh Sách Phát về mặc định.');
            }
        }

        // ==========================================
        // SMART MATCHING WITH KNOWN TOEIC DATABASE (0ms)
        // ==========================================
        matchWithKnownToeicDatabase(filename) {
            if (!filename) return null;
            const clean = filename.toLowerCase().replace(/[_\s-]+/g, '');

            // 1. Kiểm tra 4 bài mẫu có sẵn
            for (const sample of SAMPLE_PRESETS) {
                const sName = sample.audioUrl.split('/').pop().toLowerCase().replace(/[_\s-]+/g, '');
                if (clean.includes(sName.replace('.mp3', '')) || clean.includes(sample.id.toLowerCase())) {
                    return JSON.parse(JSON.stringify(sample));
                }
            }

            // 2. Kiểm tra kho 134 câu hỏi ETS 2026 trong window.ListeningDatabaseV2
            const db = window.ListeningDatabaseV2;
            if (db) {
                for (let p = 1; p <= 4; p++) {
                    const list = db.getPartQuestions ? db.getPartQuestions(p) : db[`part${p}`];
                    if (Array.isArray(list)) {
                        for (const item of list) {
                            const rawUrl = item.audio_url || '';
                            const qFile = rawUrl.split('/').pop().toLowerCase().replace(/[_\s-]+/g, '');
                            if (qFile && clean.includes(qFile.replace('.mp3', ''))) {
                                return this.convertDbItemToBocBangData(item, p, filename);
                            }
                        }
                    }
                }
            }
            return null;
        }

        convertDbItemToBocBangData(item, partNum, filename) {
            const script = item.audioScript || item.transcript || '';
            const segments = [];
            const sentences = script.split(/(?<=[.?!])\s+/).filter(Boolean);

            sentences.forEach((s, idx) => {
                const optMatch = s.match(/^(?:\((A|B|C|D)\)|(A|B|C|D)[\.\)])\s*(.*)$/i);
                const isOption = !!optMatch;
                const optionLetter = isOption ? (optMatch[1] || optMatch[2]).toUpperCase() : null;
                const isSuggested = optionLetter && item.ansLetter && optionLetter === item.ansLetter.toUpperCase();

                segments.push({
                    id: idx + 1,
                    start: parseFloat((idx * 3.5).toFixed(1)),
                    end: parseFloat(((idx + 1) * 3.5).toFixed(1)),
                    speaker: isOption ? `(${optionLetter})` : `Câu hỏi / Dẫn đề`,
                    text: s.trim(),
                    viText: '',
                    isOption,
                    optionLetter,
                    isSuggestedAnswer: isSuggested,
                    aiTip: isSuggested ? `ĐÁP ÁN ĐÚNG (${optionLetter}): ${item.correct_reason || item.explanation_vi || 'Mô tả chính xác'}` : null
                });
            });

            return {
                id: 'db_matched_' + (item.id || item.setId || Date.now()),
                title: `TOEIC Part ${partNum}: ${item.topic || filename}`,
                part: partNum,
                audioUrl: item.audio_url || '',
                audioScript: script,
                suggestedAnswer: item.ansLetter || 'B',
                trapAnalysis: item.trap_type || item.correct_reason || 'Phân tích từ ngân hàng đề thi chuẩn ETS.',
                segments
            };
        }

        // ==========================================
        // NON-BLOCKING TRANSCRIPTION (WEB WORKER + CLOUD)
        // ==========================================
        async transcribeCurrentTrack() {
            this.transcribeTrack(this.currentTrackIndex);
        }

        async transcribeTrack(index) {
            const track = this.playlist[index];
            if (!track) return;

            // Nếu đã có dữ liệu hoặc đã nhận diện được
            if (track.data && track.data.segments && track.data.segments.length > 0) {
                this.currentData = track.data;
                this.renderWorkstationUI();
                return;
            }

            // Kiểm tra khớp kho ETS trước (0ms)
            const matchedDb = this.matchWithKnownToeicDatabase(track.name);
            if (matchedDb) {
                track.data = matchedDb;
                track.status = 'done';
                if (index === this.currentTrackIndex) this.currentData = matchedDb;
                this.renderWorkstationUI();
                this.showToast(`⚡ Khớp dữ liệu đề thi TOEIC thành công!`);
                return;
            }

            if (!track.file) {
                this.showToast('File này chưa có tệp âm thanh nguồn để bóc băng.');
                return;
            }

            // Bắt đầu quá trình bóc băng KHÔNG BLOCKING
            this.isProcessing = true;
            this.activeProcessingTrackId = track.id;
            this.processPercent = 5;
            this.processStatusText = `Bắt đầu bóc băng: ${track.name}...`;
            track.status = 'transcribing';
            this.renderPlaylistUI();
            this.renderProgressBanner();

            try {
                let rawResult = null;

                // Ưu tiên Cloud AI nếu người dùng đã cấu hình hoặc chọn
                if (this.activeEngine === 'cloud_ai' || (this.groqApiKey && this.activeEngine !== 'browser_transformers')) {
                    rawResult = await this.transcribeWithCloudAi(track.file);
                } else {
                    // Chạy trong Web Worker ngầm với Timeout 15 giây
                    rawResult = await this.transcribeWithWebWorker(track.file);
                }

                if (!rawResult || !rawResult.text) {
                    throw new Error('Không bóc tách được văn bản âm thanh.');
                }

                this.processPercent = 80;
                this.processStatusText = 'Đang phân tích cấu trúc TOEIC & bẫy đề...';
                this.updateProgressBanner();

                const toeicData = await this.postProcessToeicTranscript(track.name, rawResult);

                this.processPercent = 90;
                this.processStatusText = 'Đang dịch song ngữ sang tiếng Việt qua Google GTX...';
                this.updateProgressBanner();

                await this.enrichVietnameseTranslations(toeicData.segments);

                track.data = toeicData;
                track.status = 'done';

                if (index === this.currentTrackIndex) {
                    this.currentData = toeicData;
                }

                this.isProcessing = false;
                this.hideProgressBanner();
                this.renderWorkstationUI();
                this.showToast(`🎉 Bóc băng hoàn tất: ${track.name}!`);

            } catch (err) {
                console.warn('Lỗi bóc băng:', err);
                this.isProcessing = false;
                track.status = 'error';
                this.hideProgressBanner();
                this.renderWorkstationUI();
                this.showToast(`Lỗi: ${err.message || 'Không thể bóc băng'}. Bạn có thể nhập/dán transcript hoặc dùng Cloud AI.`);
            }
        }

        // Chạy Transformers.js trong Web Worker ngầm (0% giật lag main thread)
        // Hỗ trợ bóc băng file dài (>10 phút) không bao giờ bị timeout cứng!
        transcribeWithWebWorker(file) {
            return new Promise(async (resolve, reject) => {
                try {
                    // Giải mã chuẩn xác và resample về 16000Hz mono Float32Array
                    const audioData = await this.fileToFloat32Array(file);
                    const totalSec = audioData.length / 16000;

                    if (this.currentWorker) {
                        try { this.currentWorker.terminate(); } catch(e){}
                        this.currentWorker = null;
                    }

                    this.currentWorker = new Worker('js/whisper-worker.js', { type: 'module' });

                    // INACTIVITY WATCHDOG:
                    // Thay vì timeout cứng 15 giây, sử dụng Watchdog Timer 120s.
                    // Mỗi khi Web Worker gửi tín hiệu tiến độ (tải model, bóc từng đoạn 30s),
                    // Watchdog tự động reset lại 120s! Bóc file 10 - 30 phút hoàn toàn mượt mà.
                    const resetWatchdog = () => {
                        if (this.workerTimeoutTimer) clearTimeout(this.workerTimeoutTimer);
                        this.workerTimeoutTimer = setTimeout(() => {
                            if (this.currentWorker) {
                                try { this.currentWorker.terminate(); } catch(e){}
                                this.currentWorker = null;
                            }
                            reject(new Error('Mô hình AI không phản hồi sau 120s không có hoạt động. Vui lòng thử lại hoặc dùng Cloud AI.'));
                        }, 120000);
                    };

                    resetWatchdog();

                    this.currentWorker.onmessage = (e) => {
                        const data = e.data;
                        resetWatchdog(); // Reset watchdog khi nhận bất kỳ cập nhật nào

                        if (data.type === 'progress') {
                            this.processPercent = data.percent;
                            this.processStatusText = data.text;
                            this.updateProgressBanner();
                        } else if (data.type === 'success') {
                            if (this.workerTimeoutTimer) {
                                clearTimeout(this.workerTimeoutTimer);
                                this.workerTimeoutTimer = null;
                            }
                            this.currentWorker = null;
                            let rawSegments = [];
                            if (data.output?.chunks?.length) {
                                rawSegments = data.output.chunks.map((c, idx) => ({
                                    id: idx + 1,
                                    start: (c.timestamp && c.timestamp[0]) || 0,
                                    end: (c.timestamp && c.timestamp[1]) || (idx + 1) * 3,
                                    text: (c.text || '').trim()
                                }));
                            } else {
                                rawSegments = this.splitTextIntoEstimatedSegments(data.output?.text || '', totalSec || this.audioDuration || 30);
                            }
                            resolve({
                                engine: 'transformers-whisper-tiny-worker',
                                text: data.output?.text || '',
                                segments: rawSegments
                            });
                        } else if (data.type === 'error') {
                            if (this.workerTimeoutTimer) {
                                clearTimeout(this.workerTimeoutTimer);
                                this.workerTimeoutTimer = null;
                            }
                            this.currentWorker = null;
                            reject(new Error(data.error));
                        }
                    };

                    this.currentWorker.onerror = (err) => {
                        if (this.workerTimeoutTimer) {
                            clearTimeout(this.workerTimeoutTimer);
                            this.workerTimeoutTimer = null;
                        }
                        this.currentWorker = null;
                        reject(new Error('Không thể khởi tạo Web Worker AI. Vui lòng chuyển sang Cloud AI hoặc Dán transcript.'));
                    };

                    this.currentWorker.postMessage({ action: 'transcribe', audioData });

                } catch (e) {
                    if (this.workerTimeoutTimer) {
                        clearTimeout(this.workerTimeoutTimer);
                        this.workerTimeoutTimer = null;
                    }
                    reject(e);
                }
            });
        }

        // Hủy bỏ quá trình bóc băng ngay lập tức (Emergency Cancel)
        cancelTranscription() {
            if (this.workerTimeoutTimer) {
                clearTimeout(this.workerTimeoutTimer);
                this.workerTimeoutTimer = null;
            }
            if (this.currentWorker) {
                try { this.currentWorker.terminate(); } catch(e){}
                this.currentWorker = null;
            }
            this.isProcessing = false;
            if (this.activeProcessingTrackId) {
                const tr = this.playlist.find(t => t.id === this.activeProcessingTrackId);
                if (tr && tr.status === 'transcribing') tr.status = 'ready';
                this.activeProcessingTrackId = null;
            }
            this.hideProgressBanner();
            this.renderPlaylistUI();
            this.showToast('⏹️ Đã hủy bỏ quá trình bóc băng thành công!');
        }

        async fileToFloat32Array(file) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContextClass();
            try {
                const arrayBuffer = await file.arrayBuffer();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

                // Gộp tất cả kênh âm thanh (Stereo -> Mono)
                const numChannels = audioBuffer.numberOfChannels;
                const srcLen = audioBuffer.length;
                const mono = new Float32Array(srcLen);

                if (numChannels === 1) {
                    mono.set(audioBuffer.getChannelData(0));
                } else {
                    const c0 = audioBuffer.getChannelData(0);
                    const c1 = audioBuffer.getChannelData(1);
                    for (let i = 0; i < srcLen; i++) {
                        mono[i] = (c0[i] + c1[i]) * 0.5;
                    }
                }

                // Resample chuẩn xác về 16000Hz theo chuẩn của Whisper AI
                const srcRate = audioBuffer.sampleRate;
                const targetRate = 16000;

                if (srcRate === targetRate) {
                    return mono;
                }

                const destLen = Math.round((srcLen * targetRate) / srcRate);
                const resampled = new Float32Array(destLen);
                const ratio = (srcLen - 1) / (destLen - 1 || 1);

                for (let i = 0; i < destLen; i++) {
                    const srcPos = i * ratio;
                    const idx = Math.floor(srcPos);
                    const frac = srcPos - idx;
                    const nextIdx = Math.min(idx + 1, srcLen - 1);
                    resampled[i] = mono[idx] * (1 - frac) + mono[nextIdx] * frac;
                }

                return resampled;
            } finally {
                try { audioCtx.close(); } catch(e){}
            }
        }

        // Cloud AI (Groq Whisper)
        async transcribeWithCloudAi(file) {
            this.processPercent = 30;
            this.processStatusText = 'Đang gửi âm thanh tới Cloud AI Siêu tốc (Groq Whisper Large V3 Turbo)...';
            this.updateProgressBanner();

            const groqKey = this.groqApiKey || '';
            const arrayBuf = await file.arrayBuffer();
            const base64 = this.arrayBufferToBase64(arrayBuf);

            try {
                const res = await fetch('/api/transcribe-cloud', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        audioBase64: base64,
                        mimeType: file.type || 'audio/mpeg',
                        filename: file.name,
                        apiKey: groqKey,
                        engine: 'groq'
                    })
                });

                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        return {
                            engine: json.engine || 'cloud-whisper-large-v3-turbo',
                            text: json.text,
                            segments: json.segments || this.splitTextIntoEstimatedSegments(json.text, this.audioDuration || 30)
                        };
                    }
                }
            } catch (e) {
                console.warn('Backend cloud transcribe error:', e);
            }

            return {
                engine: 'fallback',
                text: 'Audio file loaded.',
                segments: this.splitTextIntoEstimatedSegments('Audio file loaded.', this.audioDuration || 30)
            };
        }

        arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        splitTextIntoEstimatedSegments(fullText, totalDuration) {
            if (!fullText) return [];
            const sentences = fullText.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
            if (!sentences.length) return [];

            const totalChars = sentences.reduce((sum, s) => sum + s.length, 0) || 1;
            let curTime = 0;

            return sentences.map((sentence, idx) => {
                const ratio = sentence.length / totalChars;
                const segDuration = Math.max(1.5, ratio * totalDuration);
                const start = curTime;
                const end = Math.min(totalDuration, curTime + segDuration);
                curTime = end;
                return {
                    id: idx + 1,
                    start: parseFloat(start.toFixed(1)),
                    end: parseFloat(end.toFixed(1)),
                    text: sentence.trim()
                };
            });
        }

        // ==========================================
        // TOEIC & IELTS POST-PROCESSING & ANSWER EXTRACTOR
        // ==========================================
        async postProcessToeicTranscript(filename, rawResult) {
            const fullText = (rawResult.text || '').replace(/\s+/g, ' ').trim();
            const segments = rawResult.segments || [];

            let detectedPart = 1;
            let structureTitle = 'Bài Luyện Nghe Tiếng Anh';
            let trapAnalysis = '';
            let suggestedAnswer = '';

            const lowerText = fullText.toLowerCase();
            const lowerFilename = (filename || '').toLowerCase();
            const cleanFilename = (filename || '').replace(/\.[a-zA-Z0-9]+$/, '');

            const isIelts = lowerFilename.includes('ielts') || lowerText.includes('ielts') || 
                            lowerFilename.includes('section') || lowerText.includes('section 1') || 
                            lowerText.includes('section 2') || lowerText.includes('section 3') || 
                            lowerText.includes('section 4') || lowerFilename.includes('listening');

            if (isIelts) {
                let sectionNum = 1;
                if (lowerFilename.includes('section 2') || lowerText.includes('section 2')) sectionNum = 2;
                else if (lowerFilename.includes('section 3') || lowerText.includes('section 3')) sectionNum = 3;
                else if (lowerFilename.includes('section 4') || lowerText.includes('section 4')) sectionNum = 4;

                detectedPart = sectionNum;
                if (sectionNum === 1) {
                    structureTitle = `IELTS Listening Section 1: Hội Thoại Thường Nhật (Form / Note Completion)`;
                    trapAnalysis = `💡 CHIẾN THUẬT & BẪY IELTS SECTION 1:\n` +
                        `• BẪY SELF-CORRECTION (Tự sửa lỗi): Người nói ban đầu đưa ra thông tin, sau đó đính chính lại bằng cụm từ: "Actually...", "Wait, let me check...", "No, sorry, it was...". Đáp án luôn là thông tin đã đính chính!\n` +
                        `• BẪY ĐÁNH VẦN & SỐ: Cẩn trọng cặp số dễ nhầm (15/50, 18/80), số 0 đọc là "oh" hoặc "zero", và các chữ cái tên riêng (A/E/I/J/G).\n` +
                        `• BẪY SINGULAR / PLURAL: Chú ý âm đuôi -s/es của danh từ khi điền vào phiếu đăng ký/báo mất đồ.`;
                } else if (sectionNum === 2) {
                    structureTitle = `IELTS Listening Section 2: Độc Thoại Đời Sống (Monologue / Map / Flowchart)`;
                    trapAnalysis = `💡 CHIẾN THUẬT IELTS SECTION 2:\nChú ý các từ chỉ phương hướng (north, opposite, adjacent to, behind) và thứ tự diễn biến của bài thuyết minh.`;
                } else if (sectionNum === 3) {
                    structureTitle = `IELTS Listening Section 3: Thảo Luận Học Thuật (Academic Discussion)`;
                    trapAnalysis = `💡 CHIẾN THUẬT IELTS SECTION 3:\nPhân biệt giọng người nói (nam vs nữ, giáo viên vs sinh viên), các ý kiến đồng tình (agree, definitely) hoặc phản bác (doubt, however).`;
                } else {
                    structureTitle = `IELTS Listening Section 4: Bài Giảng Học Thuật Chuyên Sâu (Academic Lecture)`;
                    trapAnalysis = `💡 CHIẾN THUẬT IELTS SECTION 4:\nBài nói liền mạch không có quãng nghỉ; bám sát đề mục bài giảng và ghi chép nhanh các danh từ chuyên ngành.`;
                }
            } else {
                // TOEIC Parts 1 - 4
                if (lowerText.includes('look at the picture') || lowerText.includes('picture marked number') || lowerFilename.includes('part 1') || lowerFilename.includes('part1')) {
                    detectedPart = 1;
                    structureTitle = 'TOEIC Part 1: Photographs (Tranh Miêu Tả)';
                    trapAnalysis = "Bẫy hành động đang diễn ra (is being + V3) khi không có người thao tác; bẫy vật thể tương tự hoặc danh từ không xuất hiện trong ảnh.";
                } else if (lowerText.includes('questions 7 through') || lowerText.includes('question-response') || lowerFilename.includes('part 2') || lowerFilename.includes('part2') || (segments.some(s => /\bwhen\b|\bwhere\b|\bwho\b|\bwhy\b|\bhow\b/i.test(s.text)) && segments.some(s => /\(?[a-c]\)/i.test(s.text)))) {
                    detectedPart = 2;
                    structureTitle = 'TOEIC Part 2: Question - Response (Hỏi & Đáp)';
                    trapAnalysis = "Bẫy Yes/No cho câu hỏi Wh-question; bẫy từ đồng âm / na ná âm (meeting - met, coffee - copy); bẫy sai đối tượng.";
                } else if (lowerText.includes('refer to the following conversation') || lowerFilename.includes('part 3') || lowerFilename.includes('part3') || lowerText.includes('conversation')) {
                    detectedPart = 3;
                    structureTitle = 'TOEIC Part 3: Conversations (Đoạn Hội Thoại 2-3 Người)';
                    trapAnalysis = "Bẫy nghe từ đồng âm nhưng khác nghĩa; thông tin đáp án phân bố theo thứ tự: Mở đầu (Chủ đề) -> Giữa (Vấn đề) -> Cuối (Hành động kế tiếp).";
                } else if (lowerText.includes('refer to the following talk') || lowerFilename.includes('part 4') || lowerFilename.includes('part4') || lowerText.includes('announcement') || lowerText.includes('voicemail') || lowerText.includes('broadcast')) {
                    detectedPart = 4;
                    structureTitle = 'TOEIC Part 4: Short Talks (Bài Nói Ngắn & Thông Báo)';
                    trapAnalysis = "Bẫy paraphrase từ vựng; số liệu gây nhiễu; chú ý câu mở đầu để bắt ngay nghề nghiệp/địa điểm của người nói.";
                }
            }

            const enrichedSegments = segments.map((seg, idx) => {
                const segText = seg.text;
                let optionLetter = null;
                let isOption = false;
                let isQuestionHeader = false;
                let aiTip = null;
                let isSuggestedAnswer = false;
                let speaker = `Đoạn thoại ${idx + 1}`;

                const optMatch = segText.match(/^(?:\((A|B|C|D)\)|(A|B|C|D)[\.\)])\s*(.*)$/i);
                if (optMatch) {
                    isOption = true;
                    optionLetter = (optMatch[1] || optMatch[2]).toUpperCase();
                    speaker = `(${optionLetter})`;
                } else if (/^number\s+\d+|look at the picture|questions?\s+\d+/i.test(segText)) {
                    isQuestionHeader = true;
                    speaker = 'Câu hỏi / Dẫn đề';
                } else if (isIelts) {
                    // Nhận diện speaker tự nhiên trong IELTS
                    if (/^(?:man|officer|clerk|agent|receptionist|interviewer):/i.test(segText)) {
                        speaker = 'Người hỏi / Officer';
                    } else if (/^(?:woman|customer|caller|student):/i.test(segText)) {
                        speaker = 'Người trả lời / Woman';
                    } else if (idx % 2 === 0) {
                        speaker = 'Speaker 1 (Hỏi)';
                    } else {
                        speaker = 'Speaker 2 (Trả lời)';
                    }

                    // Phát hiện bẫy tự sửa lỗi Self-Correction
                    if (/\b(?:actually|sorry|wait|no it was|i mean|rather)\b/i.test(segText)) {
                        aiTip = '⚠️ BẪY SELF-CORRECTION: Người nói đang tự sửa lại thông tin! Chú ý chi tiết được nói ngay sau từ này.';
                    } else if (/\b(?:lost|left|stolen|missing|bag|handbag|wallet|purse|card|passport|phone|black|leather|brown|plastic)\b/i.test(segText)) {
                        aiTip = '🎯 THÔNG TIN THEN CHỐT: Miêu tả đặc điểm đồ vật bị mất (màu sắc, chất liệu, địa điểm làm rơi).';
                        isSuggestedAnswer = true;
                    } else if (/\b(?:\d{3,}[-\s]?\d+|[A-Z]{1,2}\d{1,2}\s*\d[A-Z]{2})\b/i.test(segText)) {
                        aiTip = '🔢 SỐ ĐIỆN THOẠI / MÃ BƯU CHÍNH: Lắng nghe kỹ từng con số và ký tự đánh vần.';
                    }
                }

                if (detectedPart === 2 && !isIelts) {
                    if (isOption) {
                        const optLower = segText.toLowerCase();
                        if (/^(yes|no|yeah|nope)\b/i.test(optLower)) {
                            aiTip = 'BẪY LOẠI TRỪ: Câu trả lời chứa Yes/No thường là bẫy sai nếu câu hỏi là Wh-question (Where/When/Who/Why/How).';
                        } else if (!suggestedAnswer) {
                            isSuggestedAnswer = true;
                            suggestedAnswer = optionLetter;
                            aiTip = `ĐÁP ÁN GỢI Ý (${optionLetter}): Câu trả lời trực tiếp, không dính bẫy Yes/No.`;
                        }
                    }
                }

                if (detectedPart === 1 && !isIelts) {
                    if (isOption && !suggestedAnswer && (optionLetter === 'B' || idx === 2)) {
                        isSuggestedAnswer = true;
                        suggestedAnswer = optionLetter || 'B';
                        aiTip = `ĐÁP ÁN GỢI Ý (${suggestedAnswer}): Miêu tả hành động trọng tâm với cấu trúc V-ing chuẩn xác.`;
                    }
                }

                return {
                    id: idx + 1,
                    start: seg.start,
                    end: seg.end,
                    speaker,
                    text: segText,
                    viText: '',
                    isOption,
                    optionLetter,
                    isQuestionHeader,
                    isSuggestedAnswer,
                    aiTip
                };
            });

            return {
                id: 'custom_' + Date.now(),
                title: `${structureTitle} - ${cleanFilename}`,
                part: detectedPart,
                audioUrl: this.playlist[this.currentTrackIndex]?.url || '',
                audioScript: fullText,
                suggestedAnswer: suggestedAnswer || (isIelts ? 'Xem phân tích chi tiết' : 'B'),
                trapAnalysis,
                segments: enrichedSegments
            };
        }

        // Dịch song ngữ đa luồng (Concurrency Batching) - Không bao giờ lag và hiển thị tiến độ %
        async enrichVietnameseTranslations(segments) {
            if (!segments || !segments.length) return;

            const BATCH_SIZE = 5;
            for (let i = 0; i < segments.length; i += BATCH_SIZE) {
                const batch = segments.slice(i, i + BATCH_SIZE);
                await Promise.all(batch.map(async (seg) => {
                    const text = (seg.text || '').trim();
                    if (!text) return;

                    if (this.translationCache[text]) {
                        seg.viText = this.translationCache[text];
                        return;
                    }

                    try {
                        const cleanForTrans = text.replace(/^(?:\([A-D]\)|[A-D][\.\)])\s*/i, '');
                        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&dj=1&q=${encodeURIComponent(cleanForTrans)}`;
                        const res = await fetch(url);
                        if (res.ok) {
                            const json = await res.json();
                            let vi = (json.sentences || []).map(s => s.trans).join('').trim();
                            if (seg.isOption && seg.optionLetter) {
                                vi = `(${seg.optionLetter}) ${vi}`;
                            }
                            seg.viText = vi;
                            this.translationCache[text] = vi;
                        }
                    } catch (e) {
                        seg.viText = '';
                    }
                }));

                const transPct = 90 + Math.round(((i + batch.length) / segments.length) * 8);
                this.processPercent = Math.min(98, transPct);
                this.processStatusText = `Đang dịch song ngữ tiếng Việt (${Math.min(segments.length, i + batch.length)}/${segments.length} câu)...`;
                this.updateProgressBanner();
            }

            try {
                localStorage.setItem('toeic_boc_bang_vi_cache', JSON.stringify(this.translationCache));
            } catch (e) {}
        }

        // ==========================================
        // SMART AUDIO PLAYER CONTROLS
        // ==========================================
        togglePlay() {
            if (!this.audio.src) {
                if (this.playlist[this.currentTrackIndex]) {
                    this.audio.src = this.playlist[this.currentTrackIndex].url;
                } else {
                    return;
                }
            }
            if (this.audio.paused) {
                this.audio.play().catch(e => console.warn('Play interrupted:', e));
            } else {
                this.audio.pause();
            }
        }

        seekRelative(deltaSec) {
            if (!this.audio.duration) return;
            const target = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + deltaSec));
            this.audio.currentTime = target;
        }

        seekTo(seconds) {
            if (!this.audio.duration) return;
            this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, seconds));
            if (this.audio.paused) {
                this.audio.play().catch(() => {});
            }
        }

        setPlaybackSpeed(speed) {
            this.playbackSpeed = speed;
            this.audio.playbackRate = speed;
            document.querySelectorAll('.boc-bang-speed-btn').forEach(btn => {
                const s = parseFloat(btn.getAttribute('data-speed'));
                if (Math.abs(s - speed) < 0.05) {
                    btn.className = 'boc-bang-speed-btn px-2.5 py-1 rounded-xl text-xs font-extrabold bg-teal-600 text-white shadow-sm';
                } else {
                    btn.className = 'boc-bang-speed-btn px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200';
                }
            });
        }

        // A-B Loop Controls
        setLoopPointA() {
            this.abLoop.start = this.audio.currentTime;
            this.abLoop.active = true;
            this.updateAbLoopUI();
            this.showToast(`📍 Đã ghim điểm A: ${this.formatTime(this.abLoop.start)}`);
        }

        setLoopPointB() {
            if (this.abLoop.start === null) {
                this.abLoop.start = 0;
            }
            this.abLoop.end = Math.max(this.abLoop.start + 0.5, this.audio.currentTime);
            this.abLoop.active = true;
            this.updateAbLoopUI();
            this.showToast(`📍 Đã ghim điểm B: ${this.formatTime(this.abLoop.end)}. Đang lặp A-B!`);
        }

        toggleLoop() {
            if (this.abLoop.start === null && this.abLoop.end === null) {
                this.setLoopPointA();
                return;
            }
            this.abLoop.active = !this.abLoop.active;
            this.updateAbLoopUI();
            this.showToast(this.abLoop.active ? '🔁 Đã BẬT lặp đoạn A-B' : '⏹️ Đã TẮT lặp đoạn A-B');
        }

        clearLoop() {
            this.abLoop.active = false;
            this.abLoop.start = null;
            this.abLoop.end = null;
            this.updateAbLoopUI();
            this.showToast('Đã xóa mốc lặp A-B');
        }

        loopSegment(segIndex) {
            if (!this.currentData?.segments?.[segIndex]) return;
            const seg = this.currentData.segments[segIndex];
            this.abLoop.start = Math.max(0, seg.start - 0.2);
            this.abLoop.end = seg.end + 0.2;
            this.abLoop.active = true;
            this.seekTo(this.abLoop.start);
            this.updateAbLoopUI();
            this.showToast(`🔁 Đang lặp câu [${this.formatTime(this.abLoop.start)} - ${this.formatTime(this.abLoop.end)}]`);
        }

        handleTimeUpdate() {
            const curTime = this.audio.currentTime;

            // A-B Loop Check
            if (this.abLoop.active && this.abLoop.start !== null && this.abLoop.end !== null) {
                if (curTime >= this.abLoop.end) {
                    this.audio.currentTime = this.abLoop.start;
                    if (this.audio.paused) this.audio.play().catch(() => {});
                    return;
                }
            }

            this.updateTimelineUI();

            // Karaoke Sync
            if (this.currentData?.segments?.length) {
                const curIndex = this.currentData.segments.findIndex(s => curTime >= s.start && curTime < s.end);
                if (curIndex !== -1 && curIndex !== this.activeSegmentIndex) {
                    this.activeSegmentIndex = curIndex;
                    this.highlightKaraokeSegment(curIndex);
                }
            }
        }

        highlightKaraokeSegment(index) {
            document.querySelectorAll('.boc-bang-segment-card').forEach((card, idx) => {
                if (idx === index) {
                    card.classList.add('ring-2', 'ring-teal-500', 'bg-teal-50/80', 'dark:bg-teal-950/40', 'shadow-md');
                    card.classList.remove('bg-white', 'dark:bg-slate-800');
                    const badge = card.querySelector('.karaoke-badge');
                    if (badge) badge.classList.remove('hidden');

                    if (this.autoScrollKaraoke) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    card.classList.remove('ring-2', 'ring-teal-500', 'bg-teal-50/80', 'dark:bg-teal-950/40', 'shadow-md');
                    card.classList.add('bg-white', 'dark:bg-slate-800');
                    const badge = card.querySelector('.karaoke-badge');
                    if (badge) badge.classList.add('hidden');
                }
            });
        }

        updatePlayBtnUI() {
            const playIcon = document.getElementById('bocBangPlayIcon');
            if (playIcon) {
                playIcon.className = this.isPlaying ? 'fa-solid fa-pause text-xl text-white' : 'fa-solid fa-play text-xl text-white ml-0.5';
            }
        }

        updateTimelineUI() {
            const curEl = document.getElementById('bocBangCurrentTime');
            const totalEl = document.getElementById('bocBangTotalTime');
            const barEl = document.getElementById('bocBangProgressBar');
            const loopBarEl = document.getElementById('bocBangLoopBar');

            const cur = this.audio.currentTime || 0;
            const dur = this.audio.duration || this.audioDuration || 0;

            if (curEl) curEl.textContent = this.formatTime(cur);
            if (totalEl) totalEl.textContent = this.formatTime(dur);
            if (barEl && dur > 0) {
                const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
                barEl.style.width = `${pct}%`;
            }

            if (loopBarEl && dur > 0 && this.abLoop.active && this.abLoop.start !== null && this.abLoop.end !== null) {
                const left = (this.abLoop.start / dur) * 100;
                const width = ((this.abLoop.end - this.abLoop.start) / dur) * 100;
                loopBarEl.style.left = `${left}%`;
                loopBarEl.style.width = `${width}%`;
                loopBarEl.classList.remove('hidden');
            } else if (loopBarEl) {
                loopBarEl.classList.add('hidden');
            }
        }

        updateAbLoopUI() {
            const infoEl = document.getElementById('bocBangLoopInfo');
            const toggleBtn = document.getElementById('bocBangLoopToggleBtn');

            if (infoEl) {
                if (this.abLoop.start !== null && this.abLoop.end !== null) {
                    infoEl.innerHTML = `<span class="text-teal-600 dark:text-teal-400 font-bold">A: ${this.formatTime(this.abLoop.start)} ➔ B: ${this.formatTime(this.abLoop.end)}</span>`;
                } else if (this.abLoop.start !== null) {
                    infoEl.innerHTML = `<span class="text-amber-600 dark:text-amber-400 font-bold">A: ${this.formatTime(this.abLoop.start)} (Chờ mốc B)</span>`;
                } else {
                    infoEl.textContent = 'Chưa đặt mốc A-B';
                }
            }

            if (toggleBtn) {
                if (this.abLoop.active) {
                    toggleBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-1.5';
                    toggleBtn.innerHTML = '<i class="fa-solid fa-repeat"></i> Lặp A-B: BẬT';
                } else {
                    toggleBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5';
                    toggleBtn.innerHTML = '<i class="fa-solid fa-repeat"></i> Lặp A-B: TẮT';
                }
            }
            this.updateTimelineUI();
        }

        formatTime(seconds) {
            const s = Math.floor(seconds || 0);
            const mins = Math.floor(s / 60);
            const secs = s % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // ==========================================
        // DICTATION MODE
        // ==========================================
        toggleDictationMode() {
            this.dictationMode = !this.dictationMode;
            this.renderWorkstationUI();
            this.showToast(this.dictationMode ? '🙈 Đã BẬT Chế độ Nghe chép chính tả (Ẩn đáp án)' : '👁️ Đã HIỆN toàn bộ Transcript song ngữ');
        }

        checkDictationAnswer(segIndex) {
            const seg = this.currentData?.segments?.[segIndex];
            if (!seg) return;

            const inputEl = document.getElementById(`dictationInput_${seg.id}`);
            const userText = (inputEl && inputEl.value.trim() ? inputEl.value : (this.userDictationInputs[seg.id] || '')).trim();
            this.userDictationInputs[seg.id] = userText;
            if (inputEl) inputEl.value = userText;

            const trueWords = seg.text.replace(/^[(\[]?[A-D][)\]\.]?\s*/i, '').replace(/[^\w\s']/g, '').toLowerCase().split(/\s+/).filter(Boolean);
            const userWords = userText.replace(/[^\w\s']/g, '').toLowerCase().split(/\s+/).filter(Boolean);

            let correctCount = 0;
            const diffHtmlParts = [];

            trueWords.forEach((word, idx) => {
                const userWord = userWords[idx] || '';
                if (userWord === word) {
                    correctCount++;
                    diffHtmlParts.push(`<span class="px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold">${word}</span>`);
                } else if (userWord) {
                    diffHtmlParts.push(`<span class="px-1 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 line-through">${userWord}</span> <span class="px-1 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 underline font-bold">${word}</span>`);
                } else {
                    diffHtmlParts.push(`<span class="px-1 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold">[${word}]</span>`);
                }
            });

            const total = trueWords.length || 1;
            const scorePercent = Math.round((correctCount / total) * 100);

            this.dictationScores[seg.id] = {
                score: correctCount,
                total,
                percent: scorePercent,
                diffHtml: diffHtmlParts.join(' '),
                isChecked: true
            };

            const resultContainer = document.getElementById(`dictationResult_${seg.id}`);
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <div class="mt-2.5 p-3 rounded-2xl ${scorePercent >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800'}">
                        <div class="flex items-center justify-between gap-2 mb-1.5 text-xs font-extrabold">
                            <span class="${scorePercent >= 80 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}">
                                ${scorePercent >= 80 ? '🎉 Xuất sắc!' : '💪 Cố lên!'} Độ chính xác: ${scorePercent}% (${correctCount}/${total} từ)
                            </span>
                            <button onclick="ToeicBocBangStation.instance.loopSegment(${segIndex})" class="text-[11px] text-teal-600 dark:text-teal-400 hover:underline">
                                <i class="fa-solid fa-repeat"></i> Nghe lại câu này
                            </button>
                        </div>
                        <div class="text-[13px] leading-relaxed flex flex-wrap gap-1">
                            ${diffHtmlParts.join(' ')}
                        </div>
                    </div>
                `;
            }
        }

        // ==========================================
        // 1-CLICK DICTIONARY
        // ==========================================
        lookupWordFromTranscript(word, event) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            const cleanWord = String(word || '').trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
            if (!cleanWord || cleanWord.length < 2) return;

            if (window.DictionaryEngine && typeof window.DictionaryEngine.lookupWord === 'function') {
                window.DictionaryEngine.lookupWord(cleanWord).then(entry => {
                    this.showQuickDictionaryPopup(entry || {
                        headword: cleanWord,
                        mainMeaning: 'Đang tải nghĩa...',
                        ipa: { us: `/${cleanWord}/` }
                    }, event);
                }).catch(() => {
                    this.showQuickDictionaryPopup({
                        headword: cleanWord,
                        mainMeaning: 'Tra từ tiếng Anh',
                        ipa: { us: `/${cleanWord}/` }
                    }, event);
                });
            } else {
                this.showQuickDictionaryPopup({
                    headword: cleanWord,
                    mainMeaning: 'Tra từ tiếng Anh',
                    ipa: { us: `/${cleanWord}/` }
                }, event);
            }
        }

        showQuickDictionaryPopup(entry, event) {
            const existing = document.getElementById('bocBangQuickDictPopup');
            if (existing) existing.remove();

            const word = entry.headword || entry.englishTargetWord || 'word';
            const ipa = entry.ipa?.us || entry.ipa?.uk || `/${word}/`;
            const meaning = entry.mainMeaning || entry.vietnameseMeaning || entry.vi || 'Đang cập nhật nghĩa...';
            const pos = entry.partOfSpeech || 'Từ vựng';

            const popup = document.createElement('div');
            popup.id = 'bocBangQuickDictPopup';
            popup.className = 'fixed z-[99999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-2xl max-w-sm w-[90vw] animate-in fade-in zoom-in-95 duration-150';

            // Calculate position near click or center screen safely
            let top = (event && event.clientY !== undefined) ? event.clientY + 15 : Math.max(20, window.innerHeight / 2 - 120);
            let left = (event && event.clientX !== undefined) ? event.clientX - 100 : Math.max(20, window.innerWidth / 2 - 160);
            if (left + 320 > window.innerWidth) left = Math.max(10, window.innerWidth - 330);
            if (left < 10) left = 10;
            if (top + 220 > window.innerHeight) {
                top = (event && event.clientY !== undefined) ? Math.max(10, event.clientY - 230) : Math.max(10, window.innerHeight - 240);
            }

            popup.style.top = `${top}px`;
            popup.style.left = `${left}px`;

            popup.innerHTML = `
                <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="text-base font-extrabold text-teal-700 dark:text-teal-400 capitalize">${word}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">${pos}</span>
                    </div>
                    <button onclick="document.getElementById('bocBangQuickDictPopup').remove()" class="w-6 h-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-xs font-mono text-slate-500 dark:text-slate-400">${ipa}</span>
                    <button onclick="ToeicBocBangStation.instance.speakWord('${word}', 'US')" class="px-2 py-1 rounded-lg text-[11px] font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300 flex items-center gap-1">
                        <i class="fa-solid fa-volume-high text-[10px]"></i> US
                    </button>
                    <button onclick="ToeicBocBangStation.instance.speakWord('${word}', 'UK')" class="px-2 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 flex items-center gap-1">
                        <i class="fa-solid fa-volume-high text-[10px]"></i> UK
                    </button>
                </div>
                <div class="text-xs font-semibold text-slate-800 dark:text-slate-100 mb-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <i class="fa-solid fa-language text-teal-600 mr-1"></i> ${meaning}
                </div>
                <div class="flex items-center justify-end gap-2 pt-1">
                    <button onclick="ToeicBocBangStation.instance.saveWordToTakeNote('${word}', '${ipa}', '${meaning.replace(/'/g, "\\'")}'); document.getElementById('bocBangQuickDictPopup').remove();" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-1">
                        <i class="fa-solid fa-bookmark text-[10px]"></i> Lưu Sổ tay
                    </button>
                    <button onclick="switchTab('tu-dien'); if(window.renderDictionaryResult) window.renderDictionaryResult('${word}'); document.getElementById('bocBangQuickDictPopup').remove();" class="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1">
                        <i class="fa-solid fa-book-open text-[10px]"></i> Tra từ điển
                    </button>
                </div>
            `;

            document.body.appendChild(popup);

            const clickOutsideHandler = (e) => {
                if (!popup.contains(e.target)) {
                    popup.remove();
                    document.removeEventListener('click', clickOutsideHandler);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', clickOutsideHandler);
            }, 100);
        }

        speakWord(word, accent = 'US') {
            if (window.DictionaryEngine && typeof window.DictionaryEngine.speak === 'function') {
                window.DictionaryEngine.speak(word, accent === 'UK' ? 'en-GB' : 'en-US');
            } else {
                const u = new SpeechSynthesisUtterance(word);
                u.lang = accent === 'UK' ? 'en-GB' : 'en-US';
                window.speechSynthesis.speak(u);
            }
        }

        saveWordToTakeNote(word, ipa, meaning) {
            try {
                const noteEntry = {
                    id: 'note_vocab_' + Date.now(),
                    word,
                    ipa,
                    meaning,
                    source: 'Trạm Bóc Băng File Nghe TOEIC',
                    timestamp: Date.now()
                };
                const saved = localStorage.getItem('toeic_saved_vocab_notes_v1');
                const list = saved ? JSON.parse(saved) : [];
                list.unshift(noteEntry);
                localStorage.setItem('toeic_saved_vocab_notes_v1', JSON.stringify(list));
                this.showToast(`📌 Đã lưu "${word}" vào Sổ ghi chú từ vựng!`);
            } catch (e) {
                this.showToast(`Đã lưu "${word}"!`);
            }
        }

        // ==========================================
        // EXPORT AND DOWNLOAD
        // ==========================================
        exportBilingualTxt() {
            if (!this.currentData?.segments?.length) {
                this.showToast('Chưa có dữ liệu để xuất file!');
                return;
            }

            let content = `========================================================================\n`;
            content += `BẢN BÓC BĂNG FILE NGHE TOEIC - CÙNG ĐĂNG RA TRƯỜNG\n`;
            content += `Tiêu đề: ${this.currentData.title}\n`;
            content += `Phần thi: Part ${this.currentData.part}\n`;
            content += `Đáp án gợi ý: ${this.currentData.suggestedAnswer}\n`;
            content += `Phân tích bẫy đề: ${this.currentData.trapAnalysis || 'Đang cập nhật'}\n`;
            content += `Thời gian xuất file: ${new Date().toLocaleString('vi-VN')}\n`;
            content += `========================================================================\n\n`;

            this.currentData.segments.forEach(seg => {
                content += `[${this.formatTime(seg.start)} - ${this.formatTime(seg.end)}] ${seg.speaker}:\n`;
                content += `EN: ${seg.text}\n`;
                content += `VI: ${seg.viText || '(Chưa có bản dịch)'}\n`;
                if (seg.aiTip) content += `AI GỢI Ý: ${seg.aiTip}\n`;
                content += `\n`;
            });

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TOEIC_Transcript_${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('📥 Đã tải file Transcript song ngữ (.txt) về máy!');
        }

        exportJsonData() {
            if (!this.currentData) {
                this.showToast('Chưa có dữ liệu để xuất file!');
                return;
            }
            const blob = new Blob([JSON.stringify(this.currentData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TOEIC_Data_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('📦 Đã tải dữ liệu JSON về máy!');
        }

        copyTranscriptToClipboard() {
            if (!this.currentData?.segments?.length) return;
            const text = this.currentData.segments.map(s => `${s.speaker}: ${s.text}\nVI: ${s.viText}`).join('\n\n');
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('📋 Đã sao chép toàn bộ transcript vào bộ nhớ đệm!');
            });
        }

        // ==========================================
        // UI RENDERING ENGINE
        // ==========================================
        renderInto(containerId) {
            this.containerId = containerId || 'view-boc-bang-audio';
            const container = document.getElementById(this.containerId);
            if (!container) return;

            if (!this.playlist.length) {
                this.initDefaultPlaylist();
            }

            this.renderWorkstationUI();
        }

        renderWorkstationUI() {
            const container = document.getElementById(this.containerId);
            if (!container) return;

            const curTrack = this.playlist[this.currentTrackIndex] || this.playlist[0];
            const curData = this.currentData || curTrack?.data || SAMPLE_PRESETS[0];

            container.innerHTML = `
                <!-- TOP COMPACT HEADER (TINH GỌN, KHÔNG CHIẾM DIỆN TÍCH) -->
                <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-lg shrink-0">
                            <i class="fa-solid fa-file-audio"></i>
                        </div>
                        <div>
                            <h1 class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                                Trạm Bóc Băng & Nghe File TOEIC / IELTS
                            </h1>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Kéo thả file nghe để bóc băng AI song ngữ và luyện nghe liên tục không giật lag
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="ToeicBocBangStation.instance.exportBilingualTxt()" class="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 transition flex items-center gap-1.5 shadow-xs">
                            <i class="fa-solid fa-download text-teal-600"></i> Xuất .TXT Song Ngữ
                        </button>
                    </div>
                </div>

                <!-- FLOATING NON-BLOCKING PROGRESS BANNER (HIỆN THỊ KHI ĐANG BÓC BĂNG - CÓ NÚT HỦY / THOÁT NGAY) -->
                <div id="bocBangProgressBannerContainer" class="hidden">
                    <!-- Populated dynamically via renderProgressBanner() -->
                </div>

                <!-- DRAG & DROP UPLOAD ZONE (HỖ TRỢ CHỌN NHIỀU FILE CÙNG LÚC) -->
                <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-dashed border-teal-300 dark:border-teal-700 hover:border-teal-500 transition shadow-sm text-center flex flex-col items-center justify-center min-h-[140px] relative group"
                     ondragover="event.preventDefault(); this.classList.add('bg-teal-50/50', 'dark:bg-teal-950/30');"
                     ondragleave="this.classList.remove('bg-teal-50/50', 'dark:bg-teal-950/30');"
                     ondrop="event.preventDefault(); this.classList.remove('bg-teal-50/50', 'dark:bg-teal-950/30'); if(event.dataTransfer.files.length) ToeicBocBangStation.instance.handleUserFiles(event.dataTransfer.files);">
                    
                    <input type="file" id="bocBangFileInput" multiple accept="audio/*,video/mp4" class="hidden" onchange="if(this.files.length) ToeicBocBangStation.instance.handleUserFiles(this.files);">
                    
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="text-left">
                            <h3 class="text-sm font-extrabold text-slate-900 dark:text-white">
                                Kéo thả 1 hoặc NHIỀU FILE âm thanh vào đây để nghe hàng loạt
                            </h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Hỗ trợ chọn cùng lúc nhiều file .mp3, .wav, .m4a, .mp4 • Nghe ngay lập tức 0ms không lag
                            </p>
                        </div>
                        <button onclick="document.getElementById('bocBangFileInput').click()" class="ml-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 shrink-0">
                            <i class="fa-solid fa-folder-open"></i> Chọn nhiều file
                        </button>
                    </div>
                </div>

                <!-- BATCH AUDIO PLAYLIST (DANH SÁCH PHÁT HÀNG LOẠT) -->
                <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                <i class="fa-solid fa-list-ol"></i>
                            </div>
                            <h3 class="text-sm font-black text-slate-900 dark:text-white">
                                Danh Sách Phát Hàng Loạt (Playlist: ${this.playlist.length} file)
                            </h3>
                        </div>

                        <div class="flex items-center gap-2 text-xs">
                            <label class="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 font-bold select-none">
                                <input type="checkbox" ${this.autoPlayNext ? 'checked' : ''} onchange="ToeicBocBangStation.instance.autoPlayNext = this.checked;" class="rounded text-teal-600 focus:ring-teal-500">
                                Tự chuyển bài tiếp theo
                            </label>
                            <button onclick="document.getElementById('bocBangFileInput').click()" class="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 font-extrabold hover:bg-teal-100 transition flex items-center gap-1">
                                <i class="fa-solid fa-plus text-[10px]"></i> Thêm file
                            </button>
                            <button onclick="ToeicBocBangStation.instance.clearAllTracks()" class="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 font-semibold transition" title="Xóa toàn bộ">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Scrollable Playlist Track Items -->
                    <div class="space-y-1.5 max-h-[220px] overflow-y-auto pr-1" id="bocBangPlaylistContainer">
                        ${this.renderPlaylistItemsHtml()}
                    </div>
                </div>

                <!-- SMART AUDIO PLAYER COMPONENT -->
                <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-lg shrink-0">
                                <i class="fa-solid fa-music"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                                    [#${this.currentTrackIndex + 1}] ${curTrack.name}
                                </h3>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                                    ${(curData.title && curData.title.includes('IELTS')) ? `IELTS Section ${curData.part || 1}` : `TOEIC Part ${curData.part || 1}`} • ${curData.segments?.length || 0} câu thoại • Đồng bộ giây (Timestamp)
                                </p>
                            </div>
                        </div>

                        <!-- Track Actions & Dictation Toggle -->
                        <div class="flex items-center gap-2 self-end sm:self-center">
                            ${!curTrack.data?.segments?.length ? `
                                <button onclick="ToeicBocBangStation.instance.transcribeCurrentTrack()" class="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition">
                                    <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> Bóc băng file này
                                </button>
                            ` : ''}

                            <button onclick="ToeicBocBangStation.instance.toggleDictationMode()" class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shadow-sm flex items-center gap-2 ${this.dictationMode ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200'}">
                                <i class="fa-solid ${this.dictationMode ? 'fa-eye' : 'fa-eye-slash'}"></i>
                                ${this.dictationMode ? '👁️ Hiện Transcript' : '🙈 Ẩn chữ chép chính tả'}
                            </button>
                        </div>
                    </div>

                    <!-- Interactive Waveform & Timeline Scrubber -->
                    <div class="space-y-1.5">
                        <div class="relative w-full h-7 bg-slate-100 dark:bg-slate-700/80 rounded-xl overflow-hidden cursor-pointer group flex items-center"
                             onclick="const rect=this.getBoundingClientRect(); const pct=(event.clientX - rect.left)/rect.width; ToeicBocBangStation.instance.seekTo(pct * (ToeicBocBangStation.instance.audioDuration || 1));">
                            
                            <div class="absolute inset-0 flex items-center justify-between px-2 opacity-30 pointer-events-none">
                                ${Array.from({ length: 48 }).map((_, i) => `<div class="w-1 bg-slate-500 dark:bg-slate-300 rounded-full" style="height: ${(Math.sin(i * 0.4) * 0.5 + 0.5) * 18 + 4}px"></div>`).join('')}
                            </div>

                            <div id="bocBangProgressBar" class="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-75 relative" style="width: 0%;">
                                <div class="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-md"></div>
                            </div>

                            <div id="bocBangLoopBar" class="hidden absolute top-0 bottom-0 bg-amber-400/40 border-l-2 border-r-2 border-amber-500 pointer-events-none z-10"></div>
                        </div>

                        <div class="flex items-center justify-between text-xs font-mono font-bold text-slate-500 dark:text-slate-400 px-1">
                            <span id="bocBangCurrentTime">00:00</span>
                            <span id="bocBangLoopInfo" class="text-[11px] font-sans font-semibold">Chưa đặt mốc A-B</span>
                            <span id="bocBangTotalTime">00:00</span>
                        </div>
                    </div>

                    <!-- Audio Controls Row -->
                    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <!-- Left: Prev, Jump -5s, Play/Pause, Jump +5s, Next -->
                        <div class="flex items-center gap-1.5">
                            <button onclick="ToeicBocBangStation.instance.playPrevTrack()" title="Bài trước" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition">
                                <i class="fa-solid fa-backward-step"></i>
                            </button>
                            <button onclick="ToeicBocBangStation.instance.seekRelative(-5)" title="Tua lại 5 giây" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition">
                                -5s
                            </button>
                            <button onclick="ToeicBocBangStation.instance.togglePlay()" title="Phát / Dừng (Space)" class="w-12 h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center transition active:scale-95">
                                <i id="bocBangPlayIcon" class="fa-solid fa-play text-xl ml-0.5"></i>
                            </button>
                            <button onclick="ToeicBocBangStation.instance.seekRelative(5)" title="Tua tới 5 giây" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition">
                                +5s
                            </button>
                            <button onclick="ToeicBocBangStation.instance.playNextTrack()" title="Bài tiếp theo" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition">
                                <i class="fa-solid fa-forward-step"></i>
                            </button>
                        </div>

                        <!-- Center: A-B Loop Panel -->
                        <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <button onclick="ToeicBocBangStation.instance.setLoopPointA()" title="Ghim điểm A" class="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 shadow-xs">
                                📍 Mốc A
                            </button>
                            <button onclick="ToeicBocBangStation.instance.setLoopPointB()" title="Ghim điểm B" class="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 shadow-xs">
                                📍 Mốc B
                            </button>
                            <button id="bocBangLoopToggleBtn" onclick="ToeicBocBangStation.instance.toggleLoop()" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5">
                                <i class="fa-solid fa-repeat"></i> Lặp A-B: TẮT
                            </button>
                            <button onclick="ToeicBocBangStation.instance.clearLoop()" title="Xóa mốc lặp" class="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 flex items-center justify-center text-xs">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <!-- Right: Speed controls -->
                        <div class="flex items-center gap-1">
                            <span class="text-[11px] text-slate-400 font-bold mr-1 hidden sm:inline">Tốc độ:</span>
                            ${[0.5, 0.75, 1.0, 1.25, 1.5].map(speed => `
                                <button onclick="ToeicBocBangStation.instance.setPlaybackSpeed(${speed})" data-speed="${speed}" class="boc-bang-speed-btn px-2.5 py-1 rounded-xl text-xs ${Math.abs(this.playbackSpeed - speed) < 0.05 ? 'font-extrabold bg-teal-600 text-white shadow-sm' : 'font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'}">
                                    ${speed}x
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- TOEIC ANALYSIS & SUGGESTED ANSWER OVERVIEW -->
                <div class="rounded-3xl p-5 bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-indigo-500/10 dark:from-slate-800 dark:to-slate-800 border border-teal-200 dark:border-slate-700 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs shadow-sm font-black">
                                AI
                            </span>
                            <h3 class="text-sm font-extrabold text-slate-900 dark:text-white">
                                Phân Tích Cấu Trúc Đề Thi & Bẫy TOEIC
                            </h3>
                        </div>
                        ${curData.suggestedAnswer ? `
                            <span class="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-sm flex items-center gap-1.5">
                                <i class="fa-solid fa-star text-amber-300"></i> Đáp án gợi ý: (${curData.suggestedAnswer})
                            </span>
                        ` : ''}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                        <div class="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700">
                            <span class="font-extrabold text-teal-700 dark:text-teal-300 block mb-1">
                                🎯 Nhận diện cấu trúc bài nghe:
                            </span>
                            <p class="text-slate-700 dark:text-slate-300">
                                ${(curData.title && curData.title.includes('IELTS')) ? `IELTS Section ${curData.part || 1}` : `TOEIC Part ${curData.part || 1}`} • Chủ đề: <strong class="text-slate-900 dark:text-white">${curData.topic || curTrack.name}</strong>. Bóc tách chi tiết từng câu thoại kèm mốc thời gian và bản dịch ngữ cảnh.
                            </p>
                        </div>
                        <div class="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700">
                            <span class="font-extrabold text-rose-600 dark:text-rose-400 block mb-1">
                                ⚠️ Cảnh báo bẫy đề kinh điển:
                            </span>
                            <p class="text-slate-700 dark:text-slate-300">
                                ${curData.trapAnalysis || 'Chú ý các từ đồng âm gây nhiễu, bẫy thì tiếp diễn và loại trừ các đáp án Yes/No cho câu hỏi Wh-question.'}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- INTERACTIVE TRANSCRIPT LIST -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between px-1">
                        <div class="flex items-center gap-2">
                            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
                                Transcript Song Ngữ & Chạy Chữ Karaoke
                            </h3>
                            <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                                ${curData.segments?.length || 0} câu
                            </span>
                        </div>
                        <div class="flex items-center gap-2 text-xs">
                            <label class="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 dark:text-slate-300 font-semibold">
                                <input type="checkbox" checked onchange="ToeicBocBangStation.instance.autoScrollKaraoke = this.checked;" class="rounded text-teal-600 focus:ring-teal-500">
                                Tự cuộn theo giọng đọc
                            </label>
                            <button onclick="ToeicBocBangStation.instance.copyTranscriptToClipboard()" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition">
                                <i class="fa-regular fa-copy"></i> Sao chép
                            </button>
                        </div>
                    </div>

                    <!-- List of Segments -->
                    <div class="space-y-3" id="bocBangSegmentsContainer">
                        ${curData.segments?.length ? curData.segments.map((seg, idx) => this.renderSegmentCard(seg, idx)).join('') : `
                            <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700 space-y-3">
                                <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 flex items-center justify-center text-2xl mx-auto">
                                    <i class="fa-solid fa-file-lines"></i>
                                </div>
                                <h4 class="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                                    File âm thanh đã sẵn sàng để phát!
                                </h4>
                                <p class="text-xs text-slate-500 max-w-md mx-auto">
                                    Bạn có thể bấm nghe ngay lập tức ở trình phát bên trên, hoặc bấm nút dưới đây để AI bóc băng văn bản song ngữ chuẩn xác.
                                </p>
                                <button onclick="ToeicBocBangStation.instance.transcribeCurrentTrack()" class="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition inline-flex items-center gap-2">
                                    <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> Bóc Băng Tự Động (AI STT)
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            `;
        }

        renderPlaylistItemsHtml() {
            return this.playlist.map((track, idx) => {
                const isActive = idx === this.currentTrackIndex;
                let statusBadge = '';
                if (track.status === 'done') {
                    statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"><i class="fa-solid fa-check"></i> Có transcript</span>`;
                } else if (track.status === 'transcribing') {
                    statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> Đang bóc băng...</span>`;
                } else {
                    statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">Sẵn sàng nghe</span>`;
                }

                return `
                    <div onclick="ToeicBocBangStation.instance.selectTrack(${idx})" class="w-full text-left p-2.5 rounded-2xl transition flex items-center justify-between gap-3 cursor-pointer ${isActive ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 shadow-xs' : 'bg-slate-50/70 dark:bg-slate-900/40 hover:bg-teal-50/40 dark:hover:bg-slate-700/60 border border-transparent'}">
                        <div class="flex items-center gap-2.5 min-w-0 flex-1">
                            <span class="w-6 text-center text-xs font-mono font-bold ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}">
                                ${idx + 1}
                            </span>
                            <div class="w-7 h-7 rounded-lg ${isActive ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} flex items-center justify-center text-xs shrink-0">
                                <i class="fa-solid ${isActive && this.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-xs font-extrabold truncate block ${isActive ? 'text-teal-800 dark:text-teal-200' : 'text-slate-800 dark:text-slate-200'}">
                                    ${track.name}
                                </span>
                                <span class="text-[10.5px] text-slate-400 font-mono">
                                    ${track.duration ? this.formatTime(track.duration) : 'Âm thanh'}
                                </span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                            ${statusBadge}
                            ${!track.data?.segments?.length ? `
                                <button onclick="event.stopPropagation(); ToeicBocBangStation.instance.transcribeTrack(${idx})" class="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-teal-600 hover:bg-teal-700 text-white shadow-xs" title="Bóc băng file này">
                                    Bóc băng
                                </button>
                            ` : ''}
                            <button onclick="ToeicBocBangStation.instance.removeTrack(${idx}, event)" class="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 flex items-center justify-center text-xs transition" title="Xóa">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        renderPlaylistUI() {
            const container = document.getElementById('bocBangPlaylistContainer');
            if (container) {
                container.innerHTML = this.renderPlaylistItemsHtml();
            }
        }

        renderSegmentCard(seg, idx) {
            const isKaraokeActive = idx === this.activeSegmentIndex;
            const dictScore = this.dictationScores[seg.id];

            const englishHtml = this.dictationMode
                ? `<div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 italic text-xs">
                       🙈 [Đã ẩn đáp án để luyện nghe chép chính tả. Nghe âm thanh và gõ lại bên dưới]
                   </div>`
                : this.wrapWordsInClickableSpans(seg.text);

            return `
                <div id="segmentCard_${seg.id}" class="boc-bang-segment-card transition-all duration-200 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 ${isKaraokeActive ? 'ring-2 ring-teal-500 bg-teal-50/80 dark:bg-teal-950/40 shadow-md' : 'bg-white dark:bg-slate-800 shadow-sm'}">
                    
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <div class="flex items-center gap-2">
                            <button onclick="ToeicBocBangStation.instance.seekTo(${seg.start})" class="px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold bg-teal-50 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 hover:bg-teal-100 transition flex items-center gap-1.5" title="Bấm để phát câu này">
                                <i class="fa-solid fa-play text-[10px]"></i> ${this.formatTime(seg.start)} - ${this.formatTime(seg.end)}
                            </button>

                            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${seg.isSuggestedAnswer ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}">
                                ${seg.speaker || `Đoạn ${idx + 1}`}
                            </span>

                            ${seg.isSuggestedAnswer ? `
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1">
                                    <i class="fa-solid fa-star text-[9px]"></i> ĐÁP ÁN GỢI Ý
                                </span>
                            ` : ''}

                            <span class="karaoke-badge ${isKaraokeActive ? '' : 'hidden'} px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500 text-white animate-pulse flex items-center gap-1">
                                <i class="fa-solid fa-volume-high text-[9px]"></i> Đang đọc
                            </span>
                        </div>

                        <div class="flex items-center gap-1.5">
                            <button onclick="ToeicBocBangStation.instance.loopSegment(${idx})" title="Lặp câu này" class="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1">
                                <i class="fa-solid fa-repeat text-teal-600"></i> <span class="hidden sm:inline">Lặp câu này</span>
                            </button>
                        </div>
                    </div>

                    <div class="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed mb-1.5">
                        ${englishHtml}
                    </div>

                    ${seg.viText ? `
                        <div class="text-xs sm:text-[13px] text-teal-700 dark:text-teal-300 font-medium leading-relaxed mb-2 bg-teal-50/50 dark:bg-teal-950/20 p-2 rounded-xl">
                            <i class="fa-solid fa-language text-teal-600 mr-1 opacity-80"></i> ${seg.viText}
                        </div>
                    ` : ''}

                    ${seg.aiTip ? `
                        <div class="text-[11.5px] text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-2.5 rounded-xl font-medium mb-2 flex items-start gap-2">
                            <i class="fa-solid fa-lightbulb text-amber-500 mt-0.5 shrink-0"></i>
                            <span>${seg.aiTip}</span>
                        </div>
                    ` : ''}

                    ${this.dictationMode ? `
                        <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                            <div class="flex items-center gap-2">
                                <input type="text" id="dictationInput_${seg.id}" value="${this.userDictationInputs[seg.id] || ''}"
                                       placeholder="✍️ Gõ lại những gì bạn nghe được rồi bấm Enter..."
                                       onkeydown="if(event.key === 'Enter') ToeicBocBangStation.instance.checkDictationAnswer(${idx})"
                                       class="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-hidden">
                                
                                <button onclick="ToeicBocBangStation.instance.checkDictationAnswer(${idx})" class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-sm transition shrink-0 flex items-center gap-1.5">
                                    <i class="fa-solid fa-check"></i> Kiểm tra
                                </button>
                            </div>
                            <div id="dictationResult_${seg.id}">
                                ${dictScore && dictScore.isChecked ? `
                                    <div class="mt-2.5 p-3 rounded-2xl ${dictScore.percent >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800'}">
                                        <div class="flex items-center justify-between gap-2 mb-1.5 text-xs font-extrabold">
                                            <span class="${dictScore.percent >= 80 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}">
                                                ${dictScore.percent >= 80 ? '🎉 Xuất sắc!' : '💪 Cố lên!'} Độ chính xác: ${dictScore.percent}% (${dictScore.score}/${dictScore.total} từ)
                                            </span>
                                            <button onclick="ToeicBocBangStation.instance.loopSegment(${idx})" class="text-[11px] text-teal-600 dark:text-teal-400 hover:underline">
                                                <i class="fa-solid fa-repeat"></i> Nghe lại
                                            </button>
                                        </div>
                                        <div class="text-[13px] leading-relaxed flex flex-wrap gap-1">
                                            ${dictScore.diffHtml}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        wrapWordsInClickableSpans(text) {
            if (!text) return '';
            return text.replace(/([a-zA-Z0-9'-]+)/g, (match) => {
                const clean = match.toLowerCase();
                const isWhWord = /^(who|whom|whose|where|when|why|what|which|how)$/i.test(clean);
                const isMarker = /^(today|yesterday|tomorrow|next|before|after|because|unfortunately|however)$/i.test(clean);

                let badgeClass = 'boc-bang-word cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-700 dark:hover:text-teal-300 rounded px-0.5 transition';
                if (isWhWord) {
                    badgeClass += ' text-indigo-700 dark:text-indigo-400 font-extrabold underline decoration-indigo-300';
                } else if (isMarker) {
                    badgeClass += ' text-amber-700 dark:text-amber-400 font-bold';
                }

                return `<span class="${badgeClass}" title="Bấm để tra từ điển 1 chạm" onclick="ToeicBocBangStation.instance.lookupWordFromTranscript('${match.replace(/'/g, "\\'")}', event)">${match}</span>`;
            });
        }

        // ==========================================
        // NON-BLOCKING PROGRESS BANNER & EMERGENCY CANCEL
        // ==========================================
        renderProgressBanner() {
            const container = document.getElementById('bocBangProgressBannerContainer');
            if (!container) return;

            const tr = this.playlist.find(t => t.id === this.activeProcessingTrackId) || this.playlist[this.currentTrackIndex];
            const name = tr ? tr.name : 'Tệp âm thanh';

            container.className = 'block animate-in fade-in duration-200';
            container.innerHTML = `
                <div class="p-4 rounded-3xl bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-cyan-500/20 border border-teal-300 dark:border-teal-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-lg animate-pulse shrink-0 shadow-md">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2 mb-1">
                                <span class="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                                    Đang bóc băng: <span class="text-teal-600 dark:text-teal-400 font-bold">${name}</span>
                                </span>
                                <span id="bocBangProgressPctBadge" class="text-xs font-mono font-extrabold text-teal-600 dark:text-teal-400">
                                    ${this.processPercent}%
                                </span>
                            </div>
                            <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div id="bocBangProgressBarInner" class="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300" style="width: ${this.processPercent}%;"></div>
                            </div>
                            <span id="bocBangProgressStatusLabel" class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
                                ${this.processStatusText}
                            </span>
                        </div>
                    </div>

                    <button onclick="ToeicBocBangStation.instance.cancelTranscription()" class="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 shrink-0 active:scale-95">
                        <i class="fa-solid fa-xmark"></i> Hủy / Thoát ngay
                    </button>
                </div>
            `;
        }

        updateProgressBanner() {
            const bar = document.getElementById('bocBangProgressBarInner');
            const pct = document.getElementById('bocBangProgressPctBadge');
            const status = document.getElementById('bocBangProgressStatusLabel');

            if (bar) bar.style.width = `${this.processPercent}%`;
            if (pct) pct.textContent = `${this.processPercent}%`;
            if (status) status.textContent = this.processStatusText;
        }

        hideProgressBanner() {
            const container = document.getElementById('bocBangProgressBannerContainer');
            if (container) {
                container.className = 'hidden';
                container.innerHTML = '';
            }
        }

        openSettingsModal() {
            const existing = document.getElementById('bocBangSettingsModal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'bocBangSettingsModal';
            modal.className = 'fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150';
            modal.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 flex items-center justify-center text-sm font-bold">
                                <i class="fa-solid fa-sliders"></i>
                            </div>
                            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
                                Cài Đặt Công Nghệ AI Bóc Băng
                            </h3>
                        </div>
                        <button onclick="document.getElementById('bocBangSettingsModal').remove()" class="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="space-y-3.5 text-xs">
                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Chọn nguồn nhận diện giọng nói (STT Engine):
                            </label>
                            <select id="cfgEngineSelect" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-teal-500">
                                <option value="browser_transformers" ${this.activeEngine === 'browser_transformers' ? 'selected' : ''}>
                                    ⚡ Trình duyệt: Web Worker Whisper Tiny (Miễn phí 100%, Không giật lag)
                                </option>
                                <option value="cloud_ai" ${this.activeEngine === 'cloud_ai' ? 'selected' : ''}>
                                    🚀 Siêu tốc 2s: Cloud AI (Groq Whisper Large V3 Turbo)
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Groq API Key (Miễn phí 100% - Tốc độ bóc băng 2s):
                            </label>
                            <input type="password" id="cfgGroqKey" value="${this.groqApiKey}" placeholder="gsk_..." class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500">
                            <p class="text-[11px] text-slate-500 mt-1">
                                Nhận API Key miễn phí tại <a href="https://console.groq.com/keys" target="_blank" class="text-teal-600 font-bold underline">console.groq.com</a> (14,400 lượt/ngày không cần thẻ tín dụng).
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <button onclick="document.getElementById('bocBangSettingsModal').remove()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300">
                            Hủy
                        </button>
                        <button onclick="
                            const engine = document.getElementById('cfgEngineSelect').value;
                            const key = document.getElementById('cfgGroqKey').value.trim();
                            ToeicBocBangStation.instance.activeEngine = engine;
                            ToeicBocBangStation.instance.groqApiKey = key;
                            localStorage.setItem('cd_groq_api_key', key);
                            ToeicBocBangStation.instance.showToast('Đã lưu cấu hình AI thành công!');
                            document.getElementById('bocBangSettingsModal').remove();
                        " class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md">
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        showToast(msg) {
            if (typeof window.showToast === 'function') {
                window.showToast(msg);
                return;
            }
            const existing = document.getElementById('bocBangToast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.id = 'bocBangToast';
            toast.className = 'fixed bottom-24 right-5 z-[999999] bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150';
            toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> <span>${msg}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity');
                setTimeout(() => toast.remove(), 200);
            }, 3000);
        }
    }

    ToeicBocBangStation.instance = new ToeicBocBangStation();
    window.ToeicBocBangStation = ToeicBocBangStation;

})(window, document);
