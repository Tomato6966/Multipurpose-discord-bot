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
module.exports = {
  name: "calc",
  aliases: ["calculate"],
  category: "🏫 School Commands",
  description: "Calculates a math equation",
  usage: "calc <INPUT>",
  type: "math",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(!GuildSettings.SCHOOL){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    //command

    if (args.length < 1)
      return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["calc"]["variable1"]))
      .setDescription(eval(client.la[ls]["cmds"]["schoolcommands"]["calc"]["variable2"]))
      ]});

    let answer;

    try {
      answer = await math.eval(args.join(" ").replace(/mod/igu, "Mod").replace(/%/igu, "Mod"));
    } catch (err) {
      console.error(err);
      return message.reply({content: `Invalid Math Equation: \`\`\`${String(err.message ? err.message : err).substring(0, 150)}\`\`\``});
    }

    message.reply({embeds: [new MessageEmbed() 
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      .setDescription(eval(client.la[ls]["cmds"]["schoolcommands"]["calc"]["variable4"]))
      .setFooter(client.getFooter(es))
      .addField(eval(client.la[ls]["cmds"]["schoolcommands"]["calc"]["variablex_5"]), eval(client.la[ls]["cmds"]["schoolcommands"]["calc"]["variable5"]))
      .addField(eval(client.la[ls]["cmds"]["schoolcommands"]["calc"]["variablex_6"]), eval(client.la[ls]["cmds"]["schoolcommands"]["calc"]["variable6"]))
    ]});
  }
};