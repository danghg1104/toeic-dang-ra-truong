const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const target = `            const activeMobBtn = document.getElementById(targetMobId);
            if (activeMobBtn) {
                activeMobBtn.className = 'mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-slate-800 font-bold transition active:scale-95';
            }
        }

            // Update sidebar companion card text & Image 4 cat mascot pose`;

const replacement = `            const activeMobBtn = document.getElementById(targetMobId);
            if (activeMobBtn) {
                activeMobBtn.className = 'mob-nav-item flex flex-col items-center justify-center py-1.5 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-slate-800 font-bold transition active:scale-95';
            }

            // Update sidebar companion card text & Image 4 cat mascot pose`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync(file, html, 'utf8');
  console.log('Extra closing brace removed from switchTab in index.html!');
} else {
  console.warn('Could not find target to replace in index.html');
}
