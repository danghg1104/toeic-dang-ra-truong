const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const sourcePath = path.join(__dirname, '..', 'js', 'app-core.bundle.js');
const source = fs.readFileSync(sourcePath, 'utf8');

function section(startMarker, endMarker) {
    const start = source.indexOf(startMarker);
    assert.notEqual(start, -1, `Missing source marker: ${startMarker}`);
    const end = source.indexOf(endMarker, start + startMarker.length);
    assert.notEqual(end, -1, `Missing end marker: ${endMarker}`);
    return source.slice(start, end);
}

function assertStateIsSyncedBeforePersist(name, body) {
    const syncAt = body.indexOf('window.takeNotesList = takeNotesList;');
    const activeAt = body.indexOf('window.activeNoteId = activeNoteId;');
    const persistAt = body.indexOf('persistTakeNotes();');

    assert.notEqual(syncAt, -1, `${name}: takeNotesList must be synced to window`);
    assert.notEqual(activeAt, -1, `${name}: activeNoteId must be synced to window`);
    assert.notEqual(persistAt, -1, `${name}: persistTakeNotes() must be called`);
    assert.ok(syncAt < persistAt, `${name}: list must be synced before persistence`);
    assert.ok(activeAt < persistAt, `${name}: active note must be synced before persistence`);
}

const createPage = section('function createNewTakeNotePage()', 'function deleteCurrentTakeNote()');
const deletePage = section('function deleteCurrentTakeNote()', 'function changeTakeNotePaperStyle(');
const appendSnippet = section('function appendSnippetToTakeNote(', 'function exportCurrentNoteTxt()');
const saveCopying = section('function saveCopyingSessionToNotePage()', 'function restartWordCopyingSession()');
const accountHydration = section(
    'if (Array.isArray(p.takeNotesList) && p.takeNotesList.length > 0)',
    "const cntEl = document.getElementById('grammarNotebookCount');"
);

assertStateIsSyncedBeforePersist('createNewTakeNotePage', createPage);
assertStateIsSyncedBeforePersist('deleteCurrentTakeNote', deletePage);
assertStateIsSyncedBeforePersist('appendSnippetToTakeNote', appendSnippet);
assertStateIsSyncedBeforePersist('saveCopyingSessionToNotePage', saveCopying);
assertStateIsSyncedBeforePersist('account take-note hydration', accountHydration);

console.log('PASS: all five Take Note state-sync regression checks passed.');
