const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "coinflip",
  category: "💸 Economy",
  description: "Earn your Coinflip cash",
  usage: "coinflip <roll-result> <Gamble-Amount>",
  type: "game",
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
      if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable1"]))
      
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
      //get the economy data 
      let data = await client.economy.get(`${message.guild.id}_${user.id}`)
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
          .setColor(es.wrongcolor).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
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
        await client.economy.add(`${message.guild.id}_${message.author?.id}.balance`, Number(amount));
        //get the latest data
        data = await client.economy.get(`${message.guild.id}_${message.author?.id}`);
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable9"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
        ]})
      } else {
        //write the DB
        await client.economy.subtract(`${message.guild.id}_${message.author?.id}.balance`, Number(amount))
        //get the latest data
        data = await client.economy.get(`${message.guild.id}_${message.author?.id}`)
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable10"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["coinflip"]["variable11"]))
          .setColor(es.wrongcolor).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
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

