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

        return null;
    },

    // Tính toán số ngày còn lại đến kỳ thi
    calculateDaysRemaining() {
        const user = this.getActiveUser();
        if (!user || !user.examDate) return null;
        const examDateStr = user.examDate;
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

    selectedNodeId: null,

    // =========================================================================
    // HỆ THỐNG 6 CHẶNG LỘ TRÌNH DỌC (VERTICAL ROADMAP) & 42 NODE BÀI HỌC
    // Phân tầng từ 0 -> 990 điểm · Mỗi chặng đi tuần tự từ Part 1 -> Part 7
    // =========================================================================
    roadmapStages: [
        {
            stageId: 1,
            title: 'CHẶNG 1: 0 - 300 ĐIỂM',
            subtitle: 'Foundation · Xây Nền Cấp Tốc',
            bandMin: 0,
            bandMax: 300,
            badge: '🥉 Đồng',
            color: 'amber',
            gradient: 'from-amber-500 to-orange-600',
            description: 'Xây dựng phản xạ nhận diện âm thanh, bối cảnh tranh người và từ loại cơ bản N - V - Adj - Adv.',
            nodes: [
                { id: 's1_n1', stageId: 1, part: 1, partNum: 1, title: 'Part 1: Tranh Tĩnh & Thì Tiếp Diễn', objective: 'Nhận diện trạng thái tĩnh vs hành động người, phát âm đuôi -ing', duration: '15 phút', questionsCount: 15, xp: 25, icon: 'fa-solid fa-camera', practiceType: 'listening' },
                { id: 's1_n2', stageId: 1, part: 2, partNum: 2, title: 'Part 2: Câu Hỏi Wh- Cơ Bản', objective: 'Phản xạ câu hỏi Who, Where, When trực tiếp, tránh bẫy Yes/No', duration: '15 phút', questionsCount: 15, xp: 25, icon: 'fa-solid fa-headphones', practiceType: 'listening' },
                { id: 's1_n3', stageId: 1, part: 3, partNum: 3, title: 'Part 3: Bắt Keyword Hội Thoại Ngắn', objective: 'Nghe xác định nhân vật, địa điểm xảy ra cuộc gọi và đối tượng chính', duration: '15 phút', questionsCount: 15, xp: 30, icon: 'fa-solid fa-comments', practiceType: 'listening' },
                { id: 's1_n4', stageId: 1, part: 4, partNum: 4, title: 'Part 4: Thông Báo Nơi Công Cộng', objective: 'Nghe các bài phát thanh sân bay, siêu thị, nhà ga ngắn', duration: '15 phút', questionsCount: 15, xp: 30, icon: 'fa-solid fa-bullhorn', practiceType: 'listening' },
                { id: 's1_n5', stageId: 1, part: 5, partNum: 5, title: 'Part 5: Từ Loại Cốt Lõi (N, V, Adj, Adv)', objective: 'Xác định vị trí đứng của từ loại trong câu đơn giản', duration: '15 phút', questionsCount: 15, xp: 30, icon: 'fa-solid fa-spell-check', practiceType: 'reading', topic: 'word_form' },
                { id: 's1_n6', stageId: 1, part: 6, partNum: 6, title: 'Part 6: Điền Từ Thông Báo Ngắn', objective: 'Điền từ vựng và đại từ thay thế trong email/memo nội bộ', duration: '15 phút', questionsCount: 15, xp: 30, icon: 'fa-solid fa-file-pen', practiceType: 'reading' },
                { id: 's1_n7', stageId: 1, part: 7, partNum: 7, title: 'Part 7: Đọc Hiểu Tin Nhắn & Hóa Đơn', objective: 'Skimming văn bản siêu ngắn: phiếu thu, hóa đơn mua hàng', duration: '20 phút', questionsCount: 15, xp: 35, icon: 'fa-solid fa-receipt', practiceType: 'reading', topic: 'single_passage' }
            ]
        },
        {
            stageId: 2,
            title: 'CHẶNG 2: 300 - 450 ĐIỂM',
            subtitle: 'Basic Competence · Vượt Bẫy Cơ Bản',
            bandMin: 300,
            bandMax: 450,
            badge: '🥈 Bạc',
            color: 'slate',
            gradient: 'from-slate-600 to-indigo-700',
            description: 'Thoát bẫy Being/Been trong tranh, xử lý câu hỏi Yes/No, câu hỏi lựa chọn và thì động từ thường gặp.',
            nodes: [
                { id: 's2_n1', stageId: 2, part: 1, partNum: 1, title: 'Part 1: Bẫy Being vs Been Tranh Vật Thể', objective: 'Phân biệt hành động đang diễn ra vs trạng thái vật thể đã hoàn tất', duration: '15 phút', questionsCount: 15, xp: 35, icon: 'fa-solid fa-camera', practiceType: 'listening' },
                { id: 's2_n2', stageId: 2, part: 2, partNum: 2, title: 'Part 2: Câu Hỏi Yes/No & Câu Hỏi Or', objective: 'Kỹ thuật nghe chọn phương án A or B và câu trả lời gián tiếp nhẹ', duration: '15 phút', questionsCount: 15, xp: 35, icon: 'fa-solid fa-headphones', practiceType: 'listening' },
                { id: 's2_n3', stageId: 2, part: 3, partNum: 3, title: 'Part 3: Hội Thoại & Dự Đoán Hành Động', objective: 'Nghe xác định hành động người nói sẽ làm tiếp theo (What will they do next?)', duration: '15 phút', questionsCount: 15, xp: 40, icon: 'fa-solid fa-comments', practiceType: 'listening' },
                { id: 's2_n4', stageId: 2, part: 4, partNum: 4, title: 'Part 4: Bản Tin Thời Tiết & Giao Thông', objective: 'Nắm bắt các từ vựng thời tiết, tắc đường, hoãn hủy chuyến đi', duration: '15 phút', questionsCount: 15, xp: 40, icon: 'fa-solid fa-cloud-sun', practiceType: 'listening' },
                { id: 's2_n5', stageId: 2, part: 5, partNum: 5, title: 'Part 5: Chia Thì & Dạng Bị Động', objective: 'Phân biệt chủ động vs bị động, dấu hiệu nhận biết các thì TOEIC', duration: '15 phút', questionsCount: 15, xp: 40, icon: 'fa-solid fa-clock-rotate-left', practiceType: 'reading', topic: 'tenses_voice' },
                { id: 's2_n6', stageId: 2, part: 6, partNum: 6, title: 'Part 6: Liên Từ Nối Câu Cơ Bản', objective: 'Chọn liên từ However, Therefore, Because trong đoạn văn', duration: '15 phút', questionsCount: 15, xp: 40, icon: 'fa-solid fa-link', practiceType: 'reading' },
                { id: 's2_n7', stageId: 2, part: 7, partNum: 7, title: 'Part 7: Thư Tín Thương Mại & Tuyển Dụng', objective: 'Kỹ năng Scanning tìm thông tin lương, yêu cầu kinh nghiệm, deadline', duration: '20 phút', questionsCount: 15, xp: 45, icon: 'fa-solid fa-envelope-open-text', practiceType: 'reading', topic: 'single_passage' }
            ]
        },
        {
            stageId: 3,
            title: 'CHẶNG 3: 450 - 600 ĐIỂM',
            subtitle: 'Standard Graduation · Chuẩn Ra Trường Đại Học',
            bandMin: 450,
            bandMax: 600,
            badge: '🥇 Vàng',
            color: 'emerald',
            gradient: 'from-emerald-600 to-teal-700',
            description: 'Chinh phục mốc ra trường an toàn! Xử lý bẫy gián tiếp né tránh, paraphrasing từ đồng nghĩa và chuỗi 2 đoạn văn.',
            nodes: [
                { id: 's3_n1', stageId: 3, part: 1, partNum: 1, title: 'Part 1: Tranh Nhiều Người & Trạng Thái Mặc', objective: 'Bẫy wearing (đang mặc) vs putting on (đang xỏ vào/thử đồ)', duration: '15 phút', questionsCount: 15, xp: 45, icon: 'fa-solid fa-people-group', practiceType: 'listening' },
                { id: 's3_n2', stageId: 3, part: 2, partNum: 2, title: 'Part 2: Bẫy Trả Lời Gián Tiếp Né Tránh', objective: 'Phản xạ các câu đá trách nhiệm (Ask Ms. Davis, I wasn\'t there)', duration: '15 phút', questionsCount: 15, xp: 45, icon: 'fa-solid fa-shuffle', practiceType: 'listening' },
                { id: 's3_n3', stageId: 3, part: 3, partNum: 3, title: 'Part 3: Paraphrasing Từ Đồng Nghĩa', objective: 'Bắt cặp từ đồng nghĩa chuyển đổi ngữ cảnh giữa câu hỏi và audio', duration: '15 phút', questionsCount: 15, xp: 50, icon: 'fa-solid fa-repeat', practiceType: 'listening' },
                { id: 's3_n4', stageId: 3, part: 4, partNum: 4, title: 'Part 4: Thuyết Trình & Câu Hỏi Ngụ Ý Người Nói', objective: 'Giải mã "Why does the speaker say...?" trong bài nói hội nghị', duration: '15 phút', questionsCount: 15, xp: 50, icon: 'fa-solid fa-microphone-lines', practiceType: 'listening' },
                { id: 's3_n5', stageId: 3, part: 5, partNum: 5, title: 'Part 5: Mệnh Đề Rút Gọn V-ing/V-ed & Giới Từ', objective: 'Phân biệt Despite vs Although, rút gọn chủ động V-ing vs bị động V-ed', duration: '15 phút', questionsCount: 15, xp: 50, icon: 'fa-solid fa-code-merge', practiceType: 'reading', topic: 'prep_conj' },
                { id: 's3_n6', stageId: 3, part: 6, partNum: 6, title: 'Part 6: Điền Câu Theo Mạch Logic Đoạn Văn', objective: 'Kỹ năng đọc trước - sau chỗ trống để chọn câu nối ý hoàn hảo', duration: '15 phút', questionsCount: 15, xp: 50, icon: 'fa-solid fa-puzzle-piece', practiceType: 'reading', topic: 'sentence_insertion' },
                { id: 's3_n7', stageId: 3, part: 7, partNum: 7, title: 'Part 7: Chuỗi 2 Đoạn Văn (Double Passages)', objective: 'Liên kết thông tin giữa Email khách hàng và Hóa đơn/Lịch trình', duration: '20 phút', questionsCount: 15, xp: 55, icon: 'fa-solid fa-newspaper', practiceType: 'reading', topic: 'double_passage' }
            ]
        },
        {
            stageId: 4,
            title: 'CHẶNG 4: 600 - 750 ĐIỂM',
            subtitle: 'Upper Intermediate · Bứt Phá Công Sở',
            bandMin: 600,
            bandMax: 750,
            badge: '💎 Bạch Kim',
            color: 'blue',
            gradient: 'from-blue-600 to-indigo-800',
            description: 'Nâng tầm tiếng Anh công sở, câu hỏi biểu đồ, mệnh đề giả định subjunctive và chuỗi 3 đoạn văn.',
            nodes: [
                { id: 's4_n1', stageId: 4, part: 1, partNum: 1, title: 'Part 1: Tranh Góc Rộng & Bối Cảnh Phức Tạp', objective: 'Nhận diện chi tiết nền, công trường xây dựng, cầu cảng', duration: '15 phút', questionsCount: 15, xp: 55, icon: 'fa-solid fa-panorama', practiceType: 'listening' },
                { id: 's4_n2', stageId: 4, part: 2, partNum: 2, title: 'Part 2: Bẫy Hỏi Ngược Lại & Đối Đáp Bất Ngờ', objective: 'Phản xạ câu hỏi tu từ và đối đáp ngoài kịch bản dự kiến', duration: '15 phút', questionsCount: 15, xp: 55, icon: 'fa-solid fa-reply-all', practiceType: 'listening' },
                { id: 's4_n3', stageId: 4, part: 3, partNum: 3, title: 'Part 3: Hội Thoại 3 Người & Câu Hỏi Kèm Biểu Đồ', objective: 'Phân biệt giọng 3 nhân vật và đối chiếu số liệu bảng biểu', duration: '15 phút', questionsCount: 15, xp: 60, icon: 'fa-solid fa-users-viewfinder', practiceType: 'listening' },
                { id: 's4_n4', stageId: 4, part: 4, partNum: 4, title: 'Part 4: Đọc Lướt Câu Hỏi Trước Khi Nghe', objective: 'Kỹ năng đọc trước 3 câu hỏi trong 8 giây nghỉ giữa các bài nói', duration: '15 phút', questionsCount: 15, xp: 60, icon: 'fa-solid fa-bolt', practiceType: 'listening' },
                { id: 's4_n5', stageId: 4, part: 5, partNum: 5, title: 'Part 5: Thể Giả Định Subjunctive & Collocations', objective: 'Cấu trúc recommend that S + V-bare và cụm từ công sở doanh nghiệp', duration: '15 phút', questionsCount: 15, xp: 60, icon: 'fa-solid fa-book-bookmark', practiceType: 'reading', topic: 'collocations' },
                { id: 's4_n6', stageId: 4, part: 6, partNum: 6, title: 'Part 6: Hợp Đồng Kinh Tế & Thì Hoàn Thành', objective: 'Xử lý các điều khoản hợp đồng mua bán, thuê mướn văn phòng', duration: '15 phút', questionsCount: 15, xp: 60, icon: 'fa-solid fa-file-contract', practiceType: 'reading' },
                { id: 's4_n7', stageId: 4, part: 7, partNum: 7, title: 'Part 7: Chuỗi 3 Đoạn Văn (Triple Passages)', objective: 'Tổng hợp manh mối từ 3 nguồn: Bài báo, Email phản hồi và Thông báo', duration: '25 phút', questionsCount: 15, xp: 65, icon: 'fa-solid fa-copy', practiceType: 'reading', topic: 'triple_passage' }
            ]
        },
        {
            stageId: 5,
            title: 'CHẶNG 5: 750 - 900 ĐIỂM',
            subtitle: 'Advanced · Thành Thạo Phản Xạ Toàn Diện',
            bandMin: 750,
            bandMax: 900,
            badge: '👑 Vương Miện',
            color: 'purple',
            gradient: 'from-purple-600 to-pink-700',
            description: 'Thành thạo tốc độ cao, đa giọng đọc Anh-Úc-Mỹ, câu hỏi suy luận khó và loại trừ bẫy tinh vi.',
            nodes: [
                { id: 's5_n1', stageId: 5, part: 1, partNum: 1, title: 'Part 1: Bẫy Tiểu Tiết & Đa Giọng Đọc', objective: 'Xử lý các tiểu tiết cực nhỏ phía xa và đa giọng Anh-Úc-Mỹ', duration: '15 phút', questionsCount: 15, xp: 65, icon: 'fa-solid fa-magnifying-glass-plus', practiceType: 'listening' },
                { id: 's5_n2', stageId: 5, part: 2, partNum: 2, title: 'Part 2: Ngữ Điệu Hoài Nghi & Câu Tỉnh Lược', objective: 'Nắm bắt thái độ mỉa mai, hoài nghi và câu trả lời rút gọn', duration: '15 phút', questionsCount: 15, xp: 65, icon: 'fa-solid fa-masks-theater', practiceType: 'listening' },
                { id: 's5_n3', stageId: 5, part: 3, partNum: 3, title: 'Part 3: Đàm Phán Thương Mại & Suy Luận Thái Độ', objective: 'Nghe đối thoại thương thảo hợp đồng, hạ giá và điều khoản phạt', duration: '15 phút', questionsCount: 15, xp: 70, icon: 'fa-solid fa-handshake', practiceType: 'listening' },
                { id: 's5_n4', stageId: 5, part: 4, partNum: 4, title: 'Part 4: Bản Tin Tài Chính & Phân Tích Số Liệu', objective: 'Phân tích báo cáo doanh thu, cổ phiếu, sáp nhập doanh nghiệp', duration: '15 phút', questionsCount: 15, xp: 70, icon: 'fa-solid fa-chart-line', practiceType: 'listening' },
                { id: 's5_n5', stageId: 5, part: 5, partNum: 5, title: 'Part 5: Câu Đảo Ngữ & Từ Vựng Nâng Cao C1', objective: 'Đảo ngữ với Not only, Seldom, Hardly và từ đồng nghĩa chuyên sâu', duration: '15 phút', questionsCount: 15, xp: 70, icon: 'fa-solid fa-arrow-down-up-across-line', practiceType: 'reading', topic: 'inference_vocab' },
                { id: 's5_n6', stageId: 5, part: 6, partNum: 6, title: 'Part 6: Bài Báo Nghiên Cứu Thị Trường', objective: 'Văn phong học thuật báo chí và liên kết mạch đoạn văn phức hợp', duration: '15 phút', questionsCount: 15, xp: 70, icon: 'fa-solid fa-newspaper', practiceType: 'reading' },
                { id: 's5_n7', stageId: 5, part: 7, partNum: 7, title: 'Part 7: Câu Hỏi Suy Luận & Câu Hỏi NOT/TRUE', objective: 'Kỹ thuật loại trừ phương án nhiễu trong chuỗi văn bản dài', duration: '25 phút', questionsCount: 15, xp: 75, icon: 'fa-solid fa-filter-circle-xmark', practiceType: 'reading', topic: 'triple_passage' }
            ]
        },
        {
            stageId: 6,
            title: 'CHẶNG 6: 900 - 990 ĐIỂM',
            subtitle: 'Mastery · Chinh Phục Điểm Tuyệt Đối',
            bandMin: 900,
            bandMax: 990,
            badge: '⚡ Huyền Thoại',
            color: 'rose',
            gradient: 'from-rose-600 via-red-600 to-amber-600',
            description: 'Tốc độ phản xạ vô điều kiện, làm chủ 75 phút 100 câu đọc hiểu và không mắc bất kỳ bẫy đề thi nào.',
            nodes: [
                { id: 's6_n1', stageId: 6, part: 1, partNum: 1, title: 'Part 1: Tranh Trừu Tượng & Góc Máy Lạ', objective: 'Chinh phục 6/6 câu Part 1 với độ chính xác tuyệt đối 100%', duration: '15 phút', questionsCount: 15, xp: 80, icon: 'fa-solid fa-crosshairs', practiceType: 'listening' },
                { id: 's6_n2', stageId: 6, part: 2, partNum: 2, title: 'Part 2: Phản Xạ Tốc Độ Cao Không Dịch Nghĩa', objective: 'Nghe hiểu trực tiếp bằng phản xạ tự nhiên không cần dịch thầm', duration: '15 phút', questionsCount: 15, xp: 80, icon: 'fa-solid fa-gauge-high', practiceType: 'listening' },
                { id: 's6_n3', stageId: 6, part: 3, partNum: 3, title: 'Part 3: Xử Lý Thông Tin Nhiễu Đa Chủ Đề', objective: 'Lọc thông tin gây nhiễu và bắt trọn 3 câu hỏi trước khi audio dứt', duration: '15 phút', questionsCount: 15, xp: 85, icon: 'fa-solid fa-ear-listen', practiceType: 'listening' },
                { id: 's6_n4', stageId: 6, part: 4, partNum: 4, title: 'Part 4: Độc Thoại Chuyên Sâu Tốc Độ Nhanh', objective: 'Luyện nghe giọng đọc địa phương luyến láy tốc độ 1.2x', duration: '15 phút', questionsCount: 15, xp: 85, icon: 'fa-solid fa-tower-broadcast', practiceType: 'listening' },
                { id: 's6_n5', stageId: 6, part: 5, partNum: 5, title: 'Part 5: Điểm Ngữ Pháp Hiếm Gặp & Thành Ngữ', objective: 'Quét sạch các câu phân hóa 900+ không thể đánh mất điểm', duration: '15 phút', questionsCount: 15, xp: 85, icon: 'fa-solid fa-feather-pointed', practiceType: 'reading', topic: 'inference_vocab' },
                { id: 's6_n6', stageId: 6, part: 6, partNum: 6, title: 'Part 6: Điều Khoản Nhượng Quyền Phức Tạp', objective: 'Đọc nhanh văn bản pháp chế doanh nghiệp trong dưới 6 phút', duration: '15 phút', questionsCount: 15, xp: 85, icon: 'fa-solid fa-stamp', practiceType: 'reading' },
                { id: 's6_n7', stageId: 6, part: 7, partNum: 7, title: 'Part 7: Full Reading Speed Challenge', objective: 'Thử thách giải 100 câu Reading trong 70 phút (dư 5 phút soát bài)', duration: '30 phút', questionsCount: 15, xp: 100, icon: 'fa-solid fa-crown', practiceType: 'reading', topic: 'triple_passage' }
            ]
        }
    ],

    // Mở Workstation Test Chẩn Đoán Đầu Vào (Đủ 7 Part chuẩn ETS 2026)
    startDiagnosticTest() {
        const oldModal = document.getElementById('diagnosticTestModal');
        if (oldModal) oldModal.remove();
        let user = this.getActiveUser();
        if (!user) {
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

        if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.open === 'function') {
            window.ToeicDiagnosticWorkstation.open();
        } else {
            console.error('ToeicDiagnosticWorkstation not loaded. Retrying...');
            setTimeout(() => {
                if (window.ToeicDiagnosticWorkstation) window.ToeicDiagnosticWorkstation.open();
            }, 300);
        }
    },

    // =========================================================================
    // TÍNH TOÁN TRẠNG THÁI MỞ KHÓA & NHẢY CÓC THÔNG MINH (ADAPTIVE UNLOCKING)
    // =========================================================================
    calculateNodeStates() {
        const user = this.getActiveUser();
        const diag = user?.diagnosticResults;
        const estScore = diag?.estimatedScore !== undefined ? diag.estimatedScore : 0;
        const pillarScores = diag?.pillarScores || {};

        // Xác định Chặng đang học (Current Stage):
        let currentStageId = 1;
        if (!diag) {
            currentStageId = 1;
        } else if (estScore >= 900) {
            currentStageId = 6;
        } else if (estScore >= 750) {
            currentStageId = 5;
        } else if (estScore >= 600) {
            currentStageId = 4;
        } else if (estScore >= 450) {
            currentStageId = 3;
        } else if (estScore >= 300) {
            currentStageId = 2;
        } else {
            currentStageId = 1;
        }

        // Tìm lỗ hổng yếu nhất của học viên để đặt Node Đang Học (Current) ngay tại vị trí đó
        let weakestPillarId = 'gap-part12-listening';
        let minScore = 999;
        this.pillars.forEach(p => {
            const sc = pillarScores[p.id] !== undefined ? pillarScores[p.id] : 0;
            if (sc < minScore) {
                minScore = sc;
                weakestPillarId = p.id;
            }
        });

        const nodeStates = {};
        let currentActiveNodeId = null;

        this.roadmapStages.forEach(stage => {
            if (stage.stageId < currentStageId) {
                // Các chặng bên dưới điểm test đầu vào -> TỰ ĐỘNG ĐÁNH DẤU HOÀN THÀNH (Completed)
                stage.nodes.forEach(node => {
                    nodeStates[node.id] = { status: 'completed', progressPct: 100, note: 'Vượt qua nhờ Test Đầu Vào' };
                });
            } else if (stage.stageId === currentStageId) {
                // Chặng hiện tại tương ứng với trình độ
                let activeNodeInStage = stage.nodes[0].id;
                if (diag) {
                    if (weakestPillarId === 'gap-part12-listening') activeNodeInStage = stage.nodes[1].id;
                    else if (weakestPillarId === 'gap-part34-paraphrase') activeNodeInStage = stage.nodes[2].id;
                    else if (weakestPillarId.includes('part5')) activeNodeInStage = stage.nodes[4].id;
                    else if (weakestPillarId.includes('part6')) activeNodeInStage = stage.nodes[5].id;
                    else if (weakestPillarId.includes('part7')) activeNodeInStage = stage.nodes[6].id;
                }
                currentActiveNodeId = activeNodeInStage;

                let passedActive = false;
                stage.nodes.forEach(node => {
                    if (node.id === activeNodeInStage) {
                        nodeStates[node.id] = { status: 'current', progressPct: 35, note: 'Trọng tâm cần bù đắp' };
                        passedActive = true;
                    } else if (!passedActive) {
                        nodeStates[node.id] = { status: 'completed', progressPct: 100, note: 'Đã hoàn thành' };
                    } else {
                        nodeStates[node.id] = { status: 'unlocked', progressPct: 0, note: 'Sẵn sàng học' };
                    }
                });
            } else {
                // Các chặng ở band điểm cao hơn -> KHÓA (Locked)
                stage.nodes.forEach(node => {
                    nodeStates[node.id] = { status: 'locked', progressPct: 0, note: 'Cần vượt qua chặng trước' };
                });
            }
        });

        if (!this.selectedNodeId || !nodeStates[this.selectedNodeId]) {
            this.selectedNodeId = currentActiveNodeId || 's1_n1';
        }

        return { currentStageId, currentActiveNodeId, nodeStates };
    },

    findNode(nodeId) {
        for (const stage of this.roadmapStages) {
            const found = stage.nodes.find(n => n.id === nodeId);
            if (found) return { ...found, stage };
        }
        return null;
    },

    selectNode(nodeId) {
        this.selectedNodeId = nodeId;
        this.renderFloatingActionCard();
        document.querySelectorAll('.roadmap-node-circle').forEach(el => {
            el.classList.remove('ring-4', 'ring-amber-400');
        });
        const activeCircle = document.getElementById(`node-circle-${nodeId}`);
        if (activeCircle) {
            activeCircle.classList.add('ring-4', 'ring-amber-400');
        }
    },

    closeFloatingCard() {
        const card = document.getElementById('roadmapFloatingActionCard');
        if (card) card.classList.add('hidden');
    },

    startLesson(nodeId) {
        const node = this.findNode(nodeId);
        if (!node) return;

        const states = this.calculateNodeStates();
        const st = states.nodeStates[nodeId]?.status;

        if (st === 'locked') {
            alert('🔒 Bài học này đang bị khóa. Hãy hoàn thành các bài học trước hoặc làm bài Test Đầu Vào để nhảy cóc!');
            return;
        }

        if (node.practiceType === 'listening') {
            if (window.ToeicListeningWorkstation && typeof window.ToeicListeningWorkstation.open === 'function') {
                window.ToeicListeningWorkstation.open({
                    part: node.partNum,
                    title: `${node.title} · ${node.stage.title}`,
                    count: node.questionsCount
                });
            } else {
                switchTab('luyen-nghe');
            }
        } else {
            if (window.ToeicReadingWorkstation && typeof window.ToeicReadingWorkstation.open === 'function') {
                window.ToeicReadingWorkstation.open({
                    part: node.partNum,
                    topic: node.topic || '',
                    title: `${node.title} · ${node.stage.title}`,
                    count: node.questionsCount
                });
            } else {
                switchTab('luyen-doc');
            }
        }
    },

    // Khởi tạo và render toàn bộ giao diện Lộ Trình Cá Nhân (Bản đồ dọc S-Curve Zigzag)
    renderRoadmapView() {
        const container = document.getElementById('view-lo-trinh');
        if (!container) return;

        const user = this.getActiveUser();
        const hasTested = !!(user && user.diagnosticResults);
        const daysRemaining = this.calculateDaysRemaining();
        const readiness = this.calculateReadinessScore();
        const targetScore = parseInt(user?.targetScore || '650', 10);
        const isUrgent = hasTested && (daysRemaining <= 35 || readiness < (targetScore - 80));

        // 6 Lỗ hổng kiến thức cốt lõi
        const gapStats = this.calculateGapStats();

        // Tính toán trạng thái các Node bài học (Adaptive Unlocking)
        const { currentStageId, currentActiveNodeId, nodeStates } = this.calculateNodeStates();

        // Cập nhật huy hiệu đôn đốc trên thanh sidebar menu
        const badge = document.getElementById('urgentRushBadge');
        if (badge) {
            if (isUrgent) badge.classList.remove('hidden');
            else badge.classList.add('hidden');
        }

        // Tọa độ sole mềm mại hình chữ S (Percentages):
        // Node 0: 50% | Node 1: 75% | Node 2: 62% | Node 3: 50% | Node 4: 25% | Node 5: 38% | Node 6: 50%
        const xOffsets = [50, 75, 62, 50, 25, 38, 50];
        const yOffsets = [60, 175, 290, 405, 520, 635, 750];

        // Chuỗi SVG Cubic Bezier Curve mượt mà tuyệt đối:
        const svgPathD = "M 50 60 C 50 117.5, 75 117.5, 75 175 C 75 232.5, 62 232.5, 62 290 C 62 347.5, 50 347.5, 50 405 C 50 462.5, 25 462.5, 25 520 C 25 577.5, 38 577.5, 38 635 C 38 692.5, 50 692.5, 50 750";

        container.innerHTML = `
            <!-- TOP HERO BANNER: MỤC TIÊU RA TRƯỜNG -->
            <div class="rounded-[28px] p-6 lg:p-7 relative overflow-hidden text-white shadow-xl ${isUrgent ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600' : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700'}">
                <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div class="space-y-2 max-w-xl">
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wider uppercase">
                                🎯 Lộ trình cá nhân hóa
                            </span>
                            ${!hasTested ? '<span class="px-3 py-1 rounded-full bg-amber-500/90 text-slate-900 text-xs font-black">⚠️ CHƯA LÀM TEST ĐẦU VÀO</span>' : isUrgent ? '<span class="px-3 py-1 rounded-full bg-rose-950/80 text-rose-200 text-xs font-black animate-pulse">⚡ CHẾ ĐỘ ĐÔN ĐỐC CẤP TỐC</span>' : '<span class="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-200 text-xs font-bold">✓ TIẾN ĐỘ VỮNG VÀNG</span>'}
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black tracking-tight">
                            Mục tiêu Ra Trường: <span class="underline decoration-wavy decoration-amber-300">${targetScore}+ Điểm</span>
                        </h2>
                        <p class="text-white/90 text-sm leading-relaxed">
                            ${!hasTested ? 'Bạn chưa làm bài kiểm tra chẩn đoán năng lực 7 Part. Hãy làm bài test chuẩn ETS để AI quét 6 lỗ hổng và tự động mở khóa các chặng tương ứng trên bản đồ!' : 'Bản đồ lộ trình đã tự động nhảy cóc và mở khóa theo kết quả bài Test Chẩn Đoán của bạn!'}
                        </p>
                    </div>

                    <!-- Countdown & Readiness Card -->
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
                        <button onclick="PersonalizedRoadmapEngine.openEditGoalModal()" class="px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-extrabold hover:bg-amber-100 transition shadow cursor-pointer">
                            <i class="fa-solid fa-sliders mr-1"></i> Đổi ngày
                        </button>
                    </div>
                </div>
            </div>

            <!-- CALL TO ACTION BANNER: TEST ĐẦU VÀO -->
            ${!hasTested ? `
            <div class="glass-panel rounded-[26px] p-5 sm:p-6 border-2 border-indigo-300 dark:border-indigo-800 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-slate-800 dark:to-slate-900 shadow-md">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="space-y-1.5 max-w-2xl">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wide">
                                🚀 BƯỚC 1: TEST ĐẦU VÀO
                            </span>
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">28 câu chuẩn ETS 2026 ĐỦ 7 PART (25 phút)</span>
                        </div>
                        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                            Làm bài Test Chẩn Đoán để Nhảy Cóc & Mở Khóa Lộ Trình!
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Khảo sát đầy đủ cả 7 Part (Part 1 - 4 Listening & Part 5 - 7 Reading). Hệ thống sẽ quy đổi điểm sang thang 0 - 990 và tự động đánh dấu hoàn thành các chặng bạn đã vững!
                        </p>
                    </div>
                    <button onclick="PersonalizedRoadmapEngine.startDiagnosticTest()" class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 shrink-0 animate-bounce hover:animate-none cursor-pointer">
                        <i class="fa-solid fa-play-circle text-base"></i>
                        <span>Bắt đầu Test 7 Part</span>
                    </button>
                </div>
            </div>
            ` : `
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-black text-emerald-900 dark:text-emerald-200">
                                Đã chẩn đoán: Ước tính ~${user.diagnosticResults.estimatedScore} / 990 TOEIC (LC: ${user.diagnosticResults.listeningScore || 0} · RC: ${user.diagnosticResults.readingScore || 0})
                            </span>
                            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold">Chính xác ETS</span>
                        </div>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400">
                            Ngày kiểm tra: ${user.diagnosticResults.testedDate || 'Gần đây'} • Đã mở khóa nhảy cóc đến Chặng ${currentStageId}
                        </span>
                    </div>
                </div>
                <button onclick="PersonalizedRoadmapEngine.startDiagnosticTest()" class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer">
                    <i class="fa-solid fa-rotate-right text-[11px]"></i>
                    <span>Thi lại bài test</span>
                </button>
            </div>
            `}

            <!-- CHẨN ĐOÁN 6 TRỤ CỘT LỖ HỔNG KIẾN THỨC (WEAKNESS RADAR) -->
            <div class="glass-panel rounded-[26px] p-5 sm:p-6 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <i class="fa-solid fa-radar text-emerald-600"></i>
                            Chẩn Đoán Lỗ Hổng Kiến Thức (Weakness Radar)
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ${!hasTested ? 'Hiện tại tất cả đang ở mức 0% (chưa có bài test). Làm bài kiểm tra để AI quét lỗ hổng.' : 'Tỷ lệ thành thạo 6 kỹ năng cốt lõi. Các phần màu đỏ là lỗ hổng cần ưu tiên ôn luyện ngay!'}
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="PersonalizedRoadmapEngine.startDiagnosticTest()" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer">
                            <i class="fa-solid fa-clipboard-check text-xs"></i>
                            <span>${!hasTested ? 'Làm test chẩn đoán' : 'Làm lại test'}</span>
                        </button>
                    </div>
                </div>

                <!-- 6 Khối Lỗ Hổng -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    ${gapStats.map(g => {
                        const isTestedPillar = hasTested && g.score > 0;
                        const isWeak = hasTested && g.score < 60;
                        const isFair = hasTested && g.score >= 60 && g.score < 80;

                        return `
                        <div class="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border ${!hasTested ? 'border-slate-200 dark:border-slate-700 opacity-90' : isWeak ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20' : isFair ? 'border-amber-200 dark:border-amber-900/40' : 'border-emerald-200 dark:border-emerald-900/40'} space-y-3 shadow-2xs">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex items-center gap-2.5 overflow-hidden">
                                    <div class="w-8 h-8 rounded-xl ${!hasTested ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : isWeak ? 'bg-rose-100 text-rose-600' : isFair ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center text-xs font-bold shrink-0">
                                        <i class="${g.icon}"></i>
                                    </div>
                                    <div class="truncate">
                                        <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">${g.name.split(':')[0]}</h4>
                                        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">${g.part}</span>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${!hasTested ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : isWeak ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60' : isFair ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60'}">
                                    ${!hasTested ? '0%' : `${g.score}%`}
                                </span>
                            </div>

                            <!-- Progress Bar -->
                            <div>
                                <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-500 ${!hasTested ? 'bg-slate-300 dark:bg-slate-600' : isWeak ? 'bg-rose-500' : isFair ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${g.score}%"></div>
                                </div>
                            </div>

                            <div class="pt-1 flex items-center justify-between">
                                <button onclick="PersonalizedRoadmapEngine.fixGap('${g.trapTargetId}')" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer">
                                    <span>Vá bẫy này</span>
                                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                                </button>
                                <button onclick="openAITutorModal('Tư vấn cho tôi lộ trình khắc phục lỗ hổng: ${g.name}')" class="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer">
                                    <i class="fa-solid fa-robot text-[10px]"></i>
                                    <span>Gia sư AI</span>
                                </button>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- BẢN ĐỒ LỘ TRÌNH DỌC S-CURVE ZIGZAG (GAMIFICATION MAP CHUẨN HELLOCHINESE) -->
            <!-- ========================================================================= -->
            <div class="glass-panel rounded-[28px] p-5 sm:p-7 space-y-8 relative overflow-hidden" id="roadmapVerticalMapContainer">
                <!-- Map Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-wider">
                                🗺️ BẢN ĐỒ LỘ TRÌNH DỌC
                            </span>
                            <span class="text-xs font-bold text-slate-500">6 Chặng · 42 Bài Học Chuẩn ETS</span>
                        </div>
                        <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Hành Trình Chinh Phục Điểm Tuyệt Đối (0 -> 990 Điểm)
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Các chặng được bố trí dọc theo hình chữ S. Điểm bài Test Đầu Vào sẽ tự động mở khóa các chặng tương ứng cho bạn!
                        </p>
                    </div>

                    <!-- Legend -->
                    <div class="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300 self-start sm:self-auto bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl">
                        <div class="flex items-center gap-1.5">
                            <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-white font-black">✓</span>
                            <span>Hoàn thành</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-3.5 h-3.5 rounded-full bg-indigo-600 ring-2 ring-indigo-300 animate-pulse"></span>
                            <span>Đang học</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[8px] text-slate-500">🔒</span>
                            <span>Khóa</span>
                        </div>
                    </div>
                </div>

                <!-- MASCOT COMPANION CARD (Hình 1: 3 Chú Totoro Vượt Mốc 990) -->
                <div class="p-4 sm:p-5 rounded-3xl border border-amber-200/90 dark:border-slate-700 bg-gradient-to-r from-amber-50/90 via-white to-orange-50/80 dark:from-slate-800/90 dark:to-slate-850 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div class="w-20 sm:w-24 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-[#f9f1dc] dark:bg-slate-750 border border-amber-300/80 shadow-xs">
                        <img src="assets/mascot/totoro_trio_stacked.png" alt="3 Chú Totoro Vượt Mốc 990" class="max-h-36 sm:max-h-40 object-contain filter drop-shadow hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-wider">Mascot Dẫn Đường</span>
                            <span class="text-xs font-bold text-amber-800 dark:text-amber-300">3 Tầng Tiến Trình Chinh Phục ETS 990</span>
                        </div>
                        <h4 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            Bộ 3 Totoro Đồng Hành Vượt 6 Chặng Bản Đồ S-Curve
                        </h4>
                        <div class="text-xs text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
                            <div class="flex items-center gap-1.5 justify-center sm:justify-start">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                <span><strong>Totoro Trắng (Chặng 1-2):</strong> Nắm vững mô tả tranh Part 1, câu hỏi ngắn Part 2 và từ loại cốt lõi (0 - 300 - 450+).</span>
                            </div>
                            <div class="flex items-center gap-1.5 justify-center sm:justify-start">
                                <span class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                                <span><strong>Totoro Xanh (Chặng 3-4):</strong> Bắt keyword hội thoại Part 3-4, kỹ thuật Paraphrasing và đọc hiểu văn bản đơn Part 7 (600 - 750+).</span>
                            </div>
                            <div class="flex items-center gap-1.5 justify-center sm:justify-start">
                                <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                                <span><strong>Totoro Xám Lớn (Chặng 5-6):</strong> Xử lý mượt chuỗi đa đoạn văn Part 7, câu hỏi suy luận khó và chạm đỉnh 990 TOEIC!</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 6 CHẶNG ROADMAP (STAGES 1 -> 6) -->
                <div class="space-y-12 relative max-w-3xl mx-auto">
                    ${this.roadmapStages.map((stage, sIdx) => {
                        const isStageCompleted = stage.stageId < currentStageId;
                        const isStageActive = stage.stageId === currentStageId;
                        const isStageLocked = stage.stageId > currentStageId;

                        let stageBadgeBg = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
                        let stageBadgeText = 'Chưa mở khóa';
                        if (isStageCompleted) {
                            stageBadgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
                            stageBadgeText = '✓ Đã vượt qua (100%)';
                        } else if (isStageActive) {
                            stageBadgeBg = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 animate-pulse';
                            stageBadgeText = '⚡ Chặng đang chinh phục';
                        }

                        return `
                            <div class="space-y-6 relative" id="roadmap-stage-${stage.stageId}">
                                <!-- STAGE HEADER BANNER -->
                                <div class="p-4 sm:p-5 rounded-2xl border ${isStageActive ? 'border-indigo-400 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 dark:from-indigo-950/30 dark:to-purple-950/30 shadow-md ring-2 ring-indigo-500/20' : isStageCompleted ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 opacity-70'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${stage.gradient} text-white flex items-center justify-center text-xl font-black shadow-md shrink-0">
                                            <span>${stage.stageId}</span>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <h4 class="font-black text-sm sm:text-base text-slate-900 dark:text-white">${stage.title}</h4>
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${stageBadgeBg}">${stage.badge}</span>
                                            </div>
                                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${stage.description}</p>
                                        </div>
                                    </div>
                                    <span class="px-3 py-1 rounded-xl text-xs font-bold shrink-0 ${stageBadgeBg}">
                                        ${stageBadgeText}
                                    </span>
                                </div>

                                <!-- WINDING S-CURVE ROAD CONTAINER FOR 7 NODES -->
                                <div class="relative w-full h-[820px] select-none">
                                    <!-- Background Connecting SVG S-Curve Path -->
                                    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="${svgPathD}" 
                                            stroke="${isStageCompleted ? '#10b981' : isStageActive ? '#6366f1' : '#cbd5e1'}" 
                                            stroke-width="7" 
                                            fill="none" 
                                            stroke-linecap="round"
                                            ${isStageActive ? 'stroke-dasharray="10 8" class="animate-pulse"' : ''}
                                            vector-effect="non-scaling-stroke"/>
                                    </svg>

                                    <!-- 7 CIRCULAR LESSON NODES (Part 1 -> Part 7) -->
                                    ${stage.nodes.map((node, nIdx) => {
                                        const nodeState = nodeStates[node.id] || { status: 'locked', progressPct: 0 };
                                        const isCompleted = (nodeState.status === 'completed');
                                        const isCurrent = (nodeState.status === 'current');
                                        const isUnlocked = (nodeState.status === 'unlocked');
                                        const isLocked = (nodeState.status === 'locked');
                                        const isSelected = (this.selectedNodeId === node.id);

                                        const posX = xOffsets[nIdx];
                                        const posY = yOffsets[nIdx];

                                        // Progress Ring calculation (Radius = 30, Circumference ~ 188.5)
                                        const radius = 30;
                                        const circumference = 2 * Math.PI * radius;
                                        const strokeOffset = circumference - (nodeState.progressPct / 100) * circumference;

                                        let circleBg = 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200';
                                        let ringColor = '#cbd5e1';

                                        if (isCompleted) {
                                            circleBg = 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 border-2 border-emerald-300';
                                            ringColor = '#10b981';
                                        } else if (isCurrent) {
                                            circleBg = 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-600/40 border-2 border-indigo-200 ring-4 ring-indigo-400/50 animate-pulse';
                                            ringColor = '#6366f1';
                                        } else if (isUnlocked) {
                                            circleBg = 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-700 shadow-md hover:scale-105';
                                            ringColor = '#818cf8';
                                        } else if (isLocked) {
                                            circleBg = 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-80';
                                            ringColor = '#94a3b8';
                                        }

                                        return `
                                            <div class="absolute flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
                                                style="top: ${posY}px; left: ${posX}%; transform: translate(-50%, -50%);"
                                                onclick="PersonalizedRoadmapEngine.selectNode('${node.id}')">

                                                <!-- MASCOT AVATAR OR ACTIVE INDICATOR BADGE FOR CURRENT NODE -->
                                                ${isCurrent ? `
                                                    <div class="absolute -top-8 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black whitespace-nowrap shadow-md shadow-indigo-600/30 animate-bounce flex items-center gap-1 z-20">
                                                        <span>👉 BẠN ĐANG Ở ĐÂY</span>
                                                    </div>
                                                ` : ''}

                                                <!-- CIRCULAR NODE WITH SVG PROGRESS RING -->
                                                <div id="node-circle-${node.id}" class="roadmap-node-circle relative w-[68px] h-[68px] rounded-full flex items-center justify-center transition-all ${circleBg} ${isSelected ? 'ring-4 ring-amber-400' : ''}">
                                                    <!-- SVG Progress Ring -->
                                                    <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 68 68">
                                                        <circle cx="34" cy="34" r="${radius}" fill="none" stroke="currentColor" stroke-width="3" class="opacity-15"/>
                                                        <circle cx="34" cy="34" r="${radius}" fill="none" stroke="${ringColor}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeOffset}"/>
                                                    </svg>

                                                    <!-- Center Icon -->
                                                    <div class="text-xl relative z-10">
                                                        ${isLocked ? '<i class="fa-solid fa-lock text-base"></i>' : `<i class="${node.icon}"></i>`}
                                                    </div>

                                                    <!-- Completed Checkmark Badge -->
                                                    ${isCompleted ? `
                                                        <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-900 shadow">
                                                            <i class="fa-solid fa-check"></i>
                                                        </div>
                                                    ` : ''}
                                                </div>

                                                <!-- Node Label Below Circle -->
                                                <div class="mt-2 text-center max-w-[130px] sm:max-w-[150px]">
                                                    <span class="inline-block px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase ${isCompleted ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : isCurrent ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
                                                        Part ${node.part}
                                                    </span>
                                                    <h5 class="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight mt-0.5">
                                                        ${node.title.split(':')[1] ? node.title.split(':')[1].trim() : node.title}
                                                    </h5>
                                                    <span class="text-[10px] text-slate-400 font-medium">${node.duration} · +${node.xp} XP</span>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>

                                <!-- INTER-STAGE CHECKPOINT MILESTONE -->
                                <div class="py-2 flex items-center justify-center">
                                    <div class="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black flex items-center gap-2 shadow-2xs">
                                        <i class="fa-solid fa-flag-checkered text-amber-500"></i>
                                        <span>Mốc Điểm: ${stage.bandMax} TOEIC</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- FLOATING ACTION CARD (Thanh hành động nhanh ở đáy màn hình khi bấm vào Node) -->
            <!-- ========================================================================= -->
            <div id="roadmapFloatingActionCard" class="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-[460px] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-5 transition-all animate-in slide-in-from-bottom duration-200">
                <!-- Rendered dynamically in renderFloatingActionCard() -->
            </div>
        `;

        // Render Initial Floating Action Card for the active node
        this.renderFloatingActionCard();
    },

    // =========================================================================
    // RENDER THANH HÀNH ĐỘNG NHANH Ở ĐÁY MÀN HÌNH (FLOATING ACTION CARD)
    // =========================================================================
    renderFloatingActionCard() {
        const card = document.getElementById('roadmapFloatingActionCard');
        if (!card) return;

        const nodeId = this.selectedNodeId || 's1_n1';
        const node = this.findNode(nodeId);
        if (!node) {
            card.classList.add('hidden');
            return;
        }

        const states = this.calculateNodeStates();
        const st = states.nodeStates[node.id] || { status: 'locked', progressPct: 0 };
        const isCompleted = (st.status === 'completed');
        const isCurrent = (st.status === 'current');
        const isLocked = (st.status === 'locked');

        card.classList.remove('hidden');

        card.innerHTML = `
            <div class="space-y-3.5">
                <!-- Card Header -->
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl ${isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-indigo-600' : isLocked ? 'bg-slate-300 dark:bg-slate-700' : 'bg-blue-600'} text-white flex items-center justify-center text-lg shadow-md shrink-0">
                            <i class="${node.icon}"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase">
                                    ${node.stage.title.split(':')[0]}
                                </span>
                                <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                    Part ${node.part} · ${node.practiceType === 'listening' ? '🎧 Listening' : '📖 Reading'}
                                </span>
                            </div>
                            <h4 class="font-black text-sm text-slate-900 dark:text-white leading-tight mt-0.5">
                                ${node.title}
                            </h4>
                        </div>
                    </div>
                    <button type="button" onclick="PersonalizedRoadmapEngine.closeFloatingCard()" class="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex items-center justify-center transition cursor-pointer">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>

                <!-- Objective & Details -->
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    🎯 <strong>Mục tiêu:</strong> ${node.objective}
                </p>

                <!-- Stats & Actions -->
                <div class="flex items-center justify-between gap-3 pt-1">
                    <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span><i class="fa-solid fa-clock text-indigo-500 mr-1"></i>${node.duration}</span>
                        <span>•</span>
                        <span><i class="fa-solid fa-bolt text-amber-500 mr-1"></i>+${node.xp} XP</span>
                    </div>

                    ${isLocked ? `
                        <button type="button" disabled class="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed">
                            <i class="fa-solid fa-lock text-[10px]"></i>
                            <span>Chưa mở khóa</span>
                        </button>
                    ` : isCompleted ? `
                        <button type="button" onclick="PersonalizedRoadmapEngine.startLesson('${node.id}')" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-rotate-right text-xs"></i>
                            <span>Ôn tập lại bài này</span>
                        </button>
                    ` : `
                        <button type="button" onclick="PersonalizedRoadmapEngine.startLesson('${node.id}')" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer animate-pulse hover:animate-none">
                            <i class="fa-solid fa-play text-xs"></i>
                            <span>Bắt đầu học ngay</span>
                        </button>
                    `}
                </div>
            </div>
        `;
    },

    closeDiagnosticModal() {
        const oldModal = document.getElementById('diagnosticTestModal');
        if (oldModal) oldModal.remove();
        if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.close === 'function') {
            window.ToeicDiagnosticWorkstation.close();
        }
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
