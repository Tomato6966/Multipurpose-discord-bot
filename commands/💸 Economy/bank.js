const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "bank",
  category: "💸 Economy",
  description: "Lets you check how much money you have",
  usage: "bank [@USER]",
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if (GuildSettings.ECONOMY === false) {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //command
      var user;
      if (args[0]) {
        try {
          user = await GetUser(message, args)
        } catch (e) {
          if (!e) return message.reply(eval(client.la[ls]["cmds"]["economy"]["bank"]["variable1"]))
          return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
        }
      } else {
        user = message.author;
      }
      if (!user || user == null || user.id == null || !user.id) user = message.author
      if (user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["bank"]["variable2"]))
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
      //get the economy data 
      const data = await client.economy.get(`${message.guild.id}_${user.id}`)
      var items = 0;
      var itemsvalue = 0;
      for (const itemarray in data.items) {
        items += data.items[`${itemarray}`];
        var prize = 0;
        switch (itemarray.toLowerCase()) {
          case "yacht": prize = 75000; break;
          case "lamborghini": prize = 50000; break;
          case "car": prize = 6400; break;
          case "motorbike": prize = 1500; break;
          case "bicycle": prize = 500; break;

          case "nike": prize = 300; break;
          case "tshirt": prize = 60; break;

          case "mansion": prize = 45000; break;
          case "house": prize = 8000; break;
          case "dirthut": prize = 150; break;

          case "pensil": prize = 20; break;
          case "pen": prize = 10; break;
          case "condom": prize = 30; break;
          case "bottle": prize = 50; break;

          case "fish": prize = 1000; break;
          case "hamster": prize = 1500; break;
          case "dog": prize = 2000; break;
          case "cat": prize = 2000; break;
        }
        itemsvalue += prize * data.items[`${itemarray}`];
      }
      //return some message!
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(user.tag, message.author.displayAvatarURL({ dynamic: true })))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["bank"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["bank"]["variable4"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["bank"]["variable5"]))
      ]});
    }
  }
};

