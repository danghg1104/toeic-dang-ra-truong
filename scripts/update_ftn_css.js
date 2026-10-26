const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'take-note-hybrid.css');
let css = fs.readFileSync(cssPath, 'utf8');

const marker = '/* =========================================================================\r\n * FLOATING TAKE NOTE WINDOW';
const markerAlt = '/* =========================================================================\n * FLOATING TAKE NOTE WINDOW';

const newStyles = `/* =========================================================================
 * FLOATING TAKE NOTE WINDOW & 4-CORNER RESIZE HANDLES (ẢNH 1 & ẢNH 2)
 * ========================================================================= */
.ftn-window {
    box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 2px rgba(245, 158, 11, 0.5);
    animation: ftnAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    touch-action: none;
    border-radius: 24px;
    position: fixed;
    z-index: 9999 !important;
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
html.dark .ftn-window {
    box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.75), 0 0 0 2px rgba(245, 158, 11, 0.4);
}

/* 4 CORNER RESIZE HANDLES - GENEROUS 36px HITBOX WITH HIGH Z-INDEX (ẢNH 1) */
.ftn-handle {
    position: absolute;
    z-index: 1000 !important;
    touch-action: none;
    user-select: none;
    pointer-events: auto;
}

.ftn-handle-nw {
    top: 0;
    left: 0;
    width: 36px;
    height: 36px;
    cursor: nwse-resize !important;
}
.ftn-handle-ne {
    top: 0;
    right: 0;
    width: 36px;
    height: 36px;
    cursor: nesw-resize !important;
}
.ftn-handle-sw {
    bottom: 0;
    left: 0;
    width: 36px;
    height: 36px;
    cursor: nesw-resize !important;
}
.ftn-handle-se {
    bottom: 0;
    right: 0;
    width: 36px;
    height: 36px;
    cursor: nwse-resize !important;
}

/* VISUAL CORNER GRIP ACCENTS (Góc thu to thu nhỏ kiểu ảnh 1) */
.ftn-corner-grip {
    position: absolute;
    width: 14px;
    height: 14px;
    pointer-events: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.8;
}
.ftn-handle:hover .ftn-corner-grip {
    opacity: 1;
    transform: scale(1.3);
}

.ftn-handle-nw .ftn-corner-grip {
    top: 4px;
    left: 4px;
    border-top: 3.5px solid #f59e0b;
    border-left: 3.5px solid #f59e0b;
    border-top-left-radius: 12px;
}
.ftn-handle-ne .ftn-corner-grip {
    top: 4px;
    right: 4px;
    border-top: 3.5px solid #f59e0b;
    border-right: 3.5px solid #f59e0b;
    border-top-right-radius: 12px;
}
.ftn-handle-sw .ftn-corner-grip {
    bottom: 4px;
    left: 4px;
    border-bottom: 3.5px solid #f59e0b;
    border-left: 3.5px solid #f59e0b;
    border-bottom-left-radius: 12px;
}
.ftn-handle-se .ftn-corner-grip {
    bottom: 4px;
    right: 4px;
    border-bottom: 3.5px solid #f59e0b;
    border-right: 3.5px solid #f59e0b;
    border-bottom-right-radius: 12px;
}

/* 4 EDGE RESIZERS */
.ftn-handle-n {
    top: 0;
    left: 36px;
    right: 36px;
    height: 10px;
    cursor: ns-resize !important;
}
.ftn-handle-s {
    bottom: 0;
    left: 36px;
    right: 36px;
    height: 10px;
    cursor: ns-resize !important;
}
.ftn-handle-w {
    left: 0;
    top: 36px;
    bottom: 36px;
    width: 10px;
    cursor: ew-resize !important;
}
.ftn-handle-e {
    right: 0;
    top: 36px;
    bottom: 36px;
    width: 10px;
    cursor: ew-resize !important;
}

/* TOP DRAG BAR (KÉO DI CHUYỂN KHUNG - ẢNH 2) */
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
    box-shadow: 0 10px 25px -3px rgba(245, 158, 11, 0.5), 0 4px 6px -2px rgba(245, 158, 11, 0.2);
}
.floating-take-note-fab:hover {
    box-shadow: 0 14px 30px -3px rgba(245, 158, 11, 0.65), 0 6px 10px -2px rgba(245, 158, 11, 0.3);
}
`;

let targetIdx = css.indexOf(marker);
if (targetIdx === -1) targetIdx = css.indexOf(markerAlt);

if (targetIdx !== -1) {
    css = css.slice(0, targetIdx) + newStyles;
} else {
    css += '\n' + newStyles;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ Updated css/take-note-hybrid.css with perfected 36px corner grips and drag bar styles.');
