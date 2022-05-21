const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { dbEnsure } = require("../../handlers/functions")
module.exports = {
  name: "defaultequalizer",
  category: "⚙️ Settings",
  aliases: ["default-equalizer", "defaulteq", "default-eq"],
  cooldown: 10,
  usage: "equalizer",
  description: "Toggles if it should use the Default Equalizer on 1. Track start or not! [Default: false]",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      await dbEnsure(client.settings, message.guild.id, {
        defaulteq: false,
      })
      const d = await client.settings.get(`${message.guild.id}.defaulteq`);
      await client.settings.set(`${message.guild.id}.defaulteq`, !d);
      
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(`**Successfully __${!d ? "Enabled" : "Disabled"}__ the Default Equalizer = ON**`)
        .setDescription(`**I will now${!d ? "" : " not"} use Equalizer = ON on 1. Track start!**`)
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["defaultequalizer"]["variable3"]))
      ]});
    }
  }
}

