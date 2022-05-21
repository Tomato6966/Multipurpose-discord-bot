const {
	MessageEmbed, Collection, Permissions
  } = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
module.exports = {
	//definition
	name: "choose", //the name of the command 
	category: "🕹️ Fun", //the category this will be listed at, for the help cmd
	aliases: ["random"], //every parameter can be an alias
	cooldown: 2, //this will set it to a 4 second cooldown
	usage: "choose <first>/<second>/[...]/[last]", //this is for the help command for EACH cmd
  	description: "Choose your random sentence", //the description of the command
	type: "text",
	//running the command with the parameters: client, message, args, user, text, prefix
  	run: async (client, message, args, cmduser, text, prefix) => {
		  let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    
        const answers = args.join(" ").split("/");
		if (answers.length < 2) return message.reply(`Nothing to choose (type \`${config.prefix}help choose\` for help)`);
		if (answers.some(answer => !answer)) return message.reply(`Nothing to choose (type \`${config.prefix}help choose\` for help)`);
		
		return message.reply({embeds :[new MessageEmbed()
			.setColor(es.color)
			.setFooter(client.getFooter(es))
			.setTitle(`I choose...`)
			.setDescription(`**\`${answers[parseInt(Math.floor(Math.random() * answers.length))]}\`**`)
		]})

	}
}
