const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "hourly",
  category: "💸 Economy",
  description: "earn your hourly cash",
  usage: "hourly",
  type: "earn",
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
      if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["hourly"]["variable1"]))
      
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
      //get the economy data 
      let data = await client.economy.get(`${message.guild.id}_${user.id}`)
      //get the delays
      let timeout = 60*60*1000;

      if(data.hourly !== 0 && timeout - (Date.now() - data.hourly) > 0){
        let time = duration(timeout - (Date.now() - data.hourly));
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["hourly"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["hourly"]["variable3"]))]
        });
      } 
      //YEA
      else {
        let amountarray = [300, 350, 400, 340, 360, 350, 355, 345, 365, 350, 340, 360, 325, 375, 312.5, 387.5];
        let amount = Math.floor(amountarray[Math.floor((Math.random() * amountarray.length))]);
        amount = amount * data.black_market.boost.multiplier
        //add the Money to the User's Balance in this Guild
        await client.economy.add(`${message.guild.id}_${message.author?.id}.balance`, Number(amount))
        //set the current time to the db
        await client.economy.set(`${message.guild.id}_${message.author?.id}.hourly`, Date.now())
        //get the new data
        data = await client.economy.get(`${message.guild.id}_${message.author?.id}`)
        //return some message!
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["hourly"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["hourly"]["variable5"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["hourly"]["variable6"]))
      ]});
    }
  }
};

