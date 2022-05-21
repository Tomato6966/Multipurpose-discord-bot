const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);

module.exports = {
    name: "reverse",
    aliases: ["reversetext"],
    category: "🎮 MiniGames",
    description: "Would you Rather?",
    usage: "reverse TEXT",
    type: "text",
     run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        
        if(GuildSettings.FUN === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        message.reply(reverseText(args[0] ? args.join(" ") : "No Text Added! Please Retry!"))
        
    }
  }
function reverseText(string) {
  return string.split('').reverse().join('');
}