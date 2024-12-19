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
  type: "queue",
  run: async (client, message, args, cmduser, text, prefix, player) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embed : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //if no shuffle happened, return error
      if (!player.get(`beforeshuffle`))
        return message.reply({embeds : [new MessageEmbed()

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
      return message.reply({embeds : [new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["music"]["unshuffle"]["variable3"]))
        .setColor(es.color)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["unshuffle"]["variable4"]))
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
