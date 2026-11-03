/**
 * =========================================================================
 * AI "VÌ SAO EM SAI?" EXPLANATION ENGINE (GEMINI 3.8 FLASH + 3-TIER GATEWAY)
 * =========================================================================
 * Phân tích lỗi sai tâm lý sinh viên hài hước, hóm hỉnh, sâu sắc:
 * - Tier 1: Google Gemini 3.8 Flash (Model chính thức qua @google/genai SDK, timeout 6000ms)
 * - Tier 2: OpenRouter API Fallback (nếu có OPENROUTER_API_KEY, timeout 6000ms)
 * - Tier 3: Offline Rule-Based Humor Engine (Chuẩn hóa 12 bẫy tử huyệt ETS TRAP-01..12, 0% sập)
 * =========================================================================
 */

'use strict';

let GoogleGenAI = null;
try {
    const genaiModule = require('@google/genai');
    GoogleGenAI = genaiModule.GoogleGenAI;
} catch (e) {
    // Sẽ dùng HTTPS fetch hoặc offline fallback
}

// 12 Bẫy Tử Huyệt ETS chuẩn hóa 4 phần: Tiếng lòng sinh viên, Bóc mẽ bẫy ETS, Vì sao đúng, Mẹo 3 giây
const TRAP_01_EXP = (q, ua, ca) => 
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Nghe loáng thoáng có từ vựng quen thuộc về đồ vật trong tranh là em phản xạ tick vội đúng không?
2. 🕳️ BÓC MẼ BẪY ETS: Tranh tĩnh không người (is being V3)! Tranh không người không được dùng bị động tiếp diễn (is being V3). Đồ vật chỉ đang nằm yên chứ không có người tương tác.
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'B'}" mới chuẩn xác vì dùng thì đơn giản mô tả trạng thái tĩnh của đồ vật.
4. ⚡ MẸO 3 GIÂY: Thần chú phòng thi: "Thấy BEING là phải thấy NGƯỜI ĐANG HÀNH ĐỘNG", tranh không người loại ngay đáp án có being!`;

const TRAP_02_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Nhìn thấy người đang mặc áo hoặc đội mũ là chọn ngay đáp án có "wear" hoặc "put on" không cần suy nghĩ!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy trạng thái vs hành động (wearing vs putting on). Đã mặc ngay ngắn là wearing, còn tay đang cài cúc/kéo khóa mới là putting on!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'A'}" mới chuẩn vì miêu tả đúng hành động thực tế của người trong ảnh.
4. ⚡ MẸO 3 GIÂY: Tay chạm cúc/kéo khóa = putting on. Đã mặc ngay ngắn = wearing!`;

const TRAP_03_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Vừa nghe câu hỏi có từ gì là mắt sáng lên, thấy đáp án phát âm hao hao là khoanh vội!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy từ đồng âm & gần âm gây nhiễu (Similar Sound). Câu hỏi "coffee" mà đáp án có "copy", phát âm hao hao để đánh lừa phản xạ!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'C'}" mới chuẩn vì trả lời trực diện thông điệp mà không dùng chiêu lặp từ.
4. ⚡ MẸO 3 GIÂY: Nghe thấy từ lặp lại hoặc từ đồng âm giống câu hỏi -> 90% là bẫy lừa, gạch ngay!`;

const TRAP_04_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Em chờ nghe một câu trả lời trực diện ngắn gọn, không thấy là lúng túng chọn bừa!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy câu trả lời né tránh / gián tiếp (Indirect Answer). Người ta không trả lời thẳng mà đá trách nhiệm hoặc bắc cầu thông tin!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'B'}" mới chuẩn vì đưa ra giải pháp thực tế ("Hỏi chị Linh xem", "Tôi chưa kiểm tra").
4. ⚡ MẸO 3 GIÂY: Gặp câu trả lời gián tiếp né trách nhiệm -> 99% là đáp án đúng của Part 2!`;

