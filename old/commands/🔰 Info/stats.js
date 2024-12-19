const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  getRandomInt, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "stats",
  category: "🔰 Info",
  aliases: ["musicstats"],
  cooldown: 10,
  usage: "stats",
  description: "Shows music Stats, like amount of Commands and played Songs etc.",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      
      let global = client.stats.get("global");
      let guild = client.stats.get(message.guild.id);
      
      message.reply({embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
        .addField(client.la[ls].cmds.info.stats.field1.title, handlemsg(client.la[ls].cmds.info.stats.field1.value, { allcommands: Math.ceil(global.commands * [...client.guilds.cache.values()].length / 10) }), true)
        .addField(client.la[ls].cmds.info.stats.field2.title, handlemsg(client.la[ls].cmds.info.stats.field2.value, { allsongs: Math.ceil(global.songs * [...client.guilds.cache.values()].length / 10) }), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["stats"]["variablex_1"]), eval(client.la[ls]["cmds"]["info"]["stats"]["variable1"]))
        .addField(client.la[ls].cmds.info.stats.field3.title, handlemsg(client.la[ls].cmds.info.stats.field3.value, { guildcommands: guild.commands }), true)
        .addField(client.la[ls].cmds.info.stats.field4.title, handlemsg(client.la[ls].cmds.info.stats.field4.value, { guildsongs: guild.songs }), true)
        .setTitle(handlemsg(client.la[ls].cmds.info.stats.title, { botname: client.user.username }))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
