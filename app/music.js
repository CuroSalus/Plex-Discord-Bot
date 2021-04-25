import SQLite from 'better-sqlite3';
import { plexCommands, plexCommandsEnumerable } from '../commands/plex.js';
import { botCommands, botCommandsEnumerable } from '../commands/bot.js';

// const plex = require('../config/plex.js');
import keys from '../config/keys.js';
import plex from '../config/plex.js';


/// ////////////
// Utilities
/// ////////////

/**
 * Creates a Field entry from a Command object.
 * @param {string} prefix String that represents the command prefix.
 * @param {*} field Command object
 */
function makeField(prefix, command) {
  return {
    name: `\`${prefix}${[command.fieldName]}\``,
    value: command.description,
  };
}

export default function (client) {
  // var keys = require('../config/keys.js');

  // Database for individual server settings as well as saving bot changes. This can be used later for even more advanced customizations like mod roles, log channels, etc.
  //const SQLite = require("better-sqlite3");
  const sql = new SQLite('./config/database.sqlite');

  // When the bot enters the ready state.
  client.on('ready', async message => {
    console.log(`${new Date().toISOString()}: Bot ready!`);
    console.log(`${new Date().toISOString()}: Logged in as ${client.user.tag}`);
    client.user.setActivity(`music | ${keys.defaultPrefix}help`, { type: 'PLAYING' });

    // Check if the table "guildSettings" exists.
    const tableGuildSettings = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildSettings';").get();
    if (!tableGuildSettings['count(*)']) {
      // If the table isn't there, create it and setup the database correctly.
      sql.prepare("CREATE TABLE guildSettings (id TEXT PRIMARY KEY, guild TEXT, prefix TEXT);").run();
      // Ensure that the "id" row is always unique and indexed.
      sql.prepare("CREATE UNIQUE INDEX idx_guildSettings_id ON guildSettings (id);").run();
      sql.pragma("synchronous = 1");
      sql.pragma("journal_mode = wal");
    }

    // And then we have prepared statements to get and set guildSettings data.
    client.getGuildSettings = sql.prepare("SELECT * FROM guildSettings WHERE guild = ?");
    client.setGuildSettings = sql.prepare("INSERT OR REPLACE INTO guildSettings (id, guild, prefix) VALUES (@id, @guild, @prefix);");

    plexCommands['plexTest'].process();
  });

  // When a message is sent to Discord:
  client.on('message', async (message) => {
    if (message.author.bot) return;  // If a bot sends a message, ignore it.
    let guildSettings;  // Used for Discord server settings.

    if (message.guild) {
      // Sets default server settings if message occurs in a guild (not a dm)
      guildSettings = client.getGuildSettings.get(message.guild.id);
      if (!guildSettings) {
        guildSettings = {
          id: `${message.guild.id}-${client.user.id}`,
          guild: message.guild.id,
          prefix: keys.defaultPrefix
        };
        client.setGuildSettings.run(guildSettings);
        guildSettings = client.getGuildSettings.get(message.guild.id);
      }
    }

    const prefix = guildSettings.prefix;
    const msg = message.content.toLowerCase();

    const fields = [
      ...plexCommandsEnumerable.map((pCommand) => makeField(prefix, pCommand)),
      ...botCommandsEnumerable.map((bCommand) => makeField(prefix, bCommand)),
    ];

    /// //////////////////////
    // Command Processing
    /// //////////////////////

    // Ensure this bot is targeted (matching prefix character).
    if (msg.startsWith(prefix)) {
      // Used for bot settings
      let args = message.content.slice(prefix.length).trim().split(' ');
      let command = args.shift().toLowerCase();

      /// ///////////////////////////////////////
      // Delegate command to proper handler.
      /// ///////////////////////////////////////
      let returnResult = null;
      let query= '';
      switch (true) {
        case command === "help":
          returnResult = message.channel.send({
            embed: {
              title: `The following are available for the command \`${prefix}bot <command>\``,
              description: ''/*"\n\u200b"*/,
              color: 4025171,
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: "Fetched"
              },
              thumbnail: {
                url: client.user.avatarURL
              },
              fields,
            }
          });
          break;

        // Check for bot/utility commands first.
        case !!botCommands[command]:
          const botCommand = botCommands[command];
          query = msg.substring(msg.indexOf(' ') + 1);
          args.shift()
          returnResult = botCommand.process(client,
            message,
            query,
            prefix,
            { args, guildSettings, keys }
          );
          break;

        // Check for Plex commands next.
        case !!plexCommands[command]:
          const plexCommand = plexCommands[command];
          query = msg.substring(msg.indexOf(' ') + 1);
          try {
            returnResult = plexCommand.process(client, message, query, prefix, null);
          } catch (e) {
            console.error(e);
            returnResult = message.channel.send(`Error occurred during execution of Plex command! ${e}`);
          }
          break;

        // Inform user of failure to detect command.
        default:
          returnResult = message.channel.send(`I'm sorry **${message.author.username}**, that's not a command!\nIf you need help, please type \`${prefix}help\` for a list of available commands.`);
          break;
      }

      return returnResult;
    }
  });
};
