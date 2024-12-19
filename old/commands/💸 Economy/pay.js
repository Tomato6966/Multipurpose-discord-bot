const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "pay",
  category: "💸 Economy",
  aliases: ["givemoney"],
  description: "Pays Money to someone else!",
  usage: "pay <@USER> <Amount>",
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
    var user  = message.author;
    var topay = message.mentions.members.filter(member=>member.guild.id == message.guild.id).first();
    if(!topay) 
    return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable2"]))
      ]});
    topay = topay.user;
    let payamount = Number(args[1]);
    if(!payamount)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable4"]))
      ]});
    if (payamount <= 0) 
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable5"]))
      ]});
    //if user or the topay user is a bot, return error
    if(user.bot || topay.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable6"]))
    //ensure the economy data
    ensure_economy_user(client, message.guild.id, user.id);
    //ensure the economy data
    ensure_economy_user(client, message.guild.id, topay.id)
    //get the economy data 
    let data = client.economy.get(`${message.guild.id}-${user.id}`)
    let data2 = client.economy.get(`${message.guild.id}-${topay.id}`)

    if(payamount <= 0)
    return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable7"]))
      ]});
    
    if(payamount > data.balance)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable8"]))
      ]});
  
    client.economy.math(`${message.guild.id}-${user.id}`, "-", payamount, "balance")
    client.economy.math(`${message.guild.id}-${topay.id}`, "+", payamount, "balance")
    data = client.economy.get(`${message.guild.id}-${user.id}`)
    data2 = client.economy.get(`${message.guild.id}-${topay.id}`)
    //return some message!
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
      .setTitle(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable9"]))
      .setDescription(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable10"]))
    ]});
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["economy"]["pay"]["variable11"]))
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