const TRAP_05_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Nghe ngữ điệu tự tin có "Yes" hoặc "No" là yên tâm khoanh ngay!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy Yes/No cho câu hỏi Wh-! Câu hỏi bắt đầu bằng Who, Where, When, Why, How tuyệt đối KHÔNG BAO GIỜ trả lời bằng Yes/No!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'C'}" mới chuẩn vì trực tiếp cung cấp thông tin đối tượng/địa điểm/thời gian mà câu hỏi tìm kiếm.
4. ⚡ MẸO 3 GIÂY: Câu hỏi Wh- -> Loại ngay tắp lự bất kỳ đáp án nào bắt đầu bằng Yes/No/Sure!`;

const TRAP_06_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Vừa nghe thấy từ khóa ở 3 giây đầu tiên là vội vàng khoanh ngay rồi ngưng nghe đoạn sau!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy đổi ý phút chót! Đừng vội chọn phương án nghe thấy đầu tiên khi có từ "Wait/Actually". Người nói đưa ra phương án ban đầu nhưng lập tức bẻ lái sang phương án khác!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'Oak Suite'}" mới chuẩn vì là quyết định chốt hạ sau khi người nói đã cân nhắc.
4. ⚡ MẸO 3 GIÂY: Bắt ngay các từ bẻ lái: Wait, Actually, But, However, On second thought -> Đáp án nằm ngay sau từ bẻ lái!`;

const TRAP_07_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Cố gắng dịch từng từ theo nghĩa đen của câu trích dẫn rồi chọn nghĩa từ điển!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy hàm ý người nói (Speaker Intent). Câu hỏi "Why does the speaker say...?" yêu cầu suy luận ý đồ sâu xa, không được dịch nghĩa đen!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'D'}" mới chuẩn vì phản ánh đúng thái độ mỉa mai, than phiền hoặc nhắc nhở trong ngữ cảnh.
4. ⚡ MẸO 3 GIÂY: Đặt câu nói vào bối cảnh: Người nói đang vui, bực mình hay cần nhờ vả để chọn hàm ý!`;

const TRAP_08_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Audio vừa vang lên thông tin là em bắt ngay từ khóa rồi chọn phương án có con số/tên gọi đó đúng không?
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy nhìn nhầm bảng biểu đối chiếu (Graphic / Table Trap). Audio nói thông tin ở Cột A thì câu hỏi lại hỏi dữ kiện tương ứng ở Cột B đối diện! Em chọn đáp án Cột A là dính bẫy nguyên xi của ETS.
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'B'}" mới chuẩn vì là giá trị đối chiếu ở cột mục tiêu theo đúng câu hỏi.
4. ⚡ MẸO 3 GIÂY: Quy tắc ngón tay dò bảng: Audio nói cột nào thì mắt liếc sang cột đối diện để chọn đáp án!`;

const TRAP_09_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Thấy đuôi từ nhìn quen mắt (như -ive, -al) là mặc định đó là tính từ rồi chọn theo cảm tính!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy từ loại đặc biệt & vị trí ngữ pháp (-ive, -al). Đứng sau mạo từ "the" hoặc tính từ sở hữu cần Danh từ, mà "initiative/representative" lại là Danh từ danh giá!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'initiative'}" mới chuẩn vì là danh từ hợp lệ hoàn chỉnh cấu trúc ngữ pháp câu.
4. ⚡ MẸO 3 GIÂY: Học thuộc danh từ đuôi -ive: initiative, representative, alternative, objective!`;

const TRAP_10_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Thấy nghĩa tiếng Việt của "Although" với "Despite" đều là "mặc dù", nên thấy quen mắt là khoanh đại đúng không?
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy liên từ vs giới từ mệnh đề (Conjunction vs Preposition). ETS cố tình cho các cặp từ cùng nghĩa để bẫy sinh viên không phân biệt được mệnh đề và cụm danh từ!
3. 🎯 VÌ SAO ĐÚNG: Phía sau chỗ trống là mệnh đề có S + V nên bắt buộc phải dùng Liên từ như "${ca || 'defer'}", không được dùng giới từ!
4. ⚡ MẸO 3 GIÂY: Sau chỗ trống có động từ chia thì -> Chọn liên từ (Although/Because). Chỉ có cụm danh từ -> Chọn giới từ (Despite/Due to)!`;

