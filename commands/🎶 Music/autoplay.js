const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`../../handlers/functions`);
module.exports = {
  name: `autoplay`,
  category: `🎶 Music`,
  aliases: [`ap`, `toggleauto`, `toggleautoplay`, `toggleap`],
  description: `Toggles Autoplay on/off`,
  usage: `autoplay`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queue",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //toggle autoplay
      player.set(`autoplay`, !player.get(`autoplay`))
      if(player.get(`autoplay`)){
        try{
          message.react("♾").catch(() => null)
          message.react("950884027320135711").catch(() => null)
        }catch{ }
      }else {
        try{
          message.react("♾").catch(() => null)
          message.react("951013282607685632").catch(() => null)
        }catch{  }
      }
      //Send Success Message
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es. color)
        .setTitle(eval(client.la[ls]["cmds"]["music"]["autoplay"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["music"]["autoplay"]["variable2"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["autoplay"]["variable3"]))
      ]});
    }
  }
};

