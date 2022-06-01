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
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({ephemeral: true, embed : [new MessageEmbed()
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
        return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
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
          interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
        } else {
          return interaction?.reply({ephemeral: true, embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(client.la[ls].common.nothing_playing)
          ]});
        }
        return
      }
      //if not in the same channel as the player, return Error
      if (channel.id !== player.voiceChannel)
        return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
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
          return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
        } else {
          //stop playing
          try {
            player.destroy();
          } catch {}
          return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
          
        }
        return
      }
      //skip the track
      player.stop();
      //send success message
      interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
        .setTitle(client.la[ls].cmds.music.skip.title2)
        .setColor(es.color)
      ]});

    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

