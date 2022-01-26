const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
const fetch = require("node-fetch")
module.exports = {
  name: "color",
  description: "Get Hex Color Information",
  options: [ 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		{"String": { name: "color", description: "What Color do you want to check? Example: #ee33ff", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "which_user", description: "From Which User do you want to get the Avatar?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    //things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    let color = options.getString("color");
		try {
      const url = (`https://api.popcatdev.repl.co/color/${color.includes("#") ?color.split("#")[1] : color }`)
      let json;
      try {
        json = await fetch(url).then(res => res.json())
      } catch (e) {
        return interaction?.reply({content: `\`\`\`fix\n${e.message ? e.message : e}\n\`\`\``, ephemeral: true})
      }
      if (json.error) return interaction?.reply({content: client.la[ls].cmds.info.color.invalid + `\n\`\`\`fix\n${json.error}\n\`\`\``, ephemeral: true})
      const embed = new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["info"]["color"]["variable1"]))
        .addField('<:arrow:832598861813776394> **Name**', json.name, true)
        .addField("<:arrow:832598861813776394> **Hex**", json.hex, true)
        .addField("<:arrow:832598861813776394> **RGB**", json.rgb, true)
        .addField(`<:arrow:832598861813776394> **${client.la[ls].cmds.info.color.brightershade}**`, json.brightened, true)
        .setThumbnail(json.color_image)
        .setColor(json.hex)
      interaction?.reply({
        embeds: [embed], ephemeral: true
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
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
