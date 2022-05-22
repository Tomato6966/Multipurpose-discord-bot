const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { dbEnsure } = require("../../handlers/functions")
module.exports = {
  name: "defaultvolume",
  category: "⚙️ Settings",
  aliases: ["default-volume", "defaultvol", "default-vol"],
  cooldown: 10,
  usage: "defaultvolume <Volume>",
  description: "Defines the Default Volume on 1. Track start [Default: 15]",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      await dbEnsure(client.settings, message.guild.id, {
        defaultvolume: 30
      })
      if(!args[0]){
        return message.reply({embeds : [new MessageEmbed()
          .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable1"]))
          .setDescription(`**The Current Default Volume is: \`${GuildSettings.defaultvolume}%\`**`)
        ]});
      }
      let volume = args[0];
      if(isNaN(volume)){
        return message.reply({embeds : [new MessageEmbed()
          .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable3"]))
          .setDescription(`*It must be a **Number***\n**The Current Default Volume is: \`${GuildSettings.defaultvolume}%\`**`)
        ]});
      }
      if(Number(volume) > 150 || Number(volume) < 1){
        return message.reply({embeds : [new MessageEmbed()
          .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultvolume"]["variable5"]))
          .setDescription(`*It must be between \`150\` and \`1\`*\n**The Current Default Volume is: \`${GuildSettings.defaultvolume}%\`**`)
        ]});
      }
      await client.settings.set(`${message.guild.id}.defaultvolume`, Number(volume));
      
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(`**Successfully set the new Default Volume to: \`${volume}%\`**`)
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

