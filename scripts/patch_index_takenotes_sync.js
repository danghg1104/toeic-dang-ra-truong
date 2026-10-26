const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const target = `        let takeNotesList = [];
        let activeNoteId = 'note-1';
        let currentNoteTagFilter = 'ALL';

        function initTakeNotes() {`;

const replacement = `        let takeNotesList = [];
        let activeNoteId = 'note-1';
        let currentNoteTagFilter = 'ALL';

        window.takeNotesList = takeNotesList;
        window.activeNoteId = activeNoteId;

        function initTakeNotes() {`;

if (html.includes(target)) {
    html = html.replace(target, replacement);
    console.log('✅ Added window.takeNotesList and window.activeNoteId global linkage');
} else {
    console.warn('⚠️ Target not found directly, checking normalized');
}

const target2 = `        function persistTakeNotes() {
            try {
                localStorage.setItem('cung_dang_take_notes_v1', JSON.stringify(takeNotesList));
            } catch (e) {}
        }`;

const replacement2 = `        function persistTakeNotes() {
            try {
                if (window.takeNotesList && Array.isArray(window.takeNotesList) && window.takeNotesList !== takeNotesList) {
                    takeNotesList = window.takeNotesList;
                }
                window.takeNotesList = takeNotesList;
                window.activeNoteId = activeNoteId;
                localStorage.setItem('cung_dang_take_notes_v1', JSON.stringify(takeNotesList));
            } catch (e) {}
        }`;

if (html.includes(target2)) {
    html = html.replace(target2, replacement2);
    console.log('✅ Updated persistTakeNotes() to sync window.takeNotesList');
} else {
    console.warn('⚠️ target2 not found directly');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('💾 index.html successfully updated.');
