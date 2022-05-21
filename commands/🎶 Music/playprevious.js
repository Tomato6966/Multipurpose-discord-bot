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
  name: `playprevious`,
  category: `🎶 Music`,
  aliases: [`pp`, `ppre`, `playprevius`, `playprevios`],
  description: `Plays the Previous played Song and skips the current Song`,
  usage: `playprevious`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": true
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //define the type
      let type = `skiptrack:youtube`;
      //if the previous was from soundcloud, then use type soundcloud
      if (player.queue.previous.uri?.includes(`soundcloud`)) type = `skiptrack:soundcloud`
      //plays it
      if (type != "skiptrack:soundcloud") message.react("840260133686870036").catch(() => null)
      else message.react("840260133686870036").catch(() => null)
      playermanager(client, message, Array(player.queue.previous.uri), type);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["playprevious"]["variable1"]))
      ]});
    }
  }
};

