//Here the command starts
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const fetch = require("node-fetch");
const { STATUS_CODES } = require("http");
const { MessageEmbed } = require(`discord.js`);
module.exports = {
	//definition
	name: "npm", //the name of the command 
	category: "⌨️ Programming", //the category this will be listed at, for the help cmd
	aliases: ["npmpackage", "npmpkg", "nodepackagemanager"], //every parameter can be an alias
	cooldown: 4, //this will set it to a 4 second cooldown
	usage: "npm <package>", //this is for the help command for EACH cmd
  	description: "Search the NPM Registry for a package information", //the description of the command

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
			const pkg = args[0];
			if (!pkg)
				return message.reply({embeds: [new MessageEmbed()
					.setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
					.setTitle(eval(client.la[ls]["cmds"]["programming"]["npm"]["variable1"]))
					.setDescription(eval(client.la[ls]["cmds"]["programming"]["npm"]["variable2"]))
				]});

			const body = await fetch(`https://registry.npmjs.com/${pkg}`)
				.then((res) => {
				if(res.status === 404) throw "No results found.";
				return res.json();
				});
		
			const version = body.versions[body["dist-tags"]?.latest] || "Unknown";
		
			let deps = version?.dependencies ? Object.keys(version.dependencies) : null;
			let maintainers = body.maintainers.map((user) => user.name);
		
			if(maintainers.length > 10) {
				const len = maintainers.length - 10;
				maintainers = maintainers.slice(0, 10);
				maintainers.push(`...${len} more.`);
			}
		
			if(deps && deps.length > 10) {
				const len = deps.length - 10;
				deps = deps.slice(0, 10);
				deps.push(`...${len} more.`);
			}
		
			return message.reply({ embeds: [new MessageEmbed()
				.setTitle(eval(client.la[ls]["cmds"]["programming"]["npm"]["variable3"]))
				.setColor(es.color)
				.setFooter(client.getFooter(es))
				.setURL(`https://npmjs.com/package/${pkg}`)
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 64 }))
				.setDescription([
				body.description || "No Description.",
				`**Version:** ${body["dist-tags"].latest}`,
				`**License:** ${body.license}`,
				`**Author:** ${body.author ? body.author.name : "Unknown"}`,
				`**Modified:** ${new Date(body.time.modified).toDateString()}`,
				`**Dependencies:** ${deps && deps.length ? deps.join(", ") : "None"}`
				].join("\n")) ]});
		} catch (e) {
			console.log(String(e.stack).grey.bgRed)
			return message.reply({embeds : [new MessageEmbed()
			  .setColor(es.wrongcolor).setFooter(client.getFooter(es))
			  .setTitle(client.la[ls].common.erroroccur)
			  .setDescription(eval(client.la[ls]["cmds"]["programming"]["npm"]["variable4"]))
			]});
		  }
	
	}
}
