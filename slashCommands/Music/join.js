const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `join`,
  description: `Summons the Bot in your Channel`,
  parameters: {
    "type": "radio",
    "activeplayer": false,
    "previoussong": false
  },
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({ephemeral: true, embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      var {
        channel
      } = message.member.voice;
      if (!channel)
        return interaction?.reply({ephemeral: true, embed : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.join_vc)
        ]});
      //if no args return error
      var player = client.manager.players.get(message.guild.id);
      if (player) {
        var vc = player.voiceChannel;
        var voiceChannel = message.guild.channels.cache.get(player.voiceChannel);
        return interaction?.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.wrong_vc)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable1"]))
        ]});
      }
      //create the player
      player = await client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: config.settings.selfDeaf,
      });
      //join the chanel
      if (player.state !== "CONNECTED") {
        await player.connect();
        await player.stop();
        return interaction?.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle(client.la[ls].cmds.music.join.title)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable2"]))]
        });
      } else {
        return interaction?.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.wrong_vc)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable3"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

