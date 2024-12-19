//const { DiscordUNO } = require("discord-uno");
//const discordUNO = new DiscordUNO("#2f3136");
const {
    MessageEmbed,
    MessageAttachment
  } = require("discord.js");
  const config = require(`${process.cwd()}/botconfig/config.json`);
  var ee = require(`${process.cwd()}/botconfig/embed.json`);
  const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  const fetch = require("node-fetch");
module.exports = {
    name: "uno",
    aliases: ["cardgame"],
    category: "🎮 MiniGames",
    description: "Allows you to play a Game of UNO",
    usage: "uno --> Play the Game",
    type: "buttons",
    run: async (client, message, args, cmduser, text, prefix) => {
    
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        return message.reply("**Due to legal Reasons, This Command got disabled!** :cry:")
    }
  }