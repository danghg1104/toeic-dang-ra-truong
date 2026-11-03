const fs = require('fs');
if (fs.existsSync('scripts/upgrade_pomodoro_custom_time.js')) {
    console.log(fs.readFileSync('scripts/upgrade_pomodoro_custom_time.js', 'utf8'));
} else {
    console.log('Not found');
}
