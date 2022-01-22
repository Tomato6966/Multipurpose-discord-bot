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
  name: `autoplay`,
  description: `Toggles Autoplay on/off`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
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
      //toggle autoplay
      player.set(`autoplay`, !player.get(`autoplay`))
      //Send Success Message
      return interaction?.reply({embeds :[new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["music"]["autoplay"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["music"]["autoplay"]["variable2"]))
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
