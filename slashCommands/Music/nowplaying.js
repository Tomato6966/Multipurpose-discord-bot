const {
  MessageEmbed,
  MessageAttachment
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `nowplaying`,
  description: `Shows detailled information about the current Song`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
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
      //if no current song return error
      if (!player.queue.current)
        return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["nowplaying"]["variable1"]))
        ]});
        const embed = new MessageEmbed()
          .setAuthor(`Current song playing:`, message.guild.iconURL({
            dynamic: true
          }))
        .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setURL(player.queue.current.uri)
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["music"]["nowplaying"]["variable2"]))
        .addField(`${emoji?.msg.time} Progress: `, createBar(player))
        .addField(`${emoji?.msg.time} Duration: `, `\`${format(player.queue.current.duration).split(" | ")[0]}\` | \`${format(player.queue.current.duration).split(" | ")[1]}\``, true)
        .addField(`${emoji?.msg.song_by} Song By: `, `\`${player.queue.current.author}\``, true)
        .addField(`${emoji?.msg.repeat_mode} Queue length: `, `\`${player.queue.length} Songs\``, true)
        .setFooter(client.getFooter(`Requested by: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
          dynamic: true
        })))
      //Send Now playing Message
      return interaction?.reply({ephemeral: true, embeds :[embed]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

