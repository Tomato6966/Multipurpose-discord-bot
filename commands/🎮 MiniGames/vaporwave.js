const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);

module.exports = {
    name: "vaporwave",
    aliases: ["vaporwavetext"],
    category: "🎮 MiniGames",
    description: "Would you Rather?",
    usage: "vaporwave TEXT",
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

        message.reply(vaporwave(args[0] ? args.join(" ") : "No Text Added! Please Retry!"))
        
    }
  }
  function vaporwave(string) {
		return string
			.replace(/[a-zA-Z0-9!\?\.'";:\]\[}{\)\(@#\$%\^&\*\-_=\+`~><]/g, (char) =>
				String.fromCharCode(0xfee0 + char.charCodeAt(0)),
			)
			.replace(/ /g, '　');
	}