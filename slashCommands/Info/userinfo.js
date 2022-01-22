const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require('moment');
const { GetUser, GetGlobalUser, handlemsg } = require(`${process.cwd()}/handlers/functions`)
const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
function trimArray(arr, maxLen = 25) {
  if ([...arr.values()].length > maxLen) {
    const len = [...arr.values()].length - maxLen;
    arr = [...arr.values()].sort((a, b) => b?.rawPosition - a.rawPosition).slice(0, maxLen);
    arr.map(role => `<@&${role.id}>`)
    arr.push(`${len} more...`);
  }
  return arr.join(", ");
}
const statuses = {
  "online" : "🟢",
  "idle" : "🟠",
  "dnd" : "🔴",
  "offline" : "⚫️",
}
module.exports = {
  name: "userinfo", //the command name for the Slash Command
  description: "Gives you information about a User", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		{"User": { name: "which_user", description: "From Which User do you want to get Information from?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    try{
		//things u can directly access in an interaction!
		let { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
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
		let es = client.settings.get(guild.id, "embed");let ls = client.settings.get(guild.id, "language")
		try {   
		  let banner = false;
		  let customavatar = false;
		  if(!user || user == null || user.id == null || !user.id) return interaction?.reply({content: client.la[ls].common.usernotfound, ephemeral: true})
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
		  try{
			await user.fetch().then(user => {
			  if(user.banner){
				banner = user.bannerURL({
				  dynamic: true,
				  size: 4096,
				})
			  }
			}).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
		  }catch (e) {
			console.log(e.stack ? String(e.stack).grey : String(e).grey)
		  }
		  try{
			const roles = member.roles;
			const userFlags = member.user.flags.toArray();
			const activity = member.presence ? member.presence.activities[0] : {
			  type: "CUSTOM",
			  emoji: {
				name: "❌"
			  },
			  state : "OFFLINE - No activity"
			};
			//create the EMBED
			const embeduserinfo = new MessageEmbed()
			embeduserinfo.setThumbnail(customavatar ? customavatar : member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			embeduserinfo.setAuthor(handlemsg(client.la[ls].cmds.info.userinfo.author, { usertag: member.user.tag}), member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/milrato")
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field1,`> <@${member.user.id}>\n\`${member.user.tag}\``,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field2,`> \`${member.id}\``,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field3,`> [\`Link to avatar\`](${member.user.displayAvatarURL({ format: "png" })})${customavatar ? `\n\n> [\`Link to Custom Avatar\`](${customavatar})`: ""}`,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field4, "> \`"+moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(member.user.createdTimestamp).format("hh:mm:ss") + "\`",true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field5, "> \`"+moment(member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(member.joinedTimestamp).format("hh:mm:ss")+ "\`",true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field6,`> \`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field7,`> \`${statuses[member.presence ? member.presence.status : "offline"]} ${member.presence ? member.presence.status : "offline"}\``,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field8,`> ${roles.size == 0 ? client.la[ls].cmds.info.userinfo.noroles : member.roles.highest.id === message.guild.id ? client.la[ls].cmds.info.userinfo.noroles : member.roles.highest}`,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field9,`> \`${member.user.bot ? "✔️" : "❌"}\``,true)
			var userstatus = client.la[ls].cmds.info.userinfo.nostatus;
			if(activity){
			  if(activity.type === "CUSTOM"){
				let emoji = `${activity.emoji ? activity.emoji?.id  ? `<${activity.emoji?.animated ? "a": ""}:${activity.emoji?.name}:${activity.emoji?.id }>`: activity.emoji?.name : ""}`
				userstatus = `${emoji} \`${activity.state || client.la[ls].cmds.info.userinfo.nostatus}\``
			  }
			  else{
				userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
			  }
			}
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field10,`> ${userstatus}`)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field11,`> ${member.permissions.toArray().includes("ADMINISTRATOR") ? "\`ADMINISTRATOR\`": member.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(p=>`\`${p}\``).join("︲")}`.substr(0, 2048))
			embeduserinfo.addField(handlemsg(client.la[ls].cmds.info.userinfo.field12, { rolesize: roles.cache.size}), roles.cache.size < 25 ? [...roles.cache.values()].sort((a, b) => b?.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : client.la[ls].cmds.info.userinfo.noroles)
			embeduserinfo.setColor(es.color)
			embeduserinfo.setFooter(client.getFooter(es))
			if(banner) embeduserinfo.setImage(banner)
			//send the EMBED
			interaction?.reply({embeds: [embeduserinfo], ephemeral: true})
		  }catch (e) {
			console.log(e.stack ? String(e.stack).grey : String(e).grey)
			const userFlags = user.flags?.toArray();
			//create the EMBED
			const embeduserinfo = new MessageEmbed()
			embeduserinfo.setThumbnail(customavatar ? customavatar : user.displayAvatarURL({ dynamic: true, size: 512 }))
			embeduserinfo.setAuthor(handlemsg(client.la[ls].cmds.info.userinfo.author, { usertag: user.tag}), user.displayAvatarURL({ dynamic: true }), "https://discord.gg/milrato")
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field1,`<@${user.id}>\n\`${user.tag}\``,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field2,`\`${user.id}\``,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field3,`[\`Link to avatar\`](${user.displayAvatarURL({ format: "png" })})`,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field4, "\`"+moment(user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(user.createdTimestamp).format("hh:mm:ss") + "\`",true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field6,`\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``,true)
			embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field9,`\`${user.bot ? "✔️" : "❌"}\``,true)
			embeduserinfo.setColor(es.color)
			embeduserinfo.setFooter(client.getFooter(es))
			if(banner) embeduserinfo.setImage(banner)
			//send the EMBED
			interaction?.reply({embeds: [embeduserinfo], ephemeral: true})
		  }
		  
		} catch (e) {
		  console.log(String(e.stack).grey.bgRed)
		}
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention Him / Milrato Development, when using this Code!
  * @INFO
*/
