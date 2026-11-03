const fs = require('fs');

console.log('=== POLISHING SANHTOPHEADERBAR & ZERO-DISPLACEMENT CSS ===');
let html = fs.readFileSync('index.html', 'utf8');

// 1. ADD CSS RULES TO LOCK HEADER BAR FONT TO PREVENT ANY JUMP/REFRACT ON FONT SWITCH
const fontLockCss = `
        /* Khóa cứng font-family và độ rộng của toàn bộ Top Header Bar để đổi phông thi không bao giờ bị nhảy/dời layout */
        #sanhTopHeaderBar,
        #sanhTopHeaderBar *,
        #mobileStickyTopHeader,
        #mobileStickyTopHeader * {
            font-family: 'Inter', 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* Định vị độ rộng cố định cho các nút gạt trên header để không thay đổi sub-pixel khi đổi nội dung text */
        #btnFontToggle {
            width: 114px !important;
            min-width: 114px !important;
            max-width: 114px !important;
            justify-content: center !important;
            text-align: center !important;
        }
        #btnEditorialToggle {
            width: 118px !important;
            min-width: 118px !important;
            max-width: 118px !important;
            justify-content: center !important;
            text-align: center !important;
        }
        #btnQuickPomodoroLaunch {
            min-width: 88px !important;
            justify-content: center !important;
        }
        #quickPomodoroTimeDisplay {
            display: inline-block !important;
            width: 44px !important;
            text-align: center !important;
            font-variant-numeric: tabular-nums !important;
        }
        #sanhGreetingPrefix {
            display: inline-block;
            min-width: 110px;
        }
`;

if (!html.includes('#btnFontToggle {')) {
    html = html.replace('/* Mobile & Virtual Keyboard Responsive CSS */', `${fontLockCss}\n        /* Mobile & Virtual Keyboard Responsive CSS */`);
    console.log('✅ Injected font-lock and fixed-width CSS rules into <style>');
}

// 2. ENSURE BUTTON STYLES IN #sanhTopHeaderBar HAVE FIXED WIDTH CLASSES
html = html.replace(
    'id="btnFontToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleFont()" class="px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"',
    'id="btnFontToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleFont()" class="w-[114px] min-w-[114px] max-w-[114px] px-2 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"'
);

html = html.replace(
    'id="btnEditorialToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleEditorial()" class="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"',
    'id="btnEditorialToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleEditorial()" class="w-[118px] min-w-[118px] max-w-[118px] px-2 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"'
);

// 3. ENSURE #sanhTopHeaderBar IS SPACIOUS, ROUNDED, AND ACTIVATES AT lg: (>= 1024px)
html = html.replace(
    'id="sanhTopHeaderBar" class="header-bar-elevation relative z-30 glass-panel rounded-3xl p-4 sm:p-5 lg:px-7 lg:py-4.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5',
    'id="sanhTopHeaderBar" class="header-bar-elevation relative z-30 glass-panel rounded-3xl p-5 sm:p-6 lg:px-8 lg:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6'
);

// 4. ENSURE CLUSTERS CONTAINER ACTIVATES AT lg:
html = html.replace(
    'class="flex items-center gap-2.5 sm:gap-3 flex-wrap xl:flex-nowrap justify-start xl:justify-end"',
    'class="flex items-center gap-3 sm:gap-3.5 flex-wrap lg:flex-nowrap justify-start lg:justify-end"'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('🎉 index.html header polish and font lock complete!');
