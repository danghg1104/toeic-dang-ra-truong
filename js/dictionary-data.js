// ======================================================================================
// DICTIONARY & WORD EXPLORER DATABASE (TỪ ĐIỂN ANH - VIỆT & HỌ TỪ TOÀN DIỆN TOEIC - VSTEP)
// Cung cấp: Nghĩa Anh - Việt, IPA, Họ từ (Word Family: N-V-Adj-Adv), Đồng nghĩa/Trái nghĩa,
// Collocations, Idioms, và Bộ tạo câu ngữ cảnh (10 - 20 - 30 lần chép)
// ======================================================================================

window.dictionaryData = {
    "economic": {
        word: "economic",
        phonetic: "/ˌiː.kəˈnɒm.ɪk/",
        partOfSpeech: "Adjective",
        vi: "Thuộc về kinh tế, liên quan đến nền kinh tế",
        definition: "Connected with the trade, industry and development of wealth of a country, an area or a society.",
        examTag: "TOEIC 500-900 / VSTEP B2-C1",
        wordFamily: {
            noun: [
                { term: "economy", vi: "nền kinh tế, sự tiết kiệm" },
                { term: "economics", vi: "môn kinh tế học" },
                { term: "economist", vi: "nhà kinh tế học" }
            ],
            verb: [
                { term: "economize", vi: "tiết kiệm chi tiêu, cắt giảm ngân sách" }
            ],
            adj: [
                { term: "economic", vi: "thuộc kinh tế (economic policy, economic growth)" },
                { term: "economical", vi: "tiết kiệm, rẻ, kinh tế (an economical car, economical solution)" }
            ],
            adv: [
                { term: "economically", vi: "về mặt kinh tế, một cách tiết kiệm" }
            ]
        },
        synonyms: ["financial", "fiscal", "monetary", "commercial", "profitable", "thrifty"],
        antonyms: ["uneconomical", "wasteful", "extravagant", "loss-making"],
        collocations: [
            { en: "economic growth / development", vi: "tăng trưởng / phát triển kinh tế" },
            { en: "economic crisis / downturn / recession", vi: "khủng hoảng / suy thoái kinh tế" },
            { en: "economic reform / policy", vi: "cải cách / chính sách kinh tế" },
            { en: "economical with energy / fuel", vi: "tiết kiệm năng lượng / nhiên liệu" },
            { en: "economize on expenses", vi: "thắt chặt chi tiêu, tiết kiệm chi phí" }
        ],
        idioms: [
            { en: "tighten one's belt", vi: "thắt lưng buộc bụng, cắt giảm chi tiêu trong giai đoạn khó khăn" },
            { en: "cut corners", vi: "đi đường tắt, cắt xén chi phí hoặc bỏ qua quy trình tiêu chuẩn" },
            { en: "pinch pennies", vi: "chắt bóp từng đồng, tằn tiện quá mức" }
        ],
        toeicNote: "⚠️ BẪY KINH ĐIỂN TOEIC PART 5: Đề thi thường cho 4 lựa chọn có cả 'economic' và 'economical'. Nhớ: 'economic' = thuộc về nền kinh tế (economic growth); 'economical' = tiết kiệm, đỡ tốn tiền (an economical small car).",
        examples: [
            { en: "The government announced a series of new economic policies to combat inflation.", vi: "Chính phủ vừa công bố một loạt chính sách kinh tế mới để kiểm soát lạm phát." },
            { en: "Hybrid vehicles are far more economical to drive in heavy city traffic.", vi: "Xe hybrid tiết kiệm chi phí hơn rất nhiều khi lái trong giờ cao điểm nội đô." }
        ]
    },

    "require": {
        word: "require",
        phonetic: "/rɪˈkwaɪər/",
        partOfSpeech: "Verb",
        vi: "Yêu cầu, đòi hỏi, bắt buộc",
        definition: "To need something; to depend on somebody/something; to demand by a law or rule.",
        examTag: "TOEIC 450+ / VSTEP B1-B2",
        wordFamily: {
            noun: [
                { term: "requirement", vi: "yêu cầu, điều kiện tiên quyết" },
                { term: "requisite", vi: "vật dụng cần thiết, điều kiện tất yếu" }
            ],
            verb: [
                { term: "require", vi: "yêu cầu, bắt buộc" }
            ],
            adj: [
                { term: "required", vi: "bắt buộc, được yêu cầu" },
                { term: "requisite", vi: "cần thiết, thiết yếu" }
            ],
            adv: [
                { term: "requisitely", vi: "theo cách thiết yếu, cần thiết" }
            ]
        },
        synonyms: ["demand", "necessitate", "mandate", "stipulate", "call for", "need"],
        antonyms: ["exempt", "waive", "optional", "eliminate"],
        collocations: [
            { en: "meet / fulfill all requirements", vi: "đáp ứng / thỏa mãn mọi yêu cầu" },
            { en: "require prior approval", vi: "yêu cầu sự phê duyệt trước" },
            { en: "required by law", vi: "bị bắt buộc theo luật định" },
            { en: "strict safety requirements", vi: "những yêu cầu an toàn nghiêm ngặt" },
            { en: "minimum job requirements", vi: "yêu cầu công việc tối thiểu" }
        ],
        idioms: [
            { en: "stand in need of", vi: "đang trong tình trạng rất cần điều gì đó" },
            { en: "a must-have", vi: "thứ bắt buộc phải có, không thể thiếu" }
        ],
        toeicNote: "Cấu trúc hay ra: 'require somebody to do something' (yêu cầu ai làm gì) và thể bị động: 'be required to do something' (bắt buộc phải làm gì).",
        examples: [
            { en: "Applicants are required to submit three letters of recommendation with their resume.", vi: "Ứng viên được yêu cầu nộp 3 thư giới thiệu kèm theo sơ yếu lý lịch." },
            { en: "The proposed building expansion will require significant capital investment.", vi: "Dự án mở rộng tòa nhà sẽ đòi hỏi một khoản vốn đầu tư đáng kể." }
        ]
    },

    "contract": {
        word: "contract",
        phonetic: "/ˈkɒn.trækt/",
        partOfSpeech: "Noun & Verb",
        vi: "Hợp đồng (danh từ); ký kết hợp đồng, thu hẹp lại (động từ)",
        definition: "An official written agreement between two or more people, organizations, etc.",
        examTag: "TOEIC 500+ / VSTEP B1-B2",
        wordFamily: {
            noun: [
                { term: "contract", vi: "bản hợp đồng, giao kèo" },
                { term: "contractor", vi: "nhà thầu, bên nhận thầu" },
                { term: "contraction", vi: "sự co rút, sự thu hẹp lại" }
            ],
            verb: [
                { term: "contract", vi: "ký hợp đồng, giao kết; co lại" },
                { term: "subcontract", vi: "giao thầu phụ" }
            ],
            adj: [
                { term: "contractual", vi: "thuộc về hợp đồng, có tính pháp lý" }
            ],
            adv: [
                { term: "contractually", vi: "theo hợp đồng, chiếu theo quy định hợp đồng" }
            ]
        },
        synonyms: ["agreement", "pact", "deal", "compact", "covenant", "treaty"],
        antonyms: ["breach", "cancellation", "dissolution", "expansion"],
        collocations: [
            { en: "sign / terminate a contract", vi: "ký kết / chấm dứt một bản hợp đồng" },
            { en: "breach / violate a contract", vi: "vi phạm điều khoản hợp đồng" },
            { en: "renew a contract", vi: "gia hạn hợp đồng" },
            { en: "contractual obligation", vi: "nghĩa vụ theo hợp đồng" },
            { en: "binding contract", vi: "hợp đồng có giá trị ràng buộc pháp lý" }
        ],
        idioms: [
            { en: "seal the deal", vi: "chốt giao dịch, ký hợp đồng thành công" },
            { en: "in black and white", vi: "giấy trắng mực đen, rõ ràng minh bạch trên giấy tờ" }
        ],
        toeicNote: "Phát âm: Danh từ đọc trọng âm rơi vào âm tiết 1 /ˈkɒn.trækt/, Động từ co lại/ký kết thường đọc trọng âm âm tiết 2 /kənˈtrækt/.",
        examples: [
            { en: "Both parties agreed to review the terms of the contract before signing.", vi: "Cả hai bên đã đồng ý xem lại các điều khoản của hợp đồng trước khi đặt bút ký." },
            { en: "Failure to deliver the goods on schedule constitutes a breach of contract.", vi: "Việc không giao hàng đúng hạn cấu thành hành vi vi phạm hợp đồng." }
        ]
    },

    "produce": {
        word: "produce",
        phonetic: "/prəˈdjuːs/ (v) - /ˈprɒd.juːs/ (n)",
        partOfSpeech: "Verb & Noun",
        vi: "Sản xuất, chế tạo (động từ); nông sản tươi sống (danh từ)",
        definition: "To make things to be sold, especially in large quantities; (noun) things that have been made or grown, especially by farming.",
        examTag: "TOEIC 400+ / VSTEP B1-C1",
        wordFamily: {
            noun: [
                { term: "product", vi: "sản phẩm thành phẩm" },
                { term: "production", vi: "quá trình sản xuất, sản lượng" },
                { term: "producer", vi: "nhà sản xuất" },
                { term: "productivity", vi: "năng suất lao động" },
                { term: "produce", vi: "nông sản (rau củ quả tươi sống)" }
            ],
            verb: [
                { term: "produce", vi: "sản xuất, tạo ra" },
                { term: "reproduce", vi: "tái sản xuất, sao chép" }
            ],
            adj: [
                { term: "productive", vi: "năng suất cao, hiệu quả" },
                { term: "counterproductive", vi: "phản tác dụng, đem lại kết quả ngược" }
            ],
            adv: [
                { term: "productively", vi: "một cách năng suất, hiệu quả cao" }
            ]
        },
        synonyms: ["manufacture", "generate", "create", "yield", "fabricate"],
        antonyms: ["consume", "destroy", "deplete", "demolish"],
        collocations: [
            { en: "mass produce", vi: "sản xuất hàng loạt" },
            { en: "boost / increase productivity", vi: "thúc đẩy / nâng cao năng suất" },
            { en: "fresh local produce", vi: "nông sản tươi sống tại địa phương" },
            { en: "productive meeting", vi: "cuộc họp hiệu quả, năng suất" },
            { en: "production line", vi: "dây chuyền sản xuất" }
        ],
        idioms: [
            { en: "bear fruit", vi: "đơm hoa kết trái, mang lại thành quả tốt đẹp" },
            { en: "turn out", vi: "cho ra lò, xuất xưởng sản phẩm" }
        ],
        toeicNote: "⚠️ Bẫy Part 5: 'Produce' là danh từ không đếm được chỉ nông sản (rau, quả). Khi nói về đồ dùng, máy móc, hàng hóa phải dùng 'Product' (đếm được).",
        examples: [
            { en: "The factory produces over five thousand automotive components every day.", vi: "Nhà máy sản xuất hơn 5.000 linh kiện ô tô mỗi ngày." },
            { en: "We buy our fresh produce directly from local organic farmers.", vi: "Chúng tôi mua nông sản tươi sống trực tiếp từ các nông dân hữu cơ địa phương." }
        ]
    },

    "compete": {
        word: "compete",
        phonetic: "/kəmˈpiːt/",
        partOfSpeech: "Verb",
        vi: "Cạnh tranh, đua tài, ganh đua",
        definition: "To try to be more successful than other companies or people in business, sports, etc.",
        examTag: "TOEIC 550+ / VSTEP B2",
        wordFamily: {
            noun: [
                { term: "competition", vi: "sự cạnh tranh, cuộc thi" },
                { term: "competitor", vi: "đối thủ cạnh tranh" },
                { term: "competitiveness", vi: "năng lực cạnh tranh" },
                { term: "competence", vi: "năng lực, trình độ chuyên môn" }
            ],
            verb: [
                { term: "compete", vi: "cạnh tranh, thi đua" }
            ],
            adj: [
                { term: "competitive", vi: "có tính cạnh tranh, giá cạnh tranh" },
                { term: "uncompetitive", vi: "kém cạnh tranh" },
                { term: "competent", vi: "thành thạo, có đủ năng lực" }
            ],
            adv: [
                { term: "competitively", vi: "một cách cạnh tranh (competitively priced: giá cả rất cạnh tranh)" },
                { term: "competently", vi: "một cách thành thạo, có năng lực" }
            ]
        },
        synonyms: ["contend", "vie", "rival", "contest", "strive"],
        antonyms: ["cooperate", "collaborate", "surrender", "withdraw"],
        collocations: [
            { en: "competitive edge / advantage", vi: "lợi thế cạnh tranh vượt trội" },
            { en: "competitively priced", vi: "được định giá cạnh tranh (rất hay gặp trong đề TOEIC!)" },
            { en: "fierce / intense competition", vi: "sự cạnh tranh khốc liệt" },
            { en: "compete against / with rivals", vi: "cạnh tranh với các đối thủ" },
            { en: "stay / remain competitive", vi: "duy trì vị thế cạnh tranh trên thị trường" }
        ],
        idioms: [
            { en: "run for one's money", vi: "tạo ra sự cạnh tranh gay gắt cho đối thủ" },
            { en: "ahead of the curve", vi: "đi trước đón đầu xu hướng, dẫn đầu cuộc đua" }
        ],
        toeicNote: "Cụm 'competitively priced' (được định giá cạnh tranh) xuất hiện với tần suất cực cao trong TOEIC Part 5 & 6.",
        examples: [
            { en: "Small businesses must offer exceptional service to compete with large corporations.", vi: "Các doanh nghiệp nhỏ phải cung cấp dịch vụ xuất sắc để cạnh tranh với các tập đoàn lớn." },
            { en: "Our newly launched software is competitively priced to attract corporate clients.", vi: "Phần mềm mới ra mắt của chúng tôi có giá rất cạnh tranh để thu hút khách hàng doanh nghiệp." }
        ]
    },

    "decide": {
        word: "decide",
        phonetic: "/dɪˈsaɪd/",
        partOfSpeech: "Verb",
        vi: "Quyết định, định đoạt",
        definition: "To think carefully about the different possibilities that are available and choose one of them.",
        examTag: "TOEIC 400+ / VSTEP B1",
        wordFamily: {
            noun: [
                { term: "decision", vi: "quyết định" },
                { term: "decisiveness", vi: "tính quyết đoán" }
            ],
            verb: [
                { term: "decide", vi: "quyết định" }
            ],
            adj: [
                { term: "decisive", vi: "dứt khoát, mang tính bước ngoặt quyết định" },
                { term: "indecisive", vi: "do dự, thiếu quyết đoán" },
                { term: "decided", vi: "rõ rệt, dứt khoát" }
            ],
            adv: [
                { term: "decisively", vi: "một cách dứt khoát, quyết đoán" }
            ]
        },
        synonyms: ["determine", "resolve", "settle", "choose", "opt"],
        antonyms: ["hesitate", "waver", "delay", "postpone"],
        collocations: [
            { en: "make / reach a decision", vi: "đưa ra / đi đến một quyết định" },
            { en: "decisive factor / action", vi: "yếu tố quyết định / hành động dứt khoát" },
            { en: "decide against doing something", vi: "quyết định không làm điều gì đó" },
            { en: "unanimous decision", vi: "quyết định đồng thuận 100%" }
        ],
        idioms: [
            { en: "make up one's mind", vi: "hạ quyết tâm, quyết định dứt khoát" },
            { en: "sit on the fence", vi: "chần chừ, ba phải, chưa dám đưa ra quyết định" }
        ],
        toeicNote: "Sau 'decide' luôn đi với động từ to-V: 'decide to do something'. Danh từ là 'make a decision' (không dùng do a decision).",
        examples: [
            { en: "The board of directors will decide whether to approve the merger next Monday.", vi: "Hội đồng quản trị sẽ quyết định xem có phê duyệt thương vụ sáp nhập vào thứ Hai tới hay không." },
            { en: "A prompt and decisive response is critical when managing a customer service crisis.", vi: "Phản hồi nhanh chóng và dứt khoát là điều tối quan trọng khi xử lý khủng hoảng dịch vụ khách hàng." }
        ]
    },

    "apply": {
        word: "apply",
        phonetic: "/əˈplaɪ/",
        partOfSpeech: "Verb",
        vi: "Nộp đơn, ứng tuyển; áp dụng quy định",
        definition: "To make a formal request, usually in writing, for something such as a job, a place at a college, or permission.",
        examTag: "TOEIC 450+ / VSTEP B1-B2",
        wordFamily: {
            noun: [
                { term: "application", vi: "đơn xin việc, ứng dụng, sự ứng dụng" },
                { term: "applicant", vi: "ứng viên nộp đơn" },
                { term: "appliance", vi: "thiết bị, đồ gia dụng (household appliances)" },
                { term: "applicability", vi: "khả năng ứng dụng thực tế" }
            ],
            verb: [
                { term: "apply", vi: "ứng tuyển, áp dụng" }
            ],
            adj: [
                { term: "applicable", vi: "có thể áp dụng được, thích hợp" },
                { term: "applied", vi: "ứng dụng (applied science: khoa học ứng dụng)" }
            ],
            adv: [
                { term: "applicably", vi: "một cách thích hợp" }
            ]
        },
        synonyms: ["submit", "petition", "implement", "utilize", "employ"],
        antonyms: ["withdraw", "revoke", "exempt", "neglect"],
        collocations: [
            { en: "apply for a position / grant", vi: "nộp đơn ứng tuyển một vị trí / xin tài trợ" },
            { en: "submit a job application", vi: "gửi đơn xin việc" },
            { en: "successful applicant", vi: "ứng viên trúng tuyển" },
            { en: "apply rules / regulations", vi: "áp dụng các quy tắc / quy định" },
            { en: "where applicable", vi: "nếu có thể áp dụng, nếu có" }
        ],
        idioms: [
            { en: "put into practice", vi: "đưa vào áp dụng thực tế" },
            { en: "throw one's hat into the ring", vi: "tuyên bố tham gia ứng cử hoặc tranh cử" }
        ],
        toeicNote: "⚠️ Phân biệt bẫy cực hay gặp: 'Applicant' là người (ứng viên), 'Application' là vật (đơn xin việc / phần mềm).",
        examples: [
            { en: "Qualified candidates are encouraged to apply for the senior marketing manager post.", vi: "Các ứng viên đủ tiêu chuẩn được khuyến khích nộp đơn ứng tuyển vị trí giám đốc tiếp thị cấp cao." },
            { en: "The revised office safety rules apply to all permanent and contract personnel.", vi: "Quy định an toàn văn phòng sửa đổi được áp dụng cho toàn bộ nhân sự chính thức và thời vụ." }
        ]
    },

    "negotiate": {
        word: "negotiate",
        phonetic: "/nəˈɡoʊ.ʃi.eɪt/",
        partOfSpeech: "Verb",
        vi: "Đàm phán, thương lượng",
        definition: "To try to reach an agreement by formal discussion with others.",
        examTag: "TOEIC 650+ / VSTEP B2-C1",
        wordFamily: {
            noun: [
                { term: "negotiation", vi: "cuộc đàm phán, quá trình thương lượng" },
                { term: "negotiator", vi: "nhà đàm phán" }
            ],
            verb: [
                { term: "negotiate", vi: "thương lượng, đàm phán" }
            ],
            adj: [
                { term: "negotiable", vi: "có thể thương lượng được (e.g. salary negotiable)" },
                { term: "non-negotiable", vi: "không thể thương lượng, bắt buộc cố định" }
            ],
            adv: [
                { term: "negotiably", vi: "theo cách có thể thương lượng" }
            ]
        },
        synonyms: ["bargain", "mediate", "confer", "settle", "hammer out"],
        antonyms: ["demand", "dictate", "impose", "reject"],
        collocations: [
            { en: "enter into negotiations", vi: "bước vào quá trình đàm phán" },
            { en: "negotiate a contract / lease", vi: "thương lượng hợp đồng / hợp đồng thuê" },
            { en: "salary is negotiable", vi: "mức lương có thể thỏa thuận (hay gặp ở tin tuyển dụng)" },
            { en: "successful negotiation", vi: "cuộc đàm phán thành công" }
        ],
        idioms: [
            { en: "meet halfway", vi: "thỏa hiệp, mỗi bên nhượng bộ một nửa" },
            { en: "drive a hard bargain", vi: "mặc cả quyết liệt để giành lợi thế tối đa" }
        ],
        toeicNote: "Trong mục tuyển dụng TOEIC Part 7: 'Salary is negotiable depending on experience' (Lương thỏa thuận tùy theo kinh nghiệm làm việc).",
        examples: [
            { en: "Our legal counsel will negotiate the final contract terms with the supplier.", vi: "Cố vấn pháp lý của chúng tôi sẽ thương lượng các điều khoản hợp đồng cuối cùng với nhà cung cấp." },
            { en: "After lengthy negotiations, the two firms agreed on a joint venture agreement.", vi: "Sau các cuộc đàm phán kéo dài, hai công ty đã thống nhất về thỏa thuận liên doanh." }
        ]
    },

    "succeed": {
        word: "succeed",
        phonetic: "/səkˈsiːd/",
        partOfSpeech: "Verb",
        vi: "Thành công; kế nghiệp, kế vị",
        definition: "To achieve something that you have been trying to do or get; to come next after somebody/something and take their place.",
        examTag: "TOEIC 500+ / VSTEP B1-B2",
        wordFamily: {
            noun: [
                { term: "success", vi: "sự thành công" },
                { term: "successor", vi: "người kế nhiệm, người thừa kế" },
                { term: "succession", vi: "sự kế tiếp, chuỗi liên tiếp" }
            ],
            verb: [
                { term: "succeed", vi: "thành công; kế nhiệm" }
            ],
            adj: [
                { term: "successful", vi: "thành công, thắng lợi" },
                { term: "successive", vi: "liên tiếp, kế tiếp nhau (for three successive years: 3 năm liên tiếp)" }
            ],
            adv: [
                { term: "successfully", vi: "một cách thành công" },
                { term: "successively", vi: "liên tiếp nhau, lần lượt" }
            ]
        },
        synonyms: ["triumph", "prosper", "flourish", "follow", "supersede"],
        antonyms: ["fail", "collapse", "precede", "surrender"],
        collocations: [
            { en: "succeed in doing something", vi: "thành công trong việc làm gì" },
            { en: "achieve great success", vi: "đạt được thành công vang dội" },
            { en: "for three successive quarters", vi: "trong ba quý liên tiếp (rất hay thi!)" },
            { en: "name a successor", vi: "chỉ định người kế nhiệm chức vụ" }
        ],
        idioms: [
            { en: "hit the jackpot", vi: "trúng đậm, gặt hái thành công lớn ngoài mong đợi" },
            { en: "make it big", vi: "trở nên cực kỳ thành công và nổi tiếng" }
        ],
        toeicNote: "⚠️ Bẫy Part 5: 'successful' = thành công (a successful project), nhưng 'successive' = liên tiếp (for five successive days). Rất nhiều bạn chọn nhầm!",
        examples: [
            { en: "The engineering team succeeded in launching the prototype ahead of deadline.", vi: "Đội ngũ kỹ thuật đã thành công trong việc cho ra mắt mẫu thử nghiệm trước thời hạn." },
            { en: "The company reported record profit growth for three successive financial years.", vi: "Công ty báo cáo mức tăng trưởng lợi nhuận kỷ lục trong ba năm tài chính liên tiếp." }
        ]
    },

    "inform": {
        word: "inform",
        phonetic: "/ɪnˈfɔːrm/",
        partOfSpeech: "Verb",
        vi: "Thông báo, báo tin, cho biết",
        definition: "To tell somebody about something, especially in an official way.",
        examTag: "TOEIC 400+ / VSTEP B1",
        wordFamily: {
            noun: [
                { term: "information", vi: "thông tin (danh từ không đếm được)" },
                { term: "informant", vi: "người cung cấp tin tức" },
                { term: "informer", vi: "người chỉ điểm" }
            ],
            verb: [
                { term: "inform", vi: "thông báo cho ai đó" }
            ],
            adj: [
                { term: "informative", vi: "chứa nhiều thông tin hữu ích, bổ ích" },
                { term: "informed", vi: "có hiểu biết sâu rộng, nắm rõ thông tin" },
                { term: "uninformed", vi: "thiếu thông tin, không nắm được tình hình" }
            ],
            adv: [
                { term: "informatively", vi: "một cách cung cấp nhiều thông tin" },
                { term: "informedly", vi: "dựa trên sự hiểu biết thấu đáo" }
            ]
        },
        synonyms: ["notify", "apprise", "brief", "advise", "update"],
        antonyms: ["conceal", "withhold", "hide", "mislead"],
        collocations: [
            { en: "inform somebody of / about something", vi: "thông báo cho ai về điều gì" },
            { en: "keep somebody informed", vi: "liên tục cập nhật thông tin cho ai" },
            { en: "an informative seminar / workshop", vi: "buổi hội thảo rất bổ ích và nhiều thông tin" },
            { en: "make an informed decision", vi: "đưa ra quyết định dựa trên hiểu biết đầy đủ" }
        ],
        idioms: [
            { en: "keep in the loop", vi: "giữ cho ai luôn nắm được thông tin cập nhật" },
            { en: "spill the beans", vi: "tiết lộ bí mật hoặc thông tin nội bộ" }
        ],
        toeicNote: "⚠️ Lưu ý ngữ pháp: 'inform' luôn cần tân ngữ người đi sau: 'inform somebody that...' hoặc 'inform somebody of something'. Còn 'announce' thì không cần tân ngữ người ngay sau.",
        examples: [
            { en: "Please inform the human resources department immediately if your address changes.", vi: "Vui lòng thông báo cho phòng nhân sự ngay lập tức nếu địa chỉ của bạn thay đổi." },
            { en: "The keynote presentation delivered by Dr. Evans was extraordinarily informative.", vi: "Bài thuyết trình chính do Tiến sĩ Evans trình bày vô cùng bổ ích và giàu thông tin." }
        ]
    },

    "invest": {
        word: "invest",
        phonetic: "/ɪnˈvest/",
        partOfSpeech: "Verb",
        vi: "Đầu tư, bỏ vốn",
        definition: "To buy property, shares in a company, etc. in the hope of making a profit.",
        examTag: "TOEIC 500+ / VSTEP B2",
        wordFamily: {
            noun: [
                { term: "investment", vi: "khoản đầu tư, sự đầu tư" },
                { term: "investor", vi: "nhà đầu tư" }
            ],
            verb: [
                { term: "invest", vi: "đầu tư" },
                { term: "reinvest", vi: "tái đầu tư" }
            ],
            adj: [
                { term: "invested", vi: "được đầu tư" }
            ],
            adv: []
        },
        synonyms: ["venture", "fund", "finance", "back", "capitalize"],
        antonyms: ["divest", "withdraw", "squander", "waste"],
        collocations: [
            { en: "invest in research and development (R&D)", vi: "đầu tư vào nghiên cứu và phát triển" },
            { en: "attract foreign investors", vi: "thu hút các nhà đầu tư nước ngoài" },
            { en: "return on investment (ROI)", vi: "tỷ suất hoàn vốn đầu tư (ROI)" },
            { en: "sound / wise investment", vi: "khoản đầu tư khôn ngoan, an toàn" }
        ],
        idioms: [
            { en: "put all eggs in one basket", vi: "bỏ tất cả trứng vào một giỏ (đầu tư quá mạo hiểm)" },
            { en: "put one's money where one's mouth is", vi: "nói đi đôi với làm bằng cách chịu bỏ tiền đầu tư" }
        ],
        toeicNote: "Giới từ cố định: 'invest in something'. 'ROI' (Return on Investment) là từ viết tắt rất phổ biến trong bài đọc TOEIC Part 7.",
        examples: [
            { en: "Our corporation plans to invest ten million dollars in renewable energy technology.", vi: "Tập đoàn chúng tôi dự định đầu tư 10 triệu đô la vào công nghệ năng lượng tái tạo." },
            { en: "Upgrading employee training programs represents an investment in long-term success.", vi: "Nâng cấp các chương trình đào tạo nhân viên là một sự đầu tư cho thành công dài hạn." }
        ]
    },

    "manage": {
        word: "manage",
        phonetic: "/ˈmæn.ɪdʒ/",
        partOfSpeech: "Verb",
        vi: "Quản lý, điều hành; xoay sở thành công",
        definition: "To control or be in charge of a business, a team, an organization, land, etc.; to succeed in doing something, especially something difficult.",
        examTag: "TOEIC 400+ / VSTEP B1-B2",
        wordFamily: {
            noun: [
                { term: "management", vi: "ban quản lý, sự quản lý" },
                { term: "manager", vi: "người quản lý, trưởng phòng" },
                { term: "manageress", vi: "nữ quản lý" }
            ],
            verb: [
                { term: "manage", vi: "quản lý; xoay sở" },
                { term: "mismanage", vi: "quản lý yếu kém, sai sót" }
            ],
            adj: [
                { term: "managerial", vi: "thuộc về quản lý (managerial experience / position)" },
                { term: "manageable", vi: "có thể quản lý, kiểm soát được" },
                { term: "unmanageable", vi: "bất kham, không thể kiểm soát" }
            ],
            adv: [
                { term: "manageably", vi: "theo cách có thể xoay sở được" }
            ]
        },
        synonyms: ["oversee", "supervise", "administer", "direct", "cope"],
        antonyms: ["mismanage", "neglect", "mishandle", "fail"],
        collocations: [
            { en: "managerial role / position", vi: "vị trí quản lý (cực hay thi từ loại Part 5!)" },
            { en: "manage time effectively", vi: "quản lý thời gian hiệu quả" },
            { en: "senior / executive management", vi: "ban quản lý cấp cao / ban điều hành" },
            { en: "manage to do something", vi: "xoay sở hoàn thành được việc gì đó khó khăn" }
        ],
        idioms: [
            { en: "call the shots", vi: "nắm quyền chỉ đạo, quyết định mọi việc" },
            { en: "keep tabs on", vi: "giám sát, theo dõi chặt chẽ tiến độ" }
        ],
        toeicNote: "⚠️ Part 5 hay đố tính từ của 'manage': Lựa chọn cần điền trước danh từ 'experience' hoặc 'staff' là 'managerial' (chứ không phải managing).",
        examples: [
            { en: "Candidates with at least five years of managerial experience are preferred.", vi: "Ưu tiên các ứng viên có ít nhất 5 năm kinh nghiệm quản lý." },
            { en: "Despite strict budget cuts, she managed to complete the construction on time.", vi: "Dù bị cắt giảm ngân sách nghiêm ngặt, cô ấy vẫn xoay sở hoàn thành công trình đúng hạn." }
        ]
    },

    "hello": {
        word: "hello",
        phonetic: "/həˈloʊ/",
        partOfSpeech: "Interjection & Noun",
        vi: "Xin chào; lời chào hỏi thân mật hoặc lịch thiệp",
        definition: "Used as a greeting when you meet somebody, that you say when you answer the telephone, or when you want to attract somebody's attention.",
        examTag: "Giao tiếp hàng ngày / Phổ thông",
        wordFamily: {
            noun: [
                { term: "hello", vi: "lời chào, câu chào hỏi" }
            ],
            verb: [
                { term: "say hello", vi: "gửi lời chào hỏi" }
            ],
            adj: [],
            adv: []
        },
        synonyms: ["greeting", "salutation", "welcome", "hi", "good morning"],
        antonyms: ["goodbye", "farewell", "adieu"],
        collocations: [
            { en: "say hello to somebody", vi: "gửi lời chào đến ai đó" },
            { en: "wave hello", vi: "vẫy tay chào thân thiện" },
            { en: "a polite hello", vi: "lời chào lịch sự, nhã nhặn" },
            { en: "hello and welcome", vi: "xin chào và chào mừng bạn" }
        ],
        idioms: [
            { en: "break the ice", vi: "phá vỡ bầu không khí ngại ngùng ban đầu bằng một lời chào" },
            { en: "say a quick hello", vi: "ghé qua chào hỏi nhanh một câu" }
        ],
        toeicNote: "Trong văn phong thư tín thương mại TOEIC, thay vì dùng 'hello', người ta thường dùng 'Dear Mr./Ms. [Tên]' hoặc 'Good morning / afternoon'.",
        examples: [
            { en: "She smiled warmly and said hello as soon as the client walked into the office.", vi: "Cô ấy mỉm cười ấm áp và cất tiếng chào ngay khi khách hàng bước vào văn phòng." },
            { en: "Please say hello to the marketing team for me when you visit their branch.", vi: "Gửi lời chào của tôi đến đội ngũ tiếp thị khi bạn ghé thăm chi nhánh của họ nhé." }
        ]
    },

    "territory": {
        word: "territory",
        phonetic: "/ˈter.ə.tɔːr.i/",
        partOfSpeech: "Noun",
        vi: "Lãnh thổ, địa bàn quản lý, khu vực thị trường / phân phối kinh doanh",
        definition: "An area of land that belongs to or is controlled by a particular country, ruler, or organization; an area in which a salesperson or company has the right or responsibility to operate.",
        examTag: "TOEIC 550+ / VSTEP B1-B2",
        wordFamily: {
            noun: [
                { term: "territory", vi: "lãnh thổ, địa bàn kinh doanh" },
                { term: "territoriality", vi: "tính lãnh thổ, ý thức bảo vệ địa bàn" }
            ],
            verb: [
                { term: "territorialize", vi: "phân chia theo địa bàn, quy hoạch khu vực" }
            ],
            adj: [
                { term: "territorial", vi: "thuộc lãnh thổ, mang tính địa bàn (territorial waters / boundaries)" }
            ],
            adv: [
                { term: "territorially", vi: "về mặt lãnh thổ, theo ranh giới địa lý" }
            ]
        },
        synonyms: ["region", "area", "domain", "zone", "district", "sector", "province"],
        antonyms: ["center", "whole"],
        collocations: [
            { en: "sales territory", vi: "địa bàn bán hàng, khu vực phân phối tiêu thụ sản phẩm" },
            { en: "uncharted / unfamiliar territory", vi: "lĩnh vực hoàn toàn mới lạ, vùng đất chưa từng khám phá" },
            { en: "disputed territory", vi: "vùng lãnh thổ đang tranh chấp" },
            { en: "assigned territory", vi: "địa bàn được phân công phụ trách" },
            { en: "expand into new territory", vi: "mở rộng hoạt động sang địa bàn mới" }
        ],
        idioms: [
            { en: "comes with the territory", vi: "là điều tất yếu đi kèm với tính chất công việc hoặc vị trí đó" },
            { en: "mark one's territory", vi: "khẳng định chủ quyền hoặc phạm vi ảnh hưởng của mình" }
        ],
        toeicNote: "⚠️ TOEIC Part 7 cực kỳ hay gặp cụm 'sales territory' (khu vực bán hàng của đại diện thương mại) hoặc 'reassign territories' (phân bổ lại địa bàn quản lý nhân viên thị trường).",
        examples: [
            { en: "Our regional sales director assigned each representative a distinct commercial territory.", vi: "Giám đốc bán hàng khu vực đã phân công cho mỗi đại diện một địa bàn thương mại riêng biệt." },
            { en: "Dealing with tight deadlines unfortunately comes with the territory of project management.", vi: "Đối mặt với thời hạn gấp gáp đáng tiếc lại là điều tất yếu đi kèm với nghề quản lý dự án." }
        ]
    },

    "sales territory": {
        word: "sales territory",
        phonetic: "/seɪlz ˈter.ə.tɔːr.i/",
        partOfSpeech: "Cụm danh từ / Collocation",
        vi: "Khu vực tiêu thụ, địa bàn phân phối bán hàng của doanh nghiệp",
        definition: "The customer group or geographical area for which an individual salesperson or sales team holds responsibility.",
        examTag: "TOEIC Part 7 Chuyên sâu / Business English",
        wordFamily: {
            noun: [
                { term: "sales representative", vi: "đại diện bán hàng thị trường" },
                { term: "territory management", vi: "quản lý địa bàn kinh doanh" }
            ],
            verb: [
                { term: "assign a territory", vi: "giao địa bàn cho nhân viên" }
            ],
            adj: [
                { term: "territorial", vi: "mang tính địa bàn" }
            ],
            adv: []
        },
        synonyms: ["market area", "sales district", "coverage zone", "target region"],
        antonyms: [],
        collocations: [
            { en: "manage a sales territory", vi: "quản lý một địa bàn bán hàng" },
            { en: "expand the sales territory", vi: "mở rộng khu vực tiêu thụ" },
            { en: "sales territory realignment", vi: "tái cơ cấu, phân chia lại địa bàn bán hàng" }
        ],
        idioms: [
            { en: "hit the ground running", vi: "bắt tay vào khai thác địa bàn mới đầy năng nổ và hiệu quả" }
        ],
        toeicNote: "💡 Ghi nhớ nguyên cụm 'sales territory' giúp bạn trả lời ngay câu hỏi ai phụ trách vùng nào trong bài đọc email / thông báo nội bộ Part 7!",
        examples: [
            { en: "Due to exceptional performance, John was promoted to oversee the entire Southeast Asian sales territory.", vi: "Nhờ thành tích xuất sắc, John đã được thăng chức để giám sát toàn bộ địa bàn bán hàng Đông Nam Á." }
        ]
    },

    "collocation": {
        word: "collocation",
        phonetic: "/ˌkɒl.əˈkeɪ.ʃən/",
        partOfSpeech: "Noun",
        vi: "Cụm từ cố định, sự kết hợp từ tự nhiên theo thói quen của người bản xứ",
        definition: "A combination of words in a language that happens very often and sounds natural to people who have spoken the language even though other combinations might make sense.",
        examTag: "Cốt lõi TOEIC Part 5 & 6",
        wordFamily: {
            noun: [
                { term: "collocation", vi: "sự kết hợp từ, cụm từ cố định" }
            ],
            verb: [
                { term: "collocate", vi: "đi cùng với nhau một cách tự nhiên (từ vựng)" }
            ],
            adj: [
                { term: "collocational", vi: "thuộc về cụm từ cố định" }
            ],
            adv: []
        },
        synonyms: ["word pairing", "idiomatic phrase", "fixed expression"],
        antonyms: [],
        collocations: [
            { en: "strong / weak collocation", vi: "cụm kết hợp từ chặt chẽ / lỏng lẻo" },
            { en: "learn words in collocation", vi: "học từ vựng theo cụm từ cố định" },
            { en: "lexical collocation", vi: "sự kết hợp từ vựng tự nhiên" }
        ],
        idioms: [],
        toeicNote: "⚠️ 60% câu hỏi từ vựng trong Part 5 kiểm tra kiến thức về Collocation (VD: 'conduct a survey', 'meet the deadline', 'make a reservation'). Học theo cụm giúp bạn chọn đáp án trong 2 giây!",
        examples: [
            { en: "In English, 'heavy rain' is a natural collocation, whereas 'strong rain' sounds unnatural.", vi: "Trong tiếng Anh, 'heavy rain' là một cụm từ tự nhiên, trong khi 'strong rain' nghe rất gượng gạo." }
        ]
    },

    "strategy": {
        word: "strategy",
        phonetic: "/ˈstræt.ə.dʒi/",
        partOfSpeech: "Noun",
        vi: "Chiến lược, kế hoạch hành động dài hạn",
        definition: "A detailed plan for achieving success in situations such as business, politics, war, etc.",
        examTag: "TOEIC 500+ / VSTEP B1-C1",
        wordFamily: {
            noun: [
                { term: "strategy", vi: "chiến lược" },
                { term: "strategist", vi: "nhà chiến lược" }
            ],
            verb: [
                { term: "strategize", vi: "lập chiến lược, hoạch định kế hoạch" }
            ],
            adj: [
                { term: "strategic", vi: "mang tính chiến lược, có tầm quan trọng dài hạn" }
            ],
            adv: [
                { term: "strategically", vi: "về mặt chiến lược, một cách có tính toán" }
            ]
        },
        synonyms: ["tactics", "masterplan", "approach", "scheme", "roadmap"],
        antonyms: ["impromptu", "chance"],
        collocations: [
            { en: "marketing / business strategy", vi: "chiến lược tiếp thị / kinh doanh" },
            { en: "adopt / implement a strategy", vi: "áp dụng / triển khai một chiến lược" },
            { en: "strategic partnership", vi: "quan hệ đối tác chiến lược" },
            { en: "strategically located", vi: "tọa lạc tại vị trí chiến lược đắc địa" }
        ],
        idioms: [],
        toeicNote: "Bẫy từ loại Part 5: Trước danh từ 'location' hay 'decision' cần tính từ 'strategic' (VD: a strategic decision).",
        examples: [
            { en: "The board met yesterday to devise a comprehensive strategy for expanding overseas.", vi: "Hội đồng quản trị đã họp hôm qua để vạch ra chiến lược toàn diện nhằm mở rộng ra nước ngoài." }
        ]
    },

    "revenue": {
        word: "revenue",
        phonetic: "/ˈrev.ən.juː/",
        partOfSpeech: "Noun",
        vi: "Doanh thu, tổng thu nhập của công ty hoặc chính phủ",
        definition: "The income that a government or company receives regularly.",
        examTag: "TOEIC 500+ / Tài chính Doanh nghiệp",
        wordFamily: {
            noun: [
                { term: "revenue", vi: "tổng doanh thu" }
            ],
            verb: [],
            adj: [],
            adv: []
        },
        synonyms: ["income", "proceeds", "turnover", "earnings", "receipts"],
        antonyms: ["expenditure", "expenses", "loss", "deficit"],
        collocations: [
            { en: "generate revenue", vi: "tạo ra doanh thu" },
            { en: "annual / quarterly revenue", vi: "doanh thu hàng năm / hàng quý" },
            { en: "revenue growth / decline", vi: "sự tăng trưởng / sụt giảm doanh thu" },
            { en: "tax revenue", vi: "nguồn thu ngân sách từ thuế" }
        ],
        idioms: [
            { en: "the bottom line", vi: "lợi nhuận ròng sau cùng (sau khi trừ chi phí khỏi doanh thu)" }
        ],
        toeicNote: "Phân biệt: Revenue (doanh thu tổng trước chi phí) khác với Profit (lợi nhuận sau khi đã trừ đi mọi chi phí).",
        examples: [
            { en: "Online advertising now accounts for more than half of the newspaper's total revenue.", vi: "Quảng cáo trực tuyến hiện chiếm hơn một nửa tổng doanh thu của tòa soạn báo." }
        ]
    },

    "in accordance with": {
        word: "in accordance with",
        phonetic: "/ɪn əˈkɔː.dəns wɪð/",
        partOfSpeech: "Cụm giới từ / Collocation",
        vi: "Phù hợp với, tuân theo, chiếu theo (quy định, hợp đồng, luật lệ)",
        definition: "Following or obeying a rule, law, wish, or agreement.",
        examTag: "Bẫy Ngữ Pháp TOEIC Part 5 & 6",
        wordFamily: {
            noun: [
                { term: "accordance", vi: "sự tuân theo, sự phù hợp" }
            ],
            verb: [
                { term: "accord", vi: "phù hợp, ban cho" }
            ],
            adj: [],
            adv: []
        },
        synonyms: ["in compliance with", "conforming to", "pursuant to", "according to"],
        antonyms: ["contrary to", "in violation of"],
        collocations: [
            { en: "in accordance with regulations / policy", vi: "chiếu theo quy định / chính sách" },
            { en: "act in accordance with the law", vi: "hành động tuân theo pháp luật" }
        ],
        idioms: [],
        toeicNote: "⚠️ Cực kỳ hay ra trong Part 5: Điền 'accordance' vào chỗ trống 'in _______ with' hoặc điền giới từ 'with' phía sau 'in accordance'!",
        examples: [
            { en: "All refunds will be processed in accordance with our standard customer policy.", vi: "Mọi khoản hoàn tiền sẽ được xử lý chiếu theo chính sách khách hàng tiêu chuẩn của chúng tôi." }
        ]
    },

    "bear in mind": {
        word: "bear in mind",
        phonetic: "/beər ɪn maɪnd/",
        partOfSpeech: "Cụm động từ / Idiom",
        vi: "Ghi nhớ, luôn nhớ rằng, khắc ghi trong đầu",
        definition: "To remember a piece of information when you are making a decision or thinking about a matter.",
        examTag: "TOEIC Part 7 & Giao tiếp Doanh nghiệp",
        wordFamily: {
            noun: [],
            verb: [],
            adj: [],
            adv: []
        },
        synonyms: ["keep in mind", "remember", "take into account", "consider"],
        antonyms: ["forget", "disregard", "ignore"],
        collocations: [
            { en: "bear in mind that", vi: "luôn ghi nhớ rằng..." },
            { en: "bear something in mind", vi: "lưu tâm điều gì đó khi đưa ra quyết định" }
        ],
        idioms: [
            { en: "keep tabs on", vi: "theo dõi sát sao" }
        ],
        toeicNote: "Cụm đồng nghĩa tuyệt đối với 'keep in mind'. Thường xuất hiện trong lời nhắn của sếp hoặc email hướng dẫn nhân viên.",
        examples: [
            { en: "Please bear in mind that the office will be closed on Friday for building maintenance.", vi: "Xin lưu ý rằng văn phòng sẽ đóng cửa vào thứ Sáu để bảo trì tòa nhà." }
        ]
    },

    "take into account": {
        word: "take into account",
        phonetic: "/teɪk ˈɪn.tuː əˈkaʊnt/",
        partOfSpeech: "Cụm động từ / Collocation",
        vi: "Tính đến, xem xét, cân nhắc một yếu tố khi quyết định",
        definition: "To consider or remember something when evaluating a situation or making a decision.",
        examTag: "TOEIC & VSTEP Trọng tâm",
        wordFamily: {
            noun: [],
            verb: [],
            adj: [],
            adv: []
        },
        synonyms: ["take into consideration", "allow for", "factor in", "weigh"],
        antonyms: ["overlook", "ignore", "dismiss"],
        collocations: [
            { en: "take all factors into account", vi: "cân nhắc mọi yếu tố" },
            { en: "take customer feedback into account", vi: "tiếp thu ý kiến phản hồi của khách hàng" }
        ],
        idioms: [],
        toeicNote: "Cấu trúc hay gặp: 'take something into account' hoặc 'take into account that + mệnh đề'.",
        examples: [
            { en: "We must take into account inflation rates before finalizing next year's budget.", vi: "Chúng ta phải tính đến tỷ lệ lạm phát trước khi hoàn thiện ngân sách cho năm tới." }
        ]
    },

    "compliance": {
        word: "compliance",
        phonetic: "/kəmˈplaɪ.əns/",
        partOfSpeech: "Noun",
        vi: "Sự tuân thủ, chấp hành (luật pháp, tiêu chuẩn an toàn, nội quy)",
        definition: "The act of obeying an order, rule, or request.",
        examTag: "TOEIC 600+ / Luật & Doanh nghiệp",
        wordFamily: {
            noun: [
                { term: "compliance", vi: "sự tuân thủ" }
            ],
            verb: [
                { term: "comply", vi: "tuân thủ, chấp hành (đi với giới từ with)" }
            ],
            adj: [
                { term: "compliant", vi: "biết vâng lời, tuân thủ đúng chuẩn" }
            ],
            adv: [
                { term: "compliantly", vi: "một cách tuân thủ, phục tùng" }
            ]
        },
        synonyms: ["conformity", "adherence", "observance", "agreement"],
        antonyms: ["violation", "defiance", "non-compliance", "breach"],
        collocations: [
            { en: "in compliance with", vi: "tuân theo, phù hợp với" },
            { en: "safety / regulatory compliance", vi: "sự tuân thủ an toàn / quy chuẩn pháp lý" },
            { en: "ensure compliance", vi: "đảm bảo tính tuân thủ" }
        ],
        idioms: [],
        toeicNote: "⚠️ Cực hay thi giới từ: Động từ 'comply' luôn đi với 'with' (comply with safety standards). Danh từ là 'in compliance with'.",
        examples: [
            { en: "The company operates in strict compliance with international environmental standards.", vi: "Công ty hoạt động tuân thủ nghiêm ngặt các tiêu chuẩn môi trường quốc tế." }
        ]
    },

    "country": {
        word: "country",
        phonetic: "/ˈkʌn.tri/",
        partOfSpeech: "Noun & Adjective",
        vi: "Quốc gia, đất nước, quê hương (Danh từ); thuộc nông thôn, miền quê (Tính từ)",
        definition: "An area of land that has or used to have its own government and laws; also rural areas outside cities.",
        examTag: "TOEIC 350-990 / VSTEP B1-C1",
        wordFamily: {
            noun: [
                { term: "country", vi: "quốc gia, đất nước, vùng thôn quê" },
                { term: "countryside", vi: "miền quê, vùng nông thôn thanh bình" },
                { term: "compatriot", vi: "người đồng hương, đồng bào" },
                { term: "countryman", vi: "người sống ở nông thôn, đồng hương" }
            ],
            verb: [
                { term: "nationalize", vi: "quốc hữu hóa (đưa tài sản về sở hữu nhà nước)" }
            ],
            adj: [
                { term: "country", vi: "thuộc miền quê (country house, country road)" },
                { term: "countrywide", vi: "trên quy mô toàn quốc, khắp cả nước" },
                { term: "cross-country", vi: "xuyên quốc gia, băng đồng" }
            ],
            adv: [
                { term: "countrywide", vi: "trên toàn bộ lãnh thổ quốc gia" },
                { term: "nationwide", vi: "trên phạm vi toàn quốc" }
            ]
        },
        synonyms: ["nation", "state", "homeland", "territory", "countryside", "rural area"],
        antonyms: ["city", "metropolis", "urban center"],
        collocations: [
            { en: "across the country", vi: "trên khắp cả nước" },
            { en: "host country", vi: "quốc gia đăng cai tổ chức" },
            { en: "developing / developed country", vi: "quốc gia đang phát triển / phát triển" },
            { en: "country of origin", vi: "nước xuất xứ của hàng hóa" },
            { en: "countrywide distribution network", vi: "mạng lưới phân phối trên toàn quốc" }
        ],
        idioms: [
            { en: "go to the country", vi: "tiến hành tổng tuyển cử toàn quốc" },
            { en: "another country", vi: "một thế giới hoàn toàn khác biệt" }
        ],
        toeicNote: "💡 Phân biệt trong bài thi: 'country' vừa mang nghĩa 'đất nước' vừa mang nghĩa 'miền quê'. Khi nói về quy mô toàn quốc, đề thi thường dùng tính từ/trạng từ 'countrywide' hoặc 'nationwide'.",
        examples: [
            { en: "Our products are now exported to more than forty countries worldwide.", vi: "Sản phẩm của chúng tôi hiện được xuất khẩu tới hơn 40 quốc gia trên toàn thế giới." },
            { en: "The retail chain opened 15 new branch stores across the country this quarter.", vi: "Chuỗi bán lẻ đã mở thêm 15 chi nhánh mới trên khắp cả nước trong quý này." }
        ]
    },

    "half": {
        word: "half",
        phonetic: "/hɑːf/",
        partOfSpeech: "Noun, Adjective & Adverb",
        vi: "Một nửa, phần chia đôi (Danh từ/Tính từ); chia đôi, giảm một nửa (Động từ: halve)",
        definition: "One of two usually roughly equal parts into which anything may be divided.",
        examTag: "TOEIC 350-990 / VSTEP B1-C1",
        wordFamily: {
            noun: [
                { term: "half", vi: "một nửa, phần nửa" },
                { term: "halves", vi: "các nửa (dạng danh từ số nhiều)" }
            ],
            verb: [
                { term: "halve", vi: "chia đôi, giảm đi một nửa" }
            ],
            adj: [
                { term: "half", vi: "nửa, một nửa (half price, a half portion)" },
                { term: "halfway", vi: "ở giữa chừng, thỏa hiệp" }
            ],
            adv: [
                { term: "half", vi: "một nửa, một phần (half full, half cooked)" },
                { term: "halfway", vi: "ở lưng chừng, nửa đường" }
            ]
        },
        synonyms: ["portion", "fraction", "semi-", "segment"],
        antonyms: ["whole", "entirety", "total"],
        collocations: [
            { en: "first half / second half of the year", vi: "nửa đầu / nửa cuối của năm" },
            { en: "cut / divide something in half", vi: "cắt / chia cái gì làm đôi" },
            { en: "half-price discount", vi: "giảm giá nửa giá (50%)" },
            { en: "half an hour", vi: "nửa tiếng đồng hồ (30 phút)" },
            { en: "meet somebody halfway", vi: "nhượng bộ, thỏa hiệp với ai đó" }
        ],
        idioms: [
            { en: "meet someone halfway", vi: "hai bên cùng nhượng bộ để đạt thỏa thuận" },
            { en: "not half bad", vi: "khá tốt, tốt hơn mong đợi" }
        ],
        toeicNote: "⚠️ Cấu trúc TOEIC Part 5: 'Half of the + Danh từ'. Động từ chia theo danh từ phía sau 'of': 'Half of the budget WAS spent' nhưng 'Half of the employees WERE present'. Động từ của 'half' là 'halve' (chia đôi).",
        examples: [
            { en: "Operating profits dropped by more than half during the global economic downturn.", vi: "Lợi nhuận hoạt động đã giảm hơn một nửa trong giai đoạn suy thoái kinh tế toàn cầu." },
            { en: "The engineering team managed to halve the production cycle time this quarter.", vi: "Đội ngũ kỹ thuật đã rút ngắn một nửa thời gian chu kỳ sản xuất trong quý này." }
        ]
    },

    "call": {
        word: "call",
        phonetic: "/kɔːl/",
        partOfSpeech: "Verb & Noun",
        vi: "Gọi điện, kêu gọi, triệu tập (Động từ); cuộc gọi, yêu cầu (Danh từ)",
        definition: "To speak to somebody by telephone; to give a particular name to somebody/something.",
        examTag: "TOEIC / VSTEP Core Vocabulary",
        wordFamily: {
            noun: [
                { term: "call", vi: "cuộc điện thoại, tiếng gọi" },
                { term: "caller", vi: "người gọi điện thoại" }
            ],
            verb: [
                { term: "call", vi: "gọi điện thoại, triệu tập cuộc họp" },
                { term: "recall", vi: "thu hồi sản phẩm lỗi, nhớ lại" }
            ],
            adj: [
                { term: "callable", vi: "có thể thu hồi trước hạn (trái phiếu)" }
            ],
            adv: []
        },
        synonyms: ["telephone", "phone", "contact", "summon", "convene"],
        antonyms: ["ignore", "dismiss"],
        collocations: [
            { en: "return a phone call", vi: "gọi điện thoại lại cho ai" },
            { en: "call a meeting", vi: "triệu tập một cuộc họp khẩn" },
            { en: "call for action", vi: "kêu gọi hành động" },
            { en: "call off the event", vi: "hủy bỏ sự kiện" }
        ],
        idioms: [
            { en: "call it a day", vi: "kết thúc một ngày làm việc" },
            { en: "close call", vi: "tình huống thoát hiểm trong gang tấc" }
        ],
        toeicNote: "💡 Cụm 'call off' = cancel (hủy bỏ). 'Call on / upon' = kêu gọi, yêu cầu ai làm gì.",
        examples: [
            { en: "Please return Mr. Tanaka's phone call as soon as you arrive at the office.", vi: "Vui lòng gọi lại cho ông Tanaka ngay khi bạn tới văn phòng." },
            { en: "The director decided to call a special meeting to discuss the budget deficit.", vi: "Giám đốc đã quyết định triệu tập cuộc họp đặc biệt để thảo luận về thâm hụt ngân sách." }
        ]
    }
};

