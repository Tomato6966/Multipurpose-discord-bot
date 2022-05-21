const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `loop`,
  category: `🎶 Music`,
  aliases: [`repeat`, `l`],
  description: `Repeats the current song`,
  usage: `loopsong`,
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
      //if no args send error
      if (!args[0])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].cmds.music.loop.errortitle)
          .setDescription(client.la[ls].cmds.music.loop.errordescription)
        ]});
      //if arg is somehow song / track
      if (args[0].toLowerCase() === `song` || args[0].toLowerCase() === `track` || args[0].toLowerCase() === `s` || args[0].toLowerCase() === `t`) {
        //Create the Embed
        let embed = new MessageEmbed()
          .setTitle(player.trackRepeat ? client.la[ls].cmds.music.loop.track.disabled : client.la[ls].cmds.music.loop.track.enabled)
          .setColor(es.color)

        //If Queue loop is enabled add embed info + disable it
        if (player.queueRepeat) {
          embed.setDescription(client.la[ls].cmds.music.loop.andqueue);
          player.setQueueRepeat(false);
        }
        //toggle track repeat to the reverse old mode
        player.setTrackRepeat(!player.trackRepeat);
        //Send Success Message
        return message.reply({embeds : [embed]})
      }
      //if input is queue
      else if (args[0].toLowerCase() === `queue` || args[0].toLowerCase() === `qu` || args[0].toLowerCase() === `q`) {
        //Create the Embed
        let embed = new MessageEmbed()
          .setTitle(player.queueRepeat ? client.la[ls].cmds.music.loop.queue.disabled : client.la[ls].cmds.music.loop.queue.enabled)
          .setColor(es.color)

        //If Track loop is enabled add embed info + disable it
        if (player.trackRepeat) {
          embed.setDescription(client.la[ls].cmds.music.loop.andsong);
          player.setTrackRepeat(false);
        }
        //toggle queue repeat to the reverse old mode
        player.setQueueRepeat(!player.queueRepeat);
        //Send Success Message
        return message.reply({embeds : [embed]});
      } else if(args[0].toLowerCase() === `off` || args[0].toLowerCase() === `stop`){
        //Create the Embed
        let embed = new MessageEmbed()
          .setTitle(client.la[ls].cmds.music.loop.queue.disabled)
          .setColor(es.color)
          .setDescription(client.la[ls].cmds.music.loop.andsong);
        player.setTrackRepeat(false);
        player.setQueueRepeat(false);
        return message.reply({embeds : [embed]});
      }
      //if no valid inputs, send error
      else {
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].cmds.music.loop.errortitle)
          .setDescription(client.la[ls].cmds.music.loop.errordescription)
        ]});
      }
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

