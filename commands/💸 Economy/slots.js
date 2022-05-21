const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "slots",
  category: "💸 Economy",
  description: "Earn your slots cash",
  usage: "slots",
  type: "game",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    const slotItems = ["🍅", "🥑", "🥒", "🍆", "🥝", "🍇", "🍉", "🍊", "🍏", "💣", "🍓", "🍎", "🍒", "🍈", "🍋", "🍌"];
    
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
      if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable1"]))
      
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
      //get the economy data 
      let data = await client.economy.get(`${message.guild.id}_${user.id}`)
      //get the delays
      
      let amount = parseInt(args[0]);
      let win = false;
  
      if (!amount) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable3"]))
        ]});
      if (amount <= 0) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable4"]))
        ]});
      if (amount > data.balance) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable5"]))
        ]});
  
      let number = []
      for (i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }
  
      if (number[0] == number[1] && number[1] == number[2]) { 
          amount *= 9
          win = true;
      } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
          amount *= 2
          win = true;
      }
      if (win) {
        //write the DB
        await client.economy.add(`${message.guild.id}_${message.author?.id}.balance`, Number(amount))
        //get the latest data
        data = await client.economy.get(`${message.guild.id}_${message.author?.id}`)
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable6"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable7"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
        ]})
      } else {
        //write the DB
        await client.economy.subtract(`${message.guild.id}_${message.author?.id}.balance`, Number(amount))
        //get the latest data
        data = await client.economy.get(`${message.guild.id}_${message.author?.id}`)
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable9"]))
          .setColor(es.wrongcolor).setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
        ]})
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable10"]))
      ]});
    }
  }
};

