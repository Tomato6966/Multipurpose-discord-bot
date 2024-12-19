const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require('moment');
const { GetUser, GetGlobalUser } = require(`${process.cwd()}/handlers/functions`)
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "permissions",
  aliases: ["perms"],
  category: "🔰 Info",
  description: "Get permissions information about a user",
  usage: "permissions [@USER]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
		try {   
      var user;
      if(args[0]){
        try{
          user = await GetUser(message, args)
        }catch (e){
          if(!e) return message.reply(client.la[ls].common.usernotfound)
          return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
        }
      }else{
        user = message.author;
      }
      if(!user || user == null || user.id == null || !user.id) return message.reply(client.la[ls].common.usernotfound)
      try{
        const member = message.guild.members.cache.get(user.id);
        let guildowner = await message.guild.fetchOwner();
        
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor(handlemsg(client.la[ls].cmds.info.permissions.from, {usertag: member.user.tag}), member.user.displayAvatarURL({ dynamic: true }), "https://discord.com/api/oauth2/authorize?client_id=734513783338434591&permissions=8&scope=bot%20applications.commands")
        embeduserinfo.setDescription(`>>> ${member.permissions.toArray().includes("ADMINISTRATOR") ? "\`ADMINISTRATOR\`": member.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(p=>`\`${p}\``).join("︲")}`.substring(0, 2048))
        embeduserinfo.setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        embeduserinfo.setFooter(client.getFooter(es))
        //send the EMBED
        if(guildowner == member.id) embeduserinfo.setDescription(`>>> \`ALL\` --> \`SERVEROWNER\``)
        message.reply({embeds: [embeduserinfo]})
      }catch (e){
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor(handlemsg(client.la[ls].cmds.info.permissions.from, {usertag: member.user.tag}), member.user.displayAvatarURL({ dynamic: true }), "https://discord.com/api/oauth2/authorize?client_id=734513783338434591&permissions=8&scope=bot%20applications.commands")
        embeduserinfo.addField(handlemsg(client.la[ls].cmds.info.permissions.from2),`${member.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(p=>`\`${p}\``).join(", ")}`)
        embeduserinfo.setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        embeduserinfo.setFooter(client.getFooter(es))
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
