const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `removetrack`,
  category: `🎶 Music`,
  aliases: [`rt`, `remove`],
  description: `Removes a track from the Queue`,
  usage: `removetrack <Trackindex>`,
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
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //if no args return error
      if (!args[0])
        return message.reply({embeds : [new MessageEmbed()

          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable2"]))
        ]});
      //if the Number is not a valid Number return error
      if (isNaN(args[0]))
        return message.reply({embeds : [new MessageEmbed()

          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable4"]))
        ]});
      //if the Number is too big return error
      if (Number(args[0]) > player.queue.size)
        return message.reply({embeds :[new MessageEmbed()

          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable6"]))
        ]});
      //remove the Song from the QUEUE
      player.queue.remove(Number(args[0]) - 1);
      //Send Success Message
      return message.reply({embeds : [new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable7"]))
        .setColor(es.color)

      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["removetrack"]["variable8"]))
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
