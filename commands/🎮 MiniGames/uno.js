//const { DiscordUNO } = require("discord-uno");
//const discordUNO = new DiscordUNO("#2f3136");
const {
    MessageEmbed,
    MessageAttachment
  } = require("discord.js");
  const config = require(`../../botconfig/config.json`);
  var ee = require(`../../botconfig/embed.json`);
  const emoji = require(`../../botconfig/emojis.json`);
  const fetch = require("node-fetch");
module.exports = {
    name: "uno",
    aliases: ["cardgame"],
    category: "🎮 MiniGames",
    description: "Allows you to play a Game of UNO",
    usage: "uno --> Play the Game",
    type: "buttons",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
        
        if(GuildSettings.FUN === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        return message.reply("**Due to legal Reasons, This Command got disabled!** :cry:")
    }
  }