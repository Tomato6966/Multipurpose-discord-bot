const {
  MessageEmbed,
  splitMessage
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
const fs = require('fs');
var {
  dbEnsure,
  isValidURL
} = require(`../../handlers/functions`);
const {
  inspect
} = require(`util`);
module.exports = {
  name: `leaveserver`,
  type: "info",
  category: `👑 Owner`,
  aliases: [`serverleave`, "kickbot"],
  description: `Make the Bot Leave a specific Server`,
  usage: `leaveserver <GUILDID>`,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
     
    if (!config.ownerIDS.includes(message.author?.id))
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable1"]))
      ]});
    if (!args[0])
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable3"]))
      ]});
    try {
      let guild = client.guilds.cache.get(args[0]);
      if(!guild) return message.reply({content : eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable4"])})
      guild.leave().then(g=>{
        message.channel.send({content : eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable5"])})
      }).catch(e=>{
        message.reply(`${e.message ? e.message : e}`, {code: "js"})
      })
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable6"]))
      ]});
    }
  },
};

