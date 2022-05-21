//Here the command starts
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const fetch = require("node-fetch");
const { STATUS_CODES } = require("http");
const { MessageEmbed } = require(`discord.js`);
module.exports = {
	//definition
	name: "npmpkgsize", //the name of the command 
	category: "⌨️ Programming", //the category this will be listed at, for the help cmd
	aliases: ["npmpackagesize", "nodepackagemanagersize"], //every parameter can be an alias
	cooldown: 4, //this will set it to a 4 second cooldown
	usage: "npmpkgsize <package>", //this is for the help command for EACH cmd
  	description: "Search the NPM Registry for a package Size Information", //the description of the command

	//running the command with the parameters: client, message, args, user, text, prefix
  	run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    	
			
		if(GuildSettings.VOICE !== false){
			return message.reply({embeds : [new MessageEmbed()
			.setColor(es.wrongcolor)
			.setFooter(client.getFooter(es))
			.setTitle(client.la[ls].common.disabled.title)
			.setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
			]});
		}
		try {
			const name = args[0];
			if (!name)
				return message.reply({embeds: [new MessageEmbed()
					.setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
					.setTitle(eval(client.la[ls]["cmds"]["programming"]["npmpkgsize"]["variable1"]))
					.setDescription(eval(client.la[ls]["cmds"]["programming"]["npmpkgsize"]["variable2"]))
				]});
			const { publishSize, installSize } = await fetch(`https://packagephobia.now.sh/api.json?p=${encodeURIComponent(name)}`)
				.then(res => res.json());
			  
			if (!publishSize && !installSize) return message.reply({content : eval(client.la[ls]["cmds"]["programming"]["npmpkgsize"]["variable3"])});
			const suffixes = ["Bytes", "KB", "MB", "GB"]
			function getBytes(bytes) {
			const i = Math.floor(Math.log(bytes) / Math.log(1024));
			return (!bytes && "0 Bytes") || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
			}
			
			return message.reply({ embeds: [new MessageEmbed()
				.setTitle(eval(client.la[ls]["cmds"]["programming"]["npmpkgsize"]["variable4"]))
				.setColor(es.color)
				.setFooter(client.getFooter(es))
				.setDescription(eval(client.la[ls]["cmds"]["programming"]["npmpkgsize"]["variable5"])) ]});
		} catch (e) {
			console.log(String(e.stack).grey.bgRed)
			return message.reply({embeds : [new MessageEmbed()
			  .setColor(es.wrongcolor).setFooter(client.getFooter(es))
			  .setTitle(client.la[ls].common.erroroccur)
			  .setDescription(eval(client.la[ls]["cmds"]["programming"]["npmpkgsize"]["variable6"]))
			]});
		  }
	
	}
}
