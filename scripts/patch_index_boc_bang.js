const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add script tag
if (!html.includes('toeic-boc-bang-station.js')) {
  const targetScript = '<script src="js/dailydictation-workstation.js?v=2026-v1"></script>';
  const replacementScript = targetScript + '\n    <script src="js/toeic-boc-bang-station.js?v=2026-v1"></script>';
  html = html.replace(targetScript, replacementScript);
  console.log('Added toeic-boc-bang-station.js script tag');
}

// 2. Add sidebar item under nav-nghe-chinh-ta
if (!html.includes('id="nav-boc-bang-audio"')) {
  const targetNav = `<button onclick="switchTab('nghe-chinh-ta')" id="nav-nghe-chinh-ta"`;
  const bocBangNavBtn = `<!-- Trạm Bóc Băng File Nghe TOEIC (Audio to Transcript & Answer Key) -->
                        <button onclick="switchTab('boc-bang-audio')" id="nav-boc-bang-audio" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50/70 dark:hover:bg-slate-800 transition">
                            <i class="fa-solid fa-file-audio text-[15px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                            <span class="sidebar-text">Bóc băng file nghe</span>
                            <span class="ml-auto text-[9.5px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-extrabold dark:bg-teal-900/60 dark:text-teal-200">AI STT</span>
                        </button>\n\n                        `;
  html = html.replace(targetNav, bocBangNavBtn + targetNav);
  console.log('Added nav-boc-bang-audio to sidebar');
}

// 3. Add prominent banner in view-nghe
if (!html.includes('Trạm Bóc Băng File Nghe TOEIC Tự Động') && html.includes('id="listeningPriorityDashboard"')) {
  const targetBanner = '<div id="listeningPriorityDashboard"';
  const newBanner = `<!-- BANNER: TRẠM BÓC BĂNG FILE NGHE TOEIC (AUDIO TO TRANSCRIPT & ANSWER KEY) -->
                <div class="rounded-[26px] p-5 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-teal-400/30">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center text-2xl shadow-inner shrink-0">
                            🎧
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wide">TÍNH NĂNG ĐỘT PHÁ</span>
                                <span class="text-xs font-bold text-teal-100">Audio to Transcript & Answer Key</span>
                            </div>
                            <h3 class="text-lg font-black text-white mt-0.5">Trạm Bóc Băng File Nghe TOEIC Tự Động</h3>
                            <p class="text-xs text-teal-50 max-w-xl leading-relaxed">Giáo viên gửi file nghe không có đáp án / transcript? Kéo thả file (.mp3, .wav) để AI chuyển giọng nói thành văn bản 100%, dịch song ngữ, bóc tách đáp án & nghe chép chính tả!</p>
                        </div>
                    </div>
                    <button onclick="switchTab('boc-bang-audio')" class="px-5 py-3 rounded-2xl bg-white text-teal-800 font-extrabold text-xs shadow-md hover:bg-teal-50 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 shrink-0">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Mở Trạm Bóc Băng ➔
                    </button>
                </div>\n\n                ` + targetBanner;
  html = html.replace(targetBanner, newBanner);
  console.log('Added prominent banner to view-nghe');
}

// 4. Add banner to view-nghe-chinh-ta
if (!html.includes('Bóc Băng File Riêng ➔') && html.includes('id="dailyDictationContainer"')) {
  const targetDictation = '<div id="dailyDictationContainer">';
  const dictationBanner = `<div class="rounded-2xl p-4 bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600 text-white shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                            🎧
                        </div>
                        <div>
                            <span class="font-extrabold text-sm block">Bạn có file nghe riêng của giáo viên?</span>
                            <p class="text-xs text-white/90">Kéo thả file bất kỳ vào Trạm Bóc Băng để tự động tạo bài nghe chép chính tả thông minh kèm A-B Loop & Chấm điểm!</p>
                        </div>
                    </div>
                    <button onclick="switchTab('boc-bang-audio')" class="px-4 py-2 rounded-xl bg-white text-indigo-700 font-extrabold text-xs shadow hover:bg-indigo-50 shrink-0 flex items-center gap-1.5">
                        <i class="fa-solid fa-cloud-arrow-up text-teal-600"></i> Bóc Băng File Riêng ➔
                    </button>
                </div>\n                ` + targetDictation;
  html = html.replace(targetDictation, dictationBanner);
  console.log('Added banner to view-nghe-chinh-ta');
}

// 5. Add section view-boc-bang-audio
if (!html.includes('id="view-boc-bang-audio"')) {
  const targetSection = '<section id="view-tu-vung-phim"';
  const newSection = `<!-- ========================================== -->
            <!-- VIEW: TRẠM BÓC BĂNG FILE NGHE TOEIC        -->
            <!-- ========================================== -->
            <section id="view-boc-bang-audio" class="hidden space-y-5 pb-32">
                <!-- Dynamically rendered via ToeicBocBangStation.instance.renderInto('view-boc-bang-audio') -->
            </section>\n\n            ` + targetSection;
  html = html.replace(targetSection, newSection);
  console.log('Added view-boc-bang-audio section');
}

// 6. Add to tabConfig
if (!html.includes("'boc-bang-audio': {")) {
  const targetConfig = "'nghe-chinh-ta': {";
  const newConfig = `'boc-bang-audio': {
                activeClass: 'nav-active-listen',
                mascotText: 'Bóc băng file nghe tự động, dịch song ngữ & phân tích đáp án TOEIC!',
                feedbackText: 'Mở Sổ Take Note',
                owlVariant: 'listening'
            },
            ` + targetConfig;
  html = html.replace(targetConfig, newConfig);
  console.log('Added boc-bang-audio to tabConfig');
}

// 7. Add to switchTab
if (!html.includes("tabId === 'boc-bang-audio'")) {
  const targetSwitch = "if (tabId === 'nghe-chinh-ta' || tabId === 'luyen-nghe-chinh-ta') {";
  const newSwitch = `if (tabId === 'boc-bang-audio') {
                if (window.ToeicBocBangStation && window.ToeicBocBangStation.instance) {
                    window.ToeicBocBangStation.instance.renderInto('view-boc-bang-audio');
                }
            }
            ` + targetSwitch;
  html = html.replace(targetSwitch, newSwitch);
  console.log('Added boc-bang-audio handler to switchTab');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully patched index.html!');
