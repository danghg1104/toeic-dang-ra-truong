/**
 * HỆ THỐNG LÝ THUYẾT NGỮ PHÁP CHUYÊN SÂU — TOEIC & VSTEP
 * Biên soạn chuẩn cấu trúc đề thi ETS, PassToeic.vn và Khung năng lực Ngoại ngữ 6 bậc VSTEP
 * Đầy đủ 30 chuyên đề chuẩn chỉnh, mỗi chuyên đề 5 phần:
 * 1. Bảng công thức & Quy tắc cốt lõi (formula)
 * 2. Dấu hiệu nhận biết chắc chắn 100% (signals)
 * 3. Các bẫy đề thi ETS & VSTEP kinh điển (traps)
 * 4. Mẹo giải nhanh trong 5 giây (shortcut)
 * 5. Câu hỏi thực chiến phân tích 3 bước (example)
 */

window.grammarTheoryDatabase = {
    "Các thì hiện tại": {
        "badge": "CHUYÊN ĐỀ 1 · XUẤT HIỆN 100% TRONG ĐỀ THI",
        "title": "Các thì hiện tại (Present Simple & Present Continuous)",
        "overview": "Chiếm từ 2–4 câu trong TOEIC Part 5 và xuất hiện liên tục trong thư tín, thông báo công ty ở Part 6 & 7. Trọng tâm cốt lõi là phân biệt giữa 'thói quen/quy chế định kỳ/chân lý' (Hiện tại đơn) và 'dự án/sự vụ đang diễn ra tạm thời hoặc kế hoạch chắc chắn trong tương lai gần' (Hiện tại tiếp diễn).",
        "sections": [
            {
                "heading": "1. Bảng công thức & Quy tắc chia động từ",
                "type": "formula",
                "items": [
                    {
                        "title": "Hiện tại đơn (Present Simple)",
                        "formula": "Khẳng định: S + V(s/es) | Phủ định: S + do/does not + V_inf | Nghi vấn: Do/Does + S + V_inf?",
                        "note": "Chủ ngữ số ít (He/She/It/Danh từ không đếm được/Danh từ số ít) thêm -s/-es. Chủ ngữ số nhiều (I/We/You/They) giữ nguyên V_inf. Quy tắc thêm -es với động từ kết thúc bằng -o, -s, -ch, -x, -sh, -z (passes, washes, relaxes, goes)."
                    },
                    {
                        "title": "Hiện tại tiếp diễn (Present Continuous)",
                        "formula": "Khẳng định: S + am/is/are + V-ing | Phủ định: S + am/is/are not + V-ing | Nghi vấn: Am/Is/Are + S + V-ing?",
                        "note": "Dùng diễn tả hành động đang xảy ra tại thời điểm nói hoặc một dự án/xu hướng đang triển khai tạm thời trong giai đoạn hiện tại (currently, presently)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Hiện tại đơn: always, usually, frequently, regularly, routinely, periodically, seldom, rarely, every (day/week/month), twice a year, once a week.",
                    "Hiện tại tiếp diễn: now, right now, at the moment, at present, currently, presently, for the time being.",
                    "Cụm từ công sở TOEIC kinh điển: 'routinely inspect' (kiểm tra định kỳ), 'periodically review' (đánh giá định kỳ), 'currently undergoing renovations' (hiện đang được trùng tu)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "Bẫy Stative Verbs (Động từ chỉ trạng thái/sở hữu không chia tiếp diễn): consist of, contain, belong to, possess, know, understand, realize, believe. Đề thi ETS thường gài 'is containing' (SAI) -> phải dùng 'contains' (ĐÚNG).",
                    "Bẫy 'currently' đi với Hiện tại đơn khi nói về chức vụ/trách nhiệm hiện hành: 'Mr. Tanaka currently serves as the Vice President' (ĐÚNG, diễn tả chức vụ ổn định, không dùng is serving)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy trạng từ tần suất (regularly, routinely) -> Lập tức loại các thì quá khứ, tương lai, chọn ngay Hiện tại đơn.",
                    "Thấy 'currently' / 'at present' -> Ưu tiên tìm đáp án dạng 'is/are + V-ing' hoặc 'is/are + V3/ed' (bị động tiếp diễn)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The human resources department regularly _______ feedback from employees to improve workplace satisfaction.",
                "options": [
                    "A. collect",
                    "B. collects",
                    "C. is collecting",
                    "D. collected"
                ],
                "ans": "B. collects",
                "explain": "Bước 1: Xác định trạng từ 'regularly' (thường xuyên, định kỳ) chỉ thói quen -> dùng thì Hiện tại đơn. Bước 2: Chủ ngữ 'The human resources department' là danh từ số ít. Bước 3: Động từ ngôi số ít phải thêm -s/-es -> Chọn 'collects'."
            }
        ]
    },
    "Các thì quá khứ": {
        "badge": "CHUYÊN ĐỀ 2 · TRỌNG TÂM REPORT & EMAIL",
        "title": "Các thì quá khứ (Past Simple & Past Continuous)",
        "overview": "Là thì chủ đạo trong các bài báo kinh tế, biên bản cuộc họp, email thông báo sự việc đã hoàn tất trong quá khứ. Đặc biệt chú ý các mốc thời gian đã chấm dứt hoàn toàn và cấu trúc phối hợp quá khứ đơn - quá khứ tiếp diễn.",
        "sections": [
            {
                "heading": "1. Bảng công thức & Quy tắc cốt lõi",
                "type": "formula",
                "items": [
                    {
                        "title": "Quá khứ đơn (Past Simple)",
                        "formula": "Khẳng định: S + V2/ed | Phủ định: S + did not + V_inf | Nghi vấn: Did + S + V_inf?",
                        "note": "Diễn tả hành động đã xảy ra và kết thúc hoàn toàn tại một thời điểm xác định trong quá khứ, không còn liên quan đến hiện tại."
                    },
                    {
                        "title": "Quá khứ tiếp diễn (Past Continuous)",
                        "formula": "Khẳng định: S + was/were + V-ing | Phủ định: S + was/were not + V-ing | Nghi vấn: Was/Were + S + V-ing?",
                        "note": "Diễn tả hành động đang diễn ra tại một thời điểm cụ thể trong quá khứ (at 8 PM yesterday) hoặc hành động đang diễn ra thì có hành động khác cắt ngang (when + Past Simple, while + Past Continuous)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Các mốc thời gian quá khứ rõ ràng: yesterday, last (night/week/month/year), ago (two days ago), in + năm quá khứ (in 2020), formerly, previously, originally.",
                    "Cụm từ phối hợp: when + S + V2/ed, S + was/were + V-ing; while + S + was/were + V-ing, S + V2/ed.",
                    "Collocations công sở: 'formerly known as' (trước đây được gọi là), 'previously served as' (trước đây từng phục vụ với tư cách)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "Bẫy nhầm lẫn giữa Quá khứ đơn và Hiện tại hoàn thành: Nếu có mốc thời gian cụ thể (in 2023, last year, two weeks ago) BẮT BUỘC dùng Quá khứ đơn, KHÔNG được dùng Hiện tại hoàn thành (have/has + V3).",
                    "Bẫy động từ bất quy tắc dễ nhầm: rise -> rose -> risen (tự tăng), raise -> raised -> raised (nâng lên, ngoại động từ), fall -> fell -> fallen (giảm)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy 'ago', 'yesterday', 'last + thời gian' hoặc năm quá khứ -> 100% chọn động từ có đuôi -ed hoặc V2.",
                    "Thấy 'originally' hoặc 'formerly' đứng trước động từ -> chọn Quá khứ đơn để chỉ trạng thái ban đầu đã thay đổi."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "Three months ago, the board of directors _______ to relocate the corporate headquarters to Chicago.",
                "options": [
                    "A. decides",
                    "B. will decide",
                    "C. decided",
                    "D. has decided"
                ],
                "ans": "C. decided",
                "explain": "Bước 1: Quan sát thấy cụm trạng từ thời gian 'Three months ago' (3 tháng trước). Bước 2: Hành động đã xảy ra và chấm dứt trong quá khứ -> bắt buộc chia thì Quá khứ đơn (V2/ed). Bước 3: Loại A (hiện tại), B (tương lai), D (hiện tại hoàn thành) -> Chọn C. decided."
            }
        ]
    },
    "Các thì tương lai": {
        "badge": "CHUYÊN ĐỀ 3 · ĐỀ ÁN & DỰ PHÓNG KINH DOANH",
        "title": "Các thì tương lai (Simple Future, Near Future & Future Continuous)",
        "overview": "Xuất hiện dày đặc trong các hợp đồng (stipulations), lịch trình ra mắt sản phẩm mới (launches), và thông báo thay đổi chính sách. Trọng tâm là phân biệt giữa quyết định tức thì/lời hứa (will) và kế hoạch đã có dự liệu từ trước (be going to).",
        "sections": [
            {
                "heading": "1. Bảng công thức & Quy tắc cốt lõi",
                "type": "formula",
                "items": [
                    {
                        "title": "Tương lai đơn (Simple Future)",
                        "formula": "Khẳng định: S + will + V_inf | Phủ định: S + will not (won't) + V_inf | Nghi vấn: Will + S + V_inf?",
                        "note": "Diễn tả dự đoán không có căn cứ chắc chắn, quyết định nảy sinh tại thời điểm nói, hoặc lời cam kết trong hợp đồng văn bản."
                    },
                    {
                        "title": "Tương lai gần (Be going to)",
                        "formula": "Khẳng định: S + am/is/are + going to + V_inf",
                        "note": "Diễn tả kế hoạch, dự định đã được lên lịch từ trước, hoặc một sự việc có bằng chứng hiện thực sắp diễn ra."
                    },
                    {
                        "title": "Tương lai tiếp diễn (Future Continuous)",
                        "formula": "Khẳng định: S + will be + V-ing",
                        "note": "Diễn tả một hành động đang diễn ra tại một thời điểm xác định trong tương lai (at this time tomorrow)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Các trạng từ thời gian tương lai: tomorrow, next (week/month/quarter/year), soon, upcoming, shortly, in the upcoming months, following days.",
                    "Động từ thể hiện dự đoán/hy vọng: expect that, anticipate that, hope that, predict that + S + will + V_inf.",
                    "Cụm từ hợp đồng: 'The contractor will be responsible for...' (Bên nhà thầu sẽ chịu trách nhiệm về...)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY KINH ĐIỂN NHẤT TOEIC: Mệnh đề trạng ngữ chỉ thời gian (when, after, before, as soon as, once, until) và điều kiện (if, unless) TUYỆT ĐỐI KHÔNG DÙNG THÌ TƯƠNG LAI (will), mà phải lùi về HIỆN TẠI ĐƠN. Ví dụ: 'As soon as the shipment arrives (KHÔNG DÙNG will arrive), we will notify you.'",
                    "Bẫy nhầm lẫn giữa 'shortly' (sắp sửa - đi với will/be going to) và 'briefly' (ngắn gọn, chốc lát)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy 'soon', 'shortly', 'next week' ở cuối câu -> Ưu tiên chọn ngay 'will + V_inf' hoặc 'is/are going to + V_inf'.",
                    "Thấy 'once', 'as soon as', 'when', 'if' đứng đầu mệnh đề -> Loại ngay lập tức các phương án có chứa 'will' bên trong mệnh đề đó!"
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "As soon as the financial audit is complete, the accounting firm _______ its official findings to the shareholders.",
                "options": [
                    "A. presented",
                    "B. will present",
                    "C. presents",
                    "D. has presented"
                ],
                "ans": "B. will present",
                "explain": "Bước 1: Mệnh đề thời gian 'As soon as the financial audit is complete' đang dùng thì hiện tại đơn. Bước 2: Theo quy tắc phối hợp thì, mệnh đề chính chỉ hành động xảy ra sau đó trong tương lai -> chia thì Tương lai đơn (will + V_inf). Bước 3: Chọn B. will present."
            }
        ]
    },
    "Các thì hoàn thành": {
        "badge": "CHUYÊN ĐỀ 4 · TỶ LỆ RA ĐỀ CAO NHẤT TOEIC",
        "title": "Các thì hoàn thành (Present Perfect & Past Perfect)",
        "overview": "Hiện tại hoàn thành (Present Perfect) là thì có tần suất xuất hiện cao nhất trong kỳ thi TOEIC Part 5 & 6. Kiểm tra khả năng diễn tả một sự việc bắt đầu trong quá khứ, kéo dài liên tục đến hiện tại và còn tiếp diễn trong tương lai, hoặc vừa mới hoàn thành mang lại kết quả ở hiện tại.",
        "sections": [
            {
                "heading": "1. Bảng công thức & Quy tắc cốt lõi",
                "type": "formula",
                "items": [
                    {
                        "title": "Hiện tại hoàn thành (Present Perfect)",
                        "formula": "Khẳng định: S + have/has + V3/ed | Phủ định: S + have/has not + V3/ed | Nghi vấn: Have/Has + S + V3/ed?",
                        "note": "He/She/It/Danh từ số ít đi với 'has'. I/We/You/They/Danh từ số nhiều đi với 'have'. Bị động: have/has been + V3/ed."
                    },
                    {
                        "title": "Quá khứ hoàn thành (Past Perfect)",
                        "formula": "Khẳng định: S + had + V3/ed",
                        "note": "Diễn tả hành động xảy ra và hoàn tất TRƯỚC một hành động hoặc mốc thời gian khác trong quá khứ (By the time S + V2/ed, S + had + V3/ed)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Cụm từ kinh điển với Hiện tại hoàn thành: since + mốc thời gian (since 2015, since Monday), for + khoảng thời gian (for 5 years).",
                    "Cụm 'trong suốt... vừa qua': over the past/last + thời gian (over the past decade, in the last six months, during the past few years).",
                    "Các phó từ đặc trưng: already, yet (câu phủ định/nghi vấn), just, recently, lately, ever, never, so far, up to now, until now.",
                    "Dấu hiệu Quá khứ hoàn thành: 'by the time' + Quá khứ đơn, 'before' + Quá khứ đơn, 'already... when'."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY SINCE CỰC KỲ PHỔ BIẾN: Sau 'since' là mệnh đề Quá khứ đơn (S + V2/ed), nhưng mệnh đề chính phía trước/sau bắt buộc phải là Hiện tại hoàn thành (S + have/has + V3/ed). Công thức: S + have/has V3/ed + SINCE + S + V2/ed.",
                    "Bẫy nhầm lẫn 'since' mang nghĩa 'bởi vì' (Because): Khi 'since' mang nghĩa 'bởi vì', nó đi với bất kỳ thì nào tùy ngữ cảnh!"
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy cụm 'over the past / last...' hoặc 'for the last 3 years' -> Lập tức khoanh phương án có 'have/has + V3/ed'.",
                    "Thấy 'By the time + V2/ed' -> Nhìn sang mệnh đề chính, tìm ngay phương án có 'had + V3/ed'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "Nexus Logistics _______ its international delivery fleet significantly over the past two years.",
                "options": [
                    "A. expands",
                    "B. has expanded",
                    "C. expanded",
                    "D. will expand"
                ],
                "ans": "B. has expanded",
                "explain": "Bước 1: Nhận diện dấu hiệu thời gian 'over the past two years' (trong suốt 2 năm qua). Bước 2: Đây là dấu hiệu độc quyền của thì Hiện tại hoàn thành (have/has + V3/ed). Bước 3: Chủ ngữ 'Nexus Logistics' là tên công ty (số ít) -> Chọn 'has expanded'."
            }
        ]
    },
    "Sự phối hợp thì (Sequence of Tenses)": {
        "badge": "CHUYÊN ĐỀ 5 · CHIẾN THUẬT PART 5 & 6",
        "title": "Sự phối hợp thì (Sequence of Tenses)",
        "overview": "Quy luật phối hợp thì giữa mệnh đề chính (Main Clause) và mệnh đề phụ (Subordinate Clause) theo trục thời gian Hiện tại - Quá khứ - Tương lai. Nắm vững quy tắc này giúp bạn loại ngay 2-3 phương án sai trong vòng 3 giây.",
        "sections": [
            {
                "heading": "1. Bảng quy tắc phối thì chuẩn xác",
                "type": "formula",
                "items": [
                    {
                        "title": "Hiện tại đi với Tương lai (Present - Future)",
                        "formula": "Mệnh đề chỉ thời gian/điều kiện (Hiện tại đơn) + Mệnh đề chính (Tương lai đơn will + V)",
                        "note": "Ví dụ: When the supervisor arrives, we will start the meeting."
                    },
                    {
                        "title": "Quá khứ đi với Quá khứ (Past - Past)",
                        "formula": "Mệnh đề chính (Quá khứ) -> Mệnh đề phụ lùi về Quá khứ đơn / Quá khứ tiếp diễn / Quá khứ hoàn thành",
                        "note": "Ví dụ: Ms. Miller announced that the merger had been approved."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Liên từ nối thời gian: when, while, as soon as, by the time, before, after, until, once.",
                    "Liên từ điều kiện: if, provided that, as long as, in case, unless.",
                    "Động từ tường thuật quá khứ: announced, stated, confirmed, reported, mentioned that..."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "Bẫy mệnh đề sau 'before' và 'after': 'Before + Quá khứ đơn, Quá khứ hoàn thành' vs 'After + Quá khứ hoàn thành, Quá khứ đơn'. Nhớ mẹo: Trước BEFORE chia Hoàn thành, sau AFTER chia Hoàn thành.",
                    "Bẫy phối hợp thì nhưng có 'Since': 'S + have/has V3/ed + since + S + V2/ed'. Đây là trường hợp duy nhất Hiện tại hoàn thành đi chung với Quá khứ đơn qua liên từ 'since'."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Quy tắc bất diệt: 'Mệnh đề chính là Quá khứ thì mệnh đề phụ KHÔNG BAO GIỜ dùng Hiện tại hoặc Tương lai (will)' (trừ chân lý hiển nhiên). Loại ngay đáp án will/is/are/has.",
                    "Mệnh đề thời gian chứa 'when/once/as soon as' có động từ chia hiện tại -> Mệnh đề kia 90% chọn 'will + V_inf'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The branch manager confirmed yesterday that all pending loan applications _______ by the regional committee.",
                "options": [
                    "A. will review",
                    "B. are reviewing",
                    "C. had been reviewed",
                    "D. review"
                ],
                "ans": "C. had been reviewed",
                "explain": "Bước 1: Mệnh đề chính có 'confirmed yesterday' ở thì Quá khứ đơn. Bước 2: Theo quy tắc lùi thì, mệnh đề sau 'that' phải ở quá khứ, loại A (tương lai), B & D (hiện tại). Bước 3: Việc thẩm định hồ sơ diễn ra trước khi xác nhận -> dùng Quá khứ hoàn thành dạng bị động 'had been reviewed'."
            }
        ]
    },
    "Danh từ (Nouns) & Cụm danh từ": {
        "badge": "CHUYÊN ĐỀ 6 · CHIẾM 35% SỐ CÂU TỪ LOẠI",
        "title": "Danh từ (Nouns) & Cấu trúc Cụm danh từ (Noun Phrases)",
        "overview": "Cấu trúc danh từ và cụm danh từ là cốt lõi của TOEIC Part 5. Đề bài thường yêu cầu xác định danh từ làm Chủ ngữ, Tân ngữ, hoặc danh từ ghép (Compound Nouns) trong văn bản hợp đồng, báo cáo thương mại.",
        "sections": [
            {
                "heading": "1. Vị trí & Dấu hiệu nhận biết Hậu tố Danh từ (Noun Suffixes)",
                "type": "formula",
                "items": [
                    {
                        "title": "Vị trí của Danh từ trong câu",
                        "formula": "1. Đứng đầu câu làm S (S + V) | 2. Sau Ngoại động từ làm O (V + N) | 3. Sau Giới từ (Prep + N/V-ing) | 4. Sau Mạo từ (A/An/The + N) | 5. Sau Tính từ sở hữu (My/Our/Their/His/Her/Its + N) | 6. Sau Lượng từ (Many/Some/All + N)",
                        "note": "Cấu trúc Cụm danh từ mở rộng: [Mạo từ/TTSH] + [Trạng từ] + [Tính từ] + [Danh từ chính]. Danh từ chính luôn nằm ở CUỐI CÙNG của cụm!"
                    },
                    {
                        "title": "Các đuôi (hậu tố) nhận diện Danh từ",
                        "formula": "Đuôi chỉ vật/khái niệm: -tion, -sion, -ment, -ance, -ence, -ity, -ness, -ship, -ism, -hood, -cy.\nĐuôi chỉ người: -er, -or, -ee, -ist, -ant, -ent (applicant, supervisor, employee, participant).",
                        "note": "Cực kỳ chú ý phân biệt giữa Danh từ chỉ người và Danh từ chỉ vật trong đề thi ETS (applicant vs application, representative vs representation)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết & Danh từ ghép (Compound Nouns) ETS hay ra",
                "type": "signals",
                "items": [
                    "Các cụm danh từ ghép siêu phổ biến: employee performance (hiệu suất nhân viên), safety standards (tiêu chuẩn an toàn), customer satisfaction (sự hài lòng của khách hàng), attendance record (hồ sơ chuyên cần), travel expenses (chi phí đi lại), interest rate (lãi suất), expiration date (ngày hết hạn).",
                    "Dấu hiệu khoảng trống đứng sau: a/an/the, this/that/these/those, my/your/his/her/its/their, some/many/few."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY DANH TỪ KHÔNG ĐẾM ĐƯỢC (Uncountable Nouns): TUYỆT ĐỐI không có 'a/an' phía trước và KHÔNG thêm '-s/-es' phía sau: information, equipment, furniture, luggage/baggage, advice, machinery, merchandise, access, news, traffic, cash. Không bao giờ chọn 'an equipment' hoặc 'furnitures'!",
                    "BẪY ĐUÔI -ANT/-ENT/-IVE LÀ DANH TỪ CHỈ NGƯỜI: representative (người đại diện - N), executive (giám đốc điều hành - N), alternative (phương án thay thế - N), initiative (sáng kiến - N), objective (mục tiêu - N). Học sinh hay nhầm đuôi -ive là tính từ!"
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy công thức: 'The/TTSH + (Tính từ) + ______ + Giới từ/Động từ' -> Điền ngay một DANH TỪ vào chỗ trống.",
                    "Nếu cả 4 đáp án đều là danh từ, kiểm tra ngay xem chỗ trống cần chỉ NGƯỜI hay chỉ VẬT bằng cách nhìn động từ phía sau (động từ hành vi con người hay bị động)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "All participants in the seminar will receive a certificate of _______ upon completing the workshop.",
                "options": [
                    "A. attend",
                    "B. attendance",
                    "C. attendant",
                    "D. attended"
                ],
                "ans": "B. attendance",
                "explain": "Bước 1: Chỗ trống đứng sau giới từ 'of' -> cần một Danh từ. Loại A (động từ) và D (quá khứ). Bước 2: Cân nhắc giữa B (attendance - sự tham dự) và C (attendant - người phục vụ). Bước 3: Cụm từ chuẩn nghĩa công sở là 'certificate of attendance' (chứng chỉ chuyên cần/tham dự) -> Chọn B."
            }
        ]
    },
    "Đại từ (Pronouns: Phản thân, Sở hữu)": {
        "badge": "CHUYÊN ĐỀ 7 · ĂN TRỌN ĐIỂM DỄ DÀNG",
        "title": "Đại từ (Pronouns: Nhân xưng, Phản thân & Đại từ sở hữu)",
        "overview": "Câu hỏi đại từ luôn xuất hiện 1–2 câu trong mỗi đề thi Part 5. Dạng bài này cực kỳ dễ lấy điểm tuyệt đối nếu nắm vững vị trí đứng của Đại từ nhân xưng (Chủ ngữ/Tân ngữ), Tính từ sở hữu, Đại từ sở hữu và Đại từ phản thân.",
        "sections": [
            {
                "heading": "1. Bảng hệ thống Đại từ tiếng Anh toàn diện",
                "type": "formula",
                "items": [
                    {
                        "title": "Bảng phân loại đại từ",
                        "formula": "Chủ ngữ (S): I, We, You, They, He, She, It (đứng trước V chính)\nTân ngữ (O): me, us, you, them, him, her, it (đứng sau V hoặc Prep)\nTính từ sở hữu (TTSH): my, our, your, their, his, her, its (+ NOUN BẮT BUỘC)\nĐại từ sở hữu (ĐTSH): mine, ours, yours, theirs, his, hers (= TTSH + Noun, đứng độc lập)\nĐại từ phản thân: myself, ourselves, yourself/yourselves, themselves, himself, herself, itself",
                        "note": "Quy tắc Đại từ phản thân: Dùng khi Chủ ngữ và Tân ngữ cùng là một đối tượng, hoặc dùng để nhấn mạnh (By oneself = on one's own = tự mình)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Chỗ trống đứng ngay trước một Danh từ -> 95% chọn Tính từ sở hữu (their, his, her, its, our).",
                    "Chỗ trống đứng sau giới từ 'by' ở cuối câu -> 95% chọn Đại từ phản thân (by himself, by herself, by themselves = một mình, tự thân).",
                    "Cụm từ cố định: 'on one's own' = 'by oneself' (tự thân vận động, không cần trợ giúp)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "Bẫy nhầm lẫn giữa Tính từ sở hữu (ITS) và Đại từ chỉ chủ ngữ viết tắt (IT'S = It is): 'The company increased its (TTSH) market share' (ĐÚNG), không bao giờ dùng 'it's'!",
                    "Bẫy Đại từ sở hữu thay thế cho cả cụm: 'Her presentation was longer than mine' (mine = my presentation). Đại từ sở hữu đứng một mình, TUYỆT ĐỐI không đi kèm thêm danh từ phía sau."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Nhìn ngay sau chỗ trống: Có DANH TỪ -> Chọn TÍNH TỪ SỞ HỮU (its, their, your, our...).",
                    "Nhìn trước chỗ trống: Có động từ ngoại và chủ ngữ đã thực hiện hành động lên chính mình, hoặc cuối câu có 'by ______' -> Chọn ĐẠI TỪ PHẢN THÂN (-self/-selves)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "Ms. Henderson drafted the entire financial summary _______ without any assistance from the audit team.",
                "options": [
                    "A. her",
                    "B. she",
                    "C. herself",
                    "D. hers"
                ],
                "ans": "C. herself",
                "explain": "Bước 1: Câu đã có đầy đủ Chủ ngữ (Ms. Henderson), Động từ (drafted) và Tân ngữ (the entire financial summary). Bước 2: Chỗ trống dùng để nhấn mạnh chính chủ ngữ đã tự tay làm việc đó. Bước 3: Dùng Đại từ phản thân 'herself' để nhấn mạnh -> Chọn C."
            }
        ]
    },
    "Tính từ (Adjectives) & Đuôi -ing/-ed": {
        "badge": "CHUYÊN ĐỀ 8 · PHÂN BIỆT BẢN CHẤT CHỦ ĐỘNG & BỊ ĐỘNG",
        "title": "Tính từ (Adjectives) & Phân từ làm Tính từ (-ing vs -ed)",
        "overview": "Tính từ dùng để bổ nghĩa cho danh từ hoặc đứng sau các động từ liên kết (Linking Verbs). Dạng bài khó nhất mà ETS thường xuyên ra là phân biệt giữa Tính từ đuôi -ing (chủ động, bản chất sự vật) và đuôi -ed (bị động, cảm xúc con người/được tác động).",
        "sections": [
            {
                "heading": "1. Vị trí Tính từ & Quy tắc Phân từ đuôi -ing / -ed",
                "type": "formula",
                "items": [
                    {
                        "title": "Vị trí chuẩn của Tính từ",
                        "formula": "1. Đứng trước Danh từ: Adj + Noun (an effective solution)\n2. Sau Động từ to be: S + be + Adj (The report is accurate)\n3. Sau Linking Verbs: remain, stay, become, look, seem, appear, feel, sound + Adj\n4. Trong cấu trúc: Make / Keep / Find + O + Adj (Keep the room clean)",
                        "note": "Quy tắc -ing vs -ed:\n- Tính từ đuôi -ing: Miêu tả bản chất tạo ra tác động/tính chất của sự vật, sự việc (an interesting book, a demanding job, promising results).\n- Tính từ đuôi -ed: Miêu tả cảm xúc con người nhận tác động, hoặc sự vật bị tác động (interested clients, finished goods, satisfied customers)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Các đuôi nhận diện Tính từ: -ful (helpful), -less (careless), -able/-ible (reliable), -ive (creative), -ous (famous), -al (financial), -ic (economic), -ent/-ant (efficient, significant).",
                    "Các cặp Tính từ phân từ bất biến ETS bắt buộc phải thuộc:\n- promising candidate / results (ứng viên / kết quả đầy hứa hẹn)\n- existing equipment (trang thiết bị hiện có)\n- overwhelming demand (nhu cầu quá lớn/áp đảo)\n- experienced / qualified applicant (ứng viên có kinh nghiệm / đủ tiêu chuẩn)\n- detailed report / instructions (báo cáo / chỉ dẫn chi tiết)\n- customized / personalized service (dịch vụ được tùy chỉnh cá nhân hóa)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY TỪ CÓ ĐUÔI -LY NHƯNG LÀ TÍNH TỪ: costly (đắt đỏ), friendly (thân thiện), lovely (đáng yêu), timely (kịp thời), orderly (ngăn nắp, trật tự), lively (sống động). Trong đề thi ETS, 'in a timely manner' (một cách kịp thời) thì 'timely' là TÍNH TỪ bổ nghĩa cho danh từ 'manner'!",
                    "Bẫy chọn nhầm danh từ làm tính từ: Đề thi hay bẫy 'economy crisis' (SAI) -> phải dùng tính từ 'economic crisis' (khủng hoảng kinh tế)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy cấu trúc: 'remain / stay / become / seem + ______' -> 90% chọn ngay TÍNH TỪ.",
                    "Thấy 'Make / Keep + Tân ngữ + ______' -> Chọn ngay TÍNH TỪ (ví dụ: Please keep all files confidential)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The engineering team provided a _______ explanation of the new machinery's operating system.",
                "options": [
                    "A. detail",
                    "B. detailed",
                    "C. detailing",
                    "D. details"
                ],
                "ans": "B. detailed",
                "explain": "Bước 1: Chỗ trống nằm giữa mạo từ 'a' và danh từ 'explanation' -> bắt buộc là một Tính từ. Loại A (động từ/danh từ) và D (danh từ số nhiều). Bước 2: Phân biệt giữa 'detailed' và 'detailing'. Bản thân lời giải thích được diễn giải chi tiết bởi con người (mang nghĩa bị động). Bước 3: Cụm từ chuẩn 'a detailed explanation' (lời giải thích chi tiết) -> Chọn B."
            }
        ]
    },
    "Trạng từ (Adverbs) & Vị trí trạng từ": {
        "badge": "CHUYÊN ĐỀ 9 · THỦ THUẬT LOẠI BỎ ĐỂ TÌM VỊ TRÍ",
        "title": "Trạng từ (Adverbs) & Vị trí Trạng từ trong câu",
        "overview": "Trạng từ thường có đuôi '-ly', dùng để bổ nghĩa cho Động từ thường, Tính từ, hoặc một Trạng từ khác, thậm chí cả câu. Trạng từ là thành phần 'phụ' có thể lược bỏ mà câu vẫn đúng ngữ pháp.",
        "sections": [
            {
                "heading": "1. Vị trí vàng của Trạng từ trong đề thi TOEIC",
                "type": "formula",
                "items": [
                    {
                        "title": "4 Vị trí vàng của Trạng từ",
                        "formula": "1. Đứng giữa Trợ động từ và Động từ chính: have/has + ADV + V3/ed | be + ADV + V-ing | be + ADV + V3/ed\n2. Đứng sau Ngoại động từ và Tân ngữ: S + V + O + ADV (He completed the task efficiently)\n3. Đứng trước Tính từ để bổ nghĩa: ADV + ADJ + NOUN (an extremely successful launch)\n4. Đứng đầu câu trước dấu phẩy bổ nghĩa cả câu: ADV, S + V + O (Recently, the board approved the plan)",
                        "note": "TUYỆT ĐỐI KHÔNG chen Trạng từ vào giữa Động từ và Tân ngữ trực tiếp của nó: SAI: 'He completed successfully the task' -> ĐÚNG: 'He completed the task successfully' hoặc 'He successfully completed the task'."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết & Các phó từ hay gặp nhất",
                "type": "signals",
                "items": [
                    "Các trạng từ mức độ/tần suất cực kỳ phổ biến trong đề thi: dramatically, substantially, significantly, considerably (đáng kể - hay đi với tăng/giảm: increase/decrease dramatically).",
                    "Các trạng từ thời gian/tính chuẩn xác: strictly (nghiêm ngặt), promptly (đúng giờ/nhanh chóng), thoroughly (kỹ lưỡng), consistently (nhất quán), approximately / roughly (xấp xỉ).",
                    "Đứng trước số liệu: approximately / nearly / roughly / about + [Số lượng] (gần như, xấp xỉ)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY TRẠNG TỪ KHÔNG CÓ ĐUÔI -LY: hard (chăm chỉ / vất vả), fast (nhanh), late (muộn), early (sớm), high (cao). Chú ý: 'hardly' có nghĩa là 'hầu như không' chứ KHÔNG PHẢI là 'chăm chỉ'!",
                    "Bẫy 'lately' vs 'late': 'late' là trễ/muộn (He arrived late), còn 'lately' là dạo gần đây (I haven't seen him lately - thì Hiện tại hoàn thành)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy khoảng trống nằm giữa: 'have/has ______ V3/ed' hoặc 'is/are ______ V3/ed' hoặc 'will ______ V_inf' -> 100% ĐIỀN TRẠNG TỪ ĐUÔI -LY!",
                    "Khi che chỗ trống đi mà câu vẫn hoàn chỉnh đầy đủ S + V + O -> Chỗ trống đó 100% là TRẠNG TỪ."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The maintenance crew has _______ inspected all ventilation units in the manufacturing plant.",
                "options": [
                    "A. thorough",
                    "B. thoroughly",
                    "C. thoroughness",
                    "D. more thorough"
                ],
                "ans": "B. thoroughly",
                "explain": "Bước 1: Quan sát cấu trúc câu có thì Hiện tại hoàn thành: 'has [______] inspected'. Bước 2: Khoảng trống nằm kẹp giữa Trợ động từ 'has' và Phân từ hai 'inspected' -> vị trí độc tôn của Trạng từ. Bước 3: Chọn ngay đáp án có đuôi -ly: B. thoroughly (một cách kỹ lưỡng)."
            }
        ]
    },
    "Mạo từ (A, An, The) & Lượng từ": {
        "badge": "CHUYÊN ĐỀ 10 · QUY TẮC ĐẾM ĐƯỢC & KHÔNG ĐẾM ĐƯỢC",
        "title": "Mạo từ (A, An, The) & Lượng từ (Quantifiers)",
        "overview": "Chuyên đề phân biệt danh từ đếm được số ít, số nhiều và không đếm được thông qua mạo từ và lượng từ đi kèm. Rất nhiều thí sinh mất điểm oan vì không nắm vững các cặp lượng từ mang tính loại trừ nhau.",
        "sections": [
            {
                "heading": "1. Bảng công thức Mạo từ & Lượng từ cơ bản",
                "type": "formula",
                "items": [
                    {
                        "title": "Mạo từ A, An, The",
                        "formula": "A/An + Danh từ đếm được số ít (chưa xác định, nhắc đến lần đầu)\n'An' dùng trước nguyên âm phát âm (/u, e, o, a, i/): an hour, an honest man, an urgent email.\nThe + Danh từ xác định (cả số ít, số nhiều, không đếm được mà người nghe/nói đều biết rõ, hoặc duy nhất).",
                        "note": "Không dùng mạo từ trước danh từ không đếm được khi nói chung chung (Water is essential, Business is growing)."
                    },
                    {
                        "title": "Bảng quy chuẩn Lượng từ (Quantifiers)",
                        "formula": "+ N số nhiều: many, a few, few, several, both, various, a number of\n+ N không đếm được: much, a little, little, a great deal of, an amount of\n+ Cả hai: some, any, a lot of, plenty of, most, all\n+ N số ít: each, every, either, neither, another",
                        "note": "'A few' (một vài, đủ dùng) vs 'Few' (rất ít, hầu như không có - mang nghĩa tiêu cực). Tương tự: 'A little' vs 'Little'."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Cụm từ lượng từ bắt buộc đi với 'of the': most of the, all of the, some of the, each of the, one of the + N số nhiều.",
                    "Phân biệt bộ tứ: 'most' (hầu hết - Most students), 'almost' (gần như - Almost all students), 'mostly' (chủ yếu là - The crowd was mostly young), 'the most' (nhất - The most important).",
                    "Cụm từ ETS hay ra: 'a variety of' (đa dạng), 'a wide range of' (nhiều loại), 'an extensive array of'."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY EVERY / EACH: 'Every' và 'Each' LUÔN LUÔN đi với DANH TỪ ĐẾM ĐƯỢC SỐ ÍT và ĐỘNG TỪ CHIA SỐ ÍT: 'Every employee is required...' (KHÔNG dùng 'Every employees are').",
                    "Bẫy 'another' vs 'other': 'another + N số ít' (một cái khác), 'other + N số nhiều / không đếm được' (những cái khác), 'the other + N xác định còn lại'."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Nhìn ngay sau chỗ trống: Nếu là Danh từ số nhiều có đuôi -s/-es -> Loại ngay 'every, each, another, much, a little'.",
                    "Nếu là Danh từ không đếm được (information, equipment, advice...) -> Loại ngay 'many, several, few, each, every'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "_______ employee wishing to enroll in the management development program must submit a written request.",
                "options": [
                    "A. All",
                    "B. Several",
                    "C. Every",
                    "D. Many"
                ],
                "ans": "C. Every",
                "explain": "Bước 1: Quan sát từ ngay sau chỗ trống là danh từ số ít 'employee' (không có -s) và động từ là 'must submit'. Bước 2: Loại A (All), B (Several), D (Many) vì cả 3 lượng từ này đều bắt buộc phải đi với danh từ số nhiều (employees). Bước 3: Chỉ có 'Every' đi với danh từ số ít đếm được -> Chọn C. Every."
            }
        ]
    },
    "Câu bị động (Passive Voice)": {
        "badge": "CHUYÊN ĐỀ 11 · 5 CÂU MỖI ĐỀ THI PART 5",
        "title": "Câu bị động (Passive Voice) & Thể Bị động đặc biệt",
        "overview": "Câu bị động xuất hiện dày đặc trong văn phong hành chính, biên bản doanh nghiệp nhằm nhấn mạnh đối tượng tiếp nhận hành động thay vì người thực hiện. Quy tắc xét 'Tân ngữ phía sau' là chìa khóa giải quyết 100% câu hỏi dạng này.",
        "sections": [
            {
                "heading": "1. Công thức tổng quát & Các thì Bị động",
                "type": "formula",
                "items": [
                    {
                        "title": "Công thức gốc: S + BE + V3/ed (+ by O)",
                        "formula": "- Hiện tại đơn: am/is/are + V3/ed\n- Quá khứ đơn: was/were + V3/ed\n- Hiện tại tiếp diễn: am/is/are + being + V3/ed\n- Hiện tại hoàn thành: have/has + been + V3/ed\n- Tương lai đơn: will be + V3/ed\n- Động từ khuyết thiếu (Modals): can/could/should/must + be + V3/ed",
                        "note": "Ngoại động từ (Transitive Verbs) bắt buộc phải có Tân ngữ ở thể chủ động. Khi chuyển sang bị động, Tân ngữ đã bị đưa lên làm Chủ ngữ, do đó PHÍA SAU ĐỘNG TỪ BỊ ĐỘNG KHÔNG CÒN TÂN NGỮ NỮA (thường theo sau bởi giới từ by, in, at, on... hoặc trạng từ)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Sau chỗ trống có giới từ 'by + tác nhân' hoặc các giới từ khác: in, on, at, with, to...",
                    "Chủ ngữ là danh từ chỉ vật/sự việc (the proposal, the contract, the shipment, the system) -> 90% động từ chia ở thể Bị động.",
                    "Các cấu trúc bị động chỉ định công sở: 'be expected to V' (được kỳ vọng), 'be scheduled to V' (được lên lịch), 'be required to V' (bị bắt buộc), 'be reminded that' (được nhắc nhở)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY NỘI ĐỘNG TỪ (Intransitive Verbs) KHÔNG BAO GIỜ CHIA BỊ ĐỘNG: occur, happen, take place, remain, exist, rise, fall, arrive, expire, function. Đề thi ETS thường gài: 'The warranty was expired' (SAI) -> phải là 'The warranty expired' (ĐÚNG)!",
                    "Bẫy ngoại động từ có 2 tân ngữ (give, send, offer, grant, award): Khi chia bị động vẫn còn 1 tân ngữ phía sau: 'Mr. John was offered a promotion' (ĐÚNG)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Quy tắc Thần thánh: 'Nhìn sau chỗ trống KHÔNG CÓ TÂN NGỮ (danh từ) -> Chọn đáp án BỊ ĐỘNG (be + V3/ed)'.",
                    "'Nhìn sau chỗ trống CÓ TÂN NGỮ (danh từ) -> Chọn đáp án CHỦ ĐỘNG'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "All sensitive client files must be _______ in a locked cabinet at the end of each working day.",
                "options": [
                    "A. stored",
                    "B. store",
                    "C. storing",
                    "D. stores"
                ],
                "ans": "A. stored",
                "explain": "Bước 1: Nhận diện cấu trúc động từ khuyết thiếu bị động 'must be [______]'. Bước 2: Sau 'be' bắt buộc phải là Phân từ hai (V3/ed) để hoàn thiện thể bị động của động từ ngoại 'store' (lưu trữ). Bước 3: Chọn A. stored."
            }
        ]
    },
    "Sự hòa hợp Chủ ngữ & Động từ (S-V Agreement)": {
        "badge": "CHUYÊN ĐỀ 12 · BẪY NGÔI THỨ TRONG PART 5",
        "title": "Sự hòa hợp giữa Chủ ngữ và Động từ (Subject - Verb Agreement)",
        "overview": "Quy tắc cốt lõi: Chủ ngữ số ít đi với động từ số ít, Chủ ngữ số nhiều đi với động từ số nhiều. Điểm khó trong đề thi ETS là chủ ngữ thường bị chèn thêm các cụm giới từ, mệnh đề quan hệ rất dài nhằm đánh lạc hướng người học.",
        "sections": [
            {
                "heading": "1. Bảng quy tắc hòa hợp Chủ - Vị toàn diện",
                "type": "formula",
                "items": [
                    {
                        "title": "Công thức lọc thành phần nhiễu",
                        "formula": "S + [Cụm giới từ: of / with / along with / together with / in addition to] + V\n-> Động từ chia theo CHỦ NGỮ CHÍNH (S) đứng đầu, bỏ qua toàn bộ phần trong ngoặc!",
                        "note": "Ví dụ: The manager, along with his assistants, IS attending the summit."
                    },
                    {
                        "title": "Các cặp liên từ tương quan & Quy tắc gần nhất",
                        "formula": "Either S1 or S2 + V (chia theo S2)\nNeither S1 nor S2 + V (chia theo S2)\nNot only S1 but also S2 + V (chia theo S2)",
                        "note": "Động từ luôn chia hòa hợp với chủ ngữ S2 (chủ ngữ nằm gần động từ nhất)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "BẮT BUỘC CHIA ĐỘNG TỪ SỐ ÍT:\n- Danh động từ làm chủ ngữ: V-ing... + V(số ít) (Analyzing financial data requires patience).\n- Đại từ bất định: everyone, someone, anyone, no one, everybody, everything + V(số ít).\n- Tên công ty, tên tác phẩm, khoản tiền, khoảng cách thời gian: 10 million dollars is..., Two weeks is...",
                    "PHÂN BIỆT 'A number of' vs 'The number of':\n- A number of + N số nhiều + V(SỐ NHIỀU) (mang nghĩa: nhiều...)\n- The number of + N số nhiều + V(SỐ ÍT) (mang nghĩa: số lượng của...)"
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY CỤM DANH TỪ CÓ 'OF': 'The quality of these products _______ inspected.' Chủ ngữ chính là 'The quality' (danh từ không đếm được số ít), KHÔNG PHẢI 'these products'! Động từ phải chia là 'is', không chia 'are'!",
                    "Bẫy danh từ có tận cùng là -s nhưng là số ít: news, economics, physics, headquarters (trụ sở chính có thể dùng cả số ít/nhiều tùy nghĩa)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Khi câu có dạng 'Danh từ 1 + Giới từ (of/for/in/to) + Danh từ 2': Lấy bút gạch bỏ từ Giới từ đến trước Động từ. Xác định số ít/nhiều chỉ dựa vào DANH TỪ 1!",
                    "Thấy đầu câu là 'V-ing' (Gerund) làm chủ ngữ -> 100% chọn ngay động từ số ít (có đuôi -s/es hoặc is/was/has)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The number of overseas investors participating in the renewable energy project _______ rapidly this year.",
                "options": [
                    "A. is increasing",
                    "B. are increasing",
                    "C. have increased",
                    "D. increase"
                ],
                "ans": "A. is increasing",
                "explain": "Bước 1: Tìm chủ ngữ chính của câu. Cụm 'participating in the renewable energy project' là mệnh đề rút gọn bổ nghĩa. Bước 2: Chủ ngữ bắt đầu bằng 'The number of...' -> theo quy tắc bắt buộc chia Động từ số ít. Bước 3: Loại B, C, D (động từ số nhiều) -> Chọn A. is increasing."
            }
        ]
    },
    "Động từ nguyên mẫu (To-Infinitive & Bare V)": {
        "badge": "CHUYÊN ĐỀ 13 · MỤC ĐÍCH & ĐỘNG TỪ ĐI KÈM",
        "title": "Động từ nguyên mẫu có To (To-V) & Nguyên mẫu không To (Bare V)",
        "overview": "To-V xuất hiện với tần suất cực cao để chỉ mục đích hành động (in order to / so as to V) hoặc làm tân ngữ sau các động từ chỉ kế hoạch, quyết định, hy vọng.",
        "sections": [
            {
                "heading": "1. Bảng động từ bắt buộc đi với To-Infinitive",
                "type": "formula",
                "items": [
                    {
                        "title": "Động từ theo sau bởi To-V (Verb + To-V)",
                        "formula": "decide, hope, plan, expect, refuse, promise, agree, offer, fail, aim, choose, afford, intend, manage, hesitate, seek + TO-V",
                        "note": "Ví dụ: The board agreed to postpone the annual meeting."
                    },
                    {
                        "title": "Cấu trúc: Động từ + Tân ngữ + To-V (Verb + O + To-V)",
                        "formula": "require, request, allow, permit, enable, remind, advise, encourage, invite, instruct, urge + O + TO-V",
                        "note": "Ví dụ: The system allows employees to access records remotely."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Cụm từ chỉ mục đích đứng đầu hoặc cuối câu: in order to + V_inf, so as to + V_inf, to + V_inf.",
                    "Tính từ đi với To-V: be able to V (có thể), be ready to V (sẵn sàng), be eligible to V (đủ điều kiện), be likely to V (có khả năng), be reluctant to V (do dự).",
                    "Cụm danh từ đi với To-V: opportunity to V (cơ hội để), ability to V (khả năng), failure to V (việc không thực hiện được), effort to V (nỗ lực để)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY 'TO' LÀ GIỚI TỪ (THEO SAU LÀ V-ING, KHÔNG PHẢI TO-V): look forward to + V-ING (mong đợi), be committed/dedicated to + V-ING (tận tâm), be accustomed/used to + V-ING (quen với), lead to + V-ING (dẫn đến), object to + V-ING (phản đối).",
                    "Động từ tri giác & Make/Let đi với Bare V: Make/Let + O + V_bare (The supervisor made us work late)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy đầu câu có khoảng trống đứng trước dấu phẩy: '______ + (Tân ngữ), S + V + O' -> 90% chọn 'To + V_inf' để chỉ mục đích!",
                    "Thấy các cấu trúc bị động: 'be required / reminded / asked / encouraged / expected' -> Chọn ngay 'TO + V_inf' phía sau!"
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The company launched an online mentorship program to encourage junior employees _______ leadership skills.",
                "options": [
                    "A. develop",
                    "B. developing",
                    "C. to develop",
                    "D. developed"
                ],
                "ans": "C. to develop",
                "explain": "Bước 1: Nhận diện cấu trúc động từ 'encourage someone to do something' (khuyến khích ai làm gì). Bước 2: Sau tân ngữ 'junior employees' bắt buộc là dạng To-Infinitive. Bước 3: Chọn ngay C. to develop."
            }
        ]
    },
    "Danh động từ (Gerunds V-ing)": {
        "badge": "CHUYÊN ĐỀ 14 · PHÂN BIỆT TO-V VÀ V-ING",
        "title": "Danh động từ (Gerunds: V-ing)",
        "overview": "Danh động từ có vai trò như một danh từ (làm Chủ ngữ hoặc Tân ngữ), nhưng vẫn mang đặc tính của một động từ (có thể nhận một tân ngữ trực tiếp phía sau nó). Rất hay xuất hiện sau Giới từ và các động từ chuyên biệt.",
        "sections": [
            {
                "heading": "1. Bảng động từ bắt buộc đi với V-ing & Vị trí Gerund",
                "type": "formula",
                "items": [
                    {
                        "title": "Động từ theo sau bởi Danh động từ (Verb + V-ing)",
                        "formula": "consider, suggest, recommend, avoid, postpone, delay, enjoy, finish, mind, practice, appreciate, admit, involve, include + V-ING",
                        "note": "Ví dụ: We are considering expanding our operations into Southeast Asia."
                    },
                    {
                        "title": "Quy tắc Giới từ + V-ing",
                        "formula": "Preposition (in, on, at, by, for, about, without, before, after) + V-ING + Tân ngữ",
                        "note": "Ví dụ: By improving customer support, we boosted retention rates."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Cụm thành ngữ luôn đi với V-ing: spend time/money + V-ing, have difficulty/trouble + V-ing (gặp khó khăn khi làm gì), It is no use / no good + V-ing (chẳng ích gì), be worth + V-ing (đáng để làm gì).",
                    "Cụm giới từ chỉ phương thức: by + V-ing (bằng cách), without + V-ing (mà không), instead of + V-ing (thay vì)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY PHÂN BIỆT DANH TỪ GỐC VÀ DANH ĐỘNG TỪ (Noun vs V-ing sau giới từ): Nếu phía sau chỗ trống CÓ TÂN NGỮ (Danh từ) -> Phải chọn V-ING để nhận tân ngữ đó! Nếu sau chỗ trống KHÔNG CÓ TÂN NGỮ -> Phải chọn DANH TỪ GỐC! Ví dụ: for the [installation] of equipment (danh từ gốc) VS for [installing] equipment (danh động từ mang tân ngữ).",
                    "Động từ có nghĩa thay đổi khi đi với To-V vs V-ing: remember to V (nhớ phải làm gì) vs remember V-ing (nhớ đã làm gì); stop to V (dừng lại để làm gì) vs stop V-ing (dừng hẳn việc đang làm)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy sau giới từ có chỗ trống và ngay sau chỗ trống là MỘT DANH TỪ TÂN NGỮ -> 100% chọn 'V-ing'.",
                    "Thấy các động từ 'consider', 'suggest', 'recommend', 'postpone' -> Loại ngay To-V, chọn 'V-ing'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "Before _______ the finalized quarterly report, the lead auditor verified every financial figure.",
                "options": [
                    "A. submit",
                    "B. submission",
                    "C. submitting",
                    "D. submitted"
                ],
                "ans": "C. submitting",
                "explain": "Bước 1: Chỗ trống đứng sau giới từ thời gian 'Before'. Bước 2: Quan sát ngay sau chỗ trống có cụm danh từ tân ngữ 'the finalized quarterly report'. Bước 3: Danh từ gốc 'submission' không thể mang tân ngữ trực tiếp -> bắt buộc dùng Danh động từ 'submitting' -> Chọn C."
            }
        ]
    },
    "Động từ khuyết thiếu (Modal Verbs)": {
        "badge": "CHUYÊN ĐỀ 15 · NGHĨA VÀ MỨC ĐỘ CHẮC CHẮN",
        "title": "Động từ khuyết thiếu (Modal Verbs: Can, Could, Should, Must...)",
        "overview": "Modal Verbs biểu thị khả năng, nghĩa vụ, sự cho phép hoặc dự đoán logic. Sau Modal Verbs luôn là một Động từ nguyên thể không To (Bare V) ở thể chủ động, hoặc 'be + V3/ed' ở thể bị động.",
        "sections": [
            {
                "heading": "1. Bảng công thức & Ý nghĩa cốt lõi",
                "type": "formula",
                "items": [
                    {
                        "title": "Công thức tổng quát",
                        "formula": "Chủ động: S + Modal Verb + V_bare | Bị động: S + Modal Verb + be + V3/ed",
                        "note": "Các Modal Verbs thông dụng: can / could (khả năng), may / might (xác suất có thể), should / ought to (lời khuyên/khuyến nghị), must / have to (nghĩa vụ bắt buộc), would rather (thích hơn)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Cụm từ pháp lý/hợp đồng hay gặp: 'All visitors must present valid identification' (bắt buộc), 'Employees should report discrepancies promptly' (khuyến nghị).",
                    "Cấu trúc suy đoán quá khứ trong VSTEP: must have + V3/ed (chắc hẳn là đã), can't have + V3/ed (chắc chắn là không thể đã), should have + V3/ed (lẽ ra nên làm nhưng không làm)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY CHIA ĐỘNG TỪ SAU MODAL VERB: Tuyệt đối không thêm -s/-es, không dùng V-ing, không dùng To-V ngay sau Modal Verb (SAI: 'can to do' / 'must works').",
                    "Phân biệt 'must not' (cấm hoàn toàn) và 'do not have to' (không cần thiết phải làm)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy khoảng trống đứng ngay sau can/could/will/would/should/must/may -> Tìm ngay ĐỘNG TỪ NGUYÊN MẪU (V_bare) nếu là chủ động, hoặc 'be + V3/ed' nếu là bị động.",
                    "Nếu sau Modal Verb đã có trạng từ đuôi -ly -> Vẫn chọn V_bare (ví dụ: must promptly submit)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "All research assistants must _______ confidentiality agreements prior to reviewing clinical trial data.",
                "options": [
                    "A. sign",
                    "B. signature",
                    "C. signing",
                    "D. signed"
                ],
                "ans": "A. sign",
                "explain": "Bước 1: Nhận diện động từ khuyết thiếu 'must'. Bước 2: Theo quy tắc ngữ pháp, sau Modal Verb bắt buộc là một động từ nguyên thể không To (Bare Infinitive). Bước 3: Chọn A. sign."
            }
        ]
    },
    "Giới từ chỉ thời gian & nơi chốn (in, on, at, by)": {
        "badge": "CHUYÊN ĐỀ 16 · BẢO BỐI THỜI GIAN & KHÔNG GIAN",
        "title": "Giới từ chỉ thời gian & nơi chốn (in, on, at, by, within...)",
        "overview": "Quy tắc hình tháp từ tổng quát đến chi tiết cho thời gian và không gian. Đề thi TOEIC cực kỳ chú trọng phân biệt giữa 'by' (trước/hạn chót) và 'until' (liên tục cho đến khi).",
        "sections": [
            {
                "heading": "1. Bảng kim tự tháp Giới từ (IN - ON - AT)",
                "type": "formula",
                "items": [
                    {
                        "title": "Giới từ chỉ Thời gian",
                        "formula": "- AT + Giờ cụ thể / Dịp lễ ngắn: at 9:00 AM, at noon, at midnight, at the moment.\n- ON + Thứ / Ngày cụ thể: on Monday, on July 15th, on weekdays.\n- IN + Tháng / Năm / Mùa / Thế kỷ / Buổi trong ngày: in October, in 2026, in summer, in the morning.",
                        "note": "Quy tắc vàng: AT (cụ thể nhất) -> ON (trung bình) -> IN (rộng nhất/dài nhất)."
                    },
                    {
                        "title": "Phân biệt cặp giới từ 'BY' và 'UNTIL'",
                        "formula": "- BY + Mốc thời gian: Hoàn thành TRƯỚC hoặc TẠI thời điểm đó (hạn chót - deadline). Động từ đi kèm là hành động dứt điểm: submit, finish, arrive.\n- UNTIL + Mốc thời gian: Hành động KÉO DÀI LIÊN TỤC cho đến mốc đó. Động từ đi kèm là trạng thái kéo dài: stay, wait, continue, remain, postpone.",
                        "note": "Ví dụ: Please submit the report BY Friday (Nộp trước thứ 6). The store will remain closed UNTIL Monday (Cửa hàng đóng cửa liên tục đến thứ 2)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Cụm giới từ thời gian TOEIC kinh điển: within 5 business days (trong vòng 5 ngày làm việc), throughout the year (suốt cả năm), for over a decade (hơn 1 thập kỷ), during the conference (trong suốt hội nghị).",
                    "Giới từ nơi chốn công sở: across the nation (trên toàn quốc), throughout the facility (khắp cơ sở), adjacent to (liền kề), opposite to (đối diện)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY PHÂN BIỆT 'DURING' VÀ 'FOR': Cả hai đều dịch là 'trong', nhưng: 'DURING + Tên sự kiện/giai đoạn' (during the meeting, during the summer); còn 'FOR + Khoảng thời gian đo đếm được bằng số' (for two weeks, for five months).",
                    "Bẫy nhầm lẫn 'within' và 'in': 'within + khoảng thời gian' = 'trong vòng không quá' (within 24 hours)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy hành động nộp bài/giao hàng (submit, deliver, turn in) đi với thời gian -> Chọn 'BY', không chọn 'until'.",
                    "Thấy động từ 'remain, stay, wait' đi với thời gian -> Chọn 'UNTIL', không chọn 'by'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "All expense reimbursement claims must be submitted to the finance office _______ 5:00 PM on Friday.",
                "options": [
                    "A. until",
                    "B. by",
                    "C. on",
                    "D. in"
                ],
                "ans": "B. by",
                "explain": "Bước 1: Quan sát động từ chính là 'must be submitted' (phải được nộp - hành động dứt điểm). Bước 2: Thời gian là một mốc hạn chót (5:00 PM on Friday). Bước 3: Dùng giới từ 'by' để chỉ thời hạn cuối cùng phải hoàn thành -> Chọn B. by."
            }
        ]
    },
    "Giới từ nâng cao TOEIC (prior to, regarding, despite)": {
        "badge": "CHUYÊN ĐỀ 17 · TẬP HỢP GIỚI TỪ PHÂN LOẠI 750+",
        "title": "Giới từ nâng cao TOEIC (prior to, regarding, despite, except for...)",
        "overview": "Đây là các giới từ phức hoặc giới từ có nguồn gốc từ phân từ, xuất hiện rất nhiều trong các hợp đồng thương mại và văn bản chính sách ở band điểm 750+ TOEIC.",
        "sections": [
            {
                "heading": "1. Bảng giới từ nâng cao phân theo nhóm ý nghĩa",
                "type": "formula",
                "items": [
                    {
                        "title": "Nhóm giới từ thời gian & nhượng bộ",
                        "formula": "- Prior to = Before + N/V-ing (trước khi)\n- Following = After + N/V-ing (sau khi)\n- Despite = In spite of + N/V-ing (mặc dù, bất chấp)\n- As of / Effective + Ngày tháng (kể từ ngày... bắt đầu có hiệu lực)",
                        "note": "Ví dụ: Prior to joining the company, she worked as a software developer."
                    },
                    {
                        "title": "Nhóm giới từ liên quan & ngoại trừ",
                        "formula": "- Regarding = Concerning = With regard to = As to + N/V-ing (về việc, liên quan đến)\n- Except for = Aside from = Apart from + N/V-ing (ngoại trừ / bên cạnh đó)\n- In accordance with = Complying with + N (phù hợp với, tuân theo quy định)",
                        "note": "Ví dụ: Please contact HR regarding any benefits questions."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Đứng trước một Cụm danh từ hoặc V-ing: prior to the deadline, regarding the contract, despite heavy rain, following the announcement.",
                    "Cụm từ luật/chính sách: 'in accordance with federal safety regulations' (tuân thủ quy chuẩn an toàn liên bang), 'regardless of cost' (bất kể chi phí)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY PHÂN BIỆT 'DESPITE' VÀ 'ALTHOUGH': 'Despite / In spite of + Cụm danh từ / V-ing'; còn 'Although / Even though + Mệnh đề (S + V)'. Đề thi thường cho mệnh đề có đầy đủ S+V rồi gài đáp án 'Despite' để học sinh vội vàng chọn sai!",
                    "Bẫy 'As of': 'As of July 1st' (Kể từ ngày 1 tháng 7 trở đi) - sau 'as of' là một mốc thời gian bắt đầu chính sách."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy sau chỗ trống chỉ có CỤM DANH TỪ (không có động từ chia thì) -> LOẠI NGAY các liên từ (although, because, while...), CHỌN GIỚI TỪ (despite, because of, during, regarding).",
                    "Thấy cụm từ '______ the agreement' bàn về hợp đồng -> ưu tiên nghĩ ngay đến 'regarding / concerning' (về việc)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "_______ rigorous safety testing, the new medical device was granted immediate market approval.",
                "options": [
                    "A. Because",
                    "B. Following",
                    "C. Although",
                    "D. While"
                ],
                "ans": "B. Following",
                "explain": "Bước 1: Quan sát sau chỗ trống là một cụm danh từ 'rigorous safety testing' (không có động từ chia thì). Bước 2: Loại A (Because), C (Although), D (While) vì đây đều là các LIÊN TỪ bắt buộc phải đi với một mệnh đề (S + V). Bước 3: 'Following' là GIỚI TỪ mang nghĩa 'sau khi' -> Chọn B. Following."
            }
        ]
    },
    "Liên từ kết hợp & Tương quan (both...and, either...or)": {
        "badge": "CHUYÊN ĐỀ 18 · CẶP TỪ BẤT BIẾN",
        "title": "Liên từ kết hợp & Liên từ tương quan (Correlative Conjunctions)",
        "overview": "Liên từ kết hợp (FANBOYS) và Liên từ tương quan là dạng bài dễ nhất trong Part 5 vì luôn đi theo cặp cố định. Chỉ cần nhìn thấy nửa trước là có thể chọn ngay nửa sau trong vòng 2 giây.",
        "sections": [
            {
                "heading": "1. Bảng các cặp Liên từ tương quan bắt buộc thuộc lòng",
                "type": "formula",
                "items": [
                    {
                        "title": "Các cặp tương quan kinh điển",
                        "formula": "- Both A AND B (cả A và B - luôn chia động từ số nhiều)\n- Either A OR B (hoặc A hoặc B - chia theo B)\n- Neither A NOR B (không A cũng không B - chia theo B)\n- Not only A BUT ALSO B (không những A mà còn B - chia theo B)\n- Whether A OR B (liệu A hay B)",
                        "note": "Quy tắc song hành (Parallelism): A và B phải CÙNG TỪ LOẠI và CÙNG CẤU TRÚC NGỮ PHÁP (nếu A là Danh từ thì B phải là Danh từ; A là To-V thì B phải là To-V)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Thấy xuất hiện từ 'and' ở vế sau -> Tìm 'both' hoặc 'between' (between A and B).",
                    "Thấy xuất hiện từ 'or' ở vế sau -> Tìm 'either' hoặc 'whether'.",
                    "Thấy xuất hiện từ 'nor' ở vế sau -> 100% chọn 'neither'.",
                    "Thấy xuất hiện cụm 'but also' -> 100% chọn 'not only'."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY PHÁ VỠ CẤU TRÚC SONG HÀNH (Faulty Parallelism): 'The company aims not only [to increase profits] but also [cutting costs]' (SAI vì to-V không song hành với V-ing) -> Phải sửa thành 'but also [to cut costs]'.",
                    "Bẫy nhầm lẫn giữa 'neither... nor' và 'either... or'."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Quét mắt nhanh tìm cặp: Thấy 'nor' -> khoanh 'neither'. Thấy 'or' -> khoanh 'either'. Thấy 'and' -> khoanh 'both'.",
                    "Chỉ mất 2 giây cho dạng câu hỏi này, không cần dịch nghĩa!"
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The upcoming training seminar will focus _______ on improving client communication and on mastering project software.",
                "options": [
                    "A. both",
                    "B. neither",
                    "C. either",
                    "D. not"
                ],
                "ans": "A. both",
                "explain": "Bước 1: Quét mắt tìm liên từ liên kết trong câu, phát hiện từ 'and' kết nối hai cụm giới từ song hành ('on improving...' and 'on mastering...'). Bước 2: Cặp liên từ đi với 'and' là 'both... and'. Bước 3: Chọn ngay A. both."
            }
        ]
    },
    "Liên từ phụ thuộc (although, because, unless, once)": {
        "badge": "CHUYÊN ĐỀ 19 · NỀN TẢNG CÂU PHỨC",
        "title": "Liên từ phụ thuộc (Subordinating Conjunctions: although, because...)",
        "overview": "Liên từ phụ thuộc dùng để nối Mệnh đề phụ với Mệnh đề chính. Trọng tâm của đề thi là kiểm tra khả năng phân biệt giữa Liên từ (+ Mệnh đề S+V) và Giới từ (+ Cụm danh từ / V-ing).",
        "sections": [
            {
                "heading": "1. Bảng đối chiếu Liên từ (+ S+V) vs Giới từ (+ Noun/V-ing)",
                "type": "formula",
                "items": [
                    {
                        "title": "Nhóm Nguyên nhân & Kết quả",
                        "formula": "- Liên từ (+ Mệnh đề S+V): Because, Since, As, Now that\n- Giới từ (+ Cụm N / V-ing): Because of, Due to, Owing to, On account of",
                        "note": "Ví dụ: Because the weather was bad (Liên từ) vs Because of the bad weather (Giới từ)."
                    },
                    {
                        "title": "Nhóm Nhượng bộ & Đối lập",
                        "formula": "- Liên từ (+ Mệnh đề S+V): Although, Even though, Though, While, Whereas\n- Giới từ (+ Cụm N / V-ing): Despite, In spite of, Regardless of",
                        "note": "Ví dụ: Although it rained heavily vs Despite heavy rain."
                    },
                    {
                        "title": "Nhóm Điều kiện & Thời gian",
                        "formula": "- Liên từ (+ Mệnh đề S+V): If, Unless, Once (một khi), As soon as, Provided that, In case\n- Giới từ (+ Cụm N / V-ing): In case of, In the event of, Without",
                        "note": "Unless = If... not (Trừ khi). 'Once' làm liên từ có nghĩa là 'Một khi' (+ S+V)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Ngay sau chỗ trống có cấu trúc [Chủ ngữ + Động từ có chia thì] -> Bắt buộc dùng LIÊN TỪ.",
                    "Các liên từ mang nghĩa đặc thù trong TOEIC:\n- Once + S + V: Một khi việc gì xảy ra (Once you sign the contract...)\n- Now that + S + V: Giờ đây vì việc gì đã xảy ra (Now that the new software is installed...)\n- In order that / So that + S + can/could + V: Để mà (chỉ mục đích)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY PHÂN BIỆT 'WHILE' VÀ 'DURING': 'While + S + V' (hoặc While + V-ing rút gọn); còn 'During + Noun' (TUYỆT ĐỐI không dùng During + S + V).",
                    "Bẫy mệnh đề có vẻ giống cụm danh từ nhưng thực chất có động từ: Đề thi cho: '______ the supervisor recommended the changes' -> Nhiều bạn nhìn thấy 'the supervisor' tưởng là cụm danh từ nên chọn 'Because of' (SAI), thực chất có động từ 'recommended' phía sau -> Phải chọn 'Because'!"
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Quy tắc vàng: Kiểm tra sau chỗ trống có ĐỘNG TỪ CHIA THÌ hay không?\n- Có Động từ -> Chọn LIÊN TỪ (Because, Although, Once...).\n- Không có Động từ -> Chọn GIỚI TỪ (Due to, Despite, During...).",
                    "Loại trừ được ngay 2 đáp án trong 3 giây đầu tiên!"
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "_______ the production line was halted for three hours, the manufacturing team still met its daily quota.",
                "options": [
                    "A. Despite",
                    "B. Although",
                    "C. Because of",
                    "D. In spite of"
                ],
                "ans": "B. Although",
                "explain": "Bước 1: Nhìn ngay sau chỗ trống, ta thấy 'the production line' (S) + 'was halted' (V có chia thì) -> Đây là một MỆNH ĐỀ (Clause). Bước 2: Cần một LIÊN TỪ. Loại A (Despite), C (Because of), D (In spite of) vì cả 3 đều là Giới từ (chỉ đi với cụm danh từ). Bước 3: Chọn ngay B. Although."
            }
        ]
    },
    "Mệnh đề quan hệ (Who, Whom, Which, That, Whose)": {
        "badge": "CHUYÊN ĐỀ 20 · ĐẠI TỪ QUAN HỆ & QUY TẮC THAY THẾ",
        "title": "Mệnh đề quan hệ (Relative Clauses: Who, Whom, Which, That, Whose)",
        "overview": "Mệnh đề quan hệ dùng để bổ nghĩa cho danh từ đứng trước nó. Đề thi thường kiểm tra việc lựa chọn đúng đại từ quan hệ dựa trên danh từ chỉ người hay vật, và vai trò của đại từ đó làm Chủ ngữ hay Tân ngữ.",
        "sections": [
            {
                "heading": "1. Bảng quy chuẩn Đại từ quan hệ",
                "type": "formula",
                "items": [
                    {
                        "title": "Bảng phân loại Đại từ quan hệ",
                        "formula": "- WHO: Thay cho người, làm S (Noun người + WHO + V)\n- WHOM: Thay cho người, làm O (Noun người + WHOM + S + V)\n- WHICH: Thay cho vật/sự việc, làm S hoặc O (Noun vật + WHICH + V / S + V)\n- THAT: Thay cho cả người và vật trong mệnh đề xác định (không dùng sau dấu phẩy và giới từ)\n- WHOSE: Chỉ sở hữu (Noun người/vật + WHOSE + Noun + V)",
                        "note": "Quy tắc Whose: Sau 'Whose' luôn luôn là một DANH TỪ KHÔNG CÓ MẠO TỪ (whose car, whose proposal)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Danh từ người + [Chỗ trống] + Động từ -> 100% chọn 'WHO'.",
                    "Danh từ + [Chỗ trống] + Danh từ khác -> 95% chọn đại từ sở hữu 'WHOSE'.",
                    "Đứng sau Giới từ (in, at, with, on...): Chỉ được dùng 'WHOM' (cho người) hoặc 'WHICH' (cho vật). TUYỆT ĐỐI không dùng 'THAT' hoặc 'WHO' sau giới từ!"
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY 'THAT' KHÔNG DÙNG TRONG 2 TRƯỜNG HỢP: 1. Không dùng 'that' sau dấu phẩy (Mệnh đề quan hệ không xác định); 2. Không dùng 'that' đứng ngay sau giới từ (ví dụ: 'the firm in that we invested' là SAI -> phải là 'in which').",
                    "Bẫy đại từ quan hệ chỉ nơi chốn: WHERE = in/at which (sau where là mệnh đề hoàn chỉnh S+V). Nếu sau chỗ trống là một ĐỘNG TỪ làm vị ngữ -> Bắt buộc dùng WHICH, không được dùng Where!"
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy trước chỗ trống có DẤU PHẨY (,) -> GẠCH BỎ NGAY đáp án 'THAT'!",
                    "Thấy trước chỗ trống có GIỚI TỪ (to/in/with/about) -> Chỉ còn 2 ứng viên: 'WHOM' (người) hoặc 'WHICH' (vật)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The keynote speaker _______ presentation addressed artificial intelligence will host a question-and-answer session.",
                "options": [
                    "A. who",
                    "B. whose",
                    "C. which",
                    "D. whom"
                ],
                "ans": "B. whose",
                "explain": "Bước 1: Quan sát từ đứng trước chỗ trống là danh từ chỉ người 'The keynote speaker'. Bước 2: Quan sát từ đứng ngay sau chỗ trống là danh từ 'presentation' (bài thuyết trình). Bước 3: Mối quan hệ sở hữu: bài thuyết trình của diễn giả chính -> Chọn B. whose."
            }
        ]
    },
    "Rút gọn mệnh đề quan hệ (V-ing / V3-ed / To-V)": {
        "badge": "CHUYÊN ĐỀ 21 · KỸ THUẬT PHÂN BIỆT ĐỘNG TỪ CHÍNH & PHỤ",
        "title": "Rút gọn mệnh đề quan hệ (Reduced Relative Clauses)",
        "overview": "Đây là chuyên đề 'sát thủ' lấy điểm 800+ trong TOEIC Part 5 & 6. Câu có vẻ như thiếu động từ, nhưng thực chất đã bị rút gọn thành phân từ V-ing (chủ động) hoặc V3/ed (bị động).",
        "sections": [
            {
                "heading": "1. 3 Công thức rút gọn mệnh đề quan hệ cốt lõi",
                "type": "formula",
                "items": [
                    {
                        "title": "1. Rút gọn Chủ động -> Dùng V-ING",
                        "formula": "Noun + [Who/Which + V_active] -> Noun + V-ING + (Tân ngữ)",
                        "note": "Ví dụ: Passengers who travel to London -> Passengers traveling to London."
                    },
                    {
                        "title": "2. Rút gọn Bị động -> Dùng V3/ED",
                        "formula": "Noun + [Who/Which + be + V3/ed] -> Noun + V3/ED + (Giới từ)",
                        "note": "Ví dụ: Products which are manufactured locally -> Products manufactured locally."
                    },
                    {
                        "title": "3. Rút gọn với To-V (Khi có the first, the only, so sánh nhất)",
                        "formula": "The first / last / only / next + Noun + TO-V",
                        "note": "Ví dụ: He was the first person to arrive."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Câu ĐÃ CÓ ĐỘNG TỪ CHÍNH chia thì ở phía sau -> Chỗ trống chỉ có thể là dạng rút gọn (V-ing hoặc V3/ed), TUYỆT ĐỐI không chọn thêm một động từ chia thì nữa!",
                    "Sau chỗ trống có Tân ngữ danh từ -> 90% chọn V-ing.",
                    "Sau chỗ trống có Giới từ (by, in, at...) hoặc Trạng từ -> 90% chọn V3/ed."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY 2 ĐỘNG TỪ CHIA THÌ TRONG CÙNG MỘT CÂU ĐƠN: 'Anyone wanting (V-ing) to register should contact (V chính) HR.' Học sinh hay nhầm tưởng 'wanting' là động từ chính nên chọn 'wants' -> Dẫn đến câu có 2 động từ chính không có liên từ nối!",
                    "Bẫy phân biệt V-ing tính từ và V-ing rút gọn."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Tìm Động từ chính của câu trước: Nếu câu đã có 'is/are/will/submitted' làm vị ngữ chính rồi -> Loại ngay các đáp án chia thì (Vs/ed/will/is).",
                    "Chỉ còn V-ing và V3/ed: Nhìn sau khoảng trống có tân ngữ -> chọn V-ing; có giới từ -> chọn V3/ed."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "Any packages _______ at the front desk after business hours will be secured by building security staff.",
                "options": [
                    "A. drop off",
                    "B. dropped off",
                    "C. dropping off",
                    "D. were dropped off"
                ],
                "ans": "B. dropped off",
                "explain": "Bước 1: Quét câu tìm động từ chính: 'will be secured' là vị ngữ chính của câu. Bước 2: Khoảng trống thuộc mệnh đề quan hệ rút gọn bổ nghĩa cho 'Any packages'. Bưu kiện được người khác gửi/để lại (mang nghĩa bị động). Bước 3: Rút gọn bị động dùng V3/ed -> Chọn B. dropped off."
            }
        ]
    },
    "Mệnh đề danh ngữ (Noun Clauses: What, Whether)": {
        "badge": "CHUYÊN ĐỀ 22 · ĐỈNH CAO NGỮ PHÁP HỌC THUẬT VSTEP",
        "title": "Mệnh đề danh ngữ (Noun Clauses: That, Whether, What, Wh-words)",
        "overview": "Mệnh đề danh ngữ đóng vai trò như một danh từ lớn trong câu: có thể làm Chủ ngữ (Subject), Tân ngữ của động từ (Object), hoặc Bổ ngữ (Complement). Cực kỳ phổ biến trong các bài đọc VSTEP B2-C1 và Part 6 & 7 TOEIC.",
        "sections": [
            {
                "heading": "1. Công thức Mệnh đề danh ngữ theo các từ dẫn",
                "type": "formula",
                "items": [
                    {
                        "title": "1. Mệnh đề bắt đầu bằng THAT",
                        "formula": "THAT + S + V + O + [Động từ chính số ít]",
                        "note": "Diễn tả 'sự thật rằng/việc...'. Ví dụ: That he passed the exam surprised everyone."
                    },
                    {
                        "title": "2. Mệnh đề bắt đầu bằng WHETHER / IF",
                        "formula": "S + V + WHETHER / IF + S + V (+ or not)",
                        "note": "Diễn tả 'liệu rằng... có hay không'. Chỉ 'Whether' mới có thể đứng đầu câu làm Chủ ngữ hoặc đứng ngay trước 'or not'."
                    },
                    {
                        "title": "3. Mệnh đề bắt đầu bằng WH-words (What, Who, How, Why)",
                        "formula": "WHAT + S + V (Cái mà...) | HOW + S + V (Cách thức mà...)",
                        "note": "Ví dụ: What the committee decided remains confidential."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Đứng sau các động từ truyền đạt, nhận thức: know, realize, understand, explain, suggest, announce, determine, wonder + (that / whether / how...).",
                    "Cụm từ công sở TOEIC: 'determine whether' (xác định liệu rằng), 'decide whether to V', 'explain how to operate'."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY PHÂN BIỆT 'THAT' VÀ 'WHAT': 'That' theo sau bởi mệnh đề ĐẦY ĐỦ CẢ S VÀ O (That the plan succeeded is undeniable). Còn 'What' theo sau bởi mệnh đề KHUYẾT S hoặc KHUYẾT O (What she said was true - khuyết tân ngữ của said).",
                    "Động từ chính sau Mệnh đề danh ngữ làm chủ ngữ LUÔN LUÔN CHIA Ở NGÔI SỐ ÍT (is, was, has)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy động từ 'determine / decide / ask' + chỗ trống + 'or not' -> 100% chọn 'WHETHER'.",
                    "Thấy chỗ trống đứng đầu câu trước một mệnh đề và vị ngữ chính chia số ít: Kiểm tra nếu mệnh đề đã đủ S và O -> Chọn 'THAT'; nếu khuyết tân ngữ -> Chọn 'WHAT'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The senior board members must decide _______ the proposed budget allocation is viable before the end of this week.",
                "options": [
                    "A. that",
                    "B. whether",
                    "C. what",
                    "D. which"
                ],
                "ans": "B. whether",
                "explain": "Bước 1: Sau động từ 'decide' cần một mệnh đề danh ngữ làm tân ngữ. Bước 2: Ngữ cảnh câu mang tính cân nhắc, lựa chọn (quyết định xem liệu phương án ngân sách đề xuất có khả thi hay không). Bước 3: Dùng 'whether' biểu thị sự cân nhắc giữa các khả năng -> Chọn B. whether."
            }
        ]
    },
    "Mệnh đề trạng ngữ (Adverbial Clauses)": {
        "badge": "CHUYÊN ĐỀ 23 · MẠNH MẼ VỀ LIÊN KẾT LOGIC",
        "title": "Mệnh đề trạng ngữ (Adverbial Clauses: Nhượng bộ, Nguyên nhân, Thời gian)",
        "overview": "Mệnh đề trạng ngữ bổ sung thông tin về thời gian, địa điểm, nguyên nhân, mục đích, kết quả hoặc sự nhượng bộ cho mệnh đề chính. Nắm vững sự rút gọn mệnh đề trạng ngữ (Rút gọn đồng chủ ngữ) là vũ khí ghi điểm tuyệt đối.",
        "sections": [
            {
                "heading": "1. Bảng phân loại các loại Mệnh đề trạng ngữ",
                "type": "formula",
                "items": [
                    {
                        "title": "1. Mệnh đề chỉ thời gian & nguyên nhân",
                        "formula": "Thời gian: When, While, As soon as, Before, After, Until, Since + S + V\nNguyên nhân: Because, Since, As, Now that, Inasmuch as + S + V",
                        "note": "Ví dụ: As soon as we receive payment, the goods will be shipped."
                    },
                    {
                        "title": "2. Mệnh đề chỉ nhượng bộ & mục đích",
                        "formula": "Nhượng bộ: Although, Even though, Though, Whereas + S + V\nMục đích: So that / In order that + S + can/could/will/would + V",
                        "note": "Ví dụ: We lowered the price so that more clients could afford our services."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết & Cấu trúc Rút gọn đồng chủ ngữ",
                "type": "signals",
                "items": [
                    "Quy tắc Rút gọn đồng chủ ngữ (Participle Clause):\n- Nếu 2 mệnh đề CÙNG CHỦ NGỮ, ta có thể bỏ chủ ngữ ở mệnh đề phụ:\n+ Dạng chủ động: (While/When) + V-ING, S + V + O\n+ Dạng bị động: (Although/Once) + V3/ED, S + V + O\nVí dụ: When filling out the application, you must provide references. / Once approved, the budget will be released.",
                    "Từ nối chỉ kết quả: So + Adj/Adv + that... (đến mức mà); Such + (a/an) + Adj + N + that..."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY RÚT GỌN CHỦ NGỮ KHÔNG ĐỒNG NHẤT (Dangling Modifier): Rút gọn chỉ được phép thực hiện khi CHỦ NGỮ CỦA HAI MỆNH ĐỀ LÀ MỘT!",
                    "Bẫy nhầm lẫn giữa 'So that' (để mà - chỉ mục đích) và 'So' (vì vậy - chỉ kết quả)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy công thức: 'When / While / Once / Before / After + ______ + Tân ngữ, S + V' -> 90% chọn 'V-ing'.",
                    "Thấy công thức: 'Once / If / Unless + ______ + Giới từ, S + V' -> 90% chọn 'V3/ed'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "When _______ any mechanical errors, laboratory technicians should notify the head engineer immediately.",
                "options": [
                    "A. encounter",
                    "B. encountered",
                    "C. encountering",
                    "D. encounters"
                ],
                "ans": "C. encountering",
                "explain": "Bước 1: Nhận diện cấu trúc rút gọn đồng chủ ngữ sau liên từ thời gian 'When'. Bước 2: Quan sát sau chỗ trống có tân ngữ 'any mechanical errors' (các lỗi cơ khí) -> hành động mang tính chủ động (các kỹ thuật viên gặp phải lỗi). Bước 3: Rút gọn chủ động dùng V-ing -> Chọn C. encountering."
            }
        ]
    },
    "So sánh bằng, So sánh hơn & So sánh nhất": {
        "badge": "CHUYÊN ĐỀ 24 · DẠNG BÀI SO SÁNH THƯỜNG GẶP",
        "title": "So sánh bằng, So sánh hơn & So sánh nhất (Comparisons)",
        "overview": "So sánh tính từ và trạng từ là dạng bài quen thuộc trong TOEIC Part 5 & 6. Kiểm tra việc thêm '-er/more' cho so sánh hơn, '-est/most' cho so sánh nhất, và các trạng từ nhấn mạnh mức độ so sánh.",
        "sections": [
            {
                "heading": "1. Bảng công thức So sánh toàn diện",
                "type": "formula",
                "items": [
                    {
                        "title": "1. So sánh bằng (As... as)",
                        "formula": "S + V + AS + [Adj / Adv] + AS + Noun/Pronoun",
                        "note": "Dùng tính từ nếu động từ trước là 'be/linking verb'. Dùng trạng từ nếu động từ trước là động từ thường. Phủ định có thể dùng 'not as... as' hoặc 'not so... as'."
                    },
                    {
                        "title": "2. So sánh hơn (Comparative)",
                        "formula": "- Tính từ/Trạng từ ngắn (1 âm tiết): Adj/Adv + ER + THAN\n- Tính từ/Trạng từ dài (2 âm tiết trở lên): MORE + Adj/Adv + THAN",
                        "note": "Bất quy tắc: good/well -> better; bad/badly -> worse; far -> farther/further; little -> less; much/many -> more."
                    },
                    {
                        "title": "3. So sánh nhất (Superlative)",
                        "formula": "- Tính từ ngắn: THE + Adj + EST + (in/of)\n- Tính từ dài: THE MOST + Adj + (in/of)",
                        "note": "Bất quy tắc: the best, the worst, the farthest/furthest, the least, the most."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết & Trạng từ nhấn mạnh so sánh hơn",
                "type": "signals",
                "items": [
                    "CÁC TỪ NHẤN MẠNH SO SÁNH HƠN BẮT BUỘC THUỘC (Mang nghĩa: nhiều hơn nhiều): much, far, even, significantly, substantially, considerably + [SO SÁNH HƠN].",
                    "Ví dụ: much better, far more effective, significantly higher.",
                    "TUYỆT ĐỐI KHÔNG DÙNG 'very', 'quite' để nhấn mạnh so sánh hơn!"
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY DÙNG 'VERY' TRƯỚC SO SÁNH HƠN: 'very more expensive' (SAI HOÀN TOÀN) -> Phải dùng 'much more expensive' hoặc 'far more expensive'!",
                    "Bẫy đúp so sánh (Double Comparative): 'more better' (SAI) -> Chỉ dùng 'better'."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy 'THAN' xuất hiện ở vế sau -> 100% loại các đáp án so sánh nhất (-est, most) và nguyên thể; CHỌN ngay đáp án có '-er' hoặc 'more'.",
                    "Thấy 'THE' đứng trước chỗ trống và có cụm 'of all' hoặc 'in the department' -> 90% chọn SO SÁNH NHẤT (-est / most)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The automated assembly system is _______ more efficient than the manual production process previously utilized.",
                "options": [
                    "A. very",
                    "B. substantially",
                    "C. thoroughly",
                    "D. nearly as"
                ],
                "ans": "B. substantially",
                "explain": "Bước 1: Quan sát thấy cấu trúc so sánh hơn 'more efficient than'. Bước 2: Chỗ trống cần một phó từ đứng trước để nhấn mạnh mức độ so sánh hơn. Bước 3: 'Very' không bao giờ đi với so sánh hơn; 'substantially' (đáng kể) là phó từ chuyên dụng để bổ nghĩa cho so sánh hơn -> Chọn B. substantially."
            }
        ]
    },
    "So sánh kép (The more... the more) & Bội số": {
        "badge": "CHUYÊN ĐỀ 25 · ĐẶC BIỆT & BỘI SỐ SO SÁNH",
        "title": "So sánh kép (The more... the more) & So sánh Bội số",
        "overview": "Cấu trúc 'Càng... thì càng...' và so sánh gấp bao nhiêu lần (twice, three times) là cấu trúc nâng cao thể hiện mối quan hệ tỷ lệ thuận hoặc nghịch giữa hai biến số trong kinh tế.",
        "sections": [
            {
                "heading": "1. Bảng công thức So sánh kép & Bội số",
                "type": "formula",
                "items": [
                    {
                        "title": "1. So sánh kép (The + Comparative, the + Comparative)",
                        "formula": "THE + [So sánh hơn S1 + V1], THE + [So sánh hơn S2 + V2]",
                        "note": "Ví dụ: The more you practice, the more confident you will become. / The higher the demand, the higher the prices."
                    },
                    {
                        "title": "2. So sánh bội số (Gấp số lần: twice, three times...)",
                        "formula": "S + V + [Số lần: twice / three times / four times] + AS + [Adj / Adv / Much / Many] + AS + Noun",
                        "note": "Ví dụ: This model costs twice as much as the older version. (Chú ý: Dùng TWICE, không dùng two times!)."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Vế trước bắt đầu bằng 'The + Comparative' -> Vế sau dấu phẩy bắt buộc cũng phải bắt đầu bằng 'The + Comparative'.",
                    "Sau số lần (twice, three times, four times) luôn là cấu trúc 'AS... AS'."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY THIẾU 'THE' TRONG SO SÁNH KÉP: Bắt buộc cả hai vế đều phải có 'THE' phía trước từ so sánh (The more... the more...). Đề thi hay gài bỏ quên mạo từ 'The' ở một vế!",
                    "Bẫy dùng so sánh hơn sau 'twice': 'twice more expensive than' (thông tục nhưng ETS chuộng chuẩn: 'twice as expensive as')."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy vế đầu có 'The sooner' -> Quét vế sau tìm ngay 'the better' hoặc 'the + comparative'.",
                    "Thấy có 'twice / three times' -> Tìm ngay phương án có cấu trúc 'as + adj + as'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "_______ detailed the project proposal is, the easier it will be to secure capital from venture investors.",
                "options": [
                    "A. More",
                    "B. The more",
                    "C. As more",
                    "D. Most"
                ],
                "ans": "B. The more",
                "explain": "Bước 1: Quan sát vế thứ hai có cấu trúc 'the easier it will be' (The + So sánh hơn). Bước 2: Đây là cấu trúc so sánh kép chuẩn 'The + Comparative..., the + Comparative...'. Bước 3: Vế đầu bắt buộc phải có mạo từ 'The' kết hợp so sánh hơn -> Chọn B. The more."
            }
        ]
    },
    "Câu điều kiện loại 1, 2, 3 & Hỗn hợp": {
        "badge": "CHUYÊN ĐỀ 26 · TỔNG HỢP 3 LOẠI ĐIỀU KIỆN",
        "title": "Câu điều kiện (Conditionals: Loại 1, Loại 2, Loại 3 & Hỗn hợp)",
        "overview": "Câu điều kiện diễn tả giả định có thể xảy ra ở hiện tại/tương lai (Loại 1), trái với thực tế ở hiện tại (Loại 2), hoặc trái với thực tế trong quá khứ (Loại 3).",
        "sections": [
            {
                "heading": "1. Bảng công thức 3 loại câu điều kiện chuẩn",
                "type": "formula",
                "items": [
                    {
                        "title": "Loại 1: Có thật ở hiện tại / tương lai",
                        "formula": "If + S + V(hiện tại đơn), S + will / can / should / must + V_inf",
                        "note": "Ví dụ: If the client approves the draft, we will print the brochures."
                    },
                    {
                        "title": "Loại 2: Giả định trái với hiện tại",
                        "formula": "If + S + V2/ed (to be dùng WERE cho mọi ngôi), S + would / could + V_inf",
                        "note": "Ví dụ: If I were the CEO, I would invest in renewable energy."
                    },
                    {
                        "title": "Loại 3: Giả định trái với quá khứ (đã không xảy ra)",
                        "formula": "If + S + had + V3/ed, S + would / could + have + V3/ed",
                        "note": "Ví dụ: If we had ordered the parts earlier, the delay would have been avoided."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết & Các liên từ thay thế IF",
                "type": "signals",
                "items": [
                    "Các liên từ mang nghĩa điều kiện thay cho IF:\n- Provided that / Providing that (miễn là)\n- As long as (chừng nào mà)\n- In case (phòng khi)\n- Unless = If not (trừ khi).",
                    "Nhìn mệnh đề đã cho để suy ra mệnh đề còn lại theo đúng cặp thì."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY 'WILL' TRONG MỆNH ĐỀ IF: Tuyệt đối không dùng thì tương lai (will) trong mệnh đề chứa IF: SAI: 'If it will rain' -> ĐÚNG: 'If it rains'.",
                    "Bẫy điều kiện hỗn hợp (Mixed Conditionals): Giả định quá khứ nhưng kết quả ở hiện tại: 'If + had + V3/ed, S + would + V_inf (now/today)'."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy vế chính có 'would have + V3/ed' -> 95% vế IF chọn 'had + V3/ed' (Loại 3).",
                    "Thấy vế chính có 'will + V_inf' -> Vế IF chọn Hiện tại đơn (Loại 1)."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "If the logistics department _______ the shipment route earlier, the cargo would not have been delayed at customs.",
                "options": [
                    "A. reroutes",
                    "B. had rerouted",
                    "C. will reroute",
                    "D. would reroute"
                ],
                "ans": "B. had rerouted",
                "explain": "Bước 1: Quan sát mệnh đề chính có cấu trúc 'would not have been delayed' (would have + V3/ed). Bước 2: Đây là câu điều kiện Loại 3 chỉ sự việc trái với quá khứ. Bước 3: Mệnh đề IF của loại 3 bắt buộc chia ở thì Quá khứ hoàn thành (had + V3/ed) -> Chọn B. had rerouted."
            }
        ]
    },
    "Đảo ngữ câu điều kiện (Should / Were / Had)": {
        "badge": "CHUYÊN ĐỀ 27 · BÍ KÍP ĐẠT ĐIỂM TỐI ĐA 900+",
        "title": "Đảo ngữ câu điều kiện (Inversion in Conditionals: Should, Were, Had)",
        "overview": "Xuất hiện thường xuyên trong các bức thư trang trọng, hợp đồng thương mại của TOEIC. Khi đảo ngữ, từ 'IF' bị lược bỏ hoàn toàn và trợ động từ (Should, Were, Had) được đưa lên đầu câu.",
        "sections": [
            {
                "heading": "1. 3 Công thức đảo ngữ câu điều kiện thần thánh",
                "type": "formula",
                "items": [
                    {
                        "title": "1. Đảo ngữ Loại 1: Dùng SHOULD",
                        "formula": "SHOULD + S + V_bare, S + will / can / please + V_inf",
                        "note": "Ví dụ: If you have questions -> Should you have any questions, please contact me."
                    },
                    {
                        "title": "2. Đảo ngữ Loại 2: Dùng WERE",
                        "formula": "WERE + S + to V (hoặc Were + S + Adj/Noun), S + would + V_inf",
                        "note": "Ví dụ: If the company relocated -> Were the company to relocate, costs would rise."
                    },
                    {
                        "title": "3. Đảo ngữ Loại 3: Dùng HAD",
                        "formula": "HAD + S + V3/ed, S + would / could + have + V3/ed",
                        "note": "Ví dụ: If we had known -> Had we known about the policy change, we would have acted."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Đầu câu có chỗ trống đứng trước Chủ ngữ, nhưng CUỐI CÂU KHÔNG CÓ DẤU CHẤM HỎI (?) (đây không phải câu hỏi mà là câu trần thuật đảo ngữ!).",
                    "Cụm từ cửa miệng kinh điển trong thư thương mại: 'Should you require any further assistance...' (Nếu quý khách cần thêm bất kỳ sự trợ giúp nào)."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY ĐỘNG TỪ NGUYÊN MẪU SAU 'SHOULD': Trong đảo ngữ loại 1, sau Chủ ngữ dù là số ít (he, she, it, the company) thì động từ vẫn PHẢI Ở DẠNG NGUYÊN MẪU BARE-V: 'Should Mr. Brown [arrive] early...' (KHÔNG thêm -s vào arrive!).",
                    "Bẫy phủ định: 'Had we not received' (ĐÚNG), không viết 'Had not we received'!"
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy khoảng trống đứng đầu câu, sau đó là Chủ ngữ + V_bare, cuối câu có dấu chấm -> 100% chọn 'SHOULD'.",
                    "Thấy đầu câu có khoảng trống, sau đó là Chủ ngữ + V3/ed, vế sau có 'would have + V3/ed' -> 100% chọn 'HAD'."
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "_______ you experience any technical difficulties with the portal, please call customer support immediately.",
                "options": [
                    "A. If",
                    "B. Should",
                    "C. Unless",
                    "D. Had"
                ],
                "ans": "B. Should",
                "explain": "Bước 1: Quan sát câu không có từ nối, cuối câu là câu mệnh lệnh kết thúc bằng dấu chấm. Bước 2: Động từ 'experience' ở dạng nguyên mẫu. Bước 3: Đây là cấu trúc đảo ngữ điều kiện loại 1: 'Should + S + V_bare, please + V' (thay cho 'If you experience') -> Chọn B. Should."
            }
        ]
    },
    "Thức giả định (Subjunctive: suggest,vital, mandatory)": {
        "badge": "CHUYÊN ĐỀ 28 · ĐỘNG TỪ BARE-V BẤT DIỆT",
        "title": "Thức giả định (Subjunctive Mood: suggest, vital, mandatory)",
        "overview": "Thức giả định dùng sau các động từ hoặc tính từ biểu thị sự yêu cầu, khuyên bảo, cấp bách hoặc thiết yếu. Động từ trong mệnh đề 'THAT' bắt buộc PHẢI Ở DẠNG NGUYÊN THỂ KHÔNG TO (Bare V) cho mọi ngôi (vì đã ẩn từ 'should').",
        "sections": [
            {
                "heading": "1. Bảng công thức Thức giả định chuẩn ETS",
                "type": "formula",
                "items": [
                    {
                        "title": "1. Đi sau Động từ yêu cầu / đề xuất",
                        "formula": "S1 + [suggest / recommend / request / require / insist / demand / propose / ask] + THAT + S2 + (SHOULD) + V_BARE",
                        "note": "Ví dụ: The manager suggested that Ms. Lee BE promoted (không dùng was/is). / We insist that he SUBMIT the form (không thêm -s)."
                    },
                    {
                        "title": "2. Đi sau Tính từ mang tính thiết yếu / quan trọng",
                        "formula": "It is + [vital / essential / mandatory / imperative / necessary / crucial / important] + THAT + S + (SHOULD) + V_BARE",
                        "note": "Ví dụ: It is vital that safety protocols BE followed strictly at all times."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Các động từ chỉ điểm: ask, demand, insist, propose, recommend, request, require, suggest, urge.",
                    "Các tính từ chỉ điểm: crucial, essential, imperative, important, mandatory, necessary, vital, urgent.",
                    "Công thức nhận diện tức thì: 'It is [Tính từ thiết yếu] that S + [______]'."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY CHIA ĐỘNG TỪ THEO CHỦ NGỮ SỐ ÍT: Chủ ngữ S2 dù là 'he, she, it, every employee' thì động từ VẪN Ở DẠNG NGUYÊN MẪU KHÔNG THÊM -S (bởi vì trước nó đã ẩn từ 'should'): 'The director recommended that the staff [arrive] on time' (KHÔNG dùng arrives!).",
                    "Bẫy thể bị động trong thức giả định: Luôn luôn là dạng 'BE + V3/ed' (ví dụ: that the issue BE resolved, KHÔNG dùng is resolved)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy trước THAT có 'recommend, suggest, require, essential, vital, mandatory' -> Nhìn sang sau THAT: 100% CHỌN ĐỘNG TỪ NGUYÊN THỂ (V_bare) hoặc 'be + V3/ed'.",
                    "Loại ngay lập tức các đáp án chia ngôi: is, are, was, were, has, V-s/es!"
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "It is imperative that every flight attendant _______ the pre-boarding safety protocols thoroughly.",
                "options": [
                    "A. understands",
                    "B. understand",
                    "C. understood",
                    "D. understanding"
                ],
                "ans": "B. understand",
                "explain": "Bước 1: Nhận diện cấu trúc thức giả định với tính từ cấp bách: 'It is imperative that...'. Bước 2: Mặc dù chủ ngữ 'every flight attendant' là ngôi số ít, theo quy tắc thức giả định (Subjunctive), động từ bắt buộc phải ở dạng nguyên thể không chia (Bare V, do đã lược bỏ should). Bước 3: Chọn B. understand."
            }
        ]
    },
    "Cấu trúc Cầu khiến (Have/Get something done)": {
        "badge": "CHUYÊN ĐỀ 29 · BẬC THẦY SAI KHIẾN & THUÊ DỊCH VỤ",
        "title": "Cấu trúc Cầu khiến (Causative Form: Have, Get, Make, Let)",
        "overview": "Dùng để diễn tả việc chủ ngữ nhờ vả, thuê mướn hoặc sai khiến người khác làm một việc gì đó (hoặc việc gì được làm bởi người khác). Xuất hiện liên tục trong bối cảnh bảo trì, sửa chữa thiết bị, kiểm toán văn phòng.",
        "sections": [
            {
                "heading": "1. Bảng công thức Cầu khiến Chủ động & Bị động",
                "type": "formula",
                "items": [
                    {
                        "title": "1. Với Động từ HAVE",
                        "formula": "- Chủ động: S + HAVE + Người + V_BARE (nhờ ai làm gì)\n- Bị động: S + HAVE + Vật + V3/ED (thuê/nhờ cái gì được làm)",
                        "note": "Ví dụ: I had the technician repair my computer. / I had my computer repaired."
                    },
                    {
                        "title": "2. Với Động từ GET",
                        "formula": "- Chủ động: S + GET + Người + TO-V (thuyết phục/nhờ ai làm gì)\n- Bị động: S + GET + Vật + V3/ED (nhờ/thuê cái gì được làm)",
                        "note": "Ví dụ: She got the contractor to renovate the lobby. / She got the lobby renovated."
                    },
                    {
                        "title": "3. Với MAKE và LET",
                        "formula": "S + MAKE / LET + Người + V_BARE (bắt buộc / cho phép ai làm gì)",
                        "note": "Ví dụ: The supervisor let employees leave early before the storm."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Ngữ cảnh bảo dưỡng, sửa chữa thiết bị văn phòng, in ấn tài liệu, vệ sinh công nghiệp: 'have the photocopier inspected', 'get the documents translated', 'have the air conditioning serviced'.",
                    "Thấy tân ngữ nằm giữa Have/Get và khoảng trống là một DANH TỪ CHỈ VẬT -> 95% chọn V3/ed."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY PHÂN BIỆT 'HAVE + NGƯỜI' VÀ 'GET + NGƯỜI': 'Have someone + V_BARE' (không có to); nhưng 'Get someone + TO-V' (bắt buộc có to).",
                    "Bẫy thể bị động: Cả Have và Get khi đi với VẬT đều đi với V3/ed ('have/get something done')."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy cấu trúc: 'have/has/had + [VẬT] + ______' -> Chọn ngay V3/ed!",
                    "Thấy cấu trúc: 'get/gets/got + [NGƯỜI] + ______' -> Chọn ngay 'TO-V'!"
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "The facility manager needs to have the central air conditioning units _______ before the summer heatwave begins.",
                "options": [
                    "A. inspect",
                    "B. inspected",
                    "C. inspecting",
                    "D. to inspect"
                ],
                "ans": "B. inspected",
                "explain": "Bước 1: Nhận diện cấu trúc cầu khiến: 'have + [the central air conditioning units - Vật] + [______]'. Bước 2: Vật tiếp nhận hành động kiểm tra -> cấu trúc cầu khiến bị động: 'have + something + V3/ed'. Bước 3: Chọn B. inspected."
            }
        ]
    },
    "Đảo ngữ (Inversion) & Cấu trúc Song hành (Parallelism)": {
        "badge": "CHUYÊN ĐỀ 30 · PHONG CÁCH HỌC THUẬT & TRANG TRỌNG",
        "title": "Đảo ngữ (Inversion) & Cấu trúc Song hành (Parallelism)",
        "overview": "Hai cấu trúc câu nâng cao thường dùng để tạo điểm nhấn tu từ mạnh mẽ trong các bài phát biểu, thư tín cao cấp hoặc bài thi viết VSTEP B2-C1.",
        "sections": [
            {
                "heading": "1. Bảng công thức Đảo ngữ với Trạng từ phủ định",
                "type": "formula",
                "items": [
                    {
                        "title": "1. Đảo ngữ với Phó từ phủ định / Bán phủ định",
                        "formula": "[Never / Rarely / Seldom / Scarcely / Hardly / Barely / Little / Under no circumstances / In no way] + [TRỢ ĐỘNG TỪ (do/does/did/have/has/will/can)] + S + V_bare",
                        "note": "Ví dụ: Seldom have we witnessed such remarkable growth. / Under no circumstances should employees disclose confidential passwords."
                    },
                    {
                        "title": "2. Đảo ngữ với 'Not only... but also'",
                        "formula": "NOT ONLY + [Trợ động từ] + S + V, BUT [S] ALSO + V",
                        "note": "Ví dụ: Not only did the campaign exceed sales targets, but it also elevated brand awareness."
                    },
                    {
                        "title": "3. Cấu trúc Song hành (Parallel Structure)",
                        "formula": "X, Y, and Z phải cùng một dạng ngữ pháp (Noun, Noun, and Noun | Adj, Adj, and Adj | V-ing, V-ing, and V-ing)",
                        "note": "Ví dụ: The internship offers training in programming, marketing, and accounting."
                    }
                ]
            },
            {
                "heading": "2. Dấu hiệu nhận biết chắc chắn 100% (Signal Words & Collocations)",
                "type": "signals",
                "items": [
                    "Các phó từ phủ định đứng ở đầu câu: Never, Rarely, Seldom, Hardly ever, Little, Only after, Only when, Under no circumstances, On no account.",
                    "Cuối câu là dấu chấm nhưng ngay sau phó từ phủ định là một Trợ động từ (did, do, have, should...) đi trước Chủ ngữ.",
                    "Liên từ kết hợp 'and, or, but' kết nối các thành phần song hành."
                ]
            },
            {
                "heading": "3. Các bẫy đề thi ETS & VSTEP kinh điển (Traps)",
                "type": "traps",
                "items": [
                    "BẪY QUÊN ĐẢO TRỢ ĐỘNG TỪ: Sau phó từ phủ định đứng đầu câu, BẮT BUỘC phải mượn Trợ động từ đứng trước Chủ ngữ (SAI: 'Rarely we have seen' -> ĐÚNG: 'Rarely HAVE we seen').",
                    "Bẫy song hành mất cân xứng: 'The candidate is skilled, motivated, and has dependability' (SAI vì Adj, Adj, và Verb phrase) -> Sửa thành: 'skilled, motivated, and dependable' (Adj, Adj, and Adj)."
                ]
            },
            {
                "heading": "4. Mẹo giải nhanh trong 5 giây (5-Second Speed Solving)",
                "type": "shortcut",
                "items": [
                    "Thấy đầu câu là: 'Rarely / Seldom / Never / Under no circumstances' + chỗ trống + Chủ ngữ -> Chọn ngay một TRỢ ĐỘNG TỪ (has, have, did, should...).",
                    "Thấy dãy liệt kê nối bằng 'and / or': Nhìn các từ phía trước đang ở dạng nào (V-ing, To-V hay Noun) -> Chọn từ sau đúng nguyên dạng đó!"
                ]
            },
            {
                "heading": "5. Câu hỏi thực chiến phân tích 3 bước (Realistic Exam Walkthrough)",
                "type": "example",
                "q": "Seldom _______ the research and development division received such extensive corporate funding for a single venture.",
                "options": [
                    "A. has",
                    "B. is",
                    "C. will",
                    "D. does"
                ],
                "ans": "A. has",
                "explain": "Bước 1: Nhận diện phó từ bán phủ định 'Seldom' (hiếm khi) đứng ở đầu câu -> áp dụng cấu trúc Đảo ngữ. Bước 2: Quan sát phía sau chủ ngữ 'the research and development division' có động từ phân từ hai 'received'. Bước 3: Cần trợ động từ của thì Hiện tại hoàn thành để đi với 'received' -> Chọn A. has."
            }
        ]
    }
};
