const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "blackmarket",
  category: "💸 Economy",
  description: "Shows the Black Market",
  usage: "blackmarket <Multiplier>",
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.ECONOMY === false){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable1"]))
      ]});
    }
    try {
    //command
    var user = message.author;
    if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable2"]))
    
    //ensure the economy data
    await ensure_economy_user(client, message.guild.id, user.id)
    //get the economy data 
    let data = await client.economy.get(`${message.guild.id}_${user.id}`)
    //get the delays
    let timeout = 86400000 * 5;
    //if the user is on delay return some error
    if(data.black_market.boost.time !== 0 && timeout - (Date.now() - data.black_market.boost.time) > 0){
      let thistime = timeout - (Date.now() - data.black_market.boost.time);
      console.log(thistime)
      let time = duration(thistime);
      console.log(time)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable4"]))]
      });
    } 
    //YEA
    else {
      let prize = 10000;
      let amount = parseInt(args[0]);
      if(!amount)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable6"]))
        ]});
      if(amount == 0 || amount < 0)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable7"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable8"]))
        ]});
      if(amount == 1)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable9"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable10"]))
        ]});
        
      if(amount > 5)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable11"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable12"]))
        ]});
      if(prize * (amount - 1) > data.balance)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable13"]))
        ]});
      //add the Money to the User's Balance in this Guild
      await client.economy.subtract(`${message.guild.id}_${message.author?.id}.balance`, prize * (amount - 1))
      //set the current time to the db
      await client.economy.set(`${message.guild.id}_${message.author?.id}.black_market.boost.time`, Date.now())
      await client.economy.set(`${message.guild.id}_${message.author?.id}.black_market.boost.multiplier`, Number(amount))
      //get the new data
      data = await client.economy.get(`${message.guild.id}_${message.author?.id}`)
      //return some message!
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable14"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable15"]))
      ]});
    }
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable16"]))
    ]});
  }
}
};

