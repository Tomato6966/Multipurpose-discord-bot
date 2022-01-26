const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "playmsg",
  category: "⚙️ Settings",
  aliases: ["toggleplaymsg", "toggle-playmsg", "pruning", "toggle-pruning"],
  cooldown: 10,
  usage: "playmsg",
  description: "Toggles if it should sends a Message with Buttons when a Song Starts! [Default: true]",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.settings.ensure(message.guild.id, {
        playmsg: true
      });
      
      client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "playmsg"), "playmsg");
      
      return message.reply({embeds :[new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["playmsg"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["playmsg"]["variable2"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["playmsg"]["variable3"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
