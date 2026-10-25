const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('gdrive_manifest.json', 'utf8'));
console.log(`Total items in manifest: ${raw.length}`);

const items = raw.map(entry => {
    if (Array.isArray(entry)) {
        return { id: entry[0], path: entry[1], fullPath: entry[2] };
    }
    return entry;
});

const categories = {};
items.forEach(item => {
    const parts = (item.path || '').split(/[\/\\]/);
    const top = parts.length > 1 ? parts[0] : '(root files)';
    categories[top] = (categories[top] || 0) + 1;
});
console.log('Categories breakdown:', categories);

// Show PDF files
const pdfs = items.filter(d => (d.path || '').toLowerCase().endsWith('.pdf'));
console.log(`\nPDF files (${pdfs.length}):`);
pdfs.forEach(p => console.log(`  - ${p.path} (ID: ${p.id})`));

