import Discord from 'discord.js';     // Discord.
import keys from './config/keys.js';  // Keys file.
import music from './app/music.js';   // Bot functions.

const client = new Discord.Client();
music(client);
client.login(keys.botToken);

process.on('SIGTERM', () => {
    console.info("Closing!");
});