const TRAP_11_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Đọc câu cần điền thấy thuận tai là nhét vào vị trí trống mà không nhìn câu trước câu sau!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy điền câu & liên kết logic đoạn văn. Điền câu vào làm đứt gãy mạch cảm xúc hoặc mâu thuẫn với đại từ chỉ định (this, these changes)!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'C'}" mới chuẩn vì khớp hoàn hảo về mặt thời gian, chủ thể và đại từ bắc cầu với câu liền kề.
4. ⚡ MẸO 3 GIÂY: Tìm "vết chân" đại từ: Nếu câu sau có "These issues", câu cần điền BẮT BUỘC phải kể ra các vấn đề!`;

const TRAP_12_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Đọc xong đoạn văn thứ nhất thấy có keyword là mừng rỡ khoanh luôn mà không thèm đọc văn bản thứ hai!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy xâu chuỗi đa văn bản (Cross-Reference Trap). Thông tin ở bài 1 chỉ là điều kiện cần, phải đối chiếu với bài 2 mới ra kết quả cuối cùng!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${ca || 'D'}" mới chuẩn vì là kết quả tổng hợp sau khi lấy dữ kiện văn bản 1 nhân với chính sách văn bản 2.
4. ⚡ MẸO 3 GIÂY: Câu hỏi có từ khóa rơi vào Bài 1 nhưng đáp án hỏi sâu -> Bắt buộc phải xâu chuỗi chéo sang Bài 2 hoặc Bài 3!`;

// Bảng ánh xạ đa năng hỗ trợ: Canonical ID (TRAP-01..12), Code (P1-BEING..), Slug cũ (trap-part1-..)
const TRAP_TENSE_EXP = (q, ua, ca) =>
`1. 🎭 TIẾNG LÒNG SINH VIÊN: Thấy trạng từ thời gian là vội vàng chọn thì trong quá khứ hoặc hiện tại theo quán tính mà quên xét sự hòa hợp chủ vị!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy chia thì động từ (Verb Tense & Agreement Trap). ETS lồng ghép trạng từ gây nhiễu để đánh lừa thì của câu hoặc chia sai số ít/số nhiều.
3. 🎯 VÌ SAO ĐÚNG: Động từ "${ca || 'has completed'}" chia đúng thì và hòa hợp hoàn hảo với chủ ngữ của mệnh đề chính.
4. ⚡ MẸO 3 GIÂY: Xác định chủ ngữ chính và mốc thời gian trước khi chọn dạng chia động từ!`;

