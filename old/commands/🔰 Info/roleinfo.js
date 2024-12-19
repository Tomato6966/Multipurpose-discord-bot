const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require('moment');
const { GetRole } = require(`${process.cwd()}/handlers/functions`)
const { swap_pages, handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "roleinfo",
  aliases: ["rinfo"],
  category: "🔰 Info",
  description: "Get information about a role",
  usage: "roleinfo [@Role/Id/Name]",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {   
      var role;
      if(args[0]){
        try{
          role = await GetRole(message, args)
        }catch (e){
          if(!e) return message.reply(client.la[ls].common.rolenotfound)
          return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
        }
      }else{
        role = message.member.roles.highest;
      }
      if(!role || role == null || role.id == null || !role.id) return message.reply(client.la[ls].common.rolenotfound)
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor(client.la[ls].cmds.info.roleinfo.author + " " + role.name, message.guild.iconURL({ dynamic: true }), "https://discord.gg/milrato")
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field1,`\`${role.name}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field2,`\`${role.id}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field3,`\`${role.hexColor}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field4, "\`"+moment(role.createdAt).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(role.createdAt).format("hh:mm:ss") + "\`",true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field5,`\`${role.rawPosition}\` / \`${message.guild.roles.highest.rawPosition}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field6,`\`${role.members.size} Members have it\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field7,`\`${role.hoist ? "✔️" : "❌"}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field8,`\`${role.mentionable ? "✔️" : "❌"}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field9,`${role.permissions.toArray().map(p=>`\`${p}\``).join(", ")}`)
        embeduserinfo.setColor(role.hexColor)
        embeduserinfo.setFooter(client.getFooter(es))
        //send the EMBED
        message.reply({embeds: [embeduserinfo]})

      
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
