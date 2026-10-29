const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let content = fs.readFileSync(vocabFile, 'utf8');

console.log('🚀 Đang chuyển đổi Vocab Game Workstation sang Vocabulary Studio chuẩn Study Studio...');

// 1. Thay thế Banner Gundam sang Vocabulary Studio
const oldBanner = `                    <!-- Gundam Sci-Fi Header Banner -->
                    <div class="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                        <div class="w-20 sm:w-24 aspect-[219/286] shrink-0 rounded-2xl overflow-hidden border border-cyan-400/40 shadow-lg relative bg-slate-900 flex items-center justify-center">
                            <img src="assets/mascot/may_reading.png" alt="Gundam Arena Mascot" class="w-full h-full object-cover filter brightness-105 hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/30">
                                    GUNDAM MOBILE SUIT VOCAB ARENA
                                </span>
                                <span class="text-xs text-amber-300 font-bold">✨ Bắn Rơi Từ Vựng & Phân Loại CEFR</span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Đấu Trường Gundam — Nghe Chuẩn Phát Âm, Quét File 3000 Từ & Xếp CEFR A1–C2
                            </h2>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                                Điều khiển Mobile Suit Gundam xoay nòng ngắm bắn từ rơi! Tự do chọn chủ đề AI, tải lên file tài liệu hàng nghìn từ để tự động phân loại chuẩn CEFR hoặc tự điền từ vựng yêu thích.
                            </p>
                        </div>
                    </div>`;

const newBanner = `                    <!-- Study Studio Vocabulary Header Banner -->
                    <div class="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                        <div class="w-20 sm:w-24 aspect-[219/286] shrink-0 rounded-2xl overflow-hidden border border-indigo-400/40 shadow-lg relative bg-slate-800 flex items-center justify-center">
                            <img src="assets/mascot/may_reading.png" alt="Sói Mây Từ Vựng" class="w-full h-full object-contain filter brightness-105 hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">
                                    VOCABULARY STUDIO · AI CEFR ANALYZER
                                </span>
                                <span class="text-xs text-amber-300 font-bold">📚 Học Thuật & Luyện Phản Xạ 3 Giây</span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Studio Từ Vựng TOEIC & ETS 2026 — Phân Tích CEFR & Luyện Phản Xạ
                            </h2>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                                Không gian mở rộng vốn từ học thuật với thuật toán lặp lại ngắt quãng (Spaced Repetition), phân tích văn bản tự động theo khung chuẩn Châu Âu A1–C2 và luyện nghe phát âm chuẩn Oxford / Cambridge.
                            </p>
                        </div>
                    </div>`;

if (content.includes(oldBanner)) {
  content = content.replace(oldBanner, newBanner);
  console.log('✓ 1. Đã thay thế Banner Gundam thành Vocabulary Studio chuẩn Quiet Confidence!');
} else {
  console.warn('⚠️ Không tìm thấy oldBanner chính xác, đang thử regex...');
  content = content.replace(
    /<!-- Gundam Sci-Fi Header Banner -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
    newBanner
  );
}

// 2. Thay thế toàn bộ các từ khóa trẻ con/Gundam trong giao diện thành văn phong EdTech chuyên nghiệp
content = content.replace(/GUNDAM MOBILE SUIT VOCAB ARENA/g, 'VOCABULARY STUDIO');
content = content.replace(/Đấu Trường Gundam/g, 'Studio Từ Vựng');
content = content.replace(/Đấu trường Gundam/g, 'Studio Từ Vựng');
content = content.replace(/đấu trường Gundam/g, 'studio từ vựng');
content = content.replace(/Gundam Arena/g, 'Vocab Studio');
content = content.replace(/Bắn súng Gundam/g, 'Luyện phản xạ');
content = content.replace(/Bắn rơi từ vựng/g, 'Phản xạ từ vựng');
content = content.replace(/bắn từ rơi/g, 'ghi nhớ phản xạ');
content = content.replace(/Bắn ngay/g, 'Luyện ngay');
content = content.replace(/HOÀN THÀNH ĐẤU TRƯỜNG GUNDAM/g, 'HOÀN THÀNH PHIÊN HỌC TỪ VỰNG');
content = content.replace(/Gundam kích hoạt nòng Beam Rifle cùng bạn/g, 'hệ thống chuẩn bị phiên phản xạ từ vựng cùng bạn');
content = content.replace(/cùng Gundam/g, 'cùng Trợ lý Mây');

fs.writeFileSync(vocabFile, content, 'utf8');
console.log('SUCCESS: Đã dọn sạch Gundam và trẻ con trong js/vocab-game-workstation.js!');
