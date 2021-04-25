import { assertExists } from '../util/assert.js';

const botCommands = {
  botprefix: {
    usage: '',
    fieldName: 'bot',
    description: "Access commands for PlexBot configuration.",
    process: function (client, message, query, prefix, data) {
      const { args, guildSettings } = data;
      let command = '';
      // This is where we change bot information
      if (args.length > 0) {
        command = args.shift().toLowerCase();
      } else {
        command = "help";
      }

      switch (command) {
        case "prefix":
          if (args.length > 0) {
            if (message.channel.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
              command = args.shift().toLowerCase();
              guildSettings.prefix = command;
              client.setGuildSettings.run(guildSettings);
              guildSettings = client.getGuildSettings.get(message.guild.id);
              return message.channel.send("Prefix changed to `" + guildSettings.prefix + "`");
            }
            else {
              return message.channel.send(`You do not have permissions to use \`${prefix}bot prefix\` in <#${message.channel.id}>!`);
            }
          } else {
            return message.channel.send(`The current prefix is \`${guildSettings.prefix}\`\nTo change it type: \`${guildSettings.prefix}bot prefix <${keys.defaultPrefix}>\` (where **<${keys.defaultPrefix}>** is the prefix)`);
          }

        case "help":
          // Help message for bot settings goes here
          const help = {
            "title": `The following are available for the command \`${prefix}bot <command>\``,
            "description": ''/*"\n\u200b"*/,
            "color": 4025171,
            "timestamp": new Date(),
            "footer": {
              "icon_url": client.user.avatarURL,
              "text": "Fetched"
            },
            "thumbnail": {
              "url": client.user.avatarURL
            },
            // "author": {
            //   "name": client.user.username,
            //   "icon_url": client.user.avatarURL
            // },
            "fields": [
              {
                "name": `\`${prefix}bot prefix <prefix>\``,
                "value": "Changes the bot prefix for the server."
              }
            ]
          }

          return message.channel.send({ embed: help });
        default:
          return message.channel.send(`**Command not recognized!** Type \`${prefix}bot help\` for a list of bot settings.`);
      }
    }
  }
};

const botCommandsEnumerable = [
  assertExists(botCommands.botprefix)
];

export { botCommands, botCommandsEnumerable };