const fs = require('fs');
const path = require('path');

// 1. Patch index.html and www/index.html
['index.html', 'www/index.html'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf8');

    // 1.1 Viewport meta tag
    const oldMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">';
    const newMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover, interactive-widget=resizes-content">';
    if (html.includes(oldMeta)) {
        html = html.replace(oldMeta, newMeta);
        console.log(`[OK] Updated viewport meta in ${filePath}`);
    }

    // 1.2 Mobile CSS enhancements
    const cssMarker = '/* Mobile & Virtual Keyboard Responsive CSS */';
    if (!html.includes(cssMarker)) {
        const mobileCSS = `
        ${cssMarker}
        html {
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100%;
        }
        body {
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100%;
            position: relative;
            -webkit-overflow-scrolling: touch;
        }

        /* Tự động ẩn thanh điều hướng dưới đáy khi bàn phím ảo iOS / Android mở ra */
        body.keyboard-open #mobileBottomNav,
        body.keyboard-open .mobile-nav-fixed {
            display: none !important;
        }
        body.keyboard-open {
            padding-bottom: 12px !important;
        }

        /* Đấu trường từ vựng thích ứng chiều cao mượt mà khi bàn phím ảo bật */
        @media (max-width: 640px) {
            #vgArenaContainer {
                height: clamp(340px, 56vh, 480px) !important;
                min-height: 320px !important;
            }
            body.keyboard-open #vgArenaContainer {
                height: clamp(260px, calc(var(--mobile-visual-height, 100vh) - 160px), 360px) !important;
                min-height: 240px !important;
            }
            #vgReflexLauncher {
                width: 95px !important;
                height: 95px !important;
            }
            #vgReflexLauncher .w-24 {
                width: 70px !important;
                height: 70px !important;
            }
        }

        /* Mobile touch target minimum standards (WCAG 2.2 AA) */
        @media (max-width: 768px) {
            .mob-nav-item, #mobileBottomNav button {
                min-height: 48px;
            }
            .safe-touch-btn {
                min-height: 44px;
                min-width: 44px;
            }
        }
        `;

        // Chèn vào cuối block style đầu tiên
        const styleEnd = '</style>';
        const firstStyleIdx = html.indexOf(styleEnd);
        if (firstStyleIdx !== -1) {
            html = html.slice(0, firstStyleIdx) + mobileCSS + '\n    ' + html.slice(firstStyleIdx);
            console.log(`[OK] Injected mobile CSS into ${filePath}`);
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
});

// 2. Patch js/app-core.bundle.js and www/js/app-core.bundle.js
['js/app-core.bundle.js', 'www/js/app-core.bundle.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // 2.1 Tự động đóng sidebar drawer khi chọn tab trên mobile
    const switchTabTarget = 'function switchTab(tabId) {';
    const switchTabMobileClose = `function switchTab(tabId) {
            // Tự động đóng menu thanh bên trên mobile khi chuyển tab
            if (typeof window !== 'undefined' && window.innerWidth < 1024 && typeof toggleSidebar === 'function') {
                try { toggleSidebar(false); } catch(e) {}
            }`;

    if (code.includes(switchTabTarget) && !code.includes('window.innerWidth < 1024 && typeof toggleSidebar')) {
        code = code.replace(switchTabTarget, switchTabMobileClose);
        console.log(`[OK] Added auto-close sidebar on mobile tab switch in ${filePath}`);
    }

    // 2.2 Khởi tạo Mobile Experience: AudioContext unlocker & visualViewport virtual keyboard detector
    const mobileInitCode = `
        // =========================================================================
        // MOBILE EXPERIENCE ENGINE (iOS & Android Virtual Keyboard & AudioContext)
        // =========================================================================
        function initMobileExperience() {
            // 1. Unlock AudioContext trên thiết bị di động (Mobile Autoplay Restriction)
            const unlockAudio = () => {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        if (!window._globalAudioCtx) {
                            window._globalAudioCtx = new AudioContext();
                        }
                        if (window._globalAudioCtx.state === 'suspended') {
                            window._globalAudioCtx.resume();
                        }
                    }
                    if (window.VocabGameWorkstation && window.VocabGameWorkstation.audioCtx && window.VocabGameWorkstation.audioCtx.state === 'suspended') {
                        window.VocabGameWorkstation.audioCtx.resume();
                    }
                } catch (e) {}
                window.removeEventListener('touchstart', unlockAudio);
                window.removeEventListener('pointerdown', unlockAudio);
            };
            window.addEventListener('touchstart', unlockAudio, { passive: true });
            window.addEventListener('pointerdown', unlockAudio, { passive: true });

            // 2. VisualViewport & Virtual Keyboard Resize Manager (iOS & Android)
            const handleViewportChange = () => {
                if (!window.visualViewport) return;
                const vh = window.visualViewport.height;
                const totalH = window.innerHeight;
                const isKeyboard = vh < totalH * 0.78;
                
                document.documentElement.style.setProperty('--mobile-visual-height', \`\${vh}px\`);
                document.body.classList.toggle('keyboard-open', isKeyboard);

                const nav = document.getElementById('mobileBottomNav');
                if (nav) {
                    nav.style.display = isKeyboard ? 'none' : '';
                }
            };

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', handleViewportChange);
                window.visualViewport.addEventListener('scroll', handleViewportChange);
                handleViewportChange();
            }

            // Fallback cho trình duyệt cũ
            window.addEventListener('focusin', (e) => {
                const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
                if (tag === 'input' || tag === 'textarea') {
                    document.body.classList.add('keyboard-open');
                    const nav = document.getElementById('mobileBottomNav');
                    if (nav) nav.style.display = 'none';
                }
            });

            window.addEventListener('focusout', (e) => {
                setTimeout(() => {
                    const active = document.activeElement;
                    const tag = active && active.tagName ? active.tagName.toLowerCase() : '';
                    if (tag !== 'input' && tag !== 'textarea') {
                        document.body.classList.remove('keyboard-open');
                        const nav = document.getElementById('mobileBottomNav');
                        if (nav) nav.style.display = '';
                    }
                }, 150);
            });
        }
        if (typeof window !== 'undefined') {
            window.initMobileExperience = initMobileExperience;
        }
    `;

    if (!code.includes('initMobileExperience()')) {
        // Chèn vào trước bootstrapApplication
        const bootstrapTarget = 'function bootstrapApplication() {';
        if (code.includes(bootstrapTarget)) {
            code = code.replace(bootstrapTarget, mobileInitCode + '\n        function bootstrapApplication() {\n            try { initMobileExperience(); } catch(e) {}');
            console.log(`[OK] Injected initMobileExperience into ${filePath}`);
        }
    }

    fs.writeFileSync(filePath, code, 'utf8');
});

console.log('Mobile system enhancements applied successfully!');
