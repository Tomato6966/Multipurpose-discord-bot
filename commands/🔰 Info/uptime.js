const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  duration
} = require(`../../handlers/functions`)
const moment = require("moment")
module.exports = {
  name: "uptime",
  category: "🔰 Info",
  aliases: [""],
  usage: "uptime",
  description: "Returns the duration on how long the Bot is online",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let date = new Date()
      let timestamp = date.getTime() - Math.floor(client.uptime);
      message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["info"]["uptime"]["variable1"]))
        .addField(`🤖 __Bot__`, `\n> **Uptime:** <t:${Math.floor(timestamp/1000)}:R>\n> **Launch:** <t:${Math.floor(timestamp/1000)}:F>`)
        .addField(`<:online:970050105338130433> __Database / System__`, `\n> **Uptime:** <t:${Math.floor(Date.now() / 1000 - require("os").uptime())}:R>\n> **Launch:** <t:${Math.floor(Date.now() / 1000 - require("os").uptime())}:F>`)
        ]}
        );
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

