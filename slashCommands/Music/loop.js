const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `loop`,
  description: `Repeats the current Song/Queue`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  options: [ 
    {"StringChoices": { name: "looptype", description: "What Loop do you want to do?", required: true, choices: [["Song Loop", "song"], ["Queue Loop", "queue"]] }},
  ],
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
      let args = [interaction?.options.getString("looptype")]
      //if no args send error
      if (!args[0])
        return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].cmds.music.loop.errortitle)
          .setDescription(client.la[ls].cmds.music.loop.errordescription)
        ]});
      //if arg is somehow song / track
      if (args[0].toLowerCase() === `song`) {
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
        return interaction?.reply({embeds : [embed]})
      }
      //if input is queue
      else {
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
        return interaction?.reply({ephemeral: true, embeds : [embed]});
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

