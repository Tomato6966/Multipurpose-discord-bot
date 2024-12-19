//Here the command starts
const config = require(`${process.cwd()}/botconfig/config.json`)
const customEmojis = require(`${process.cwd()}/botconfig/customEmojis.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const fetch = require("node-fetch");
const { MessageEmbed } = require(`discord.js`);
module.exports = {
	//definition
	name: "github", //the name of the command 
	category: "⌨️ Programming", //the category this will be listed at, for the help cmd
	aliases: ["git", "repo", "repository", "githubrepo"], //every parameter can be an alias
	cooldown: 4, //this will set it to a 4 second cooldown
	usage: "github <REPO-LINK>", //this is for the help command for EACH cmd
  	description: "View a GitHub Repository details.", //the description of the command

	//running the command with the parameters: client, message, args, user, text, prefix
  	run: async (client, message, args, cmduser, text, prefix) => {
   		let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
		try {
			const repo = args[0];
			if (!repo)
				return message.reply({embeds: [new MessageEmbed()
					.setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
					.setTitle(eval(client.la[ls]["cmds"]["programming"]["github"]["variable1"].replace(":no:", customEmojis.general.no)))
					.setDescription(eval(client.la[ls]["cmds"]["programming"]["github"]["variable2"]))
				]});
			const [base, username, repository] = repo.replace("https://", "").replace("http://", "").split("/");
			if (!username || !repository) 
				return message.reply({embeds:  [new MessageEmbed()
					.setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
					.setTitle(eval(client.la[ls]["cmds"]["programming"]["github"]["variable3"].replace(":no:", customEmojis.general.no)))
					.setDescription(eval(client.la[ls]["cmds"]["programming"]["github"]["variable4"]))
				]});

			console.log(username);
			console.log(repository);
			const body = await fetch(`https://api.github.com/repos/${username}/${repository}`)
				.then((res) => res.ok && res.json())
				.catch(() => null);

			if (!body) 
				return message.reply({embeds: [new MessageEmbed()
					.setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
					.setTitle(eval(client.la[ls]["cmds"]["programming"]["github"]["variable5"].replace(":no:", customEmojis.general.no)))
					.setDescription(eval(client.la[ls]["cmds"]["programming"]["github"]["variable6"]))
				]});
			const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
			const license = body.license && body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license && body.license.name || "None";
			const footer = [];
			if (body.fork) footer.push(`❯ **Forked** from [${body.parent.full_name}](${body.parent.html_url})`);
			if (body.archived) footer.push("❯ This repository is **Archived**");

			return message.reply({ embeds: [new MessageEmbed()
				.setTitle(body.full_name)
				.setAuthor({
					name: 'GitHub', 
					iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'})
				.setURL(body.html_url)
				.setThumbnail(body.owner.avatar_url)
				.setColor(es.color)
				.setFooter(client.getFooter(es))
				.setDescription(eval(client.la[ls]["cmds"]["programming"]["github"]["variable8"])) ]});
		} catch (e) {
			console.log(String(e.stack).grey.bgRed)
			return message.reply({embeds : [new MessageEmbed()
			  .setColor(es.wrongcolor).setFooter(client.getFooter(es))
			  .setTitle(client.la[ls].common.erroroccur.replace(":no:", customEmojis.general.no))
			  .setDescription(eval(client.la[ls]["cmds"]["programming"]["github"]["variable9"]))
			]});
		  }
	
	}
}
//-CODED-BY-TOMATO#6966-//