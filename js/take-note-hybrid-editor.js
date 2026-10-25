/**
 * =========================================================================
 * HYBRID EDITOR CONTROLLER (WORD STICKY RIBBON + NOTION BLOCK ENGINE)
 * =========================================================================
 * - Modern 48px Topbar (Breadcrumbs, Auto-save Cloud Sync, Export Dropdown)
 * - Sticky Word Ribbon Toolbar (Grouped Formatting, Pastel Highlight, Fonts)
 * - Notion Slash Commands ('/' Menu with search & keyboard navigation)
 * - Notion Drag Handle ('⋮⋮' 6-dots block mover)
 * - Floating Selection Bubble Toolbar (Text actions at mouse cursor)
 * - Vietnamese IME Safe (Unikey / EVKey zero interference)
 * - English Learning Blocks (Vocab Table with Audio, Callout Boxes, Toggle Lists)
 * =========================================================================
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.TakeNoteHybridEditor = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    class HybridEditorEngine {
        constructor() {
            this.isInitialized = false;
            this.isComposing = false; // Vietnamese IME composition state
            this.slashMenuEl = null;
            this.gripHandleEl = null;
            this.floatingBubbleEl = null;
            this.currentHoveredBlock = null;
            this.draggedBlock = null;
            this.slashQuery = '';
            this.slashRange = null;
            this.isSidebarCollapsed = false;
            this.isRibbonCollapsed = false;
            this.isFullWidth = false;
            this.selectedMenuIndex = 0;

            // Notion Slash Commands Registry
            this.slashCommands = [
                { id: 'h1', title: 'Tiêu đề lớn (Heading 1)', desc: 'Tiêu đề phần học chính', icon: 'H1', category: 'Cơ bản', action: () => this.formatBlock('H1') },
                { id: 'h2', title: 'Tiêu đề vừa (Heading 2)', desc: 'Tiêu đề mục con', icon: 'H2', category: 'Cơ bản', action: () => this.formatBlock('H2') },
                { id: 'h3', title: 'Tiêu đề nhỏ (Heading 3)', desc: 'Tiểu mục chi tiết', icon: 'H3', category: 'Cơ bản', action: () => this.formatBlock('H3') },
                { id: 'p', title: 'Văn bản thường (Text)', desc: 'Đoạn văn viết thông thường', icon: '¶', category: 'Cơ bản', action: () => this.formatBlock('P') },
                { id: 'todo', title: 'Danh sách công việc (To-do)', desc: 'Checkbox theo dõi bài tập cần làm', icon: '☑️', category: 'Danh sách', action: () => this.insertTodoItem() },
                { id: 'toggle', title: 'Danh sách thu gọn (Toggle)', desc: 'Bấm mũi tên để ẩn/hiện đáp án', icon: '▶️', category: 'Danh sách', action: () => this.insertToggleBlock() },
                { id: 'bullet', title: 'Danh sách chấm (Bullet List)', desc: 'Danh sách liệt kê ý chính', icon: '•', category: 'Danh sách', action: () => document.execCommand('insertUnorderedList') },
                { id: 'num', title: 'Danh sách số (Numbered List)', desc: 'Danh sách các bước thứ tự', icon: '1.', category: 'Danh sách', action: () => document.execCommand('insertOrderedList') },
                { id: 'vocab', title: 'Bảng Từ Vựng TOEIC (Vocab Table)', desc: 'Bảng 4 cột: Từ, Phiên âm, Nghĩa, Ví dụ', icon: '🔤', category: 'Khối tiếng Anh', action: () => this.insertVocabTable() },
                { id: 'tip', title: 'Hộp Mẹo làm bài (Tip Callout)', desc: 'Ghi chú kinh nghiệm giải đề nhanh', icon: '💡', category: 'Khối tiếng Anh', action: () => this.insertCallout('tip') },
                { id: 'trap', title: 'Hộp Bẫy đề kinh điển (Trap Callout)', desc: 'Cảnh báo các bẫy đề thi hay gặp', icon: '⚠️', category: 'Khối tiếng Anh', action: () => this.insertCallout('trap') },
                { id: 'formula', title: 'Hộp Công thức quan trọng', desc: 'Đóng khung công thức ngữ pháp then chốt', icon: '📌', category: 'Khối tiếng Anh', action: () => this.insertCallout('formula') },
                { id: 'quote', title: 'Trích dẫn (Quote)', desc: 'Đoạn trích dẫn hoặc châm ngôn', icon: '❝', category: 'Cơ bản', action: () => this.insertQuote() },
                { id: 'divider', title: 'Đường phân cách (Divider)', desc: 'Đường kẻ ngang chia tách nội dung', icon: '―', category: 'Cơ bản', action: () => this.insertDivider() },
                { id: 'file', title: 'Chèn File / Đính kèm', desc: 'Đính kèm tài liệu Word, PDF, Ảnh', icon: '📂', category: 'Tập tin', action: () => document.getElementById('takeNoteUniversalFileInput')?.click() }
            ];
        }

        init() {
            if (this.isInitialized) return;
            const editorPaper = document.getElementById('takeNoteEditorPaper');
            if (!editorPaper) return;

            this.createSlashMenu();
            this.createGripHandle();
            this.createFloatingBubble();
            this.bindEditorEvents(editorPaper);
            this.bindKeyboardShortcuts();
            this.updateBreadcrumbs();
            this.sanitizeTakeNoteDom(editorPaper);

            this.isInitialized = true;
        }

        /**
         * 1. TẠO MENU LỆNH NOTION SLASH COMMAND (/)
         */
        createSlashMenu() {
            if (this.slashMenuEl) return;
            const menu = document.createElement('div');
            menu.id = 'tnSlashMenu';
            menu.className = 'tn-slash-menu hidden';
            menu.innerHTML = `<div id="tnSlashItemsContainer"></div>`;
            document.body.appendChild(menu);
            this.slashMenuEl = menu;

            // Click outside to close
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target)) {
                    this.hideSlashMenu();
                }
            });
        }

        /**
         * 2. TẠO TAY NẮM KÉO THẢ 6 CHẤM (⋮⋮)
         */
        createGripHandle() {
            if (this.gripHandleEl) return;
            const handle = document.createElement('div');
            handle.id = 'tnGripHandle';
            handle.className = 'tn-drag-handle';
            handle.draggable = true;
            handle.title = 'Kéo để đổi vị trí khối văn bản hoặc bấm để tùy chọn';
            handle.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-ellipsis-vertical -ml-1"></i>`;
            document.body.appendChild(handle);
            this.gripHandleEl = handle;

            // Drag Events
            handle.addEventListener('dragstart', (e) => {
                if (!this.currentHoveredBlock) return;
                this.draggedBlock = this.currentHoveredBlock;
                this.draggedBlock.classList.add('opacity-40');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', '');
            });

            handle.addEventListener('dragend', () => {
                if (this.draggedBlock) {
                    this.draggedBlock.classList.remove('opacity-40');
                    this.draggedBlock = null;
                }
                if (typeof window.saveCurrentTakeNote === 'function') {
                    window.saveCurrentTakeNote();
                }
            });

            // Click grip handle to show mini context menu
            handle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.currentHoveredBlock) return;
                this.showBlockContextMenu(e);
            });
        }

        /**
         * 3. TẠO THANH BONG BÓNG BÔI ĐEN NỔI (FLOATING SELECTION TOOLBAR)
         */
        createFloatingBubble() {
            if (this.floatingBubbleEl) return;
            const bubble = document.createElement('div');
            bubble.id = 'tnFloatingBubble';
            bubble.className = 'tn-floating-bubble hidden';
            bubble.innerHTML = `
                <button type="button" onclick="TakeNoteHybridEditor.execCmd('bold')" class="tn-bubble-btn font-extrabold" title="In đậm">B</button>
                <button type="button" onclick="TakeNoteHybridEditor.execCmd('italic')" class="tn-bubble-btn italic font-serif" title="In nghiêng">I</button>
                <button type="button" onclick="TakeNoteHybridEditor.execCmd('underline')" class="tn-bubble-btn underline" title="Gạch chân">U</button>
                <button type="button" onclick="TakeNoteHybridEditor.execCmd('strikeThrough')" class="tn-bubble-btn line-through" title="Gạch ngang">S</button>
                <span class="tn-bubble-divider"></span>
                <button type="button" onclick="TakeNoteHybridEditor.highlightSelection('#fef08a')" class="tn-bubble-btn text-yellow-300" title="Tô dạ quang vàng">🖍️</button>
                <button type="button" onclick="TakeNoteHybridEditor.highlightSelection('#fbcfe8')" class="tn-bubble-btn text-pink-300" title="Tô dạ quang hồng">🌸</button>
                <button type="button" onclick="TakeNoteHybridEditor.highlightSelection('#bbf7d0')" class="tn-bubble-btn text-green-300" title="Tô dạ quang mint">🍃</button>
                <span class="tn-bubble-divider"></span>
                <button type="button" onclick="TakeNoteHybridEditor.speakSelected()" class="tn-bubble-btn text-sky-300" title="Nghe phát âm chuẩn US"><i class="fa-solid fa-volume-high"></i></button>
            `;
            document.body.appendChild(bubble);
            this.floatingBubbleEl = bubble;

            let selChangeRaf = null;
            document.addEventListener('selectionchange', () => {
                if (selChangeRaf) return;
                selChangeRaf = requestAnimationFrame(() => {
                    selChangeRaf = null;
                    this.updateFloatingBubblePosition();
                });
            });
        }

        /**
         * BINDING EVENTS CHO VÙNG SOẠN THẢO (VIETNAMESE IME SAFE)
         */
        bindEditorEvents(editorPaper) {
            // Theo dõi trạng thái gõ tiếng Việt Unikey / EVKey
            editorPaper.addEventListener('compositionstart', () => {
                this.isComposing = true;
            });
            editorPaper.addEventListener('compositionend', () => {
                this.isComposing = false;
            });

            // Keydown listener cho Slash Command & Phím tắt
            editorPaper.addEventListener('keydown', (e) => {
                if (this.slashMenuEl && !this.slashMenuEl.classList.contains('hidden')) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        this.navigateSlashMenu(1);
                        return;
                    }
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        this.navigateSlashMenu(-1);
                        return;
                    }
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.executeSelectedSlashItem();
                        return;
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        this.hideSlashMenu();
                        return;
                    }
                }

                // Xử lý phím Backspace / Delete khi xóa chữ trong Callout/Todo/Toggle (Tránh dải màu ma / ghost strip)
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    this.handleBackspaceInBlocks(e, editorPaper);
                }
            });

            // Theo dõi input để nhận diện dấu '/' hoặc lọc lệnh, và tự động thu dọn khối rỗng
            editorPaper.addEventListener('input', () => {
                if (!this.isComposing) {
                    this.checkAndHandleSlashTrigger();
                    this.pruneAbandonedEmptyBlocks(editorPaper);
                }
                this.updateBreadcrumbs();
            });

            // Khi cuộn trang thì bám theo con trỏ hoặc tự ẩn (tối ưu hóa rAF không gây giật lag)
            let scrollRaf = null;
            const handleEditorScroll = () => {
                if (scrollRaf) return;
                scrollRaf = requestAnimationFrame(() => {
                    scrollRaf = null;
                    if (this.slashMenuEl && !this.slashMenuEl.classList.contains('hidden')) {
                        this.positionSlashMenu();
                    }
                    if (this.gripHandleEl && this.gripHandleEl.classList.contains('visible') && this.currentHoveredBlock) {
                        this.positionGripHandle(this.currentHoveredBlock);
                    }
                });
            };
            editorPaper.addEventListener('scroll', handleEditorScroll, { passive: true });
            window.addEventListener('scroll', handleEditorScroll, { passive: true });

            // Khi click ra ngoài vùng editor thì tự ẩn menu và dọn dẹp cấu trúc
            editorPaper.addEventListener('blur', () => {
                setTimeout(() => {
                    this.sanitizeTakeNoteDom(editorPaper);
                    if (typeof window.saveCurrentTakeNote === 'function') {
                        window.saveCurrentTakeNote();
                    }
                }, 100);
            });

            // Drag-over listener trên editor để cho phép thả block reorder
            editorPaper.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!this.draggedBlock) return;
                const targetBlock = this.getClosestTopBlock(e.target);
                if (targetBlock && targetBlock !== this.draggedBlock) {
                    const rect = targetBlock.getBoundingClientRect();
                    const isAfter = e.clientY > rect.top + rect.height / 2;
                    if (isAfter) {
                        targetBlock.after(this.draggedBlock);
                    } else {
                        targetBlock.before(this.draggedBlock);
                    }
                }
            });

            // Hover listener để hiển thị icon 6 chấm ⋮⋮ tại đầu khối (throttle rAF mượt mà 60fps)
            let mouseMoveRaf = null;
            editorPaper.addEventListener('mousemove', (e) => {
                if (mouseMoveRaf) return;
                mouseMoveRaf = requestAnimationFrame(() => {
                    mouseMoveRaf = null;
                    const block = this.getClosestTopBlock(e.target);
                    if (block && block !== editorPaper) {
                        this.positionGripHandle(block);
                    } else if (!this.gripHandleEl?.contains(e.target)) {
                        this.hideGripHandle();
                    }
                });
            }, { passive: true });

            editorPaper.addEventListener('mouseleave', (e) => {
                if (mouseMoveRaf) {
                    cancelAnimationFrame(mouseMoveRaf);
                    mouseMoveRaf = null;
                }
                if (!this.gripHandleEl?.contains(e.relatedTarget)) {
                    this.hideGripHandle();
                }
            });

            // Click listener cho Interactive Checkboxes trong To-do block
            editorPaper.addEventListener('click', (e) => {
                const checkbox = e.target.closest('.tn-todo-checkbox');
                if (checkbox) {
                    const todoItem = checkbox.closest('.tn-todo-item');
                    if (todoItem) {
                        if (checkbox.checked) {
                            todoItem.classList.add('completed');
                        } else {
                            todoItem.classList.remove('completed');
                        }
                        if (typeof window.saveCurrentTakeNote === 'function') {
                            window.saveCurrentTakeNote();
                        }
                    }
                }

                // Audio play button bên trong Vocab Table
                const audioBtn = e.target.closest('.tn-vocab-speak-btn');
                if (audioBtn) {
                    const term = audioBtn.getAttribute('data-word');
                    if (term && window.AudioService) {
                        window.AudioService.playWord(term, 'US');
                    } else if (term && window.UniversalAudioEngine) {
                        window.UniversalAudioEngine.speak(term, { lang: 'en-US' });
                    }
                }
            });
        }

        /**
         * XỬ LÝ PHÍM BACKSPACE VÀ DELETE ĐỐI VỚI CÁC KHỐI ĐẶC BIỆT (CALLOUT / TODO / TOGGLE)
         * Ngăn chặn triệt để tình trạng xóa hết chữ nhưng vẫn để lại dải màu / container ma (Ghost Strip)
         */
        handleBackspaceInBlocks(e, editorPaper) {
            const sel = window.getSelection();
            if (!sel || !sel.rangeCount) return;
            const range = sel.getRangeAt(0);
            const anchor = sel.anchorNode;
            if (!anchor) return;
            const targetEl = anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor;
            if (!targetEl) return;

            // 1. TRƯỜNG HỢP CON TRỎ ĐANG Ở TRONG KHỐI CALLOUT
            const callout = targetEl.closest('.tn-callout');
            if (callout && editorPaper.contains(callout)) {
                const contentEl = callout.querySelector('.tn-callout-content');
                const rawText = contentEl ? contentEl.innerText : callout.innerText;
                const cleanText = (rawText || '').replace(/[📌💡⚠️🎯\s\u200B-\u200D\uFEFF]/g, '');

                // A. Nếu nội dung bên trong Callout đã bị xóa sạch (không còn chữ thực tế)
                if (!cleanText) {
                    e.preventDefault();
                    const prev = callout.previousElementSibling;
                    const next = callout.nextElementSibling;
                    callout.remove();
                    this.setFocusAfterBlockRemoval(editorPaper, prev, next);
                    if (typeof window.saveCurrentTakeNote === 'function') {
                        window.saveCurrentTakeNote();
                    }
                    return;
                }

                // B. Nếu người dùng nhấn Backspace ở đầu khối Callout (offset 0) khi tiêu đề trống
                if (e.key === 'Backspace' && range.collapsed && range.startOffset === 0) {
                    const firstText = this.getFirstTextNode(contentEl || callout);
                    if (anchor === firstText || anchor === contentEl || anchor === callout) {
                        if (cleanText.length <= 1) {
                            e.preventDefault();
                            const prev = callout.previousElementSibling;
                            const next = callout.nextElementSibling;
                            callout.remove();
                            this.setFocusAfterBlockRemoval(editorPaper, prev, next);
                            if (typeof window.saveCurrentTakeNote === 'function') {
                                window.saveCurrentTakeNote();
                            }
                            return;
                        }
                    }
                }
                return;
            }

            // 2. TRƯỜNG HỢP CON TRỎ Ở TRONG TO-DO ITEM
            const todoItem = targetEl.closest('.tn-todo-item');
            if (todoItem && editorPaper.contains(todoItem)) {
                const todoText = todoItem.querySelector('.tn-todo-text');
                const cleanText = (todoText ? todoText.innerText : todoItem.innerText).replace(/[\s\u200B-\u200D\uFEFF]/g, '');

                if (!cleanText || (e.key === 'Backspace' && range.collapsed && range.startOffset === 0 && (!todoText || anchor === todoText || anchor === todoText.firstChild))) {
                    e.preventDefault();
                    const prev = todoItem.previousElementSibling;
                    const next = todoItem.nextElementSibling;
                    todoItem.remove();
                    this.setFocusAfterBlockRemoval(editorPaper, prev, next);
                    if (typeof window.saveCurrentTakeNote === 'function') {
                        window.saveCurrentTakeNote();
                    }
                    return;
                }
                return;
            }

            // 3. TRƯỜNG HỢP CON TRỎ Ở TRONG TOGGLE BLOCK
            const toggleBlock = targetEl.closest('.tn-toggle-block');
            if (toggleBlock && editorPaper.contains(toggleBlock)) {
                const summary = toggleBlock.querySelector('.tn-toggle-summary');
                const content = toggleBlock.querySelector('.tn-toggle-content');
                const sumText = (summary ? summary.innerText : '').replace(/[▶▼\s\u200B-\u200D\uFEFF]/g, '');
                const cntText = (content ? content.innerText : '').replace(/[\s\u200B-\u200D\uFEFF]/g, '');

                if (!sumText && !cntText) {
                    e.preventDefault();
                    const prev = toggleBlock.previousElementSibling;
                    const next = toggleBlock.nextElementSibling;
                    toggleBlock.remove();
                    this.setFocusAfterBlockRemoval(editorPaper, prev, next);
                    if (typeof window.saveCurrentTakeNote === 'function') {
                        window.saveCurrentTakeNote();
                    }
                    return;
                }
                return;
            }

            // 4. TRƯỜNG HỢP CON TRỎ ĐỨNG LIỀN KỀ KHỐI RỖNG (XÓA BẰNG BACKSPACE / DELETE TỪ BÊN NGOÀI)
            if (e.key === 'Backspace' && range.collapsed && range.startOffset === 0) {
                const topBlock = this.getClosestTopBlock(targetEl);
                if (topBlock && topBlock.previousElementSibling) {
                    const prev = topBlock.previousElementSibling;
                    if (prev.classList.contains('tn-callout') || prev.classList.contains('tn-todo-item') || prev.classList.contains('tn-toggle-block')) {
                        const clean = (prev.innerText || '').replace(/[📌💡⚠️🎯▶▼\s\u200B-\u200D\uFEFF]/g, '');
                        if (!clean) {
                            e.preventDefault();
                            prev.remove();
                            if (typeof window.saveCurrentTakeNote === 'function') window.saveCurrentTakeNote();
                            return;
                        }
                    }
                }
            }
            if (e.key === 'Delete' && range.collapsed) {
                const topBlock = this.getClosestTopBlock(targetEl);
                if (topBlock && topBlock.nextElementSibling) {
                    const next = topBlock.nextElementSibling;
                    if (next.classList.contains('tn-callout') || next.classList.contains('tn-todo-item') || next.classList.contains('tn-toggle-block')) {
                        const clean = (next.innerText || '').replace(/[📌💡⚠️🎯▶▼\s\u200B-\u200D\uFEFF]/g, '');
                        if (!clean) {
                            e.preventDefault();
                            next.remove();
                            if (typeof window.saveCurrentTakeNote === 'function') window.saveCurrentTakeNote();
                            return;
                        }
                    }
                }
            }
        }

        /**
         * TỰ ĐỘNG THU DỌN CÁC KHỐI RỖNG BỊ BỎ RƠI KHI NGƯỜI DÙNG CHUYỂN CON TRỎ SANG KHỐI KHÁC
         */
        pruneAbandonedEmptyBlocks(editorPaper) {
            const sel = window.getSelection();
            const activeAnchor = sel && sel.rangeCount ? (sel.anchorNode.nodeType === Node.TEXT_NODE ? sel.anchorNode.parentElement : sel.anchorNode) : null;

            editorPaper.querySelectorAll('.tn-callout').forEach(callout => {
                if (!activeAnchor || !callout.contains(activeAnchor)) {
                    const contentEl = callout.querySelector('.tn-callout-content');
                    const rawText = contentEl ? contentEl.innerText : callout.innerText;
                    const cleanText = (rawText || '').replace(/[📌💡⚠️🎯\s\u200B-\u200D\uFEFF]/g, '');
                    const hasMedia = callout.querySelector('img, audio, video, table, input, button:not(.tn-callout-icon)');
                    if (!cleanText && !hasMedia) {
                        callout.remove();
                    }
                }
            });

            editorPaper.querySelectorAll('.tn-todo-item').forEach(todo => {
                if (!activeAnchor || !todo.contains(activeAnchor)) {
                    const todoText = todo.querySelector('.tn-todo-text');
                    const cleanText = (todoText ? todoText.innerText : todo.innerText).replace(/[\s\u200B-\u200D\uFEFF]/g, '');
                    if (!cleanText) {
                        todo.remove();
                    }
                }
            });
        }

        setFocusAfterBlockRemoval(editorPaper, prev, next) {
            const sel = window.getSelection();
            if (!sel) return;

            let target = prev || next;
            if (target && editorPaper.contains(target)) {
                const editable = target.querySelector('.tn-callout-content, .tn-todo-text, .tn-toggle-summary, p, td') || target;
                const r = document.createRange();
                r.selectNodeContents(editable);
                r.collapse(false);
                sel.removeAllRanges();
                sel.addRange(r);
            } else {
                const p = document.createElement('p');
                p.innerHTML = '<br>';
                editorPaper.appendChild(p);
                const r = document.createRange();
                r.setStart(p, 0);
                r.collapse(true);
                sel.removeAllRanges();
                sel.addRange(r);
            }
        }

        getFirstTextNode(el) {
            if (!el) return null;
            if (el.nodeType === Node.TEXT_NODE) return el;
            for (let child of el.childNodes) {
                const res = this.getFirstTextNode(child);
                if (res) return res;
            }
            return null;
        }

        /**
         * XỬ LÝ SLASH COMMAND LOGIC & BÁM DÍNH VỊ TRÍ CON TRỎ (PIXEL-PERFECT POSITIONING)
         */
        checkAndHandleSlashTrigger() {
            const sel = window.getSelection();
            if (!sel || !sel.rangeCount) {
                this.hideSlashMenu();
                return;
            }
            const node = sel.anchorNode;
            if (!node || node.nodeType !== Node.TEXT_NODE) {
                this.hideSlashMenu();
                return;
            }

            const text = node.textContent.slice(0, sel.anchorOffset);
            const slashIdx = text.lastIndexOf('/');

            // Không có dấu '/' trước con trỏ
            if (slashIdx === -1) {
                this.hideSlashMenu();
                return;
            }

            // Dấu '/' phải nằm ở đầu đoạn văn HOẶC ngay sau khoảng trắng/xuống dòng
            // (Tránh kích hoạt nhầm khi gõ URL như https:// hoặc phân số 1/2)
            if (slashIdx > 0 && !/\s/.test(text[slashIdx - 1])) {
                this.hideSlashMenu();
                return;
            }

            const query = text.slice(slashIdx + 1);
            // Nếu người dùng gõ phím cách sau dấu '/' (ví dụ '/ ') -> tắt menu
            if (/\s/.test(query)) {
                this.hideSlashMenu();
                return;
            }

            this.slashQuery = query.toLowerCase().trim();
            this.renderSlashMenuItems();
            this.positionSlashMenu();
            this.slashMenuEl?.classList.remove('hidden');
        }

        triggerSlashMenu() {
            this.checkAndHandleSlashTrigger();
        }

        getCaretBoundingRect() {
            const sel = window.getSelection();
            if (!sel || !sel.rangeCount) return null;
            const range = sel.getRangeAt(0);

            // 1. Thử lấy client rects từ range
            try {
                const rects = range.getClientRects();
                if (rects.length > 0) {
                    const r = rects[0];
                    if (r.height > 0 && (r.top > 0 || r.bottom > 0)) {
                        return r;
                    }
                }
            } catch (e) {}

            // 2. Probe chính xác ký tự '/' ngay trước con trỏ
            if (range.startOffset > 0 && range.startContainer.nodeType === Node.TEXT_NODE) {
                try {
                    const probeRange = document.createRange();
                    probeRange.setStart(range.startContainer, range.startOffset - 1);
                    probeRange.setEnd(range.startContainer, range.startOffset);
                    const probeRect = probeRange.getBoundingClientRect();
                    if (probeRect && probeRect.height > 0 && (probeRect.top > 0 || probeRect.bottom > 0)) {
                        return probeRect;
                    }
                } catch (e) {}
            }

            // 3. Fallback lấy element cha gần nhất
            let parent = range.commonAncestorContainer;
            if (parent && parent.nodeType === Node.TEXT_NODE) {
                parent = parent.parentElement;
            }
            if (parent && parent.getBoundingClientRect) {
                const pRect = parent.getBoundingClientRect();
                return {
                    left: pRect.left,
                    right: pRect.right,
                    top: pRect.top,
                    bottom: pRect.bottom,
                    width: pRect.width,
                    height: pRect.height || 24
                };
            }

            return null;
        }

        positionSlashMenu() {
            if (!this.slashMenuEl) return;
            const rect = this.getCaretBoundingRect();
            if (!rect) return;

            const paper = document.getElementById('takeNoteEditorPaper');
            if (paper) {
                const paperRect = paper.getBoundingClientRect();
                // Nếu con trỏ chuột đã bị cuộn khuất khỏi tầm nhìn của trang giấy
                if (rect.bottom < paperRect.top || rect.top > paperRect.bottom) {
                    this.hideSlashMenu();
                    return;
                }
            }

            const menuWidth = 290;
            const menuHeight = Math.min(340, this.slashMenuEl.offsetHeight || 300);
            const margin = 8;

            let left = rect.left;
            // Tránh tràn viền phải màn hình
            if (left + menuWidth > window.innerWidth - 16) {
                left = window.innerWidth - menuWidth - 16;
            }
            // Tránh tràn viền trái
            if (left < 16) left = 16;

            let top = rect.bottom + margin;
            // Nếu mở xuống dưới bị tràn màn hình thì tự động LẬT LÊN TRÊN con trỏ (Giống Notion)
            if (top + menuHeight > window.innerHeight - 10 && rect.top > menuHeight + margin) {
                top = rect.top - menuHeight - margin;
            }

            this.slashMenuEl.style.left = `${Math.round(left)}px`;
            this.slashMenuEl.style.top = `${Math.round(top)}px`;
        }

        updateSlashQuery() {
            this.checkAndHandleSlashTrigger();
        }

        renderSlashMenuItems() {
            const container = document.getElementById('tnSlashItemsContainer');
            if (!container) return;

            const filtered = this.slashCommands.filter(c => {
                if (!this.slashQuery) return true;
                return c.id.includes(this.slashQuery) ||
                       c.title.toLowerCase().includes(this.slashQuery) ||
                       c.desc.toLowerCase().includes(this.slashQuery);
            });

            if (filtered.length === 0) {
                container.innerHTML = `<div class="p-4 text-center text-xs text-slate-400 font-semibold">Không tìm thấy khối nào khớp với "/${this.slashQuery}"</div>`;
                return;
            }

            this.selectedMenuIndex = Math.min(this.selectedMenuIndex, filtered.length - 1);
            if (this.selectedMenuIndex < 0) this.selectedMenuIndex = 0;

            container.innerHTML = filtered.map((item, idx) => `
                <div onclick="TakeNoteHybridEditor.executeSlashCommand('${item.id}')" class="tn-slash-item ${idx === this.selectedMenuIndex ? 'selected' : ''}">
                    <div class="tn-slash-icon font-extrabold">${item.icon}</div>
                    <div>
                        <div class="tn-slash-title">${item.title}</div>
                        <div class="tn-slash-desc">${item.desc}</div>
                    </div>
                </div>
            `).join('');
        }

        navigateSlashMenu(direction) {
            const items = document.querySelectorAll('.tn-slash-item');
            if (!items.length) return;
            this.selectedMenuIndex = (this.selectedMenuIndex + direction + items.length) % items.length;
            items.forEach((it, idx) => {
                if (idx === this.selectedMenuIndex) {
                    it.classList.add('selected');
                    it.scrollIntoView({ block: 'nearest' });
                } else {
                    it.classList.remove('selected');
                }
            });
        }

        executeSelectedSlashItem() {
            const selectedItem = document.querySelector('.tn-slash-item.selected');
            if (selectedItem) {
                selectedItem.click();
            } else {
                this.hideSlashMenu();
            }
        }

        executeSlashCommand(cmdId) {
            const cmd = this.slashCommands.find(c => c.id === cmdId);
            this.hideSlashMenu();

            // Xóa ký tự '/' và text tìm kiếm
            try {
                const sel = window.getSelection();
                if (sel && sel.anchorNode) {
                    const text = sel.anchorNode.textContent || '';
                    const slashIdx = text.lastIndexOf('/');
                    if (slashIdx !== -1) {
                        const range = document.createRange();
                        range.setStart(sel.anchorNode, slashIdx);
                        range.setEnd(sel.anchorNode, sel.anchorOffset);
                        range.deleteContents();
                    }
                }
            } catch (e) {
                console.warn('Slash cleanup error:', e);
            }

            if (cmd && typeof cmd.action === 'function') {
                cmd.action();
            }
        }

        hideSlashMenu() {
            if (this.slashMenuEl) {
                this.slashMenuEl.classList.add('hidden');
                this.slashQuery = '';
                this.selectedMenuIndex = 0;
            }
        }

        /**
         * XỬ LÝ TAY NẮM KÉO THẢ (⋮⋮)
         */
        getClosestTopBlock(el) {
            const editor = document.getElementById('takeNoteEditorPaper');
            if (!editor || !el || el === editor) return null;
            let cur = el;
            while (cur && cur.parentElement && cur.parentElement !== editor) {
                cur = cur.parentElement;
            }
            return cur && cur.parentElement === editor ? cur : null;
        }

        positionGripHandle(block) {
            if (!this.gripHandleEl) return;
            this.currentHoveredBlock = block;
            const rect = block.getBoundingClientRect();
            this.gripHandleEl.style.left = `${Math.round(rect.left - 26)}px`;
            this.gripHandleEl.style.top = `${Math.round(rect.top + 2)}px`;
            this.gripHandleEl.style.display = 'flex';
            this.gripHandleEl.classList.add('visible');
        }

        hideGripHandle() {
            if (this.gripHandleEl) {
                this.gripHandleEl.classList.remove('visible');
                this.gripHandleEl.style.display = 'none';
                this.gripHandleEl.style.left = '-9999px';
                this.gripHandleEl.style.top = '-9999px';
            }
        }

        showBlockContextMenu(e) {
            // Popup nhỏ để nhân đôi hoặc xóa khối
            if (!this.currentHoveredBlock) return;
            const block = this.currentHoveredBlock;
            const choice = confirm('Bạn có muốn xóa khối văn bản này không?');
            if (choice) {
                block.remove();
                this.hideGripHandle();
                if (typeof window.saveCurrentTakeNote === 'function') {
                    window.saveCurrentTakeNote();
                }
            }
        }

        /**
         * BONG BÓNG BÔI ĐEN NỔI (SELECTION BUBBLE)
         */
        updateFloatingBubblePosition() {
            if (!this.floatingBubbleEl) return;
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed || !sel.rangeCount) {
                this.floatingBubbleEl.classList.add('hidden');
                return;
            }

            const range = sel.getRangeAt(0);
            const editorPaper = document.getElementById('takeNoteEditorPaper');
            if (!editorPaper || !editorPaper.contains(range.commonAncestorContainer)) {
                this.floatingBubbleEl.classList.add('hidden');
                return;
            }

            const rect = range.getBoundingClientRect();
            if (rect && rect.width > 0) {
                const bubbleWidth = 230;
                const left = Math.max(16, rect.left + (rect.width / 2) - (bubbleWidth / 2));
                const top = Math.max(10, rect.top - 42);
                this.floatingBubbleEl.style.left = `${left}px`;
                this.floatingBubbleEl.style.top = `${top}px`;
                this.floatingBubbleEl.classList.remove('hidden');
            } else {
                this.floatingBubbleEl.classList.add('hidden');
            }
        }

        /**
         * CÁC THAO TÁC SOẠN THẢO VĂN BẢN (RICH TEXT COMMANDS)
         */
        execCmd(cmd, arg = null) {
            document.execCommand(cmd, false, arg);
            if (typeof window.saveCurrentTakeNote === 'function') {
                window.saveCurrentTakeNote();
            }
        }

        formatBlock(tag) {
            document.execCommand('formatBlock', false, tag);
            if (typeof window.saveCurrentTakeNote === 'function') {
                window.saveCurrentTakeNote();
            }
        }

        setFontSize(sizePx) {
            if (!sizePx) return;
            const sel = window.getSelection();
            if (sel && sel.rangeCount) {
                const span = `<span style="font-size: ${sizePx}">${sel.toString()}</span>`;
                document.execCommand('insertHTML', false, span);
                if (typeof window.saveCurrentTakeNote === 'function') {
                    window.saveCurrentTakeNote();
                }
            }
        }

        highlightSelection(colorHex) {
            document.execCommand('hiliteColor', false, colorHex);
            if (typeof window.saveCurrentTakeNote === 'function') {
                window.saveCurrentTakeNote();
            }
        }

        setTextColor(colorHex) {
            document.execCommand('foreColor', false, colorHex);
            if (typeof window.saveCurrentTakeNote === 'function') {
                window.saveCurrentTakeNote();
            }
        }

        speakSelected() {
            if (typeof window.speakSelectedNoteText === 'function') {
                window.speakSelectedNoteText();
            }
        }

        /**
         * CHÈN CÁC KHỐI CHUYÊN SÂU TIẾNG ANH (NOTION & WORD BLOCKS)
         */
        insertBlock(html) {
            const paper = document.getElementById('takeNoteEditorPaper');
            if (!paper) return;

            const sel = window.getSelection();
            let anchorNode = sel && sel.rangeCount ? sel.anchorNode : null;

            // Nếu không có vùng chọn trong paper, chèn vào cuối paper
            if (!anchorNode || !paper.contains(anchorNode)) {
                paper.focus();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html.trim();
                while (tempDiv.firstChild) {
                    paper.appendChild(tempDiv.firstChild);
                }
                this.sanitizeTakeNoteDom(paper);
                if (typeof window.saveCurrentTakeNote === 'function') window.saveCurrentTakeNote();
                return;
            }

            const targetEl = anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode;

            // Kiểm tra xem con trỏ có đang nằm BÊN TRONG khối cấu trúc đặc biệt không
            const parentComp = targetEl.closest('.tn-callout, .tn-vocab-table, .tn-toggle-block, table, details, blockquote');

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html.trim();
            const fragment = document.createDocumentFragment();
            let firstNewBlock = null;
            while (tempDiv.firstChild) {
                if (!firstNewBlock && tempDiv.firstChild.nodeType === Node.ELEMENT_NODE) {
                    firstNewBlock = tempDiv.firstChild;
                }
                fragment.appendChild(tempDiv.firstChild);
            }

            if (parentComp && parentComp !== paper) {
                // TUYỆT ĐỐI KHÔNG lồng khối mới vào trong Callout / Table / Toggle!
                // Chèn ngay SAU khối cha để tạo khối độc lập
                parentComp.after(fragment);
            } else {
                const currentTopBlock = this.getClosestTopBlock(targetEl);
                if (currentTopBlock && (currentTopBlock.innerText.trim() === '' || currentTopBlock.innerText.trim() === '/')) {
                    currentTopBlock.replaceWith(fragment);
                } else if (currentTopBlock) {
                    currentTopBlock.after(fragment);
                } else {
                    paper.appendChild(fragment);
                }
            }

            // Tự động dọn dẹp các khối lỗi nếu có
            this.sanitizeTakeNoteDom(paper);

            // Đặt con trỏ vào bên trong khối mới để gõ tiếp
            if (firstNewBlock) {
                const editableTarget = firstNewBlock.querySelector('.tn-callout-content div:last-child, td, .tn-toggle-content p, .tn-todo-text') || firstNewBlock;
                const newRange = document.createRange();
                newRange.selectNodeContents(editableTarget);
                newRange.collapse(false);
                sel.removeAllRanges();
                sel.addRange(newRange);
            }

            if (typeof window.saveCurrentTakeNote === 'function') {
                window.saveCurrentTakeNote();
            }
        }

        sanitizeTakeNoteDom(container) {
            if (!container) return;

            // 1. DỌN DẸP CÁC KHỐI CALLOUT RỖNG / MA (GHOST STRIPS) VÀ CHUẨN HÓA CẤU TRÚC
            container.querySelectorAll('.tn-callout').forEach(callout => {
                // Tách các khối To-do, Toggle, Table bị lồng nhầm trong Callout ra ngoài
                const nested = callout.querySelectorAll('.tn-callout, .tn-todo-item, .tn-toggle-block, .tn-vocab-table, table, details');
                nested.forEach(nestedEl => {
                    callout.after(nestedEl);
                });

                // Đảm bảo cấu trúc chuẩn: .tn-callout-icon và .tn-callout-content
                let iconEl = callout.querySelector('.tn-callout-icon');
                let contentEl = callout.querySelector('.tn-callout-content');

                if (!contentEl) {
                    contentEl = document.createElement('div');
                    contentEl.className = 'tn-callout-content';
                    callout.appendChild(contentEl);
                }

                Array.from(callout.childNodes).forEach(node => {
                    if (node !== iconEl && node !== contentEl) {
                        contentEl.appendChild(node);
                    }
                });

                // Kiểm tra nội dung chữ thực tế (bỏ qua icon emoji, khoảng trắng, thẻ br)
                const rawText = contentEl ? contentEl.innerText : callout.innerText;
                const cleanText = (rawText || '').replace(/[📌💡⚠️🎯\s\u200B-\u200D\uFEFF]/g, '');
                const hasMedia = callout.querySelector('img, audio, video, table, input, button:not(.tn-callout-icon)');

                // Nếu người dùng đã xóa hết chữ bên trong -> Xóa bỏ hoàn toàn khối Callout khỏi DOM
                if (!cleanText && !hasMedia) {
                    callout.remove();
                    return;
                }
            });

            // 2. DỌN DẸP KHỐI TO-DO RỖNG
            container.querySelectorAll('.tn-todo-item').forEach(todo => {
                const todoText = todo.querySelector('.tn-todo-text');
                const cleanText = (todoText ? todoText.innerText : todo.innerText).replace(/[\s\u200B-\u200D\uFEFF]/g, '');
                if (!cleanText) {
                    todo.remove();
                }
            });

            // 3. DỌN DẸP KHỐI TOGGLE LIST RỖNG
            container.querySelectorAll('.tn-toggle-block').forEach(toggle => {
                const summaryText = (toggle.querySelector('.tn-toggle-summary')?.innerText || '').replace(/[▶▼\s\u200B-\u200D\uFEFF]/g, '');
                const contentText = (toggle.querySelector('.tn-toggle-content')?.innerText || '').replace(/[\s\u200B-\u200D\uFEFF]/g, '');
                if (!summaryText && !contentText) {
                    toggle.remove();
                }
            });
        }

        insertVocabTable() {
            const html = `
                <table class="tn-vocab-table" style="width:100%;border-collapse:separate;margin:14px 0;">
                    <thead>
                        <tr>
                            <th style="width:25%;">Từ mới</th>
                            <th style="width:25%;">Phiên âm & Loa</th>
                            <th style="width:25%;">Nghĩa tiếng Việt</th>
                            <th style="width:25%;">Ví dụ TOEIC</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>negotiate</strong></td>
                            <td>
                                <span>/nɪˈɡoʊʃieɪt/</span>
                                <button type="button" class="tn-vocab-speak-btn ml-1.5 w-6 h-6 rounded-full bg-amber-200 text-amber-900 inline-flex items-center justify-center text-[10px]" data-word="negotiate" title="Nghe phát âm">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                            </td>
                            <td>đàm phán, thương lượng</td>
                            <td>The manager negotiated a better price.</td>
                        </tr>
                        <tr>
                            <td><strong>schedule</strong></td>
                            <td>
                                <span>/ˈskedʒuːl/</span>
                                <button type="button" class="tn-vocab-speak-btn ml-1.5 w-6 h-6 rounded-full bg-amber-200 text-amber-900 inline-flex items-center justify-center text-[10px]" data-word="schedule" title="Nghe phát âm">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                            </td>
                            <td>lịch trình, thời khóa biểu</td>
                            <td>The seminar is scheduled for 9 AM.</td>
                        </tr>
                    </tbody>
                </table><p><br></p>
            `;
            this.insertBlock(html);
        }

        insertCallout(type = 'tip') {
            const configs = {
                tip: { icon: '💡', title: 'MẸO LÀM BÀI TOEIC:', cls: 'tn-callout-tip' },
                trap: { icon: '⚠️', title: 'BẪY ĐỀ KINH ĐIỂN CẦN TRÁNH:', cls: 'tn-callout-trap' },
                formula: { icon: '📌', title: 'CÔNG THỨC NGỮ PHÁP THEN CHỐT:', cls: 'tn-callout-formula' },
                target: { icon: '🎯', title: 'MỤC TIÊU GHI NHỚ:', cls: 'tn-callout-target' }
            };
            const c = configs[type] || configs.tip;
            const html = `
                <div class="tn-callout ${c.cls}">
                    <div class="tn-callout-icon">${c.icon}</div>
                    <div class="tn-callout-content">
                        <strong>${c.title}</strong>
                        <div>Nhập nội dung ghi chú mẹo hoặc công thức trọng tâm vào đây...</div>
                    </div>
                </div><p><br></p>
            `;
            this.insertBlock(html);
        }

        insertToggleBlock() {
            const html = `
                <details class="tn-toggle-block">
                    <summary class="tn-toggle-summary">
                        <span>▶</span> <strong>Bấm vào đây để xem đáp án & giải thích chi tiết...</strong>
                    </summary>
                    <div class="tn-toggle-content">
                        <p>Nội dung đáp án, dịch nghĩa chi tiết hoặc mở rộng từ vựng ẩn tại đây.</p>
                    </div>
                </details><p><br></p>
            `;
            this.insertBlock(html);
        }

        insertTodoItem() {
            const html = `
                <div class="tn-todo-item">
                    <input type="checkbox" class="tn-todo-checkbox">
                    <div class="tn-todo-text" style="flex:1;">Nội dung bài tập hoặc công việc cần hoàn thành...</div>
                </div><p><br></p>
            `;
            this.insertBlock(html);
        }

        insertQuote() {
            const html = `
                <blockquote style="border-left: 4px solid #f59e0b; padding-left: 14px; margin: 12px 0; color: #475569; font-style: italic;">
                    "If you can dream it, you can do it." — Ghi chú trích dẫn...
                </blockquote><p><br></p>
            `;
            this.insertBlock(html);
        }

        insertDivider() {
            const html = `<hr class="tn-divider" style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0;"><p><br></p>`;
            this.insertBlock(html);
        }

        /**
         * ĐIỀU HƯỚNG SIDEBAR, FULL-WIDTH VÀ RIBBON
         */
        toggleSidebar() {
            const sidebarCol = document.getElementById('takeNoteSidebarCol');
            const editorCol = document.getElementById('takeNoteEditorCol');
            const toggleBtn = document.getElementById('tnSidebarToggleBtn');
            if (!sidebarCol || !editorCol) return;

            this.isSidebarCollapsed = !this.isSidebarCollapsed;
            if (this.isSidebarCollapsed) {
                sidebarCol.classList.add('hidden');
                editorCol.className = 'lg:col-span-12 glass-panel rounded-[26px] p-3.5 sm:p-5 space-y-3 border-2 border-amber-200/80 dark:border-slate-700 max-w-full overflow-hidden';
                if (toggleBtn) toggleBtn.classList.add('bg-amber-100', 'text-amber-800');
            } else {
                sidebarCol.classList.remove('hidden');
                editorCol.className = 'lg:col-span-8 glass-panel rounded-[26px] p-3.5 sm:p-5 space-y-3 border-2 border-amber-200/80 dark:border-slate-700 max-w-full overflow-hidden';
                if (toggleBtn) toggleBtn.classList.remove('bg-amber-100', 'text-amber-800');
            }
        }

        toggleRibbon() {
            const ribbon = document.getElementById('tnRibbonToolbar');
            const icon = document.getElementById('toggleRibbonIcon');
            if (!ribbon) return;

            this.isRibbonCollapsed = !this.isRibbonCollapsed;
            if (this.isRibbonCollapsed) {
                ribbon.classList.add('collapsed');
                if (icon) icon.className = 'fa-solid fa-chevron-down';
            } else {
                ribbon.classList.remove('collapsed');
                if (icon) icon.className = 'fa-solid fa-chevron-up';
            }
        }

        toggleCanvasWidth() {
            const wrapper = document.getElementById('tnCanvasWrapper');
            const icon = document.getElementById('tnWidthToggleIcon');
            if (!wrapper) return;

            this.isFullWidth = !this.isFullWidth;
            if (this.isFullWidth) {
                wrapper.className = 'tn-canvas-wrapper tn-canvas-full';
                if (icon) icon.className = 'fa-solid fa-compress';
                if (window.showToast) window.showToast('🖥️ Đã chuyển sang chế độ Toàn màn hình (Full-width)');
            } else {
                wrapper.className = 'tn-canvas-wrapper tn-canvas-standard';
                if (icon) icon.className = 'fa-solid fa-expand';
                if (window.showToast) window.showToast('📄 Đã chuyển sang chế độ Trang giấy chuẩn (Standard 850px)');
            }
        }

        updateBreadcrumbs() {
            const cat = document.getElementById('takeNoteCategorySelect')?.value || 'Ngữ pháp';
            const title = document.getElementById('takeNoteTitleInput')?.value || 'Trang ghi chú';
            const catEl = document.getElementById('tnBreadcrumbCat');
            const titleEl = document.getElementById('tnBreadcrumbTitle');
            if (catEl) catEl.textContent = `📁 ${cat}`;
            if (titleEl) titleEl.textContent = `📄 ${title.slice(0, 28)}${title.length > 28 ? '...' : ''}`;
        }

        /**
         * XUẤT TÀI LIỆU TOÀN DIỆN (.DOCX, .PDF, .TXT, .MD)
         */
        exportNote(format) {
            const activeId = window.activeNoteId;
            const note = window.takeNotesList?.find(n => n.id === activeId) || {
                title: document.getElementById('takeNoteTitleInput')?.value || 'Ghi chú',
                category: document.getElementById('takeNoteCategorySelect')?.value || 'Tài liệu'
            };
            const paperEl = document.getElementById('takeNoteEditorPaper');

            if (format === 'doc' || format === 'docx') {
                if (typeof window.exportCurrentNoteAsWord === 'function') {
                    window.exportCurrentNoteAsWord();
                }
            } else if (format === 'pdf') {
                if (typeof window.exportCurrentNoteAsPdf === 'function') {
                    window.exportCurrentNoteAsPdf();
                }
            } else if (format === 'txt') {
                if (typeof window.exportCurrentNoteTxt === 'function') {
                    window.exportCurrentNoteTxt();
                }
            } else if (format === 'md') {
                const title = note.title || 'Ghi chú';
                const bodyText = paperEl ? paperEl.innerText : '';
                const mdContent = `# ${title}\n\n**Danh mục:** ${note.category}\n\n---\n\n${bodyText}`;
                const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}.md`;
                a.click();
                URL.revokeObjectURL(url);
                if (window.showToast) window.showToast('📝 Đã xuất file Markdown (.md) thành công!');
            }
            this.hideExportDropdown();
        }

        toggleExportDropdown() {
            const dropdown = document.getElementById('tnExportDropdown');
            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        }

        hideExportDropdown() {
            const dropdown = document.getElementById('tnExportDropdown');
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        }

        bindKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+S: Lưu thủ công
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                    const takeNoteSec = document.getElementById('view-take-note');
                    if (takeNoteSec && !takeNoteSec.classList.contains('hidden')) {
                        e.preventDefault();
                        if (typeof window.saveCurrentTakeNote === 'function') {
                            window.saveCurrentTakeNote();
                            if (window.showToast) window.showToast('💾 Đã lưu trang ghi chú tức thì!');
                        }
                    }
                }
            });

            // Close export dropdown on click outside
            document.addEventListener('click', (e) => {
                const btn = document.getElementById('tnExportDropdownBtn');
                const menu = document.getElementById('tnExportDropdown');
                if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
        }
    }

    const instance = new HybridEditorEngine();
    return instance;
}));

// Tự động kích hoạt khi DOM tải xong
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.TakeNoteHybridEditor?.init());
    } else {
        setTimeout(() => window.TakeNoteHybridEditor?.init(), 50);
    }
}
