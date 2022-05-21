const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "8ball",
  category: "🕹️ Fun",
  description: "Answers your Question",
  usage: "8ball <Questions>",
  type: "text",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if(!client.settings.get(message.guild.id, "FUN")){
      const embed1 = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      
      return message.reply({embeds : [embed1]});
    }
    try {
      const question = args.slice(0).join(" ");
      const embed2 = new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["fun"]["8ball"]["variable1"]))
      if (!question)
        return message.reply({embeds : [embed2]});
      request(`https://8ball.delegator.com/magic/JSON/${question}`, function (e, response, body) {
        if (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey);
          message.reply({content : eval(client.la[ls]["cmds"]["fun"]["8ball"]["variable2"])});
        }
        body = JSON.parse(body);
        let embedColor = `RANDOM`;
        if (body.magic.type === "Affirmative") embedColor = "#0dba35";
        if (body.magic.type === "Contrary") embedColor = "#ba0d0d";
        if (body.magic.type === "Neutral") embedColor = "#6f7275";
const embed3 = new Discord.MessageEmbed()
          .setTitle(body.magic.answer)
          .setColor(embedColor)
        
        message.reply({embeds : [embed3]});
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      const embed4 = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["8ball"]["variable5"]))
      return message.reply({embeds : [embed4]});
    }
  }
}

