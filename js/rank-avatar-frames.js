/**
 * =========================================================================
 * RANK AVATAR FRAMES ENGINE — AAA GAME UI IDENTITY WITH DYNAMIC PARTICLES
 * =========================================================================
 * Bộ sưu tập 6 Khung Avatar Chiến Tướng Cách Điệu Cực Ngầu:
 * 1. Tier I: Bronze Gladiator (Chiến Binh Bát Giác & Gai Nanh Sói)
 * 2. Tier II: Silver Steampunk (Cánh Cơ Khí Song Kiếm & Bánh Răng La Bàn)
 * 3. Tier III: Gold Phoenix (Đôi Cánh Hoàng Kim & Vương Miện Thái Dương)
 * 4. Tier IV: Platinum Tidal (Cặp Sừng Sóng Thần Ukiyo-e & Song Tinh Ánh Sáng)
 * 5. Tier V: Diamond Frost (Băng Long Tinh Thể & Tuyết Rơi Lung Linh)
 * 6. Tier VI: Legend Solar Dragon (Chúa Tể Hỏa Long & Nhật Thực Tinh Vân)
 * =========================================================================
 */

(function (window) {
    'use strict';

    // Inject Dynamic Animation Styles
    function injectStyles() {
        if (document.getElementById('rankAvatarFramesStyles')) return;
        const style = document.createElement('style');
        style.id = 'rankAvatarFramesStyles';
        style.textContent = `
            /* BRONZE PULSE */
            @keyframes bronzeBreathe {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.4)); }
                50% { transform: scale(1.02); filter: drop-shadow(0 0 14px rgba(245, 158, 11, 0.75)); }
            }
            .anim-bronze-breathe {
                animation: bronzeBreathe 3.5s ease-in-out infinite;
                transform-origin: center;
            }

            /* SILVER GEARS SPIN */
            @keyframes gearSpinCw {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes gearSpinCcw {
                from { transform: rotate(0deg); }
                to { transform: rotate(-360deg); }
            }
            .anim-gear-cw {
                animation: gearSpinCw 12s linear infinite;
                transform-origin: 28px 100px;
            }
            .anim-gear-ccw {
                animation: gearSpinCcw 12s linear infinite;
                transform-origin: 172px 100px;
            }

            /* GOLD SOLAR PULSE */
            @keyframes solarGlowPulse {
                0%, 100% { filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) drop-shadow(0 0 20px rgba(234, 88, 12, 0.25)); }
                50% { filter: drop-shadow(0 0 24px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 35px rgba(245, 158, 11, 0.6)); }
            }
            .anim-gold-pulse {
                animation: solarGlowPulse 2.8s ease-in-out infinite;
            }

            /* PLATINUM TIDAL WAVE */
            @keyframes tidalWaveShimmer {
                0%, 100% { filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.6)); }
                50% { filter: drop-shadow(0 0 22px rgba(14, 165, 233, 0.95)) drop-shadow(0 0 32px rgba(56, 189, 248, 0.5)); }
            }
            .anim-tidal-shimmer {
                animation: tidalWaveShimmer 2.6s ease-in-out infinite;
            }

            /* DIAMOND FROST: SNOWFLAKES & AURORA SHIMMER */
            @keyframes snowFlutter1 {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                20% { opacity: 0.9; }
                80% { opacity: 0.9; }
                100% { transform: translate(-10px, 35px) rotate(180deg); opacity: 0; }
            }
            @keyframes snowFlutter2 {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                25% { opacity: 1; }
                75% { opacity: 1; }
                100% { transform: translate(12px, 40px) rotate(-160deg); opacity: 0; }
            }
            @keyframes snowFlutter3 {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                30% { opacity: 0.85; }
                70% { opacity: 0.85; }
                100% { transform: translate(-6px, 32px) rotate(120deg); opacity: 0; }
            }
            .anim-snow-1 { animation: snowFlutter1 3.2s ease-in-out infinite; }
            .anim-snow-2 { animation: snowFlutter2 4.0s ease-in-out infinite 1.2s; }
            .anim-snow-3 { animation: snowFlutter3 3.6s ease-in-out infinite 0.6s; }

            @keyframes auroraGlow {
                0% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.7)) hue-rotate(0deg); }
                50% { filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.85)) hue-rotate(140deg); }
                100% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.7)) hue-rotate(360deg); }
            }
            .anim-aurora-glow {
                animation: auroraGlow 5.5s linear infinite;
            }

            /* LEGEND COSMIC DRAGON */
            @keyframes nebulaSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .anim-nebula-spin {
                animation: nebulaSpin 18s linear infinite;
                transform-origin: 100px 100px;
            }
            @keyframes dragonFlamePulse {
                0%, 100% { filter: drop-shadow(0 0 14px rgba(239, 68, 68, 0.6)) drop-shadow(0 0 28px rgba(245, 158, 11, 0.4)); }
                50% { filter: drop-shadow(0 0 32px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 50px rgba(251, 191, 36, 0.75)); }
            }
            .anim-dragon-flame {
                animation: dragonFlamePulse 2.4s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    const RankAvatarFrames = {
        RANKS: {
            bronze: { id: 'bronze', name: 'Chiến Binh Giác Đấu', elo: '0 - 999', score: '350+', tier: 'I', color: '#f59e0b' },
            silver: { id: 'silver', name: 'Hiệp Sĩ Cơ Khí', elo: '1000 - 1499', score: '450+', tier: 'II', color: '#38bdf8' },
            gold: { id: 'gold', name: 'Hoàng Gia Thái Dương', elo: '1500 - 1999', score: '600+', tier: 'III', color: '#fbbf24' },
            platinum: { id: 'platinum', name: 'Lãnh Chúa Sóng Thần', elo: '2000 - 2499', score: '750+', tier: 'IV', color: '#06b6d4' },
            diamond: { id: 'diamond', name: 'Băng Long Cực Quang', elo: '2500 - 2999', score: '850+', tier: 'V', color: '#a855f7' },
            legend: { id: 'legend', name: 'Chúa Tể Hỏa Long', elo: '3000+', score: '950+', tier: 'VI', color: '#ef4444' }
        },

        normalizeRank(rank) {
            if (!rank) return 'bronze';
            const r = String(rank).toLowerCase().trim();
            if (r.includes('huyen') || r.includes('legend') || r.includes('hoa long')) return 'legend';
            if (r.includes('kim cuong') || r.includes('diamond') || r.includes('bang long')) return 'diamond';
            if (r.includes('bach kim') || r.includes('platinum') || r.includes('song than')) return 'platinum';
            if (r.includes('vang') || r.includes('gold') || r.includes('thai duong')) return 'gold';
            if (r.includes('bac') || r.includes('silver') || r.includes('co khi')) return 'silver';
            return 'bronze';
        },

        getUserActiveRank(user) {
            if (user && user.rankTier) return this.normalizeRank(user.rankTier);
            if (user && user.equippedRankFrame) return this.normalizeRank(user.equippedRankFrame);
            // Deduce from Elo or targetScore
            const elo = user?.elo || (user?.diagnosticResults?.estimatedTotal) || 0;
            if (elo >= 3000) return 'legend';
            if (elo >= 2500) return 'diamond';
            if (elo >= 2000) return 'platinum';
            if (elo >= 1500 || (user?.targetScore >= 600)) return 'gold';
            if (elo >= 1000 || (user?.targetScore >= 450)) return 'silver';
            return 'bronze';
        },

        getSvg(rankKey, avatarUrl, options = {}) {
            injectStyles();
            const rank = this.normalizeRank(rankKey);
            const size = options.size || 200;
            const uniqueId = 'rf_' + Math.random().toString(36).substr(2, 9);
            const imgHref = avatarUrl || '/assets/mascot/may_avatar.png';

            // Center portrait circle definition: cx=100, cy=100, r=44
            const avatarClip = `
                <clipPath id="clipCircle_${uniqueId}">
                    <circle cx="100" cy="100" r="44"/>
                </clipPath>
            `;

            let frameElements = '';
            let animClass = '';

            switch (rank) {
                // =========================================================================
                // 1. TIER I: BRONZE GLADIATOR (Bát Giác Rèn Đồng & Gai Nanh Sói Cổ Đại)
                // =========================================================================
                case 'bronze':
                    animClass = 'anim-bronze-breathe';
                    frameElements = `
                        <defs>
                            ${avatarClip}
                            <linearGradient id="bronzeGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#f59e0b"/>
                                <stop offset="40%" stop-color="#b45309"/>
                                <stop offset="80%" stop-color="#78350f"/>
                                <stop offset="100%" stop-color="#451a03"/>
                            </linearGradient>
                            <linearGradient id="runeGrad_${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#fef08a"/>
                                <stop offset="100%" stop-color="#d97706"/>
                            </linearGradient>
                        </defs>
                        <!-- 4 Corner Wolf Fang Spikes -->
                        <g fill="url(#bronzeGrad_${uniqueId})" stroke="#fef08a" stroke-width="1.2">
                            <polygon points="46,46 20,20 44,32"/>
                            <polygon points="154,46 180,20 156,32"/>
                            <polygon points="46,154 20,180 44,168"/>
                            <polygon points="154,154 180,180 156,168"/>
                        </g>
                        <!-- Forged Chainmail Arch -->
                        <path d="M38,138 Q100,184 162,138" fill="none" stroke="#92400e" stroke-width="4.5" stroke-linecap="round"/>
                        <path d="M42,144 Q100,188 158,144" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>
                        <!-- Octagonal Celtic Ring -->
                        <polygon points="100,42 142,58 158,100 142,142 100,158 58,142 42,100 58,58" fill="#1e293b" stroke="url(#bronzeGrad_${uniqueId})" stroke-width="5"/>
                        <!-- Inner Bevel Ring -->
                        <circle cx="100" cy="100" r="48" fill="#0f172a" stroke="#d97706" stroke-width="2.5"/>
                        <!-- Sói Mây Avatar Image -->
                        <image href="${imgHref}" x="56" y="56" width="88" height="88" clip-path="url(#clipCircle_${uniqueId})" preserveAspectRatio="xMidYMid slice"/>
                        <!-- Inner Gold Rim -->
                        <circle cx="100" cy="100" r="44" fill="none" stroke="#fef08a" stroke-width="1.8"/>
                        <!-- 4 Rune Gemstones -->
                        <circle cx="100" cy="46" r="5" fill="#10b981" stroke="#fef08a" stroke-width="1.5"/>
                        <circle cx="154" cy="100" r="5" fill="#10b981" stroke="#fef08a" stroke-width="1.5"/>
                        <circle cx="100" cy="154" r="5" fill="#10b981" stroke="#fef08a" stroke-width="1.5"/>
                        <circle cx="46" cy="100" r="5" fill="#10b981" stroke="#fef08a" stroke-width="1.5"/>
                    `;
                    break;

                // =========================================================================
                // 2. TIER II: SILVER STEAMPUNK (Cánh Cơ Khí Song Kiếm & Bánh Răng La Bàn)
                // =========================================================================
                case 'silver':
                    animClass = '';
                    frameElements = `
                        <defs>
                            ${avatarClip}
                            <linearGradient id="silverGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="30%" stop-color="#cbd5e1"/>
                                <stop offset="70%" stop-color="#64748b"/>
                                <stop offset="100%" stop-color="#334155"/>
                            </linearGradient>
                            <linearGradient id="cyanTechGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#e0f2fe"/>
                                <stop offset="50%" stop-color="#38bdf8"/>
                                <stop offset="100%" stop-color="#0284c7"/>
                            </linearGradient>
                        </defs>
                        <!-- Mechanical Steampunk Wings (Left & Right) -->
                        <g fill="url(#silverGrad_${uniqueId})" stroke="#38bdf8" stroke-width="1.2">
                            <!-- Left Wing Plumes -->
                            <path d="M50,90 C30,70 15,50 8,30 C20,38 32,54 48,72 Z"/>
                            <path d="M46,102 C24,88 10,72 4,52 C18,60 30,76 44,92 Z"/>
                            <path d="M48,114 C28,106 14,94 8,80 C20,86 32,98 44,106 Z"/>
                            <!-- Right Wing Plumes -->
                            <path d="M150,90 C170,70 185,50 192,30 C180,38 168,54 152,72 Z"/>
                            <path d="M154,102 C176,88 190,72 196,52 C182,60 170,76 156,92 Z"/>
                            <path d="M152,114 C172,106 186,94 192,80 C180,86 168,98 156,106 Z"/>
                        </g>
                        <!-- Dual Silver Rapier Blades -->
                        <g stroke="url(#silverGrad_${uniqueId})" stroke-width="2.5" stroke-linecap="round">
                            <line x1="28" y1="40" x2="28" y2="160"/>
                            <line x1="172" y1="40" x2="172" y2="160"/>
                        </g>
                        <!-- Rotating Cyan Tech Gears -->
                        <g class="anim-gear-cw">
                            <circle cx="28" cy="100" r="10" fill="none" stroke="url(#cyanTechGrad_${uniqueId})" stroke-width="2.5" stroke-dasharray="4 3"/>
                        </g>
                        <g class="anim-gear-ccw">
                            <circle cx="172" cy="100" r="10" fill="none" stroke="url(#cyanTechGrad_${uniqueId})" stroke-width="2.5" stroke-dasharray="4 3"/>
                        </g>
                        <!-- Center Main Metallic Bevel Ring -->
                        <circle cx="100" cy="100" r="52" fill="#0f172a" stroke="url(#silverGrad_${uniqueId})" stroke-width="5"/>
                        <!-- Sói Mây Avatar Image -->
                        <image href="${imgHref}" x="56" y="56" width="88" height="88" clip-path="url(#clipCircle_${uniqueId})" preserveAspectRatio="xMidYMid slice"/>
                        <!-- Inner Cyan Tech Halo -->
                        <circle cx="100" cy="100" r="44" fill="none" stroke="#38bdf8" stroke-width="2"/>
                        <!-- Top Aviator Crest -->
                        <polygon points="100,38 114,48 86,48" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2"/>
                        <!-- Bottom Clockwork Dial -->
                        <circle cx="100" cy="154" r="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                        <circle cx="100" cy="154" r="3" fill="#38bdf8"/>
                    `;
                    break;

                // =========================================================================
                // 3. TIER III: GOLD PHOENIX (Đôi Cánh Hoàng Kim & Vương Miện Thái Dương)
                // =========================================================================
                case 'gold':
                    animClass = 'anim-gold-pulse';
                    frameElements = `
                        <defs>
                            ${avatarClip}
                            <linearGradient id="goldFeatherGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#fffbeb"/>
                                <stop offset="30%" stop-color="#fde047"/>
                                <stop offset="70%" stop-color="#d97706"/>
                                <stop offset="100%" stop-color="#78350f"/>
                            </linearGradient>
                            <linearGradient id="rubyGemGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#f43f5e"/>
                                <stop offset="100%" stop-color="#881337"/>
                            </linearGradient>
                        </defs>
                        <!-- Grand Golden Eagle / Phoenix Wings Spreading Wide -->
                        <g fill="url(#goldFeatherGrad_${uniqueId})" stroke="#fef08a" stroke-width="1.2">
                            <!-- Left Wing Plumes -->
                            <path d="M52,82 C30,55 12,35 2,12 C16,22 34,44 50,68 Z"/>
                            <path d="M46,96 C24,75 10,58 4,38 C18,48 32,70 48,86 Z"/>
                            <path d="M44,110 C22,95 10,82 6,66 C18,74 30,92 46,102 Z"/>
                            <!-- Right Wing Plumes -->
                            <path d="M148,82 C170,55 188,35 198,12 C184,22 166,44 150,68 Z"/>
                            <path d="M154,96 C176,75 190,58 196,38 C182,48 168,70 152,86 Z"/>
                            <path d="M156,110 C178,95 190,82 194,66 C182,74 170,92 154,102 Z"/>
                        </g>
                        <!-- Imperial Sun God Crown on Top -->
                        <g fill="url(#goldFeatherGrad_${uniqueId})" stroke="#fef08a" stroke-width="1.4">
                            <polygon points="100,24 107,44 93,44"/>
                            <polygon points="86,28 96,46 82,46"/>
                            <polygon points="114,28 118,46 104,46"/>
                            <polygon points="74,36 86,48 72,48"/>
                            <polygon points="126,36 128,48 114,48"/>
                        </g>
                        <!-- Center Gold Ring -->
                        <circle cx="100" cy="100" r="54" fill="#1e1b4b" stroke="url(#goldFeatherGrad_${uniqueId})" stroke-width="5.5"/>
                        <!-- Sói Mây Avatar Image -->
                        <image href="${imgHref}" x="56" y="56" width="88" height="88" clip-path="url(#clipCircle_${uniqueId})" preserveAspectRatio="xMidYMid slice"/>
                        <!-- Inner Gold Sun Rim -->
                        <circle cx="100" cy="100" r="44" fill="none" stroke="#fef08a" stroke-width="2.2"/>
                        <!-- Flowing Royal Gold Ribbon Bottom -->
                        <path d="M60,150 Q100,178 140,150 Q120,165 100,165 Q80,165 60,150 Z" fill="url(#goldFeatherGrad_${uniqueId})" stroke="#fef08a" stroke-width="1.2"/>
                        <!-- Crown Ruby Gemstone -->
                        <circle cx="100" cy="46" r="4.5" fill="url(#rubyGemGrad_${uniqueId})" stroke="#fef08a" stroke-width="1.2"/>
                    `;
                    break;

                // =========================================================================
                // 4. TIER IV: PLATINUM TIDAL (Cặp Sừng Sóng Thần Ukiyo-e & Song Tinh Ánh Sáng)
                // =========================================================================
                case 'platinum':
                    animClass = 'anim-tidal-shimmer';
                    frameElements = `
                        <defs>
                            ${avatarClip}
                            <linearGradient id="waveAquaGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="25%" stop-color="#e0f2fe"/>
                                <stop offset="55%" stop-color="#38bdf8"/>
                                <stop offset="85%" stop-color="#0284c7"/>
                                <stop offset="100%" stop-color="#082f49"/>
                            </linearGradient>
                            <linearGradient id="starGlowGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="100%" stop-color="#38bdf8"/>
                            </linearGradient>
                        </defs>
                        <!-- Ukiyo-e Wave Horns Cresting Upward -->
                        <g fill="url(#waveAquaGrad_${uniqueId})" stroke="#ffffff" stroke-width="1.4">
                            <!-- Left Swirling Wave Crests -->
                            <path d="M56,66 C38,40 22,22 14,8 C16,24 28,48 46,68 Z"/>
                            <path d="M46,80 C26,58 14,38 8,24 C14,38 24,62 42,80 Z"/>
                            <path d="M44,112 C24,124 12,138 6,156 C14,142 26,126 46,114 Z"/>
                            <!-- Right Swirling Wave Crests -->
                            <path d="M144,66 C162,40 178,22 186,8 C184,24 172,48 154,68 Z"/>
                            <path d="M154,80 C174,58 186,38 192,24 C186,38 176,62 158,80 Z"/>
                            <path d="M156,112 C176,124 188,138 194,156 C186,142 174,126 154,114 Z"/>
                        </g>
                        <!-- Luminous Water Droplets -->
                        <circle cx="22" cy="18" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)"/>
                        <circle cx="178" cy="18" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)"/>
                        <circle cx="12" cy="45" r="2.5" fill="#38bdf8"/>
                        <circle cx="188" cy="45" r="2.5" fill="#38bdf8"/>
                        <!-- Center Swirling Ring -->
                        <circle cx="100" cy="100" r="54" fill="#042f2e" stroke="url(#waveAquaGrad_${uniqueId})" stroke-width="5.5"/>
                        <!-- Sói Mây Avatar Image -->
                        <image href="${imgHref}" x="56" y="56" width="88" height="88" clip-path="url(#clipCircle_${uniqueId})" preserveAspectRatio="xMidYMid slice"/>
                        <!-- Inner Aqua Rim -->
                        <circle cx="100" cy="100" r="44" fill="none" stroke="#e0f2fe" stroke-width="2"/>
                        <!-- Top 4-Pointed Astral Star -->
                        <g fill="url(#starGlowGrad_${uniqueId})" stroke="#ffffff" stroke-width="0.8">
                            <polygon points="100,28 103,37 112,40 103,43 100,52 97,43 88,40 97,37"/>
                        </g>
                        <!-- Bottom 4-Pointed Star -->
                        <g fill="url(#starGlowGrad_${uniqueId})" stroke="#ffffff" stroke-width="0.8">
                            <polygon points="100,150 102,156 108,158 102,160 100,166 98,160 92,158 98,156"/>
                        </g>

                        <!-- HIỆU ỨNG TUYẾT RƠI & TINH THỂ BĂNG LUNG LINH (PLATINUM DYNAMIC SNOW) -->
                        <g fill="url(#starGlowGrad_${uniqueId})">
                            <g class="anim-snow-1">
                                <circle cx="40" cy="38" r="2.8" filter="drop-shadow(0 0 6px #38bdf8)"/>
                                <line x1="40" y1="34" x2="40" y2="42" stroke="#ffffff" stroke-width="1"/>
                                <line x1="36" y1="38" x2="44" y2="38" stroke="#ffffff" stroke-width="1"/>
                            </g>
                            <g class="anim-snow-2">
                                <circle cx="162" cy="36" r="3.2" filter="drop-shadow(0 0 7px #7dd3fc)"/>
                                <line x1="162" y1="31" x2="162" y2="41" stroke="#ffffff" stroke-width="1.1"/>
                                <line x1="157" y1="36" x2="167" y2="36" stroke="#ffffff" stroke-width="1.1"/>
                            </g>
                            <g class="anim-snow-3">
                                <circle cx="100" cy="18" r="2.4" filter="drop-shadow(0 0 6px #bae6fd)"/>
                                <circle cx="58" cy="148" r="2.2" filter="drop-shadow(0 0 5px #38bdf8)"/>
                                <circle cx="142" cy="148" r="2.2" filter="drop-shadow(0 0 5px #38bdf8)"/>
                            </g>
                        </g>
                    `;
                    break;

                // =========================================================================
                // 5. TIER V: DIAMOND FROST (Băng Long Tinh Thể & Hiệu Ứng Tuyết Lung Linh)
                // =========================================================================
                case 'diamond':
                    animClass = 'anim-aurora-glow';
                    frameElements = `
                        <defs>
                            ${avatarClip}
                            <linearGradient id="frostCrystalGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="30%" stop-color="#e0f2fe"/>
                                <stop offset="60%" stop-color="#7dd3fc"/>
                                <stop offset="85%" stop-color="#c084fc"/>
                                <stop offset="100%" stop-color="#312e81"/>
                            </linearGradient>
                            <linearGradient id="snowSparkleGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="100%" stop-color="#bae6fd"/>
                            </linearGradient>
                        </defs>
                        <!-- Prismatic Ice Crystal Dragon Wings Spreading Upward -->
                        <g fill="url(#frostCrystalGrad_${uniqueId})" stroke="#ffffff" stroke-width="1.2">
                            <!-- Left Crystal Shards -->
                            <polygon points="56,70 28,38 48,58"/>
                            <polygon points="46,84 14,48 38,72"/>
                            <polygon points="42,102 6,66 32,90"/>
                            <polygon points="44,120 18,102 36,110"/>
                            <polygon points="54,136 28,132 46,128"/>
                            <!-- Right Crystal Shards -->
                            <polygon points="144,70 172,38 152,58"/>
                            <polygon points="154,84 186,48 162,72"/>
                            <polygon points="158,102 194,66 168,90"/>
                            <polygon points="156,120 182,102 164,110"/>
                            <polygon points="146,136 172,132 154,128"/>
                        </g>

                        <!-- HIỆU ỨNG TUYẾT RƠI LUNG LINH (DYNAMIC FALLING SNOWFLAKES) -->
                        <g fill="url(#snowSparkleGrad_${uniqueId})">
                            <!-- Snowflake 1 (Top Left) -->
                            <g class="anim-snow-1">
                                <circle cx="38" cy="40" r="2.8" filter="drop-shadow(0 0 5px #7dd3fc)"/>
                                <line x1="38" y1="36" x2="38" y2="44" stroke="#ffffff" stroke-width="1"/>
                                <line x1="34" y1="40" x2="42" y2="40" stroke="#ffffff" stroke-width="1"/>
                            </g>
                            <!-- Snowflake 2 (Top Right) -->
                            <g class="anim-snow-2">
                                <circle cx="162" cy="42" r="3.2" filter="drop-shadow(0 0 6px #c084fc)"/>
                                <line x1="162" y1="37" x2="162" y2="47" stroke="#ffffff" stroke-width="1.2"/>
                                <line x1="157" y1="42" x2="167" y2="42" stroke="#ffffff" stroke-width="1.2"/>
                            </g>
                            <!-- Snowflake 3 (Bottom Center Left) -->
                            <g class="anim-snow-3">
                                <circle cx="68" cy="148" r="2.2" filter="drop-shadow(0 0 4px #38bdf8)"/>
                            </g>
                            <!-- Sparkle Glint 4 (Bottom Right) -->
                            <g class="anim-snow-1">
                                <circle cx="140" cy="152" r="2.5" filter="drop-shadow(0 0 5px #e0f2fe)"/>
                            </g>
                        </g>

                        <!-- Giant Snowflake Tiara on Top -->
                        <g fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
                            <line x1="100" y1="24" x2="100" y2="44"/>
                            <line x1="90" y1="34" x2="110" y2="34"/>
                            <line x1="93" y1="27" x2="107" y2="41"/>
                            <line x1="93" y1="41" x2="107" y2="27"/>
                            <circle cx="100" cy="34" r="3" fill="#38bdf8" stroke="#ffffff" stroke-width="1"/>
                        </g>

                        <!-- Faceted Crystal Border Ring -->
                        <circle cx="100" cy="100" r="54" fill="#0f172a" stroke="url(#frostCrystalGrad_${uniqueId})" stroke-width="5.5"/>
                        <!-- Sói Mây Avatar Image -->
                        <image href="${imgHref}" x="56" y="56" width="88" height="88" clip-path="url(#clipCircle_${uniqueId})" preserveAspectRatio="xMidYMid slice"/>
                        <!-- Inner Diamond Ice Rim -->
                        <circle cx="100" cy="100" r="44" fill="none" stroke="#e0f2fe" stroke-width="2"/>
                        <!-- Bottom Faceted Crystal Crown -->
                        <polygon points="100,166 112,154 100,146 88,154" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2"/>
                    `;
                    break;

                // =========================================================================
                // 6. TIER VI: LEGEND SOLAR DRAGON (Chúa Tể Hỏa Long & Nhật Thực Tinh Vân)
                // =========================================================================
                case 'legend':
                    animClass = 'anim-dragon-flame';
                    frameElements = `
                        <defs>
                            ${avatarClip}
                            <linearGradient id="dragonFlameGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#fef08a"/>
                                <stop offset="25%" stop-color="#f97316"/>
                                <stop offset="60%" stop-color="#ef4444"/>
                                <stop offset="85%" stop-color="#991b1b"/>
                                <stop offset="100%" stop-color="#450a0a"/>
                            </linearGradient>
                            <linearGradient id="goldDragonHorn_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="40%" stop-color="#fbbf24"/>
                                <stop offset="100%" stop-color="#b45309"/>
                            </linearGradient>
                        </defs>
                        <!-- Blazing Dragon-Phoenix Wings Spreading Outward -->
                        <g fill="url(#dragonFlameGrad_${uniqueId})" stroke="#fef08a" stroke-width="1.2">
                            <!-- Left Molten Flame Wings -->
                            <path d="M50,78 C28,50 10,28 2,4 C14,16 32,38 48,64 Z"/>
                            <path d="M44,94 C20,72 6,52 2,30 C16,42 30,66 46,84 Z"/>
                            <path d="M42,110 C18,94 6,78 4,58 C16,68 28,88 44,100 Z"/>
                            <!-- Right Molten Flame Wings -->
                            <path d="M150,78 C172,50 190,28 198,4 C186,16 168,38 152,64 Z"/>
                            <path d="M156,94 C180,72 194,52 198,30 C184,42 170,66 154,84 Z"/>
                            <path d="M158,110 C182,94 194,78 196,58 C184,68 172,88 156,100 Z"/>
                        </g>
                        <!-- Black Solar Eclipse Halo with Flaming Corona -->
                        <g class="anim-nebula-spin">
                            <circle cx="100" cy="100" r="58" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="14 10"/>
                            <circle cx="100" cy="100" r="62" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="8 12"/>
                        </g>
                        <!-- Dragon Horns Crown Top -->
                        <g fill="url(#goldDragonHorn_${uniqueId})" stroke="#fef08a" stroke-width="1.4">
                            <path d="M92,38 C88,24 80,14 72,8 C82,18 86,28 88,42 Z"/>
                            <path d="M108,38 C112,24 120,14 128,8 C118,18 114,28 112,42 Z"/>
                            <polygon points="100,20 106,38 94,38"/>
                        </g>
                        <!-- Center Dark Matter Bevel Ring -->
                        <circle cx="100" cy="100" r="54" fill="#180404" stroke="url(#dragonFlameGrad_${uniqueId})" stroke-width="6"/>
                        <!-- Sói Mây Avatar Image -->
                        <image href="${imgHref}" x="56" y="56" width="88" height="88" clip-path="url(#clipCircle_${uniqueId})" preserveAspectRatio="xMidYMid slice"/>
                        <!-- Inner Flame Corona Rim -->
                        <circle cx="100" cy="100" r="44" fill="none" stroke="#fef08a" stroke-width="2.4"/>
                        <!-- Solar Prominence Flare Gem Bottom -->
                        <circle cx="100" cy="156" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" filter="drop-shadow(0 0 6px #ef4444)"/>
                    `;
                    break;
            }

            return `
                <div class="relative flex items-center justify-center select-none" style="width: ${size}px; height: ${size}px;">
                    <svg class="w-full h-full ${animClass}" viewBox="0 0 200 200" style="overflow: visible;">
                        ${frameElements}
                    </svg>
                </div>
            `;
        },

        renderInto(containerIdOrEl, rankKey, avatarUrl, options = {}) {
            const el = typeof containerIdOrEl === 'string' ? document.getElementById(containerIdOrEl) : containerIdOrEl;
            if (!el) return;
            el.innerHTML = this.getSvg(rankKey, avatarUrl, options);
        },

        // Update the header avatar with the active rank frame
        updateHeaderAvatar(user) {
            const u = user || window.currentUserAccount || (typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null);
            const rank = this.getUserActiveRank(u);
            const avatarUrl = u?.avatar || '/assets/mascot/may_avatar.png';
            
            const sanhAvatar = document.getElementById('sanhMemberAvatar');
            if (sanhAvatar) {
                // Clear and render frame
                sanhAvatar.className = 'relative flex items-center justify-center shrink-0 cursor-pointer';
                sanhAvatar.style.width = '42px';
                sanhAvatar.style.height = '42px';
                sanhAvatar.innerHTML = this.getSvg(rank, avatarUrl, { size: 42 });
                sanhAvatar.title = `Chiến Tướng: ${this.RANKS[rank]?.name || rank} · Bấm để xem hồ sơ`;
            }

            const dropdownAvatar = document.getElementById('sanhMemberDropdownAvatar');
            if (dropdownAvatar) {
                dropdownAvatar.className = 'relative flex items-center justify-center shrink-0';
                dropdownAvatar.style.width = '34px';
                dropdownAvatar.style.height = '34px';
                dropdownAvatar.innerHTML = this.getSvg(rank, avatarUrl, { size: 34 });
            }

            const mobileTopAvatar = document.getElementById('mobileTopAvatar');
            if (mobileTopAvatar) {
                mobileTopAvatar.className = 'relative flex items-center justify-center shrink-0 cursor-pointer';
                mobileTopAvatar.style.width = '38px';
                mobileTopAvatar.style.height = '38px';
                mobileTopAvatar.innerHTML = this.getSvg(rank, avatarUrl, { size: 38 });
            }
        },

        // Equip a rank frame
        equipRankFrame(rankKey) {
            const normalized = this.normalizeRank(rankKey);
            if (window.currentUserAccount) {
                window.currentUserAccount.rankTier = normalized;
                window.currentUserAccount.equippedRankFrame = normalized;
                try {
                    localStorage.setItem('cung_dang_session_user', JSON.stringify(window.currentUserAccount));
                    fetch('/api/user/profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            userId: window.currentUserAccount.id,
                            rankTier: normalized
                        })
                    }).catch(() => {});
                } catch (e) {}
            }
            this.updateHeaderAvatar();
            this.renderShowcaseInProfile();
            if (typeof showToast === 'function') {
                showToast(`✨ Đã trang bị Khung Avatar: ${this.RANKS[normalized].name}!`);
            }
        },

        // Render the rank frames showcase card inside Account Profile View (#view-tai-khoan)
        renderShowcaseInProfile() {
            const container = document.getElementById('rankFramesShowcaseContainer');
            if (!container) return;

            const u = window.currentUserAccount || {};
            const activeRank = this.getUserActiveRank(u);
            const avatarUrl = u.avatar || '/assets/mascot/may_avatar.png';

            const ranksList = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend'];

            container.innerHTML = `
                <div class="rounded-3xl p-5 sm:p-6 bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                                    ⚔️ Identity Vibe AAA
                                </span>
                                <span class="text-xs font-bold text-slate-400">Khung Avatar Thăng Hạng Đấu Trường</span>
                            </div>
                            <h3 class="text-lg font-black text-white tracking-tight mt-1">
                                Bộ Sưu Tập Khung Avatar Chiến Tướng
                            </h3>
                        </div>
                        <span class="text-xs text-amber-300 font-bold bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full self-start sm:self-auto">
                            Đang dùng: ${this.RANKS[activeRank].name}
                        </span>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
                        ${ranksList.map(rk => {
                            const info = this.RANKS[rk];
                            const isEquipped = activeRank === rk;
                            return `
                                <div onclick="window.RankAvatarFrames.equipRankFrame('${rk}')" 
                                     class="group p-3 rounded-2xl bg-slate-850 border ${isEquipped ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-800' : 'border-slate-800 hover:border-slate-700'} flex flex-col items-center text-center transition cursor-pointer active:scale-95 shadow-md">
                                    <div class="w-24 h-24 my-1 flex items-center justify-center">
                                        ${this.getSvg(rk, avatarUrl, { size: 92 })}
                                    </div>
                                    <div class="mt-2 w-full">
                                        <div class="text-xs font-black text-white truncate">${info.name}</div>
                                        <div class="text-[10px] text-slate-400 font-mono">${info.score} ETS · ${info.elo}</div>
                                    </div>
                                    <button type="button" class="mt-2.5 w-full py-1 rounded-xl text-[10.5px] font-black uppercase transition ${isEquipped ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 group-hover:bg-slate-700 text-slate-300'}">
                                        ${isEquipped ? '✓ Đang dùng' : 'Trang bị'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        },

        init() {
            injectStyles();
            // Automatically hook into header avatar once DOM and accounts are ready
            setTimeout(() => {
                this.updateHeaderAvatar();
                this.renderShowcaseInProfile();
            }, 600);
        }
    };

    window.RankAvatarFrames = RankAvatarFrames;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => RankAvatarFrames.init());
    } else {
        RankAvatarFrames.init();
    }
})(typeof window !== 'undefined' ? window : this);
