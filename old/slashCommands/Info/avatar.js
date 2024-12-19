const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "avatar",
  description: "Get the Avatar of an user",
  options: [ 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		{"User": { name: "which_user", description: "From Which User do you want to get the Avatar?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    //things u can directly access in an interaction!
		let { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    let { guild } = member;
		let user = options.getUser("which_user");
		if(!user) user = member.user;
		if(user.id != member.id){
			let newmember = guild.members.cache.get(user.id);
			if(!newmember) newmember = await guild.members.fetch(user.id).catch(e=>false) || false;
			if(!newmember) {
				user = member.user;
			} else {
				member = newmember;
			}
		}
    try {
      let customavatar = false;
      if (member && member.avatar) {
        customavatar = member.displayAvatarURL({
          dynamic: true,
          size: 4096
        })
      }
      let embed = new MessageEmbed()
      .setAuthor(handlemsg(client.la[ls].cmds.info.avatar.author, {
        usertag: user.tag
      }), user.displayAvatarURL({
        dynamic: true
      }), "https://discord.gg/milrato")
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      .addField("<:arrow:832598861813776394> PNG", `[\`LINK\`](${user.displayAvatarURL({format: "png"})})`, true)
      .addField("<:arrow:832598861813776394> JPEG", `[\`LINK\`](${user.displayAvatarURL({format: "jpg"})})`, true)
      .addField("<:arrow:832598861813776394> WEBP", `[\`LINK\`](${user.displayAvatarURL({format: "webp"})})`, true)
      .setURL(user.displayAvatarURL({
        dynamic: true
      }))
      .setFooter(client.getFooter(es))
      .setImage(user.displayAvatarURL({
        dynamic: true,
        size: 4096,
      }))
      if(customavatar)
        embed.setDescription(`**This User has a Custom Avatar too!**\n\n> [**\`Click here to get the LINK of it\`**](${customavatar})\n\n> **There is also:** \`${prefix}customavatar [@User]\``)
      message.reply({
        embeds: [embed]
      });
      
      interaction?.reply({ephemeral: true, embeds: [embed]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
  }
}
/*
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
