const fs = require('fs');
const path = require('path');

const focusFile = path.join(__dirname, '..', 'js', 'study-focus-engine.js');
let code = fs.readFileSync(focusFile, 'utf8');

// 1. Nâng z-index của zenFocusHeader lên z-[9999] để không bao giờ bị workstation đè
code = code.replace("hud.className = 'fixed top-3 left-1/2 -translate-x-1/2 z-50", "hud.className = 'fixed top-3 left-1/2 -translate-x-1/2 z-[9999]");

// 2. Tinh chỉnh CSS cho Zen HUD khi trong Workstation
const oldCssInjection = "/* Floating Zen HUD trên cùng */";
const newCssInjection = `/* Zen Mode trong Workstations */
                body.zen-focus-active #toeicReadingWorkstation header,
                body.zen-focus-active #toeicListeningWorkstation header {
                    border-bottom-color: rgba(56, 189, 248, 0.2) !important;
                }

                /* Floating Zen HUD trên cùng */`;

if (code.includes(oldCssInjection) && !code.includes('Zen Mode trong Workstations')) {
    code = code.replace(oldCssInjection, newCssInjection);
}

fs.writeFileSync(focusFile, code, 'utf8');
console.log('✅ Đã nâng cấp z-index và CSS cho Zen Focus Engine!');
