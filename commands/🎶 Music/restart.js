const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `restart`,
  category: `🎶 Music`,
  aliases: [`replay`],
  description: `Restarts the current song`,
  usage: `restart`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //seek to 0
      player.seek(0);
      //send informational message
      message.react(emoji?.react.replay_track).catch(() => null)
      
      message.react("🔃").catch(() => null)
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["restart"]["variable1"]))
      ]});
    }
  }
};

