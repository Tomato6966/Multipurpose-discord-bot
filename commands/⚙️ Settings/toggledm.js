const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
const { dbEnsure } = require("../../handlers/functions");
module.exports = {
  name: "toggledm",
  aliases: ["toggledmmessage", "toggledmmsg"],
  category: "⚙️ Settings",
  description: "Toggles if the Bot should send you dm messages",
  usage: "toggledm",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      await dbEnsure(client.settings, message.author?.id, {
        dm: true
      })
      const d = await client.settings.get(`${message.author?.id}.dm`)
      await client.settings.set(message.author?.id+".dm", !d);
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(`:white_check_mark: ${!d ? "Enabled": "Disabled"} Dm messages`)
        .setDescription(`${!d ? "I will now send you DMS after the COMMANDS, if needed" : "I will not send you DMS after the COMMANDS"}`.substring(0, 2048))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledm"]["variable2"]))
      ]});
    }
  }
};

