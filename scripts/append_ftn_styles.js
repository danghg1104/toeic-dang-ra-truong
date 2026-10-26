const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'take-note-hybrid.css');
let css = fs.readFileSync(cssPath, 'utf8');

const additionalStyles = `

/* =========================================================================
 * FLOATING TAKE NOTE WINDOW & 4-CORNER RESIZE HANDLES
 * ========================================================================= */
.ftn-window {
    box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(245, 158, 11, 0.3);
    animation: ftnAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    touch-action: none;
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
    box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(245, 158, 11, 0.35);
}

/* 4 CORNER RESIZE HANDLES (NW, NE, SW, SE) */
.ftn-handle {
    position: absolute;
    z-index: 60;
    touch-action: none;
    user-select: none;
}

.ftn-handle-nw {
    top: -4px;
    left: -4px;
    width: 22px;
    height: 22px;
    cursor: nwse-resize;
}
.ftn-handle-ne {
    top: -4px;
    right: -4px;
    width: 22px;
    height: 22px;
    cursor: nesw-resize;
}
.ftn-handle-sw {
    bottom: -4px;
    left: -4px;
    width: 22px;
    height: 22px;
    cursor: nesw-resize;
}
.ftn-handle-se {
    bottom: -4px;
    right: -4px;
    width: 22px;
    height: 22px;
    cursor: nwse-resize;
}

/* 4 CORNER VISUAL DOTS (Amber Totoro Grip) */
.ftn-handle-corner-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #f59e0b;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), background 0.15s ease;
    pointer-events: none;
}
html.dark .ftn-handle-corner-dot {
    border-color: #0f172a;
    background: #fbbf24;
}

.ftn-handle-nw .ftn-handle-corner-dot { top: 4px; left: 4px; }
.ftn-handle-ne .ftn-handle-corner-dot { top: 4px; right: 4px; }
.ftn-handle-sw .ftn-handle-corner-dot { bottom: 4px; left: 4px; }
.ftn-handle-se .ftn-handle-corner-dot { bottom: 4px; right: 4px; }

.ftn-handle:hover .ftn-handle-corner-dot {
    transform: scale(1.4);
    background: #ea580c;
}

/* 4 EDGE RESIZE HANDLES (N, S, W, E) */
.ftn-handle-n {
    top: -3px;
    left: 20px;
    right: 20px;
    height: 8px;
    cursor: ns-resize;
}
.ftn-handle-s {
    bottom: -3px;
    left: 20px;
    right: 20px;
    height: 8px;
    cursor: ns-resize;
}
.ftn-handle-w {
    left: -3px;
    top: 20px;
    bottom: 20px;
    width: 8px;
    cursor: ew-resize;
}
.ftn-handle-e {
    right: -3px;
    top: 20px;
    bottom: 20px;
    width: 8px;
    cursor: ew-resize;
}

/* FLOATING CIRCULAR FAB (VÒNG TRÒN NHỎ TAKE NOTE MỞ MỌI LÚC) */
.floating-take-note-fab {
    box-shadow: 0 10px 25px -3px rgba(245, 158, 11, 0.5), 0 4px 6px -2px rgba(245, 158, 11, 0.2);
}
.floating-take-note-fab:hover {
    box-shadow: 0 14px 30px -3px rgba(245, 158, 11, 0.65), 0 6px 10px -2px rgba(245, 158, 11, 0.3);
}
`;

if (!css.includes('.ftn-window')) {
    css += additionalStyles;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('✅ Added floating take note styles to css/take-note-hybrid.css');
} else {
    console.log('Styles already exist in css/take-note-hybrid.css');
}
