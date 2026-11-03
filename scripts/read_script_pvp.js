const fs = require('fs');
if (fs.existsSync('scripts/upgrade_pvp_multiplayer_and_friends.js')) {
    console.log(fs.readFileSync('scripts/upgrade_pvp_multiplayer_and_friends.js', 'utf8'));
} else {
    console.log('Not found');
}
