const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require('moment');
const { GetUser, GetGlobalUser, handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "serverbanner",
  aliases: ["sbanner"],
  category: "🔰 Info",
  description: "Get the Banner of the Server",
  usage: "serverbanner",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {   
      if(message.guild.banner) {
        let embed = new Discord.MessageEmbed()
          .setTitle(`**<:arrow:832598861813776394> SERVER BANNER:**`)
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setDescription(`[Download Link](${message.guild.bannerURL({size: 1024})})${message.guild.discoverySplash ? ` | [Link of Discovery Splash Image](${message.guild.discoverySplashURL({size: 4096})})`: ""}\n> This is the Image which is shown on the Top left Corner of this Server, where you see the Channels!`)
          .setImage(message.guild.bannerURL({size: 4096}))
        message.reply({embeds: [embed]})
      } else {
        let embed = new Discord.MessageEmbed()
          .setTitle(`<:no:833101993668771842> **This Server has no Banner!**`)
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        message.reply({embeds: [embed]})
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
