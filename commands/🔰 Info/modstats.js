const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  getRandomInt, GetGlobalUser, GetUser, handlemsg, dbEnsure
} = require(`../../handlers/functions`)
module.exports = {
  name: "modstats",
  category: "🔰 Info",
  aliases: ["adminstats"],
  usage: "modstats [@USER]",
  description: "Shows the Admin Stats of a Mod/Admin, how many cmds he has executed etc.",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
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
          if(!e) return message.reply(client.la[ls].common.usernotfound)
          return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
        }
      }else{
        user = message.author;
      }
      if(!user || user == null || user.id == null || !user.id) return message.reply(client.la[ls].common.usernotfound)

      await dbEnsure(client.stats, message.guild.id + user.id, {
        ban: [],
        kick: [],
        mute: [],
        ticket: [],
        says: [],
        warn: [],
      })
      const stats = await client.stats.get(message.guild.id + user.id);
      
      message.reply({embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
        .addField(`Bans [7]`, "**`" + stats.ban.filter(item => { var date = new Date(); date.setDate(date.getDate() - 7); return date <= Number(item); }).length + "`**", true)
        .addField(`Bans [30]`, "**`" + stats.ban.filter(item => { var date = new Date(); date.setDate(date.getDate() - 30); return date <= Number(item); }).length + "`**", true)
        .addField(`Bans [All]`, "**`" + stats.ban.length + "`**", true)
       
        .addField(`Kicks [7]`, "**`" + stats.kick.filter(item => { var date = new Date(); date.setDate(date.getDate() - 7); return date <= Number(item); }).length + "`**", true)
        .addField(`Kicks [30]`, "**`" + stats.kick.filter(item => { var date = new Date(); date.setDate(date.getDate() - 30); return date <= Number(item); }).length + "`**", true)
        .addField(`Kicks [All]`, "**`" + stats.kick.length + "`**", true)
       
        .addField(`Mutes [7]`, "**`" + stats.mute.filter(item => { var date = new Date(); date.setDate(date.getDate() - 7); return date <= Number(item); }).length + "`**", true)
        .addField(`Mutes [30]`, "**`" + stats.mute.filter(item => { var date = new Date(); date.setDate(date.getDate() - 30); return date <= Number(item); }).length + "`**", true)
        .addField(`Mutes [All]`, "**`" + stats.mute.length + "`**", true)
       
        .addField(`Tickets [7]`, "**`" + stats.ticket.filter(item => { var date = new Date(); date.setDate(date.getDate() - 7); return date <= Number(item); }).length + "`**", true)
        .addField(`Tickets [30]`, "**`" + stats.ticket.filter(item => { var date = new Date(); date.setDate(date.getDate() - 30); return date <= Number(item); }).length + "`**", true)
        .addField(`Tickets [All]`, "**`" + stats.ticket.length + "`**", true)
       
        .addField(`Says [7]`, "**`" + stats.says.filter(item => { var date = new Date(); date.setDate(date.getDate() - 7); return date <= Number(item); }).length + "`**", true)
        .addField(`Says [30]`, "**`" + stats.says.filter(item => { var date = new Date(); date.setDate(date.getDate() - 30); return date <= Number(item); }).length + "`**", true)
        .addField(`Says [All]`, "**`" + stats.says.length + "`**", true)
        
        .addField(`Warns [7]`, "**`" + stats.warn.filter(item => { var date = new Date(); date.setDate(date.getDate() - 7); return date <= Number(item); }).length + "`**", true)
        .addField(`Warns [30]`, "**`" + stats.warn.filter(item => { var date = new Date(); date.setDate(date.getDate() - 30); return date <= Number(item); }).length + "`**", true)
        .addField(`Warns [All]`, "**`" + stats.warn.length + "`**", true)
        .addField("\u200b", client.la[ls].cmds.info.modstats.desc)
        .setAuthor(client.getAuthor(`${client.la[ls].cmds.info.modstats.about} ${user.tag}`, user.displayAvatarURL({dynamic: true, size: 512})))
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

