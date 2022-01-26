const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "defaultvolume",
  category: "⚙️ Settings",
  aliases: ["default-volume", "defaultvol", "default-vol"],
  cooldown: 10,
  usage: "defaultvolume <Volume>",
  description: "Defines the Default Volume on 1. Track start [Default: 15]",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.settings.ensure(message.guild.id, {
        defaultvolume: 15
      });
      if(!args[0]){
        return message.reply({embeds : [new MessageEmbed()
          .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable2"]))
        ]});
      }
      let volume = args[0];
      if(isNaN(volume)){
        return message.reply({embeds : [new MessageEmbed()
          .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable4"]))
        ]});
      }
      if(Number(volume) > 150 || Number(volume) < 1){
        return message.reply({embeds : [new MessageEmbed()
          .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable6"]))
        ]});
      }
      client.settings.set(message.guild.id, Number(volume), "defaultvolume");
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable7"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable8"]))
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
