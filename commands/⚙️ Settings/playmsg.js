const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { dbEnsure } = require("../../handlers/functions")
module.exports = {
  name: "playmsg",
  category: "⚙️ Settings",
  aliases: ["toggleplaymsg", "toggle-playmsg", "pruning", "toggle-pruning"],
  cooldown: 10,
  usage: "playmsg",
  description: "Toggles if it should sends a Message with Buttons when a Song Starts! [Default: true]",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      await dbEnsure(client.settings, message.guild.id, {
        playmsg: true
      })
      
      const d = await client.settings.get(`${message.guild.id}.playmsg`);
      console.log(d)
      await client.settings.set(`${message.guild.id}.playmsg`, !d);
      
      return message.reply({embeds :[new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(`**Successfully __${!d ? "Enabled" : "Disabled"}__ the Play Message Sending**`)
        .setDescription(`**I will now${!d ? "" : " not"} send Messages with Buttons when a Song starts**`)
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

