const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "customavatar",
  description: "Get the Custom avatar of an Member",
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
		const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
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
    let customavatar = false;
    try {
      if (member && member.avatar) {
        customavatar = member.displayAvatarURL({
          dynamic: true,
          size: 4096
        })
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
    if (customavatar) {
      let embed = new MessageEmbed()
        .setAuthor(handlemsg(client.la[ls].cmds.info.avatar.author, {
          usertag: user.tag
        }), customavatar, "https://discord.gg/milrato")
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .addField("<:arrow:832598861813776394> PNG", `[\`LINK\`](${customavatar})`, true)
        .addField("<:arrow:832598861813776394> JPEG", `[\`LINK\`](${customavatar.replace("png", "jpg").replace("gif", "jpg")})`, true)
        .addField("<:arrow:832598861813776394> WEBP", `[\`LINK\`](${customavatar.replace("png", "webp").replace("gif", "webp")})`, true)
        .setURL(customavatar)
        .setFooter(client.getFooter(es))
        .setImage(customavatar);
      interaction?.reply({
        embeds: [embed], ephemeral: true
      });
    } else {
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
          size: 512,
        }))
        .setDescription(`**Member has no Custom Avatar / unable to find the Member, in this Server**\n> *I am displaying, his normal AVATAR!*`)
      interaction?.reply({
        embeds: [embed], ephemeral: true
      });
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
