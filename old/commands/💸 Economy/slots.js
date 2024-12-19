const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "slots",
  category: "💸 Economy",
  description: "Earn your slots cash",
  usage: "slots",
  type: "game",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    const slotItems = ["🍅", "🥑", "🥒", "🍆", "🥝", "🍇", "🍉", "🍊", "🍏", "💣", "🍓", "🍎", "🍒", "🍈", "🍋", "🍌"];
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
      if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable1"]))
      
      //ensure the economy data
      ensure_economy_user(client, message.guild.id, user.id)
      //get the economy data 
      let data = client.economy.get(`${message.guild.id}-${user.id}`)
      //get the delays
      
      let amount = parseInt(args[0]);
      let win = false;
  
      if (!amount) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable3"]))
        ]});
      if (amount <= 0) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable4"]))
        ]});
      if (amount > data.balance) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
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
        client.economy.math(`${message.guild.id}-${message.author.id}`, "+", amount, "balance")
        //get the latest data
        data = client.economy.get(`${message.guild.id}-${message.author.id}`)
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable6"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable7"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        ]})
      } else {
        //write the DB
        client.economy.math(`${message.guild.id}-${message.author.id}`, "-", amount, "balance")
        //get the latest data
        data = client.economy.get(`${message.guild.id}-${message.author.id}`)
        //send the Information Message
        message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["slots"]["variable9"]))
          .setColor(es.wrongcolor).setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
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
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
