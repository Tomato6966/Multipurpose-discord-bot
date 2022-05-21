
const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);

module.exports = {
    name: "randomcolor",
    aliases: ["randomhexcolor"],
    category: "🎮 MiniGames",
    description: "Get a random color?",
    usage: "randomcolor",
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
        message.reply(randomHexColor())        
    }
  }
  function randomHexColor() {
		return (
			'#' +
			('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
		);
	}