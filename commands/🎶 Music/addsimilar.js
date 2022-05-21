const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`../../handlers/functions`);
module.exports = {
  name: `addsimilar`,
  category: `🎶 Music`,
  aliases: [`adds`, `addrelated`, `addr`],
  description: `Adds a similar song of the current Track to the Queue!`,
  usage: `addsimilar`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  type: "queue",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      playermanager(client, message, Array(`https://www.youtube.com/watch?v=${player.queue.current.identifier}&list=RD${player.queue.current.identifier}`), `similar:add`);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["addsimilar"]["variable1"]))
      ]});
    }
  }
};

