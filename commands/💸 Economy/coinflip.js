const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "coinflip",
  category: "💸 Economy",
  description: "Earn your Coinflip cash",
  usage: "coinflip <roll-result> <Gamble-Amount>",
  type: "game",
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
      if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable1"]))
      
      //ensure the economy data
      ensure_economy_user(client, message.guild.id, user.id)
      //get the economy data 
      let data = client.economy.get(`${message.guild.id}-${user.id}`)
      //get the delays
      var flip = args[0] ? args[0].toLowerCase() : false //Heads or Tails
      var amount = args[1] //Coins to gamble
  
      if (!flip || !['heads', 'tails'].includes(flip)) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable3"]))
          ]});
      if (!amount) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable5"]))
        ]});
      if (amount <= 0) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable6"]))
        ]});
      if (data.balance < amount) return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable7"]))
      ]});
      var valid_Numbers = ['heads', 'tails'];
      var result = valid_Numbers[Math.floor((Math.random() * valid_Numbers.length))]
      let win = false;
      if(flip == result) win = true;
      if (win) {
        //double the amount
        amount *= 1.5; 
        //write the DB
        client.economy.math(`${message.guild.id}-${message.author.id}`, "+", amount, "balance");
        //get the latest data
        data = client.economy.get(`${message.guild.id}-${message.author.id}`);
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable9"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        ]})
      } else {
        //write the DB
        client.economy.math(`${message.guild.id}-${message.author.id}`, "-", amount, "balance")
        //get the latest data
        data = client.economy.get(`${message.guild.id}-${message.author.id}`)
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable10"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable11"]))
          .setColor(es.wrongcolor).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        ]})
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable12"]))
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
