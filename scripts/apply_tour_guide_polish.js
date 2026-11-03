const fs = require('fs');

console.log('=== POLISHING APP TOUR GUIDE & Z-INDEX CLEARANCE ===');
let tourCode = fs.readFileSync('js/app-tour-guide.js', 'utf8');

// 1. Ensure inline styles on root in _createTourDOM
const oldCreateDom = `            // Backdrop Container
            const root = document.createElement('div');
            root.id = 'appTourGuideRoot';
            root.className = 'fixed inset-0 z-[99990] pointer-events-auto transition-opacity duration-300';`;

const newCreateDom = `            // Backdrop Container
            const root = document.createElement('div');
            root.id = 'appTourGuideRoot';
            root.className = 'fixed inset-0 pointer-events-auto transition-opacity duration-300';
            root.style.cssText = 'position: fixed !important; inset: 0 !important; z-index: 9999990 !important; pointer-events: auto !important;';`;

if (tourCode.includes(oldCreateDom)) {
    tourCode = tourCode.replace(oldCreateDom, newCreateDom);
    console.log('✅ Injected absolute priority z-index 9999990 into appTourGuideRoot');
}

// 2. Ensure popover style in _createTourDOM has high z-index
tourCode = tourCode.replace(
    `style="z-index: 99995; display: none;"`,
    `style="z-index: 9999999 !important; display: none;"`
);
tourCode = tourCode.replace(
    `style="z-index: 99991;"`,
    `style="z-index: 9999991 !important;"`
);
tourCode = tourCode.replace(
    `style="z-index: 99992; display: none;"`,
    `style="z-index: 9999992 !important; display: none;"`
);

// 3. Update _renderSpotlight positioning to guarantee clearance below #sanhTopHeaderBar
const oldPosLogic = `            // Calculate Popover Position
            popover.style.display = 'block';
            const popW = Math.min(window.innerWidth - 32, 420);
            const popH = popover.offsetHeight || 260;

            let popLeft = rect.left + rect.width / 2 - popW / 2;
            popLeft = Math.max(16, Math.min(window.innerWidth - popW - 16, popLeft));

            let popTop = rect.top + rect.height + 16;
            // Nếu tràn màn hình dưới thì đảo lên trên
            if (popTop + popH > window.innerHeight - 20) {
                popTop = Math.max(20, rect.top - popH - 16);
            }

            popover.style.left = \`\${popLeft}px\`;
            popover.style.top = \`\${popTop}px\`;`;

const newPosLogic = `            // Calculate Popover Position
            popover.style.display = 'block';
            popover.style.zIndex = '9999999';
            const popW = Math.min(window.innerWidth - 32, 420);
            const popH = popover.offsetHeight || 260;

            let popLeft = rect.left + rect.width / 2 - popW / 2;
            popLeft = Math.max(16, Math.min(window.innerWidth - popW - 16, popLeft));

            let popTop = rect.top + rect.height + 16;
            
            // Đảm bảo không bao giờ bị che bởi thanh Top Header Bar (#sanhTopHeaderBar)
            const headerEl = document.getElementById('sanhTopHeaderBar');
            if (headerEl) {
                const headerBox = headerEl.getBoundingClientRect();
                if (popTop < headerBox.bottom + 16 && rect.top <= headerBox.bottom) {
                    popTop = headerBox.bottom + 18;
                }
            }

            // Nếu tràn màn hình dưới thì đảo lên trên nhưng vẫn tránh header
            if (popTop + popH > window.innerHeight - 20) {
                const altTop = rect.top - popH - 16;
                if (altTop >= 20) {
                    popTop = altTop;
                }
            }

            popover.style.left = \`\${popLeft}px\`;
            popover.style.top = \`\${popTop}px\`;`;

if (tourCode.includes(oldPosLogic)) {
    tourCode = tourCode.replace(oldPosLogic, newPosLogic);
    console.log('✅ Injected header clearance and high z-index into _renderSpotlight');
}

fs.writeFileSync('js/app-tour-guide.js', tourCode, 'utf8');
if (fs.existsSync('www/js/app-tour-guide.js')) {
    fs.writeFileSync('www/js/app-tour-guide.js', tourCode, 'utf8');
}
console.log('🎉 Tour guide polish complete!');
