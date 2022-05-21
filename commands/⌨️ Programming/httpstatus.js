//Here the command starts
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const fetch = require("node-fetch");
const { STATUS_CODES } = require("http");
const { MessageEmbed } = require(`discord.js`);
module.exports = {
	//definition
	name: "httpstatus", //the name of the command 
	category: "⌨️ Programming", //the category this will be listed at, for the help cmd
	aliases: [""], //every parameter can be an alias
	cooldown: 4, //this will set it to a 4 second cooldown
	usage: "httpstatus <status>", //this is for the help command for EACH cmd
  	description: "Show httpstatus with a meme.", //the description of the command

	//running the command with the parameters: client, message, args, user, text, prefix
  	run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    	
			  
			if(GuildSettings.PROGRAMMING !== false){
				return message.reply({embeds : [new MessageEmbed()
				.setColor(es.wrongcolor)
				.setFooter(client.getFooter(es))
				.setTitle(client.la[ls].common.disabled.title)
				.setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
				]});
			}
		try {
			const status = args[0];
			if (!status)
				return message.reply({embeds: [new MessageEmbed()
					.setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
					.setTitle(eval(client.la[ls]["cmds"]["programming"]["httpstatus"]["variable1"]))
					.setDescription(eval(client.la[ls]["cmds"]["programming"]["httpstatus"]["variable2"]))
				]});
			// 599 isn't standard i think, not in Node.js but it's on http.cat so let's handle it.
			if(status !== "599" && !STATUS_CODES[status]) return message.reply({content : eval(client.la[ls]["cmds"]["programming"]["httpstatus"]["variable3"])});
			return message.reply({embeds: [new MessageEmbed()
			  .setTitle(eval(client.la[ls]["cmds"]["programming"]["httpstatus"]["variable4"]))
			  .setImage(`https://http.cat/${status}.jpg`)
			  .setDescription(status === "599" ? "Network Connect Timeout Error" : STATUS_CODES[status])
			  .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 64 }))]});
		} catch (e) {
			console.log(String(e.stack).grey.bgRed)
			return message.reply({embeds : [new MessageEmbed()
			  .setColor(es.wrongcolor).setFooter(client.getFooter(es))
			  .setTitle(client.la[ls].common.erroroccur)
			  .setDescription(eval(client.la[ls]["cmds"]["programming"]["httpstatus"]["variable5"]))
			]});
		  }
	
	}
}
