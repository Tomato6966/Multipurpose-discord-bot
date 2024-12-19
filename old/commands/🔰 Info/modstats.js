const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  getRandomInt, GetGlobalUser, GetUser, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "modstats",
  category: "🔰 Info",
  aliases: ["adminstats"],
  usage: "modstats [@USER]",
  description: "Shows the Admin Stats of a Mod/Admin, how many cmds he has executed etc.",
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
          if(!e) return message.reply(client.la[ls].common.usernotfound)
          return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
        }
      }else{
        user = message.author;
      }
      if(!user || user == null || user.id == null || !user.id) return message.reply(client.la[ls].common.usernotfound)

      client.stats.ensure(message.guild.id + user.id, {
        ban: [],
        kick: [],
        mute: [],
        ticket: [],
        says: [],
        warn: [],
      })

      message.reply({embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_1"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable1"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_2"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable2"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_3"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable3"]), true)
       
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_4"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable4"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_5"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable5"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_6"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable6"]), true)
       
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_7"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable7"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_8"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable8"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_9"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable9"]), true)
       
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_10"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable10"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_11"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable11"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_12"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable12"]), true)
       
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_13"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable13"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_14"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable14"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_15"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable15"]), true)
        
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_16"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable16"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_17"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable17"]), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["modstats"]["variablex_18"]), eval(client.la[ls]["cmds"]["info"]["modstats"]["variable18"]), true)
        .addField("\u200b", client.la[ls].cmds.info.modstats.desc)
        .setAuthor(`${client.la[ls].cmds.info.modstats.about} ${user.tag}`, user.displayAvatarURL({dynamic: true, size: 512}))
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
