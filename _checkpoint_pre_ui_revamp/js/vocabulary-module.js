/**
 * =========================================================================
 * MODULE HỌC & LUYỆN TẬP TỪ VỰNG CHUYÊN SÂU (EDTECH STANDARD)
 * Thương hiệu: "Cùng Đăng ra trường"
 * Kiến trúc theo chuẩn EdTech hiện đại & PassToeic.vn
 * 
 * Màn hình 1: Trung tâm Từ vựng & Phân tầng cấp độ (/vocabulary)
 * Màn hình 2: Không gian học sâu toàn màn hình (/vocabulary/[topic-slug]/study)
 * Màn hình 3: Đấu trường ghép cụm từ & Collocation Gamified (/vocabulary/match)
 * =========================================================================
 */

(function () {
    'use strict';

    // 1. DATA REPOSITORY: 12 TỪ VỰNG CHUYÊN SÂU CHỦ ĐỀ CONTRACTS
    const contractsRichWords = [
        {
            id: 'contracts-1',
            topicSlug: 'contracts',
            word: 'abide by',
            type: 'PHRASE',
            ipaUS: '/əˈbaɪd baɪ/',
            ipaUK: '/əˈbaɪd baɪ/',
            vietnameseMeaning: 'tuân thủ, tuân theo',
            englishDefinition: 'To accept and follow a rule, decision, agreement, or law.',
            level: '600+',
            examples: [
                {
                    en: 'All employees must abide by the terms of the contract.',
                    vi: 'Tất cả nhân viên phải tuân thủ các điều khoản của hợp đồng.'
                },
                {
                    en: 'Players who do not abide by the rules will be disqualified.',
                    vi: 'Người chơi không tuân thủ luật sẽ bị loại.'
                }
            ],
            collocations: [
                { phrase: 'abide by the rules', meaning: 'tuân thủ luật lệ' },
                { phrase: 'abide by the terms', meaning: 'tuân thủ các điều khoản' },
                { phrase: 'abide by the agreement', meaning: 'tuân thủ thỏa thuận' }
            ],
            synonyms: ['comply with', 'obey', 'adhere to', 'conform to'],
            antonyms: ['violate', 'disregard', 'breach'],
            wordFamily: [
                { word: 'abide', pos: 'verb', meaning: 'chịu đựng, tuân theo' },
                { word: 'abiding', pos: 'adjective', meaning: 'lâu dài, bền vững' }
            ],
            trapAndMistake: {
                incorrect: 'All employees must abide the safety rules in the contract.',
                correct: 'All employees must abide by the safety rules in the contract.',
                explanation: 'Abide by là cụm động từ cố định. Khi mang nghĩa tuân thủ, bắt buộc phải có giới từ "by"; không dùng "abide" trực tiếp với tân ngữ.'
            },
            memoryHook: "Mẹo nhớ: 'Abide by' = đi 'by' (cạnh) luật mà sống, tức luôn đi cùng và tuân theo luật.",
            tags: ['#contracts', '#legal', '#toeic'],
            quiz: {
                question: 'Both corporate parties agreed to _______ the safety stipulations outlined in the operational lease.',
                options: [
                    { key: 'A', text: 'abide with', isCorrect: false, explanation: 'Sai. Không có cụm "abide with" mang nghĩa tuân thủ.' },
                    { key: 'B', text: 'abide by', isCorrect: true, explanation: 'Chính xác. Cụm động từ cố định "abide by + N" mang nghĩa tuân thủ quy định/điều khoản.' },
                    { key: 'C', text: 'abiding to', isCorrect: false, explanation: 'Sai về giới từ và sau "to" cần động từ nguyên mẫu.' },
                    { key: 'D', text: 'abide on', isCorrect: false, explanation: 'Sai giới từ.' }
                ]
            },
            dictationHint: 'a _ _ _ e   b _'
        },
        {
            id: 'contracts-2',
            topicSlug: 'contracts',
            word: 'agreement',
            type: 'NOUN',
            ipaUS: '/əˈɡriːmənt/',
            ipaUK: '/əˈɡriːmənt/',
            vietnameseMeaning: 'hợp đồng, sự thỏa thuận',
            englishDefinition: 'A negotiated and typically legally binding arrangement between two or more parties.',
            level: '600+',
            examples: [
                {
                    en: 'The signed agreement legally binds the supplier to deliver the goods by next Friday.',
                    vi: 'Hợp đồng đã ký kết ràng buộc pháp lý nhà cung cấp phải giao hàng trước thứ Sáu tới.'
                },
                {
                    en: 'Both sides reached an amicable agreement after two weeks of intensive discussions.',
                    vi: 'Cả hai bên đã đạt được thỏa thuận hữu hảo sau hai tuần đàm phán căng thẳng.'
                }
            ],
            collocations: [
                { phrase: 'reach an agreement', meaning: 'đạt được thỏa thuận' },
                { phrase: 'signed agreement', meaning: 'hợp đồng đã ký kết' },
                { phrase: 'terms of the agreement', meaning: 'các điều khoản của thỏa thuận' }
            ],
            synonyms: ['contract', 'accord', 'treaty', 'settlement'],
            antonyms: ['disagreement', 'dispute', 'breach'],
            wordFamily: [
                { word: 'agree', pos: 'verb', meaning: 'đồng ý, tán thành' },
                { word: 'agreeable', pos: 'adjective', meaning: 'dễ chịu, có thể đồng ý được' }
            ],
            trapAndMistake: {
                incorrect: 'We have reached an agree on the pricing structure.',
                correct: 'We have reached an agreement on the pricing structure.',
                explanation: 'Sau mạo từ "an" và tính từ bắt buộc phải là một Danh từ (agreement), không được dùng Động từ (agree).'
            },
            memoryHook: "Gốc 'agree' (đồng ý) + hậu tố '-ment' (danh từ) = bản văn ghi nhận sự đồng thuận đôi bên.",
            tags: ['#contracts', '#business', '#toeic'],
            quiz: {
                question: 'Representatives from both firms finally reached a formal _______ regarding international distribution rights.',
                options: [
                    { key: 'A', text: 'agree', isCorrect: false, explanation: 'Sai. "agree" là động từ.' },
                    { key: 'B', text: 'agreeable', isCorrect: false, explanation: 'Sai. "agreeable" là tính từ.' },
                    { key: 'C', text: 'agreement', isCorrect: true, explanation: 'Chính xác. Sau tính từ "formal" cần danh từ "agreement" làm tân ngữ cho "reached".' },
                    { key: 'D', text: 'agreeably', isCorrect: false, explanation: 'Sai. "agreeably" là trạng từ.' }
                ]
            },
            dictationHint: 'a _ _ _ _ _ _ _ t'
        },
        {
            id: 'contracts-3',
            topicSlug: 'contracts',
            word: 'assurance',
            type: 'NOUN',
            ipaUS: '/əˈʃʊrəns/',
            ipaUK: '/əˈʃɔːrəns/',
            vietnameseMeaning: 'sự cam đoan, sự bảo đảm chắc chắn',
            englishDefinition: 'A positive declaration intended to give confidence; a promise.',
            level: '600+',
            examples: [
                {
                    en: 'The sales director gave his assurance that any defective products would be replaced free of charge.',
                    vi: 'Giám đốc kinh doanh đã cam đoan rằng mọi sản phẩm bị lỗi sẽ được đổi mới miễn phí.'
                },
                {
                    en: 'Clients require firm assurance regarding cloud data confidentiality.',
                    vi: 'Khách hàng đòi hỏi sự đảm bảo chắc chắn về tính bảo mật của dữ liệu đám mây.'
                }
            ],
            collocations: [
                { phrase: 'give an assurance', meaning: 'đưa ra lời cam đoan' },
                { phrase: 'quality assurance', meaning: 'đảm bảo chất lượng (QA)' },
                { phrase: 'verbal assurance', meaning: 'lời cam đoan miệng' }
            ],
            synonyms: ['guarantee', 'pledge', 'warranty', 'promise'],
            antonyms: ['uncertainty', 'doubt', 'denial'],
            wordFamily: [
                { word: 'assure', pos: 'verb', meaning: 'cam đoan, trấn an' },
                { word: 'assured', pos: 'adjective', meaning: 'tự tin, chắc chắn' }
            ],
            trapAndMistake: {
                incorrect: 'The project manager assurance the client that the deadline would be met.',
                correct: 'The project manager assured the client that the deadline would be met.',
                explanation: 'Sau chủ ngữ "The project manager" cần động từ chia thì quá khứ "assured", không dùng danh từ "assurance".'
            },
            memoryHook: "Gốc 'sure' (chắc chắn) -> 'as-sure-ance' là lời cam kết làm cho đối tác yên tâm tuyệt đối.",
            tags: ['#contracts', '#customer', '#toeic'],
            quiz: {
                question: 'The prospective buyer requested written _______ that the machinery had passed all safety evaluations.',
                options: [
                    { key: 'A', text: 'assure', isCorrect: false, explanation: 'Sai. "assure" là động từ.' },
                    { key: 'B', text: 'assurance', isCorrect: true, explanation: 'Chính xác. Sau tính từ "written", vị trí chỗ trống cần danh từ "assurance".' },
                    { key: 'C', text: 'assuredly', isCorrect: false, explanation: 'Sai. "assuredly" là trạng từ.' },
                    { key: 'D', text: 'assuring', isCorrect: false, explanation: 'Sai ngữ pháp.' }
                ]
            },
            dictationHint: 'a _ _ _ _ _ _ _ e'
        },
        {
            id: 'contracts-4',
            topicSlug: 'contracts',
            word: 'cancellation',
            type: 'NOUN',
            ipaUS: '/ˌkænsəˈleɪʃn/',
            ipaUK: '/ˌkænsəˈleɪʃn/',
            vietnameseMeaning: 'sự hủy bỏ, bãi bỏ hợp đồng',
            englishDefinition: 'The action of canceling something, or a decision that an agreement will not lead to fulfillment.',
            level: '600+',
            examples: [
                {
                    en: 'Any cancellation made less than 24 hours in advance will incur a 20 percent penalty fee.',
                    vi: 'Bất kỳ sự hủy bỏ nào thực hiện trước dưới 24 giờ sẽ chịu phí phạt 20 phần trăm.'
                },
                {
                    en: 'The airline announced the cancellation of all transatlantic flights due to severe weather.',
                    vi: 'Hãng hàng không thông báo hủy toàn bộ các chuyến bay xuyên Đại Tây Dương do thời tiết xấu.'
                }
            ],
            collocations: [
                { phrase: 'cancellation policy', meaning: 'chính sách hủy dịch vụ' },
                { phrase: 'notice of cancellation', meaning: 'thông báo hủy hợp đồng' },
                { phrase: 'last-minute cancellation', meaning: 'hủy vào phút chót' }
            ],
            synonyms: ['annulment', 'termination', 'revocation', 'invalidation'],
            antonyms: ['confirmation', 'renewal', 'validation'],
            wordFamily: [
                { word: 'cancel', pos: 'verb', meaning: 'hủy bỏ, bãi bỏ' },
                { word: 'canceled', pos: 'adjective', meaning: 'đã bị hủy' }
            ],
            trapAndMistake: {
                incorrect: 'Due to the sudden cancel, the venue was left empty.',
                correct: 'Due to the sudden cancellation, the venue was left empty.',
                explanation: 'Sau tính từ "sudden" cần danh từ "cancellation", không dùng động từ "cancel".'
            },
            memoryHook: "Động từ 'cancel' quen thuộc + đuôi '-ation' tạo thành danh từ chỉ sự hủy bỏ chính thức.",
            tags: ['#contracts', '#policy', '#toeic'],
            quiz: {
                question: 'Please review our corporate _______ policy before submitting your official hotel booking.',
                options: [
                    { key: 'A', text: 'cancel', isCorrect: false, explanation: 'Sai từ loại.' },
                    { key: 'B', text: 'canceling', isCorrect: false, explanation: 'Sai ngữ cảnh.' },
                    { key: 'C', text: 'cancellation', isCorrect: true, explanation: 'Chính xác. Cụm danh từ ghép "cancellation policy" (chính sách hủy).' },
                    { key: 'D', text: 'canceled', isCorrect: false, explanation: 'Sai ngữ pháp.' }
                ]
            },
            dictationHint: 'c _ _ _ _ _ _ _ _ _ _ n'
        },
        {
            id: 'contracts-5',
            topicSlug: 'contracts',
            word: 'determine',
            type: 'VERB',
            ipaUS: '/dɪˈtɜːrmɪn/',
            ipaUK: '/dɪˈtɜːmɪn/',
            vietnameseMeaning: 'xác định, quyết định, định đoạt',
            englishDefinition: 'To discover the facts about something or to calculate what is true or necessary.',
            level: '600+',
            examples: [
                {
                    en: 'The market research team conducted surveys to determine customer interest in the new model.',
                    vi: 'Đội ngũ nghiên cứu thị trường đã tiến hành khảo sát để xác định mức độ quan tâm của khách hàng đối với mẫu sản phẩm mới.'
                },
                {
                    en: 'The audit will determine whether expenditures were compliant with federal grant guidelines.',
                    vi: 'Cuộc kiểm toán sẽ xác định xem các khoản chi tiêu có tuân thủ hướng dẫn trợ cấp liên bang hay không.'
                }
            ],
            collocations: [
                { phrase: 'determine the cause', meaning: 'xác định nguyên nhân' },
                { phrase: 'determine feasibility', meaning: 'xác định tính khả thi' },
                { phrase: 'determine market demand', meaning: 'xác định nhu cầu thị trường' }
            ],
            synonyms: ['ascertain', 'identify', 'establish', 'calculate'],
            antonyms: ['overlook', 'ignore', 'hesitate'],
            wordFamily: [
                { word: 'determination', pos: 'noun', meaning: 'sự quyết tâm, sự xác định' },
                { word: 'determined', pos: 'adjective', meaning: 'quyết đoán, kiên quyết' }
            ],
            trapAndMistake: {
                incorrect: 'The committee met to determination the annual budget allocation.',
                correct: 'The committee met to determine the annual budget allocation.',
                explanation: 'Sau "to" chỉ mục đích cần một Động từ nguyên mẫu (determine), không dùng Danh từ (determination).'
            },
            memoryHook: "Phát âm /dɪˈtɜːmɪn/ chứ không đọc /maɪn/. Nghĩa là tìm ra sự thật hoặc quyết định dứt khoát.",
            tags: ['#contracts', '#business', '#toeic'],
            quiz: {
                question: 'Engineers are inspecting the production machinery to _______ the exact source of the malfunction.',
                options: [
                    { key: 'A', text: 'determine', isCorrect: true, explanation: 'Chính xác. Sau "to" cần động từ nguyên mẫu chỉ mục đích (to determine).' },
                    { key: 'B', text: 'determination', isCorrect: false, explanation: 'Sai. Đây là danh từ.' },
                    { key: 'C', text: 'determined', isCorrect: false, explanation: 'Sai. Đây là dạng quá khứ/tính từ.' },
                    { key: 'D', text: 'determines', isCorrect: false, explanation: 'Sai. Động từ không chia sau "to".' }
                ]
            },
            dictationHint: 'd _ _ _ _ _ _ _ e'
        },
        {
            id: 'contracts-6',
            topicSlug: 'contracts',
            word: 'engage',
            type: 'VERB',
            ipaUS: '/ɪnˈɡeɪdʒ/',
            ipaUK: '/ɪnˈɡeɪdʒ/',
            vietnameseMeaning: 'thuê, tuyển dụng; tham gia vào',
            englishDefinition: 'To employ someone, or to participate and become involved in an activity.',
            level: '600+',
            examples: [
                {
                    en: 'The enterprise decided to engage a specialized consulting firm to optimize its logistics chain.',
                    vi: 'Doanh nghiệp đã quyết định thuê một công ty tư vấn chuyên trách để tối ưu hóa chuỗi cung ứng.'
                },
                {
                    en: 'Both corporate leaders agreed to engage in further bilateral trade discussions.',
                    vi: 'Cả hai nhà lãnh đạo doanh nghiệp đã đồng ý tham gia vào các cuộc đàm phán thương mại song phương tiếp theo.'
                }
            ],
            collocations: [
                { phrase: 'engage the services of', meaning: 'thuê dịch vụ của ai đó' },
                { phrase: 'engage in negotiations', meaning: 'tham gia đàm phán' },
                { phrase: 'engage customer interest', meaning: 'thu hút sự quan tâm của khách hàng' }
            ],
            synonyms: ['hire', 'employ', 'involve', 'participate'],
            antonyms: ['dismiss', 'discharge', 'withdraw'],
            wordFamily: [
                { word: 'engagement', pos: 'noun', meaning: 'sự tham gia, cuộc hẹn, cam kết' },
                { word: 'engaging', pos: 'adjective', meaning: 'lôi cuốn, thu hút' }
            ],
            trapAndMistake: {
                incorrect: 'The law firm refused to engage into illegal business practices.',
                correct: 'The law firm refused to engage in illegal business practices.',
                explanation: 'Cụm từ đúng là "engage in" (tham gia vào), không dùng "engage into".'
            },
            memoryHook: "Trong ngữ cảnh TOEIC, 'engage' thường có nghĩa là thuê dịch vụ (hire a consultant) hoặc 'engage in' (tham gia vào).",
            tags: ['#contracts', '#hr', '#toeic'],
            quiz: {
                question: 'The board voted to _______ an external auditing team to verify the quarterly earnings figures.',
                options: [
                    { key: 'A', text: 'engage', isCorrect: true, explanation: 'Chính xác. "engage + an external auditing team" mang nghĩa thuê một đội ngũ kiểm toán độc lập.' },
                    { key: 'B', text: 'engagement', isCorrect: false, explanation: 'Sai. Đây là danh từ.' },
                    { key: 'C', text: 'engaged', isCorrect: false, explanation: 'Sai thì.' },
                    { key: 'D', text: 'engagingly', isCorrect: false, explanation: 'Sai. Đây là trạng từ.' }
                ]
            },
            dictationHint: 'e _ _ _ _ e'
        },
        {
            id: 'contracts-7',
            topicSlug: 'contracts',
            word: 'establish',
            type: 'VERB',
            ipaUS: '/ɪˈstæblɪʃ/',
            ipaUK: '/ɪˈstæblɪʃ/',
            vietnameseMeaning: 'thiết lập, thành lập, khẳng định vị thế',
            englishDefinition: 'To set up an organization, system, or set of rules on a firm or permanent basis.',
            level: '600+',
            examples: [
                {
                    en: 'The corporation aims to establish strong strategic partnerships across Southeast Asian markets.',
                    vi: 'Tập đoàn hướng đến việc thiết lập các mối quan hệ đối tác chiến lược vững chắc trên khắp thị trường Đông Nam Á.'
                },
                {
                    en: 'The startup quickly established a reputation for exceptional customer support.',
                    vi: 'Công ty khởi nghiệp nhanh chóng khẳng định uy tín về dịch vụ chăm sóc khách hàng xuất sắc.'
                }
            ],
            collocations: [
                { phrase: 'establish a partnership', meaning: 'thiết lập quan hệ đối tác' },
                { phrase: 'establish guidelines', meaning: 'ban hành các hướng dẫn' },
                { phrase: 'establish credibility', meaning: 'khẳng định uy tín, lòng tin' }
            ],
            synonyms: ['set up', 'found', 'institute', 'create'],
            antonyms: ['dissolve', 'dismantle', 'destroy'],
            wordFamily: [
                { word: 'establishment', pos: 'noun', meaning: 'sự thành lập, cơ sở kinh doanh' },
                { word: 'established', pos: 'adjective', meaning: 'đã có uy tín lâu năm' }
            ],
            trapAndMistake: {
                incorrect: 'The two banks agreed to establishment a joint venture.',
                correct: 'The two banks agreed to establish a joint venture.',
                explanation: 'Sau "agree to" cần Động từ nguyên mẫu (establish), không dùng Danh từ (establishment).'
            },
            memoryHook: "Establish a company = set up a company. Nhớ đuôi '-ish' là động từ thiết lập.",
            tags: ['#contracts', '#business', '#toeic'],
            quiz: {
                question: 'The committee plans to _______ clearer performance benchmarks for remote employees next month.',
                options: [
                    { key: 'A', text: 'establish', isCorrect: true, explanation: 'Chính xác. Sau "plans to" cần động từ nguyên mẫu "establish".' },
                    { key: 'B', text: 'establishment', isCorrect: false, explanation: 'Sai từ loại (danh từ).' },
                    { key: 'C', text: 'established', isCorrect: false, explanation: 'Sai thì.' },
                    { key: 'D', text: 'establishing', isCorrect: false, explanation: 'Sai dạng V-ing.' }
                ]
            },
            dictationHint: 'e _ _ _ _ _ _ _ h'
        },
        {
            id: 'contracts-8',
            topicSlug: 'contracts',
            word: 'obligate',
            type: 'VERB',
            ipaUS: '/ˈɑːblɪɡeɪt/',
            ipaUK: '/ˈɒblɪɡeɪt/',
            vietnameseMeaning: 'bắt buộc, ép buộc về mặt pháp lý',
            englishDefinition: 'To bind legally or morally; to constrain by contractual necessity.',
            level: '600+',
            examples: [
                {
                    en: 'The confidentiality clause obligates all team members not to disclose source code to competitors.',
                    vi: 'Điều khoản bảo mật bắt buộc toàn bộ thành viên trong đội ngũ không được tiết lộ mã nguồn cho đối thủ cạnh tranh.'
                },
                {
                    en: 'Neither company is obligated to proceed with the transaction until final signatures are gathered.',
                    vi: 'Không công ty nào bị bắt buộc phải tiến hành giao dịch cho đến khi thu thập đủ chữ ký cuối cùng.'
                }
            ],
            collocations: [
                { phrase: 'be obligated to do sth', meaning: 'bắt buộc phải làm gì' },
                { phrase: 'contractual obligation', meaning: 'nghĩa vụ theo hợp đồng' },
                { phrase: 'legal obligation', meaning: 'nghĩa vụ pháp lý' }
            ],
            synonyms: ['bind', 'require', 'compel', 'mandate'],
            antonyms: ['release', 'exempt', 'free'],
            wordFamily: [
                { word: 'obligation', pos: 'noun', meaning: 'nghĩa vụ, bổn phận' },
                { word: 'obligatory', pos: 'adjective', meaning: 'bắt buộc, cưỡng bách' }
            ],
            trapAndMistake: {
                incorrect: 'Under the agreement, contractors are obligated to completing the inspection.',
                correct: 'Under the agreement, contractors are obligated to complete the inspection.',
                explanation: 'Cấu trúc cố định là: be obligated to + V nguyên mẫu (to complete), không đi với V-ing.'
            },
            memoryHook: "Obligate = bắt buộc theo luật. Danh từ hay gặp trong Part 7 là 'obligation' (nghĩa vụ hợp đồng).",
            tags: ['#contracts', '#legal', '#toeic'],
            quiz: {
                question: 'The vendor is contractually _______ to deliver replacement spare parts within forty-eight hours.',
                options: [
                    { key: 'A', text: 'obligate', isCorrect: false, explanation: 'Sai. Cần phân từ bị động.' },
                    { key: 'B', text: 'obligation', isCorrect: false, explanation: 'Sai. Đây là danh từ.' },
                    { key: 'C', text: 'obligated', isCorrect: true, explanation: 'Chính xác. Cấu trúc bị động "is contractually obligated to + V" (có nghĩa vụ phải...).' },
                    { key: 'D', text: 'obligates', isCorrect: false, explanation: 'Sai thể bị động.' }
                ]
            },
            dictationHint: 'o _ _ _ _ _ _ e'
        },
        {
            id: 'contracts-9',
            topicSlug: 'contracts',
            word: 'party',
            type: 'NOUN',
            ipaUS: '/ˈpɑːrti/',
            ipaUK: '/ˈpɑːti/',
            vietnameseMeaning: 'bên tham gia ký kết hợp đồng, đương sự',
            englishDefinition: 'A person or group taking part in an agreement, negotiation, or legal proceeding.',
            level: '600+',
            examples: [
                {
                    en: 'Neither party shall be held liable for shipment delays resulting from natural disasters.',
                    vi: 'Không bên nào phải chịu trách nhiệm pháp lý đối với việc giao hàng chậm trễ do thiên tai.'
                },
                {
                    en: 'The contract must be signed by both parties in the presence of a certified notary.',
                    vi: 'Hợp đồng phải được cả hai bên ký kết trước sự chứng kiến của công chứng viên được chứng nhận.'
                }
            ],
            collocations: [
                { phrase: 'contracting party', meaning: 'bên ký kết hợp đồng' },
                { phrase: 'third party', meaning: 'bên thứ ba' },
                { phrase: 'both parties', meaning: 'cả hai bên' }
            ],
            synonyms: ['signatory', 'participant', 'entity', 'stakeholder'],
            antonyms: ['outsider', 'non-participant'],
            wordFamily: [
                { word: 'bipartite', pos: 'adjective', meaning: 'hai bên, song phương' },
                { word: 'tripartite', pos: 'adjective', meaning: 'ba bên, tam phương' }
            ],
            trapAndMistake: {
                incorrect: 'The third part will inspect the building before handover.',
                correct: 'The third party will inspect the building before handover.',
                explanation: 'Thuật ngữ pháp lý đúng là "third party" (bên thứ ba), không dùng "third part".'
            },
            memoryHook: "Trong đề thi TOEIC, 95% 'party' không phải bữa tiệc, mà là Bên ký hợp đồng (Party A, Party B).",
            tags: ['#contracts', '#legal', '#toeic'],
            quiz: {
                question: 'If either _______ fails to fulfill its contractual duties, the agreement shall be rendered void.',
                options: [
                    { key: 'A', text: 'party', isCorrect: true, explanation: 'Chính xác. "either party" (bất kỳ bên nào trong hợp đồng).' },
                    { key: 'B', text: 'parties', isCorrect: false, explanation: 'Sai. "either" đi với danh từ số ít.' },
                    { key: 'C', text: 'partially', isCorrect: false, explanation: 'Sai. "partially" là trạng từ.' },
                    { key: 'D', text: 'parted', isCorrect: false, explanation: 'Sai từ loại.' }
                ]
            },
            dictationHint: 'p _ _ _ y'
        },
        {
            id: 'contracts-10',
            topicSlug: 'contracts',
            word: 'provision',
            type: 'NOUN',
            ipaUS: '/prəˈvɪʒn/',
            ipaUK: '/prəˈvɪʒn/',
            vietnameseMeaning: 'điều khoản hợp đồng; sự dự phòng',
            englishDefinition: 'A condition or requirement in a legal document; the action of providing or supplying something.',
            level: '600+',
            examples: [
                {
                    en: 'Under the provisions of the rental lease, tenants must maintain the property in good condition.',
                    vi: 'Theo các điều khoản của hợp đồng thuê nhà, người thuê phải duy trì bất động sản trong tình trạng tốt.'
                },
                {
                    en: 'The commercial contract includes strict provisions for intellectual property protection.',
                    vi: 'Hợp đồng thương mại bao gồm các điều khoản nghiêm ngặt về bảo vệ sở hữu trí tuệ.'
                }
            ],
            collocations: [
                { phrase: 'under the provisions of', meaning: 'theo các điều khoản của' },
                { phrase: 'contractual provisions', meaning: 'điều khoản theo hợp đồng' },
                { phrase: 'make provision for', meaning: 'dự phòng cho việc gì' }
            ],
            synonyms: ['clause', 'stipulation', 'condition', 'term'],
            antonyms: ['omission', 'exclusion'],
            wordFamily: [
                { word: 'provide', pos: 'verb', meaning: 'cung cấp, quy định' },
                { word: 'provisional', pos: 'adjective', meaning: 'tạm thời, có điều kiện' }
            ],
            trapAndMistake: {
                incorrect: 'Under the provide of the contract, the warranty lasts one year.',
                correct: 'Under the provisions of the contract, the warranty lasts one year.',
                explanation: 'Sau giới từ "under the" bắt buộc phải là Danh từ số nhiều "provisions" (các điều khoản).'
            },
            memoryHook: "Gốc 'provide' (cung cấp) -> 'provision' là điều khoản cung cấp quyền hạn và nghĩa vụ cho các bên.",
            tags: ['#contracts', '#legal', '#toeic'],
            quiz: {
                question: 'According to the newly drafted _______ of the warranty, repairs will be conducted free of charge for 24 months.',
                options: [
                    { key: 'A', text: 'provide', isCorrect: false, explanation: 'Sai từ loại (động từ).' },
                    { key: 'B', text: 'provisions', isCorrect: true, explanation: 'Chính xác. Danh từ số nhiều "provisions" mang nghĩa các điều khoản bảo hành.' },
                    { key: 'C', text: 'provider', isCorrect: false, explanation: 'Sai nghĩa (nhà cung cấp).' },
                    { key: 'D', text: 'providing', isCorrect: false, explanation: 'Sai ngữ pháp.' }
                ]
            },
            dictationHint: 'p _ _ _ _ _ _ _ n'
        },
        {
            id: 'contracts-11',
            topicSlug: 'contracts',
            word: 'resolve',
            type: 'VERB',
            ipaUS: '/rɪˈzɑːlv/',
            ipaUK: '/rɪˈzɒlv/',
            vietnameseMeaning: 'giải quyết tranh chấp, xử lý triệt để',
            englishDefinition: 'To settle or find a solution to a problem, dispute, or contentious matter.',
            level: '600+',
            examples: [
                {
                    en: 'The legal department worked diligently to resolve the dispute before filing a formal lawsuit.',
                    vi: 'Phòng pháp chế đã làm việc chăm chỉ để giải quyết tranh chấp trước khi đệ đơn kiện chính thức.'
                },
                {
                    en: 'Customer service managers are trained to resolve complaints quickly and professionally.',
                    vi: 'Các nhà quản lý dịch vụ khách hàng được đào tạo để giải quyết khiếu nại một cách nhanh chóng và chuyên nghiệp.'
                }
            ],
            collocations: [
                { phrase: 'resolve a dispute', meaning: 'giải quyết tranh chấp' },
                { phrase: 'resolve a conflict', meaning: 'giải quyết xung đột' },
                { phrase: 'resolve an issue peacefully', meaning: 'giải quyết vấn đề trong hòa bình' }
            ],
            synonyms: ['settle', 'solve', 'reconcile', 'iron out'],
            antonyms: ['aggravate', 'prolong', 'escalate'],
            wordFamily: [
                { word: 'resolution', pos: 'noun', meaning: 'nghị quyết, sự giải quyết tranh chấp' },
                { word: 'resolute', pos: 'adjective', meaning: 'kiên định, kiên quyết' }
            ],
            trapAndMistake: {
                incorrect: 'Both companies managed to resolution the disagreement through mediation.',
                correct: 'Both companies managed to resolve the disagreement through mediation.',
                explanation: 'Sau "managed to" cần một Động từ nguyên mẫu (resolve), không dùng Danh từ (resolution).'
            },
            memoryHook: "Resolve a dispute = giải quyết tranh chấp. Danh từ cực kỳ hay gặp trong Part 7 là 'resolution'.",
            tags: ['#contracts', '#dispute', '#toeic'],
            quiz: {
                question: 'Senior mediators met with both union representatives in order to _______ the contract impasse.',
                options: [
                    { key: 'A', text: 'resolve', isCorrect: true, explanation: 'Chính xác. Sau "in order to" cần động từ nguyên mẫu (to resolve).' },
                    { key: 'B', text: 'resolution', isCorrect: false, explanation: 'Sai. Đây là danh từ.' },
                    { key: 'C', text: 'resolving', isCorrect: false, explanation: 'Sai dạng.' },
                    { key: 'D', text: 'resolute', isCorrect: false, explanation: 'Sai. Đây là tính từ.' }
                ]
            },
            dictationHint: 'r _ _ _ _ _ e'
        },
        {
            id: 'contracts-12',
            topicSlug: 'contracts',
            word: 'stipulate',
            type: 'VERB',
            ipaUS: '/ˈstɪpjuleɪt/',
            ipaUK: '/ˈstɪpjuleɪt/',
            vietnameseMeaning: 'quy định, đặt điều kiện bắt buộc',
            englishDefinition: 'To demand or specify a requirement, typically as part of a bargain or agreement.',
            level: '600+',
            examples: [
                {
                    en: 'The employment contract stipulates that employees must give two months of prior written notice before resigning.',
                    vi: 'Hợp đồng lao động quy định rằng nhân viên phải gửi thông báo trước bằng văn bản hai tháng trước khi nghỉ việc.'
                },
                {
                    en: 'International trade treaties stipulate strict environmental protection standards.',
                    vi: 'Các hiệp định thương mại quốc tế quy định những tiêu chuẩn bảo vệ môi trường nghiêm ngặt.'
                }
            ],
            collocations: [
                { phrase: 'as stipulated in the agreement', meaning: 'như được quy định trong thỏa thuận' },
                { phrase: 'stipulate that + S + V', meaning: 'quy định rằng' },
                { phrase: 'clearly stipulate', meaning: 'nêu rõ, quy định rõ ràng' }
            ],
            synonyms: ['specify', 'require', 'state', 'prescribe'],
            antonyms: ['imply', 'omit', 'waive'],
            wordFamily: [
                { word: 'stipulation', pos: 'noun', meaning: 'điều khoản quy định bắt buộc' }
            ],
            trapAndMistake: {
                incorrect: 'As stipulation in article four, all invoices must be paid net 30.',
                correct: 'As stipulated in article four, all invoices must be paid net 30.',
                explanation: 'Dạng đúng là phân từ bị động "As stipulated in..." (như đã được quy định tại...).'
            },
            memoryHook: "Stipulate = quy định. Thường gặp trong cấu trúc bị động Part 7: 'as stipulated in paragraph 3'.",
            tags: ['#contracts', '#legal', '#toeic'],
            quiz: {
                question: 'The partnership contract clearly _______ that all financial profits will be split evenly at the end of each fiscal year.',
                options: [
                    { key: 'A', text: 'stipulate', isCorrect: false, explanation: 'Sai. Chủ ngữ "contract" là số ít, động từ cần thêm -s.' },
                    { key: 'B', text: 'stipulates', isCorrect: true, explanation: 'Chính xác. Chủ ngữ ngôi 3 số ít "The contract" đi với động từ thêm -s "stipulates".' },
                    { key: 'C', text: 'stipulation', isCorrect: false, explanation: 'Sai từ loại (danh từ).' },
                    { key: 'D', text: 'stipulating', isCorrect: false, explanation: 'Sai dạng tiếp diễn thiếu to be.' }
                ]
            },
            dictationHint: 's _ _ _ _ _ _ _ _ e'
        }
    ];

    // 2. NGÂN HÀNG COLLOCATION MATCH (ĐẤU TRƯỜNG GHÉP CỤM TỪ GAMIFIED)
    const collocationMatchBank = [
        // Level 0 - 500 (🌱 Căn bản & Mất gốc)
        {
            id: 'm-1',
            level: '0-500',
            english: 'check in at the front desk',
            vietnamese: 'làm thủ tục tại quầy lễ tân',
            exampleSentence: 'Guests are required to check in at the front desk upon arrival.'
        },
        {
            id: 'm-2',
            level: '0-500',
            english: 'board the domestic flight',
            vietnamese: 'lên chuyến bay nội địa',
            exampleSentence: 'Passengers with priority tickets may board the domestic flight first.'
        },
        {
            id: 'm-3',
            level: '0-500',
            english: 'order office supplies',
            vietnamese: 'đặt mua văn phòng phẩm',
            exampleSentence: 'The administrative assistant will order office supplies every Monday morning.'
        },
        {
            id: 'm-4',
            level: '0-500',
            english: 'confirm a hotel reservation',
            vietnamese: 'xác nhận đặt phòng khách sạn',
            exampleSentence: 'Please call the concierge to confirm a hotel reservation before 6 PM.'
        },
        {
            id: 'm-5',
            level: '0-500',
            english: 'customer service representative',
            vietnamese: 'nhân viên chăm sóc khách hàng',
            exampleSentence: 'Speak directly with a customer service representative to process your return.'
        },
        {
            id: 'm-6',
            level: '0-500',
            english: 'fill out an application form',
            vietnamese: 'điền vào mẫu đơn xin việc',
            exampleSentence: 'All applicants must fill out an application form completely and accurately.'
        },
        {
            id: 'm-7',
            level: '0-500',
            english: 'take public transportation',
            vietnamese: 'đi phương tiện giao thông công cộng',
            exampleSentence: 'Commuters are encouraged to take public transportation to reduce carbon emissions.'
        },

        // Level 600+ (🚀 Cốt lõi Ra trường)
        {
            id: 'm-8',
            level: '600+',
            english: 'abide by the terms of the contract',
            vietnamese: 'tuân thủ các điều khoản hợp đồng',
            exampleSentence: 'Both corporate entities pledged to abide by the terms of the contract.'
        },
        {
            id: 'm-9',
            level: '600+',
            english: 'eligible for a full refund',
            vietnamese: 'đủ điều kiện được hoàn tiền 100%',
            exampleSentence: 'Unopened products returned within 30 days are eligible for a full refund.'
        },
        {
            id: 'm-10',
            level: '600+',
            english: 'conduct comprehensive market research',
            vietnamese: 'tiến hành nghiên cứu thị trường toàn diện',
            exampleSentence: 'The marketing team will conduct comprehensive market research prior to launch.'
        },
        {
            id: 'm-11',
            level: '600+',
            english: 'submit an expense report',
            vietnamese: 'nộp báo cáo chi phí công tác',
            exampleSentence: 'Sales executives must submit an expense report accompanied by original receipts.'
        },
        {
            id: 'm-12',
            level: '600+',
            english: 'meet the strict project deadline',
            vietnamese: 'kịp thời hạn dự án nghiêm ngặt',
            exampleSentence: 'Software engineers worked overtime to meet the strict project deadline.'
        },
        {
            id: 'm-13',
            level: '600+',
            english: 'launch a targeted marketing campaign',
            vietnamese: 'tung ra chiến dịch tiếp thị mục tiêu',
            exampleSentence: 'Our agency will launch a targeted marketing campaign across Southeast Asia.'
        },
        {
            id: 'm-14',
            level: '600+',
            english: 'resolve a commercial dispute',
            vietnamese: 'giải quyết tranh chấp thương mại',
            exampleSentence: 'Experienced legal advisors helped resolve a commercial dispute without litigation.'
        },

        // Level 800+ (👑 Điểm cao & Học thuật)
        {
            id: 'm-15',
            level: '800+',
            english: 'comply with statutory regulations',
            vietnamese: 'tuân thủ các quy định theo luật định',
            exampleSentence: 'Publicly traded conglomerates must strictly comply with statutory regulations.'
        },
        {
            id: 'm-16',
            level: '800+',
            english: 'stipulate stringent requirements',
            vietnamese: 'quy định các yêu cầu nghiêm ngặt',
            exampleSentence: 'ISO quality guidelines stipulate stringent requirements for cleanroom manufacturing.'
        },
        {
            id: 'm-17',
            level: '800+',
            english: 'allocate capital expenditure budget',
            vietnamese: 'phân bổ ngân sách chi tiêu vốn',
            exampleSentence: 'The board approved plans to allocate capital expenditure budget toward AI server infrastructure.'
        },
        {
            id: 'm-18',
            level: '800+',
            english: 'mitigate long-term corporate liability',
            vietnamese: 'giảm thiểu trách nhiệm pháp lý dài hạn',
            exampleSentence: 'Adopting international safety standards helps mitigate long-term corporate liability.'
        },
        {
            id: 'm-19',
            level: '800+',
            english: 'unforeseen economic contingency',
            vietnamese: 'tình huống kinh tế bất ngờ dự phòng',
            exampleSentence: 'The CFO reserved contingency funds to safeguard against any unforeseen economic contingency.'
        },
        {
            id: 'm-20',
            level: '800+',
            english: 'execute a legally binding merger',
            vietnamese: 'thực hiện thương vụ sáp nhập ràng buộc pháp lý',
            exampleSentence: 'The rival telecommunication firms agreed to execute a legally binding merger agreement.'
        }
    ];

    // 3. VOCABULARY ENGINE CONTROLLER
    const VocabularyEngine = {
        currentTopicSlug: 'contracts',
        currentTopicTitle: 'Contracts',
        currentWords: contractsRichWords,
        currentWordIndex: 0,
        activeStudyTab: 'word', // 'word' | 'lesson' | 'quiz' | 'spelling' | 'srs'
        isFlipped: false,
        autoPronounce: false,
        fastStudyMode: false,
        masteredWordsMap: {}, // wordId -> boolean
        bookmarkedWordsMap: {}, // wordId -> boolean
        srsScheduleMap: {}, // wordId -> { intervalDays, nextReview, stage }
        
        // Match Game State
        matchLevelFilter: 'ALL', // 'ALL' | '0-500' | '600+' | '800+'
        matchCurrentItems: [],
        selectedLeftId: null,
        selectedRightId: null,
        matchedItemIds: [],
        matchComboStreak: 0,
        matchTimerSeconds: 0,
        matchTimerInterval: null,
        matchEarnedXP: 0,
        isMatchLocked: false,

        init() {
            this.loadSavedState();
            this.setupPopstateListener();
            this.setupKeyboardListener();

            // Direct URL routing on page load
            const path = (window.location && window.location.pathname) || '';
            if (path.includes('/study')) {
                const parts = path.split('/');
                const studyIdx = parts.indexOf('study');
                const slug = studyIdx > 0 ? parts[studyIdx - 1] : 'contracts';
                this.showStudyView(slug, 0, false);
            } else if (path.includes('/match')) {
                this.showMatchView(false);
            }

            console.log('⚡ VocabularyEngine initialized with EdTech 5-Tab Studio & Gamified Match Arena.');
        },

        loadSavedState() {
            try {
                const raw = localStorage.getItem('cung_dang_vocab_state');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.masteredWordsMap) this.masteredWordsMap = parsed.masteredWordsMap;
                    if (parsed.bookmarkedWordsMap) this.bookmarkedWordsMap = parsed.bookmarkedWordsMap;
                    if (parsed.srsScheduleMap) this.srsScheduleMap = parsed.srsScheduleMap;
                }
            } catch (e) {}
        },

        saveState() {
            try {
                const payload = {
                    masteredWordsMap: this.masteredWordsMap,
                    bookmarkedWordsMap: this.bookmarkedWordsMap,
                    srsScheduleMap: this.srsScheduleMap
                };
                localStorage.setItem('cung_dang_vocab_state', JSON.stringify(payload));
            } catch (e) {}
        },

        setupPopstateListener() {
            window.addEventListener('popstate', (e) => {
                const path = window.location.pathname;
                if (path.includes('/study')) {
                    const parts = path.split('/');
                    const studyIdx = parts.indexOf('study');
                    const slug = studyIdx > 0 ? parts[studyIdx - 1] : 'contracts';
                    this.showStudyView(slug, 0, false);
                } else if (path.includes('/match')) {
                    this.showMatchView(false);
                } else if (path === '/vocabulary' || window.location.hash === '#vocabulary') {
                    this.showHubView(false);
                }
            });
        },

        setupKeyboardListener() {
            window.addEventListener('keydown', (e) => {
                const viewStudy = document.getElementById('view-vocabulary-study');
                if (!viewStudy || viewStudy.classList.contains('hidden')) return;

                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (e.code === 'Space') {
                    // Space flips the card in Tab 1
                    if (this.activeStudyTab === 'word') {
                        e.preventDefault();
                        this.flipCard();
                    }
                } else if (e.key === 'ArrowRight') {
                    this.nextWord();
                } else if (e.key === 'ArrowLeft') {
                    this.prevWord();
                } else if (e.key === '1') {
                    this.switchStudyTab('word');
                } else if (e.key === '2') {
                    this.switchStudyTab('lesson');
                } else if (e.key === '3') {
                    this.switchStudyTab('quiz');
                } else if (e.key === '4') {
                    this.switchStudyTab('spelling');
                } else if (e.key === '5') {
                    this.switchStudyTab('srs');
                }
            });
        },

        highlightSidebar() {
            document.querySelectorAll('[id^="nav-"]').forEach(el => {
                el.classList.remove(
                    'nav-active-home',
                    'nav-active-roadmap',
                    'nav-active-grammar',
                    'nav-active-vocab',
                    'nav-active-dict',
                    'nav-active-listen',
                    'nav-active-read',
                    'nav-active-mock',
                    'nav-active-traps',
                    'nav-active-dictation',
                    'nav-active-youglish',
                    'nav-active-note'
                );
            });
            const navEl = document.getElementById('nav-tu-vung');
            if (navEl) {
                navEl.classList.add('nav-active-vocab');
            }
        },

        hideAllViews() {
            const allTabs = ['hom-nay', 'lo-trinh', 'ngu-phap', 'grammar-theory', 'grammar-practice', 'tu-vung', 'tu-dien', 'nghe', 'doc', 'thi-thu', 'bay-de-thi', 'nghe-chinh-ta', 'tu-vung-phim', 'take-note', 'tai-khoan', 'cai-dat'];
            allTabs.forEach(id => {
                const el = document.getElementById(`view-${id}`);
                if (el) el.classList.add('hidden');
            });
            const vs = document.getElementById('view-vocabulary-study');
            if (vs) vs.classList.add('hidden');
            const vm = document.getElementById('view-vocabulary-match');
            if (vm) vm.classList.add('hidden');
        },

        // =========================================================================
        // ROUTING METHODS
        // =========================================================================
        navigateToHub() {
            try {
                window.history.pushState({ view: 'vocabulary' }, '', '/vocabulary');
            } catch (e) {}
            this.showHubView(true);
        },

        navigateToStudy(topicSlug = 'contracts', wordIndex = 0) {
            try {
                window.history.pushState({ view: 'vocabulary-study', slug: topicSlug, wordIndex }, '', `/vocabulary/${topicSlug}/study`);
            } catch (e) {}
            this.showStudyView(topicSlug, wordIndex, true);
        },

        navigateToMatch() {
            try {
                window.history.pushState({ view: 'vocabulary-match' }, '', '/vocabulary/match');
            } catch (e) {}
            this.showMatchView(true);
        },

        showHubView(shouldScroll = true) {
            this.hideAllViews();
            const view = document.getElementById('view-tu-vung');
            if (view) {
                view.classList.remove('hidden');
            }
            this.highlightSidebar();
            if (typeof renderAllVocabGroups === 'function') renderAllVocabGroups();
            this.updateHubCounters();
            if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        showStudyView(topicSlug = 'contracts', wordIndex = 0, shouldScroll = true) {
            this.hideAllViews();
            this.loadTopicWords(topicSlug);
            this.currentWordIndex = Math.max(0, Math.min(wordIndex, this.currentWords.length - 1));
            this.isFlipped = false;
            this.activeStudyTab = 'word';

            const view = document.getElementById('view-vocabulary-study');
            if (view) {
                view.classList.remove('hidden');
                this.renderStudyWorkspace();
            }
            this.highlightSidebar();
            if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });

            if (this.autoPronounce) {
                const w = this.currentWords[this.currentWordIndex];
                if (w) setTimeout(() => this.speakWord(w.word, 'US'), 300);
            }
        },

        showMatchView(shouldScroll = true) {
            this.hideAllViews();
            const view = document.getElementById('view-vocabulary-match');
            if (view) {
                view.classList.remove('hidden');
                this.startMatchGame(this.matchLevelFilter);
            }
            this.highlightSidebar();
            if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Helper to load or adapt words for any of the 48 decks
        loadTopicWords(topicSlug) {
            this.currentTopicSlug = topicSlug;
            // Normalize slug to topic title
            let resolvedTitle = 'Contracts';
            if (window.vocabDecksDatabase) {
                for (let k in window.vocabDecksDatabase) {
                    const s = k.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    if (s === topicSlug.toLowerCase() || k.toLowerCase() === topicSlug.toLowerCase()) {
                        resolvedTitle = k;
                        break;
                    }
                }
            }
            this.currentTopicTitle = resolvedTitle;

            if (resolvedTitle.toLowerCase() === 'contracts') {
                this.currentWords = contractsRichWords;
            } else if (window.vocabDecksDatabase && window.vocabDecksDatabase[resolvedTitle]) {
                const rawList = window.vocabDecksDatabase[resolvedTitle];
                // Adapt raw cards into full VocabularyWord objects
                this.currentWords = rawList.map((item, idx) => {
                    const id = `${topicSlug}-${idx + 1}`;
                    return {
                        id,
                        topicSlug,
                        word: item.word,
                        type: this.guessPosType(item.word, item.meaning),
                        ipaUS: item.phonetic || '/.../',
                        ipaUK: item.phonetic || '/.../',
                        vietnameseMeaning: item.meaning || '',
                        englishDefinition: `Standard professional English definition for "${item.word}".`,
                        level: '600+',
                        examples: [
                            {
                                en: item.example || `The executive will review the ${item.word} carefully.`,
                                vi: item.exampleVi || `Ban giám đốc sẽ xem xét kỹ lưỡng ${item.meaning}.`
                            }
                        ],
                        collocations: [
                            { phrase: item.collocation || `${item.word} policy`, meaning: `quy định liên quan đến ${item.meaning}` }
                        ],
                        synonyms: ['standard practice', 'corporate term'],
                        antonyms: ['opposite factor'],
                        wordFamily: [
                            { word: item.word, pos: 'core', meaning: item.meaning }
                        ],
                        trapAndMistake: {
                            incorrect: `Avoid confusing ${item.word} with informal colloquial words.`,
                            correct: `Use ${item.word} properly in business context.`,
                            explanation: `Chú ý phân biệt từ loại và ngữ cảnh câu hỏi trong đề thi TOEIC Part 5.`
                        },
                        memoryHook: item.tip || `Ghi nhớ từ "${item.word}" gắn liền với ngữ cảnh doanh nghiệp ${resolvedTitle}.`,
                        tags: [`#${topicSlug}`, '#toeic'],
                        quiz: {
                            question: `The committee requires a thorough understanding of _______ before finalizing the report.`,
                            options: [
                                { key: 'A', text: item.word, isCorrect: true, explanation: `Chính xác. "${item.word}" phù hợp nhất với ngữ cảnh.` },
                                { key: 'B', text: 'unrelated concept', isCorrect: false, explanation: 'Sai ngữ cảnh.' },
                                { key: 'C', text: 'misleading term', isCorrect: false, explanation: 'Sai nghĩa.' },
                                { key: 'D', text: 'irregular form', isCorrect: false, explanation: 'Sai cấu trúc.' }
                            ]
                        },
                        dictationHint: item.word.split('').map((c, i) => i === 0 || i === item.word.length - 1 || c === ' ' ? c : '_').join(' ')
                    };
                });
            } else {
                this.currentWords = contractsRichWords;
            }
        },

        guessPosType(word, meaning) {
            if (word.includes(' ')) return 'PHRASE';
            if (meaning.startsWith('sự ') || meaning.startsWith('người ') || meaning.startsWith('hợp đồng') || meaning.startsWith('bên ')) return 'NOUN';
            if (meaning.startsWith('thuộc ') || meaning.startsWith('có tính ')) return 'ADJECTIVE';
            if (meaning.endsWith('ly') || meaning.startsWith('một cách ')) return 'ADVERB';
            return 'VERB';
        },

        updateHubCounters() {
            const masteredCount = Object.values(this.masteredWordsMap).filter(Boolean).length;
            const savedCount = Object.values(this.bookmarkedWordsMap).filter(Boolean).length;

            const elMastered = document.getElementById('vocabHeaderMastered');
            if (elMastered) elMastered.textContent = masteredCount;
            const elLearned = document.getElementById('vocabHeaderLearned');
            if (elLearned) elLearned.textContent = masteredCount;

            const elSavedSub = document.getElementById('savedVocabSub');
            if (elSavedSub) elSavedSub.textContent = savedCount > 0 ? `Đã lưu ${savedCount} từ khó` : 'Chưa lưu từ nào';

            const badgeSaved = document.getElementById('savedWordsBadge');
            if (badgeSaved) badgeSaved.textContent = savedCount;
            const badgeLearned = document.getElementById('learnedWordsBadge');
            if (badgeLearned) badgeLearned.textContent = masteredCount;
        },

        // =========================================================================
        // MÀN HÌNH 2: RENDER WORKSPACE HỌC TẬP 5 TAB (/vocabulary/[slug]/study)
        // =========================================================================
        renderStudyWorkspace() {
            const container = document.getElementById('view-vocabulary-study');
            if (!container) return;

            const total = this.currentWords.length;
            const idx = this.currentWordIndex;
            const w = this.currentWords[idx] || contractsRichWords[0];
            const isMastered = !!this.masteredWordsMap[w.id];
            const isBookmarked = !!this.bookmarkedWordsMap[w.id];

            container.innerHTML = `
                <div class="space-y-4 pb-20 max-w-7xl mx-auto">
                    <!-- 4.1. TOP UTILITY HEADER -->
                    <div class="glass-panel rounded-3xl p-4 sm:p-5 border border-white/70 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
                        <!-- Breadcrumb & Back Button -->
                        <div class="flex items-center gap-3">
                            <button onclick="VocabularyEngine.navigateToHub()" class="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition shadow-xs" title="Quay lại Trung tâm từ vựng">
                                <i class="fa-solid fa-arrow-left text-xs"></i>
                            </button>
                            <div>
                                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                    <button onclick="VocabularyEngine.navigateToHub()" class="hover:text-purple-600 transition">Từ vựng</button>
                                    <i class="fa-solid fa-chevron-right text-[8px]"></i>
                                    <span>Business & Workplace</span>
                                    <i class="fa-solid fa-chevron-right text-[8px]"></i>
                                    <span class="text-purple-700 dark:text-purple-300 font-bold">${this.currentTopicTitle}</span>
                                </div>
                                <h1 class="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5">
                                    Học từ mới · <span class="text-purple-600 dark:text-purple-400 font-bold">Thẻ ${idx + 1}/${total}</span>
                                </h1>
                            </div>
                        </div>

                        <!-- Utility Switches & Controls -->
                        <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <!-- Switch Tự phát âm -->
                            <button onclick="VocabularyEngine.toggleAutoPronounce()" class="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${this.autoPronounce ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}">
                                <i class="fa-solid fa-volume-high text-[11px]"></i>
                                <span class="hidden sm:inline">Tự phát âm</span>
                            </button>

                            <!-- Switch Học nhanh -->
                            <button onclick="VocabularyEngine.toggleFastStudy()" class="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${this.fastStudyMode ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}">
                                <i class="fa-solid fa-bolt text-[11px]"></i>
                                <span class="hidden sm:inline">Học nhanh</span>
                            </button>

                            <!-- Bookmark Current Word -->
                            <button onclick="VocabularyEngine.toggleBookmarkCurrentWord()" class="w-9 h-9 rounded-xl border flex items-center justify-center transition ${isBookmarked ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:text-purple-600'}" title="Lưu vào Sổ tay từ vựng">
                                <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <!-- 4.2 & 4.3. TWO-COLUMN SPLIT WORKSPACE -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        <!-- ============================================== -->
                        <!-- CỘT TRÁI: WORD RAIL NAVIGATOR (3 CỘT / 25%)      -->
                        <!-- ============================================== -->
                        <div class="lg:col-span-3 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-3">
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <div class="flex items-center gap-2 text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                                    <i class="fa-solid fa-list-check text-purple-600"></i>
                                    <span>Danh sách từ (${total})</span>
                                </div>
                                <span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold">${this.currentTopicTitle}</span>
                            </div>

                            <!-- List words cuộn dọc trên desktop, cuộn ngang trên mobile -->
                            <div class="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto max-h-[500px] p-0.5 custom-scrollbar">
                                ${this.currentWords.map((item, i) => {
                                    const isActive = i === idx;
                                    const isItemMastered = !!this.masteredWordsMap[item.id];
                                    let btnClass = 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50 hover:border-purple-300';
                                    let circleClass = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                                    if (isActive) {
                                        btnClass = 'bg-purple-50 dark:bg-purple-950/60 border-2 border-purple-600 text-purple-950 dark:text-purple-200 font-black shadow-xs';
                                        circleClass = 'bg-purple-600 text-white';
                                    }

                                    return `
                                        <button onclick="VocabularyEngine.jumpToWord(${i})" class="w-full text-left p-2.5 rounded-2xl border transition flex items-center justify-between gap-2 shrink-0 lg:shrink ${btnClass}">
                                            <div class="flex items-center gap-2.5 truncate">
                                                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${circleClass}">
                                                    ${i + 1}
                                                </span>
                                                <span class="text-xs truncate font-bold">${item.word}</span>
                                            </div>
                                            ${isItemMastered ? '<span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] shrink-0 font-bold" title="Đã thuộc">✔</span>' : ''}
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- ============================================== -->
                        <!-- CỘT PHẢI: 5-TAB LEARNING WORKSPACE (9 CỘT / 75%)-->
                        <!-- ============================================== -->
                        <div class="lg:col-span-9 space-y-4">
                            <!-- 5 Tabs Navigation Bar -->
                            <div class="glass-panel rounded-2xl p-1.5 border border-white/60 dark:border-slate-800 shadow-xs flex items-center gap-1 overflow-x-auto">
                                <button onclick="VocabularyEngine.switchStudyTab('word')" class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition shrink-0 ${this.activeStudyTab === 'word' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                                    <span>🎴 Từ</span>
                                </button>
                                <button onclick="VocabularyEngine.switchStudyTab('lesson')" class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition shrink-0 ${this.activeStudyTab === 'lesson' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                                    <span>📘 Bài học</span>
                                </button>
                                <button onclick="VocabularyEngine.switchStudyTab('quiz')" class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition shrink-0 ${this.activeStudyTab === 'quiz' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                                    <span>📝 Quiz</span>
                                </button>
                                <button onclick="VocabularyEngine.switchStudyTab('spelling')" class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition shrink-0 ${this.activeStudyTab === 'spelling' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                                    <span>⌨️ Gõ chính tả</span>
                                </button>
                                <button onclick="VocabularyEngine.switchStudyTab('srs')" class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition shrink-0 ${this.activeStudyTab === 'srs' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                                    <span>📊 Đánh giá</span>
                                </button>
                            </div>

                            <!-- TAB CONTENT CONTAINER -->
                            <div class="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm min-h-[460px]">
                                ${this.renderActiveStudyTabContent(w)}
                            </div>

                            <!-- 4.4. BOTTOM ACTION FOOTER BAR -->
                            <div class="glass-panel rounded-3xl p-4 sm:p-5 border border-white/70 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="showToast('🚩 Đã ghi nhận báo lỗi nội dung từ vựng!')" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold transition flex items-center gap-1">
                                        <i class="fa-regular fa-flag text-[11px]"></i>
                                        <span>Báo lỗi</span>
                                    </button>
                                    <button onclick="showToast('💬 Cảm ơn bạn đã đóng góp ý kiến nâng cấp từ vựng!')" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 text-xs font-bold transition flex items-center gap-1">
                                        <i class="fa-regular fa-comment-dots text-[11px]"></i>
                                        <span>Góp ý</span>
                                    </button>
                                </div>

                                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <button onclick="VocabularyEngine.skipWord()" class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
                                        ⚪ Đã biết từ này, bỏ qua
                                    </button>

                                    <button onclick="VocabularyEngine.markUnmastered()" class="px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-extrabold text-xs hover:bg-rose-100 transition flex items-center gap-1.5">
                                        <span>❌ Chưa thuộc</span>
                                    </button>

                                    <button onclick="VocabularyEngine.markMastered()" class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition">
                                        <i class="fa-solid fa-check"></i>
                                        <span>Đã thuộc (+5 XP)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        renderActiveStudyTabContent(w) {
            switch (this.activeStudyTab) {
                case 'word':
                    return this.renderTabWordHtml(w);
                case 'lesson':
                    return this.renderTabLessonHtml(w);
                case 'quiz':
                    return this.renderTabQuizHtml(w);
                case 'spelling':
                    return this.renderTabSpellingHtml(w);
                case 'srs':
                    return this.renderTabSrsHtml(w);
                default:
                    return this.renderTabWordHtml(w);
            }
        },

        // TAB 1: 3D FLASHCARD (LẬT THẺ TRỰC QUAN)
        renderTabWordHtml(w) {
            const isFlipped = this.isFlipped;

            return `
                <div class="flex flex-col items-center justify-center min-h-[380px] max-w-xl mx-auto perspective-1000">
                    <div class="w-full relative cursor-pointer" onclick="VocabularyEngine.flipCard()">
                        <!-- Card Container -->
                        <div class="rounded-3xl border-2 border-purple-200 dark:border-slate-700 p-8 sm:p-10 text-center transition-all duration-500 transform-style-preserve-3d shadow-lg ${isFlipped ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/80 dark:from-slate-800 dark:to-slate-900 border-indigo-300' : 'bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 dark:from-slate-850 dark:to-slate-900'}">
                            
                            ${!isFlipped ? `
                                <!-- FRONT SIDE: ENGLISH WORD & PRONUNCIATION -->
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between pb-2">
                                        <span class="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-extrabold text-xs uppercase tracking-wider border border-purple-200 dark:border-purple-800">
                                            ${w.type}
                                        </span>
                                        <span class="text-xs text-slate-400 font-semibold">Nhấn để xem mặt sau 🔄</span>
                                    </div>

                                    <div class="py-4">
                                        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">${w.word}</h2>
                                        <div class="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
                                            US ${w.ipaUS} • UK ${w.ipaUK}
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-center gap-3 pt-2" onclick="event.stopPropagation()">
                                        <button onclick="VocabularyEngine.speakWord('${w.word}', 'US')" class="px-4 py-2 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition">
                                            <i class="fa-solid fa-volume-high text-xs"></i>
                                            <span>US</span>
                                        </button>
                                        <button onclick="VocabularyEngine.speakWord('${w.word}', 'UK')" class="px-4 py-2 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition">
                                            <i class="fa-solid fa-volume-high text-xs"></i>
                                            <span>UK</span>
                                        </button>
                                    </div>

                                    <div class="pt-6">
                                        <button onclick="VocabularyEngine.flipCard()" class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 mx-auto hover:scale-105 active:scale-95 transition">
                                            <i class="fa-solid fa-repeat"></i>
                                            <span>Lật thẻ (Space)</span>
                                        </button>
                                    </div>
                                </div>
                            ` : `
                                <!-- BACK SIDE: MEANING, EXAMPLES & HOOK -->
                                <div class="space-y-4 text-left">
                                    <div class="flex items-center justify-between pb-2 border-b border-purple-200/60 dark:border-slate-700">
                                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${w.word}</span>
                                        <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                                            ${w.vietnameseMeaning}
                                        </span>
                                    </div>

                                    <div class="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 space-y-1">
                                        <div class="text-[11px] font-black uppercase text-purple-700 dark:text-purple-300">Định nghĩa chuẩn:</div>
                                        <p class="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">${w.englishDefinition}</p>
                                    </div>

                                    <div class="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 space-y-1">
                                        <div class="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-300">Ví dụ công sở:</div>
                                        <p class="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">${w.examples[0]?.en}</p>
                                        <p class="text-[11.5px] text-slate-600 dark:text-slate-400">${w.examples[0]?.vi}</p>
                                    </div>

                                    <div class="p-3 rounded-2xl bg-purple-50/80 dark:bg-slate-800 border border-purple-200/80 text-xs text-purple-900 dark:text-purple-300 font-semibold flex items-start gap-2">
                                        <span class="text-amber-500 text-sm">💡</span>
                                        <span>${w.memoryHook}</span>
                                    </div>

                                    <div class="pt-2 text-center" onclick="event.stopPropagation()">
                                        <button onclick="VocabularyEngine.flipCard()" class="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-1.5 transition">
                                            <i class="fa-solid fa-arrow-rotate-left"></i>
                                            <span>Lật lại mặt trước</span>
                                        </button>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        },

        // TAB 2: BÀI HỌC SÂU ĐA TẦNG (DEEP LEARNING WALKTHROUGH)
        renderTabLessonHtml(w) {
            return `
                <div class="space-y-6">
                    <!-- 1. Nghĩa cốt lõi & Định nghĩa chuẩn -->
                    <div class="p-5 rounded-3xl bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-white dark:from-slate-800 dark:to-slate-850 border border-purple-200/80 dark:border-slate-700 space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10.5px] font-extrabold uppercase">${w.type}</span>
                            <h3 class="text-xl font-black text-purple-900 dark:text-purple-200">${w.word}: ${w.vietnameseMeaning}</h3>
                        </div>
                        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">${w.englishDefinition}</p>
                    </div>

                    <!-- 2. Ví dụ thực tế công sở chuẩn ETS -->
                    <div class="space-y-3">
                        <div class="flex items-center gap-2 text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                            <i class="fa-solid fa-briefcase text-purple-600"></i>
                            <span>Ví dụ thực tế trong công sở (Real Business Context)</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${w.examples.map(ex => `
                                <div class="glass-panel rounded-2xl p-4 border border-purple-100 dark:border-slate-700 space-y-2 relative overflow-hidden shadow-xs">
                                    <div class="flex items-start justify-between gap-2">
                                        <p class="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-relaxed">"${ex.en}"</p>
                                        <button onclick="VocabularyEngine.speakText('${ex.en.replace(/'/g, "\\'")}')" class="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center text-xs shrink-0 transition" title="Nghe câu ví dụ">
                                            <i class="fa-solid fa-volume-high text-[10px]"></i>
                                        </button>
                                    </div>
                                    <p class="text-xs text-slate-600 dark:text-slate-300 font-medium">➔ ${ex.vi}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 3. Cụm từ đi kèm (Collocations) & Đồng nghĩa/Trái nghĩa -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Collocations Pills -->
                        <div class="p-4 rounded-3xl bg-pink-50/50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 space-y-2.5">
                            <div class="flex items-center gap-2 text-pink-900 dark:text-pink-300 text-xs font-black uppercase">
                                <i class="fa-solid fa-link text-pink-600"></i>
                                <span>Cụm từ đi kèm (Collocations)</span>
                            </div>
                            <div class="space-y-1.5">
                                ${w.collocations.map(col => `
                                    <div class="p-2 rounded-xl bg-white/90 dark:bg-slate-900 border border-pink-100 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                        <span class="text-pink-700 dark:text-pink-400">${col.phrase}</span>
                                        <span class="text-[11px] text-slate-500 font-medium">${col.meaning}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Đồng nghĩa / Trái nghĩa Chips -->
                        <div class="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
                            <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-xs font-black uppercase">
                                <i class="fa-solid fa-arrow-right-arrow-left text-purple-600"></i>
                                <span>Từ đồng nghĩa & Trái nghĩa</span>
                            </div>
                            <!-- Đồng nghĩa -->
                            <div class="space-y-1">
                                <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Đồng nghĩa:</span>
                                <div class="flex flex-wrap gap-1.5">
                                    ${w.synonyms.map(syn => `
                                        <span class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">${syn}</span>
                                    `).join('')}
                                </div>
                            </div>
                            <!-- Trái nghĩa -->
                            <div class="space-y-1">
                                <span class="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase">Trái nghĩa:</span>
                                <div class="flex flex-wrap gap-1.5">
                                    ${w.antonyms.map(ant => `
                                        <span class="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">${ant}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Word Family Tree (Họ từ) -->
                    <div class="p-4 rounded-3xl bg-teal-50/50 dark:bg-slate-800 border border-teal-200/80 dark:border-slate-700 space-y-2">
                        <div class="flex items-center gap-2 text-teal-900 dark:text-teal-300 text-xs font-black uppercase">
                            <i class="fa-solid fa-tree text-teal-600"></i>
                            <span>🌿 Bách khoa Họ từ liên quan (Word Family)</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            ${w.wordFamily.map(wf => `
                                <div class="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900 border border-teal-100 dark:border-slate-700 text-xs space-y-0.5">
                                    <div class="flex items-center justify-between">
                                        <strong class="text-teal-800 dark:text-teal-300 font-extrabold">${wf.word}</strong>
                                        <span class="text-[10px] uppercase font-bold text-slate-400">${wf.pos}</span>
                                    </div>
                                    <p class="text-[11.5px] text-slate-600 dark:text-slate-400">${wf.meaning}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 5. ⚠️ LỖI THƯỜNG GẶP TRONG BÀI THI -->
                    <div class="rounded-3xl p-5 bg-gradient-to-br from-amber-50/70 via-yellow-50/40 to-white dark:from-slate-800 dark:to-slate-850 border-2 border-amber-300/80 dark:border-slate-700 space-y-2.5 shadow-xs">
                        <div class="flex items-center gap-2 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                            <i class="fa-solid fa-triangle-exclamation text-rose-500 text-sm"></i>
                            <span>⚠️ CẢNH BÁO: LỖI THƯỜNG GẶP TRONG ĐỀ THI</span>
                        </div>
                        <div class="space-y-1.5 text-xs font-semibold">
                            <div class="text-rose-600 dark:text-rose-400 line-through">❌ ${w.trapAndMistake.incorrect}</div>
                            <div class="text-emerald-700 dark:text-emerald-400 font-bold">✔ ${w.trapAndMistake.correct}</div>
                        </div>
                        <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium pt-1 border-t border-amber-200/70">
                            ${w.trapAndMistake.explanation}
                        </p>
                    </div>

                    <!-- 6. 💡 MẸO NHỚ SIÊU TỐC (MNEMONIC HOOK) & CTA -->
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-purple-50/80 dark:bg-slate-800 border border-purple-200/80 dark:border-slate-700">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-lg">
                                💡
                            </div>
                            <div>
                                <h4 class="text-xs font-black text-purple-900 dark:text-purple-200 uppercase">Mẹo nhớ siêu tốc</h4>
                                <p class="text-xs text-slate-700 dark:text-slate-300 font-medium">${w.memoryHook}</p>
                            </div>
                        </div>
                        <button onclick="VocabularyEngine.switchStudyTab('quiz')" class="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 shrink-0 transition flex items-center gap-1.5">
                            <i class="fa-solid fa-bullseye"></i>
                            <span>Kiểm tra nhanh ➔</span>
                        </button>
                    </div>
                </div>
            `;
        },

        // TAB 3: QUIZ PHẢN XẠ NHANH
        renderTabQuizHtml(w) {
            const q = w.quiz || {
                question: `Choose the correct usage of "${w.word}" in a formal sentence:`,
                options: [
                    { key: 'A', text: `Standard usage of ${w.word}`, isCorrect: true, explanation: 'Chính xác.' },
                    { key: 'B', text: 'Grammatical error option', isCorrect: false, explanation: 'Sai ngữ pháp.' },
                    { key: 'C', text: 'Wrong preposition option', isCorrect: false, explanation: 'Sai giới từ.' },
                    { key: 'D', text: 'Incorrect form option', isCorrect: false, explanation: 'Sai dạng thức.' }
                ]
            };

            return `
                <div class="space-y-5 max-w-2xl mx-auto">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-[11px] uppercase tracking-wider">
                            QUIZ PHẢN XẠ NHANH
                        </span>
                        <span class="text-xs text-slate-400 font-semibold">Chọn 1 đáp án đúng</span>
                    </div>

                    <div class="space-y-3">
                        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                            ${q.question}
                        </h3>
                    </div>

                    <div id="quizOptionsContainer" class="space-y-3 pt-2">
                        ${q.options.map(opt => `
                            <button onclick="VocabularyEngine.handleQuizOptionClick('${opt.key}')" id="quiz-opt-${opt.key}" class="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-400 transition flex items-center gap-3">
                                <span class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-black shrink-0">
                                    ${opt.key}
                                </span>
                                <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex-1">${opt.text}</span>
                            </button>
                        `).join('')}
                    </div>

                    <div id="quizFeedbackArea" class="hidden p-4 rounded-2xl space-y-2"></div>
                </div>
            `;
        },

        handleQuizOptionClick(key) {
            const w = this.currentWords[this.currentWordIndex];
            const q = w.quiz;
            if (!q) return;

            const selected = q.options.find(o => o.key === key);
            const isCorrect = selected && selected.isCorrect;

            q.options.forEach(opt => {
                const btn = document.getElementById(`quiz-opt-${opt.key}`);
                if (btn) {
                    btn.disabled = true;
                    if (opt.isCorrect) {
                        btn.className = 'w-full text-left p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 font-bold';
                    } else if (opt.key === key) {
                        btn.className = 'w-full text-left p-4 rounded-2xl border-2 border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 flex items-center gap-3 font-bold animate-shake';
                    } else {
                        btn.className = 'w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 opacity-50 flex items-center gap-3';
                    }
                }
            });

            const fb = document.getElementById('quizFeedbackArea');
            if (fb) {
                fb.classList.remove('hidden');
                fb.className = isCorrect ? 'p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 space-y-1' : 'p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 space-y-1';
                fb.innerHTML = `
                    <div class="text-xs font-black ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'} flex items-center gap-1.5">
                        <span>${isCorrect ? '✔ Chính xác (+5 XP)' : '✕ Chưa chính xác'}</span>
                    </div>
                    <p class="text-xs text-slate-700 dark:text-slate-300">${selected.explanation}</p>
                `;
            }

            this.playFeedbackAudio(isCorrect);
            if (isCorrect && window.state) {
                window.state.xp = (window.state.xp || 0) + 5;
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            }
        },

        // TAB 4: GÕ CHÍNH TẢ & PHÁT ÂM (DICTATION)
        renderTabSpellingHtml(w) {
            return `
                <div class="space-y-6 max-w-lg mx-auto text-center">
                    <div>
                        <span class="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[11px] uppercase tracking-wider">
                            GÕ CHÍNH TẢ & PHÁT ÂM
                        </span>
                        <h3 class="text-lg font-black text-slate-900 dark:text-white mt-2">Nghe audio và gõ lại đúng từng ký tự</h3>
                        <p class="text-xs text-slate-500">Giúp não bộ ghi nhớ sâu mặt chữ và phản xạ chính tả chuẩn xác.</p>
                    </div>

                    <!-- Audio Trigger -->
                    <div class="py-2">
                        <button onclick="VocabularyEngine.speakWord('${w.word}', 'US')" class="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30 transition hover:scale-110 active:scale-95" title="Phát âm từ">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>

                    <!-- Input Box -->
                    <div class="space-y-3">
                        <div class="relative">
                            <input id="spellingInput" onkeydown="if(event.key==='Enter') VocabularyEngine.checkSpelling();" type="text" placeholder="Gõ từ tại đây..." autocomplete="off" class="w-full text-center py-3.5 px-4 rounded-2xl border-2 border-purple-200 dark:border-slate-700 text-lg font-black text-purple-900 dark:text-purple-200 focus:outline-none focus:border-purple-600 shadow-inner">
                        </div>

                        <!-- Gợi ý ký tự -->
                        <div class="flex items-center justify-between text-xs text-slate-400">
                            <span>Gợi ý: <code class="font-mono text-purple-600 dark:text-purple-400 font-bold">${w.dictationHint || w.word.slice(0, 2) + '...'}</code></span>
                            <button onclick="VocabularyEngine.revealSpellingHint()" class="text-purple-600 hover:underline font-bold">Mở thêm ký tự</button>
                        </div>

                        <button onclick="VocabularyEngine.checkSpelling()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition">
                            Kiểm tra chính tả (Enter)
                        </button>
                    </div>

                    <div id="spellingFeedback" class="hidden p-3.5 rounded-2xl text-xs font-bold"></div>
                </div>
            `;
        },

        checkSpelling() {
            const w = this.currentWords[this.currentWordIndex];
            const inp = document.getElementById('spellingInput');
            const fb = document.getElementById('spellingFeedback');
            if (!inp || !fb) return;

            const val = inp.value.trim().toLowerCase();
            const target = w.word.trim().toLowerCase();

            fb.classList.remove('hidden');
            if (val === target) {
                fb.className = 'p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold';
                fb.innerHTML = '🎉 Chính xác 100%! Bạn đã nắm chắc chính tả từ này.';
                this.playFeedbackAudio(true);
            } else {
                fb.className = 'p-3.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 font-bold animate-shake';
                fb.innerHTML = `Chưa đúng rồi! Từ chính xác là: <strong class="underline">${w.word}</strong>. Hãy thử lại nhé!`;
                this.playFeedbackAudio(false);
            }
        },

        revealSpellingHint() {
            const w = this.currentWords[this.currentWordIndex];
            const inp = document.getElementById('spellingInput');
            if (inp) {
                inp.value = w.word.slice(0, Math.ceil(w.word.length / 2));
                inp.focus();
            }
        },

        // TAB 5: ĐÁNH GIÁ SPACED REPETITION (SRS)
        renderTabSrsHtml(w) {
            const currentSched = this.srsScheduleMap[w.id] || { stage: 'Mới học', intervalDays: 1 };

            return `
                <div class="space-y-6 max-w-lg mx-auto text-center">
                    <div>
                        <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[11px] uppercase tracking-wider">
                            ĐÁNH GIÁ GHI NHỚ NGẮT QUÃNG (SRS)
                        </span>
                        <h3 class="text-lg font-black text-slate-900 dark:text-white mt-2">Mức độ ghi nhớ từ "${w.word}"</h3>
                        <p class="text-xs text-slate-500">Hệ thống thuật toán SM-2 sẽ tự động lên lịch nhắc nhở bạn ôn tập vào thời điểm tối ưu.</p>
                    </div>

                    <!-- Current Stage Badge -->
                    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                        Trạng thái hiện tại: <span class="text-purple-600 font-extrabold">${currentSched.stage || 'Mới tiếp cận'}</span>
                    </div>

                    <!-- 4 SRS Rating Buttons -->
                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <button onclick="VocabularyEngine.rateSrs(1)" class="p-4 rounded-2xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-900 text-xs font-black transition space-y-1">
                            <div class="text-lg">🔴</div>
                            <div>Quên hoàn toàn</div>
                            <div class="text-[10px] text-rose-600 font-normal">Ôn lại ngay hôm nay</div>
                        </button>

                        <button onclick="VocabularyEngine.rateSrs(2)" class="p-4 rounded-2xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-black transition space-y-1">
                            <div class="text-lg">🟡</div>
                            <div>Mơ hồ</div>
                            <div class="text-[10px] text-amber-700 font-normal">Ôn lại ngày mai (1 ngày)</div>
                        </button>

                        <button onclick="VocabularyEngine.rateSrs(3)" class="p-4 rounded-2xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 text-xs font-black transition space-y-1">
                            <div class="text-lg">🟢</div>
                            <div>Đã nhớ</div>
                            <div class="text-[10px] text-blue-700 font-normal">Ôn lại sau 3 ngày</div>
                        </button>

                        <button onclick="VocabularyEngine.rateSrs(4)" class="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 text-xs font-black transition space-y-1">
                            <div class="text-lg">💎</div>
                            <div>Thành thạo</div>
                            <div class="text-[10px] text-emerald-700 font-normal">Ôn lại sau 7 ngày</div>
                        </button>
                    </div>
                </div>
            `;
        },

        rateSrs(score) {
            const w = this.currentWords[this.currentWordIndex];
            const daysMap = { 1: 0, 2: 1, 3: 3, 4: 7 };
            const stageMap = { 1: 'Cần ôn gấp', 2: 'Đang ghi nhớ', 3: 'Đã thuộc vững', 4: 'Thành thạo chuyên sâu' };

            this.srsScheduleMap[w.id] = {
                intervalDays: daysMap[score],
                stage: stageMap[score],
                lastReviewed: new Date().toISOString()
            };
            this.saveState();

            showToast(`📅 Đã xếp lịch ôn từ "${w.word}": ${stageMap[score]}`);
            setTimeout(() => this.nextWord(), 500);
        },

        // =========================================================================
        // STUDIO ACTIONS: FLIP, TABS, JUMP, MASTER, BOOKMARK
        // =========================================================================
        flipCard() {
            this.isFlipped = !this.isFlipped;
            this.renderStudyWorkspace();
            this.playFlipSound();
        },

        switchStudyTab(tabName) {
            this.activeStudyTab = tabName;
            this.renderStudyWorkspace();
        },

        jumpToWord(index) {
            this.currentWordIndex = index;
            this.isFlipped = false;
            this.renderStudyWorkspace();
            if (this.autoPronounce) {
                const w = this.currentWords[this.currentWordIndex];
                if (w) this.speakWord(w.word, 'US');
            }
        },

        nextWord() {
            if (this.currentWordIndex < this.currentWords.length - 1) {
                this.currentWordIndex++;
                this.isFlipped = false;
                this.renderStudyWorkspace();
                if (this.autoPronounce) {
                    const w = this.currentWords[this.currentWordIndex];
                    if (w) this.speakWord(w.word, 'US');
                }
            } else {
                showToast('🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ danh sách từ của chủ đề này!');
            }
        },

        prevWord() {
            if (this.currentWordIndex > 0) {
                this.currentWordIndex--;
                this.isFlipped = false;
                this.renderStudyWorkspace();
            }
        },

        skipWord() {
            showToast('⚪ Đã chuyển sang từ tiếp theo');
            this.nextWord();
        },

        markMastered() {
            const w = this.currentWords[this.currentWordIndex];
            this.masteredWordsMap[w.id] = true;
            this.saveState();
            this.playFeedbackAudio(true);

            if (window.state) {
                window.state.xp = (window.state.xp || 0) + 5;
                window.state.vocabLearned = (window.state.vocabLearned || 0) + 1;
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            }

            showToast(`✨ Đã ghi nhận thuộc từ: "${w.word}" (+5 XP)`);
            setTimeout(() => this.nextWord(), 400);
        },

        markUnmastered() {
            const w = this.currentWords[this.currentWordIndex];
            this.masteredWordsMap[w.id] = false;
            this.saveState();
            showToast(`Đã lưu từ "${w.word}" vào danh sách cần luyện lại!`);
            this.nextWord();
        },

        toggleBookmarkCurrentWord() {
            const w = this.currentWords[this.currentWordIndex];
            const isSaved = !this.bookmarkedWordsMap[w.id];
            this.bookmarkedWordsMap[w.id] = isSaved;
            this.saveState();
            this.renderStudyWorkspace();
            showToast(isSaved ? `🔖 Đã lưu "${w.word}" vào Sổ tay từ vựng` : `Đã bỏ lưu "${w.word}"`);
        },

        toggleAutoPronounce() {
            this.autoPronounce = !this.autoPronounce;
            this.renderStudyWorkspace();
            showToast(this.autoPronounce ? '🔊 Đã bật tự động phát âm khi đổi từ' : '🔊 Đã tắt tự động phát âm');
        },

        toggleFastStudy() {
            this.fastStudyMode = !this.fastStudyMode;
            this.renderStudyWorkspace();
            showToast(this.fastStudyMode ? '⚡ Đã kích hoạt chế độ học nhanh' : '⚡ Đã tắt chế độ học nhanh');
        },

        // =========================================================================
        // MÀN HÌNH 3: ĐẤU TRƯỜNG GHÉP CỤM TỪ GAMIFIED (/vocabulary/match)
        // =========================================================================
        startMatchGame(tier = 'ALL') {
            this.matchLevelFilter = tier;
            this.selectedLeftId = null;
            this.selectedRightId = null;
            this.matchedItemIds = [];
            this.matchComboStreak = 0;
            this.matchEarnedXP = 0;
            this.isMatchLocked = false;

            // Filter items by level
            let pool = [...collocationMatchBank];
            if (tier !== 'ALL') {
                const targetTier = tier.replace('tier_', '').replace('_', '-');
                pool = pool.filter(p => p.level === targetTier || (targetTier === '0-500' && p.level === '0-500') || (targetTier === '600' && p.level === '600+') || (targetTier === '800' && p.level === '800+'));
                if (pool.length === 0) pool = [...collocationMatchBank];
            }

            // Shuffle and pick 5 pairs
            const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
            this.matchCurrentItems = shuffled;

            // Prepare 5 left (English) and 5 right (Vietnamese shuffled)
            this.matchLeftItems = [...shuffled].sort(() => Math.random() - 0.5);
            this.matchRightItems = [...shuffled].sort(() => Math.random() - 0.5);

            // Start timer
            if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);
            this.matchTimerSeconds = 0;
            this.matchTimerInterval = setInterval(() => {
                this.matchTimerSeconds++;
                const timerEl = document.getElementById('matchTimerDisplay');
                if (timerEl) {
                    const mins = String(Math.floor(this.matchTimerSeconds / 60)).padStart(2, '0');
                    const secs = String(this.matchTimerSeconds % 60).padStart(2, '0');
                    timerEl.textContent = `${mins}:${secs}`;
                }
            }, 1000);

            this.renderMatchArena();
        },

        renderMatchArena() {
            const container = document.getElementById('view-vocabulary-match');
            if (!container) return;

            const isAllCompleted = this.matchedItemIds.length === this.matchCurrentItems.length && this.matchCurrentItems.length > 0;

            container.innerHTML = `
                <div class="space-y-5 pb-20 max-w-5xl mx-auto">
                    <!-- 5.2. HEADER ARENA & TOOLBAR -->
                    <div class="glass-panel rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-slate-800 shadow-sm space-y-4">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <button onclick="VocabularyEngine.navigateToHub()" class="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition shadow-xs" title="Quay lại">
                                    <i class="fa-solid fa-arrow-left text-xs"></i>
                                </button>
                                <div>
                                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10.5px] font-black uppercase tracking-wider">Trò chơi tương tác</span>
                                    <h1 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                                        Ghép cụm từ & Collocation TOEIC Gamified
                                    </h1>
                                    <p class="text-xs text-slate-500">Chọn 1 cụm từ tiếng Anh bên trái và ghép với nghĩa tiếng Việt tương ứng bên phải.</p>
                                </div>
                            </div>

                            <!-- Right Toolset: Combo Streak, Timer & Reset -->
                            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <!-- Combo Badge -->
                                <div class="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-md flex items-center gap-1.5">
                                    <span class="text-base animate-pulse">🔥</span>
                                    <span>Combo x${this.matchComboStreak}!</span>
                                </div>

                                <!-- Timer -->
                                <div class="px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-xs font-black border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                                    <i class="fa-regular fa-clock text-purple-600"></i>
                                    <span id="matchTimerDisplay">00:00</span>
                                </div>

                                <!-- Reset Button -->
                                <button onclick="VocabularyEngine.startMatchGame(VocabularyEngine.matchLevelFilter)" class="px-3.5 py-1.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
                                    <i class="fa-solid fa-rotate"></i>
                                    <span>Đổi bộ mới</span>
                                </button>
                            </div>
                        </div>

                        <!-- Level Filter Segmented Bar -->
                        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span class="font-bold text-slate-400 mr-1">Lọc cấp độ:</span>
                            <button onclick="VocabularyEngine.startMatchGame('ALL')" class="px-3 py-1 rounded-xl font-bold transition ${this.matchLevelFilter === 'ALL' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                                Tất cả
                            </button>
                            <button onclick="VocabularyEngine.startMatchGame('0-500')" class="px-3 py-1 rounded-xl font-bold transition ${this.matchLevelFilter === '0-500' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}">
                                🌱 0-500: Căn bản
                            </button>
                            <button onclick="VocabularyEngine.startMatchGame('600+')" class="px-3 py-1 rounded-xl font-bold transition ${this.matchLevelFilter === '600+' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'}">
                                🚀 600+: Ra trường
                            </button>
                            <button onclick="VocabularyEngine.startMatchGame('800+')" class="px-3 py-1 rounded-xl font-bold transition ${this.matchLevelFilter === '800+' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
                                👑 800+: Nâng cao
                            </button>
                        </div>
                    </div>

                    <!-- 5.3. INTERACTIVE 2-COLUMN MATCH BOARD -->
                    <div class="relative">
                        <!-- Popover câu ví dụ 2 giây khi ghép đúng -->
                        <div id="matchSentencePopover" class="hidden absolute top-2 left-1/2 -translate-x-1/2 z-30 max-w-md w-full bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl text-center space-y-1 transition-all duration-300"></div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Cột Trái: 5 Cụm Tiếng Anh -->
                            <div class="space-y-3">
                                <div class="text-xs font-black uppercase text-purple-700 dark:text-purple-300 flex items-center gap-1.5 pb-1">
                                    <span>🇬🇧 Cụm từ Tiếng Anh</span>
                                </div>
                                ${this.matchLeftItems.map(item => {
                                    const isMatched = this.matchedItemIds.includes(item.id);
                                    const isSelected = this.selectedLeftId === item.id;
                                    let cls = 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer shadow-xs';
                                    
                                    if (isMatched) {
                                        cls = 'bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 opacity-60 pointer-events-none';
                                    } else if (isSelected) {
                                        cls = 'ring-2 ring-indigo-500 shadow-lg bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-400 match-glow-selected';
                                    }

                                    return `
                                        <div id="match-card-left-${item.id}" onclick="VocabularyEngine.handleSelectMatchLeft('${item.id}')" class="p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${cls}">
                                            <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">${item.english}</span>
                                            <i class="fa-solid fa-link text-xs text-indigo-500 ${isSelected ? 'fa-spin' : ''}"></i>
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Cột Phải: 5 Nghĩa Tiếng Việt -->
                            <div class="space-y-3">
                                <div class="text-xs font-black uppercase text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 pb-1">
                                    <span>🇻🇳 Bản dịch Tiếng Việt</span>
                                </div>
                                ${this.matchRightItems.map(item => {
                                    const isMatched = this.matchedItemIds.includes(item.id);
                                    let cls = 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer shadow-xs';

                                    if (isMatched) {
                                        cls = 'bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 opacity-60 pointer-events-none';
                                    }

                                    return `
                                        <div id="match-card-right-${item.id}" onclick="VocabularyEngine.handleSelectMatchRight('${item.id}')" class="p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${cls}">
                                            <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">${item.vietnamese}</span>
                                            ${isMatched ? '<span class="text-emerald-600 font-bold text-xs">✔</span>' : '<span class="text-slate-300">○</span>'}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- VICTORY MODAL / BANNER KHI HOÀN THÀNH CẢ 5 CẶP -->
                    ${isAllCompleted ? `
                        <div class="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 text-center space-y-4 shadow-xl bg-gradient-to-br from-emerald-50/90 via-teal-50/80 to-white dark:from-slate-800 dark:to-slate-850 animate-bounce-short">
                            <div class="text-4xl">🎉 🏆 ✨</div>
                            <h2 class="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200">
                                Xuất sắc! Bạn đã hoàn thành Đấu trường Ghép cụm từ!
                            </h2>
                            <p class="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                                Thời gian hoàn thành: <strong>${this.matchTimerSeconds}s</strong> • Nhận thưởng: <strong class="text-purple-600 font-black">+${this.matchEarnedXP || 50} XP</strong>
                            </p>
                            <div class="flex items-center justify-center gap-3 pt-2">
                                <button onclick="VocabularyEngine.startMatchGame(VocabularyEngine.matchLevelFilter)" class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 hover:scale-105 active:scale-95 transition">
                                    Chơi tiếp bộ khác ➔
                                </button>
                                <button onclick="VocabularyEngine.navigateToHub()" class="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition">
                                    Quay về Trung tâm từ vựng
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        },

        handleSelectMatchLeft(id) {
            if (this.isMatchLocked) return;
            if (this.matchedItemIds.includes(id)) return;
            this.selectedLeftId = id;
            this.renderMatchArena();
        },

        handleSelectMatchRight(id) {
            if (this.isMatchLocked) return;
            if (!this.selectedLeftId) {
                showToast('👉 Hãy chọn 1 cụm từ tiếng Anh ở cột bên trái trước nhé!');
                return;
            }

            const leftCard = document.getElementById(`match-card-left-${this.selectedLeftId}`);
            const rightCard = document.getElementById(`match-card-right-${id}`);

            if (this.selectedLeftId === id) {
                // MATCH SUCCESS!
                this.matchedItemIds.push(id);
                this.matchComboStreak++;
                const bonusXP = 10 * this.matchComboStreak;
                this.matchEarnedXP += bonusXP;

                if (window.state) {
                    window.state.xp = (window.state.xp || 0) + bonusXP;
                    window.state.vocabLearned = (window.state.vocabLearned || 0) + 1;
                    if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
                }

                this.playFeedbackAudio(true);

                // Show 2-second sentence popover
                const matchedItem = this.matchCurrentItems.find(item => item.id === id);
                if (matchedItem) {
                    this.showSentencePopover(matchedItem.english, matchedItem.exampleSentence);
                }

                this.selectedLeftId = null;
                this.renderMatchArena();

                if (this.matchedItemIds.length === this.matchCurrentItems.length) {
                    if (this.matchTimerInterval) clearInterval(this.matchTimerInterval);
                }
            } else {
                // MATCH ERROR!
                this.isMatchLocked = true;
                this.matchComboStreak = 0;
                this.playFeedbackAudio(false);

                if (leftCard) leftCard.classList.add('animate-shake', 'border-rose-500', 'bg-rose-50/80');
                if (rightCard) rightCard.classList.add('animate-shake', 'border-rose-500', 'bg-rose-50/80');

                setTimeout(() => {
                    this.selectedLeftId = null;
                    this.isMatchLocked = false;
                    this.renderMatchArena();
                }, 650);
            }
        },

        showSentencePopover(phrase, sentence) {
            const pop = document.getElementById('matchSentencePopover');
            if (!pop) return;

            pop.classList.remove('hidden');
            pop.innerHTML = `
                <div class="text-[11px] font-black uppercase text-emerald-700">✨ Ghép đúng! Ngữ cảnh sử dụng:</div>
                <p class="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">${sentence}</p>
            `;

            setTimeout(() => {
                if (pop) pop.classList.add('hidden');
            }, 2500);
        },

        // =========================================================================
        // AUDIO & SPEECH SYNTHESIS ENGINE
        // =========================================================================
        playFeedbackAudio(isCorrect) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const ctx = new AudioContext();

                if (isCorrect) {
                    // DING sound (D5 -> A5 chime)
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15);
                    gain.gain.setValueAtTime(0.18, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.35);
                } else {
                    // BUZZ sound (150Hz low saw)
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(160, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
                    gain.gain.setValueAtTime(0.15, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.25);
                }
            } catch (e) {}
        },

        playFlipSound() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
            } catch (e) {}
        },

        speakWord(text, accent = 'US') {
            if (typeof window.speechSynthesis !== 'undefined') {
                window.speechSynthesis.cancel();
                const ut = new SpeechSynthesisUtterance(text);
                ut.lang = accent === 'UK' ? 'en-GB' : 'en-US';
                ut.rate = 0.9;
                window.speechSynthesis.speak(ut);
            }
        },

        speakText(text) {
            if (typeof window.speechSynthesis !== 'undefined') {
                window.speechSynthesis.cancel();
                const ut = new SpeechSynthesisUtterance(text);
                ut.lang = 'en-US';
                ut.rate = 0.95;
                window.speechSynthesis.speak(ut);
            }
        }
    };

    // Export ra global window
    window.VocabularyEngine = VocabularyEngine;

    // Tự động khởi chạy khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VocabularyEngine.init());
    } else {
        VocabularyEngine.init();
    }
})();
