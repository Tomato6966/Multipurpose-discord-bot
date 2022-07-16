const math = require('math-expression-evaluator');
const ms = require("ms");
const moment = require("moment")
const {
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { duration } = require('../../handlers/functions');
module.exports = {
  name: "remind",
  aliases: ["remindme"],
  category: "🏫 School Commands",
  description: "Reminds you at a specific day for something",
  usage: "remind TIME ++ TEXT",
  type: "time",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(!GuildSettings.SCHOOL){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    if(!args[0])
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable1"]))
      .setDescription(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable2"]))
    ]});
    let newargs = args.join(" ").split("++")
    let time = 0;
      try {
        const timeargs = newargs[0].trim().split(" ")
        for await (const t of timeargs){
          time += ms(t);
          console.log(t, ms(t))
        }
      } catch (e) {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable4"]))
        ]});
      }
    let content = newargs.slice(1).join(" ");
    if (!content) return message.reply(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable5"]))
    // Based off the delimiter, sets the time
    let returntime = time;
    if (returntime > 2073600000) return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable6"]))
      .setDescription(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable7"]))
    ]});
    if (returntime == 0) return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable8"]))
      .setDescription(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable9"]))
    ]});
    const now = new Date();
    let string_of_time = duration(returntime).map(i=>`\`${i}\``).join(", ");
    message.reply({embeds: [new MessageEmbed()
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      .setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable10"]))
      .setDescription(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable11"]))
    ]});
    await client.afkDB.push("REMIND.REMIND", 
    {
      at: moment().format("DD/MM/YYYY HH:mm"),
      time: returntime,
      timestamp: Date.now(),
      content: content,
      channel: message.channel.id,
      guild: message.guild.id,
      user: message.author?.id,
      string_of_time: string_of_time,
    })
  }

};
