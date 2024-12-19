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
  name: "userinfo",
  aliases: ["uinfo"],
  category: "🔰 Info",
  description: "Get information about a user",
  usage: "userinfo [@USER] [global/guild]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {   
      var user;
      if(args[0]){
        try{
          if(args[1] && args[1].toLowerCase() == "global"){
            args.pop()
            user = await GetGlobalUser(message, args)
          }else {
            user = await GetUser(message, args)
          }
        }catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          return message.reply(client.la[ls].common.usernotfound)
        }
      }else{
        user = message.author;
      }
      let banner = false;
      let customavatar = false;
      if(!user || user == null || user.id == null || !user.id) return message.reply(client.la[ls].common.usernotfound)
      try {
        let member = message.guild.members.cache.get(user.id);
        if (!member) await message.guild.members.fetch(user.id).catch(() => {}) || false;
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
        }).catch(() => {})
      }catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
      }
      try{
        let member = message.guild.members.cache.get(user.id);
        if(!member) await message.guild.members.fetch(user.id).catch(() => {}) || false;
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
        embeduserinfo.addField(client.la[ls].cmds.info.userinfo.field11,`> ${member.permissions.toArray().includes("ADMINISTRATOR") ? "\`ADMINISTRATOR\`": member.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(p=>`\`${p}\``).join("︲")}`.substring(0, 2048))
        embeduserinfo.addField(handlemsg(client.la[ls].cmds.info.userinfo.field12, { rolesize: roles.cache.size}), roles.cache.size < 25 ? [...roles.cache.values()].sort((a, b) => b?.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : client.la[ls].cmds.info.userinfo.noroles)
        embeduserinfo.setColor(es.color)
        embeduserinfo.setFooter(client.getFooter(es))
        if(banner) embeduserinfo.setImage(banner)
        //send the EMBED
        message.reply({embeds: [embeduserinfo]})
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
        message.reply({embeds: [embeduserinfo]})
      }
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
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
