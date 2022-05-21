const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, dbEnsure } = require(`../../handlers/functions`)
module.exports = {
  name: "removemoney",
  category: "⚙️ Settings",
  aliases: ["ecoremovemoney"],
  description: "removes Money to someone else!",
  usage: "removemoney <@USER> <Amount>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(!GuildSettings.ECONOMY){
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
    //command
    var user  = message.author;
    var topay = message.mentions.members.filter(member=>member.guild.id == message.guild.id).first();
    if(!topay)  return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable4"]))
    ]});
    topay = topay.user;
    let payamount = Number(args[1]);
    if(!payamount)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable5"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable6"]))
      ]});
    if(user.bot || topay.bot) return message.reply({content : eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable7"])})

    await dbEnsure(client.economy, `${message.guild.id}-${user.id}`, {
      user: user.id,
      work: 0,
      balance: 0,
      bank: 0,
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      items: {
        yacht: 0, lamborghini: 0, car: 0, motorbike: 0,  bicycle: 0,
        nike: 0, tshirt: 0,
        mansion: 0, house: 0, dirthut: 0,
        pensil: 0, pen: 0, condom: 0, bottle: 0,
        fish: 0, hamster: 0, dog: 0, cat: 0,            
      }
    })
    
    await dbEnsure(client.economy, `${message.guild.id}-${topay.id}`, {
      user: user.id,
      work: 0,
      balance: 0,
      bank: 0,
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      items: {
        yacht: 0, lamborghini: 0, car: 0, motorbike: 0,  bicycle: 0,
        nike: 0, tshirt: 0,
        mansion: 0, house: 0, dirthut: 0,
        pensil: 0, pen: 0, condom: 0, bottle: 0,
        fish: 0, hamster: 0, dog: 0, cat: 0,          
      }
    })
    //get the economy data 
    let data2 = await client.economy.get(`${message.guild.id}-${topay.id}`)

    if(payamount <= 0)
    return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable8"]))
    ]});
    
    if(payamount > data2.balance)
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable9"]))
      ]});
    
    await client.economy.set(`${message.guild.id}-${topay.id}.balance`, data2.balance - payamount)
    data2 = await client.economy.get(`${message.guild.id}-${topay.id}`)
    //return some message!
    return message.reply({embeds :[new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
      .setTitle(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable10"]))
      .setDescription(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable11"]))
    ]});
  } catch (e) {
    console.log(String(e.stack).dim.bgRed)
    return message.channel.send({embeds : [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["owner"]["removemoney"]["variable12"]))
    ]});
  }
}
};

