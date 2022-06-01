const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `unshuffle`,
  category: `🎶 Music`,
  aliases: [`unmix`, `oldshuffle`, `undoshuffle`, `oldqueue`, `us`],
  description: `Unshuffles the Queue - Restores the old Queue`,
  usage: `unshuffle`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
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
      //if no shuffle happened, return error
      if (!player.get(`beforeshuffle`))
        return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["unshuffle"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["unshuffle"]["variable2"]))
        ]});
      //clear teh Queue
      player.queue.clear();
      //now add every old song again
      for (const track of player.get(`beforeshuffle`))
        player.queue.add(track);
      //return success message
      return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["music"]["unshuffle"]["variable3"]))
        .setColor(es.color)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

