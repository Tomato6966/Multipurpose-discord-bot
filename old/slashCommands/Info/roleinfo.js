const {MessageEmbed} = require("discord.js");
const moment = require('moment');
module.exports = {
  name: "roleinfo",
  description: "Get information about a role",
  options: [ 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		{"Role": { name: "what_role", description: "From What Role do you want to get Informations?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    //things u can directly access in an interaction!
    const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    try {   
      var role = options.getRole("what_role");;
      if(!role || role == null || role.id == null || !role.id) return interaction?.reply(client.la[ls].common.rolenotfound)
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor(client.la[ls].cmds.info.roleinfo.author + " " + role.name, guild.iconURL({ dynamic: true }), "https://discord.gg/milrato")
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field1,`\`${role.name}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field2,`\`${role.id}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field3,`\`${role.hexColor}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field4, "\`"+moment(role.createdAt).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(role.createdAt).format("hh:mm:ss") + "\`",true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field5,`\`${role.rawPosition}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field6,`\`${role.members.size} Members have it\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field7,`\`${role.hoist ? "✔️" : "❌"}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field8,`\`${role.mentionable ? "✔️" : "❌"}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field9,`${role.permissions.toArray().map(p=>`\`${p}\``).join(", ")}`)
        embeduserinfo.setColor(role.hexColor)
        embeduserinfo.setFooter(client.getFooter(es))
        //send the EMBED
        interaction?.reply({ephemeral: true, embeds: [embeduserinfo]})

      
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
