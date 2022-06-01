const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "embed", //the command name for the Slash Command
  description: "Send a embed into the Chat", //the command description for Slash Command Overview
  cooldown: 5,
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		{"String": { name: "title", description: "What should be the Embed title?", required: true }}, //to use in the code: interacton.getString("title")
		{"String": { name: "description", description: "What should be the Embed Description? [ +n+ = NewLine ]", required: true }}, //to use in the code: interacton.getString("description")
		{"String": { name: "color", description: "What should be the Embed Color?", required: false }}, //to use in the code: interacton.getString("color")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		{"Channel": { name: "in_where", description: "In What Channel should I send it?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
	
  ],
  memberpermissions: ["ADMINISTRATOR"],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    try{
	    //console.log(interaction, StringOption)
		
		//things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, 
		        commandName, deferred, replied, ephemeral, 
				options, id, createdTimestamp 
		} = interaction; 
		const { guild } = member;
		
		//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER 
		const EmbedTitle = options.getString("title"); //same as in StringChoices //RETURNS STRING 
		const EmbedDescription = options.getString("description"); //same as in StringChoices //RETURNS STRING 
		const EmbedColor = options.getString("color"); //same as in StringChoices //RETURNS STRING 
		//let UserOption = options.getUser("OPTIONNAME"); //RETURNS USER OBJECT 
		const ChannelOption = options.getChannel("in_where"); //RETURNS CHANNEL OBJECt
		//let RoleOption = options.getRole("OPTIONNAME"); //RETURNS ROLE OBJECT
		const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);
		let embed = new MessageEmbed().setColor(EmbedColor ? EmbedColor : es.color)
		.setTitle(String(EmbedTitle).substring(0, 256))
		.setDescription(String(EmbedDescription).substring(0, 2048).split("+n+").join("\n"))
        .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es));
		//update it without a response!
		await interaction?.reply({content: `Sending the Embed...`, ephemeral: true}).catch(() => null);
		//SEND THE EMBED!
		await channel.send({embeds: [embed]}).catch(()=>{
			channel.send({embeds: [embed.setColor(es.color)]}).catch(() => null);
		})
		//Edit the reply
		interaction?.editReply({content: `✅ Embed sent in ${channel}!`, ephemeral: true}).catch(() => null);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}