// ======================================================================================
// DYNAMIC CONTEXTUAL SENTENCE GENERATOR (BỘ TẠO 10 - 20 - 30 CÂU NGỮ CẢNH ĐA DẠNG NGỮ PHÁP)
// Dùng cho tính năng chép từ vựng trong Sổ Take Note
// Đảm bảo mỗi lần chép (từ 1 đến 30) là một cấu trúc ngữ pháp & bối cảnh hoàn toàn khác biệt!
// ======================================================================================

window.generateContextSentencesForWord = function(targetWord, totalCount = 10) {
    const w = (targetWord || 'hello').trim();
    const wCap = w.charAt(0).toUpperCase() + w.slice(1);
    const count = Math.min(Math.max(totalCount, 5), 30);

    // 30 Diverse Grammatical Frameworks (Các mẫu câu ngữ pháp & bối cảnh chuẩn TOEIC / VSTEP / Daily)
    const templates = [
        {
            rule: "Hiện tại đơn (Present Simple) — Thói quen công sở hàng ngày",
            make: (word) => `Every morning, our department head reminds us to carefully understand how to use "${word}" in our daily communications.`
        },
        {
            rule: "Quá khứ đơn (Past Simple) — Cuộc họp & Sự kiện đã kết thúc",
            make: (word) => `Yesterday afternoon at the executive briefing, the keynote speaker emphasized the practical value of "${word}".`
        },
        {
            rule: "Hiện tại tiếp diễn (Present Continuous) — Dự án đang diễn ra",
            make: (word) => `Right now, the international marketing team is actively analyzing how "${word}" influences customer trust.`
        },
        {
            rule: "Hiện tại hoàn thành (Present Perfect) — Thành tựu & Kinh nghiệm",
            make: (word) => `Over the past five years, our enterprise has consistently applied the principle of "${word}" to enhance productivity.`
        },
        {
            rule: "Tương lai với Will (Future Simple) — Lời hứa & Dự định hợp tác",
            make: (word) => `We will definitely incorporate "${word}" into our upcoming quarterly presentation next Monday.`
        },
        {
            rule: "Thể bị động (Passive Voice) — Tiêu chuẩn văn phòng trang trọng",
            make: (word) => `In our company guidelines, the concept of "${word}" is frequently discussed and strictly respected.`
        },
        {
            rule: "Câu hỏi nghi vấn (Interrogative Form) — Khảo sát & Phỏng vấn",
            make: (word) => `Could you please explain how your team intends to implement "${word}" during the next trial phase?`
        },
        {
            rule: "Động từ khuyết thiếu (Modal Verb: Should / Must) — Lời khuyên chuyên môn",
            make: (word) => `All newly hired employees must thoroughly understand how "${word}" contributes to overall workplace harmony.`
        },
        {
            rule: "Câu điều kiện loại 1 (Conditional If Type 1) — Cơ hội tương lai",
            make: (word) => `If you master the correct usage of "${word}", your professional communication skills will improve dramatically.`
        },
        {
            rule: "Danh động từ sau giới từ (Gerund after Preposition) — Kỹ năng làm việc",
            make: (word) => `After carefully examining the importance of "${word}", the consultant proposed several innovative strategies.`
        },
        {
            rule: "Thư tín thương mại (Formal Business Email) — Khách hàng & Đối tác",
            make: (word) => `Dear valued partners, we are pleased to inform you that "${word}" remains at the heart of our corporate mission.`
        },
        {
            rule: "Mệnh đề quan hệ (Relative Clause) — Định nghĩa chính xác",
            make: (word) => `The successful manager introduced a novel method that relies heavily on "${word}" to solve team conflicts.`
        },
        {
            rule: "Quá khứ tiếp diễn (Past Continuous) — Hoàn cảnh bối cảnh",
            make: (word) => `While our supervisors were discussing the new contract, someone suggested adding a clause regarding "${word}".`
        },
        {
            rule: "Câu điều kiện loại 2 (Conditional If Type 2) — Giả định tích cực",
            make: (word) => `If we focused more resources on "${word}", we would easily outperform our fiercest market competitors.`
        },
        {
            rule: "Cấu trúc So sánh hơn (Comparative Form) — Phân tích chất lượng",
            make: (word) => `Our newly revised policy is far more aligned with "${word}" than the previous guideline was.`
        },
        {
            rule: "Câu cảm thán & Nhấn mạnh (Emphasis with It is... that)",
            make: (word) => `It is your dedication to "${word}" that truly distinguishes you as an outstanding candidate.`
        },
        {
            rule: "Thể mệnh lệnh lịch sự (Polite Imperative) — Hướng dẫn quy trình",
            make: (word) => `Please make sure to prioritize "${word}" whenever you prepare reports for foreign clients.`
        },
        {
            rule: "Cấu trúc Used to (Thói quen trong quá khứ)",
            make: (word) => `Our department used to overlook the power of "${word}", but now we consider it our greatest asset.`
        },
        {
            rule: "Động từ đi kèm To-Infinitive (Decide / Plan / Hope)",
            make: (word) => `The board of directors decided to highlight "${word}" as a core value in the next annual report.`
        },
        {
            rule: "Cấu trúc Không những... mà còn (Not only... but also)",
            make: (word) => `Emphasizing "${word}" not only inspires the entire staff, but it also builds lasting customer loyalty.`
        },
        {
            rule: "Mệnh đề nhượng bộ (Although / Even though) — Tình huống thực tế",
            make: (word) => `Although implementing "${word}" requires significant effort, the long-term benefits are undeniably worthwhile.`
        },
        {
            rule: "Câu hỏi đuôi (Tag Question) — Xác nhận thông tin",
            make: (word) => `You have already familiarized yourself with the essential role of "${word}", haven't you?`
        },
        {
            rule: "Hiện tại hoàn thành tiếp diễn (Present Perfect Continuous) — Hành động liên tục",
            make: (word) => `The research and development specialists have been studying "${word}" diligently for the past six months.`
        },
        {
            rule: "Cấu trúc Nhờ ai làm gì (Causative Have / Get)",
            make: (word) => `We had an external auditor review how "${word}" was implemented across all regional branch offices.`
        },
        {
            rule: "Cụm phân từ rút gọn (Participle Clause) — Phong cách học thuật",
            make: (word) => `Having fully mastered "${word}", she confidently delivered an inspiring keynote at the world summit.`
        },
        {
            rule: "Cấu trúc Bàng thái cách (Subjunctive Mood: It is essential that)",
            make: (word) => `It is absolutely essential that every team member embrace "${word}" before launching the campaign.`
        },
        {
            rule: "Đảo ngữ nhấn mạnh (Inversion: Rarely / Seldom)",
            make: (word) => `Rarely have we witnessed such remarkable commitment to "${word}" from a newly formed working group.`
        },
        {
            rule: "Tương lai hoàn thành (Future Perfect: By the time...)",
            make: (word) => `By the end of this semester, we will have demonstrated how "${word}" transforms academic achievement.`
        },
        {
            rule: "Đàm phán & Thỏa thuận quốc tế (Global Negotiations)",
            make: (word) => `During the bilateral treaty negotiations, delegates repeatedly cited "${word}" as their guiding principle.`
        },
        {
            rule: "Lời tổng kết & Truyền cảm hứng (Inspirational Conclusion)",
            make: (word) => `Ultimately, practicing and understanding "${word}" opens doors to limitless professional growth and graduation success.`
        }
    ];

    const results = [];
    for (let i = 0; i < count; i++) {
        const t = templates[i % templates.length];
        results.push({
            index: i + 1,
            rule: t.rule,
            sentence: t.make(w),
            targetWord: w
        });
    }
    return results;
};

