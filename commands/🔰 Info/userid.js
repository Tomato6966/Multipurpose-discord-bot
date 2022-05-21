const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { GetUser, GetGlobalUser } = require(`../../handlers/functions`)
module.exports = {
  name: "userid",
  aliases: ["uid"],
  category: "🔰 Info",
  description: "Get the ID of a USER | for mobile copy paste abilities",
  usage: "userid [@USER] [global/guild]",
  type: "userid",
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
          console.error(e)
          return message.reply(client.la[ls].common.usernotfound)
        }
      }else{
        user = message.author;
      }
      return message.reply(`${user.id}`);
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

