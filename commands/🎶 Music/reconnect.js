const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const radios = require(`../../botconfig/radiostations.json`);
const playermanager = require(`../../handlers/playermanager`);
const {
  stations
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `reconnect`,
  category: `🎶 Music`,
  aliases: [`rejoin`],
  description: `Rejoins the Setupped Channel`,
  usage: `reconnect`,
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      try {
        let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `channel`))
        if (!channel) return message.reply({content : eval(client.la[ls]["cmds"]["music"]["reconnect"]["variable1"])});
        //get the player instance
        const player = client.manager.players.get(message.guild.id);
        //if there is a player and they are not in the same channel, return Error
        if (player && player.state === "CONNECTED") await player.destroy();
        playermanager(client, message, Array(client.settings.get(message.guild.id, `song`)), `song:radioraw`, channel, message.guild);
      } catch {
        return message.reply({content : eval(client.la[ls]["cmds"]["music"]["reconnect"]["variable2"])})
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["reconnect"]["variable3"]))
       ]} );
    }
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
