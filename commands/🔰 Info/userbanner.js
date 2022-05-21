const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const moment = require('moment');
const { GetUser, GetGlobalUser, handlemsg } = require(`../../handlers/functions`)
module.exports = {
  name: "userbanner",
  aliases: ["ubanner"],
  category: "🔰 Info",
  description: "Get the Banner of a user",
  usage: "userbanner [@USER] [global/guild]",
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
      
      //create the EMBED
      const embeduserinfo = new MessageEmbed().setColor(es.color).setTitle(`Banner of ${user.tag}`)
      let banner = false;
      try{
        await user.fetch().then(user => {
          if(user.banner){
            banner = user.bannerURL({
              dynamic: true,
              size: 4096,
            })
          }
        }).catch(() => null)
      }catch (e) {
        console.error(e)
      }
      if(banner) {
        embeduserinfo.setImage(banner)
        embeduserinfo.setColor(user.hexAccentColor ? user.hexAccentColor : es.color)
        embeduserinfo.setDescription(`[Download the Banner of **${user.tag}**](${banner}) <@${user.id}>`)
      } else {
        embeduserinfo.setColor(user.hexAccentColor ? user.hexAccentColor : es.color)
        embeduserinfo.setTitle(`:x: **Has no Banner!**`)
      }
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

