const fs = require('fs');

const code = fs.readFileSync('userscript_v27_supreme.js', 'utf8');
const buildScript = `const fs = require("fs");\n\nconst scriptContent = ${JSON.stringify(code)};\n\nfs.writeFileSync("userscript_v27_supreme.js", scriptContent, "utf8");\nconsole.log("Build OK");\n`;

fs.writeFileSync('build_v27.js', buildScript, 'utf8');
console.log('build_v27.js updated successfully!');
