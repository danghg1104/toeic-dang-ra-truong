# Project: TOEIC Master — Nâng Cấp Toàn Diện Bộ Tính Năng Luyện Thi (noble-franklin)

## Architecture
Ứng dụng `noble-franklin` (Tôi Đi Đâu Đó / `cung-dang-ra-truong`) là một Single Page Application (SPA) viết bằng Vanilla JavaScript mô-đun hóa, chạy trên nền máy chủ Node.js native (`http.Server`).
Kiến trúc tổng thể gồm 4 tầng phân tách:
1. **Presentation & UI Layer (`index.html`, `css/`, `js/*-view.js`):** Quản lý điều hướng `switchTab()`, hệ thống Theme (`Editorial Warm Sand & Deep Indigo`), Typography switch (ETS Garamond/Times vs Inter), và các thành phần giao diện chuyên biệt (Tour guide, Cheat sheet, Tinder-style 3D Flashcard, Authentic Document Views Part 6-7).
2. **Interactive Audio & Micro-interactions Layer (`js/web-audio-micro-engine.js`, `js/study-focus-engine.js`, `js/toeic-listening-sync.js`):** Sử dụng Web Audio API native không có độ trễ (0ms latency) để phát âm thanh phản hồi ("ding!", combo cheer, confetti), quản lý Pomodoro 25/5 với 3 kênh âm thanh chọn lọc (Lo-fi, Rain, Cafe), âm thanh phòng thi nhấp nháy đỏ, Karaoke sync bám sát timestamp âm thanh và Accent indicator.
3. **Algorithms & Analytics Layer (`js/fsrs-v5-engine.js`, `js/toeic-adaptive-engine.js`, `js/toeic-radar-chart.js`, `js/toeic-trap-heat-matrix.js`):** Thuật toán lặp lại ngắt quãng FSRS v5 (D, S, R, interval), Đồ thị Radar 7 trục hiển thị năng lực 7 Part TOEIC kèm cảnh báo cam, Mô hình hồi quy phân phối chuẩn Gauss dự đoán xác suất đạt >=650 điểm thi thật, Bài test thích ứng 10 phút 2PL IRT, và Ma trận nhiệt 12 bẫy tử huyệt với trọng số suy giảm thời gian.
4. **Backend & Real-Time Communications Layer (`server.js`, `lib/pvp-arena-server.js`):** Máy chủ Node.js phục vụ static files tối ưu (ETag, Gzip, Range streaming), tích hợp WebSocket Server (`ws` v8.22.0) cho đấu trường từ vựng 1v1 PvP 60 giây (hỗ trợ bot AI Sói Mây khi solo), và AI Gateway giải thích câu sai "Vì sao em sai?" với Gemini 3.8 Flash cùng kiến trúc 3 tầng dự phòng (Gemini 3.8 Flash -> OpenRouter -> Offline ETS Rule-based) đảm bảo 0% sập.

---

