const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "ecohelp",
  category: "💸 Economy",
  aliases: ["economyhelp"],
  description: "Shows Help for the Economy",
  usage: "ecohelp [@USER]",
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.ECONOMY === false){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      var user = message.author
      const economycmds = [`work`, `beg`, `rob`, `crime`,  `pay`, `balance`, `profile`, `withdraw`, `deposit`, `hourly`, `daily`, `weekly`, `monthly`, `store`, `buy`, `sell`]
      const gamblingcmds = ["slots", "coinflip", "dice"]
      const extracmds = [`storeinfo`, `buy <item> [Amount]`]
      //return some message!
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variable1"]))
        .addField(eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variablex_2"]), eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variable2"]))
        .addField(eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variablex_3"]), eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variable3"]))
        .addField(eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variablex_4"]), eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variable4"]))
      ]});
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["economy"]["ecohelp"]["variable5"]))
    ]});
  }
}
};

