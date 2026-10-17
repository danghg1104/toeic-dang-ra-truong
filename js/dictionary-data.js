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
// MORPHOLOGICAL EXPANDER ENGINE (BỘ BÓC TÁCH & PHÁT HIỆN HỌ TỪ THÔNG MINH CHO MỌI TỪ TIẾNG ANH)
// Nếu người dùng nhập một từ chưa có trong danh mục cố định, hệ thống tự động suy luận:
// Danh từ, Động từ, Tính từ, Trạng từ, Đồng nghĩa, và Phát âm gần đúng!
// ======================================================================================

window.lookupOrDeriveWordInfo = function(inputWord) {
    if (!inputWord) return null;
    const clean = inputWord.trim().toLowerCase();
    
    // Check if directly in static database
    if (window.dictionaryData[clean]) {
        return window.dictionaryData[clean];
    }

    // Check fuzzy match in dictionary
    for (let k in window.dictionaryData) {
        if (clean.includes(k) || k.includes(clean)) {
            return window.dictionaryData[k];
        }
    }

    // Algorithmic Morphological Inflection Derivation
    let root = clean;
    if (root.endsWith('ing') && root.length > 5) root = root.slice(0, -3);
    else if (root.endsWith('tion') && root.length > 6) root = root.slice(0, -4);
    else if (root.endsWith('ment') && root.length > 6) root = root.slice(0, -4);
    else if (root.endsWith('ly') && root.length > 4) root = root.slice(0, -2);
    else if (root.endsWith('ed') && root.length > 4) root = root.slice(0, -2);

    const derivedNoun = root.endsWith('e') ? root + 'ment' : root + 'tion';
    const derivedVerb = root;
    const derivedAdj = root.endsWith('e') ? root.slice(0, -1) + 'ive' : root + 'able';
    const derivedAdv = derivedAdj + 'ly';

    return {
        word: clean,
        phonetic: `/ˈ${clean}/`,
        partOfSpeech: "General Vocabulary",
        vi: `Từ vựng tiếng Anh: "${clean}"`,
        definition: `A meaningful English term widely used in academic, business and daily communicative contexts.`,
        examTag: "TOEIC / VSTEP Vocabulary",
        wordFamily: {
            noun: [
                { term: derivedNoun, vi: `dạng danh từ liên quan (${derivedNoun})` },
                { term: clean + 'ness', vi: `tính chất, sự việc (${clean}ness)` }
            ],
            verb: [
                { term: derivedVerb, vi: `dạng động từ hành động (${derivedVerb})` }
            ],
            adj: [
                { term: derivedAdj, vi: `dạng tính từ đặc tính (${derivedAdj})` },
                { term: clean, vi: `thuộc về ${clean}` }
            ],
            adv: [
                { term: derivedAdv, vi: `dạng trạng từ bổ nghĩa (${derivedAdv})` }
            ]
        },
        synonyms: [`vital ${clean}`, `essential`, `appropriate`, `notable`, `significant`],
        antonyms: [`unrelated`, `opposite`, `ineffective`],
        collocations: [
            { en: `apply ${clean} in practice`, vi: `áp dụng ${clean} vào thực tế` },
            { en: `a key ${clean} factor`, vi: `yếu tố ${clean} then chốt` },
            { en: `enhance and improve ${clean}`, vi: `nâng cao và cải thiện ${clean}` },
            { en: `modern ${clean} approach`, vi: `cách tiếp cận ${clean} hiện đại` }
        ],
        idioms: [
            { en: `make the most of ${clean}`, vi: `tận dụng tối đa giá trị của ${clean}` },
            { en: `pay close attention to ${clean}`, vi: `chú ý đặc biệt đến ${clean}` }
        ],
        toeicNote: `💡 Gợi ý học từ: Khi gặp "${clean}" trong đề thi TOEIC/VSTEP, hãy chú ý vị trí đứng trước danh từ (cần Tính từ) hoặc sau giới từ (cần Danh từ hoặc V-ing).`,
        examples: [
            { en: `Understanding the essence of "${clean}" is crucial for your professional career.`, vi: `Hiểu rõ bản chất của "${clean}" là điều cốt yếu cho sự nghiệp của bạn.` },
            { en: `She demonstrated how "${clean}" can be leveraged to solve complex problems.`, vi: `Cô ấy đã chứng minh cách áp dụng "${clean}" để giải quyết các vấn đề phức tạp.` }
        ]
    };
};

console.log("Dictionary and Word Family database initialized successfully.");
