const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "ecohelp",
  category: "💸 Economy",
  aliases: ["economyhelp"],
  description: "Shows Help for the Economy",
  usage: "ecohelp [@USER]",
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if(!client.settings.get(message.guild.id, "ECONOMY")){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
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
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
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
/**
* @INFO
* Bot Coded by Tomato#6966 | https://discord.gg/milrato
* @INFO
* Work for Milrato Development | https://milrato.eu
* @INFO
* Please mention him / Milrato Development, when using this Code!
* @INFO
*/