const OFFLINE_TRAP_EXPLANATIONS = {
    // TRAP-01
    'TRAP-01': TRAP_01_EXP,
    'P1-BEING': TRAP_01_EXP,
    'trap-part1-being-been': TRAP_01_EXP,

    // TRAP-02
    'TRAP-02': TRAP_02_EXP,
    'P1-ACTION': TRAP_02_EXP,
    'trap-part1-wrong-action': TRAP_02_EXP,

    // TRAP-03
    'TRAP-03': TRAP_03_EXP,
    'P12-SOUND': TRAP_03_EXP,
    'P2-HOMOPHONE': TRAP_03_EXP,
    'p2-homophone': TRAP_03_EXP,
    'P2-OVERLAP': TRAP_03_EXP,
    'p2-overlap': TRAP_03_EXP,
    'trap-part2-same-sound': TRAP_03_EXP,

    // TRAP-04
    'TRAP-04': TRAP_04_EXP,
    'P2-INDIRECT': TRAP_04_EXP,
    'trap-part2-avoidance': TRAP_04_EXP,

    // TRAP-05
    'TRAP-05': TRAP_05_EXP,
    'P2-YESNO': TRAP_05_EXP,
    'trap-part2-yes-no-wh': TRAP_05_EXP,

    // TRAP-06
    'TRAP-06': TRAP_06_EXP,
    'P3-REVERSAL': TRAP_06_EXP,
    'P34-REVERSAL': TRAP_06_EXP,
    'p34-reversal': TRAP_06_EXP,
    'P34-DISTRACTOR': TRAP_06_EXP,
    'p34-distractor': TRAP_06_EXP,
    'trap-part3-last-minute-change': TRAP_06_EXP,
    'trap-part3-distractor-swap': TRAP_06_EXP,

    // TRAP-07
    'TRAP-07': TRAP_07_EXP,
    'P34-INTENT': TRAP_07_EXP,
    'trap-part4-speaker-intent': TRAP_07_EXP,

    // TRAP-08
    'TRAP-08': TRAP_08_EXP,
    'P34-GRAPHIC': TRAP_08_EXP,
    'trap-part4-graphic-table': TRAP_08_EXP,

    // TRAP-09
    'TRAP-09': TRAP_09_EXP,
    'P5-POS': TRAP_09_EXP,
    'P5-WORDFORM': TRAP_09_EXP,
    'p5-wordform': TRAP_09_EXP,
    'P5-TENSE': TRAP_TENSE_EXP,
    'p5-tense': TRAP_TENSE_EXP,
    'trap-part5-word-form': TRAP_09_EXP,
    'trap-part5-confusing-vocab': TRAP_09_EXP,

    // TRAP-10
    'TRAP-10': TRAP_10_EXP,
    'P5-PREPCONJ': TRAP_10_EXP,
    'trap-part5-prep-conj': TRAP_10_EXP,

    // TRAP-11
    'TRAP-11': TRAP_11_EXP,
    'P6-INSERT': TRAP_11_EXP,
    'trap-part6-sentence-insertion': TRAP_11_EXP,

    // TRAP-12
    'TRAP-12': TRAP_12_EXP,
    'P7-CROSSREF': TRAP_12_EXP,
    'trap-part7-cross-reference': TRAP_12_EXP
};

