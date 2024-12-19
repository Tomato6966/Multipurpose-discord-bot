const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "withdraw",
  category: "💸 Economy",
  aliases: ["tobank"],
  description: "Allows you to withdraw a specific amount or everything from your Bank",
  usage: "withdraw <AMOUNT/ALL>",
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
    //command
    var user = message.author
    if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable1"]))
    
      //ensure the economy data
      ensure_economy_user(client, message.guild.id, user.id)
    var data = client.economy.get(`${message.guild.id}-${user.id}`)
    if(!args[0])
      return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable3"]))
        ]});
    if(args[0].toLowerCase() == "all"){
      client.economy.math(`${message.guild.id}-${user.id}`, "+", data.bank, "balance")
      //set the current time to the db
      client.economy.set(`${message.guild.id}-${user.id}`, 0, "bank")

      var withdrawed = data.bank;

      data = client.economy.get(`${message.guild.id}-${user.id}`)

      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable4"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable5"]))
      ]});
    }else {
      let amount = parseInt(args[0]);
      if(amount <= 0)
      return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable6"]))
        ]});
      
      if(amount > data.bank)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable7"]))
        ]});
      
      client.economy.math(`${message.guild.id}-${user.id}`, "+", amount, "balance")
      client.economy.math(`${message.guild.id}-${user.id}`, "-", amount, "bank")
      //get the data
      data = client.economy.get(`${message.guild.id}-${user.id}`)
      //show the message
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable8"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable9"]))
      ]});
    }
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["economy"]["withdraw"]["variable10"]))
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
