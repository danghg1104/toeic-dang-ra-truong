const fs = require('fs');
const path = require('path');

const p22 = path.join(__dirname, '..', 'public', 'audio', 'listening', 'part1', 'p1_q22.mp3');
const p01 = path.join(__dirname, '..', 'public', 'audio', 'listening', 'part1', 'p1_q01.mp3');

console.log('p01 first 64 bytes:', fs.readFileSync(p01).subarray(0, 64).toString('hex'));
console.log('p22 first 64 bytes:', fs.readFileSync(p22).subarray(0, 64).toString('hex'));
console.log('p22 text preview:', fs.readFileSync(p22).subarray(0, 200).toString('utf8'));
