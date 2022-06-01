const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const settings = require("../botconfig/settings.json");
const fetch = require("node-fetch")
module.exports = {
  name: "chat", //the command name for the Slash Command
  description: "Chat with the Bot", //the command description for Slash Command Overview
  cooldown: 5,
  options: [
		{"String": { name: "chat_text", description: "Wanna Chat with me?", required: false }}, 
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    try{
    //console.log(interaction, StringOption)
		await interaction?.deferReply({ ephemeral: true })
		//things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, 
		        commandName, deferred, replied, ephemeral, 
				options, id, createdTimestamp 
		} = interaction; 
		const { guild } = member;
		//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
		const Text = options.getString("chat_text"); //same as in StringChoices //RETURNS STRING 
		try{
      fetch(`http://api.brainshop.ai/get?bid=153861&key=0ZjvbPWKAxJvcJ96&uid=1&msg=${encodeURIComponent(Text)}`)
     .then(res => res.json())
     .then(data => {
       if(!data.cnt){
        interaction?.editReply({content: ":cry: **Sorry I am clueless... I can't connect to the API!**", ephemeral: true}).catch(e => console.log("CHATBOT:".underline.red + " :: " + e.stack.toString().grey));
       }else{
        interaction?.editReply({content: data.cnt, ephemeral: true}).catch(e => console.log("CHATBOT:".underline.red + " :: " + e.stack.toString().grey));
       }
     });
    }catch (e){
      interaction?.editReply({content: ":cry: **Sorry I am clueless... I can't connect to the API!**", ephemeral: true}).catch(e => console.log("CHATBOT:".underline.red + " :: " + e.stack.toString().grey));
    }
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}

