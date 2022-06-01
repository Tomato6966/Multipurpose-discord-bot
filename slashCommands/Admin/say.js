const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "say", //the command name for the Slash Command
  description: "Send a Text into the Chat", //the command description for Slash Command Overview
  cooldown: 5,
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		{"String": { name: "text", description: "What should I send? [ +n+ = Newline ]", required: true }}, //to use in the code: interacton.getString("title")
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
		const Text = options.getString("text"); //same as in StringChoices //RETURNS STRING 
		//let UserOption = options.getUser("OPTIONNAME"); //RETURNS USER OBJECT 
		const ChannelOption = options.getChannel("in_where"); //RETURNS CHANNEL OBJECt
		//let RoleOption = options.getRole("OPTIONNAME"); //RETURNS ROLE OBJECT
		const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);
		//update it without a response!
		await interaction?.reply({content: `Sending the Message...`, ephemeral: true}).catch(() => null);
		//SEND THE EMBED!
		await channel.send({content: String(Text).substring(0, 2000).split("+n+").join("\n")}).catch(() => null);
		//Edit the reply
		interaction?.editReply({content: `✅ Message sent in ${channel}!`, ephemeral: true}).catch(() => null);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}