## Feature Inventory
Tất cả các tính năng từ yêu cầu của người dùng (R1 - R7) được liệt kê đầy đủ và gán chính xác vào các Milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Tour Guide Onboarding | Hướng dẫn từng bước làm quen tính năng ứng dụng cho học viên mới | M1 | R1 |
| 2 | Part 3-4 Indirect Traps | Bổ sung câu hỏi có bẫy gián tiếp hội thoại phức cho Part 3 và Part 4 | M3 | R1 |
| 3 | Pre-Listening Keyword Tips | Mẹo 8 giây bắt keyword trong 3 câu hỏi trước khi phát audio | M3 | R1 |
| 4 | One-Page Cheat Sheet | Thẻ tóm tắt 1 trang cho phép tải về máy sau mỗi bài học | M3 | R1 |
| 5 | Editorial Warm Sand Theme | Giao diện "Giấy Tự Nhiên & Mực Trầm" (#F4EFEA / #161E2E) chống mỏi mắt | M1 | R2 |
| 6 | Font Switcher (ETS vs Sans) | Nút gạt chuyển đổi tức thì giữa phông ETS Serif và Inter Sans-serif | M1 | R2 |
| 7 | PWA 1-Tap Install | Cài đặt PWA 1 chạm đưa app ra màn hình chính (iOS & Android) | M1 | R2 |
| 8 | Sound Feedback & Confetti | Âm thanh "ding!" chọn đúng, combo cheer 5 câu, pháo hoa confetti | M1 | R3 |
| 9 | Pomodoro 25/5 Ambient Audio | Bộ đếm Pomodoro 25/5 với 3 kênh âm thanh Lo-fi, Mưa rơi, Quán cà phê | M1 | R3 |
| 10 | Exam Soundscape & Red Alert | Tiếng ồn phòng thi + đồng hồ đếm ngược nhấp nháy đỏ 5 phút cuối | M1 | R3 |
| 11 | 7-Axis Competency Radar | Đồ thị Radar 7 Part TOEIC, cánh yếu phát sáng màu cam (<60%) | M2 | R4 |
| 12 | Real Test Score Prediction | Dự đoán xác suất đạt điểm thi thật (ví dụ xác suất đạt >650 điểm) | M2 | R4 |
| 13 | Weekly Progress Report | Báo cáo tiến bộ hàng tuần gửi qua thông báo tóm tắt ngắn gọn | M2 | R4 |
| 14 | 10-Minute Adaptive Test | Bài test 10 phút co giãn độ khó (2PL IRT), ước lượng dải điểm xuất phát | M2 | R4 |
| 15 | FSRS v5 Algorithm | Thuật toán lặp lại ngắt quãng FSRS v5 tự động tính chu kỳ quên từ vựng | M2 | R5 |
| 16 | 12 Trap Categories Heat Matrix | Phân loại câu sai vào 12 bẫy tử huyệt và ma trận nhiệt suy giảm thời gian | M2 | R5 |
| 17 | 180-Second Micro-Capsules | Viên nang học siêu ngắn: 3 bẫy then chốt hoặc 5 từ vựng kèm audio ngắn | M3 | R5 |
| 18 | Realistic Document UI (Part 6-7)| Giả lập giao diện thực tế Gmail, Hóa đơn VAT, Boarding Pass, Slack | M3 | R5 |
| 19 | 80/20 Frequency Tiering | Gắn nhãn tần suất thực tế (Cực Cao, Cao, Trung Bình) cho từ vựng | M3 | R6 |
| 20 | Office Paraphrase Clusters | Gom nhóm từ vựng theo mạng lưới ngữ nghĩa văn phòng cho Part 3, 4, 7 | M3 | R6 |
| 21 | Tinder-Style 3D Flashcards | Thẻ từ vựng vuốt Trái/Phải 3D với TouchEvent & CSS 3D | M3 | R6 |
| 22 | WebSocket 1v1 PvP Arena | Đấu trường từ vựng 1v1 realtime 60s, 10 từ vựng, hỗ trợ bot AI Sói Mây | M4 | R6 |
| 23 | Karaoke Lyrics Sync | Lời thoại chạy chữ theo giọng đọc bám sát timestamp audio Part 3-4 | M3 | R7 |
| 24 | Accent Classifier Indicator | Nhận diện Accent (US/UK/AU/CA), cờ quốc gia và highlight biến âm | M3 | R7 |
| 25 | AI "Vì sao em sai?" Engine | Phân tích câu sai hài hước bằng Gemini 3.8 Flash với 3-tier fallback | M4 | R7 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Thiết kế hạ tầng test và bộ test case 4 tầng (Tiers 1-4, 288 tests) | none | DONE |
| M1 | Core UI/UX, Themes, PWA & Audio Engine | Editorial Theme, Font Switch, PWA, Web Audio, Pomodoro, Exam Sound, Tour Guide | none | DONE |
| M2 | TOEIC Learning Algorithms & Diagnostics Engine | FSRS v5, 12 Bẫy Heat Matrix, 10-min Adaptive IRT Test, 7-axis Radar, Dự đoán điểm | none | DONE |
| M3 | Authentic Practice UI, Listening & Vocab System | Gmail/VAT/Pass/Slack UI, Bẫy gián tiếp P3-4, Lyrics Sync, Accent Flag, 3D Flashcard, Cheat Sheet, 180s Capsule | M1, M2 | IN_PROGRESS |
| M4 | Real-Time PvP Arena & AI Explanation Engine | WebSocket Server 1v1 PvP trong server.js, PvP Client UI, Gemini 3.8 Flash AI Gateway | M1, M2, M3 | PLANNED |
| M5 | Final E2E Verification & Adversarial Hardening | Phase 1: Vượt qua 100% test suite E2E (Tiers 1-4); Phase 2: Đột phá kiểm thử phủ Tier 5 | E2E, M1-M4 | PLANNED |

---

## Interface Contracts

### 1. Editorial Theme & Font Switcher ↔ Global UI
- Class áp dụng: `document.documentElement.classList.toggle('editorial', isEditorial)`
- Class phông chữ: `document.documentElement.classList.toggle('font-ets', isEtsSerif)`
- CSS Variables:
  ```css
  :root.editorial {
    --bg-base: #F4EFEA;
    --surface-card: #FAF6F0;
    --text-primary: #161E2E;
    --border-light: #E3DDD5;
  }
  :root.font-ets body {
    font-family: 'EB Garamond', 'Times New Roman', Georgia, serif;
  }
  ```
- API điều khiển: `window.EditorialThemeManager.setEditorial(boolean)`, `window.EditorialThemeManager.setFontSerif(boolean)`

### 2. Web Audio Micro-Engine & Pomodoro ↔ Components
- Global Singleton: `window.WebAudioMicroEngine`
- Methods:
  - `playDing()`: Phát âm thanh nốt E6 (1318.5Hz) 0ms latency.
  - `playComboCheer(comboCount)`: Hợp âm ngân vang chúc mừng.
  - `fireConfetti()`: Kích hoạt hiệu ứng pháo hoa giấy.
  - `startPomodoro(mode, onTick, onComplete)`: Chạy bộ đếm 25/5 kèm ambient track ('lofi' | 'rain' | 'cafe').
  - `startExamSoundscape(onCountdownTick)`: Phát tiếng ồn phòng thi và cảnh báo đỏ 5 phút cuối.

### 3. FSRS v5 Engine ↔ Vocab & Flashcard Data
- Module: `window.FSRS5Engine`
- Interface:
  - `initCard(cardId)`: Trả về đối tượng `{ cardId, difficulty: 4.0, stability: 1.0, retrievability: 1.0, reps: 0, lapses: 0, lastReview: Date.now(), nextReview: Date.now() + 86400000 }`
  - `rateCard(cardState, rating)`: `rating` nhận giá trị `1` (Again - Vuốt Trái) hoặc `3` (Good - Vuốt Phải), trả về `{ difficulty, stability, retrievability, intervalDays, nextReview }`.

### 4. 10-Minute Adaptive Test ↔ 7-Axis Radar & Score Predictor
- Module: `window.ToeicAdaptiveEngine`
- Interface:
  - `startTest()`: Khởi tạo bài thi 10 phút, chọn câu hỏi đầu tiên theo độ khó trung bình.
  - `submitAnswer(qId, selectedOption)`: Chấm điểm, cập nhật $\theta$ (Item Response Theory), chọn câu hỏi tiếp theo theo thông tin Fisher tối đa.
  - `finishTest()`: Trả về `{ estimatedScore: [min, max], listeningScore, readingScore, partBreakdown: { 1: %, 2: %, ..., 7: % }, probabilityOver650: percentage }`.
- Module: `window.ToeicRadarChart.render(canvasOrSvgId, partBreakdown)`: Vẽ đồ thị radar 7 cánh, làm nổi bật màu cam các cánh có điểm < 60%.

### 5. WebSocket 1v1 PvP Protocol ↔ Server & Client
- Endpoint: `ws://<host>:<port>/ws/pvp`
- Message Types (JSON):
  - Client ➔ Server:
    - `{ type: 'JOIN_QUEUE', userId, username, avatar }`
    - `{ type: 'SUBMIT_ANSWER', matchId, wordIndex, answer, responseTimeMs }`
    - `{ type: 'LEAVE_MATCH', matchId }`
  - Server ➔ Client:
    - `{ type: 'MATCH_FOUND', matchId, opponent: { username, isBot }, words: [ { word, options, correctIndex } ], duration: 60 }`
    - `{ type: 'TICK_SYNC', remainingSeconds }`
    - `{ type: 'SCORE_UPDATE', myScore, opponentScore, myCombo, opponentCombo }`
    - `{ type: 'MATCH_END', winner, finalMyScore, finalOpponentScore, rankDelta }`

### 6. AI "Vì sao em sai?" Gateway ↔ Server & Client
- Endpoint: `POST /api/ai/explain-mistake`
- Body: `{ question, userAnswer, correctAnswer, part, trapCategory }`
- Response: `{ success: true, explanation: string, provider: 'gemini-3.8-flash' | 'openrouter' | 'offline-rules' }`
- Fallback Sequence: Gemini 3.8 Flash ➔ OpenRouter LLaMA-3.1 ➔ Offline ETS Rule-based (0% crash).

---

## Code Layout
- `index.html`: Entrypoint giao diện chính SPA.
- `server.js`: HTTP Server, API endpoints, WebSocket upgrade handler.
- `lib/pvp-arena-server.js`: Module WebSocket PvP Arena (matchmaking, bot AI, scoring).
- `js/editorial-theme-manager.js`: Quản lý giao diện Giấy Tự Nhiên & Mực Trầm và Font Toggle.
- `js/web-audio-micro-engine.js`: Bộ âm thanh nốt nhạc Web Audio, Pomodoro 25/5 và Exam Soundscape.
- `js/app-tour-guide.js`: Tour Guide giới thiệu tính năng từng bước cho học viên mới.
- `js/fsrs-v5-engine.js`: Thuật toán lặp lại ngắt quãng FSRS v5 tính chu kỳ nhớ quên từ vựng.
- `js/toeic-adaptive-engine.js`: Bộ đề thi thích ứng 10 phút 2PL IRT và ước lượng điểm.
- `js/toeic-radar-chart.js`: Đồ thị Radar 7 Part TOEIC và dự đoán xác suất điểm thi thật.
- `js/toeic-trap-heat-matrix.js`: Ma trận nhiệt 12 bẫy tử huyệt và viên nang học tập 180s.
- `js/authentic-document-templates.js`: Bộ template mô phỏng Gmail, Hóa đơn VAT, Boarding Pass, Slack cho Part 6-7.
- `js/toeic-listening-sync.js`: Karaoke Lyrics Sync và Accent Classifier Indicator cho Part 3-4.
- `js/tinder-flashcards-3d.js`: Thẻ từ vựng 3D vuốt Trái/Phải kiểu Tinder tích hợp FSRS v5.
- `js/one-page-cheat-sheet.js`: Trình xuất One-page Cheat Sheet tải về máy.
- `js/pvp-arena-client.js`: Giao diện client đấu trường từ vựng 1v1 PvP thời gian thực.
- `tests/e2e/`: Toàn bộ bộ test E2E 4 tầng (Tiers 1-4) do E2E Testing Track phụ trách.
