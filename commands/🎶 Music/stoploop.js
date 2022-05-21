const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
module.exports = {
  name: `stoploop`,
  category: `🎶 Music`,
  aliases: [`offloop`, `disableloop`],
  description: `Stops and disables the Loop`,
  usage: `stoploop`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queuesong",
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
      //Create the Embed
      let embed = new MessageEmbed()
        .setTitle(client.la[ls].cmds.music.loop.queue.disabled)
        .setColor(es.color)
        .setDescription(client.la[ls].cmds.music.loop.andsong);
      player.setTrackRepeat(false);
      player.setQueueRepeat(false);
      return message.reply({embeds : [embed]})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["loop"]["variable1"]))
      ]});
    }
  }
};

