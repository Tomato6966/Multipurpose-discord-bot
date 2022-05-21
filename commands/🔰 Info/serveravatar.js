const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const moment = require("moment")
const { swap_pages, handlemsg } = require(`../../handlers/functions`)
module.exports = {
  name: "serveravatar",
  aliases: ["savatar", "guildavatar", "gavatar"],
  category: "🔰 Info",
  description: "Shows the ServerAvatar",
  usage: "serveravatar",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      message.reply({embeds: [new Discord.MessageEmbed()
      .setAuthor(handlemsg(client.la[ls].cmds.info.serveravatar.author, { servername: message.guild.name }), message.guild.iconURL({dynamic: true}), "http://discord.gg/7PdChsBGKd")
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      .addField("<a:arrow:943027097348227073> PNG",`[\`LINK\`](${message.guild.iconURL({format: "png"})})`, true)
      .addField("<a:arrow:943027097348227073> JPEG",`[\`LINK\`](${message.guild.iconURL({format: "jpg"})})`, true)
      .addField("<a:arrow:943027097348227073> WEBP",`[\`LINK\`](${message.guild.iconURL({format: "webp"})})`, true)
      .setURL(message.guild.iconURL({
        dynamic: true
      }))
      .setFooter(client.getFooter(es))
      .setImage(message.guild.iconURL({
        dynamic: true, size: 256,
      }))
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

