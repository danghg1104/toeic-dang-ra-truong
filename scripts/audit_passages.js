const fs = require('fs');

const content = fs.readFileSync('js/reading-practice-database.js', 'utf8');

// Match all passageContent fields
const regex = /"setId":\s*"([^"]+)"[\s\S]*?"qRange":\s*"([^"]+)"[\s\S]*?"passageContent":\s*"([\s\S]*?)"\s*,\s*"passage_vi"/g;
let match;
let totalSets = 0;
let leakedCount = 0;
const leakedSets = [];

while ((match = regex.exec(content)) !== null) {
    totalSets++;
    const setId = match[1];
    const qRange = match[2];
    const passage = match[3];
    if (passage.includes('Đáp án:') || passage.includes('Dap an:')) {
        leakedCount++;
        leakedSets.push({ setId, qRange, preview: passage.slice(0, 120) });
    }
}

console.log('Total Part 7 Sets found:', totalSets);
console.log('Sets leaking Đáp án:', leakedCount);
if (leakedSets.length > 0) {
    console.log('First 5 leaked sets:', leakedSets.slice(0, 5));
}
