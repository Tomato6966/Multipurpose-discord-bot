const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "deposit",
  category: "💸 Economy",
  aliases: ["tobank"],
  description: "Allows you to deposit a specific amount or everything to your Bank",
  usage: "deposit <AMOUNT/ALL>",
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
    //command
    var user = message.author
    if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable1"]))
    
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
    var data = await client.economy.get(`${message.guild.id}_${user.id}`)
    if(!args[0])
      return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable3"]))
        ]});
    if(args[0].toLowerCase() == "all"){
      await client.economy.add(`${message.guild.id}_${user.id}.bank`, data.balance)
      //set the current time to the db
      await client.economy.set(`${message.guild.id}_${user.id}.balance`, 0)

      var deposited = data.balance;

      data = await client.economy.get(`${message.guild.id}_${user.id}`)

      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable4"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable5"]))
      ]});
    }else {
      let amount = parseInt(args[0]);
      if(amount <= 0)
      return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable6"]))
        ]});
      
      if(amount > data.balance)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable7"]))
        ]});
      
      await client.economy.add(`${message.guild.id}_${user.id}.bank`, Number(amount))
      await client.economy.subtract(`${message.guild.id}_${user.id}.balance`, Number(amount))
      //get the data
      data = await client.economy.get(`${message.guild.id}_${user.id}`)
      //show the message
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable8"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable9"]))
      ]});
    }
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["economy"]["deposit"]["variable10"]))
    ]});
  }
}
};

