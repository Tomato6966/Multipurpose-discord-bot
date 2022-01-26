const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  format,
  arrayMove
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `move`,
  category: `🎶 Music`,
  aliases: [`mv`],
  description: `Shows the Queue`,
  usage: `move <from> <to>`,
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
      //if no FROM args return error
      if (!args[0])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)

          .setTitle(eval(client.la[ls]["cmds"]["music"]["move"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["move"]["variable2"]))
        ]});
      //If no TO args return error
      if (!args[1])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)

          .setTitle(eval(client.la[ls]["cmds"]["music"]["move"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["move"]["variable4"]))]});
      //if its not a number or too big / too small return error
      if (isNaN(args[0]) || args[0] <= 1 || args[0] > player.queue.length)
        return message.reply(
          {embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)

          .setTitle(eval(client.la[ls]["cmds"]["music"]["move"]["variable5"]))
          ]});
      //get the new Song
      let song = player.queue[player.queue.length - 1];
      //move the Song to the first position using my selfmade Function and save it on an array
      let QueueArray = arrayMove(player.queue, player.queue.length - 1, 0);
      //clear teh Queue
      player.queue.clear();
      //now add every old song again
      for (const track of QueueArray)
        player.queue.add(track);
      //send informational message
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.color)

        .setTitle(eval(client.la[ls]["cmds"]["music"]["move"]["variable6"]))
        .setThumbnail(song.displayThumbnail())
        .setDescription(eval(client.la[ls]["cmds"]["music"]["move"]["variable7"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["move"]["variable8"]))
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