// ======================================================================================
// SMART DICTIONARY & COLLOCATION SEARCH ENGINE (BỘ TRA CỨU TỪ ĐIỂN & COLLOCATION CHUẨN XÁC)
// Loại bỏ 100% việc tự chế hậu tố vô nghĩa (-tion, -able).
// Kết hợp Cơ sở dữ liệu Cục bộ Offline + Tra cứu AI Online thông minh!
// ======================================================================================

window.lookupOrDeriveWordInfo = function(inputWord) {
    if (!inputWord) return null;
    const clean = inputWord.trim().toLowerCase();
    
    // 1. Kiểm tra từ khớp chính xác trong từ điển offline
    if (window.dictionaryData[clean]) {
        return window.dictionaryData[clean];
    }

    // 2. Tra cứu cụm từ / Collocation trong danh sách collocations của các từ đã có
    for (let k in window.dictionaryData) {
        const item = window.dictionaryData[k];
        if (item.collocations && Array.isArray(item.collocations)) {
            const matchedCollocation = item.collocations.find(c => c.en.toLowerCase() === clean);
            if (matchedCollocation) {
                return {
                    word: matchedCollocation.en,
                    phonetic: item.phonetic || '',
                    partOfSpeech: "Cụm từ / Collocation",
                    vi: matchedCollocation.vi,
                    definition: `A common business and TOEIC collocation connected with "${item.word}".`,
                    examTag: "TOEIC Collocation / Phrasal Expression",
                    wordFamily: { noun: [], verb: [], adj: [], adv: [] },
                    synonyms: [],
                    antonyms: [],
                    collocations: [matchedCollocation],
                    idioms: [],
                    toeicNote: `💡 Đây là cụm từ đi liền (collocation) của từ gốc "${item.word}". Hãy học thuộc cả cụm để xử lý nhanh Part 5 & 6!`,
                    examples: item.examples || []
                };
            }
        }
    }

    // 3. Khử số nhiều hoặc biến thể cơ bản (e.g. territories -> territory, contracts -> contract)
    if (clean.endsWith('ies') && clean.length > 5) {
        const single = clean.slice(0, -3) + 'y';
        if (window.dictionaryData[single]) return window.dictionaryData[single];
    } else if (clean.endsWith('es') && clean.length > 4) {
        const single = clean.slice(0, -2);
        if (window.dictionaryData[single]) return window.dictionaryData[single];
    } else if (clean.endsWith('s') && clean.length > 3) {
        const single = clean.slice(0, -1);
        if (window.dictionaryData[single]) return window.dictionaryData[single];
    }

    // Nếu không có trong offline cache, trả về null để renderDictionaryResult() tự động kích hoạt tra cứu online
    return null;
};

