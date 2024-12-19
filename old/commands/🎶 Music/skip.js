const {
  MessageEmbed,
  MessageButton,
  MessageActionRow
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  autoplay,
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "skip",
  category: "🎶 Music",
  aliases: ["voteskip", "s", "vs"],
  description: "Skips the current song",
  usage: "skip",
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //get the channel instance from the Member
      const {
        channel
      } = message.member.voice;
      //if the member is not in a channel, return
      if (!channel)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.join_vc)
         ]} );
      //get the player instance
      const player = client.manager.players.get(message.guild.id);
      //if no player available return aka not playing anything
      if (!player) {
        if (message.guild.me.voice.channel) {
          try {
            message.guild.me.voice.disconnect();
          } catch {}
          message.reply({embeds : [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
          return message.react("⏹️").catch((e) => {})
        } else {
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(client.la[ls].common.nothing_playing)
          ]});
        }
        return
      }
      //if not in the same channel as the player, return Error
      if (channel.id !== player.voiceChannel)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.wrong_vc)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["skip"]["variable1"]))
        ]});
      //if ther is nothing more to skip then stop music and leave the Channel
      if (player.queue.size == 0) {
        //if its on autoplay mode, then do autoplay before leaving...
        if (player.get("autoplay")) return autoplay(client, player, "skip");
        if (message.guild.me.voice.channel) {
          try {
            message.guild.me.voice.disconnect();
          } catch {}
          try {
            player.destroy();
          } catch {}
          message.reply({embeds : [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
          return message.react("⏹️").catch((e) => {})
        } else {
          //stop playing
          try {
            player.destroy();
          } catch {}
          message.reply({embeds : [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
          //React with the emoji
          return message.react("⏹️").catch((e) => {})
        }
        return
      }
      //skip the track
      player.stop();
      //send success message
      
      message.reply({embeds : [new MessageEmbed()
        .setTitle(client.la[ls].cmds.music.skip.title2)
        .setColor(es.color)
      ]});

      return message.react("⏭").catch((e) => {})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["skip"]["variable2"]))
      ]});
    }
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