function withTimeout(promise, timeoutMs = 6000) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                reject(new Error(`Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        })
    ]);
}

class AiExplanationEngine {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.openRouterKey = process.env.OPENROUTER_API_KEY || '';
    }

    async explainMistake({ question, userAnswer, correctAnswer, part, trapCategory }) {
        // Tier 1: Google Gemini 3.8 Flash (với timeout 6000ms chống treo)
        if (this.apiKey) {
            try {
                const explanation = await withTimeout(
                    this.callGemini38Flash({ question, userAnswer, correctAnswer, part, trapCategory }),
                    6000
                );
                if (explanation) {
                    return { success: true, explanation, provider: 'gemini-3.8-flash' };
                }
            } catch (err) {
                console.warn('[AI Engine] Gemini 3.8 Flash call failed, trying Tier 2:', err.message);
            }
        }

        // Tier 2: OpenRouter API Fallback (với timeout 6000ms)
        if (this.openRouterKey) {
            try {
                const explanation = await withTimeout(
                    this.callOpenRouter({ question, userAnswer, correctAnswer, part, trapCategory }),
                    6000
                );
                if (explanation) {
                    return { success: true, explanation, provider: 'openrouter' };
                }
            } catch (err) {
                console.warn('[AI Engine] OpenRouter call failed, falling back to Tier 3:', err.message);
            }
        }

        // Tier 3: Offline Rule-Based Humor Engine (0% Crash, phản hồi tức thì)
        const explanation = this.generateOfflineExplanation({ question, userAnswer, correctAnswer, part, trapCategory });
        return { success: true, explanation, provider: 'offline-rules' };
    }

    async callGemini38Flash({ question, userAnswer, correctAnswer, part, trapCategory }) {
        if (!GoogleGenAI) {
            const genaiModule = require('@google/genai');
            GoogleGenAI = genaiModule.GoogleGenAI;
        }

        const client = new GoogleGenAI({ apiKey: this.apiKey });
        const systemPrompt = `Bạn là Gia Sư AI Sói Mây của ứng dụng luyện thi TOEIC "Tôi đi đâu đó". 
Phong cách của bạn:
- Cực kỳ hài hước, hóm hỉnh, thấu hiểu tâm lý sinh viên đại học lười học hay mất gốc.
- Bắt buộc trả lời theo cấu trúc chuẩn xác 4 phần:
  1. 🎭 TIẾNG LÒNG SINH VIÊN: Vì sao bạn ấy dễ chọn nhầm phương án sai đó?
  2. 🕳️ BÓC MẼ BẪY ETS: Chỉ đích danh bẫy của ETS trong đề thi.
  3. 🎯 VÌ SAO ĐÚNG: Lý do vì sao đáp án đúng mới chuẩn ngữ pháp/ngữ cảnh.
  4. ⚡ MẸO 3 GIÂY: Thần chú phản xạ phòng thi ngắn gọn 1 câu.
- Dùng ngôn ngữ gen Z dí dỏm, độ dài khoảng 4-6 câu súc tích.`;

        const userPrompt = `Hãy giải thích vì sao học viên làm sai câu này:
- Phần thi: Part ${part || 5}
- Dạng bẫy: ${trapCategory || 'Bẫy tổng hợp'}
- Câu hỏi / Ngữ cảnh: ${question || 'N/A'}
- Đáp án học viên chọn (SAI): ${userAnswer || 'N/A'}
- Đáp án chính xác (ĐÚNG): ${correctAnswer || 'N/A'}

Hãy phân tích theo chuẩn 4 phần: Tiếng lòng, Bóc mẽ bẫy, Vì sao đúng, Mẹo 3 giây!`;

        const interaction = await client.interactions.create({
            model: 'gemini-3.8-flash',
            input: `${systemPrompt}\n\n${userPrompt}`
        });

        return interaction.output_text || null;
    }

    async callOpenRouter({ question, userAnswer, correctAnswer, part, trapCategory }) {
        const https = require('https');
        const payload = JSON.stringify({
            model: 'google/gemini-flash-1.5',
            messages: [
                {
                    role: 'system',
                    content: `Bạn là Gia Sư TOEIC Sói Mây hài hước. Luôn trả lời theo cấu trúc 4 phần: 
1. 🎭 TIẾNG LÒNG SINH VIÊN: ...
2. 🕳️ BÓC MẼ BẪY ETS: ...
3. 🎯 VÌ SAO ĐÚNG: ...
4. ⚡ MẸO 3 GIÂY: ...`
                },
                {
                    role: 'user',
                    content: `Câu hỏi: ${question}. Học viên chọn sai: ${userAnswer}. Đáp án đúng: ${correctAnswer}. Dạng bẫy: ${trapCategory}.`
                }
            ]
        });

        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'openrouter.ai',
                path: '/api/v1/chat/completions',
                method: 'POST',
                timeout: 6000,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openRouterKey}`,
                    'Content-Length': Buffer.byteLength(payload)
                }
            }, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(body);
                        const text = json.choices?.[0]?.message?.content;
                        resolve(text || null);
                    } catch (e) {
                        resolve(null);
                    }
                });
            });
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('OpenRouter request timed out'));
            });
            req.on('error', reject);
            req.write(payload);
            req.end();
        });
    }

    generateOfflineExplanation({ question, userAnswer, correctAnswer, part, trapCategory }) {
        const key = (trapCategory || '').trim();
        // Thử tìm chính xác trong từ điển (bao gồm TRAP-01..12, P1-BEING, slug cũ)
        if (key && OFFLINE_TRAP_EXPLANATIONS[key]) {
            return OFFLINE_TRAP_EXPLANATIONS[key](question, userAnswer, correctAnswer);
        }
        // Thử tìm theo uppercase (ví dụ: trap-01 -> TRAP-01)
        const upperKey = key.toUpperCase();
        if (upperKey && OFFLINE_TRAP_EXPLANATIONS[upperKey]) {
            return OFFLINE_TRAP_EXPLANATIONS[upperKey](question, userAnswer, correctAnswer);
        }

        // Generic fallback chuẩn 4 phần theo Part (đáp ứng F25.2)
        const qPart = Number(part) || 5;
        if (qPart <= 2) {
            return `1. 🎭 TIẾNG LÒNG SINH VIÊN: Nghe thấy từ quen tai là phản xạ khoanh ngay đúng không?
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy từ đồng âm & câu trả lời gián tiếp. ETS hay tung hỏa mù âm thanh gần giống để gài bẫy sinh viên!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${correctAnswer || 'chuẩn'}" mới trả lời chính xác thông điệp câu hỏi.
4. ⚡ MẸO 3 GIÂY: Nghe thấy từ lặp lại nguyên văn trong câu hỏi Part 2 -> 90% là bẫy lừa né ngay!`;
        } else if (qPart <= 4) {
            return `1. 🎭 TIẾNG LÒNG SINH VIÊN: Bắt được từ khóa ở những giây đầu là vội vàng chọn ngay mà không nghe tiếp!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy đổi ý phút chót và phân tán thông tin. Người nói nhắc phương án gây nhiễu trước khi đổi ý bằng "Wait/Actually"!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${correctAnswer || 'chuẩn'}" là thông tin được xác nhận cuối cùng trong đoạn thoại.
4. ⚡ MẸO 3 GIÂY: Kiên nhẫn nghe hết liên từ chuyển hướng (Actually, But, However) để không bị dắt mũi!`;
        } else if (qPart <= 6) {
            return `1. 🎭 TIẾNG LÒNG SINH VIÊN: Thấy từ quen thuộc là chọn theo cảm tính mà quên nhìn cấu trúc câu!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy từ loại và vị trí ngữ pháp cốt lõi. Nhầm lẫn giữa danh từ, tính từ hoặc liên từ và giới từ!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${correctAnswer || 'chuẩn'}" điền vào vị trí trống tạo nên cấu trúc câu chuẩn xác theo quy tắc ngữ pháp.
4. ⚡ MẸO 3 GIÂY: Xác định ngay từ loại cần điền dựa vào từ đứng ngay trước và ngay sau chỗ trống!`;
        } else {
            return `1. 🎭 TIẾNG LÒNG SINH VIÊN: Đọc lướt bắt vội từ khóa ở đoạn đầu rồi vội vã chọn đáp án!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy xâu chuỗi thông tin và hàm ý gián tiếp. Thông tin câu hỏi đòi hỏi đọc bao quát và kết hợp dữ kiện!
3. 🎯 VÌ SAO ĐÚNG: Đáp án "${correctAnswer || 'chuẩn'}" được suy luận logic từ các dữ kiện đối chiếu trong bài đọc.
4. ⚡ MẸO 3 GIÂY: Đọc kỹ câu hỏi trước, định vị đúng đoạn chứa thông tin rồi mới đọc chi tiết để chọn đáp án!`;
        }
    }
}

const aiExplanationEngineInstance = new AiExplanationEngine();

module.exports = {
    aiExplanationEngineInstance,
    explainMistake: (args) => aiExplanationEngineInstance.explainMistake(args),
    OFFLINE_TRAP_EXPLANATIONS
};
