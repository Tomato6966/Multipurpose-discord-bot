const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "blackmarket",
  category: "💸 Economy",
  description: "Shows the Black Market",
  usage: "blackmarket <Multiplier>",
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if(!client.settings.get(message.guild.id, "ECONOMY")){
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
    ensure_economy_user(client, message.guild.id, user.id)
    //get the economy data 
    let data = client.economy.get(`${message.guild.id}-${user.id}`)
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
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
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
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable6"]))
        ]});
      if(amount == 0 || amount < 0)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable7"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable8"]))
        ]});
      if(amount == 1)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable9"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable10"]))
        ]});
        
      if(amount > 5)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable11"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable12"]))
        ]});
      if(prize * (amount - 1) > data.balance)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["blackmarket"]["variable13"]))
        ]});
      //add the Money to the User's Balance in this Guild
      client.economy.math(`${message.guild.id}-${message.author.id}`, "-", prize * (amount - 1), "balance")
      //set the current time to the db
      client.economy.set(`${message.guild.id}-${message.author.id}`, Date.now(), "black_market.boost.time")
      client.economy.set(`${message.guild.id}-${message.author.id}`, amount, "black_market.boost.multiplier")
      //get the new data
      data = client.economy.get(`${message.guild.id}-${message.author.id}`)
      //return some message!
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
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
/**
* @INFO
* Bot Coded by Tomato#6966 | https://discord.gg/milrato
* @INFO
* Work for Milrato Development | https://milrato.eu
* @INFO
* Please mention him / Milrato Development, when using this Code!
* @INFO
*/
