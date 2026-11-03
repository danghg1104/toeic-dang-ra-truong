const fs = require('fs');

console.log('=== IMPLEMENTING AVATAR DROPDOWN MENU (TÀI KHOẢN, CÀI ĐẶT, ĐĂNG XUẤT) ===');
let html = fs.readFileSync('index.html', 'utf8');

// 1. UPDATE / ENSURE JAVASCRIPT HANDLERS IN <head>
const oldScriptMarker = '// Điều hướng trực tiếp đến trang Tài khoản cá nhân khi bấm vào Avatar';
const sScript = html.indexOf(oldScriptMarker);

const newDropdownScript = `        // Hệ thống Dropdown Avatar Thành Viên (Tài khoản, Cài đặt, Đăng xuất)
        window.toggleMemberProfileDropdown = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const menu = document.getElementById('sanhMemberProfileMenu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        };

        window.closeMemberProfileDropdown = function() {
            const menu = document.getElementById('sanhMemberProfileMenu');
            if (menu) menu.classList.add('hidden');
        };

        window.openAccountProfileView = function() {
            window.closeMemberProfileDropdown();
            if (typeof switchTab === 'function') {
                switchTab('tai-khoan');
            } else {
                location.hash = '#tai-khoan';
            }
            if (typeof showToast === 'function') {
                showToast('👤 Đã mở Hồ sơ & Mục tiêu');
            }
        };

        window.openAccountSettingsView = function() {
            window.closeMemberProfileDropdown();
            if (typeof switchTab === 'function') {
                switchTab('cai-dat');
            } else {
                location.hash = '#cai-dat';
            }
            if (typeof showToast === 'function') {
                showToast('⚙️ Đã mở Cài đặt hệ thống');
            }
        };

        window.handleLogoutUser = function() {
            window.closeMemberProfileDropdown();
            if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?')) {
                try {
                    localStorage.removeItem('toididau_active_user');
                    localStorage.removeItem('toididau_session_token');
                    sessionStorage.clear();
                } catch(e) {}
                if (typeof showToast === 'function') {
                    showToast('👋 Đã đăng xuất an toàn.');
                }
                setTimeout(() => location.reload(), 300);
            }
        };

        // Đóng menu khi bấm ra ngoài
        document.addEventListener('click', function(e) {
            const wrapper = document.getElementById('sanhMemberDropdownWrapper');
            const menu = document.getElementById('sanhMemberProfileMenu');
            if (wrapper && menu && !menu.classList.contains('hidden')) {
                if (!wrapper.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            }
        });`;

if (sScript !== -1) {
    const eScript = html.indexOf('</script>', sScript);
    html = html.slice(0, sScript) + newDropdownScript + '\n    ' + html.slice(eScript);
    console.log('✅ Replaced profile script with comprehensive dropdown handlers');
} else {
    html = html.replace('</head>', `<script>\n${newDropdownScript}\n</script>\n</head>`);
    console.log('✅ Injected dropdown script into <head>');
}

// 2. UPDATE #sanhMemberDropdownWrapper WITH TRIGGER BUTTON & DROPDOWN MENU
const oldWrapper = `<div class="relative shrink-0" id="sanhMemberDropdownWrapper">
                                <button type="button" id="sanhMemberProfileTrigger" onclick="window.openUserProfile ? window.openUserProfile() : switchTab('tai-khoan')" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-md shadow-purple-500/20 ring-2 ring-purple-500/20 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0" title="Hồ sơ tài khoản cá nhân (Bấm để mở trang Tài khoản)">
                                    <span id="sanhMemberAvatarLetter">H</span>
                                </button>
                            </div>`;

const newWrapper = `<div class="relative shrink-0" id="sanhMemberDropdownWrapper">
                                <!-- Nút Avatar tròn chuyển sắc -->
                                <button type="button" id="sanhMemberProfileTrigger" onclick="toggleMemberProfileDropdown(event)" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-md shadow-purple-500/20 ring-2 ring-purple-500/20 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0" title="Tài khoản & Thiết lập (Bấm để xem menu)">
                                    <span id="sanhMemberAvatarLetter">H</span>
                                </button>

                                <!-- Menu Sổ Xuống (Dropdown) -->
                                <div id="sanhMemberProfileMenu" class="hidden absolute right-0 top-full mt-2 w-56 sm:w-60 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/90 dark:border-slate-800 p-2 z-[99999] animate-fadeIn">
                                    <!-- Thông tin tóm tắt -->
                                    <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center gap-2.5">
                                        <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                            <span>H</span>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div id="sanhMemberProfileName" class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Huynh Dang</div>
                                            <div id="sanhMemberDropdownEmail" class="text-[10px] text-slate-400 truncate">student@toididau.edu.vn</div>
                                        </div>
                                    </div>

                                    <!-- 3 Mục lựa chọn: Tài khoản, Cài đặt, Đăng xuất -->
                                    <div class="space-y-0.5">
                                        <button type="button" onclick="openAccountProfileView()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition text-left cursor-pointer">
                                            <i class="fa-regular fa-user text-indigo-500 text-xs w-4 text-center"></i>
                                            <span>Tài khoản</span>
                                        </button>
                                        <button type="button" onclick="openAccountSettingsView()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition text-left cursor-pointer">
                                            <i class="fa-solid fa-sliders text-emerald-500 text-xs w-4 text-center"></i>
                                            <span>Cài đặt</span>
                                        </button>
                                        <button type="button" onclick="handleLogoutUser()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition text-left cursor-pointer border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                                            <i class="fa-solid fa-arrow-right-from-bracket text-xs w-4 text-center"></i>
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </div>
                            </div>`;

if (html.includes(oldWrapper)) {
    html = html.replace(oldWrapper, newWrapper);
    console.log('✅ Replaced sanhMemberDropdownWrapper with Avatar button + full Dropdown Menu');
} else {
    console.log('⚠️ oldWrapper exact match not found, inspecting wrapper marker');
    const sWrap = html.indexOf('id="sanhMemberDropdownWrapper"');
    if (sWrap !== -1) {
        const eWrap = html.indexOf('</div>', html.indexOf('</button>', sWrap)) + 6;
        html = html.slice(0, sWrap - 38) + newWrapper + html.slice(eWrap);
        console.log('✅ Replaced sanhMemberDropdownWrapper via index slice');
    }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('🎉 Saved index.html with Avatar Dropdown Menu!');
