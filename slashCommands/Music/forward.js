const {
  MessageEmbed
} = require(`discord.js`)
const config = require(`${process.cwd()}/botconfig/config.json`)
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `forward`,
  description: `Seeks a specific amount of Seconds forwards`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  options: [
    {"Integer": { name: "seconds", description: "How many Seconds do you want to forward?", required: true }}, 
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
      let args = [interaction?.options.getInteger("seconds")]
      //if no args available, return error
      if (!args[0])
        return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(handlemsg(client.la[ls].cmds.music.forward.allowed, {duration: player.queue.current.duration}))
        ]});
      //get the seektime variable of the user input
      let seektime = Number(player.position) + Number(args[0]) * 1000;
      //if the userinput is smaller then 0, then set the seektime to just the player.position
      if (Number(args[0]) <= 0) seektime = Number(player.position);
      //if the seektime is too big, then set it 1 sec earlier
      if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
      //seek to the new Seek position
      player.seek(Number(seektime));
      //Send Success Message
      return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
        .setTitle(client.la[ls].cmds.music.forward.title)
        .setDescription(handlemsg(client.la[ls].cmds.music.forward.description, {amount: args[0], time: format(Number(player.position))}))
        .addField(client.la[ls].cmds.music.forward.field, createBar(player))
        .setColor(es.color)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

