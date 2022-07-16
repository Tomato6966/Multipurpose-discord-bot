const {
  MessageEmbed,
  Util: {
    splitMessage
  }
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
const fs = require('fs');
var {
  dbEnsure,
  isValidURL
} = require(`../../handlers/functions`);
const {
  inspect
} = require(`util`);
module.exports = {
  name: `detailedeval`,
  category: `👑 Owner`,
  aliases: [`detailedevaluate`, "detailevaluate", "detaileval"],
  description: `Eval a Command in detail! (not cutting of the resulted message)`,
  usage: `detailedeval <CODE>`,
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if ("442355791412854784" !== message.author?.id)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["detailedeval"]["variable1"]))
      ]});
    if (!args[0])
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["detailedeval"]["variable2"]))
      ]});
    let evaled;
    try {
      if (args.join(` `).includes(`token`)) return console.log(`ERROR NO TOKEN GRABBING ;)`.dim);

      evaled = await eval(args.join(` `));
      //make string out of the evaluation
      let string = inspect(evaled);
      //if the token is included return error
      if (string.includes(client.token)) return console.log(`ERROR NO TOKEN GRABBING ;)`.dim);
      //define queueembed
      let evalEmbed = new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["detailedeval"]["variable3"]))
        .setColor(es.color);
      //split the description
      const splitDescription = splitMessage(string, {
        maxLength: 2040,
        char: `\n`,
        prepend: ``,
        append: ``
      });
      //For every description send a new embed
      splitDescription.forEach(async (m) => {
        //(over)write embed description
        evalEmbed.setDescription(eval(client.la[ls]["cmds"]["owner"]["detailedeval"]["variable4"]));
        //send embed
        message.channel.send({embeds : [evalEmbed]});
      });
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["detailedeval"]["variable5"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["detailedeval"]["variable6"]))
      ]});
    }
  },
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
