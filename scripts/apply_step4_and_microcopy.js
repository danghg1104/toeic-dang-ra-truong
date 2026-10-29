const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Sanitize "Học TOEIC Tích Phước Bớt Nghiệp"
html = html.replace('✨ Học TOEIC Tích Phước Bớt Nghiệp', '✨ Chiến thuật nhận diện 5 giây & xử lý bẫy Part 5-6');

// 2. Sanitize "Bắn súng Gundam"
html = html.replace(
  '<!-- 2 NÚT HỌC TRỰC TIẾP: 1 LÀ FLASHCARD, 2 LÀ BẮN SÚNG GUNDAM -->',
  '<!-- 2 NÚT HỌC TRỰC TIẾP: 1 LÀ FLASHCARD, 2 LÀ LUYỆN PHẢN XẠ -->'
);
html = html.replace(
  '<span>🚀 Bắn súng Gundam (${count})</span>',
  '<span>⚡ Luyện phản xạ (${count})</span>'
);

// 3. Update Mobile Bottom Nav to 5 Thumbs-Friendly Tabs
const oldNavRegex = /<nav id="mobileBottomNav"[\s\S]*?<\/nav>/;
const newNavHTML = `<nav id="mobileBottomNav" class="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 px-3 py-1.5 safe-bottom-nav grid grid-cols-5 gap-1 shadow-[0_-4px_20px_rgba(15,23,42,0.08)]">
        <button onclick="switchTab('hom-nay')" id="mob-nav-hom-nay" class="mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-slate-800 font-bold transition active:scale-95" title="Hôm nay">
            <i class="fa-solid fa-house text-base"></i>
            <span class="text-[11px] font-bold mt-0.5">Hôm nay</span>
        </button>
        <button onclick="switchTab('lo-trinh')" id="mob-nav-lo-trinh" class="mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 dark:text-slate-400 font-medium transition active:scale-95" title="Lộ trình">
            <i class="fa-solid fa-route text-base"></i>
            <span class="text-[11px] font-semibold mt-0.5">Lộ trình</span>
        </button>
        <button onclick="switchTab('ngu-phap')" id="mob-nav-luyen-tap" class="mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 dark:text-slate-400 font-medium transition active:scale-95" title="Luyện tập">
            <i class="fa-solid fa-graduation-cap text-base"></i>
            <span class="text-[11px] font-semibold mt-0.5">Luyện tập</span>
        </button>
        <button onclick="switchTab('thi-thu')" id="mob-nav-thi-thu" class="mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 dark:text-slate-400 font-medium transition active:scale-95" title="Đề thi">
            <i class="fa-solid fa-file-signature text-base"></i>
            <span class="text-[11px] font-semibold mt-0.5">Đề thi</span>
        </button>
        <button onclick="switchTab('tai-khoan')" id="mob-nav-tai-khoan" class="mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 dark:text-slate-400 font-medium transition active:scale-95" title="Cá nhân">
            <i class="fa-solid fa-circle-user text-base"></i>
            <span class="text-[11px] font-semibold mt-0.5">Cá nhân</span>
        </button>
    </nav>`;

if (oldNavRegex.test(html)) {
  html = html.replace(oldNavRegex, newNavHTML);
  console.log('Mobile bottom nav updated successfully to 5 tabs!');
} else {
  console.warn('Could not match old mobileBottomNav regex!');
}

// 4. Update switchTab highlight synchronization for 5 tabs
const oldMobSyncRegex = /\/\/ Đồng bộ trạng thái sáng đèn trên Thanh điều hướng đáy Điện thoại \(Mobile Bottom Nav\)[\s\S]*?const activeMobBtn = document\.getElementById\(`mob-nav-\$\{tabId\}`\) \|\| document\.getElementById\('mob-nav-more'\);[\s\S]*?activeMobBtn\.className = 'mob-nav-item[^']*?';\s*\}/;

const newMobSyncCode = `// Đồng bộ trạng thái sáng đèn trên Thanh điều hướng đáy Điện thoại (Mobile Bottom Nav 5 Tabs)
            document.querySelectorAll('.mob-nav-item').forEach(btn => {
                btn.className = 'mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 dark:text-slate-400 font-medium transition active:scale-95';
            });
            let targetMobId = 'mob-nav-hom-nay';
            if (tabId === 'hom-nay') targetMobId = 'mob-nav-hom-nay';
            else if (tabId === 'lo-trinh') targetMobId = 'mob-nav-lo-trinh';
            else if (tabId === 'thi-thu' || tabId === 'bay-de-thi') targetMobId = 'mob-nav-thi-thu';
            else if (tabId === 'tai-khoan' || tabId === 'cai-dat') targetMobId = 'mob-nav-tai-khoan';
            else targetMobId = 'mob-nav-luyen-tap';

            const activeMobBtn = document.getElementById(targetMobId);
            if (activeMobBtn) {
                activeMobBtn.className = 'mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-slate-800 font-bold transition active:scale-95';
            }
        }`;

if (oldMobSyncRegex.test(html)) {
  html = html.replace(oldMobSyncRegex, newMobSyncCode);
  console.log('switchTab mobile nav synchronization updated!');
} else {
  console.warn('Could not match oldMobSyncRegex!');
}

fs.writeFileSync(file, html, 'utf8');
console.log('index.html saved successfully!');
