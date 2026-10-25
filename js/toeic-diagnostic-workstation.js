/**
 * TOEIC DIAGNOSTIC WORKSTATION ENGINE (Chuẩn ETS 2026 · Thang điểm 0 - 990)
 * Bài kiểm tra chẩn đoán đầu vào toàn diện ĐỦ 7 PART (Part 1 - Part 7):
 * - Part 1: Photographs (4 câu có hình ảnh chất lượng cao & audio đa giọng)
 * - Part 2: Question-Response (4 câu bẫy gián tiếp, Wh-, âm tương tự, hỏi ngược)
 * - Part 3: Conversations (4 câu / 2 hội thoại bẫy keyword & câu hỏi ngụ ý)
 * - Part 4: Short Talks (4 câu / 2 bài nói thông báo sân bay & báo cáo dự án)
 * - Part 5: Incomplete Sentences (4 câu từ loại -ive/-al, rút gọn V-ing, thể giả định, liên từ)
 * - Part 6: Text Completion (4 câu điền đoạn văn, ngữ pháp, mạch logic & liên từ chuyển ý)
 * - Part 7: Reading Comprehension (4 câu: đoạn đơn chính sách hoàn tiền & đoạn kép lịch trình hội nghị)
 * Tổng cộng: 28 câu chuẩn mực · 25 phút đếm ngược
 * Quy đổi điểm chuẩn ETS 0 - 990 (Listening 0 - 495, Reading 0 - 495)
 * Tự động phân tích & cập nhật 6 Trụ Cột Lỗ Hổng Kiến Thức (Weakness Radar)
 * Tích hợp điều hướng bản đồ Lộ Trình S-Curve thông minh.
 */

