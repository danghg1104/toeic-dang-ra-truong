const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'take-note-hybrid.css');
let css = fs.readFileSync(cssPath, 'utf8');

const marker = '/* =========================================================================\r\n * FLOATING TAKE NOTE WINDOW';
const markerAlt = '/* =========================================================================\n * FLOATING TAKE NOTE WINDOW';

const exactStyles = `/* =========================================================================
 * FLOATING TAKE NOTE WINDOW & EXACT RESIZE HANDLES (ẢNH VÍ DỤ 1)
 * ========================================================================= */
.ftn-window {
    position: fixed;
    z-index: 9999 !important;
    animation: ftnAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    touch-action: none;
    user-select: none;
    /* OVERFLOW VISIBLE ĐỂ 4 GÓC TRÒN VÀ 4 VIÊN THUỐC CẠNH KHÔNG BỊ CẮT */
    overflow: visible !important;
}

@keyframes ftnAppear {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(8px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* KHUNG NỘI DUNG CHÍNH (INNER CONTAINER) BO GÓC 24px & CÓ VIỀN CYAN-BLUE CHUẨN ẢNH VÍ DỤ */
.ftn-inner-card {
    width: 100%;
    height: 100%;
    border-radius: 24px;
    background: #ffffff;
    border: 2.5px solid #0284c7;
    box-shadow: 0 20px 50px -10px rgba(2, 132, 199, 0.25), 0 10px 25px -5px rgba(15, 23, 42, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}
html.dark .ftn-inner-card {
    background: #0f172a;
    border-color: #38bdf8;
    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(56, 189, 248, 0.3);
}

/* =========================================================================
 * 4 ĐIỂM NEO VÒNG TRÒN Ở 4 GÓC (CIRCULAR RING HANDLES - CHUẨN ẢNH 1)
 * ========================================================================= */
.ftn-handle {
    position: absolute;
    z-index: 1001 !important;
    touch-action: none;
    user-select: none;
    pointer-events: auto;
}

/* Hitboxes cho 4 góc (32px x 32px rộng rãi dễ rê chuột) */
.ftn-handle-nw {
    top: -8px;
    left: -8px;
    width: 32px;
    height: 32px;
    cursor: nwse-resize !important;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}
.ftn-handle-ne {
    top: -8px;
    right: -8px;
    width: 32px;
    height: 32px;
    cursor: nesw-resize !important;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}
.ftn-handle-sw {
    bottom: -8px;
    left: -8px;
    width: 32px;
    height: 32px;
    cursor: nesw-resize !important;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
}
.ftn-handle-se {
    bottom: -8px;
    right: -8px;
    width: 32px;
    height: 32px;
    cursor: nwse-resize !important;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}

/* HÌNH TRÒN RỖNG VIỀN XANH NẰM ĐÚNG GÓC (CHÍNH XÁC NHƯ ẢNH 1) */
.ftn-ring-handle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    border: 2.5px solid #0284c7;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s ease, background-color 0.15s ease;
    pointer-events: none;
}
html.dark .ftn-ring-handle {
    background: #0f172a;
    border-color: #38bdf8;
}
.ftn-handle:hover .ftn-ring-handle {
    transform: scale(1.35);
    border-color: #0369a1;
    background: #e0f2fe;
}
html.dark .ftn-handle:hover .ftn-ring-handle {
    border-color: #7dd3fc;
    background: #0369a1;
}

/* =========================================================================
 * 4 VIÊN THUỐC Ở 4 CẠNH GIỮA (CAPSULE PILL HANDLES - CHUẨN ẢNH 1)
 * ========================================================================= */
.ftn-handle-n {
    top: -7px;
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 20px;
    cursor: ns-resize !important;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ftn-handle-s {
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 20px;
    cursor: ns-resize !important;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ftn-handle-w {
    left: -7px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 48px;
    cursor: ew-resize !important;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ftn-handle-e {
    right: -7px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 48px;
    cursor: ew-resize !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Viên thuốc ngang (Top & Bottom) */
.ftn-pill-handle-h {
    width: 32px;
    height: 10px;
    border-radius: 9999px;
    background: #ffffff;
    border: 2px solid #0284c7;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease, border-color 0.15s ease;
    pointer-events: none;
}
html.dark .ftn-pill-handle-h {
    background: #0f172a;
    border-color: #38bdf8;
}
.ftn-handle:hover .ftn-pill-handle-h {
    transform: scale(1.25);
    border-color: #0369a1;
    background: #e0f2fe;
}

/* Viên thuốc dọc (Left & Right) */
.ftn-pill-handle-v {
    width: 10px;
    height: 32px;
    border-radius: 9999px;
    background: #ffffff;
    border: 2px solid #0284c7;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease, border-color 0.15s ease;
    pointer-events: none;
}
html.dark .ftn-pill-handle-v {
    background: #0f172a;
    border-color: #38bdf8;
}
.ftn-handle:hover .ftn-pill-handle-v {
    transform: scale(1.25);
    border-color: #0369a1;
    background: #e0f2fe;
}

/* THANH KÉO DI CHUYỂN KHUNG TRÊN CÙNG (DRAG BAR) */
.ftn-drag-bar {
    cursor: grab;
    user-select: none;
    touch-action: none;
}
.ftn-drag-bar:active,
.ftn-window.is-dragging .ftn-drag-bar {
    cursor: grabbing !important;
}

/* FLOATING CIRCULAR FAB (VÒNG TRÒN NHỎ TAKE NOTE MỞ MỌI LÚC) */
.floating-take-note-fab {
    box-shadow: 0 10px 25px -3px rgba(2, 132, 199, 0.45), 0 4px 6px -2px rgba(2, 132, 199, 0.2);
}
.floating-take-note-fab:hover {
    box-shadow: 0 14px 30px -3px rgba(2, 132, 199, 0.6), 0 6px 10px -2px rgba(2, 132, 199, 0.3);
}
`;

let targetIdx = css.indexOf(marker);
if (targetIdx === -1) targetIdx = css.indexOf(markerAlt);

if (targetIdx !== -1) {
    css = css.slice(0, targetIdx) + exactStyles;
} else {
    css += '\n' + exactStyles;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ Applied exact image handles CSS (4 circular rings + 4 capsule pills).');
