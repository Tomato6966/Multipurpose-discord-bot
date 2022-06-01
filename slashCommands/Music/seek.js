const {
  MessageEmbed
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
  name: `seek`,
  description: `Changes the position(seek) of the Song`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  options: [
    {"Integer": { name: "seconds", description: "To what amount of Seconds do you want to seek?", required: true }}, 
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      let args = [interaction?.options.getInteger("seconds")]
      //if number is out of range return error
      if (Number(args[0]) < 0 || Number(args[0]) >= player.queue.current.duration / 1000)
        return interaction?.reply({ephemeral: true, embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["seek"]["variable1"]))
        ]});
      //seek to the position
      player.seek(Number(args[0]) * 1000);
      //send success message
      return interaction?.reply({ephemeral: true, embeds :[new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["music"]["seek"]["variable2"]))
        .addField(`${emoji?.msg.time} Progress: `, createBar(player))
        .setColor(es.color)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

