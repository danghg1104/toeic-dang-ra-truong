const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let s = fs.readFileSync(serverFile, 'utf8');

const target = 'const EXPERT_PHRASE_BANK = {';
const phrasesToAdd = `const EXPERT_PHRASE_BANK = {
  "supreme leader": {
    query: "supreme leader",
    rootForm: "supreme leader",
    ipa: { us: "/suːˈpriːm ˈliːdər/", uk: "/suːˈpriːm ˈliːdər/" },
    pos: "compound noun",
    vietnameseMeaning: "Nhà lãnh đạo tối cao, nguyên thủ tối cao",
    definitions: [
      {
        en: "The highest ranking leader holding ultimate authority in a state or political body.",
        vi: "Nhà lãnh đạo có thứ bậc cao nhất, nắm giữ quyền lực tối cao trong một quốc gia hoặc tổ chức chính trị.",
        exampleEn: "The supreme leader delivered an address to the nation on state television.",
        exampleVi: "Nhà lãnh đạo tối cao đã phát biểu trước toàn dân trên đài truyền hình quốc gia."
      }
    ],
    wordFamily: { noun: "leader, leadership", verb: "lead", adjective: "supreme" },
    collocations: ["the supreme leader's decree", "meeting with the supreme leader"],
    examContext: "IELTS / VSTEP Academic & Political English"
  },
  "supreme leaders": {
    query: "supreme leaders",
    rootForm: "supreme leader",
    ipa: { us: "/suːˈpriːm ˈliːdərz/", uk: "/suːˈpriːm ˈliːdərz/" },
    pos: "compound noun",
    vietnameseMeaning: "Các nhà lãnh đạo tối cao (dạng số nhiều)",
    definitions: [
      {
        en: "Plural form of supreme leader: highest-ranking state or political leaders.",
        vi: "Dạng số nhiều của supreme leader: những người nắm quyền lãnh đạo cao nhất.",
        exampleEn: "Supreme leaders from across the region convened for the international summit.",
        exampleVi: "Các nhà lãnh đạo tối cao từ khắp khu vực đã tề tựu tham dự hội nghị thượng đỉnh quốc tế."
      }
    ],
    wordFamily: { noun: "leader, leadership", verb: "lead", adjective: "supreme" },
    collocations: ["summit of supreme leaders"],
    examContext: "IELTS / VSTEP Academic English"
  },
  "head of state meeting": {
    query: "head of state meeting",
    rootForm: "head of state meeting",
    ipa: { us: "/ˌhed əv ˈsteɪt ˈmiːtɪŋ/", uk: "/ˌhed əv ˈsteɪt ˈmiːtɪŋ/" },
    pos: "compound noun / phrase",
    vietnameseMeaning: "Cuộc họp thượng đỉnh nguyên thủ quốc gia, hội nghị cấp cao nguyên thủ",
    definitions: [
      {
        en: "A high-level summit or formal conference attended by national leaders and heads of state.",
        vi: "Hội nghị thượng đỉnh cấp cao có sự tham dự của các nhà lãnh đạo và nguyên thủ quốc gia.",
        exampleEn: "The upcoming head of state meeting will focus on regional security and economic cooperation.",
        exampleVi: "Cuộc họp nguyên thủ quốc gia sắp tới sẽ tập trung vào an ninh khu vực và hợp tác kinh tế."
      }
    ],
    wordFamily: { noun: "head, state, meeting", verb: "meet", adjective: "-" },
    collocations: ["convene a head of state meeting", "annual head of state meeting"],
    examContext: "Chủ đề Ngoại giao - Quan hệ quốc tế trong đề thi TOEIC / VSTEP"
  },
  "head of government": {
    query: "head of government",
    rootForm: "head of government",
    ipa: { us: "/ˌhed əv ˈɡʌvərnmənt/", uk: "/ˌhed əv ˈɡʌvnmənt/" },
    pos: "compound noun",
    vietnameseMeaning: "Người đứng đầu chính phủ, thủ tướng (lãnh đạo nhánh hành pháp)",
    definitions: [
      {
        en: "The chief officer of the executive branch of a government, often bearing the title of prime minister.",
        vi: "Người đứng đầu nhánh hành pháp của chính phủ, thường giữ chức vụ thủ tướng.",
        exampleEn: "The head of government presided over the weekly cabinet meeting.",
        exampleVi: "Người đứng đầu chính phủ đã chủ trì phiên họp nội các hàng tuần."
      }
    ],
    wordFamily: { noun: "government", verb: "govern", adjective: "governmental" },
    collocations: ["powers of the head of government"],
    examContext: "Phân biệt với 'head of state' (nguyên thủ quốc gia)"
  },`;

if (!s.includes('"supreme leader":')) {
  s = s.replace(target, phrasesToAdd);
  fs.writeFileSync(serverFile, s, 'utf8');
  console.log('✅ Successfully updated server.js EXPERT_PHRASE_BANK');
} else {
  console.log('ℹ️ Already updated in server.js');
}
