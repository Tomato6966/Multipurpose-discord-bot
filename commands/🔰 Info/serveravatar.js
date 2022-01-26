const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require("moment")
const { swap_pages, handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "serveravatar",
  aliases: ["savatar", "guildavatar", "gavatar"],
  category: "🔰 Info",
  description: "Shows the ServerAvatar",
  usage: "serveravatar",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      message.reply({embeds: [new Discord.MessageEmbed()
      .setAuthor(handlemsg(client.la[ls].cmds.info.serveravatar.author, { servername: message.guild.name }), message.guild.iconURL({dynamic: true}), "https://discord.gg/milrato")
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      .addField("<:arrow:832598861813776394> PNG",`[\`LINK\`](${message.guild.iconURL({format: "png"})})`, true)
      .addField("<:arrow:832598861813776394> JPEG",`[\`LINK\`](${message.guild.iconURL({format: "jpg"})})`, true)
      .addField("<:arrow:832598861813776394> WEBP",`[\`LINK\`](${message.guild.iconURL({format: "webp"})})`, true)
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
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
