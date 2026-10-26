const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add script tag for js/floating-take-note.js if not present
const scriptTarget = '<script src="js/take-note-hybrid-editor.js"></script>';
const scriptReplacement = '<script src="js/take-note-hybrid-editor.js"></script>\n    <script src="js/floating-take-note.js"></script>';

if (!html.includes('js/floating-take-note.js')) {
    if (html.includes(scriptTarget)) {
        html = html.replace(scriptTarget, scriptReplacement);
        console.log('✅ Added <script src="js/floating-take-note.js"></script>');
    } else {
        console.warn('⚠️ Could not find scriptTarget in index.html');
    }
} else {
    console.log('Script tag already present');
}

// 2. Replace the floating AI tutor launcher with floating take note circular button
const oldFabRegex = /<!-- FLOATING AI TUTOR LAUNCHER[\s\S]*?<\/button>/;
const newFabHTML = `<!-- FLOATING TAKE NOTE LAUNCHER (Sổ Take Note Nhanh - Vòng tròn nhỏ mở mọi lúc khi giải đề, Part 5,...) -->
    <button id="floatingTakeNoteFab" onclick="FloatingTakeNote.toggle()" class="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 h-12 w-12 hover:w-auto hover:px-4 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs font-black border-2 border-amber-200/80 backdrop-blur-md cursor-pointer group overflow-hidden floating-take-note-fab" title="Mở Sổ Take Note Nhanh (Ghi chú Part 5, Từ vựng, Ngữ pháp)">
        <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-2 ring-emerald-300/60 animate-pulse"></span>
        <i class="fa-solid fa-book-bookmark text-base text-amber-950 shrink-0"></i>
        <span class="hidden group-hover:inline transition-all whitespace-nowrap font-black text-slate-950">Sổ Take Note 📝</span>
    </button>`;

if (oldFabRegex.test(html)) {
    html = html.replace(oldFabRegex, newFabHTML);
    console.log('✅ Replaced AI tutor FAB with floating Take Note circular button');
} else {
    console.warn('⚠️ Could not find oldFabRegex');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('💾 Successfully updated index.html');
