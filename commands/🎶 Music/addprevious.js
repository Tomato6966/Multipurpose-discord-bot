const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const emoji = require(`../../botconfig/emojis.json`);
const ee = require(`../../botconfig/embed.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `addprevious`,
  category: `🎶 Music`,
  aliases: [`addp`, `addpre`, `addprevius`, `addprevios`],
  description: `Adds the previous song to the Queue again!`,
  usage: `addprevious`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": true
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
      //define the type
      let type = `song:youtube`;
      //if the previous was from soundcloud, then use type soundcloud
      if (player.queue.previous.uri?.includes(`soundcloud`)) type = `song:soundcloud`
      //adds/plays it
      playermanager(client, message, Array(player.queue.previous.uri), type);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["addprevious"]["variable1"]))
      ]});
    }
  }
};

