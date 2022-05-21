const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {MessageEmbed} = require("discord.js");
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "work",
  category: "💸 Economy",
  description: "Lets you work a job",
  usage: "work",
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
      var user = message.author;
      
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
      if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["work"]["variable1"]))
      let data = await client.economy.get(`${message.guild.id}_${user.id}`)
      //time delay for the Work
      let timeout = 25 * 60 * 1000;
      //if user is on cooldown error
      if(data.work !== 0 && timeout - (Date.now() - data.work) > 0){
        let time = duration(timeout - (Date.now() - data.work));
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["work"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["work"]["variable3"]))]
        });
      } 
      //YEA
      else {
        let replies = ['Programmer','Builder','Waiter','Busboy','Chief','Mechanic', "Prostitute", "Stripper", "Dancer", "Drawer", "Lawer", "Agent", "Superman", "Moderator", "Gamer"]
        //get a random work job
        let result = Math.floor((Math.random() * replies.length));
        //get a random money amount
        let amount = Math.floor(Math.random() * 200) + 50 ;
        if(amount > 200) amount = amount - Math.floor(Math.random() * 50) + 1;
        amount = amount * data.black_market.boost.multiplier
        //add the Money to the User's Balance in this Guild
        await client.economy.add(`${message.guild.id}_${user.id}.balance`, Number(amount))
        //set the current time to the db
        await client.economy.set(`${message.guild.id}_${user.id}.work`, Date.now())
        //get the new data
        data = await client.economy.get(`${message.guild.id}_${user.id}`)
        //return some message!
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["work"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["work"]["variable5"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: 1[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["work"]["variable6"]))
      ]});
    }
  }
};

