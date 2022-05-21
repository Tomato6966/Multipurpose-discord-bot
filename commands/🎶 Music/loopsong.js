const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `loopsong`,
  category: `🎶 Music`,
  aliases: [`repeatsong`, `ls`, `rs`, `repeattrack`, `looptrack`, `lt`, `rt`],
  description: `Repeats the current song`,
  usage: `loopsong`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
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
      //define the Embed
      const embed = new MessageEmbed()
        .setTitle(player.trackRepeat ? client.la[ls].cmds.music.loop.track.disabled : client.la[ls].cmds.music.loop.track.enabled)
        .setColor(es.color)

      //if there is active queue loop, disable it + add embed information
      if (player.queueRepeat) {
        embed.setDescription(client.la[ls].cmds.music.loop.andqueue);
        player.setQueueRepeat(false);
      }
      //set track repeat to revers of old track repeat
      player.setTrackRepeat(!player.trackRepeat);
      //send informational message
      return message.reply({embeds :[embed]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["loopsong"]["variable1"]))
      ]});
    }
  }
};

