const fs = require('fs');

function updateHtmlFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf8');

    if (!html.includes('pvp-arena-client.js')) {
        const anchor = '<script src="/js/toeic-capsule-station.js?v=20261103_m3"></script>';
        const addition = `    <!-- Milestone 4: Real-Time PvP Arena & AI Explanation Engine -->
    <script src="/lib/pvp-arena-server.js?v=stub" onerror="this.remove()"></script>
    <script src="/js/pvp-arena-client.js?v=20261103_m4"></script>
    <script src="/js/ai-mistake-explainer.js?v=20261103_m4"></script>`;

        html = html.replace(anchor, `${anchor}\n${addition}`);
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ [HTML] Added Milestone 4 scripts to ${filePath}`);
    }
}

function updateVocabGameWorkstation(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    if (!code.includes('Đấu Trường Từ Vựng 1v1 PvP Thời Gian Thực')) {
        const targetAnchor = 'return `\n                <div class="w-full max-w-6xl 2xl:max-w-7xl mx-auto space-y-6 pb-12">';
        const pvpBanner = `return \`
                <div class="w-full max-w-6xl 2xl:max-w-7xl mx-auto space-y-6 pb-12">
                <!-- ============================================================== -->
                <!-- PROMO BANNER: ĐẤU TRƯỜNG TỪ VỰNG PVP 1V1 REALTIME 60 GIÂY -->
                <!-- ============================================================== -->
                <div class="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
                    <div class="relative z-10 flex items-center gap-4">
                        <div class="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
                            ⚔️
                        </div>
                        <div class="space-y-1 text-left">
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-full bg-slate-950/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">Mới Nhất 2026</span>
                                <h3 class="text-base sm:text-lg font-black tracking-tight">Đấu Trường Từ Vựng 1v1 PvP Thời Gian Thực</h3>
                            </div>
                            <p class="text-xs sm:text-sm text-white/90">So tài phản xạ 10 từ vựng cốt lõi trong 60 giây qua kết nối WebSocket với bạn bè hoặc Bot AI Sói Mây!</p>
                        </div>
                    </div>
                    <button type="button" onclick="window.PvPArenaClient && window.PvPArenaClient.open()" class="relative z-10 px-6 sm:px-7 py-3 rounded-2xl bg-slate-950 text-amber-300 hover:bg-slate-900 font-black text-xs uppercase tracking-wider shrink-0 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2">
                        <i class="fa-solid fa-gamepad text-sm"></i>
                        <span>Vào Đấu Trường Ngay</span>
                    </button>
                </div>\`;`;

        code = code.replace(targetAnchor, pvpBanner);
        fs.writeFileSync(filePath, code, 'utf8');
        console.log(`✅ [Workstation] Injected PvP banner into ${filePath}`);
    }
}

updateHtmlFile('index.html');
updateHtmlFile('www/index.html');
updateVocabGameWorkstation('js/vocab-game-workstation.js');
updateVocabGameWorkstation('www/js/vocab-game-workstation.js');
