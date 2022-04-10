const {
	MessageEmbed, MessageButton, MessageActionRow
} = require("discord.js")
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`)
module.exports = {
	name: "ownergithub",
	category: "🔰 Info",
	aliases: ["ownergit", "source", "sourcecode", "src"],
	cooldown: 2,
	usage: "ownergithub",
	description: "Shows you the Github and Source Code Information about this Bot",
	type: "bot",
	run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
		
		let button_public_invite = new MessageButton().setStyle('LINK').setEmoji("863876115584385074").setLabel('Invite me').setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
		let button_support_dc = new MessageButton().setStyle('LINK').setEmoji("936723374644789370").setLabel('Support Server').setURL("https://discord.gg/milrato")//array of all buttons
		let button_dash = new MessageButton().setStyle('LINK').setEmoji("867777823817465886").setLabel('Dashboard-Website').setURL("https://milrato.com")//array of all buttons
		const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc, button_dash])]
		message.reply({embeds: [new MessageEmbed()
			.setColor(es.color)
			.setFooter(client.getFooter(es))
			.setTimestamp()
			.setThumbnail("https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp?size=1024")
			.setTitle(client.la[ls].cmds.info.github?.title)
			.setURL("https://milrato.eu")
			.addField("🆕 NEW GITHUB", `> There is now an **open Source** Version of this Bot on [\`Tomato#6966\`'s Github](https://github.com/Tomato6966)\n> [Link](https://github.com/Tomato6966/Multipurpose-discord-bot) but please make sure to **give __Credits__** if you use it!\n> Make sure to read the [README](https://github.com/Tomato6966/Multipurpose-discord-bot#readme) and the [WIKI / FAQ](https://github.com/Tomato6966/Multipurpose-discord-bot/wiki) carefully before opening an [ISSUE](https://github.com/Tomato6966/Multipurpose-discord-bot/issues/new/choose)`)
			.setDescription(client.la[ls].cmds.info.github?.description)],
			components: allbuttons
		}).catch(error => console.log(error));
	}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
