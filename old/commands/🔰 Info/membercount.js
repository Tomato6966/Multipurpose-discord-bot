const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require("moment")
const { handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "membercount",
  aliases: ["members"],
  category: "🔰 Info",
  description: "Shows how many Members there are in this Server",
  usage: "membercount",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      await message.guild.members.fetch().catch(() => {});
      
        message.reply({embeds: [new Discord.MessageEmbed()
        .setAuthor(client.la[ls].cmds.info.membercount.title + " " +message.guild.name, message.guild.iconURL({
          dynamic: true
        }), "https://discord.com/api/oauth2/authorize?client_id=734513783338434591&permissions=8&scope=bot%20applications.commands")
        .setColor(es.color)
        .addField(client.la[ls].cmds.info.membercount.field1, "😀 \`" + message.guild.memberCount + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field2, "👤 \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field3, "🤖 \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)
        
        .addField(client.la[ls].cmds.info.membercount.field4, "🟢 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field4, "🟢 \`" + message.guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field4, "🟢 \`" + message.guild.members.cache.filter(member => member.user.bot && member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
        
        .addField(client.la[ls].cmds.info.membercount.field5, "🟠 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status == "idle").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field5, "🟠 \`" + message.guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence && member.presence.status == "idle").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field5, "🟠 \`" + message.guild.members.cache.filter(member => member.user.bot && member.presence && member.presence && member.presence.status == "idle").size + "\`", true)
        
        .addField(client.la[ls].cmds.info.membercount.field6, "🔴 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status == "dnd").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field6, "🔴 \`" + message.guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence && member.presence.status == "dnd").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field6, "🔴 \`" + message.guild.members.cache.filter(member => member.user.bot && member.presence && member.presence && member.presence.status == "dnd").size + "\`", true)
        
        .addField(client.la[ls].cmds.info.membercount.field7, ":black_circle:\`" + message.guild.members.cache.filter(member => !member.presence || member.presence && member.presence.status == "offline").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field7, ":black_circle:\`" + message.guild.members.cache.filter(member => !member.user.bot && (!member.presence || member.presence && member.presence.status == "offline")).size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field7, ":black_circle:\`" + message.guild.members.cache.filter(member => member.user.bot && (!member.presence || member.presence && member.presence.status == "offline")).size + "\`", true)
        .setTimestamp()
      ]});
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
