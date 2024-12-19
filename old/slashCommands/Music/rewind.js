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
  name: `rewind`,
  description: `Seeks a specific amount of Seconds backwards`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  options: [
    {"Integer": { name: "seconds", description: "How many Seconds do you want to rewind?", required: true }}, 
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    
    //let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return interaction?.reply({ephemeral: true, embed : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      let args = [interaction?.options.getInteger("seconds")]

      if (!args[0])
        return interaction?.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["rewind"]["variable1"]))
        ]});
      let seektime = player.position - Number(args[0]) * 1000;
      if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
        seektime = 0;
      }
      //seek to the right time
      player.seek(Number(seektime));
      //send success message
      return interaction?.reply({embeds : [new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["music"]["rewind"]["variable2"]))
        .addField(`${emoji?.msg.time} Progress: `, createBar(player))
        .setColor(es.color)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
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