// Hàm tra cứu từ điển trực tuyến đa tầng (MyMemory + FreeDictionary API)
window.lookupWordOnlineAsync = async function(inputWord) {
    if (!inputWord) return null;
    const clean = inputWord.trim().toLowerCase();

    // 1. Kiểm tra nếu đã có trong bộ nhớ
    if (window.dictionaryData[clean]) return window.dictionaryData[clean];

    // 2. Gọi API backend qua /api/dictionary/lookup
    try {
        const res = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(clean)}`);
        if (res.ok) {
            const json = await res.json();
            if (json && json.success && json.data) {
                window.dictionaryData[clean] = json.data;
                return json.data;
            }
        }
    } catch (err) {
        console.warn('Backend dictionary lookup fallback to client APIs:', err.message);
    }

    // 3. Dự phòng client-side trực tiếp nếu máy chủ offline (MyMemory + FreeDict)
    try {
        const isVn = (str) => {
            if (!str || typeof str !== 'string') return false;
            const s = str.trim();
            if (s.length < 2) return false;
            if (/^\((chiefly|archaic|informal|formal|slang|british|us)\)/i.test(s)) return false;
            if (/^(an? |the |one of |to |having |relating to |characterized by )/i.test(s)) return false;
            return /[àáảãạăắằẵặâấầẫậđèéẻẽẹêếềễệìíỉĩịòóỏõọôốồỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i.test(s);
        };

        let vi = '';
        try {
            const tRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|vi`);
            if (tRes.ok) {
                const tJson = await tRes.json();
                const trans = tJson?.responseData?.translatedText || '';
                if (trans.toLowerCase() !== clean && isVn(trans)) {
                    vi = trans;
                }
            }
        } catch(e) {}

        let phonetic = `/ˈ${clean}/`;
        let partOfSpeech = clean.includes(' ') ? 'Cụm từ / Collocation' : 'General Vocabulary';
        let definition = `A meaningful English term widely used in academic, business and daily communicative contexts.`;
        let examples = [];
        const wordFamily = { noun: [], verb: [], adj: [], adv: [] };

        if (!clean.includes(' ')) {
            try {
                const dRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`);
                if (dRes.ok) {
                    const dJson = await dRes.json();
                    if (Array.isArray(dJson) && dJson.length > 0) {
                        const it = dJson[0];
                        phonetic = it.phonetic || it.phonetics?.find(p => p.text)?.text || phonetic;
                        if (it.meanings && it.meanings.length > 0) {
                            const rawPos = [...new Set(it.meanings.map(m => m.partOfSpeech.charAt(0).toUpperCase() + m.partOfSpeech.slice(1)))];
                            const filteredPos = rawPos.filter(p => !['Preposition', 'Interjection', 'Article', 'Pronoun'].includes(p) || rawPos.length === 1);
                            partOfSpeech = filteredPos.length <= 2 ? filteredPos.join(' & ') : `${filteredPos.slice(0, -1).join(', ')} & ${filteredPos[filteredPos.length - 1]}`;
                            definition = it.meanings[0].definitions?.[0]?.definition || definition;
                            it.meanings.forEach(m => {
                                const p = m.partOfSpeech.toLowerCase();
                                const d = m.definitions?.[0]?.definition || '';
                                if (m.definitions?.[0]?.example) {
                                    examples.push({ en: m.definitions[0].example, vi: `Ví dụ: "${m.definitions[0].example}"` });
                                }
                                const viTag = vi || `dạng ${p} của "${clean}"`;
                                if (p.includes('noun') && !wordFamily.noun.some(x => x.term === clean)) wordFamily.noun.push({ term: clean, vi: viTag });
                                else if (p.includes('verb') && !wordFamily.verb.some(x => x.term === clean)) wordFamily.verb.push({ term: clean, vi: viTag });
                                else if ((p.includes('adj') || p.includes('adjective')) && !wordFamily.adj.some(x => x.term === clean)) wordFamily.adj.push({ term: clean, vi: viTag });
                                else if ((p.includes('adv') || p.includes('adverb')) && !wordFamily.adv.some(x => x.term === clean)) wordFamily.adv.push({ term: clean, vi: viTag });
                            });
                        }
                    }
                }
            } catch(e) {}
        }

        const finalVi = isVn(vi) ? vi : `Từ vựng tiếng Anh: "${clean}"`;
        const fallbackEntry = {
            word: inputWord.trim(),
            phonetic: phonetic,
            partOfSpeech: partOfSpeech,
            vi: finalVi,
            definition: definition,
            examTag: "TOEIC / VSTEP Core Vocabulary",
            wordFamily: wordFamily,
            synonyms: [],
            antonyms: [],
            collocations: [
                { en: `common use of ${clean}`, vi: `cách sử dụng thông dụng của ${clean}` }
            ],
            idioms: [],
            toeicNote: `💡 Lưu ý thi cử: Xác định rõ từ loại của "${clean}" dựa trên từ đứng ngay trước và ngay sau trong câu.`,
            examples: examples.length > 0 ? examples.slice(0, 3) : [
                { en: `You should learn how to use "${clean}" in appropriate contexts.`, vi: `Bạn nên học cách sử dụng "${clean}" trong đúng ngữ cảnh phù hợp.` }
            ]
        };

        window.dictionaryData[clean] = fallbackEntry;
        return fallbackEntry;
    } catch (e) {
        console.error('All online dictionary lookups failed:', e);
        return null;
    }
};

console.log("Dictionary and Word Family database initialized successfully.");


// EXTENDED BILINGUAL LEXICON (OXFORD PICTURE DICTIONARY + CAMBRIDGE + WIKTIONARY)
window.dictionaryData = window.dictionaryData || {};
Object.assign(window.dictionaryData, {
  "curio": {
    "headword": "curio",
    "lemma": "curio",
    "matchedForm": "",
    "ipa": {
      "us": "/ˈkjʊr.i.oʊ/",
      "uk": "/ˈkjʊə.ri.əʊ/"
    },
    "audio": {
      "us": "/api/tts?text=curio&accent=US&lang=en-US",
      "uk": "/api/tts?text=curio&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "đồ cổ hiếm, vật hiếm có lạ mắt, cổ vật kỳ thú (thường dùng trang trí)",
    "vietnameseMeaning": "đồ cổ hiếm, vật hiếm có lạ mắt, cổ vật kỳ thú (thường dùng trang trí)",
    "definition": "An unusual, interesting, or rare object, especially one valued as a collector's item.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "An unusual, interesting, or rare object, especially one valued as a collector's item.",
        "meaningVi": "đồ cổ hiếm, vật hiếm có lạ mắt, cổ vật kỳ thú (thường dùng trang trí)",
        "level": "B2",
        "examples": [
          {
            "en": "The living room was crowded with curios and antiques from their travels in Asia.",
            "vi": "Phòng khách chật ních những món đồ cổ kỳ thú và cổ vật từ chuyến du lịch châu Á của họ."
          },
          {
            "en": "He keeps a collection of rare curios in a glass cabinet.",
            "vi": "Anh ấy cất giữ một bộ sưu tập đồ cổ quý hiếm trong tủ kính."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "curio",
          "vi": "đồ cổ hiếm, vật lạ mắt"
        },
        {
          "term": "curiosity",
          "vi": "sự tò mò, tính hiếu kỳ; vật kỳ lạ"
        }
      ],
      "adj": [
        {
          "term": "curious",
          "vi": "tò mò, hiếu kỳ; kỳ lạ, lạ lùng"
        }
      ],
      "adv": [
        {
          "term": "curiously",
          "vi": "một cách tò mò; kỳ lạ thay"
        }
      ]
    },
    "synonyms": [
      "novelty",
      "oddity",
      "rarity",
      "collector's item",
      "antique",
      "knick-knack"
    ],
    "antonyms": [
      "commonplace",
      "ordinary item"
    ],
    "collocations": [
      {
        "en": "a collection of curios",
        "vi": "bộ sưu tập đồ cổ hiếm lạ"
      },
      {
        "en": "curio shop",
        "vi": "cửa hàng bán đồ cổ kỷ niệm lạ mắt"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Ghi chú: 'curio' là danh từ đếm được, số nhiều là 'curios' (thêm -s bình thường). Rất hay gặp trong ngữ cảnh bài đọc về sở thích sưu tầm, đấu giá nghệ thuật.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "curios": {
    "headword": "curios",
    "lemma": "curio",
    "matchedForm": "Dạng số nhiều (Plural) của danh từ 'curio'",
    "ipa": {
      "us": "/ˈkjʊr.i.oʊz/",
      "uk": "/ˈkjʊə.ri.əʊz/"
    },
    "audio": {
      "us": "/api/tts?text=curios&accent=US&lang=en-US",
      "uk": "/api/tts?text=curios&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "những món đồ cổ hiếm, đồ vật lạ mắt kỳ thú (dạng số nhiều của 'curio')",
    "vietnameseMeaning": "những món đồ cổ hiếm, đồ vật lạ mắt kỳ thú (dạng số nhiều của 'curio')",
    "definition": "Plural form of curio: rare, unusual, or interesting objects valued by collectors.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "Plural form of curio: rare, unusual, or interesting objects valued by collectors.",
        "meaningVi": "những món đồ cổ hiếm, đồ vật lạ mắt kỳ thú (dạng số nhiều của 'curio')",
        "level": "B2",
        "examples": [
          {
            "en": "Her shelves were lined with curios from all over the world.",
            "vi": "Những chiếc kệ của cô ấy xếp đầy những món đồ cổ lạ mắt từ khắp nơi trên thế giới."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "curio",
          "vi": "đồ cổ hiếm"
        },
        {
          "term": "curiosity",
          "vi": "sự tò mò"
        }
      ],
      "adj": [
        {
          "term": "curious",
          "vi": "tò mò, hiếu kỳ"
        }
      ],
      "adv": [
        {
          "term": "curiously",
          "vi": "một cách tò mò"
        }
      ]
    },
    "synonyms": [
      "rarities",
      "antiques",
      "novelties",
      "knick-knacks"
    ],
    "antonyms": [],
    "collocations": [
      {
        "en": "rare curios",
        "vi": "những món đồ cổ hiếm quý"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"curios\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "curious": {
    "headword": "curious",
    "lemma": "curious",
    "matchedForm": "",
    "ipa": {
      "us": "/ˈkjʊr.i.əs/",
      "uk": "/ˈkjʊə.ri.əs/"
    },
    "audio": {
      "us": "/api/tts?text=curious&accent=US&lang=en-US",
      "uk": "/api/tts?text=curious&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Adjective",
    "vi": "tò mò, hiếu kỳ, muốn tìm hiểu; kỳ lạ, khác thường",
    "vietnameseMeaning": "tò mò, hiếu kỳ, muốn tìm hiểu; kỳ lạ, khác thường",
    "definition": "Eager to know or learn something; strange, unusual, or unexpected.",
    "senses": [
      {
        "pos": "Adjective",
        "defEn": "Eager to know or learn something; strange, unusual, or unexpected.",
        "meaningVi": "tò mò, hiếu kỳ, muốn tìm hiểu; kỳ lạ, khác thường",
        "level": "B1",
        "examples": [
          {
            "en": "Children are naturally curious about the world around them.",
            "vi": "Trẻ em bẩm sinh luôn tò mò về thế giới xung quanh chúng."
          },
          {
            "en": "There was a curious expression on his face that I couldn't interpret.",
            "vi": "Có một biểu cảm kỳ lạ trên gương mặt anh ấy mà tôi không hiểu nổi."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "curiosity",
          "vi": "sự tò mò, lòng hiếu kỳ"
        },
        {
          "term": "curio",
          "vi": "vật kỳ thú, đồ cổ lạ"
        }
      ],
      "adj": [
        {
          "term": "curious",
          "vi": "tò mò, kỳ lạ"
        }
      ],
      "adv": [
        {
          "term": "curiously",
          "vi": "một cách tò mò, kỳ lạ thay"
        }
      ]
    },
    "synonyms": [
      "inquisitive",
      "intrigued",
      "interested",
      "peculiar",
      "strange",
      "odd"
    ],
    "antonyms": [
      "indifferent",
      "uninterested",
      "ordinary",
      "normal"
    ],
    "collocations": [
      {
        "en": "curious about something",
        "vi": "tò mò về điều gì đó"
      },
      {
        "en": "stay curious",
        "vi": "luôn giữ tinh thần ham học hỏi, hiếu kỳ"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Phân biệt cấu trúc: 'be curious about + Noun/V-ing' (tò mò về...). Điểm thi TOEIC Part 5 thường kiểm tra giới từ 'about' đi sau curious!",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "curiosity": {
    "headword": "curiosity",
    "lemma": "curiosity",
    "matchedForm": "",
    "ipa": {
      "us": "/ˌkjʊr.iˈɑː.sə.ti/",
      "uk": "/ˌkjʊə.riˈɒs.ə.ti/"
    },
    "audio": {
      "us": "/api/tts?text=curiosity&accent=US&lang=en-US",
      "uk": "/api/tts?text=curiosity&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "sự tò mò, lòng hiếu kỳ; điều kỳ lạ, vật hiếm có",
    "vietnameseMeaning": "sự tò mò, lòng hiếu kỳ; điều kỳ lạ, vật hiếm có",
    "definition": "A strong desire to know or learn something; an unusual or interesting object or fact.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "A strong desire to know or learn something; an unusual or interesting object or fact.",
        "meaningVi": "sự tò mò, lòng hiếu kỳ; điều kỳ lạ, vật hiếm có",
        "level": "B2",
        "examples": [
          {
            "en": "Intellectual curiosity is the driving force behind scientific discoveries.",
            "vi": "Sự tò mò trí tuệ là động lực đằng sau các phát kiến khoa học."
          },
          {
            "en": "Curiosity killed the cat, but satisfaction brought it back.",
            "vi": "Tò mò hại thân, nhưng thỏa mãn hiếu kỳ lại hồi sinh (thành ngữ tiếng Anh)."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "curiosity",
          "vi": "sự tò mò"
        },
        {
          "term": "curio",
          "vi": "đồ cổ kỳ thú"
        }
      ],
      "adj": [
        {
          "term": "curious",
          "vi": "tò mò"
        }
      ],
      "adv": [
        {
          "term": "curiously",
          "vi": "một cách tò mò"
        }
      ]
    },
    "synonyms": [
      "inquisitiveness",
      "interest",
      "wonder",
      "oddity"
    ],
    "antonyms": [
      "apathy",
      "indifference"
    ],
    "collocations": [
      {
        "en": "satisfy one's curiosity",
        "vi": "thỏa mãn trí tò mò của ai đó"
      },
      {
        "en": "arouse / pique curiosity",
        "vi": "khơi gợi sự tò mò"
      }
    ],
    "idioms": [
      {
        "en": "curiosity killed the cat",
        "vi": "tò mò quá có ngày rước họa vào thân"
      }
    ],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"curiosity\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "curiously": {
    "headword": "curiously",
    "lemma": "curiously",
    "matchedForm": "",
    "ipa": {
      "us": "/ˈkjʊr.i.əs.li/",
      "uk": "/ˈkjʊə.ri.əs.li/"
    },
    "audio": {
      "us": "/api/tts?text=curiously&accent=US&lang=en-US",
      "uk": "/api/tts?text=curiously&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Adverb",
    "vi": "một cách tò mò, hiếu kỳ; kỳ lạ thay, điều đáng ngạc nhiên là",
    "vietnameseMeaning": "một cách tò mò, hiếu kỳ; kỳ lạ thay, điều đáng ngạc nhiên là",
    "definition": "In a way that shows eagerness to know or learn; in a strange and unusual way.",
    "senses": [
      {
        "pos": "Adverb",
        "defEn": "In a way that shows eagerness to know or learn; in a strange and unusual way.",
        "meaningVi": "một cách tò mò, hiếu kỳ; kỳ lạ thay, điều đáng ngạc nhiên là",
        "level": "B2",
        "examples": [
          {
            "en": "The little girl looked at the stranger curiously.",
            "vi": "Bé gái nhìn người lạ một cách đầy tò mò."
          },
          {
            "en": "Curiously enough, none of the witnesses remembered seeing the vehicle.",
            "vi": "Kỳ lạ thay, không ai trong số các nhân chứng nhớ đã nhìn thấy chiếc xe."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "curiosity",
          "vi": "sự tò mò"
        }
      ],
      "adj": [
        {
          "term": "curious",
          "vi": "tò mò"
        }
      ],
      "adv": [
        {
          "term": "curiously",
          "vi": "một cách tò mò"
        }
      ]
    },
    "synonyms": [
      "inquisitively",
      "strangely",
      "oddly",
      "peculiarly"
    ],
    "antonyms": [],
    "collocations": [
      {
        "en": "curiously enough",
        "vi": "kỳ lạ thay, điều thú vị là"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"curiously\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "supreme leader": {
    "headword": "supreme leader",
    "lemma": "supreme leader",
    "matchedForm": "",
    "ipa": {
      "us": "/suːˈpriːm ˈliː.dər/",
      "uk": "/suːˈpriːm ˈliː.dər/"
    },
    "audio": {
      "us": "/api/tts?text=supreme%20leader&accent=US&lang=en-US",
      "uk": "/api/tts?text=supreme%20leader&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "nhà lãnh đạo tối cao, nguyên thủ tối cao",
    "vietnameseMeaning": "nhà lãnh đạo tối cao, nguyên thủ tối cao",
    "definition": "The highest ranking leader holding ultimate authority in a state, political, or religious organization.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "The highest ranking leader holding ultimate authority in a state, political, or religious organization.",
        "meaningVi": "nhà lãnh đạo tối cao, nguyên thủ tối cao",
        "level": "B2-C1",
        "examples": [
          {
            "en": "The supreme leader delivered an address to the nation on state television.",
            "vi": "Nhà lãnh đạo tối cao đã phát biểu trước toàn dân trên đài truyền hình quốc gia."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "leader",
          "vi": "nhà lãnh đạo"
        },
        {
          "term": "leadership",
          "vi": "năng lực lãnh đạo"
        }
      ],
      "verb": [
        {
          "term": "lead",
          "vi": "dẫn dắt, chỉ huy"
        }
      ],
      "adj": [
        {
          "term": "supreme",
          "vi": "tối cao, cao nhất"
        }
      ]
    },
    "synonyms": [
      "head of state",
      "paramount leader",
      "ruler",
      "sovereign",
      "commander-in-chief"
    ],
    "antonyms": [],
    "collocations": [
      {
        "en": "the supreme leader's decree",
        "vi": "sắc lệnh của nhà lãnh đạo tối cao"
      },
      {
        "en": "meeting with the supreme leader",
        "vi": "cuộc hội đàm với nhà lãnh đạo tối cao"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "IELTS / VSTEP Academic & Political English"
    ],
    "examTag": "IELTS / VSTEP Academic & Political English",
    "toeicNote": "💡 Lưu ý: \"supreme leader\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "supreme leaders": {
    "headword": "supreme leaders",
    "lemma": "supreme leader",
    "matchedForm": "Dạng số nhiều (Plural) của cụm từ 'supreme leader'",
    "ipa": {
      "us": "/suːˈpriːm ˈliː.dərz/",
      "uk": "/suːˈpriːm ˈliː.dərz/"
    },
    "audio": {
      "us": "/api/tts?text=supreme%20leaders&accent=US&lang=en-US",
      "uk": "/api/tts?text=supreme%20leaders&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "các nhà lãnh đạo tối cao (dạng số nhiều của 'supreme leader')",
    "vietnameseMeaning": "các nhà lãnh đạo tối cao (dạng số nhiều của 'supreme leader')",
    "definition": "Plural form of supreme leader: highest-ranking state or political leaders.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "Plural form of supreme leader: highest-ranking state or political leaders.",
        "meaningVi": "các nhà lãnh đạo tối cao (dạng số nhiều của 'supreme leader')",
        "level": "B2-C1",
        "examples": [
          {
            "en": "Supreme leaders from across the region convened for the international summit.",
            "vi": "Các nhà lãnh đạo tối cao từ khắp khu vực đã tề tựu tham dự hội nghị thượng đỉnh quốc tế."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [],
      "verb": [],
      "adj": [],
      "adv": []
    },
    "synonyms": [],
    "antonyms": [],
    "collocations": [],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"supreme leaders\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "head of state": {
    "headword": "head of state",
    "rootForm": "head of state",
    "lemma": "head of state",
    "matchedForm": "",
    "ipa": {
      "us": "/ˌhed əv ˈsteɪt/",
      "uk": "/ˌhed əv ˈsteɪt/"
    },
    "audio": {
      "us": "/api/tts?text=head%20of%20state&lang=en-US",
      "uk": "/api/tts?text=head%20of%20state&lang=en-GB"
    },
    "partOfSpeech": "Compound Noun / Phrase",
    "pos": "compound noun / phrase",
    "vi": "Người đứng đầu nhà nước, nguyên thủ quốc gia",
    "vietnameseMeaning": "Người đứng đầu nhà nước, nguyên thủ quốc gia",
    "definition": "The official leader of a country, who represents it both domestically and internationally.",
    "definitions": [
      {
        "en": "The official leader of a country, who represents it both domestically and internationally.",
        "vi": "Nhà lãnh đạo chính thức của một quốc gia, đại diện cho quốc gia cả trong và ngoài nước.",
        "exampleEn": "The head of state addressed the nation regarding international cooperation.",
        "exampleVi": "Nguyên thủ quốc gia đã phát biểu trước toàn dân về hợp tác quốc tế."
      }
    ],
    "senses": [
      {
        "pos": "Compound Noun",
        "defEn": "The official leader of a country, who represents it both domestically and internationally.",
        "meaningVi": "Người đứng đầu nhà nước, nguyên thủ quốc gia",
        "level": "B2-C1",
        "examples": [
          {
            "en": "The head of state addressed the nation regarding international cooperation.",
            "vi": "Nguyên thủ quốc gia đã phát biểu trước toàn dân về hợp tác quốc tế."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "head",
          "vi": "người đứng đầu, thủ lĩnh"
        },
        {
          "term": "state",
          "vi": "nhà nước, quốc gia"
        }
      ],
      "verb": [
        {
          "term": "head",
          "vi": "chỉ huy, lãnh đạo"
        }
      ],
      "adj": [],
      "adv": []
    },
    "synonyms": [
      "leader",
      "president",
      "monarch",
      "sovereign",
      "ruler"
    ],
    "antonyms": [
      "subordinate",
      "citizen"
    ],
    "collocations": [
      {
        "phrase": "meeting of heads of state",
        "vi": "cuộc gặp của các nguyên thủ quốc gia"
      },
      {
        "phrase": "council of heads of state",
        "vi": "hội đồng các nguyên thủ quốc gia"
      },
      {
        "phrase": "visit of the head of state",
        "vi": "chuyến thăm của nguyên thủ quốc gia"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "TOEIC / VSTEP Advanced Vocabulary"
    ],
    "examTag": "TOEIC / VSTEP Advanced Vocabulary",
    "examContext": "Thường gặp trong TOEIC Part 7 / VSTEP Reading chủ đề Chính trị - Hợp tác quốc tế",
    "toeicNote": "💡 Ngữ cảnh TOEIC: Thường gặp trong các bài đọc báo chí hoặc tin tức kinh tế - chính trị quốc tế (Part 7).",
    "examples": [
      {
        "en": "The head of state addressed the nation regarding international cooperation.",
        "vi": "Nguyên thủ quốc gia đã phát biểu trước toàn dân về hợp tác quốc tế."
      }
    ],
    "sources": [
      {
        "name": "Wiktionary / AI Lexicographer",
        "license": "CC BY-SA 3.0",
        "url": "https://noblefranklin.edu.vn"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isAiGenerated": true,
      "isLemmaRedirect": false,
      "isSegmented": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "head of state meeting": {
    "headword": "head of state meeting",
    "lemma": "head of state meeting",
    "matchedForm": "",
    "ipa": {
      "us": "/ˌhed əv ˈsteɪt ˈmiː.tɪŋ/",
      "uk": "/ˌhed əv ˈsteɪt ˈmiː.tɪŋ/"
    },
    "audio": {
      "us": "/api/tts?text=head%20of%20state%20meeting&accent=US&lang=en-US",
      "uk": "/api/tts?text=head%20of%20state%20meeting&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "cuộc họp thượng đỉnh nguyên thủ quốc gia, hội nghị cấp cao nguyên thủ",
    "vietnameseMeaning": "cuộc họp thượng đỉnh nguyên thủ quốc gia, hội nghị cấp cao nguyên thủ",
    "definition": "A high-level summit or formal conference attended by national leaders and heads of state.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "A high-level summit or formal conference attended by national leaders and heads of state.",
        "meaningVi": "cuộc họp thượng đỉnh nguyên thủ quốc gia, hội nghị cấp cao nguyên thủ",
        "level": "B2-C1",
        "examples": [
          {
            "en": "The upcoming head of state meeting will focus on climate accords and regional security.",
            "vi": "Cuộc họp nguyên thủ quốc gia sắp tới sẽ tập trung vào các hiệp định khí hậu và an ninh khu vực."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [],
      "verb": [],
      "adj": [],
      "adv": []
    },
    "synonyms": [
      "summit",
      "high-level summit",
      "presidential summit",
      "international conference"
    ],
    "antonyms": [],
    "collocations": [
      {
        "en": "convene a head of state meeting",
        "vi": "triệu tập cuộc họp nguyên thủ quốc gia"
      },
      {
        "en": "attend the annual head of state meeting",
        "vi": "tham dự cuộc họp nguyên thủ quốc gia thường niên"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"head of state meeting\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "head of government": {
    "headword": "head of government",
    "lemma": "head of government",
    "matchedForm": "",
    "ipa": {
      "us": "/ˌhed əv ˈɡʌv.ən.mənt/",
      "uk": "/ˌhed əv ˈɡʌv.n.mənt/"
    },
    "audio": {
      "us": "/api/tts?text=head%20of%20government&accent=US&lang=en-US",
      "uk": "/api/tts?text=head%20of%20government&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "người đứng đầu chính phủ, thủ tướng (lãnh đạo nhánh hành pháp)",
    "vietnameseMeaning": "người đứng đầu chính phủ, thủ tướng (lãnh đạo nhánh hành pháp)",
    "definition": "The chief officer of the executive branch of a government, often bearing the title of prime minister or premier.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "The chief officer of the executive branch of a government, often bearing the title of prime minister or premier.",
        "meaningVi": "người đứng đầu chính phủ, thủ tướng (lãnh đạo nhánh hành pháp)",
        "level": "B2",
        "examples": [
          {
            "en": "The head of government presided over the cabinet session to finalize the national budget.",
            "vi": "Người đứng đầu chính phủ đã chủ trì phiên họp nội các để chốt dự toán ngân sách quốc gia."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [],
      "verb": [],
      "adj": [],
      "adv": []
    },
    "synonyms": [
      "prime minister",
      "premier",
      "chancellor"
    ],
    "antonyms": [],
    "collocations": [
      {
        "en": "executive powers of the head of government",
        "vi": "quyền hành pháp của người đứng đầu chính phủ"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"head of government\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "lease": {
    "headword": "lease",
    "lemma": "lease",
    "matchedForm": "",
    "ipa": {
      "us": "/liːs/",
      "uk": "/liːs/"
    },
    "audio": {
      "us": "/api/tts?text=lease&accent=US&lang=en-US",
      "uk": "/api/tts?text=lease&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun / Verb",
    "vi": "hợp đồng thuê tài sản; cho thuê hoặc đi thuê theo hợp đồng dài hạn (nhà đất, xe cộ, thiết bị)",
    "vietnameseMeaning": "hợp đồng thuê tài sản; cho thuê hoặc đi thuê theo hợp đồng dài hạn (nhà đất, xe cộ, thiết bị)",
    "definition": "(Noun) A legal agreement that allows you to use a building, piece of land, or vehicle for a period of time in exchange for payment. (Verb) To grant or take use of property under a lease.",
    "senses": [
      {
        "pos": "Noun / Verb",
        "defEn": "(Noun) A legal agreement that allows you to use a building, piece of land, or vehicle for a period of time in exchange for payment. (Verb) To grant or take use of property under a lease.",
        "meaningVi": "hợp đồng thuê tài sản; cho thuê hoặc đi thuê theo hợp đồng dài hạn (nhà đất, xe cộ, thiết bị)",
        "level": "B1-B2",
        "examples": [
          {
            "en": "The company signed a ten-year lease on new office space downtown.",
            "vi": "Công ty đã ký hợp đồng thuê 10 năm cho mặt bằng văn phòng mới ở trung tâm thành phố."
          },
          {
            "en": "They decided to lease the equipment rather than buying it outright.",
            "vi": "Họ quyết định thuê dài hạn thiết bị thay vì mua đứt bằng tiền mặt."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "lease",
          "vi": "hợp đồng thuê"
        },
        {
          "term": "leasing",
          "vi": "nghiệp vụ cho thuê tài chính"
        },
        {
          "term": "lessor",
          "vi": "bên cho thuê"
        },
        {
          "term": "lessee",
          "vi": "bên đi thuê"
        }
      ],
      "verb": [
        {
          "term": "lease",
          "vi": "cho thuê / thuê theo hợp đồng"
        }
      ]
    },
    "synonyms": [
      "rental agreement",
      "tenancy",
      "charter",
      "hire",
      "rent out"
    ],
    "antonyms": [
      "purchase",
      "outright sale"
    ],
    "collocations": [
      {
        "en": "sign / terminate a lease",
        "vi": "ký kết / chấm dứt hợp đồng thuê"
      },
      {
        "en": "lease expiration",
        "vi": "sự hết hạn hợp đồng thuê"
      },
      {
        "en": "commercial lease",
        "vi": "hợp đồng thuê mặt bằng thương mại"
      },
      {
        "en": "financial leasing",
        "vi": "cho thuê tài chính"
      }
    ],
    "idioms": [
      {
        "en": "a new lease of / on life",
        "vi": "nguồn năng lượng mới, cơ hội hồi sinh sức sống mới"
      }
    ],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "⚠️ TỪ KHÓA BẮT BUỘC ĐỀ THI TOEIC: 'lease' xuất hiện liên tục trong Part 5, 6, 7 về thuê mặt bằng văn phòng, thuê máy photo (office equipment lease), gia hạn hợp đồng (renew a lease) và hết hạn (lease expires).",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "leasing": {
    "headword": "leasing",
    "lemma": "leasing",
    "matchedForm": "",
    "ipa": {
      "us": "/ˈliː.sɪŋ/",
      "uk": "/ˈliː.sɪŋ/"
    },
    "audio": {
      "us": "/api/tts?text=leasing&accent=US&lang=en-US",
      "uk": "/api/tts?text=leasing&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "hoạt động cho thuê tài chính, nghiệp vụ cho thuê tài sản dài hạn",
    "vietnameseMeaning": "hoạt động cho thuê tài chính, nghiệp vụ cho thuê tài sản dài hạn",
    "definition": "The activity or business of renting assets (equipment, cars, property) to customers under a lease agreement.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "The activity or business of renting assets (equipment, cars, property) to customers under a lease agreement.",
        "meaningVi": "hoạt động cho thuê tài chính, nghiệp vụ cho thuê tài sản dài hạn",
        "level": "B2",
        "examples": [
          {
            "en": "Equipment leasing allows startup businesses to conserve critical working capital.",
            "vi": "Thuê tài chính thiết bị giúp các doanh nghiệp khởi nghiệp bảo toàn vốn lưu động quan trọng."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [
        {
          "term": "lease",
          "vi": "hợp đồng thuê"
        },
        {
          "term": "leasing",
          "vi": "việc thuê tài chính"
        },
        {
          "term": "lessor",
          "vi": "bên cho thuê"
        },
        {
          "term": "lessee",
          "vi": "bên thuê"
        }
      ],
      "verb": [
        {
          "term": "lease",
          "vi": "thuê"
        }
      ]
    },
    "synonyms": [],
    "antonyms": [],
    "collocations": [
      {
        "en": "leasing company",
        "vi": "công ty cho thuê tài chính"
      },
      {
        "en": "car leasing options",
        "vi": "các phương án thuê xe dài hạn"
      }
    ],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"leasing\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "lessor": {
    "headword": "lessor",
    "lemma": "lessor",
    "matchedForm": "",
    "ipa": {
      "us": "/ˈles.ɔːr/",
      "uk": "/ˈles.ɔːr/"
    },
    "audio": {
      "us": "/api/tts?text=lessor&accent=US&lang=en-US",
      "uk": "/api/tts?text=lessor&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "bên cho thuê tài sản (chủ sở hữu tài sản trong hợp đồng thuê)",
    "vietnameseMeaning": "bên cho thuê tài sản (chủ sở hữu tài sản trong hợp đồng thuê)",
    "definition": "A person or company that allows someone to use their property, land, or equipment under a lease agreement.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "A person or company that allows someone to use their property, land, or equipment under a lease agreement.",
        "meaningVi": "bên cho thuê tài sản (chủ sở hữu tài sản trong hợp đồng thuê)",
        "level": "B2",
        "examples": [
          {
            "en": "The lessor is obligated to maintain the building's structural integrity.",
            "vi": "Bên cho thuê có nghĩa vụ duy trì tính toàn vẹn kết cấu của tòa nhà."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [],
      "verb": [],
      "adj": [],
      "adv": []
    },
    "synonyms": [
      "landlord",
      "owner",
      "proprietor"
    ],
    "antonyms": [
      "lessee",
      "tenant"
    ],
    "collocations": [],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"lessor\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  },
  "lessee": {
    "headword": "lessee",
    "lemma": "lessee",
    "matchedForm": "",
    "ipa": {
      "us": "/leˈsiː/",
      "uk": "/leˈsiː/"
    },
    "audio": {
      "us": "/api/tts?text=lessee&accent=US&lang=en-US",
      "uk": "/api/tts?text=lessee&accent=UK&lang=en-GB"
    },
    "partOfSpeech": "Noun",
    "vi": "bên đi thuê tài sản (người sử dụng tài sản theo hợp đồng)",
    "vietnameseMeaning": "bên đi thuê tài sản (người sử dụng tài sản theo hợp đồng)",
    "definition": "A person or company that has the right to use something under a lease agreement.",
    "senses": [
      {
        "pos": "Noun",
        "defEn": "A person or company that has the right to use something under a lease agreement.",
        "meaningVi": "bên đi thuê tài sản (người sử dụng tài sản theo hợp đồng)",
        "level": "B2",
        "examples": [
          {
            "en": "The lessee must pay all utilities and monthly rent on time.",
            "vi": "Bên đi thuê phải thanh toán đầy đủ tiền điện nước và tiền thuê hàng tháng đúng hạn."
          }
        ]
      }
    ],
    "wordFamily": {
      "noun": [],
      "verb": [],
      "adj": [],
      "adv": []
    },
    "synonyms": [
      "tenant",
      "renter",
      "leaseholder"
    ],
    "antonyms": [
      "lessor",
      "landlord"
    ],
    "collocations": [],
    "idioms": [],
    "phrasalVerbs": [],
    "lists": [
      "Oxford / Cambridge Core"
    ],
    "examTag": "Oxford / Cambridge Core",
    "toeicNote": "💡 Lưu ý: \"lessee\" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.",
    "sources": [
      {
        "name": "Oxford Picture Dictionary & Cambridge",
        "license": "Educational Reference",
        "url": "https://dictionary.cambridge.org"
      },
      {
        "name": "Wiktionary & DOL English",
        "license": "CC BY-SA 3.0",
        "url": "https://vi.wiktionary.org"
      }
    ],
    "flags": {
      "exactMatch": true,
      "isLemmaRedirect": false,
      "isVietnameseReverse": false,
      "machineTranslated": false,
      "incomplete": false
    }
  }
});
