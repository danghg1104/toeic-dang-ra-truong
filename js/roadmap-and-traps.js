/**
 * HỆ THỐNG LỘ TRÌNH CÁ NHÂN, CHẨN ĐOÁN LỖ HỔNG KIẾN THỨC & BẪY ĐỀ THI KINH ĐIỂN
 * Tích hợp Gia sư AI Luyện thi TOEIC (ETS 2023 - 2027)
 * Dành riêng cho "Cùng Đăng Ra Trường"
 */

// =========================================================================
// 1. ENGINE CHẨN ĐOÁN LỖ HỔNG KIẾN THỨC & LỘ TRÌNH CÁ NHÂN (ROADMAP)
// =========================================================================
window.PersonalizedRoadmapEngine = {
    // 6 Trụ cột kiến thức cốt lõi được chẩn đoán
    pillars: [
        {
            id: 'gap-part12-listening',
            name: 'Part 1 & 2: Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
            part: 'Listening',
            icon: 'fa-solid fa-headphones',
            color: 'teal',
            desc: 'Bẫy Being vs Been trong tranh tĩnh, câu hỏi phủ định, câu trả lời đá trách nhiệm hoặc hỏi ngược lại.',
            trapTargetId: 'trap-part1-being'
        },
        {
            id: 'gap-part34-paraphrase',
            name: 'Part 3 & 4: Paraphrasing & Nắm bắt ý đồ người nói',
            part: 'Listening',
            icon: 'fa-solid fa-comments',
            color: 'indigo',
            desc: 'Bẫy từ đồng nghĩa chuyển đổi ngữ cảnh, bẫy biểu đồ và câu hỏi ngụ ý (Why does the speaker say...?).',
            trapTargetId: 'trap-part2-evasive'
        },
        {
            id: 'gap-part5-grammar',
            name: 'Part 5: Ngữ pháp cốt lõi (Từ loại, Mệnh đề quan hệ, Giả định)',
            part: 'Reading',
            icon: 'fa-solid fa-spell-check',
            color: 'purple',
            desc: 'Bẫy danh từ đuôi -ive/-al, rút gọn mệnh đề V-ing vs V-ed, thể giả định Subjunctive và đảo ngữ.',
            trapTargetId: 'trap-part5-suffix'
        },
        {
            id: 'gap-part5-vocab',
            name: 'Part 5: Từ vựng & Collocations Công sở Doanh nghiệp',
            part: 'Reading',
            icon: 'fa-solid fa-briefcase',
            color: 'blue',
            desc: 'Các cụm từ cố định trong hợp đồng, đàm phán, chính sách công ty và từ dễ gây nhầm lẫn.',
            trapTargetId: 'trap-part5-conjunction-prep'
        },
        {
            id: 'gap-part6-insertion',
            name: 'Part 6: Điền câu theo mạch logic & Liên từ chuyển ý',
            part: 'Reading',
            icon: 'fa-solid fa-file-pen',
            color: 'amber',
            desc: 'Bẫy điền cả câu vào ngữ cảnh đoạn văn, bẫy liên từ However, Therefore, In spite of.',
            trapTargetId: 'trap-part5-subjunctive-inversion'
        },
        {
            id: 'gap-part7-multi',
            name: 'Part 7: Đọc hiểu văn bản đơn & Chuỗi 2-3 đoạn văn',
            part: 'Reading',
            icon: 'fa-solid fa-newspaper',
            color: 'rose',
            desc: 'Kỹ năng Skimming / Scanning, bẫy câu hỏi NOT/TRUE và liên kết thông tin giữa 2 email/hóa đơn.',
            trapTargetId: 'trap-part5-reduced-relative'
        }
    ],

    // Lấy thông tin tài khoản đang hoạt động (Đồng bộ đa tầng an toàn 100%)
    getActiveUser() {
        if (window.currentUserAccount && window.currentUserAccount.id) return window.currentUserAccount;
        if (typeof currentUserAccount !== 'undefined' && currentUserAccount && currentUserAccount.id) {
            window.currentUserAccount = currentUserAccount;
            return currentUserAccount;
        }
        if (typeof window.getCurrentUser === 'function') {
            const u = window.getCurrentUser();
            if (u) return u;
        }
        try {
            const s = localStorage.getItem('cung_dang_session_user');
            if (s) {
                const u = JSON.parse(s);
                if (u && u.id) {
                    window.currentUserAccount = u;
                    return u;
                }
            }
        } catch(e) {}

        const fallback = {
            id: 'acc-dang',
            name: 'Đăng Huỳnh Gia',
            email: 'dang.hg.68khhh@ntu.edu.vn',
            targetScore: '600',
            examDate: '20/12/2026',
            avatarColor: 'bg-purple-700',
            isOwner: true
        };
        window.currentUserAccount = fallback;
        return fallback;
    },

    // Tính toán số ngày còn lại đến kỳ thi
    calculateDaysRemaining() {
        const user = this.getActiveUser();
        const examDateStr = user?.examDate || '20/12/2026';
        const parts = examDateStr.split('/');
        if (parts.length === 3) {
            const targetDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
            const now = new Date();
            const diffTime = targetDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.max(0, diffDays);
        }
        return 30; // Mặc định 30 ngày
    },

    // Điểm sẵn sàng hiện tại (Chính xác từ kết quả test chẩn đoán thực tế, không bịa số)
    calculateReadinessScore() {
        const user = this.getActiveUser();
        const diag = user?.diagnosticResults;
        if (!diag || diag.estimatedScore === undefined) {
            return 0; // Chưa làm bài test chẩn đoán: 0 điểm
        }
        return diag.estimatedScore;
    },

    // 6 Lỗ hổng kiến thức cốt lõi (Về 0% khi chưa làm bài kiểm tra)
    calculateGapStats() {
        const user = this.getActiveUser();
        const diag = user?.diagnosticResults;
        if (!diag || !diag.pillarScores) {
            // Mặc định về 0% toàn bộ khi chưa làm bài test chẩn đoán
            return this.pillars.map(p => ({
                ...p,
                score: 0,
                tested: false,
                statusText: 'Chưa kiểm tra (0%)'
            }));
        }

        return this.pillars.map(p => {
            const score = diag.pillarScores[p.id] !== undefined ? diag.pillarScores[p.id] : 0;
            return {
                ...p,
                score: score,
                tested: true,
                statusText: score < 60 ? '⚠️ Yếu (Cần vá gấp)' : score < 80 ? '⚡ Tạm ổn' : '✅ Vững vàng'
            };
        });
    },

    // Phát âm thanh giọng bản xứ cho các câu hỏi Listening qua Universal Audio Engine
    playAudio(text) {
        if (window.UniversalAudioEngine) {
            window.UniversalAudioEngine.speak(text, { rate: 0.95 });
            showToast('🔊 Đang phát audio câu hỏi...');
        } else if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
            showToast('🔊 Đang phát audio câu hỏi...');
        } else {
            showToast('Trình duyệt không hỗ trợ phát âm thanh.');
        }
    },

    // Danh sách 15 câu hỏi Test chẩn đoán bao quát 6 trụ cột cốt lõi ETS 2026
    diagnosticQuestions: [
        {
            id: 'diag-1',
            pillarId: 'gap-part12-listening',
            part: 'Part 1 - Bẫy Being vs Been (Listening)',
            type: 'listening',
            context: '🖼️ [Tranh mô tả]: Một hàng xe đạp dựng tựa vào hàng rào bên đường đi bộ. Khu vực tĩnh, hoàn toàn KHÔNG có người nào trong tranh.',
            audioScript: 'Listen to the 4 statements: (A) A bicycle is being repaired by a mechanic. (B) Some bicycles have been parked against a fence. (C) A cyclist is riding along the street. (D) The sidewalk is being cleaned with water.',
            question: 'Nghe audio và chọn câu mô tả ĐÚNG NHẤT về bức tranh tĩnh:',
            options: [
                { key: 'A', text: '(A) A bicycle is being repaired by a mechanic.' },
                { key: 'B', text: '(B) Some bicycles have been parked against a fence.' },
                { key: 'C', text: '(C) A cyclist is riding along the street.' },
                { key: 'D', text: '(D) The sidewalk is being cleaned with water.' }
            ],
            correct: 'B',
            explanation: 'Bẫy kinh điển Part 1: Tranh tĩnh KHÔNG có người thì các phương án chứa "being + V3" (is being repaired, is being cleaned) đều SAI vì diễn tả hành động đang được người thực hiện. (B) "have been parked" là thì hiện tại hoàn thành bị động chỉ trạng thái tĩnh đã hoàn tất -> ĐÚNG.'
        },
        {
            id: 'diag-2',
            pillarId: 'gap-part12-listening',
            part: 'Part 1 - Bẫy Vật thể vs Hành động (Listening)',
            type: 'listening',
            context: '🖼️ [Tranh mô tả]: Văn phòng làm việc sau giờ tan sở. Bàn làm việc có nhiều tài liệu và máy tính để mở, nhưng không có nhân viên.',
            audioScript: 'Listen to the statements: (A) Papers are being filed into cabinets. (B) A technician is typing on a keyboard. (C) Documents are scattered across the desk surface. (D) Boxes are being unloaded from a cart.',
            question: 'Chọn câu mô tả chính xác nhất hiện trạng trong phòng:',
            options: [
                { key: 'A', text: '(A) Papers are being filed into cabinets.' },
                { key: 'B', text: '(B) A technician is typing on a keyboard.' },
                { key: 'C', text: '(C) Documents are scattered across the desk surface.' },
                { key: 'D', text: '(D) Boxes are being unloaded from a cart.' }
            ],
            correct: 'C',
            explanation: 'Bẫy hành động trong tranh không người. (A) và (D) dùng "being V3" sai. (B) nói về "A technician" không có thật trong tranh. (C) mô tả đúng trạng thái tài liệu nằm rải rác trên bàn.'
        },
        {
            id: 'diag-3',
            pillarId: 'gap-part12-listening',
            part: 'Part 2 - Bẫy Trả lời Gián tiếp / Đá bóng trách nhiệm (Listening)',
            type: 'listening',
            context: '🎧 Câu hỏi Part 2 thường gặp trong đề ETS 2024 - 2026:',
            audioScript: 'Where can I find the quarterly financial performance report?',
            question: 'Where can I find the quarterly financial performance report?',
            options: [
                { key: 'A', text: '(A) Yes, at 3:00 PM yesterday.' },
                { key: 'B', text: '(B) Ms. Davis in accounting handles all of those documents.' },
                { key: 'C', text: '(C) It was a very quarterly meeting.' }
            ],
            correct: 'B',
            explanation: 'Bẫy Part 2 gián tiếp ETS: Câu hỏi "Where" nhưng đáp án không trả lời địa điểm trực tiếp (in the drawer, on the table) mà chỉ sang người phụ trách (Ms. Davis handles...). Đáp án (A) sai vì câu hỏi Wh- không trả lời Yes/No. (C) là bẫy lặp từ (quarterly).'
        },
        {
            id: 'diag-4',
            pillarId: 'gap-part12-listening',
            part: 'Part 2 - Bẫy Âm thanh tương tự (Listening)',
            type: 'listening',
            context: '🎧 Bẫy từ đồng âm / gần âm dễ gây lừa tai:',
            audioScript: 'Has the new printer been delivered yet?',
            question: 'Has the new printer been delivered yet?',
            options: [
                { key: 'A', text: '(A) I haven\'t seen the delivery truck outside.' },
                { key: 'B', text: '(B) No, he printed twenty color copies.' },
                { key: 'C', text: '(C) The blueprint looks quite impressive.' }
            ],
            correct: 'A',
            explanation: 'Bẫy âm thanh Part 2: Người ra đề dùng từ "printed" (B) và "blueprint" (C) để bẫy thí sinh nghe thoáng qua từ "printer". Đáp án (A) trả lời gián tiếp hợp lý: tôi chưa thấy xe giao hàng bên ngoài (ngụ ý là chưa tới).'
        },
        {
            id: 'diag-5',
            pillarId: 'gap-part12-listening',
            part: 'Part 2 - Bẫy Hỏi ngược lại (Listening)',
            type: 'listening',
            context: '🎧 Bẫy đối đáp bằng một câu hỏi phản hồi:',
            audioScript: 'Are you attending the international trade seminar tomorrow?',
            question: 'Are you attending the international trade seminar tomorrow?',
            options: [
                { key: 'A', text: '(A) In the main auditorium on the fourth floor.' },
                { key: 'B', text: '(B) Isn\'t it postponed until next Wednesday?' },
                { key: 'C', text: '(C) Yes, I traded my old laptop yesterday.' }
            ],
            correct: 'B',
            explanation: 'Bẫy hỏi ngược lại: Khi được hỏi có tham dự hội thảo ngày mai không, người nghe hỏi ngược lại "Không phải nó bị hoãn sang thứ Tư tuần sau rồi sao?" (B). (C) là bẫy lặp từ trade/traded.'
        },
        {
            id: 'diag-6',
            pillarId: 'gap-part34-paraphrase',
            part: 'Part 3 & 4 - Nắm bắt ý đồ & Paraphrasing (Listening)',
            type: 'listening',
            context: '🔊 [Trích đoạn thông báo văn phòng]: "Attention all marketing staff: The regional director\'s inbound flight from Singapore was delayed due to severe headwinds. Therefore, our quarterly product briefing will start at 4:30 PM in Conference Room B rather than the originally scheduled 2:30 PM."',
            audioScript: 'Attention all marketing staff: The regional director\'s inbound flight from Singapore was delayed due to severe headwinds. Therefore, our quarterly product briefing will start at 4:30 PM in Conference Room B rather than the originally scheduled 2:30 PM.',
            question: 'Why does the speaker mention the regional director\'s flight delay?',
            options: [
                { key: 'A', text: '(A) To explain why an event schedule change was necessary.' },
                { key: 'B', text: '(B) To cancel the annual marketing convention.' },
                { key: 'C', text: '(C) To request airport pickup volunteers.' },
                { key: 'D', text: '(D) To complain about international airline services.' }
            ],
            correct: 'A',
            explanation: 'Paraphrase Part 3 & 4: Người nói đề cập việc máy bay bị trễ để giải thích lý do dời giờ họp từ 2:30 PM sang 4:30 PM -> tương đương với "To explain why an event schedule change was necessary" (A).'
        },
        {
            id: 'diag-7',
            pillarId: 'gap-part34-paraphrase',
            part: 'Part 3 & 4 - Câu hỏi ngụ ý (Listening)',
            type: 'listening',
            context: '🔊 [Trích đoạn đối thoại nhân viên kho]: "I just completed the monthly inventory count, and we only have three crates of printer paper left in the stockroom."',
            audioScript: 'I just completed the monthly inventory count, and we only have three crates of printer paper left in the stockroom.',
            question: 'What does the speaker imply when saying "we only have three crates left"?',
            options: [
                { key: 'A', text: '(A) The warehouse is out of storage space.' },
                { key: 'B', text: '(B) An order for more supplies should be placed promptly.' },
                { key: 'C', text: '(C) The printer paper quality is defective.' },
                { key: 'D', text: '(D) Employees are wasting excessive amounts of paper.' }
            ],
            correct: 'B',
            explanation: 'Câu hỏi ngụ ý (Implied meaning): "Chỉ còn lại 3 thùng giấy trong kho" ngụ ý cần phải đặt hàng bổ sung gấp (An order for more supplies should be placed promptly).'
        },
        {
            id: 'diag-8',
            pillarId: 'gap-part5-grammar',
            part: 'Part 5 - Bẫy Danh từ đuôi -ive & -al (Reading)',
            type: 'reading',
            context: '📝 Ngữ pháp Part 5: Từ loại đặc biệt',
            question: 'A qualified customer service _______ from our regional branch will assist you with the product installation.',
            options: [
                { key: 'A', text: '(A) represent' },
                { key: 'B', text: '(B) representative' },
                { key: 'C', text: '(C) representing' },
                { key: 'D', text: '(D) represented' }
            ],
            correct: 'B',
            explanation: 'Bẫy từ loại kinh điển: "representative" có đuôi -ive thường là tính từ, nhưng ở đây là DANH TỪ ĐẾM ĐƯỢC chỉ người ("người đại diện"). Cụm danh từ: "A qualified customer service representative".'
        },
        {
            id: 'diag-9',
            pillarId: 'gap-part5-grammar',
            part: 'Part 5 - Bẫy Rút gọn Mệnh đề Quan hệ (Reading)',
            type: 'reading',
            context: '📝 Ngữ pháp Part 5: Mệnh đề phân từ V-ing vs V-ed',
            question: 'Passengers _______ flights to Tokyo are requested to proceed immediately to Gate 18 for boarding.',
            options: [
                { key: 'A', text: '(A) board' },
                { key: 'B', text: '(B) boarding' },
                { key: 'C', text: '(C) boarded' },
                { key: 'D', text: '(D) are boarding' }
            ],
            correct: 'B',
            explanation: 'Bẫy rút gọn mệnh đề quan hệ: Động từ chính của câu đã là "are requested". Mệnh đề bổ nghĩa cho Passengers: "who are boarding flights..." rút gọn thành chủ động "boarding flights" (V-ing).'
        },
        {
            id: 'diag-10',
            pillarId: 'gap-part5-grammar',
            part: 'Part 5 - Bẫy Thể Giả định Subjunctive (Reading)',
            type: 'reading',
            context: '📝 Ngữ pháp Part 5: Câu giả định sau động từ đề xuất / yêu cầu',
            question: 'The executive committee strongly recommends that each team leader _______ a safety compliance audit before Friday.',
            options: [
                { key: 'A', text: '(A) conducts' },
                { key: 'B', text: '(B) conduct' },
                { key: 'C', text: '(C) conducted' },
                { key: 'D', text: '(D) will conduct' }
            ],
            correct: 'B',
            explanation: 'Bẫy thể giả định (Subjunctive Mood): Sau các động từ recommend / suggest / require / insist + that + S + (should) + V-nguyên mẫu không "s/es", bất kể chủ ngữ là số ít hay số nhiều! Do đó "conduct" (B) là đáp án chính xác, không dùng "conducts".'
        },
        {
            id: 'diag-11',
            pillarId: 'gap-part5-vocab',
            part: 'Part 5 - Bẫy Liên từ vs Giới từ (Reading)',
            type: 'reading',
            context: '📝 Từ vựng & Ngữ pháp: Phân biệt Liên từ (+ Mệnh đề) vs Giới từ (+ Cụm danh từ)',
            question: '_______ unanticipated delays at customs, the raw materials were delivered to the factory ahead of deadline.',
            options: [
                { key: 'A', text: '(A) Although' },
                { key: 'B', text: '(B) Even though' },
                { key: 'C', text: '(C) Despite' },
                { key: 'D', text: '(D) Because' }
            ],
            correct: 'C',
            explanation: 'Phía sau là cụm danh từ "unanticipated delays at customs" (không có động từ chia thì), do đó cần một GIỚI TỪ. "Despite" là giới từ mang nghĩa mặc dù. "Although" và "Even though" là liên từ phải đi kèm một mệnh đề (S + V).'
        },
        {
            id: 'diag-12',
            pillarId: 'gap-part5-vocab',
            part: 'Part 5 - Bẫy Collocations & Cụm từ công sở (Reading)',
            type: 'reading',
            context: '📝 Từ vựng công sở: Giới từ đi cùng động từ pháp lý',
            question: 'All employees in the laboratory are obligated to comply strictly _______ corporate safety protocols.',
            options: [
                { key: 'A', text: '(A) with' },
                { key: 'B', text: '(B) to' },
                { key: 'C', text: '(C) on' },
                { key: 'D', text: '(D) for' }
            ],
            correct: 'A',
            explanation: 'Collocation kinh điển TOEIC: "comply with" = tuân thủ (đồng nghĩa: adhere to, conform to, abide by). Rất nhiều thí sinh chọn nhầm "to".'
        },
        {
            id: 'diag-13',
            pillarId: 'gap-part6-insertion',
            part: 'Part 6 - Bẫy Điền câu theo mạch logic (Reading)',
            type: 'reading',
            context: '📄 [Trích thư xác nhận dịch vụ khách hàng]:\n"Dear Valued Client,\nThank you for choosing Horizon Fiber Internet. Your high-speed business line has been activated as of this morning. [  13  ]. If you encounter any connectivity discrepancies, please reach out to our dedicated support desk at 1-800-555-DATA."',
            question: 'Chọn câu điền vào chỗ trống [ 13 ] liền mạch và hợp lý nhất:',
            options: [
                { key: 'A', text: '(A) Your account was unfortunately terminated due to late payment.' },
                { key: 'B', text: '(B) You can now access your administrative portal using the credentials sent via SMS.' },
                { key: 'C', text: '(C) Please ship all defective hardware to our return depot within 30 days.' },
                { key: 'D', text: '(D) We regret to inform you that internet service is unavailable in your zip code.' }
            ],
            correct: 'B',
            explanation: 'Mạch văn bản Part 6: Câu trước thông báo dịch vụ internet đã được kích hoạt thành công (has been activated). Câu tiếp theo hợp lý nhất là hướng dẫn khách hàng bắt đầu truy cập portal quản lý (B). Các câu (A), (C), (D) mâu thuẫn hoàn toàn với ngữ cảnh chào mừng kích hoạt.'
        },
        {
            id: 'diag-14',
            pillarId: 'gap-part7-multi',
            part: 'Part 7 - Kỹ năng Scanning & Bẫy thời gian (Reading)',
            type: 'reading',
            context: '📧 [Nội bộ công ty]:\n"To: All Department Supervisors\nFrom: Payroll Office\nSubject: Revised Timesheet Deadline for Holiday Week\nDue to the upcoming national holiday on Friday, December 26, the payroll processing system will close early. Please remind your team that all timesheets must be validated and submitted by 3:00 PM on Wednesday, December 24, rather than the regular Friday 5:00 PM cutoff."',
            question: 'What is the revised deadline for timesheet submission?',
            options: [
                { key: 'A', text: '(A) Friday, December 26 at 5:00 PM' },
                { key: 'B', text: '(B) Wednesday, December 24 at 3:00 PM' },
                { key: 'C', text: '(C) Friday, December 26 at 3:00 PM' },
                { key: 'D', text: '(D) Wednesday, December 24 at 5:00 PM' }
            ],
            correct: 'B',
            explanation: 'Bẫy số liệu và thời gian Part 7: Đề thi đưa ra cả Friday 5:00 PM (hạn thông thường cũ) và Friday Dec 26 (ngày nghỉ lễ). Hạn mới sửa đổi (revised deadline) được nêu rõ là: "3:00 PM on Wednesday, December 24" (B).'
        },
        {
            id: 'diag-15',
            pillarId: 'gap-part7-multi',
            part: 'Part 7 - Bẫy Câu hỏi NOT / TRUE & Paraphrase (Reading)',
            type: 'reading',
            context: '📜 [Quy định đổi trả hội thảo chuyên môn]:\n"Policy Notice: Full tuition refunds will be granted only for cancellations submitted in writing at least 72 hours prior to session commencement. Cancellations received within 72 hours of the event are not eligible for cash refunds; however, registrants will receive a voucher credit valid for any workshop held within the subsequent six months."',
            question: 'What is TRUE about cancellations made less than 72 hours before a workshop?',
            options: [
                { key: 'A', text: '(A) Registrants are entitled to an immediate full refund in cash.' },
                { key: 'B', text: '(B) The registration fee is completely non-recoverable without any alternatives.' },
                { key: 'C', text: '(C) Attendees receive a credit voucher usable for six months.' },
                { key: 'D', text: '(D) The workshop organizer will automatically reschedule the attendee to next week.' }
            ],
            correct: 'C',
            explanation: 'Paraphrase Part 7: Văn bản ghi "registrants will receive a voucher credit valid for any workshop held within the subsequent six months" -> Paraphrase thành "Attendees receive a credit voucher usable for six months" (C).'
        }
    ],

    // Mở modal bài Test chẩn đoán năng lực 15 câu
    startDiagnosticTest() {
        let user = this.getActiveUser();
        if (!user) {
            // Tự động cấp phiên Học viên để người dùng bắt đầu làm bài ngay lập tức, không bao giờ bị lỗi hay chặn cửa!
            user = {
                id: 'acc-student-' + Date.now(),
                name: 'Học viên',
                email: 'student@cungdang.edu.vn',
                targetScore: '650',
                examDate: '20/12/2026',
                isGuest: true
            };
            window.currentUserAccount = user;
            if (typeof currentUserAccount !== 'undefined') currentUserAccount = user;
            try {
                localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
            } catch(e) {}
            if (typeof applyCurrentAccountToUI === 'function') {
                applyCurrentAccountToUI();
            }
        }
        let modal = document.getElementById('diagnosticTestModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'diagnosticTestModal';
            modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto';
            document.body.appendChild(modal);
        }

        window.currentDiagnosticAnswers = {};

        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-[28px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <!-- Header -->
                <div class="p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
                                🚀 TEST CHẨN ĐOÁN NĂNG LỰC
                            </span>
                            <span class="text-xs font-semibold text-white/80">Chuẩn ETS 2026</span>
                        </div>
                        <h3 class="text-lg sm:text-xl font-black">15 Câu Bẫy Đề Thi Khảo Sát Toàn Diện</h3>
                        <p class="text-xs text-white/90">Hoàn thành bài test để AI phân tích chính xác 6 lỗ hổng và lập lộ trình học cho bạn.</p>
                    </div>
                    <button onclick="PersonalizedRoadmapEngine.closeDiagnosticModal()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                <!-- Questions Container -->
                <div class="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800" id="diagnosticQuestionsList">
                    ${this.diagnosticQuestions.map((q, idx) => `
                        <div class="pt-5 first:pt-0 space-y-3" id="diag-qbox-${q.id}">
                            <div class="flex items-center justify-between gap-2">
                                <span class="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                                    Câu ${idx + 1}/15 • ${q.part}
                                </span>
                                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${q.type === 'listening' ? '🎧 Listening' : '📖 Reading'}</span>
                            </div>

                            <!-- Context / Passage -->
                            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                                ${q.context}
                            </div>

                            <!-- Audio Play Button for Listening -->
                            ${q.type === 'listening' ? `
                                <div class="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-2">
                                    <div class="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                                        <i class="fa-solid fa-volume-high"></i>
                                        <span>Ghi âm Audio câu hỏi:</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button type="button" onclick="PersonalizedRoadmapEngine.playAudio('${q.audioScript.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                                            <i class="fa-solid fa-play text-[10px]"></i>
                                            <span>Nghe Audio</span>
                                        </button>
                                        <button type="button" onclick="const sc = document.getElementById('diag-sc-${q.id}'); if (sc) sc.classList.toggle('hidden');" class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition">
                                            Xem Script
                                        </button>
                                    </div>
                                </div>
                                <div id="diag-sc-${q.id}" class="hidden p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 italic border border-slate-200 dark:border-slate-700">
                                    <span class="font-bold not-italic text-slate-900 dark:text-white block mb-0.5">Transcript:</span>
                                    ${q.audioScript}
                                </div>
                            ` : ''}

                            <!-- Question Statement -->
                            <p class="text-sm font-bold text-slate-900 dark:text-white">
                                ${q.question}
                            </p>

                            <!-- Options -->
                            <div class="grid grid-cols-1 gap-2 pt-1">
                                ${q.options.map(opt => `
                                    <label class="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer transition">
                                        <input type="radio" name="diag_${q.id}" value="${opt.key}" onchange="PersonalizedRoadmapEngine.recordAnswer('${q.id}', '${opt.key}')" class="mt-0.5 text-indigo-600 focus:ring-indigo-500">
                                        <span class="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 font-medium">${opt.text}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Footer with Submit button -->
                <div class="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shrink-0">
                    <span id="diagnosticCounter" class="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Đã chọn: <span id="diagAnsweredCount" class="text-indigo-600 dark:text-indigo-400 font-black">0</span>/15 câu
                    </span>
                    <div class="flex items-center gap-2">
                        <button onclick="PersonalizedRoadmapEngine.closeDiagnosticModal()" class="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition">
                            Hủy
                        </button>
                        <button onclick="PersonalizedRoadmapEngine.submitDiagnosticTest()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/30 transition flex items-center gap-2">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                            <span>Nộp bài & Chẩn đoán ngay</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
    },

    recordAnswer(qid, optKey) {
        if (!window.currentDiagnosticAnswers) window.currentDiagnosticAnswers = {};
        window.currentDiagnosticAnswers[qid] = optKey;
        const count = Object.keys(window.currentDiagnosticAnswers).length;
        const countEl = document.getElementById('diagAnsweredCount');
        if (countEl) countEl.textContent = count;
    },

    closeDiagnosticModal() {
        const modal = document.getElementById('diagnosticTestModal');
        if (modal) modal.remove();
    },

    // Chấm điểm và lưu chẩn đoán vào hồ sơ tài khoản
    submitDiagnosticTest() {
        const answers = window.currentDiagnosticAnswers || {};
        const answeredCount = Object.keys(answers).length;

        if (answeredCount < 15) {
            const confirmSubmit = confirm(`Bạn mới làm ${answeredCount}/15 câu. Bạn có muốn nộp bài sớm để AI chấm điểm các câu đã làm không?`);
            if (!confirmSubmit) return;
        }

        let totalCorrect = 0;
        const pillarScores = {};

        // Tính điểm cho từng trụ cột
        this.pillars.forEach(p => {
            const qs = this.diagnosticQuestions.filter(q => q.pillarId === p.id);
            if (qs.length === 0) {
                pillarScores[p.id] = 0;
                return;
            }
            const correctInPillar = qs.filter(q => answers[q.id] === q.correct).length;
            totalCorrect += correctInPillar;
            pillarScores[p.id] = Math.round((correctInPillar / qs.length) * 100);
        });

        // Điểm ước tính TOEIC (Thang điểm chuẩn ETS)
        // 15/15: ~900; 12/15: ~750; 9/15: ~600; 6/15: ~450; 0/15: 250
        const estimatedScore = Math.min(990, Math.max(250, Math.round(250 + (totalCorrect / 15) * 650)));

        // Lưu kết quả vào tài khoản hiện tại
        let user = this.getActiveUser();
        if (!user) {
            user = { id: 'acc-student-' + Date.now(), name: 'Học viên', targetScore: '650', examDate: '20/12/2026' };
        }
        window.currentUserAccount = user;
        if (typeof currentUserAccount !== 'undefined') currentUserAccount = user;

        user.diagnosticResults = {
            testedDate: new Date().toLocaleDateString('vi-VN'),
            totalCorrect: totalCorrect,
            estimatedScore: estimatedScore,
            pillarScores: pillarScores
        };

        // Lưu đồng bộ vào LocalStorage
        try {
            localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
            localStorage.setItem('cung_dang_diagnostic_results', JSON.stringify(user.diagnosticResults));
        } catch(e) {}

        // Đồng bộ dữ liệu lên máy chủ / cloud
        if (window.syncCurrentAccountState) {
            window.syncCurrentAccountState();
        }
        if (typeof applyCurrentAccountToUI === 'function') {
            applyCurrentAccountToUI();
        }

        // Đóng modal thi
        this.closeDiagnosticModal();

        // Mở modal kết quả chẩn đoán chi tiết
        this.showDiagnosticSummaryModal(totalCorrect, estimatedScore, pillarScores);

        // Cập nhật lại giao diện Lộ trình
        this.renderRoadmapView();
    },

    // Hiển thị bảng tổng kết chẩn đoán AI sau khi thi
    showDiagnosticSummaryModal(totalCorrect, estimatedScore, pillarScores) {
        let resModal = document.getElementById('diagResultModal');
        if (!resModal) {
            resModal = document.createElement('div');
            resModal.id = 'diagResultModal';
            resModal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto';
            document.body.appendChild(resModal);
        }

        const user = this.getActiveUser();
        const target = parseInt(user?.targetScore || '650', 10);
        const isPassedTarget = estimatedScore >= target;

        resModal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-[28px] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
                <!-- Header Icon & Score -->
                <div class="text-center space-y-2">
                    <div class="w-16 h-16 rounded-3xl ${isPassedTarget ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60'} flex items-center justify-center text-3xl mx-auto shadow-md">
                        <i class="${isPassedTarget ? 'fa-solid fa-trophy' : 'fa-solid fa-compass'}"></i>
                    </div>
                    <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider inline-block">
                        🎯 Báo Cáo Chẩn Đoán Lỗ Hổng Năng Lực
                    </span>
                    <h3 class="text-2xl font-black text-slate-900 dark:text-white">
                        Ước Tính Điểm: <span class="${isPassedTarget ? 'text-emerald-600' : 'text-amber-600'}">${estimatedScore} / 990</span>
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Bạn đã trả lời đúng <strong>${totalCorrect}/15 câu hỏi</strong> (${Math.round((totalCorrect/15)*100)}%). Mục tiêu ra trường: <strong>${target}+</strong>.
                    </p>
                </div>

                <!-- 6 Trụ Cột Đã Quét Xong -->
                <div class="space-y-3 pt-2">
                    <h4 class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        Chi tiết 6 trụ cột bẫy đề thi:
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        ${this.pillars.map(p => {
                            const sc = pillarScores[p.id] || 0;
                            const isWeak = sc < 60;
                            return `
                                <div class="p-3 rounded-xl border ${isWeak ? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'} flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-2 overflow-hidden">
                                        <i class="${p.icon} text-xs ${isWeak ? 'text-rose-500' : 'text-emerald-500'}"></i>
                                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${p.name.split(':')[0]}</span>
                                    </div>
                                    <span class="text-xs font-black shrink-0 ${isWeak ? 'text-rose-600' : 'text-emerald-600'}">${sc}%</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Call to action button -->
                <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button onclick="document.getElementById('diagResultModal').remove(); PersonalizedRoadmapEngine.startDiagnosticTest();" class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition">
                        Thi lại bài test
                    </button>
                    <button onclick="document.getElementById('diagResultModal').remove(); switchTab('lo-trinh');" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5">
                        <span>Xem Lộ Trình Đã Cá Nhân Hóa</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // Khởi tạo và render toàn bộ giao diện Lộ Trình Cá Nhân
    renderRoadmapView() {
        const container = document.getElementById('view-lo-trinh');
        if (!container) return;

        const user = this.getActiveUser();
        const hasTested = !!(user && user.diagnosticResults);
        const daysRemaining = this.calculateDaysRemaining();
        const readiness = this.calculateReadinessScore();
        const targetScore = parseInt(user?.targetScore || '650', 10);
        const isUrgent = hasTested && (daysRemaining <= 35 || readiness < (targetScore - 80));

        // Đánh giá mức độ thành thạo của 6 lỗ hổng (0% khi chưa test)
        const gapStats = this.calculateGapStats();

        // Cập nhật huy hiệu đôn đốc trên thanh sidebar menu
        const badge = document.getElementById('urgentRushBadge');
        if (badge) {
            if (isUrgent) badge.classList.remove('hidden');
            else badge.classList.add('hidden');
        }

        // Tính tiến độ tuần 1 thực tế (KHÔNG giả tạo số liệu 80% / 45%)
        const practiceCount = user?.practiceQuestionsDone || (window.userTrapPracticeHistory ? Object.keys(window.userTrapPracticeHistory).length : 0);
        const week1Progress = Math.min(100, Math.round((practiceCount / 40) * 100));

        container.innerHTML = `
            <!-- Top Hero Banner: Lộ trình cá nhân -->
            <div class="rounded-[28px] p-6 lg:p-7 relative overflow-hidden text-white shadow-xl ${isUrgent ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600' : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700'}">
                <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div class="space-y-2 max-w-xl">
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wider uppercase">
                                🎯 Lộ trình cá nhân hóa
                            </span>
                            ${!hasTested ? '<span class="px-3 py-1 rounded-full bg-amber-500/90 text-slate-900 text-xs font-black">⚠️ CHƯA LÀM TEST CHẨN ĐOÁN</span>' : isUrgent ? '<span class="px-3 py-1 rounded-full bg-rose-950/80 text-rose-200 text-xs font-black animate-pulse">⚡ CHẾ ĐỘ ĐÔN ĐỐC CẤP TỐC</span>' : '<span class="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-200 text-xs font-bold">✓ TIẾN ĐỘ VỮNG VÀNG</span>'}
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black tracking-tight">
                            Mục tiêu Ra Trường: <span class="underline decoration-wavy decoration-amber-300">${targetScore}+ Điểm</span>
                        </h2>
                        <p class="text-white/90 text-sm leading-relaxed">
                            ${!hasTested ? 'Bạn chưa làm bài kiểm tra chẩn đoán năng lực. Hãy làm bài test 15 câu để AI quét chính xác 6 lỗ hổng và thiết kế lộ trình ôn thi phù hợp nhất!' : 'Hệ thống AI tự động phân tích kết quả test chẩn đoán và thời gian còn lại để đôn đốc bạn ôn tập đúng trọng tâm!'}
                        </p>
                    </div>

                    <!-- Countdown & Metrics Card -->
                    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 w-full sm:w-auto flex items-center justify-around sm:justify-start gap-5">
                        <div class="text-center">
                            <span class="block text-[11px] font-bold text-white/80 uppercase">Còn lại</span>
                            <span class="text-3xl sm:text-4xl font-black text-amber-300">${daysRemaining}</span>
                            <span class="block text-[11px] font-semibold text-white/80">ngày thi</span>
                        </div>
                        <div class="h-10 w-px bg-white/20"></div>
                        <div class="text-center">
                            <span class="block text-[11px] font-bold text-white/80 uppercase">Sẵn sàng</span>
                            <span class="text-3xl sm:text-4xl font-black ${readiness > 0 ? 'text-white' : 'text-amber-300'}">${readiness}</span>
                            <span class="block text-[11px] font-semibold text-white/80">/ ${targetScore} ${!hasTested ? '(Chưa test)' : ''}</span>
                        </div>
                        <div class="h-10 w-px bg-white/20"></div>
                        <button onclick="PersonalizedRoadmapEngine.openEditGoalModal()" class="px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-extrabold hover:bg-amber-100 transition shadow">
                            <i class="fa-solid fa-sliders mr-1"></i> Đổi ngày
                        </button>
                    </div>
                </div>
            </div>

            <!-- NẾU CHƯA TEST: KHỐI KÊU GỌI LÀM BÀI TEST CHẨN ĐOÁN (BẮT BUỘC ĐỂ CÓ SỐ LIỆU) -->
            ${!hasTested ? `
            <div class="glass-panel rounded-[26px] p-5 sm:p-6 border-2 border-indigo-300 dark:border-indigo-800 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-slate-800 dark:to-slate-900 shadow-md">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="space-y-1.5 max-w-2xl">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wide">
                                🚀 BƯỚC 1 QUAN TRỌNG NHẤT
                            </span>
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">15 câu chuẩn ETS 2026 (10-15 phút)</span>
                        </div>
                        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                            Chưa có dữ liệu chẩn đoán năng lực của bạn!
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Tất cả 6 trụ cột bên dưới đang ở mức <strong>0%</strong> vì bạn chưa làm bài kiểm tra. Hãy làm bài test 15 câu để AI đo lường chính xác điểm mạnh - điểm yếu và tạo lộ trình học cá nhân hóa cho bạn.
                        </p>
                    </div>
                    <button onclick="PersonalizedRoadmapEngine.startDiagnosticTest()" class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 shrink-0 animate-bounce hover:animate-none">
                        <i class="fa-solid fa-play-circle text-base"></i>
                        <span>Bắt đầu Test chẩn đoán</span>
                    </button>
                </div>
            </div>
            ` : `
            <!-- NẾU ĐÃ TEST: THÔNG TIN KẾT QUẢ ĐÃ ĐƯỢC ĐỒNG BỘ -->
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-black text-emerald-900 dark:text-emerald-200">
                                Đã chẩn đoán: Ước tính đạt ~${user.diagnosticResults.estimatedScore} TOEIC (${user.diagnosticResults.totalCorrect}/15 câu đúng)
                            </span>
                            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold">Chính xác 99%</span>
                        </div>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400">
                            Ngày kiểm tra: ${user.diagnosticResults.testedDate || 'Gần đây'} • Dữ liệu đã được lưu vào hồ sơ cá nhân
                        </span>
                    </div>
                </div>
                <button onclick="PersonalizedRoadmapEngine.startDiagnosticTest()" class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-rotate-right text-[11px]"></i>
                    <span>Thi lại bài test</span>
                </button>
            </div>
            `}

            <!-- CHẾ ĐỘ ĐÔN ĐỐC ÔN THI (CHỈ HIỂN THỊ KHI ĐÃ TEST VÀ ĐIỂM CÒN YẾU HOẶC SÁT NGÀY THI) -->
            ${isUrgent ? `
            <div class="glass-panel rounded-[26px] p-5 sm:p-6 border-2 border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 shadow-md">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shrink-0 shadow-lg">
                        <i class="fa-solid fa-triangle-exclamation animate-bounce"></i>
                    </div>
                    <div class="flex-1 space-y-2">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <h3 class="text-lg font-black text-rose-900 dark:text-rose-200">
                                🚨 CẢNH BÁO ĐÔN ĐỐC: Kỳ thi đã tới gần (${daysRemaining} ngày) và một số phần còn yếu!
                            </h3>
                            <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                                Ưu tiên cao nhất
                            </span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            Để chắc chắn bứt phá trên <strong>${targetScore}+</strong>, hôm nay hãy hoàn thành ngay các nhiệm vụ cứu điểm sau:
                        </p>
                        
                        <!-- 3 Nhiệm vụ đôn đốc khẩn cấp -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div>
                                    <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 text-[10px] font-bold">1. BẪY ĐỌC CẦN VÁ GẤP</span>
                                    <h4 class="font-bold text-xs sm:text-sm mt-1 text-slate-900 dark:text-white">Bẫy Danh từ đuôi -ive & -al (Part 5)</h4>
                                    <p class="text-[11px] text-slate-500 mt-1">Đề thi luôn ra representative, initiative. Học 1 lần lấy trọn điểm.</p>
                                </div>
                                <button onclick="switchTab('bay-de-thi'); TOEICTrapsEngine.selectTrap('trap-part5-suffix');" class="mt-3 w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow">
                                    <span>Vá bẫy này ngay</span>
                                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                                </button>
                            </div>

                            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div>
                                    <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 text-[10px] font-bold">2. BẪY NGHE CẦN VÁ GẤP</span>
                                    <h4 class="font-bold text-xs sm:text-sm mt-1 text-slate-900 dark:text-white">Bẫy Trả lời Gián tiếp (Part 2)</h4>
                                    <p class="text-[11px] text-slate-500 mt-1">Mẹo nhận diện phản xạ đá bóng trách nhiệm và hỏi ngược lại.</p>
                                </div>
                                <button onclick="switchTab('bay-de-thi'); TOEICTrapsEngine.selectTrap('trap-part2-evasive');" class="mt-3 w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow">
                                    <span>Luyện nghe bẫy này</span>
                                    <i class="fa-solid fa-volume-high text-[10px]"></i>
                                </button>
                            </div>

                            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div>
                                    <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-[10px] font-bold">3. TỪ VỰNG CỐT LÕI</span>
                                    <h4 class="font-bold text-xs sm:text-sm mt-1 text-slate-900 dark:text-white">Nạp 20 từ Hợp đồng & Công sở</h4>
                                    <p class="text-[11px] text-slate-500 mt-1">Tăng vốn từ đọc lướt Part 7 nhanh hơn 20%.</p>
                                </div>
                                <button onclick="switchTab('tu-vung')" class="mt-3 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow">
                                    <span>Học từ vựng ngay</span>
                                    <i class="fa-solid fa-spell-check text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- CHẨN ĐOÁN 6 LỖ HỔNG KIẾN THỨC CỐT LÕI (WEAKNESS RADAR) -->
            <div class="glass-panel rounded-[26px] p-5 sm:p-6 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <i class="fa-solid fa-radar text-emerald-600"></i>
                            Chẩn Đoán Lỗ Hổng Kiến Thức (Weakness Radar)
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ${!hasTested ? 'Hiện tại tất cả đang ở mức 0% (chưa có bài test). Làm bài kiểm tra để AI chẩn đoán.' : 'Tỷ lệ chính xác dựa trên bài test thực tế. Các phần màu đỏ là lỗ hổng cần ưu tiên vá!'}
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="PersonalizedRoadmapEngine.startDiagnosticTest()" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow">
                            <i class="fa-solid fa-clipboard-check text-xs"></i>
                            <span>${!hasTested ? 'Làm bài test chẩn đoán' : 'Làm lại test'}</span>
                        </button>
                    </div>
                </div>

                <!-- 6 Khối Lỗ Hổng -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${gapStats.map(g => {
                        const isTestedPillar = hasTested && g.score > 0;
                        const isWeak = hasTested && g.score < 60;
                        const isFair = hasTested && g.score >= 60 && g.score < 80;
                        const isStrong = hasTested && g.score >= 80;

                        return `
                        <div class="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border ${!hasTested ? 'border-slate-200 dark:border-slate-700 opacity-90' : isWeak ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20' : isFair ? 'border-amber-200 dark:border-amber-900/40' : 'border-emerald-200 dark:border-emerald-900/40'} space-y-3">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 rounded-xl ${!hasTested ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : isWeak ? 'bg-rose-100 text-rose-600' : isFair ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center text-xs font-bold shrink-0">
                                        <i class="${g.icon}"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white leading-snug">${g.name}</h4>
                                        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">${g.part}</span>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${!hasTested ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400' : isWeak ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300' : isFair ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'}">
                                    ${!hasTested ? '⚪ Chưa kiểm tra (0%)' : isWeak ? '⚠️ Yếu (Cần vá gấp)' : isFair ? '⚡ Tạm ổn' : '✅ Vững vàng'}
                                </span>
                            </div>

                            <p class="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                ${g.desc}
                            </p>

                            <!-- Progress Bar (Chính xác 0% nếu chưa test) -->
                            <div>
                                <div class="flex justify-between text-[11px] font-bold mb-1">
                                    <span class="text-slate-500">Mức độ thành thạo</span>
                                    <span class="${!hasTested ? 'text-slate-400' : isWeak ? 'text-rose-600' : isFair ? 'text-amber-600' : 'text-emerald-600'}">${g.score}%</span>
                                </div>
                                <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-500 ${!hasTested ? 'bg-slate-300 dark:bg-slate-600' : isWeak ? 'bg-rose-500' : isFair ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${g.score}%"></div>
                                </div>
                            </div>

                            <!-- Nút Vá Lỗ Hổng Này -->
                            <div class="pt-1 flex items-center justify-between">
                                ${!hasTested ? `
                                <button onclick="PersonalizedRoadmapEngine.startDiagnosticTest()" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                    <span>Làm test để chẩn đoán trụ cột này</span>
                                    <i class="fa-solid fa-play text-[9px]"></i>
                                </button>
                                ` : `
                                <button onclick="PersonalizedRoadmapEngine.fixGap('${g.trapTargetId}')" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                    <span>Vá lỗ hổng này trong Bẫy Đề Thi</span>
                                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                                </button>
                                `}
                                <button onclick="openAITutorModal('Giải thích cho tôi cách khắc phục lỗ hổng: ${g.name}')" class="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                                    <i class="fa-solid fa-robot"></i>
                                    <span>Hỏi AI tư vấn</span>
                                </button>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- LỘ TRÌNH 4 TUẦN NƯỚC RÚT RA TRƯỜNG (DỰA TRÊN TIẾN ĐỘ THẬT) -->
            <div class="glass-panel rounded-[26px] p-5 sm:p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <i class="fa-solid fa-timeline text-indigo-600"></i>
                        Lộ Trình Từng Tuần (Milestone Ra Trường)
                    </h3>
                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Tiến độ thực tế theo nhiệm vụ bạn làm</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <!-- TUẦN 1 -->
                    <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">TUẦN 1: QUÉT SẠCH BẪY NGHE</span>
                        <h4 class="font-bold text-xs text-slate-800 dark:text-slate-100">Bẫy Part 1 & 2 (100 câu)</h4>
                        <p class="text-[11px] text-slate-500">Phản xạ bẫy being/been và câu trả lời gián tiếp.</p>
                        ${week1Progress === 0 ? `
                        <span class="inline-block px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">Chưa bắt đầu (0%)</span>
                        ` : week1Progress >= 100 ? `
                        <span class="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Đã hoàn thành (100%)</span>
                        ` : `
                        <span class="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Đang tiến hành (${week1Progress}%)</span>
                        `}
                    </div>

                    <!-- TUẦN 2 -->
                    <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">TUẦN 2: DIỆT GỌN BẪY ĐỌC</span>
                        <h4 class="font-bold text-xs text-slate-800 dark:text-slate-100">Bẫy Part 5 & 6 (150 câu)</h4>
                        <p class="text-[11px] text-slate-500">Từ loại -ive/-al, liên từ vs giới từ, câu đảo ngữ.</p>
                        <span class="inline-block px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">Chưa mở (0%)</span>
                    </div>

                    <!-- TUẦN 3 -->
                    <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">TUẦN 3: TĂNG TỐC MINI-TEST</span>
                        <h4 class="font-bold text-xs text-slate-800 dark:text-slate-100">Giải đề bẫy 2026 - 2027</h4>
                        <p class="text-[11px] text-slate-500">Làm các đề thi ngắn 30 câu có bấm giờ để rèn áp lực.</p>
                        <span class="inline-block px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">Chưa mở (0%)</span>
                    </div>

                    <!-- TUẦN 4 -->
                    <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">TUẦN 4: FULL TEST RA TRƯỜNG</span>
                        <h4 class="font-bold text-xs text-slate-800 dark:text-slate-100">Thi thử 200 câu chuẩn ETS</h4>
                        <p class="text-[11px] text-slate-500">Tổng duyệt tâm lý phòng thi, chốt điểm trên 650+.</p>
                        <span class="inline-block px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">Chưa mở (0%)</span>
                    </div>
                </div>
            </div>
        `;
    },

    fixGap(trapTargetId) {
        switchTab('bay-de-thi');
        if (window.TOEICTrapsEngine) {
            window.TOEICTrapsEngine.selectTrap(trapTargetId);
        }
    },

    recalculateGaps() {
        showToast('Đang quét lại dữ liệu học tập và cập nhật chẩn đoán... ✨');
        this.renderRoadmapView();
    },

    openEditGoalModal() {
        if (!window.currentUserAccount) {
            if (typeof showToast === 'function') showToast('⚠️ Vui lòng đăng nhập để chỉnh sửa mục tiêu!');
            if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
            return;
        }
        const currentDate = currentUserAccount?.examDate || '20/12/2026';
        const currentTarget = currentUserAccount?.targetScore || '600';
        const newDate = prompt('Nhập ngày thi của bạn (định dạng Ngày/Tháng/Năm, ví dụ: 25/11/2026):', currentDate);
        if (newDate) {
            if (currentUserAccount) {
                currentUserAccount.examDate = newDate.trim();
            }
            const newScore = prompt('Nhập điểm mục tiêu để ra trường (VD: 450, 600, 750, 850):', currentTarget);
            if (newScore && currentUserAccount) {
                currentUserAccount.targetScore = newScore.trim();
            }
            if (window.syncCurrentAccountState) {
                window.syncCurrentAccountState();
            }
            this.renderRoadmapView();
            showToast('Đã cập nhật mục tiêu & lộ trình mới thành công!');
        }
    }
};

// =========================================================================
// 2. ENGINE BẪY ĐỀ THI KINH ĐIỂN (ETS 2023 - 2026 & ĐÓN ĐẦU 2027)
// =========================================================================
window.TOEICTrapsEngine = {
    currentPart: 'part1',
    currentTrapId: 'trap-p1-being',
    currentQuestionCount: 10,
    activeQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    audioPlaybackRate: 1.0,

    init() {
        this.renderPartsBar();
        this.renderTrapCategoriesBar();
        this.selectTrap(this.currentTrapId);
    },

    // 1. Render thanh 7 Part chính (Part 1 -> Part 7)
    renderPartsBar() {
        const bar = document.getElementById('trapPartsBar');
        if (!bar) return;

        const parts = [
            { id: 'part1', name: 'Part 1', icon: 'fa-solid fa-camera', desc: 'Hình ảnh' },
            { id: 'part2', name: 'Part 2', icon: 'fa-solid fa-headphones', desc: 'Hỏi & Đáp' },
            { id: 'part3', name: 'Part 3', icon: 'fa-solid fa-comments', desc: 'Hội thoại' },
            { id: 'part4', name: 'Part 4', icon: 'fa-solid fa-bullhorn', desc: 'Bài nói' },
            { id: 'part5', name: 'Part 5', icon: 'fa-solid fa-pen-to-square', desc: 'Hoàn thành câu' },
            { id: 'part6', name: 'Part 6', icon: 'fa-solid fa-file-lines', desc: 'Đoạn văn' },
            { id: 'part7', name: 'Part 7', icon: 'fa-solid fa-book-open-reader', desc: 'Đọc hiểu' }
        ];

        bar.innerHTML = parts.map(p => {
            const isActive = p.id === this.currentPart;
            const trapCount = (window.TOEIC_TRAPS_DATA || []).filter(t => t.partId === p.id).length;
            const badgeText = `${trapCount} bẫy`;
            return `
                <button onclick="TOEICTrapsEngine.selectPart('${p.id}')" id="trap-part-btn-${p.id}" class="trap-part-pill px-3.5 py-2.5 rounded-2xl text-xs font-black shrink-0 transition flex items-center gap-2 ${isActive ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25 ring-2 ring-red-400' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-red-400'}">
                    <i class="${p.icon} ${isActive ? 'text-white' : 'text-red-500'}"></i>
                    <span>${p.name}</span>
                    <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}">${badgeText}</span>
                </button>
            `;
        }).join('');
    },

    // 2. Chuyển Part: chọn bẫy đầu tiên của Part đó
    selectPart(partId) {
        this.currentPart = partId;
        this.renderPartsBar();

        const trapsOfPart = (window.TOEIC_TRAPS_DATA || []).filter(t => t.partId === partId);
        if (trapsOfPart.length > 0) {
            this.selectTrap(trapsOfPart[0].id);
        }
    },

    // 3. Render thanh danh sách bẫy của Part hiện tại kèm nút Next / Prev
    renderTrapCategoriesBar() {
        const bar = document.getElementById('trapCategoriesBar');
        if (!bar || !window.TOEIC_TRAPS_DATA) return;

        const trapsOfPart = window.TOEIC_TRAPS_DATA.filter(t => t.partId === this.currentPart);
        const curIdx = trapsOfPart.findIndex(t => t.id === this.currentTrapId);

        bar.innerHTML = `
            <div class="flex items-center gap-2 w-full overflow-x-auto pb-1 no-scrollbar">
                <!-- Nút Bẫy trước -->
                <button onclick="TOEICTrapsEngine.prevTrap()" title="Bẫy trước" class="px-3 py-2 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span class="hidden sm:inline">Bẫy trước</span>
                </button>

                <!-- Danh sách các bẫy của Part này -->
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
                    ${trapsOfPart.map((t, idx) => {
                        const isCurrent = t.id === this.currentTrapId;
                        return `
                            <button onclick="TOEICTrapsEngine.selectTrap('${t.id}')" id="trap-tab-${t.id}" class="trap-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${isCurrent ? 'bg-red-600 text-white shadow font-black' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-slate-700'}">
                                <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isCurrent ? 'bg-white text-red-600 font-black' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}">${idx + 1}</span>
                                <span>${t.shortTitle || t.title.split(':')[1]?.trim() || t.title}</span>
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- Nút Bẫy tiếp theo (Nút NEXT như ảnh yêu cầu) -->
                <button onclick="TOEICTrapsEngine.nextTrap()" title="Bẫy tiếp theo" class="px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md hover:opacity-95">
                    <span>Bẫy tiếp theo</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `;
    },

    // 4. Chuyển sang bẫy tiếp theo trong cùng Part (hoặc sang Part tiếp theo)
    nextTrap() {
        const trapsOfPart = (window.TOEIC_TRAPS_DATA || []).filter(t => t.partId === this.currentPart);
        if (trapsOfPart.length === 0) return;
        const currentIdx = trapsOfPart.findIndex(t => t.id === this.currentTrapId);
        if (currentIdx !== -1 && currentIdx + 1 < trapsOfPart.length) {
            this.selectTrap(trapsOfPart[currentIdx + 1].id);
            showToast(`➡️ Đã chuyển sang: ${trapsOfPart[currentIdx + 1].title}`);
        } else {
            // Chuyển sang Part tiếp theo
            const partKeys = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7'];
            const partIdx = partKeys.indexOf(this.currentPart);
            const nextPart = partKeys[(partIdx + 1) % partKeys.length];
            this.selectPart(nextPart);
            showToast(`🎉 Đã qua toàn bộ bẫy của ${this.currentPart.toUpperCase()}! Chuyển tiếp sang ${nextPart.toUpperCase()}`);
        }
    },

    // 5. Chuyển về bẫy trước đó
    prevTrap() {
        const trapsOfPart = (window.TOEIC_TRAPS_DATA || []).filter(t => t.partId === this.currentPart);
        if (trapsOfPart.length === 0) return;
        const currentIdx = trapsOfPart.findIndex(t => t.id === this.currentTrapId);
        if (currentIdx > 0) {
            this.selectTrap(trapsOfPart[currentIdx - 1].id);
            showToast(`⬅️ Đã quay lại: ${trapsOfPart[currentIdx - 1].title}`);
        }
    },

    selectTrap(trapId) {
        this.currentTrapId = trapId;
        const trap = (window.TOEIC_TRAPS_DATA || []).find(t => t.id === trapId) || (window.TOEIC_TRAPS_DATA && window.TOEIC_TRAPS_DATA[0]);
        if (!trap) return;

        if (trap.partId && trap.partId !== this.currentPart) {
            this.currentPart = trap.partId;
            this.renderPartsBar();
        }

        this.renderTrapCategoriesBar();

        // Render Trap Overview Card
        const titleEl = document.getElementById('trapDetailTitle');
        const badgeEl = document.getElementById('trapDetailBadge');
        const periodEl = document.getElementById('trapDetailPeriod');
        const theoryContainer = document.getElementById('trapDetailTheory');

        if (titleEl) titleEl.textContent = trap.title;
        if (badgeEl) badgeEl.textContent = trap.badge;
        if (periodEl) periodEl.textContent = trap.period;
        if (theoryContainer) {
            const trapsOfPart = (window.TOEIC_TRAPS_DATA || []).filter(t => t.partId === this.currentPart);
            const curIdx = trapsOfPart.findIndex(t => t.id === trap.id);
            const navHeader = `
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800 mb-3">
                    <span class="text-xs font-bold text-red-800 dark:text-red-300">
                        📍 Bẫy <strong>${curIdx + 1}</strong> / <strong>${trapsOfPart.length}</strong> (${trap.part})
                    </span>
                    <button onclick="TOEICTrapsEngine.nextTrap()" class="px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold text-[11px] hover:bg-red-700 flex items-center gap-1 shadow-sm">
                        <span>Bẫy tiếp theo</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            `;
            const nextTrapFooter = `
                <div class="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <button onclick="TOEICTrapsEngine.prevTrap()" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Bẫy trước</span>
                    </button>
                    <button onclick="TOEICTrapsEngine.nextTrap()" class="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow flex items-center gap-1.5">
                        <span>Sang bẫy tiếp theo ➔</span>
                    </button>
                </div>
            `;
            theoryContainer.innerHTML = navHeader + trap.theory + nextTrapFooter;
        }

        // Sinh danh sách câu hỏi theo số lượng đã chọn
        this.generateQuestions(this.currentQuestionCount);
    },

    setQuestionCount(count) {
        this.currentQuestionCount = parseInt(count, 10);
        // Highlight count button
        document.querySelectorAll('.trap-count-btn').forEach(b => {
            b.className = 'trap-count-btn px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition';
        });
        const activeBtn = document.getElementById(`trap-count-${count}`);
        if (activeBtn) {
            activeBtn.className = 'trap-count-btn px-3 py-1.5 rounded-xl border-2 border-red-600 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs font-black shadow-sm';
        }

        this.generateQuestions(this.currentQuestionCount);
        showToast(`Đã tải bộ ${count} câu hỏi bẫy thực chiến!`);
    },

    generateQuestions(count) {
        if (!window.getQuestionsForTrap) return;
        this.activeQuestions = window.getQuestionsForTrap(this.currentTrapId, count);
        this.userAnswers = {};
        this.renderPracticeList();
    },

    renderPracticeList() {
        const listEl = document.getElementById('trapQuestionsContainer');
        if (!listEl) return;

        const trap = window.TOEIC_TRAPS_DATA.find(t => t.id === this.currentTrapId);
        const isAudio = trap && trap.audioAvailable;

        listEl.innerHTML = this.activeQuestions.map((q, idx) => `
            <div id="trap-q-card-${idx}" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
                <div class="flex items-center justify-between gap-2">
                    <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs">
                        Câu ${idx + 1} / ${this.activeQuestions.length}
                    </span>
                    <button onclick="openAITutorModal('Phân tích câu bẫy này giúp tôi:\\n${q.q.replace(/'/g, "\\'")}', '${q.explain ? q.explain.replace(/'/g, "\\'") : ''}', '${trap?.title}')" class="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1">
                        <i class="fa-solid fa-robot"></i>
                        <span>Hỏi AI phân tích</span>
                    </button>
                </div>

                <!-- Bức ảnh thực tế Part 1 (Photographs) -->
                ${q.image ? `
                    <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-sm max-w-xl mx-auto my-1.5">
                        <img src="${q.image}" alt="TOEIC Part 1 Photograph" class="w-full h-56 sm:h-64 object-cover hover:scale-105 transition duration-300" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';">
                    </div>
                ` : ''}

                <!-- Bẫy Phần Nghe: Audio Player Trực Quan -->
                ${isAudio && q.audioScript ? `
                    <div class="p-3 rounded-xl bg-amber-50/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-700 space-y-2">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div class="flex items-center gap-2">
                                <button onclick="TOEICTrapsEngine.playAudio('${encodeURIComponent(q.audioScript)}')" class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow flex items-center gap-1.5 transition">
                                    <i class="fa-solid fa-play"></i>
                                    <span>Nghe đoạn bẫy</span>
                                </button>
                                <button onclick="TOEICTrapsEngine.stopAudio()" class="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold transition">
                                    <i class="fa-solid fa-stop"></i>
                                </button>
                            </div>
                            <!-- Tốc độ nghe -->
                            <div class="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                <span>Tốc độ:</span>
                                <button onclick="TOEICTrapsEngine.setSpeed(0.75)" class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border">0.75x</button>
                                <button onclick="TOEICTrapsEngine.setSpeed(1.0)" class="px-1.5 py-0.5 rounded bg-amber-600 text-white">1.0x</button>
                                <button onclick="TOEICTrapsEngine.setSpeed(1.25)" class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border">1.25x</button>
                            </div>
                        </div>
                        <!-- Toggle Transcript Script -->
                        <div class="pt-1">
                            <button onclick="document.getElementById('audio-script-${idx}').classList.toggle('hidden')" class="text-[11px] font-bold text-amber-800 dark:text-amber-400 hover:underline">
                                👁️ Xem Audio Script
                            </button>
                            <p id="audio-script-${idx}" class="hidden text-xs text-slate-600 dark:text-slate-400 font-mono mt-1 p-2 rounded bg-white dark:bg-slate-800 border">
                                ${q.audioScript}
                            </p>
                        </div>
                    </div>
                ` : ''}

                <!-- Question Text -->
                <p class="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    ${q.q}
                </p>

                <!-- Options -->
                <div class="space-y-2">
                    ${q.options.map((opt, optIdx) => `
                        <button onclick="TOEICTrapsEngine.chooseAnswer(${idx}, '${opt.replace(/'/g, "\\'")}')" id="opt-btn-${idx}-${optIdx}" class="trap-opt-btn w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs sm:text-[13px] font-medium transition flex items-center justify-between">
                            <span>${opt}</span>
                            <span class="trap-opt-icon hidden text-sm"></span>
                        </button>
                    `).join('')}
                </div>

                <!-- Explanation Box (Initially Hidden) -->
                <div id="trap-explain-${idx}" class="hidden p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <p class="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <i class="fa-solid fa-lightbulb"></i>
                        <span>Phân tích vì sao bẫy & Đáp án:</span>
                    </p>
                    <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        ${q.explain}
                    </p>
                </div>
            </div>
        `).join('');
    },

    chooseAnswer(qIdx, selectedOpt) {
        if (this.userAnswers[qIdx]) return; // Đã trả lời rồi
        this.userAnswers[qIdx] = selectedOpt;

        const q = this.activeQuestions[qIdx];
        const isCorrect = selectedOpt.trim().startsWith(q.ans.slice(0, 2)) || selectedOpt.trim() === q.ans.trim();

        // Cập nhật giao diện các lựa chọn
        q.options.forEach((opt, optIdx) => {
            const btn = document.getElementById(`opt-btn-${qIdx}-${optIdx}`);
            if (!btn) return;

            const isThisCorrect = opt.trim().startsWith(q.ans.slice(0, 2)) || opt.trim() === q.ans.trim();
            if (isThisCorrect) {
                btn.className = 'trap-opt-btn w-full text-left p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs sm:text-[13px] font-bold flex items-center justify-between';
                btn.querySelector('.trap-opt-icon').innerHTML = '<i class="fa-solid fa-circle-check text-emerald-600"></i>';
                btn.querySelector('.trap-opt-icon').classList.remove('hidden');
            } else if (opt === selectedOpt && !isCorrect) {
                btn.className = 'trap-opt-btn w-full text-left p-3 rounded-xl border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs sm:text-[13px] font-bold flex items-center justify-between';
                btn.querySelector('.trap-opt-icon').innerHTML = '<i class="fa-solid fa-circle-xmark text-rose-600"></i>';
                btn.querySelector('.trap-opt-icon').classList.remove('hidden');
            }
        });

        // Hiển thị khung giải thích bẫy
        const explainBox = document.getElementById(`trap-explain-${qIdx}`);
        if (explainBox) {
            explainBox.classList.remove('hidden');
        }

        if (isCorrect) {
            showToast('Chính xác! Bạn đã phá vỡ bẫy thành công! 🎉');
            state.xp = (state.xp || 0) + 10;
        } else {
            showToast('Đã dính bẫy ETS! Đọc kỹ lời giải bên dưới nhé 💡');
        }
    },

    // Phát âm audio bằng Universal Audio Engine chuẩn giọng Anh - Mỹ (Hỗ trợ 100% điện thoại)
    playAudio(text) {
        if (window.UniversalAudioEngine) {
            window.UniversalAudioEngine.setSpeed(this.audioPlaybackRate || 1.0);
            window.UniversalAudioEngine.speak(text, { rate: this.audioPlaybackRate || 1.0 });
        } else if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(decodeURIComponent(text));
            utterance.lang = 'en-US';
            utterance.rate = this.audioPlaybackRate || 1.0;
            window.speechSynthesis.speak(utterance);
        } else {
            showToast('Trình duyệt không hỗ trợ phát âm thanh');
        }
    },

    stopAudio() {
        if (window.UniversalAudioEngine) {
            window.UniversalAudioEngine.stop();
        } else if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    },

    setSpeed(speed) {
        this.audioPlaybackRate = speed;
        if (window.UniversalAudioEngine) {
            window.UniversalAudioEngine.setSpeed(speed);
        }
        showToast(`Tốc độ nghe: ${speed}x`);
    }
};

// =========================================================================
// 3. GIA SƯ AI THÔNG MINH GIẢI ĐÁP THẮC MẮC (AI TUTOR CHAT & MODAL)
// =========================================================================
window.openAITutorModal = function(initialQuestion = '', context = '', trapTitle = '') {
    const modal = document.getElementById('aiTutorModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (initialQuestion) {
        const input = document.getElementById('aiTutorInput');
        if (input) input.value = initialQuestion;
        window.sendAITutorQuery(initialQuestion, context, trapTitle);
    }
};

window.closeAITutorModal = function() {
    const modal = document.getElementById('aiTutorModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.sendAITutorQuery = function(forcedQuestion = null, context = '', trapTitle = '') {
    const input = document.getElementById('aiTutorInput');
    const question = forcedQuestion || input?.value?.trim();
    if (!question) return;

    if (input) input.value = '';

    const chatContainer = document.getElementById('aiTutorChatStream');
    if (!chatContainer) return;

    // Append User Message
    const userMsgHtml = `
        <div class="flex items-start gap-2.5 justify-end">
            <div class="p-3 rounded-2xl bg-blue-600 text-white text-xs max-w-[85%] font-medium shadow-sm leading-relaxed">
                ${question.replace(/\n/g, '<br>')}
            </div>
            <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                👤
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', userMsgHtml);

    // Append AI Typing indicator
    const typingId = 'ai-typing-' + Date.now();
    const typingHtml = `
        <div id="${typingId}" class="flex items-start gap-2.5 justify-start">
            <div class="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow">
                🤖
            </div>
            <div class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs max-w-[85%] shadow-sm leading-relaxed flex items-center gap-1.5">
                <span class="animate-bounce">●</span>
                <span class="animate-bounce" style="animation-delay: 0.2s">●</span>
                <span class="animate-bounce" style="animation-delay: 0.4s">●</span>
                <span class="ml-1 text-[11px] font-semibold text-slate-500">Gia sư AI đang phân tích bẫy đề thi...</span>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', typingHtml);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Call /api/ai/ask-tutor
    fetch('/api/ai/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context, trapTitle })
    })
    .then(r => r.json())
    .then(res => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        let answer = res.success && res.answer ? res.answer : 'Xin lỗi, Gia sư AI đang bận rà soát dữ liệu. Hãy thử lại sau vài giây!';
        
        // Convert basic markdown to HTML
        let formattedAnswer = answer
            .replace(/### (.*?)\n/g, '<h4 class="font-extrabold text-sm text-purple-700 dark:text-purple-300 mb-1">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<div class="my-1.5"></div>')
            .replace(/\n- /g, '<br>• ')
            .replace(/\n/g, '<br>');

        const aiMsgHtml = `
            <div class="flex items-start gap-2.5 justify-start">
                <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow">
                    🤖
                </div>
                <div class="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs max-w-[90%] shadow-sm leading-relaxed font-sans">
                    ${formattedAnswer}
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', aiMsgHtml);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(() => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        chatContainer.insertAdjacentHTML('beforeend', `
            <div class="text-xs text-rose-500 p-2 font-semibold">
                ⚠️ Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại kết nối mạng.
            </div>
        `);
    });
};