(function (window, document) {
    'use strict';

    class ToeicDiagnosticWorkstation {
        constructor() {
            this.isOpen = false;
            this.currentIndex = 0; // 0..27
            this.userAnswers = {}; // { qId: selectedOptionKey }
            this.flagged = {}; // { qId: boolean }
            
            // Timer state
            this.timeRemaining = 25 * 60; // 25 phút = 1500s
            this.timerInterval = null;
            this.isTimerRunning = false;

            // Audio player state for listening questions (Q1 - Q16)
            this.isPlayingAudio = false;
            this.audioSpeed = 1.0;
            this.audioVolume = 0.9;
            this.isLooping = false;
            this.currentUtterance = null;

            // Toggles
            this.showBilingual = false;
            this.showEvidence = true;
            this.showTranscript = false;

            // Database of 28 standardized diagnostic questions covering ALL 7 PARTS
            this.questions = [
                // =================================================================
                // PART 1: PHOTOGRAPHS (Listening · Q1 - Q4)
                // =================================================================
                {
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
                    transcript: '(A) She is hanging a picture frame on the wall.\n(B) A woman is examining a blueprint on a table.\n(C) She is rolling up a sheet of paper.\n(D) She is speaking into a telephone receiver.',
                    transcriptVi: '(A) Cô ấy đang treo khung tranh lên tường.\n(B) Một người phụ nữ đang xem xét bản vẽ thiết kế trên bàn.\n(C) Cô ấy đang cuộn một tờ giấy lại.\n(D) Cô ấy đang nói chuyện qua ống nghe điện thoại.',
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
                    transcript: '(A) A physician is reviewing an X-ray on a wall display.\n(B) He is prescribing medication to a patient.\n(C) A stethoscope is lying on the examination table.\n(D) The lights in the laboratory have been switched off.',
                    transcriptVi: '(A) Bác sĩ đang xem xét phim chụp X-quang trên màn hình treo tường.\n(B) Ông ấy đang kê đơn thuốc cho bệnh nhân.\n(C) Ống nghe đang nằm trên bàn khám.\n(D) Đèn trong phòng thí nghiệm đã bị tắt.',
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
                    transcript: '(A) A woman is checking out a library book.\n(B) She is stacking books onto a tall shelf.\n(C) Patrons are reading newspapers at a study carrel.\n(D) She is adjusting the lens of a photocopier.',
                    transcriptVi: '(A) Người phụ nữ đang làm thủ tục mượn sách thư viện.\n(B) Cô ấy đang xếp các cuốn sách lên giá sách cao.\n(C) Độc giả đang đọc báo tại bàn tự học.\n(D) Cô ấy đang điều chỉnh ống kính của máy photocopy.',
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
                    audioScript: 'Number 4. Look at the picture marked number 4 in your test book. (A) A server is wiping down a wooden counter. (B) He is pouring coffee into a customer\'s mug. (C) Chairs are stacked on top of the dining tables. (D) A menu board is being replaced on the wall.',
                    transcript: '(A) A server is wiping down a wooden counter.\n(B) He is pouring coffee into a customer\'s mug.\n(C) Chairs are stacked on top of the dining tables.\n(D) A menu board is being replaced on the wall.',
                    transcriptVi: '(A) Nhân viên phục vụ đang lau sạch bề mặt quầy gỗ.\n(B) Anh ấy đang rót cà phê vào cốc của khách hàng.\n(C) Ghế được xếp chồng lên trên bàn ăn.\n(D) Bảng thực đơn đang được thay thế trên tường.',
                    question: 'Look at the picture and choose the statement that best describes what you see:',
                    options: [
                        { key: 'A', text: '(A) A server is wiping down a wooden counter.' },
                        { key: 'B', text: '(B) He is pouring coffee into a customer\'s mug.' },
                        { key: 'C', text: '(C) Chairs are stacked on top of the dining tables.' },
                        { key: 'D', text: '(D) A menu board is being replaced on the wall.' }
                    ],
                    correct: 'A',
                    explanation: 'Nhân viên quầy cà phê (phía sau bên trái) đang cúi người dùng khăn lau sạch bề mặt quầy pha chế bằng gỗ ("wiping down a wooden counter"). Người nam phía trước đang thao tác máy POS. (B) sai vì không rót cà phê. (C) sai vì bàn ghế không xếp chồng. (D) sai vì không thay bảng thực đơn.',
                    vocab: [
                        { word: 'wipe down', ipa: '/waɪp daʊn/', meaning: 'lau sạch bề mặt' },
                        { word: 'wooden counter', ipa: '/ˈwʊd.ən ˈkaʊn.tər/', meaning: 'quầy gỗ' }
                    ]
                },

                {
                    id: 'diag_p2_q05',
                    part: 2,
                    partName: 'Part 2: Question - Response (Hỏi & Đáp)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Jenny (US)',
                    audioScript: 'Where can I find the quarterly financial performance report? (A) Yes, at 3:00 PM yesterday. (B) Ms. Davis in accounting handles all of those documents. (C) It was a very quarterly meeting.',
                    transcript: 'Where can I find the quarterly financial performance report?\n(A) Yes, at 3:00 PM yesterday.\n(B) Ms. Davis in accounting handles all of those documents.\n(C) It was a very quarterly meeting.',
                    transcriptVi: 'Tôi có thể tìm thấy bản báo cáo kết quả tài chính quý ở đâu?\n(A) Vâng, lúc 3 giờ chiều hôm qua.\n(B) Cô Davis bên phòng kế toán phụ trách tất cả những tài liệu đó.\n(C) Đó là một cuộc họp rất hàng quý.',
                    question: 'Where can I find the quarterly financial performance report?',
                    options: [
                        { key: 'A', text: '(A) Yes, at 3:00 PM yesterday.' },
                        { key: 'B', text: '(B) Ms. Davis in accounting handles all of those documents.' },
                        { key: 'C', text: '(C) It was a very quarterly meeting.' }
                    ],
                    correct: 'B',
                    explanation: 'Bẫy trả lời gián tiếp Part 2 ETS: Câu hỏi "Where" nhưng người đáp không đưa ra vị trí cụ thể (trên bàn, trong ngăn kéo) mà chỉ sang người chịu trách nhiệm ("Ms. Davis handles..."). (A) sai vì câu hỏi Wh- không trả lời Yes/No. (C) là bẫy lặp từ (quarterly).',
                    vocab: [
                        { word: 'financial performance', ipa: '/faɪˈnænʃəl pəˈfɔːməns/', meaning: 'kết quả tài chính' },
                        { word: 'handle', ipa: '/ˈhændl/', meaning: 'xử lý, phụ trách' }
                    ]
                },
                {
                    id: 'diag_p2_q06',
                    part: 2,
                    partName: 'Part 2: Question - Response (Hỏi & Đáp)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-GB',
                    speaker: 'Oliver (UK)',
                    audioScript: 'Has the new printer been delivered yet? (A) I haven\'t seen the delivery truck outside. (B) No, he printed twenty color copies. (C) The blueprint looks quite impressive.',
                    transcript: 'Has the new printer been delivered yet?\n(A) I haven\'t seen the delivery truck outside.\n(B) No, he printed twenty color copies.\n(C) The blueprint looks quite impressive.',
                    transcriptVi: 'Máy in mới đã được giao đến chưa?\n(A) Tôi vẫn chưa thấy xe tải giao hàng ở bên ngoài.\n(B) Không, anh ấy đã in 20 bản sao màu.\n(C) Bản vẽ thiết kế trông rất ấn tượng.',
                    question: 'Has the new printer been delivered yet?',
                    options: [
                        { key: 'A', text: '(A) I haven\'t seen the delivery truck outside.' },
                        { key: 'B', text: '(B) No, he printed twenty color copies.' },
                        { key: 'C', text: '(C) The blueprint looks quite impressive.' }
                    ],
                    correct: 'A',
                    explanation: 'Bẫy âm thanh tương tự: Thí sinh nghe từ "printer" dễ bị lừa chọn "printed" (B) hoặc "blueprint" (C). Đáp án (A) trả lời gián tiếp hợp lý: "Tôi chưa thấy xe giao hàng bên ngoài" (ngụ ý là máy in chưa tới).',
                    vocab: [
                        { word: 'deliver', ipa: '/dɪˈlɪv.ər/', meaning: 'giao hàng' },
                        { word: 'delivery truck', ipa: '/dɪˈlɪv.ər.i trʌk/', meaning: 'xe tải giao hàng' }
                    ]
                },
                {
                    id: 'diag_p2_q07',
                    part: 2,
                    partName: 'Part 2: Question - Response (Hỏi & Đáp)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Jenny (US)',
                    audioScript: 'Are you attending the international trade seminar tomorrow? (A) In the main auditorium on the fourth floor. (B) Isn\'t it postponed until next Wednesday? (C) Yes, I traded my old laptop yesterday.',
                    transcript: 'Are you attending the international trade seminar tomorrow?\n(A) In the main auditorium on the fourth floor.\n(B) Isn\'t it postponed until next Wednesday?\n(C) Yes, I traded my old laptop yesterday.',
                    transcriptVi: 'Bạn có tham dự hội thảo thương mại quốc tế vào ngày mai không?\n(A) Ở hội trường chính trên tầng bốn.\n(B) Không phải nó đã bị hoãn sang thứ Tư tuần sau rồi sao?\n(C) Vâng, tôi đã đổi chiếc máy tính xách tay cũ của mình vào hôm qua.',
                    question: 'Are you attending the international trade seminar tomorrow?',
                    options: [
                        { key: 'A', text: '(A) In the main auditorium on the fourth floor.' },
                        { key: 'B', text: '(B) Isn\'t it postponed until next Wednesday?' },
                        { key: 'C', text: '(C) Yes, I traded my old laptop yesterday.' }
                    ],
                    correct: 'B',
                    explanation: 'Bẫy hỏi ngược lại (Counter-question): Trong đề thi ETS, người trả lời thường phản hồi bằng một câu hỏi khác để thông báo sự kiện bị hoãn ("Isn\'t it postponed...?"). (C) là bẫy lặp từ "trade/traded".',
                    vocab: [
                        { word: 'attend', ipa: '/əˈtend/', meaning: 'tham dự' },
                        { word: 'postpone', ipa: '/pəʊstˈpəʊn/', meaning: 'hoãn lại' }
                    ]
                },
                {
                    id: 'diag_p2_q08',
                    part: 2,
                    partName: 'Part 2: Question - Response (Hỏi & Đáp)',
                    pillarId: 'gap-part12-listening',
                    pillarName: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                    type: 'listening',
                    accent: 'en-CA',
                    speaker: 'Emily (CA)',
                    audioScript: 'Would you like to review the draft proposal before the client meeting? (A) I have to leave for the airport in ten minutes. (B) Yes, the meeting was very productive. (C) Mr. Henderson proposed a budget increase.',
                    transcript: 'Would you like to review the draft proposal before the client meeting?\n(A) I have to leave for the airport in ten minutes.\n(B) Yes, the meeting was very productive.\n(C) Mr. Henderson proposed a budget increase.',
                    transcriptVi: 'Bạn có muốn xem lại bản đề xuất nháp trước cuộc họp với khách hàng không?\n(A) Tôi phải ra sân bay trong vòng mười phút nữa.\n(B) Vâng, cuộc họp diễn ra rất hiệu quả.\n(C) Ông Henderson đã đề xuất tăng ngân sách.',
                    question: 'Would you like to review the draft proposal before the client meeting?',
                    options: [
                        { key: 'A', text: '(A) I have to leave for the airport in ten minutes.' },
                        { key: 'B', text: '(B) Yes, the meeting was very productive.' },
                        { key: 'C', text: '(C) Mr. Henderson proposed a budget increase.' }
                    ],
                    correct: 'A',
                    explanation: 'Từ chối gián tiếp: Câu hỏi mời mọc "Would you like to review...?". Thay vì trả lời "No, I can\'t", người nói nêu lý do bận việc gấp: "Tôi phải ra sân bay trong 10 phút nữa" (A). (B) sai thì vì cuộc họp chưa diễn ra. (C) là bẫy từ đồng âm proposal/proposed.',
                    vocab: [
                        { word: 'draft proposal', ipa: '/drɑːft prəˈpəʊzəl/', meaning: 'bản đề xuất sơ bộ/nháp' },
                        { word: 'productive', ipa: '/prəˈdʌktɪv/', meaning: 'hiệu quả, năng suất' }
                    ]
                },

                // =================================================================
                // PART 3: CONVERSATIONS (Listening · Q9 - Q12)
                // =================================================================
                {
                    id: 'diag_p3_q09',
                    part: 3,
                    partName: 'Part 3: Conversations (Hội thoại)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Alex (US) & Maria (US)',
                    conversationGroup: 'set1',
                    audioScript: 'Man: Hello, Ms. Chen. I am calling from Pacific Logistics regarding your purchase order for ten ergonomic office chairs. We encountered an unexpected customs clearance delay at the shipping port.\nWoman: Oh no, that is unfortunate! Our new software engineering team starts this Friday, and we need those desks and chairs ready.\nMan: What we can do is immediately dispatch six units from our local distribution center tomorrow morning, and deliver the remaining four by Thursday afternoon.\nWoman: That would be a huge relief! Please email me the revised tracking number as soon as the dispatch begins.',
                    transcript: 'M: Hello, Ms. Chen. I am calling from Pacific Logistics regarding your purchase order for ten ergonomic office chairs. We encountered an unexpected customs clearance delay at the shipping port.\nW: Oh no, that is unfortunate! Our new software engineering team starts this Friday, and we need those desks and chairs ready.\nM: What we can do is immediately dispatch six units from our local distribution center tomorrow morning, and deliver the remaining four by Thursday afternoon.\nW: That would be a huge relief! Please email me the revised tracking number as soon as the dispatch begins.',
                    transcriptVi: 'Nam: Xin chào cô Chen. Tôi gọi từ công ty Pacific Logistics liên quan đến đơn đặt hàng mười chiếc ghế văn phòng công thái học của cô. Chúng tôi gặp phải sự cố chậm trễ thông quan ngoài dự kiến tại cảng vận chuyển.\nNữ: Ôi không, thật không may! Nhóm kỹ sư phần mềm mới của chúng tôi bắt đầu làm việc vào thứ Sáu tuần này, và chúng tôi cần những bộ bàn ghế đó sẵn sàng.\nNam: Những gì chúng tôi có thể làm là điều phối ngay lập tức sáu chiếc từ trung tâm phân phối địa phương vào sáng mai, và giao bốn chiếc còn lại trước chiều thứ Năm.\nNữ: Như vậy thì nhẹ nhõm quá! Vui lòng gửi email cho tôi mã vận đơn đã sửa đổi ngay khi việc gửi hàng bắt đầu.',
                    question: 'Why is the man calling the woman?',
                    options: [
                        { key: 'A', text: '(A) To negotiate a service contract' },
                        { key: 'B', text: '(B) To inform her of a shipment delay' },
                        { key: 'C', text: '(C) To request an invoice payment' },
                        { key: 'D', text: '(D) To reschedule a job interview' }
                    ],
                    correct: 'B',
                    explanation: 'Bắt keywords & Paraphrase: Người đàn ông nói: "We encountered an unexpected customs clearance delay at the shipping port" -> Paraphrase thành "To inform her of a shipment delay" (B).',
                    vocab: [
                        { word: 'customs clearance', ipa: '/ˈkʌstəmz ˈklɪərəns/', meaning: 'thông quan hải quan' },
                        { word: 'dispatch', ipa: '/dɪˈspætʃ/', meaning: 'gửi đi, điều phối hàng' }
                    ]
                },
                {
                    id: 'diag_p3_q10',
                    part: 3,
                    partName: 'Part 3: Conversations (Hội thoại)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'Alex (US) & Maria (US)',
                    conversationGroup: 'set1',
                    audioScript: 'Man: Hello, Ms. Chen. I am calling from Pacific Logistics regarding your purchase order for ten ergonomic office chairs. We encountered an unexpected customs clearance delay at the shipping port.\nWoman: Oh no, that is unfortunate! Our new software engineering team starts this Friday, and we need those desks and chairs ready.\nMan: What we can do is immediately dispatch six units from our local distribution center tomorrow morning, and deliver the remaining four by Thursday afternoon.\nWoman: That would be a huge relief! Please email me the revised tracking number as soon as the dispatch begins.',
                    transcript: 'M: Hello, Ms. Chen. I am calling from Pacific Logistics regarding your purchase order for ten ergonomic office chairs...\nW: Oh no, that is unfortunate! Our new team starts this Friday...\nM: What we can do is immediately dispatch six units from our local distribution center tomorrow morning, and deliver the remaining four by Thursday afternoon.\nW: That would be a huge relief! Please email me the revised tracking number as soon as the dispatch begins.',
                    question: 'What solution does the man propose?',
                    options: [
                        { key: 'A', text: '(A) Canceling the existing order completely' },
                        { key: 'B', text: '(B) Sending available items from a nearby facility in batches' },
                        { key: 'C', text: '(C) Giving a fifty percent promotional voucher' },
                        { key: 'D', text: '(D) Replacing the chairs with cheaper models' }
                    ],
                    correct: 'B',
                    explanation: 'Paraphrase giải pháp: Người đàn ông đề xuất gửi 6 chiếc từ kho địa phương vào ngày mai và 4 chiếc còn lại vào thứ Năm -> Tương đương với "Sending available items from a nearby facility in batches" (B).',
                    vocab: [
                        { word: 'distribution center', ipa: '/ˌdɪstrɪˈbjuːʃən ˈsentər/', meaning: 'trung tâm phân phối' },
                        { word: 'in batches', ipa: '/ɪn ˈbætʃɪz/', meaning: 'thành từng đợt' }
                    ]
                },
                {
                    id: 'diag_p3_q11',
                    part: 3,
                    partName: 'Part 3: Conversations (Hội thoại)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-GB',
                    speaker: 'Daniel (UK) & Sarah (UK)',
                    conversationGroup: 'set2',
                    audioScript: 'Woman: Mark, have you heard back from the building management about leasing extra office space on the second floor?\nMan: Actually, they already signed a long-term lease agreement with an architectural firm yesterday.\nWoman: Oh no, what a headache! We only have two vacant desks left in our department, and four new recruits are arriving next month.\nMan: Well, the executive board just approved our flexible hybrid work policy yesterday.\nWoman: Ah, of course! That means employees only need to be in the office two days a week, so hot-desking will completely solve our space issue.',
                    transcript: 'W: Mark, have you heard back from the building management about leasing extra office space on the second floor?\nM: Actually, they already signed a long-term lease agreement with an architectural firm yesterday.\nW: Oh no, what a headache! We only have two vacant desks left in our department, and four new recruits are arriving next month.\nM: Well, the executive board just approved our flexible hybrid work policy yesterday.\nW: Ah, of course! That means employees only need to be in the office two days a week, so hot-desking will completely solve our space issue.',
                    transcriptVi: 'Nữ: Mark, anh đã nhận được phản hồi từ ban quản lý tòa nhà về việc thuê thêm không gian văn phòng ở tầng hai chưa?\nNam: Thật ra, họ đã ký hợp đồng thuê dài hạn với một công ty kiến trúc vào hôm qua rồi.\nNữ: Ôi không, thật đau đầu! Phòng ban của chúng ta chỉ còn lại hai chiếc bàn trống, trong khi bốn nhân viên mới sẽ đến vào tháng tới.\nNam: À, ban điều hành vừa phê duyệt chính sách làm việc linh hoạt kết hợp vào ngày hôm qua đấy.\nNữ: À đúng rồi! Điều đó có nghĩa là nhân viên chỉ cần có mặt tại văn phòng hai ngày một tuần, vì vậy việc dùng chung bàn làm việc sẽ giải quyết hoàn toàn vấn đề không gian của chúng ta.',
                    question: 'What problem are the speakers discussing?',
                    options: [
                        { key: 'A', text: '(A) A computer network outage' },
                        { key: 'B', text: '(B) A shortage of available office workstations' },
                        { key: 'C', text: '(C) Budget cuts in the recruitment department' },
                        { key: 'D', text: '(D) Disagreements with an architectural contractor' }
                    ],
                    correct: 'B',
                    explanation: 'Xác định vấn đề (Problem identification): Người phụ nữ nói "We only have two vacant desks left in our department, and four new recruits are arriving" -> Thiếu bàn làm việc cho nhân viên mới: "A shortage of available office workstations" (B).',
                    vocab: [
                        { word: 'vacant', ipa: '/ˈveɪ.kənt/', meaning: 'trống, chưa có người sử dụng' },
                        { word: 'shortage', ipa: '/ˈʃɔː.tɪdʒ/', meaning: 'sự thiếu hụt' }
                    ]
                },
                {
                    id: 'diag_p3_q12',
                    part: 3,
                    partName: 'Part 3: Conversations (Hội thoại)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-GB',
                    speaker: 'Daniel (UK) & Sarah (UK)',
                    conversationGroup: 'set2',
                    audioScript: 'Woman: Mark, have you heard back from the building management about leasing extra office space on the second floor?\nMan: Actually, they already signed a long-term lease agreement with an architectural firm yesterday.\nWoman: Oh no, what a headache! We only have two vacant desks left in our department, and four new recruits are arriving next month.\nMan: Well, the executive board just approved our flexible hybrid work policy yesterday.\nWoman: Ah, of course! That means employees only need to be in the office two days a week, so hot-desking will completely solve our space issue.',
                    transcript: 'W: We only have two vacant desks left in our department, and four new recruits are arriving next month.\nM: Well, the executive board just approved our flexible hybrid work policy yesterday.\nW: Ah, of course! That means employees only need to be in the office two days a week...',
                    question: 'What does the man imply when he says: "Well, the executive board just approved our flexible hybrid work policy yesterday"?',
                    options: [
                        { key: 'A', text: '(A) Staff salaries will be significantly increased' },
                        { key: 'B', text: '(B) The lack of physical desk space can be accommodated' },
                        { key: 'C', text: '(C) All employees must relocate to a different branch' },
                        { key: 'D', text: '(D) The company will terminate the new recruits\' contracts' }
                    ],
                    correct: 'B',
                    explanation: 'Bẫy câu hỏi ngụ ý (Implied Meaning): Khi người phụ nữ than phiền thiếu bàn làm việc, người đàn ông nhắc việc công ty duyệt chính sách "hybrid work" (làm việc tại nhà luân phiên) ngụ ý rằng nhân viên không cần phải đến văn phòng cùng lúc, do đó việc thiếu chỗ ngồi hoàn toàn có thể khắc phục được (B).',
                    vocab: [
                        { word: 'hybrid work', ipa: '/ˈhaɪ.brɪd wɜːk/', meaning: 'chế độ làm việc kết hợp văn phòng và tại nhà' },
                        { word: 'accommodate', ipa: '/əˈkɒm.ə.deɪt/', meaning: 'đáp ứng, xử lý ổn thỏa' }
                    ]
                },

                // =================================================================
                // PART 4: SHORT TALKS (Listening · Q13 - Q16)
                // =================================================================
                {
                    id: 'diag_p4_q13',
                    part: 4,
                    partName: 'Part 4: Short Talks (Bài nói ngắn)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'David (US)',
                    shortTalkGroup: 'talk1',
                    audioScript: 'Attention passengers waiting in Terminal 3 for Oceanic Airlines Flight 482 bound for Chicago O\'Hare. Due to severe unpredicted thunderstorms developing across the Great Lakes region, air traffic control has placed a temporary ground hold on all westbound departures. Our departure has been rescheduled for approximately 5:45 PM instead of the original 4:15 PM slot. In the meantime, please present your boarding passes at Gate B12 to receive complimentary refreshment vouchers for use at any airport dining facility. We sincerely apologize for this inconvenience and thank you for your patience.',
                    transcript: 'Attention passengers waiting in Terminal 3 for Oceanic Airlines Flight 482 bound for Chicago O\'Hare. Due to severe unpredicted thunderstorms developing across the Great Lakes region, air traffic control has placed a temporary ground hold on all westbound departures. Our departure has been rescheduled for approximately 5:45 PM instead of the original 4:15 PM slot. In the meantime, please present your boarding passes at Gate B12 to receive complimentary refreshment vouchers for use at any airport dining facility. We sincerely apologize for this inconvenience and thank you for your patience.',
                    transcriptVi: 'Xin hành khách đang đợi tại Nhà ga số 3 cho chuyến bay 482 của hãng Oceanic Airlines đi Chicago O\'Hare chú ý. Do có dông bão nghiêm trọng bất ngờ xuất hiện trên khu vực Great Lakes, kiểm soát không lưu đã tạm thời đình chỉ mặt đất đối với tất cả các chuyến bay khởi hành về phía tây. Giờ khởi hành của chúng ta đã được dời lại vào khoảng 5:45 chiều thay vì 4:15 chiều như ban đầu. Trong thời gian này, vui lòng xuất trình thẻ lên máy bay của quý khách tại Cổng B12 để nhận phiếu đồ ăn nhẹ miễn phí sử dụng tại bất kỳ nhà hàng nào trong sân bay. Chúng tôi chân thành xin lỗi vì sự bất tiện này và cảm ơn sự kiên nhẫn của quý khách.',
                    question: 'What is the announcement mainly about?',
                    options: [
                        { key: 'A', text: '(A) A gate reassignment for incoming flights' },
                        { key: 'B', text: '(B) A flight departure delay caused by severe weather' },
                        { key: 'C', text: '(C) A promotional fare discount for domestic travelers' },
                        { key: 'D', text: '(D) An emergency baggage inspection procedure' }
                    ],
                    correct: 'B',
                    explanation: 'Xác định mục đích chính của bài nói: "Due to severe unpredicted thunderstorms... Our departure has been rescheduled" -> Báo hoãn chuyến bay do thời tiết xấu: "A flight departure delay caused by severe weather" (B).',
                    vocab: [
                        { word: 'ground hold', ipa: '/ɡraʊnd həʊld/', meaning: 'lệnh hoãn cất cánh trên mặt đất' },
                        { word: 'rescheduled', ipa: '/ˌriːˈʃedʒ.uːld/', meaning: 'được dời lại lịch' }
                    ]
                },
                {
                    id: 'diag_p4_q14',
                    part: 4,
                    partName: 'Part 4: Short Talks (Bài nói ngắn)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-US',
                    speaker: 'David (US)',
                    shortTalkGroup: 'talk1',
                    audioScript: 'Attention passengers waiting in Terminal 3 for Oceanic Airlines Flight 482 bound for Chicago O\'Hare. Due to severe unpredicted thunderstorms... In the meantime, please present your boarding passes at Gate B12 to receive complimentary refreshment vouchers for use at any airport dining facility. We sincerely apologize for this inconvenience and thank you for your patience.',
                    transcript: '...In the meantime, please present your boarding passes at Gate B12 to receive complimentary refreshment vouchers for use at any airport dining facility. We sincerely apologize for this inconvenience and thank you for your patience.',
                    question: 'What are passengers invited to collect at Gate B12?',
                    options: [
                        { key: 'A', text: '(A) Free food and beverage vouchers' },
                        { key: 'B', text: '(B) Upgraded business class tickets' },
                        { key: 'C', text: '(C) Cash refunds for flight insurance' },
                        { key: 'D', text: '(D) Overnight hotel reservation keys' }
                    ],
                    correct: 'A',
                    explanation: 'Paraphrasing chi tiết: "complimentary refreshment vouchers" = "Free food and beverage vouchers" (Phiếu ăn uống/đồ ăn nhẹ miễn phí) (A).',
                    vocab: [
                        { word: 'complimentary', ipa: '/ˌkɒm.plɪˈmen.tər.i/', meaning: 'miễn phí' },
                        { word: 'refreshment', ipa: '/rɪˈfreʃ.mənt/', meaning: 'món ăn nhẹ, thức uống' }
                    ]
                },
                {
                    id: 'diag_p4_q15',
                    part: 4,
                    partName: 'Part 4: Short Talks (Bài nói ngắn)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-AU',
                    speaker: 'Chloe (AU)',
                    shortTalkGroup: 'talk2',
                    audioScript: 'Good morning, everyone. Thank you for assembling on such short notice. I am delighted to announce that our recently revamped mobile banking app achieved over 80,000 downloads during its initial launch month. Nevertheless, feedback from our customer care hotline suggests that users are finding the two-factor authentication setup somewhat complicated and frustrating. To address this friction point, our UI experience team has created a brief ninety-second video walkthrough. Before our product rollout meeting at 2:00 PM, I would like everyone on the customer support team to watch this tutorial and submit your feedback via our intranet form.',
                    transcript: 'Good morning, everyone. Thank you for assembling on such short notice. I am delighted to announce that our recently revamped mobile banking app achieved over 80,000 downloads during its initial launch month. Nevertheless, feedback from our customer care hotline suggests that users are finding the two-factor authentication setup somewhat complicated and frustrating. To address this friction point, our UI experience team has created a brief ninety-second video walkthrough. Before our product rollout meeting at 2:00 PM, I would like everyone on the customer support team to watch this tutorial and submit your feedback via our intranet form.',
                    transcriptVi: 'Chào buổi sáng mọi người. Cảm ơn mọi người đã tập hợp gấp như vậy. Tôi rất vui mừng thông báo rằng ứng dụng ngân hàng di động mới được cải tiến của chúng ta đã đạt hơn 80.000 lượt tải xuống trong tháng đầu tiên ra mắt. Tuy nhiên, phản hồi từ đường dây nóng chăm sóc khách hàng cho thấy người dùng cảm thấy việc thiết lập xác thực hai yếu tố có phần phức tạp và khó khăn. Để giải quyết điểm nghẽn này, nhóm trải nghiệm giao diện người dùng của chúng ta đã tạo một video hướng dẫn ngắn 90 giây. Trước cuộc họp triển khai sản phẩm lúc 2:00 chiều, tôi muốn tất cả mọi người trong nhóm hỗ trợ khách hàng xem hướng dẫn này và gửi phản hồi của bạn qua biểu mẫu mạng nội bộ.',
                    question: 'According to the speaker, what problem have customers reported?',
                    options: [
                        { key: 'A', text: '(A) The mobile app frequently crashes on older phones' },
                        { key: 'B', text: '(B) The security authentication procedure is difficult to navigate' },
                        { key: 'C', text: '(C) Transaction fees are higher than advertised' },
                        { key: 'D', text: '(D) Customer support agents are unresponsive' }
                    ],
                    correct: 'B',
                    explanation: 'Bắt keyword & Paraphrase: "users are finding the two-factor authentication setup somewhat complicated" -> Tương đương với "The security authentication procedure is difficult to navigate" (Quy trình xác thực bảo mật gây khó khăn cho người dùng) (B).',
                    vocab: [
                        { word: 'revamped', ipa: '/ˌriːˈvæmpt/', meaning: 'được tân trang, cải tiến' },
                        { word: 'authentication', ipa: '/ɔːˌθen.tɪˈkeɪ.ʃən/', meaning: 'sự xác thực' }
                    ]
                },
                {
                    id: 'diag_p4_q16',
                    part: 4,
                    partName: 'Part 4: Short Talks (Bài nói ngắn)',
                    pillarId: 'gap-part34-paraphrase',
                    pillarName: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
                    type: 'listening',
                    accent: 'en-AU',
                    speaker: 'Chloe (AU)',
                    shortTalkGroup: 'talk2',
                    audioScript: 'Good morning, everyone... To address this friction point, our UI experience team has created a brief ninety-second video walkthrough. Before our product rollout meeting at 2:00 PM, I would like everyone on the customer support team to watch this tutorial and submit your feedback via our intranet form.',
                    transcript: '...Before our product rollout meeting at 2:00 PM, I would like everyone on the customer support team to watch this tutorial and submit your feedback via our intranet form.',
                    question: 'What are the listeners instructed to do before 2:00 PM?',
                    options: [
                        { key: 'A', text: '(A) View a short instructional video and provide opinions' },
                        { key: 'B', text: '(B) Conduct direct telephone surveys with eighty clients' },
                        { key: 'C', text: '(C) Install an anti-virus security update' },
                        { key: 'D', text: '(D) Prepare a slide presentation for executive directors' }
                    ],
                    correct: 'A',
                    explanation: 'Hành động người nghe cần làm (Action required): "watch this tutorial and submit your feedback" -> Paraphrase thành "View a short instructional video and provide opinions" (A).',
                    vocab: [
                        { word: 'walkthrough / tutorial', ipa: '/ˈtʃuː.tɔː.ri.əl/', meaning: 'video hướng dẫn từng bước' },
                        { word: 'rollout', ipa: '/ˈrəʊl.aʊt/', meaning: 'sự ra mắt, triển khai' }
                    ]
                },

                // =================================================================
                // PART 5: INCOMPLETE SENTENCES (Reading · Q17 - Q20)
                // =================================================================
                {
                    id: 'diag_p5_q17',
                    part: 5,
                    partName: 'Part 5: Incomplete Sentences (Điền từ)',
                    pillarId: 'gap-part5-grammar',
                    pillarName: 'Part 5: Ngữ pháp cốt lõi (Từ loại, Mệnh đề quan hệ, Giả định)',
                    type: 'reading',
                    context: '📝 Ngữ pháp Part 5: Bẫy Danh từ đuôi -ive & -al',
                    question: 'A qualified customer service _______ from our regional branch will assist you with the on-site installation tomorrow.',
                    options: [
                        { key: 'A', text: '(A) represent' },
                        { key: 'B', text: '(B) representative' },
                        { key: 'C', text: '(C) representing' },
                        { key: 'D', text: '(D) represented' }
                    ],
                    correct: 'B',
                    explanation: 'Bẫy từ loại kinh điển ETS: Chỗ trống đứng sau cụm tính từ "A qualified customer service" và trước động từ "will assist". Vị trí này bắt buộc phải là một DANH TỪ ĐẾM ĐƯỢC CHỈ NGƯỜI làm chủ ngữ. "representative" có đuôi -ive tưởng chừng là tính từ nhưng lại là danh từ ("người đại diện"). (A) là động từ, (C) và (D) là dạng phân từ.',
                    vocab: [
                        { word: 'representative', ipa: '/ˌrep.rɪˈzen.tə.tɪv/', meaning: 'người đại diện (danh từ)' },
                        { word: 'qualified', ipa: '/ˈkwɒl.ɪ.faɪd/', meaning: 'đủ điều kiện, có năng lực' }
                    ]
                },
                {
                    id: 'diag_p5_q18',
                    part: 5,
                    partName: 'Part 5: Incomplete Sentences (Điền từ)',
                    pillarId: 'gap-part5-grammar',
                    pillarName: 'Part 5: Ngữ pháp cốt lõi (Từ loại, Mệnh đề quan hệ, Giả định)',
                    type: 'reading',
                    context: '📝 Ngữ pháp Part 5: Bẫy Rút gọn Mệnh đề Quan hệ (V-ing vs V-ed)',
                    question: 'Passengers _______ flights to Tokyo are requested to proceed immediately to Gate 18 for security boarding.',
                    options: [
                        { key: 'A', text: '(A) board' },
                        { key: 'B', text: '(B) boarding' },
                        { key: 'C', text: '(C) boarded' },
                        { key: 'D', text: '(D) are boarding' }
                    ],
                    correct: 'B',
                    explanation: 'Rút gọn mệnh đề quan hệ: Câu đã có động từ chính chia thì là "are requested". Do đó động từ bổ nghĩa cho "Passengers" phải ở dạng rút gọn: "Passengers [who are boarding flights...]". Vì hành khách chủ động thực hiện hành động lên máy bay (có tân ngữ "flights to Tokyo"), ta rút gọn thành V-ing ("boarding"). (D) sai vì một câu đơn không thể có 2 cụm động từ chia thì mà không có liên từ.',
                    vocab: [
                        { word: 'proceed to', ipa: '/prəˈsiːd tuː/', meaning: 'tiến về phía, di chuyển tới' },
                        { word: 'boarding', ipa: '/ˈbɔː.dɪŋ/', meaning: 'lên tàu bay, lên xe' }
                    ]
                },
                {
                    id: 'diag_p5_q19',
                    part: 5,
                    partName: 'Part 5: Incomplete Sentences (Điền từ)',
                    pillarId: 'gap-part5-grammar',
                    pillarName: 'Part 5: Ngữ pháp cốt lõi (Từ loại, Mệnh đề quan hệ, Giả định)',
                    type: 'reading',
                    context: '📝 Ngữ pháp Part 5: Bẫy Thể Giả định (Subjunctive Mood)',
                    question: 'The executive committee strongly recommends that each team leader _______ a safety compliance audit before Friday afternoon.',
                    options: [
                        { key: 'A', text: '(A) conducts' },
                        { key: 'B', text: '(B) conduct' },
                        { key: 'C', text: '(C) conducted' },
                        { key: 'D', text: '(D) will conduct' }
                    ],
                    correct: 'B',
                    explanation: 'Thể giả định (Subjunctive Mood) trong đề thi TOEIC: Sau các động từ chỉ yêu cầu, đề xuất (recommend, suggest, mandate, require, insist) + that + S + (should) + V-nguyên mẫu không chia "s/es", bất kể chủ ngữ là số ít hay số nhiều! Do đó, mặc dù chủ ngữ là "each team leader" (ngôi thứ 3 số ít), động từ vẫn bắt buộc là "conduct" (B), không dùng "conducts".',
                    vocab: [
                        { word: 'compliance audit', ipa: '/kəmˈplaɪ.əns ˈɔː.dɪt/', meaning: 'kiểm toán tuân thủ quy định' },
                        { word: 'mandate', ipa: '/ˈmæn.deɪt/', meaning: 'bắt buộc, ban lệnh' }
                    ]
                },
                {
                    id: 'diag_p5_q20',
                    part: 5,
                    partName: 'Part 5: Incomplete Sentences (Điền từ)',
                    pillarId: 'gap-part5-vocab',
                    pillarName: 'Part 5: Từ vựng & Collocations Công sở Doanh nghiệp',
                    type: 'reading',
                    context: '📝 Ngữ pháp & Từ vựng: Phân biệt Liên từ (+ Clause) vs Giới từ (+ Noun Phrase)',
                    question: '_______ unanticipated delays at customs, the essential raw materials were delivered to the assembly plant ahead of schedule.',
                    options: [
                        { key: 'A', text: '(A) Although' },
                        { key: 'B', text: '(B) Even though' },
                        { key: 'C', text: '(C) Despite' },
                        { key: 'D', text: '(D) In order that' }
                    ],
                    correct: 'C',
                    explanation: 'Phía sau chỗ trống là cụm danh từ "unanticipated delays at customs" (sự chậm trễ ngoài dự kiến tại hải quan, KHÔNG có động từ chia thì). Do đó vị trí này bắt buộc phải dùng một GIỚI TỪ mang nghĩa mặc dù -> "Despite" (C). "Although" và "Even though" là liên từ chỉ đi với mệnh đề (S + V). "In order that" chỉ mục đích và cũng đi với mệnh đề.',
                    vocab: [
                        { word: 'unanticipated', ipa: '/ˌʌn.ænˈtɪs.ɪ.peɪ.tɪd/', meaning: 'bất ngờ, không lường trước' },
                        { word: 'assembly plant', ipa: '/əˈsem.bli plɑːnt/', meaning: 'nhà máy lắp ráp' }
                    ]
                },

                // =================================================================
                // PART 6: TEXT COMPLETION (Reading · Q21 - Q24)
                // =================================================================
                {
                    id: 'diag_p6_q21',
                    part: 6,
                    partName: 'Part 6: Text Completion (Điền đoạn văn)',
                    pillarId: 'gap-part6-insertion',
                    pillarName: 'Part 6: Điền câu theo mạch logic & Liên từ chuyển ý',
                    type: 'reading',
                    passageGroup: 'p6_set',
                    passageTitle: 'Horizon Fiber Internet · Welcome & Activation Notice',
                    passageContent: `Dear Valued Business Client,

Thank you for choosing Horizon Fiber Enterprise Solutions. Your dedicated gigabit fiber line has been successfully activated as of this morning. [ 21 ]. If you encounter any initial connectivity discrepancies, please reach out directly to our priority support line at 1-800-555-DATA.

Our certified network engineers are on standby around the clock to ensure [ 22 ] resolution of any technical concerns.

[ 23 ], your upcoming billing invoice will reflect an automatic 15% discount for the first quarter, as outlined in our corporate service agreement.

We look forward to [ 24 ] your enterprise and supporting your future digital transformation.

Sincerely,
The Horizon Fiber Team`,
                    passageVi: `Kính gửi Quý Khách hàng Doanh nghiệp,

Cảm ơn quý khách đã tin chọn Giải pháp Doanh nghiệp Horizon Fiber. Đường truyền cáp quang gigabit chuyên dụng của quý khách đã được kích hoạt thành công kể từ sáng nay. [ 21 ]. Nếu quý khách gặp phải bất kỳ sự cố kết nối ban đầu nào, vui lòng liên hệ trực tiếp với đường dây hỗ trợ ưu tiên của chúng tôi theo số 1-800-555-DATA.

Các kỹ sư mạng được cấp chứng chỉ của chúng tôi luôn túc trực 24/7 để đảm bảo việc xử lý [ 22 ] bất kỳ thắc mắc kỹ thuật nào.

[ 23 ], hóa đơn thanh toán sắp tới của quý khách sẽ tự động phản ánh mức giảm giá 15% cho quý đầu tiên, như đã nêu trong thỏa thuận dịch vụ doanh nghiệp của chúng tôi.

Chúng tôi rất mong được [ 24 ] doanh nghiệp của quý khách và đồng hành cùng sự chuyển đổi số trong tương lai của quý khách.

Trân trọng,
Đội ngũ Horizon Fiber`,
                    question: 'Chọn câu điền vào chỗ trống [ 21 ] phù hợp nhất với mạch logic của bức thư:',
                    options: [
                        { key: 'A', text: '(A) Your corporate subscription was unfortunately canceled due to overdue payment.' },
                        { key: 'B', text: '(B) You can now access your administrative portal using the credentials sent via SMS.' },
                        { key: 'C', text: '(C) Please ship all defective modem hardware back to our regional warehouse within 14 days.' },
                        { key: 'D', text: '(D) We regret to inform you that fiber coverage is currently unavailable in your postal district.' }
                    ],
                    correct: 'B',
                    explanation: 'Mạch logic văn bản Part 6: Đoạn trước vừa thông báo đường truyền cáp quang đã được kích hoạt thành công (has been successfully activated). Do đó câu nối tiếp hợp lý nhất là hướng dẫn khách hàng đăng nhập tài khoản portal quản trị (B). Các phương án A, C, D đều mâu thuẫn hoàn toàn với ngữ cảnh chào mừng kích hoạt dịch vụ.',
                    vocab: [
                        { word: 'credentials', ipa: '/krɪˈden.ʃəlz/', meaning: 'thông tin đăng nhập' },
                        { word: 'administrative portal', ipa: '/ədˈmɪn.ɪ.strə.tɪv ˈpɔː.təl/', meaning: 'cổng thông tin quản trị' }
                    ]
                },
                {
                    id: 'diag_p6_q22',
                    part: 6,
                    partName: 'Part 6: Text Completion (Điền đoạn văn)',
                    pillarId: 'gap-part6-insertion',
                    pillarName: 'Part 6: Điền câu theo mạch logic & Liên từ chuyển ý',
                    type: 'reading',
                    passageGroup: 'p6_set',
                    passageTitle: 'Horizon Fiber Internet · Welcome & Activation Notice',
                    passageContent: `...Our certified network engineers are on standby around the clock to ensure [ 22 ] resolution of any technical concerns...`,
                    question: 'Chọn từ loại thích hợp nhất điền vào chỗ trống [ 22 ]:',
                    options: [
                        { key: 'A', text: '(A) prompt' },
                        { key: 'B', text: '(B) promptly' },
                        { key: 'C', text: '(C) promptness' },
                        { key: 'D', text: '(D) prompting' }
                    ],
                    correct: 'A',
                    explanation: 'Cấu trúc cụm danh từ: "ensure [ 22 ] resolution". Trước danh từ "resolution" (sự giải quyết), ta cần một TÍNH TỪ để bổ nghĩa -> "prompt" (nhanh chóng, kịp thời). (B) là trạng từ, (C) là danh từ, (D) là V-ing.',
                    vocab: [
                        { word: 'prompt', ipa: '/prɒmpt/', meaning: 'nhanh chóng, kịp thời' },
                        { word: 'resolution', ipa: '/ˌrez.əˈluː.ʃən/', meaning: 'sự giải quyết dứt điểm' }
                    ]
                },
                {
                    id: 'diag_p6_q23',
                    part: 6,
                    partName: 'Part 6: Text Completion (Điền đoạn văn)',
                    pillarId: 'gap-part6-insertion',
                    pillarName: 'Part 6: Điền câu theo mạch logic & Liên từ chuyển ý',
                    type: 'reading',
                    passageGroup: 'p6_set',
                    passageTitle: 'Horizon Fiber Internet · Welcome & Activation Notice',
                    passageContent: `...[ 23 ], your upcoming billing invoice will reflect an automatic 15% discount for the first quarter, as outlined in our corporate service agreement...`,
                    question: 'Chọn liên từ chuyển ý phù hợp nhất điền vào chỗ trống [ 23 ]:',
                    options: [
                        { key: 'A', text: '(A) On the contrary' },
                        { key: 'B', text: '(B) In addition' },
                        { key: 'C', text: '(C) Otherwise' },
                        { key: 'D', text: '(D) Even though' }
                    ],
                    correct: 'B',
                    explanation: 'Liên từ bổ sung thông tin (Addition): Câu trước nói về hỗ trợ kỹ thuật 24/7, câu này bổ sung thêm quyền lợi về tài chính (giảm giá 15% hóa đơn). Do đó ta dùng liên từ "In addition" (Ngoài ra/Thêm vào đó) (B). "On the contrary" dùng đối lập, "Otherwise" dùng nếu không thì.',
                    vocab: [
                        { word: 'in addition', ipa: '/ɪn əˈdɪʃ.ən/', meaning: 'ngoài ra, thêm vào đó' },
                        { word: 'reflect', ipa: '/rɪˈflekt/', meaning: 'thể hiện, phản ánh' }
                    ]
                },
                {
                    id: 'diag_p6_q24',
                    part: 6,
                    partName: 'Part 6: Text Completion (Điền đoạn văn)',
                    pillarId: 'gap-part6-insertion',
                    pillarName: 'Part 6: Điền câu theo mạch logic & Liên từ chuyển ý',
                    type: 'reading',
                    passageGroup: 'p6_set',
                    passageTitle: 'Horizon Fiber Internet · Welcome & Activation Notice',
                    passageContent: `...We look forward to [ 24 ] your enterprise and supporting your future digital transformation...`,
                    question: 'Chọn dạng động từ đúng điền vào chỗ trống [ 24 ]:',
                    options: [
                        { key: 'A', text: '(A) serve' },
                        { key: 'B', text: '(B) served' },
                        { key: 'C', text: '(C) serving' },
                        { key: 'D', text: '(D) service' }
                    ],
                    correct: 'C',
                    explanation: 'Cấu trúc cố định Part 6: "look forward to + V-ing/Noun" (rất mong đợi điều gì). Trong cấu trúc này, "to" là một giới từ, do đó động từ đi sau bắt buộc phải ở dạng V-ing -> "serving" (C). Phía sau còn có cấu trúc song hành: "...and supporting".',
                    vocab: [
                        { word: 'look forward to', ipa: '/lʊk ˈfɔː.wəd tuː/', meaning: 'mong đợi, trông ngóng' },
                        { word: 'digital transformation', ipa: '/ˈdɪdʒɪtəl ˌtrænsfəˈmeɪʃən/', meaning: 'chuyển đổi số' }
                    ]
                },

                // =================================================================
                // PART 7: READING COMPREHENSION (Reading · Q25 - Q28)
                // =================================================================
                {
                    id: 'diag_p7_q25',
                    part: 7,
                    partName: 'Part 7: Reading Comprehension (Đọc hiểu)',
                    pillarId: 'gap-part7-multi',
                    pillarName: 'Part 7: Đọc hiểu văn bản đơn & Chuỗi 2-3 đoạn văn',
                    type: 'reading',
                    passageGroup: 'p7_single',
                    passageTitle: 'Apex Executive Seminars · Registration & Cancellation Policy',
                    passageContent: `NOTICE: CANCELLATION AND TUITION REFUND POLICY

To guarantee an optimal interactive learning environment, attendance at all Apex Executive Seminars is strictly limited to thirty registered executives per session. 

Full tuition refunds will be granted exclusively for cancellation requests submitted in writing at least 72 hours prior to the scheduled start time of the session. 

Cancellations received within 72 hours of the workshop are non-refundable in cash; however, registered participants will automatically receive an electronic voucher credit valid toward any upcoming Apex workshop held within the subsequent six months. 

To formally request an event credit or transfer your reservation to a corporate colleague, please contact our registrar desk at registrations@apexseminars.com with your original booking confirmation number.`,
                    passageVi: `THÔNG BÁO: CHÍNH SÁCH HỦY ĐĂNG KÝ VÀ HOÀN HỌC PHÍ

Để đảm bảo môi trường học tập tương tác tối ưu, số lượng người tham dự tại tất cả các Hội thảo Điều hành Apex được giới hạn nghiêm ngặt ở mức 30 nhà điều hành đã đăng ký cho mỗi phiên.

Việc hoàn trả 100% học phí sẽ được áp dụng riêng cho các yêu cầu hủy được gửi bằng văn bản ít nhất 72 giờ trước thời gian bắt đầu dự kiến của phiên học.

Các yêu cầu hủy nhận được trong vòng 72 giờ trước hội thảo sẽ không được hoàn lại bằng tiền mặt; tuy nhiên, những người tham gia đã đăng ký sẽ tự động nhận được một phiếu tín dụng điện tử có giá trị áp dụng cho bất kỳ hội thảo Apex sắp tới nào được tổ chức trong vòng sáu tháng tiếp theo.

Để chính thức yêu cầu tín dụng sự kiện hoặc chuyển nhượng đăng ký của bạn cho một đồng nghiệp trong công ty, vui lòng liên hệ với bàn đăng ký của chúng tôi tại registrations@apexseminars.com kèm theo mã xác nhận đặt chỗ ban đầu của bạn.`,
                    evidence: 'however, registered participants will automatically receive an electronic voucher credit valid toward any upcoming Apex workshop held within the subsequent six months.',
                    question: 'What is TRUE about cancellation requests submitted less than 72 hours before a workshop?',
                    options: [
                        { key: 'A', text: '(A) Registrants are entitled to an immediate full cash reimbursement.' },
                        { key: 'B', text: '(B) The registration fee is completely forfeited with no credit alternative.' },
                        { key: 'C', text: '(C) Attendees receive a voucher credit that remains valid for six months.' },
                        { key: 'D', text: '(D) The workshop committee automatically reschedules the attendee to the following week.' }
                    ],
                    correct: 'C',
                    explanation: 'Kỹ năng Scanning & Paraphrasing Part 7: Đoạn 3 nêu rõ: "Cancellations received within 72 hours... will automatically receive an electronic voucher credit valid toward any upcoming Apex workshop held within the subsequent six months." -> Tương đương với "Attendees receive a voucher credit that remains valid for six months" (C).',
                    vocab: [
                        { word: 'reimbursement', ipa: '/ˌriː.ɪmˈbɜːs.mənt/', meaning: 'sự hoàn tiền, bồi hoàn' },
                        { word: 'subsequent', ipa: '/ˈsʌb.sɪ.kwənt/', meaning: 'tiếp theo sau đó' }
                    ]
                },
                {
                    id: 'diag_p7_q26',
                    part: 7,
                    partName: 'Part 7: Reading Comprehension (Đọc hiểu)',
                    pillarId: 'gap-part7-multi',
                    pillarName: 'Part 7: Đọc hiểu văn bản đơn & Chuỗi 2-3 đoạn văn',
                    type: 'reading',
                    passageGroup: 'p7_single',
                    passageTitle: 'Apex Executive Seminars · Registration & Cancellation Policy',
                    passageContent: `...To formally request an event credit or transfer your reservation to a corporate colleague, please contact our registrar desk at registrations@apexseminars.com with your original booking confirmation number.`,
                    evidence: 'please contact our registrar desk at registrations@apexseminars.com with your original booking confirmation number.',
                    question: 'How should an attendee request a registration transfer or credit?',
                    options: [
                        { key: 'A', text: '(A) By sending an email with their confirmation code' },
                        { key: 'B', text: '(B) By visiting the downtown registrar office in person' },
                        { key: 'C', text: '(C) By calling the automated 24-hour telephone helpline' },
                        { key: 'D', text: '(D) By filling out an evaluation slip upon arrival at the workshop' }
                    ],
                    correct: 'A',
                    explanation: 'Scanning thông tin liên hệ: Đoạn cuối hướng dẫn "please contact our registrar desk at registrations@apexseminars.com with your original booking confirmation number" -> Gửi email kèm theo mã số xác nhận đặt chỗ: "By sending an email with their confirmation code" (A).',
                    vocab: [
                        { word: 'booking confirmation', ipa: '/ˈbʊk.ɪŋ ˌkɒn.fəˈmeɪ.ʃən/', meaning: 'xác nhận đặt phòng/chỗ' },
                        { word: 'transfer reservation', ipa: '/trænsˈfɜːr ˌrez.əˈveɪ.ʃən/', meaning: 'chuyển nhượng chỗ đăng ký' }
                    ]
                },
                {
                    id: 'diag_p7_q27',
                    part: 7,
                    partName: 'Part 7: Reading Comprehension (Đọc hiểu - Đoạn kép)',
                    pillarId: 'gap-part7-multi',
                    pillarName: 'Part 7: Đọc hiểu văn bản đơn & Chuỗi 2-3 đoạn văn',
                    type: 'reading',
                    passageGroup: 'p7_double',
                    passageTitle: 'Document 1: Summit Program · Document 2: Follow-up Email',
                    passageContent: `--- DOCUMENT 1: PACIFIC LEADERSHIP SUMMIT MORNING AGENDA ---
Grand Horizon Convention Center · Friday, October 24

08:30 AM - 09:15 AM: Registration & Continental Breakfast (Main Foyer)
09:15 AM - 10:30 AM: Keynote Address: Artificial Intelligence in Modern Enterprise
                     Speaker: Dr. Marcus Vance, Chief Data Strategist, Veridia AI
                     Location: Grand Ballroom (1st Floor)

10:45 AM - 12:00 PM: CONCURRENT BREAKOUT SESSIONS:
  • Session A: Agile Talent Optimization & Hybrid Workforce
    Presenter: Ms. Elena Rostova, Senior Partner, TalentSphere
    Location: Executive Room 204 (2nd Floor)

  • Session B: International Financial Compliance & Cross-Border Auditing
    Presenter: Mr. David Cho, Managing Director, Global FinCorp
    Location: Cedar Hall 208 (2nd Floor)

12:15 PM - 01:45 PM: Executive Networking Luncheon (Palm Court)

--- DOCUMENT 2: EMAIL CORRESPONDENCE ---
To: Dr. Marcus Vance <m.vance@veridia-ai.com>
From: Sarah Jenkins <s.jenkins@vanguardtech.com>
Date: Monday, October 27
Subject: Inquiries regarding Pacific Leadership Summit framework

Dear Dr. Vance,

Thank you for your thought-provoking opening presentation at Friday's Pacific Leadership Summit. Your insights on predictive workforce modeling were exceptionally compelling.

Because our human resources department is currently restructuring our remote hiring protocol, I chose to attend the session led by Ms. Rostova immediately following your talk. However, I noticed you co-authored a whitepaper on automated candidate screening.

Would you have 15 minutes available next week for a brief video consultation to discuss how our enterprise could implement similar automated frameworks?

Warm regards,
Sarah Jenkins
VP of Human Resources, Vanguard Tech`,
                    passageVi: `--- TÀI LIỆU 1: CHƯƠNG TRÌNH BUỔI SÁNG HỘI NGHỊ LÃNH ĐẠO THÁI BÌNH DƯƠNG ---
Trung tâm Hội nghị Grand Horizon · Thứ Sáu, ngày 24 tháng 10

08:30 - 09:15: Đăng ký & Ăn sáng nhẹ (Sảnh chính)
09:15 - 10:30: Bài phát biểu khai mạc: Trí tuệ nhân tạo trong Doanh nghiệp hiện đại
               Diễn giả: Tiến sĩ Marcus Vance, Giám đốc chiến lược dữ liệu, Veridia AI
               Địa điểm: Phòng Đại tiệc (Tầng 1)

10:45 - 12:00: CÁC PHIÊN THẢO LUẬN CHUYÊN ĐỀ ĐỒNG THỜI:
  • Phiên A: Tối ưu hóa nhân tài linh hoạt & Lực lượng lao động kết hợp
    Diễn giả: Bà Elena Rostova, Đối tác cấp cao, TalentSphere
    Địa điểm: Phòng Điều hành 204 (Tầng 2)

  • Phiên B: Tuân thủ tài chính quốc tế & Kiểm toán xuyên biên giới
    Diễn giả: Ông David Cho, Giám đốc điều hành, Global FinCorp
    Địa điểm: Hội trường Cedar 208 (Tầng 2)

12:15 - 13:45: Tiệc trưa kết nối điều hành (Palm Court)

--- TÀI LIỆU 2: THƯ ĐIỆN TỬ ---
Người nhận: Tiến sĩ Marcus Vance <m.vance@veridia-ai.com>
Người gửi: Sarah Jenkins <s.jenkins@vanguardtech.com>
Ngày: Thứ Hai, ngày 27 tháng 10
Tiêu đề: Tìm hiểu về khuôn khổ Hội nghị Lãnh đạo Thái Bình Dương

Kính gửi Tiến sĩ Vance,

Cảm ơn bài thuyết trình khai mạc đầy gợi mở của ông tại Hội nghị Lãnh đạo Thái Bình Dương hôm thứ Sáu. Những hiểu biết sâu sắc của ông về mô hình hóa lực lượng lao động dự đoán vô cùng thuyết phục.

Vì bộ phận nhân sự của chúng tôi hiện đang tái cấu trúc quy trình tuyển dụng từ xa, tôi đã chọn tham dự phiên thảo luận do bà Rostova chủ trì ngay sau bài phát biểu của ông. Tuy nhiên, tôi nhận thấy ông là đồng tác giả của một nghiên cứu chuyên sâu về sàng lọc ứng viên tự động.

Ông có thể dành khoảng 15 phút vào tuần tới cho một cuộc tư vấn video ngắn để thảo luận về cách doanh nghiệp của chúng tôi có thể triển khai các khuôn khổ tự động tương tự không?

Trân trọng,
Sarah Jenkins
Phó Chủ tịch Nhân sự, Vanguard Tech`,
                    evidence: 'Document 2: "I chose to attend the session led by Ms. Rostova immediately following your talk." + Document 1: "Session A: Ms. Elena Rostova -> Executive Room 204 (2nd Floor)"',
                    question: 'According to both documents, which room did Sarah Jenkins visit at 10:45 AM?',
                    options: [
                        { key: 'A', text: '(A) Grand Ballroom on the 1st Floor' },
                        { key: 'B', text: '(B) Executive Room 204 on the 2nd Floor' },
                        { key: 'C', text: '(C) Cedar Hall 208 on the 2nd Floor' },
                        { key: 'D', text: '(D) Palm Court Dining Area' }
                    ],
                    correct: 'B',
                    explanation: 'Bẫy liên kết 2 đoạn văn (Cross-referencing): Trong Email (Tài liệu 2), Sarah Jenkins viết cô đã tham dự phiên thảo luận của bà Rostova ("session led by Ms. Rostova immediately following your talk"). Tra cứu lịch trình Hội nghị (Tài liệu 1), phiên thảo luận của bà Elena Rostova diễn ra từ 10:45 AM tại "Executive Room 204 (2nd Floor)". Do đó Sarah Jenkins đã ở phòng 204 (B).',
                    vocab: [
                        { word: 'concurrent', ipa: '/kənˈkʌr.ənt/', meaning: 'diễn ra đồng thời' },
                        { word: 'breakout session', ipa: '/ˈbreɪk.aʊt ˈseʃ.ən/', meaning: 'phiên thảo luận chuyên đề nhỏ' }
                    ]
                },
                {
                    id: 'diag_p7_q28',
                    part: 7,
                    partName: 'Part 7: Reading Comprehension (Đọc hiểu - Đoạn kép)',
                    pillarId: 'gap-part7-multi',
                    pillarName: 'Part 7: Đọc hiểu văn bản đơn & Chuỗi 2-3 đoạn văn',
                    type: 'reading',
                    passageGroup: 'p7_double',
                    passageTitle: 'Document 1: Summit Program · Document 2: Follow-up Email',
                    passageContent: `...Would you have 15 minutes available next week for a brief video consultation to discuss how our enterprise could implement similar automated frameworks?

Warm regards,
Sarah Jenkins
VP of Human Resources, Vanguard Tech`,
                    evidence: 'Document 2: "Would you have 15 minutes available next week for a brief video consultation to discuss how our enterprise could implement similar automated frameworks?"',
                    question: 'What is the primary purpose of Sarah Jenkins\'s email to Dr. Vance?',
                    options: [
                        { key: 'A', text: '(A) To express dissatisfaction with the conference facility acoustics' },
                        { key: 'B', text: '(B) To commend his presentation and request a brief follow-up consultation' },
                        { key: 'C', text: '(C) To invite him to become a full-time board member at Vanguard Tech' },
                        { key: 'D', text: '(D) To request a reimbursement for the executive luncheon fee' }
                    ],
                    correct: 'B',
                    explanation: 'Xác định mục đích chính của thư: Sarah khen ngợi bài phát biểu của Tiến sĩ Vance ("Thank you for your thought-provoking presentation...") và đề xuất một cuộc họp tư vấn trực tuyến 15 phút vào tuần sau ("Would you have 15 minutes available next week for a brief video consultation..."). Đáp án chính xác là (B).',
                    vocab: [
                        { word: 'thought-provoking', ipa: '/ˈθɔːt.prəˌvəʊ.kɪŋ/', meaning: 'gợi nhiều suy ngẫm' },
                        { word: 'consultation', ipa: '/ˌkɒn.sʌlˈteɪ.ʃən/', meaning: 'buổi tư vấn chuyên môn' }
                    ]
                }
            ];
        }

        // =========================================================================
        // OPEN & INITIALIZE WORKSTATION
        // =========================================================================
        open() {
            this.ensureModalContainer();
            this.isOpen = true;
            this.currentIndex = 0;
            this.userAnswers = {};
            this.flagged = {};
            this.timeRemaining = 25 * 60; // 25:00
            this.startTimer();

            this.renderWorkstationUI();
            this.showQuestion(0);
        }

        close() {
            if (Object.keys(this.userAnswers).length > 0 && Object.keys(this.userAnswers).length < 28) {
                const confirmExit = confirm('Bạn đang làm dở bài Test Chẩn Đoán Đầu Vào (đã làm ' + Object.keys(this.userAnswers).length + '/28 câu). Bạn có chắc chắn muốn thoát không? (Kết quả chưa nộp sẽ không được lưu)');
                if (!confirmExit) return;
            }
            this.stopTimer();
            this.stopAudio();
            this.isOpen = false;
            const modal = document.getElementById('toeicDiagnosticWorkstation');
            if (modal) modal.classList.add('hidden');
        }

        ensureModalContainer() {
            let modal = document.getElementById('toeicDiagnosticWorkstation');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'toeicDiagnosticWorkstation';
                modal.className = 'fixed inset-0 z-50 bg-[#f8fafc] dark:bg-slate-950 flex flex-col font-sans overflow-hidden';
                document.body.appendChild(modal);
            }
            modal.classList.remove('hidden');
        }

        // =========================================================================
        // TIMER LOGIC (25 PHÚT ĐẾM NGƯỢC)
        // =========================================================================
        startTimer() {
            this.stopTimer();
            this.isTimerRunning = true;
            this.timerInterval = setInterval(() => {
                if (this.timeRemaining <= 0) {
                    this.stopTimer();
                    alert('⏰ Hết giờ làm bài! Hệ thống đang tự động nộp bài và phân tích chẩn đoán năng lực của bạn.');
                    this.submitTest(true);
                    return;
                }
                this.timeRemaining--;
                this.updateTimerDisplay();
            }, 1000);
            this.updateTimerDisplay();
        }

        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            this.isTimerRunning = false;
        }

        updateTimerDisplay() {
            const timerEl = document.getElementById('tdwTimer');
            if (!timerEl) return;
            const mins = Math.floor(this.timeRemaining / 60);
            const secs = this.timeRemaining % 60;
            const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            timerEl.textContent = formatted;

            if (this.timeRemaining < 180) { // Dưới 3 phút đổi sang màu đỏ cảnh báo
                timerEl.className = 'text-rose-600 dark:text-rose-400 font-black text-sm tracking-widest animate-pulse';
            } else {
                timerEl.className = 'text-indigo-600 dark:text-indigo-400 font-black text-sm tracking-widest';
            }
        }

        // =========================================================================
        // AUDIO PLAYER ENGINE CHO LISTENING (PART 1 - 4)
        // =========================================================================
        playAudio(scriptText) {
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
            const ttsUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
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

        toggleAudio() {
            if (this.isPlayingAudio) {
                this.stopAudio();
            } else {
                const q = this.questions[this.currentIndex];
                if (q.audioScript) {
                    this.playAudio(q.audioScript);
                }
            }
        }

        setSpeed(rate) {
            this.audioSpeed = rate;
            const spdEl = document.getElementById('tdwSpeedLabel');
            if (spdEl) spdEl.textContent = `${rate}x`;
            if (this.isPlayingAudio) {
                this.playAudio();
            }
        }

        toggleLoop() {
            this.isLooping = !this.isLooping;
            const loopBtn = document.getElementById('tdwLoopBtn');
            if (loopBtn) {
                if (this.isLooping) {
                    loopBtn.classList.add('bg-indigo-600', 'text-white');
                    loopBtn.classList.remove('text-slate-600', 'dark:text-slate-300');
                } else {
                    loopBtn.classList.remove('bg-indigo-600', 'text-white');
                    loopBtn.classList.add('text-slate-600', 'dark:text-slate-300');
                }
            }
        }

        updateAudioControlsUI() {
            const playIcon = document.getElementById('tdwPlayIcon');
            const playBtn = document.getElementById('tdwPlayBtn');
            const waveAnim = document.getElementById('tdwWaveAnim');
            if (playIcon) {
                playIcon.className = this.isPlayingAudio ? 'fa-solid fa-pause text-sm' : 'fa-solid fa-play text-sm ml-0.5';
            }
            if (playBtn) {
                if (this.isPlayingAudio) {
                    playBtn.classList.add('ring-4', 'ring-indigo-300/60');
                } else {
                    playBtn.classList.remove('ring-4', 'ring-indigo-300/60');
                }
            }
            if (waveAnim) {
                if (this.isPlayingAudio) {
                    waveAnim.classList.remove('opacity-30');
                    waveAnim.classList.add('opacity-100');
                } else {
                    waveAnim.classList.remove('opacity-100');
                    waveAnim.classList.add('opacity-30');
                }
            }
        }

        // =========================================================================
        // RENDER WORKSTATION MAIN LAYOUT (Header, Split-Pane, Bottom Bar)
        // =========================================================================
        renderWorkstationUI() {
            const modal = document.getElementById('toeicDiagnosticWorkstation');
            if (!modal) return;

            modal.innerHTML = `
                <!-- TOP HEADER BAR (Đồng bộ chuẩn Workstation ETS 2026) -->
                <header class="h-14 sm:h-16 px-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 select-none shadow-xs z-30">
                    <!-- Left: Back Button & Title -->
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="ToeicDiagnosticWorkstation.close()" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer" title="Thoát bài test">
                            <i class="fa-solid fa-arrow-left text-xs"></i>
                        </button>
                        <div class="leading-tight">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                                    🚀 TEST ĐẦU VÀO ETS
                                </span>
                                <h1 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                                    Bài Thi Chẩn Đoán Năng Lực 7 Part
                                </h1>
                            </div>
                            <span class="text-[11px] font-medium text-slate-400 hidden sm:inline-block">
                                Khảo sát chuẩn ETS 2026 · Thang điểm 0 - 990 · Phân tích 6 Lỗ hổng
                            </span>
                        </div>
                    </div>

                    <!-- Center: Countdown Timer -->
                    <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs">
                        <i class="fa-solid fa-stopwatch text-indigo-600 dark:text-indigo-400 text-xs"></i>
                        <span id="tdwTimer" class="text-indigo-600 dark:text-indigo-400 font-black text-sm tracking-widest font-mono">25:00</span>
                    </div>

                    <!-- Right: Tool Buttons & Submit CTA -->
                    <div class="flex items-center gap-2">
                        <!-- Progress indicator pill -->
                        <div class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>Đã làm:</span>
                            <span id="tdwHeaderAnsweredCount" class="text-indigo-600 dark:text-indigo-400 font-black">0</span>
                            <span class="text-slate-400">/ 28 câu</span>
                        </div>

                        <!-- Question Palette Trigger -->
                        <button type="button" onclick="ToeicDiagnosticWorkstation.togglePaletteDrawer()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-table-cells text-xs text-indigo-600 dark:text-indigo-400"></i>
                            <span class="hidden sm:inline">Bảng câu hỏi</span>
                        </button>

                        <!-- Submit Test Button -->
                        <button type="button" onclick="ToeicDiagnosticWorkstation.submitTest()" class="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-black shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                            <span class="hidden xs:inline">Nộp bài</span>
                        </button>
                    </div>
                </header>

                <!-- AUDIO PLAYER STRIP FOR LISTENING (Tự động hiển thị khi làm Q1 - Q16) -->
                <div id="tdwAudioBar" class="h-12 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 select-none transition-all">
                    <!-- Audio Controls -->
                    <div class="flex items-center gap-2.5">
                        <button type="button" id="tdwPlayBtn" onclick="ToeicDiagnosticWorkstation.toggleAudio()" class="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition shadow-sm cursor-pointer" title="Phát / Dừng Audio">
                            <i id="tdwPlayIcon" class="fa-solid fa-play text-xs ml-0.5"></i>
                        </button>

                        <!-- Speaker / Accent Tag -->
                        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                            <i class="fa-solid fa-volume-high text-indigo-600 dark:text-indigo-400 text-[10px]"></i>
                            <span id="tdwSpeakerTag">Giọng Mỹ (US)</span>
                        </div>

                        <!-- Waveform Animated Graphic -->
                        <div id="tdwWaveAnim" class="hidden sm:flex items-center gap-0.5 h-4 opacity-40 transition-opacity">
                            <span class="w-1 h-3 bg-indigo-500 rounded-full animate-bounce"></span>
                            <span class="w-1 h-4 bg-indigo-600 rounded-full animate-bounce" style="animation-delay: 100ms"></span>
                            <span class="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 200ms"></span>
                            <span class="w-1 h-5 bg-indigo-700 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                            <span class="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                        </div>
                    </div>

                    <!-- Audio Options: Speed & Loop -->
                    <div class="flex items-center gap-2">
                        <!-- Playback Speed -->
                        <div class="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                            <button type="button" onclick="ToeicDiagnosticWorkstation.setSpeed(0.8)" class="px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">0.8x</button>
                            <button type="button" onclick="ToeicDiagnosticWorkstation.setSpeed(1.0)" class="px-1.5 py-0.5 rounded bg-indigo-600 text-white shadow-2xs font-black">1.0x</button>
                            <button type="button" onclick="ToeicDiagnosticWorkstation.setSpeed(1.2)" class="px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">1.2x</button>
                        </div>

                        <!-- Loop Toggle -->
                        <button type="button" id="tdwLoopBtn" onclick="ToeicDiagnosticWorkstation.toggleLoop()" class="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer" title="Lặp lại câu">
                            <i class="fa-solid fa-repeat text-[10px]"></i>
                            <span class="hidden md:inline ml-1">Lặp</span>
                        </button>
                    </div>
                </div>

                <!-- MAIN WORKSTATION 2-COLUMN SPLIT PANE -->
                <main class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-slate-100 dark:bg-slate-950">
                    <!-- LEFT COLUMN: Context / Passage / Image / Instructions (Col-span 6) -->
                    <section id="tdwLeftPane" class="lg:col-span-6 h-full overflow-y-auto p-4 sm:p-6 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col">
                        <!-- Dynamic Context Loaded in showQuestion() -->
                    </section>

                    <!-- RIGHT COLUMN: Question & Answer Options (Col-span 6) -->
                    <section id="tdwRightPane" class="lg:col-span-6 h-full overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900 flex flex-col justify-between">
                        <!-- Dynamic Question & Options Loaded in showQuestion() -->
                    </section>
                </main>

                <!-- BOTTOM NAVIGATION TOOLBAR -->
                <footer class="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-20">
                    <!-- Left: Prev Button -->
                    <button type="button" id="tdwPrevBtn" onclick="ToeicDiagnosticWorkstation.prevQuestion()" class="px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-arrow-left text-[11px]"></i>
                        <span class="hidden xs:inline">Câu trước</span>
                    </button>

                    <!-- Center: Current Question & Palette trigger -->
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="ToeicDiagnosticWorkstation.toggleFlag()" id="tdwFlagBtn" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:border-amber-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                            <i id="tdwFlagIcon" class="fa-regular fa-flag text-xs"></i>
                            <span class="hidden sm:inline">Gắn cờ</span>
                        </button>
                        <span id="tdwQuestionIndexBadge" class="text-xs font-black text-slate-900 dark:text-white px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            Câu 1 / 28
                        </span>
                    </div>

                    <!-- Right: Next / Finish Button -->
                    <button type="button" id="tdwNextBtn" onclick="ToeicDiagnosticWorkstation.nextQuestion()" class="px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer">
                        <span class="hidden xs:inline">Câu tiếp theo</span>
                        <i class="fa-solid fa-arrow-right text-[11px]"></i>
                    </button>
                </footer>

                <!-- QUESTION PALETTE DRAWER (DRAWER OVERLAY) -->
                <div id="tdwPaletteDrawer" class="hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex justify-end">
                    <div class="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col p-5 animate-in slide-in-from-right duration-200">
                        <!-- Drawer Header -->
                        <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-table-cells text-indigo-600 text-base"></i>
                                <h3 class="font-black text-sm text-slate-900 dark:text-white">Bảng 28 Câu Hỏi (7 Part)</h3>
                            </div>
                            <button type="button" onclick="ToeicDiagnosticWorkstation.togglePaletteDrawer()" class="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 flex items-center justify-center transition">
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        <!-- Palette Grid by Parts -->
                        <div class="flex-1 overflow-y-auto py-4 space-y-5" id="tdwPaletteContent">
                            <!-- Populated in renderPaletteGrid() -->
                        </div>

                        <!-- Legend & Submit -->
                        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                            <div class="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                <div class="flex items-center gap-1.5">
                                    <span class="w-3.5 h-3.5 rounded-md bg-indigo-600 inline-block"></span>
                                    <span>Đã chọn</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-3.5 h-3.5 rounded-md bg-slate-200 dark:bg-slate-700 inline-block"></span>
                                    <span>Chưa làm</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-3.5 h-3.5 rounded-md bg-amber-500 inline-block"></span>
                                    <span>Gắn cờ</span>
                                </div>
                            </div>
                            <button type="button" onclick="ToeicDiagnosticWorkstation.submitTest()" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2">
                                <i class="fa-solid fa-paper-plane text-xs"></i>
                                <span>Nộp bài & Phân tích ngay</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // DISPLAY CURRENT QUESTION & CONTEXT IN SPLIT-PANE
        // =========================================================================
        jumpToQuestion(index) {
            this.showQuestion(index);
        }

        showQuestion(index) {
            if (index < 0 || index >= this.questions.length) return;
            this.currentIndex = index;
            const q = this.questions[index];

            // 1. Cập nhật thanh Audio nếu là câu Listening (Q1 - Q16)
            const audioBar = document.getElementById('tdwAudioBar');
            const speakerTag = document.getElementById('tdwSpeakerTag');
            if (audioBar) {
                if (q.type === 'listening') {
                    audioBar.classList.remove('hidden');
                    if (speakerTag) speakerTag.textContent = `${q.speaker || 'Bản xứ'} (${q.accent || 'US'})`;
                } else {
                    audioBar.classList.add('hidden');
                    this.stopAudio();
                }
            }

            // 2. Cập nhật nhãn câu hỏi ở footer
            const indexBadge = document.getElementById('tdwQuestionIndexBadge');
            if (indexBadge) indexBadge.textContent = `Câu ${index + 1} / 28`;

            const prevBtn = document.getElementById('tdwPrevBtn');
            if (prevBtn) prevBtn.disabled = (index === 0);

            const nextBtn = document.getElementById('tdwNextBtn');
            if (nextBtn) {
                if (index === this.questions.length - 1) {
                    nextBtn.innerHTML = '<span>Nộp bài</span> <i class="fa-solid fa-paper-plane text-[11px]"></i>';
                } else {
                    nextBtn.innerHTML = '<span>Câu tiếp theo</span> <i class="fa-solid fa-arrow-right text-[11px]"></i>';
                }
            }

            // Flag state
            const flagIcon = document.getElementById('tdwFlagIcon');
            const flagBtn = document.getElementById('tdwFlagBtn');
            if (flagIcon && flagBtn) {
                if (this.flagged[q.id]) {
                    flagIcon.className = 'fa-solid fa-flag text-xs text-amber-500';
                    flagBtn.classList.add('border-amber-400', 'bg-amber-50', 'dark:bg-amber-950/40');
                } else {
                    flagIcon.className = 'fa-regular fa-flag text-xs text-slate-500';
                    flagBtn.classList.remove('border-amber-400', 'bg-amber-50', 'dark:bg-amber-950/40');
                }
            }

            // 3. Render LEFT COLUMN (Passage / Image / Context)
            const leftPane = document.getElementById('tdwLeftPane');
            if (leftPane) {
                leftPane.innerHTML = this.renderLeftColumnContent(q, index);
            }

            // 4. Render RIGHT COLUMN (Question & Options)
            const rightPane = document.getElementById('tdwRightPane');
            if (rightPane) {
                rightPane.innerHTML = this.renderRightColumnContent(q, index);
            }

            // 5. Cập nhật palette grid nếu đang mở
            this.renderPaletteGrid();
            this.updateHeaderProgress();
        }

        renderLeftColumnContent(q, index) {
            if (q.part === 1) {
                // Part 1 Photographs
                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black">
                                📷 PART 1: PHOTOGRAPHS
                            </span>
                            <span class="text-xs font-bold text-slate-400">Câu ${index + 1}/28</span>
                        </div>

                        <!-- Image Preview Box -->
                        <div class="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <img src="${q.image}" alt="TOEIC Part 1 Photo" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.onerror=null; this.src='assets/listening/part1/p1_sample_01_person.webp';"/>
                            <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow pointer-events-none">
                                <i class="fa-solid fa-camera text-blue-400"></i>
                                <span>Ảnh Đề Thi Chuẩn ETS</span>
                            </div>
                        </div>

                        <!-- Listening Instructions -->
                        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            <strong class="text-slate-900 dark:text-white block mb-1">🎧 Hướng dẫn làm bài Part 1:</strong>
                            Nghe 4 câu mô tả (A), (B), (C), (D) về bức tranh. Chọn câu mô tả CHÍNH XÁC NHẤT những gì đang diễn ra trong tranh. Bấm nút Play trên thanh audio để nghe.
                        </div>
                    </div>
                `;
            } else if (q.part === 2) {
                // Part 2 Question - Response
                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black">
                                🎧 PART 2: QUESTION - RESPONSE
                            </span>
                            <span class="text-xs font-bold text-slate-400">Câu ${index + 1}/28</span>
                        </div>

                        <div class="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-800 dark:to-indigo-950/40 border border-indigo-200 dark:border-slate-700 space-y-3">
                            <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
                                <i class="fa-solid fa-headset"></i>
                            </div>
                            <h3 class="text-base font-black text-slate-900 dark:text-white">
                                Phản Xạ Nghe Hỏi & Đáp Tốc Độ Cao
                            </h3>
                            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Đề thi chuẩn ETS KHÔNG in câu hỏi hay các phương án lên bài thi. Bạn sẽ nghe 1 câu hỏi/phát biểu và 3 câu phản hồi (A), (B), (C). Chọn câu trả lời hợp lý nhất!
                            </p>
                        </div>

                        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            <strong class="text-slate-900 dark:text-white block">💡 Mẹo bắt bẫy Part 2 ETS:</strong>
                            <p>• Tránh chọn các từ lặp lại hoặc có âm thanh tương tự với câu hỏi (thường là bẫy lừa tai).</p>
                            <p>• Câu hỏi Wh- không bao giờ trả lời bằng Yes hoặc No.</p>
                            <p>• Chú ý câu trả lời gián tiếp né tránh (I don't know, Ask Ms. Davis...).</p>
                        </div>
                    </div>
                `;
            } else if (q.part === 3 || q.part === 4) {
                // Part 3 & Part 4 Context & Transcript Toggle
                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-1 rounded-xl ${q.part === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'} text-xs font-black">
                                📢 ${q.part === 3 ? 'PART 3: CONVERSATIONS (HỘI THOẠI)' : 'PART 4: SHORT TALKS (BÀI NÓI NGẮN)'}
                            </span>
                            <span class="text-xs font-bold text-slate-400">Câu ${index + 1}/28</span>
                        </div>

                        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl ${q.part === 3 ? 'bg-amber-500' : 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-sm shadow">
                                    <i class="${q.part === 3 ? 'fa-solid fa-comments' : 'fa-solid fa-bullhorn'}"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                        ${q.part === 3 ? 'Đoạn Hội Thoại Công Sở Đa Giọng' : 'Bài Nói Thông Báo / Báo Cáo Chuyên Đề'}
                                    </h4>
                                    <span class="text-[11px] text-slate-400">Độ dài: ~35 - 45 giây</span>
                                </div>
                            </div>
                            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                Lắng nghe toàn bộ bài nói/hội thoại và trả lời câu hỏi bên phải. Hãy chú ý các từ khóa đồng nghĩa (Paraphrasing) và thông tin liên quan đến lý do, giải pháp hoặc hành động tiếp theo.
                            </p>
                        </div>

                        <!-- Toggle Transcript Accordion (Optional review) -->
                        <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                            <button type="button" onclick="const t = document.getElementById('tdwTranscriptBox'); if(t) t.classList.toggle('hidden');" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition cursor-pointer">
                                <span class="flex items-center gap-1.5">
                                    <i class="fa-solid fa-file-lines text-indigo-600"></i>
                                    <span>Xem trước kịch bản nghe (Script)</span>
                                </span>
                                <i class="fa-solid fa-chevron-down text-[10px]"></i>
                            </button>
                            <div id="tdwTranscriptBox" class="hidden p-4 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-mono border-t border-slate-200 dark:border-slate-800">
                                ${q.transcript || q.audioScript}
                            </div>
                        </div>
                    </div>
                `;
            } else if (q.part === 5) {
                // Part 5 Incomplete Sentences Context
                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-black">
                                📖 PART 5: INCOMPLETE SENTENCES
                            </span>
                            <span class="text-xs font-bold text-slate-400">Câu ${index + 1}/28</span>
                        </div>

                        <div class="p-5 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700 space-y-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow">
                                <i class="fa-solid fa-spell-check"></i>
                            </div>
                            <h4 class="font-bold text-sm text-slate-900 dark:text-white">
                                Điền Từ & Ngữ Pháp Cốt Lõi ETS 2026
                            </h4>
                            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                Phần thi kiểm tra năng lực ngữ pháp nâng cao: Từ loại bẫy (-ive/-al), Mệnh đề quan hệ rút gọn, Thể giả định (Subjunctive), và phân biệt Liên từ vs Giới từ.
                            </p>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                            <span class="font-black text-slate-900 dark:text-white block">🎯 Trọng tâm câu hỏi:</span>
                            <p>${q.context || 'Đọc kỹ cấu trúc câu bên phải và chọn phương án đúng nhất.'}</p>
                        </div>
                    </div>
                `;
            } else if (q.part === 6) {
                // Part 6 Text Completion Context with formatted business letter
                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-black">
                                📄 PART 6: TEXT COMPLETION (ĐOẠN VĂN)
                            </span>
                            <div class="flex items-center gap-2">
                                <button type="button" onclick="ToeicDiagnosticWorkstation.toggleBilingual()" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer">
                                    <i class="fa-solid fa-language text-indigo-500 mr-1"></i>
                                    <span>${this.showBilingual ? 'Tắt dịch' : 'Song ngữ'}</span>
                                </button>
                                <span class="text-xs font-bold text-slate-400">Câu ${index + 1}/28</span>
                            </div>
                        </div>

                        <!-- Passage Document Container -->
                        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-serif">
                            <div class="border-b border-slate-100 dark:border-slate-700 pb-2">
                                <h3 class="font-sans font-black text-sm text-slate-900 dark:text-white">
                                    ${q.passageTitle || 'Văn bản đọc hiểu'}
                                </h3>
                            </div>
                            <div class="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans select-text">
                                ${q.passageContent.replace(/\[\s*(\d+)\s*\]/g, '<span class="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold font-mono border border-amber-300 dark:border-amber-700">[ $1 ]</span>')}
                            </div>
                        </div>

                        ${this.showBilingual && q.passageVi ? `
                            <div class="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                                <strong class="text-indigo-900 dark:text-indigo-300 block mb-1">🇻🇳 Bản dịch tiếng Việt:</strong>
                                ${q.passageVi}
                            </div>
                        ` : ''}
                    </div>
                `;
            } else if (q.part === 7) {
                // Part 7 Reading Comprehension Context
                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-black">
                                📰 PART 7: READING COMPREHENSION
                            </span>
                            <div class="flex items-center gap-2">
                                <button type="button" onclick="ToeicDiagnosticWorkstation.toggleBilingual()" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer">
                                    <i class="fa-solid fa-language text-indigo-500 mr-1"></i>
                                    <span>${this.showBilingual ? 'Tắt dịch' : 'Song ngữ'}</span>
                                </button>
                                <span class="text-xs font-bold text-slate-400">Câu ${index + 1}/28</span>
                            </div>
                        </div>

                        <!-- Passage Document Container -->
                        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-serif">
                            <div class="border-b border-slate-100 dark:border-slate-700 pb-2">
                                <h3 class="font-sans font-black text-sm text-slate-900 dark:text-white">
                                    ${q.passageTitle || 'Văn bản đọc hiểu'}
                                </h3>
                            </div>
                            <div class="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans select-text">
                                ${q.passageContent}
                            </div>
                        </div>

                        ${this.showBilingual && q.passageVi ? `
                            <div class="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                                <strong class="text-indigo-900 dark:text-indigo-300 block mb-1">🇻🇳 Bản dịch tiếng Việt:</strong>
                                ${q.passageVi}
                            </div>
                        ` : ''}
                    </div>
                `;
            }
            return '';
        }

        renderRightColumnContent(q, index) {
            const selectedKey = this.userAnswers[q.id];

            return `
                <div class="space-y-5">
                    <!-- Question Header & Badges -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between gap-2">
                            <span class="px-2.5 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                                Câu ${index + 1} • ${q.partName}
                            </span>
                            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                ${q.type === 'listening' ? '🎧 Listening' : '📖 Reading'}
                            </span>
                        </div>

                        <!-- Question Statement -->
                        <h2 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                            ${q.question}
                        </h2>
                    </div>

                    <!-- Options Grid -->
                    <div class="space-y-2.5 pt-2" id="tdwOptionsContainer">
                        ${q.options.map(opt => {
                            const isSelected = (selectedKey === opt.key);
                            return `
                                <div onclick="ToeicDiagnosticWorkstation.selectOption('${q.id}', '${opt.key}')" 
                                    class="p-3.5 sm:p-4 rounded-2xl border ${isSelected ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'} flex items-start gap-3.5 cursor-pointer transition select-none shadow-2xs group">
                                    <div class="w-6 h-6 rounded-full border ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600 text-slate-400 group-hover:border-indigo-400'} flex items-center justify-center text-xs font-black shrink-0 transition mt-0.5">
                                        ${opt.key}
                                    </div>
                                    <span class="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                        ${opt.text}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Footer Hint / Quick Shortcut -->
                <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>💡 Phím tắt: Bấm <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">A</kbd> <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">B</kbd> <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">C</kbd> <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] text-slate-800 dark:text-slate-200">D</kbd> để chọn đáp án</span>
                    <span>Trụ cột: <strong class="text-indigo-600 dark:text-indigo-400">${q.pillarName.split(':')[0]}</strong></span>
                </div>
            `;
        }

        // =========================================================================
        // ANSWER SELECTION & USER INTERACTION
        // =========================================================================
        selectOption(qId, key) {
            this.userAnswers[qId] = key;
            this.renderRightColumnContent(this.questions[this.currentIndex], this.currentIndex);
            this.updateHeaderProgress();
        }

        toggleFlag() {
            const q = this.questions[this.currentIndex];
            this.flagged[q.id] = !this.flagged[q.id];
            this.showQuestion(this.currentIndex);
        }

        prevQuestion() {
            if (this.currentIndex > 0) {
                this.showQuestion(this.currentIndex - 1);
            }
        }

        nextQuestion() {
            if (this.currentIndex < this.questions.length - 1) {
                this.showQuestion(this.currentIndex + 1);
            } else {
                this.submitTest();
            }
        }

        toggleBilingual() {
            this.showBilingual = !this.showBilingual;
            this.showQuestion(this.currentIndex);
        }

        togglePaletteDrawer() {
            const drawer = document.getElementById('tdwPaletteDrawer');
            if (!drawer) return;
            if (drawer.classList.contains('hidden')) {
                this.renderPaletteGrid();
                drawer.classList.remove('hidden');
            } else {
                drawer.classList.add('hidden');
            }
        }

        updateHeaderProgress() {
            const count = Object.keys(this.userAnswers).length;
            const countEl = document.getElementById('tdwHeaderAnsweredCount');
            if (countEl) countEl.textContent = count;
        }

        renderPaletteGrid() {
            const content = document.getElementById('tdwPaletteContent');
            if (!content) return;

            // Gom nhóm câu hỏi theo 7 Part
            const parts = [
                { part: 1, name: 'Part 1: Photographs', range: [0, 3] },
                { part: 2, name: 'Part 2: Question - Response', range: [4, 7] },
                { part: 3, name: 'Part 3: Conversations', range: [8, 11] },
                { part: 4, name: 'Part 4: Short Talks', range: [12, 15] },
                { part: 5, name: 'Part 5: Incomplete Sentences', range: [16, 19] },
                { part: 6, name: 'Part 6: Text Completion', range: [20, 23] },
                { part: 7, name: 'Part 7: Reading Comprehension', range: [24, 27] }
            ];

            content.innerHTML = parts.map(p => {
                const partQuestions = this.questions.slice(p.range[0], p.range[1] + 1);
                return `
                    <div class="space-y-2">
                        <div class="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>${p.name}</span>
                            <span class="text-[11px] text-slate-400">Câu ${p.range[0] + 1} - ${p.range[1] + 1}</span>
                        </div>
                        <div class="grid grid-cols-4 gap-2">
                            ${partQuestions.map((q, idx) => {
                                const qGlobalIdx = p.range[0] + idx;
                                const isAnswered = !!this.userAnswers[q.id];
                                const isCurrent = (this.currentIndex === qGlobalIdx);
                                const isFlagged = !!this.flagged[q.id];

                                let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                                if (isAnswered) {
                                    btnClass = 'bg-indigo-600 text-white border-indigo-600 shadow-xs';
                                }
                                if (isCurrent) {
                                    btnClass += ' ring-2 ring-amber-400 font-black';
                                }

                                return `
                                    <button type="button" onclick="ToeicDiagnosticWorkstation.showQuestion(${qGlobalIdx}); ToeicDiagnosticWorkstation.togglePaletteDrawer();" class="relative py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${btnClass}">
                                        <span>${qGlobalIdx + 1}</span>
                                        ${isFlagged ? '<span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>' : ''}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        // =========================================================================
        // SCORING ALGORITHM & 6-PILLAR WEAKNESS RADAR (ETS 0 - 990)
        // =========================================================================
        submitTest(isAuto = false) {
            const answeredCount = Object.keys(this.userAnswers).length;
            if (!isAuto && answeredCount < 28) {
                const confirmSubmit = confirm(`Bạn mới trả lời ${answeredCount}/28 câu. Bạn có chắc chắn muốn nộp bài sớm không? Các câu chưa làm sẽ tính là 0 điểm.`);
                if (!confirmSubmit) return;
            }

            this.stopTimer();
            this.stopAudio();

            // Tính số câu đúng cho từng phần
            let listeningCorrect = 0; // 0..16
            let readingCorrect = 0;   // 0..12

            this.questions.forEach((q, idx) => {
                const userAns = this.userAnswers[q.id];
                const isCorrect = (userAns === q.correct);
                if (idx < 16) {
                    if (isCorrect) listeningCorrect++;
                } else {
                    if (isCorrect) readingCorrect++;
                }
            });

            // Quy đổi sang thang điểm chuẩn ETS 0 - 495 cho từng kỹ năng
            // Bảng điểm chuẩn ETS Listening (16 câu):
            const listeningScoreMap = {
                16: 495, 15: 480, 14: 455, 13: 425, 12: 395, 11: 365, 10: 335,
                9: 305, 8: 275, 7: 245, 6: 215, 5: 185, 4: 155, 3: 120, 2: 85, 1: 50, 0: 20
            };
            // Bảng điểm chuẩn ETS Reading (12 câu):
            const readingScoreMap = {
                12: 495, 11: 465, 10: 430, 12: 495, 9: 390, 8: 350, 7: 310,
                6: 270, 5: 230, 4: 190, 3: 145, 2: 100, 1: 55, 0: 20
            };

            const scaledListening = listeningScoreMap[listeningCorrect] !== undefined ? listeningScoreMap[listeningCorrect] : Math.round((listeningCorrect / 16) * 495);
            const scaledReading = readingScoreMap[readingCorrect] !== undefined ? readingScoreMap[readingCorrect] : Math.round((readingCorrect / 12) * 495);
            const totalScore = Math.min(990, Math.max(40, scaledListening + scaledReading));

            // Tính điểm cho 6 TRỤ CỘT KIẾN THỨC CỐT LÕI (Weakness Radar):
            const pillars = [
                { id: 'gap-part12-listening', qIndices: [0, 1, 2, 3, 4, 5, 6, 7] }, // Part 1 & 2 (8 câu)
                { id: 'gap-part34-paraphrase', qIndices: [8, 9, 10, 11, 12, 13, 14, 15] }, // Part 3 & 4 (8 câu)
                { id: 'gap-part5-grammar', qIndices: [16, 17, 18] }, // Part 5 Ngữ pháp (3 câu)
                { id: 'gap-part5-vocab', qIndices: [19, 21] }, // Part 5 & 6 Từ vựng (2 câu)
                { id: 'gap-part6-insertion', qIndices: [20, 22, 23] }, // Part 6 Điền câu & liên từ (3 câu)
                { id: 'gap-part7-multi', qIndices: [24, 25, 26, 27] } // Part 7 Đọc hiểu đơn & đa đoạn (4 câu)
            ];

            const pillarScores = {};
            pillars.forEach(p => {
                let correctCount = 0;
                p.qIndices.forEach(idx => {
                    const q = this.questions[idx];
                    if (this.userAnswers[q.id] === q.correct) correctCount++;
                });
                pillarScores[p.id] = Math.round((correctCount / p.qIndices.length) * 100);
            });

            // Xác định Band điểm và đánh giá
            let bandTitle = '';
            let bandDesc = '';
            let recommendedStage = 1;

            if (totalScore < 300) {
                bandTitle = 'Band 0 - 300 (Mất gốc / Mới bắt đầu)';
                bandDesc = 'Cần xây dựng lại nền tảng phát âm, nhận diện thì cơ bản và từ loại N - V - Adj - Adv.';
                recommendedStage = 1;
            } else if (totalScore < 450) {
                bandTitle = 'Band 300 - 450 (Sơ cấp - Basic Competence)';
                bandDesc = 'Đã nắm được các câu hỏi trực tiếp. Cần khắc phục bẫy Being/Been trong tranh và câu hỏi lựa chọn.';
                recommendedStage = 2;
            } else if (totalScore < 600) {
                bandTitle = 'Band 450 - 600 (Tiền Trung Cấp - Chuẩn Ra Trường)';
                bandDesc = 'Đạt chuẩn xét tốt nghiệp đại học! Cần bứt phá bẫy gián tiếp Part 2 và chuỗi 2 đoạn văn Part 7.';
                recommendedStage = 3;
            } else if (totalScore < 750) {
                bandTitle = 'Band 600 - 750 (Trung Cấp - Bứt Phá Doanh Nghiệp)';
                bandDesc = 'Kỹ năng làm bài rất tốt. Cần rèn luyện phản xạ hội thoại 3 người và chuỗi 3 đoạn văn Part 7.';
                recommendedStage = 4;
            } else if (totalScore < 900) {
                bandTitle = 'Band 750 - 900 (Cao Cấp - Thành Thạo Toàn Diện)';
                bandDesc = 'Khả năng tiếng Anh lưu loát. Chỉ cần tối ưu tốc độ quản lý thời gian và xử lý bẫy tiểu tiết.';
                recommendedStage = 5;
            } else {
                bandTitle = 'Band 900 - 990 (Mastery - Chinh Phục Điểm Tuyệt Đối)';
                bandDesc = 'Xuất sắc! Trình độ đỉnh cao, chuẩn bị sẵn sàng chinh phục điểm tuyệt đối ETS.';
                recommendedStage = 6;
            }

            // Lưu kết quả vào tài khoản người dùng
            let user = null;
            if (window.PersonalizedRoadmapEngine && typeof window.PersonalizedRoadmapEngine.getActiveUser === 'function') {
                user = window.PersonalizedRoadmapEngine.getActiveUser();
            }
            if (!user) {
                user = { id: 'acc-student-' + Date.now(), name: 'Học viên', targetScore: '650', examDate: '20/12/2026' };
            }
            window.currentUserAccount = user;
            if (typeof currentUserAccount !== 'undefined') currentUserAccount = user;

            user.diagnosticResults = {
                testedDate: new Date().toLocaleDateString('vi-VN'),
                totalCorrect: listeningCorrect + readingCorrect,
                listeningCorrect: listeningCorrect,
                readingCorrect: readingCorrect,
                listeningScore: scaledListening,
                readingScore: scaledReading,
                estimatedScore: totalScore,
                pillarScores: pillarScores,
                bandTitle: bandTitle,
                bandDesc: bandDesc,
                recommendedStage: recommendedStage
            };

            // Lưu vào localStorage
            try {
                localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
                localStorage.setItem('cung_dang_diagnostic_results', JSON.stringify(user.diagnosticResults));
            } catch (e) {}

            if (window.syncCurrentAccountState) {
                window.syncCurrentAccountState();
            }
            if (typeof applyCurrentAccountToUI === 'function') {
                applyCurrentAccountToUI();
            }

            // Đóng Workstation
            this.close();

            // Hiển thị modal kết quả chẩn đoán chi tiết chuẩn ETS
            this.showDiagnosticSummaryModal(user.diagnosticResults);

            // Cập nhật lại giao diện Lộ Trình Cá Nhân (Vertical Zigzag S-Curve)
            if (window.PersonalizedRoadmapEngine && typeof window.PersonalizedRoadmapEngine.renderRoadmapView === 'function') {
                window.PersonalizedRoadmapEngine.renderRoadmapView();
            }
        }

        // =========================================================================
        // DIAGNOSTIC SUMMARY MODAL (Hiển thị Báo cáo Phân tích Lỗ hổng)
        // =========================================================================
        showDiagnosticSummaryModal(res) {
            let modal = document.getElementById('diagResultModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'diagResultModal';
                modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans';
                document.body.appendChild(modal);
            }
            modal.classList.remove('hidden');

            const pillarsMeta = [
                { id: 'gap-part12-listening', name: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp', icon: 'fa-solid fa-headphones', color: 'teal' },
                { id: 'gap-part34-paraphrase', name: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói', icon: 'fa-solid fa-comments', color: 'indigo' },
                { id: 'gap-part5-grammar', name: 'Part 5: Ngữ pháp cốt lõi (Từ loại, Mệnh đề quan hệ, Giả định)', icon: 'fa-solid fa-spell-check', color: 'purple' },
                { id: 'gap-part5-vocab', name: 'Part 5: Từ vựng & Collocations Công sở Doanh nghiệp', icon: 'fa-solid fa-briefcase', color: 'blue' },
                { id: 'gap-part6-insertion', name: 'Part 6: Điền câu theo mạch logic & Liên từ chuyển ý', icon: 'fa-solid fa-file-pen', color: 'amber' },
                { id: 'gap-part7-multi', name: 'Part 7: Đọc hiểu văn bản đơn & Chuỗi 2-3 đoạn văn', icon: 'fa-solid fa-newspaper', color: 'rose' }
            ];

            modal.innerHTML = `
                <div class="bg-white dark:bg-slate-900 rounded-[28px] max-w-2xl w-full p-5 sm:p-7 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                    <!-- Top Score Banner -->
                    <div class="text-center space-y-2">
                        <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-indigo-500/30">
                            <i class="fa-solid fa-trophy"></i>
                        </div>
                        <span class="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wider inline-block">
                            🎯 KẾT QUẢ TEST CHẨN ĐOÁN CHUẨN ETS
                        </span>
                        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Ước Tính: <span class="text-indigo-600 dark:text-indigo-400">${res.estimatedScore}</span> / 990
                        </h2>
                        <div class="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span class="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                                🎧 Listening: <strong>${res.listeningScore} / 495</strong> (${res.listeningCorrect}/16 câu)
                            </span>
                            <span class="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                                📖 Reading: <strong>${res.readingScore} / 495</strong> (${res.readingCorrect}/12 câu)
                            </span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-1">
                            ${res.bandTitle} · ${res.bandDesc}
                        </p>
                    </div>

                    <!-- 6 Trụ Cột Weakness Radar Summary -->
                    <div class="space-y-3 pt-2">
                        <div class="flex items-center justify-between">
                            <h4 class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                                <i class="fa-solid fa-radar text-indigo-600"></i>
                                <span>Phân tích 6 Trụ Cột Lỗ Hổng Kiến Thức:</span>
                            </h4>
                            <span class="text-[11px] font-semibold text-slate-400">Độ thành thạo (%)</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            ${pillarsMeta.map(p => {
                                const sc = res.pillarScores[p.id] || 0;
                                const isWeak = sc < 60;
                                const isFair = sc >= 60 && sc < 80;

                                return `
                                    <div class="p-3 rounded-2xl border ${isWeak ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20' : isFair ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20' : 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'} flex items-center justify-between gap-2 shadow-2xs">
                                        <div class="flex items-center gap-2.5 overflow-hidden">
                                            <div class="w-7 h-7 rounded-lg ${isWeak ? 'bg-rose-100 text-rose-600' : isFair ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center text-xs shrink-0">
                                                <i class="${p.icon}"></i>
                                            </div>
                                            <div class="truncate">
                                                <span class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">${p.name.split(':')[0]}</span>
                                                <span class="text-[10px] text-slate-400">${isWeak ? '⚠️ Cần vá gấp' : isFair ? '⚡ Tạm ổn' : '✅ Vững vàng'}</span>
                                            </div>
                                        </div>
                                        <span class="text-xs font-black shrink-0 ${isWeak ? 'text-rose-600' : isFair ? 'text-amber-600' : 'text-emerald-600'}">${sc}%</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Call To Action Buttons -->
                    <div class="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onclick="document.getElementById('diagResultModal').remove(); ToeicDiagnosticWorkstation.open();" class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            Thi lại bài test
                        </button>
                        <button type="button" onclick="document.getElementById('diagResultModal').remove(); switchTab('lo-trinh');" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer">
                            <span>Khám Phá Lộ Trình S-Curve Mới</span>
                            <i class="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Expose Global Instance
    window.ToeicDiagnosticWorkstation = new ToeicDiagnosticWorkstation();

})(window, document);
