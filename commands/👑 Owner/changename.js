var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, isValidURL
} = require(`../../handlers/functions`);
module.exports = {
  name: "changename",
  category: "👑 Owner",
  type: "bot",
  aliases: ["changebotname", "botname"],
  cooldown: 5,
  usage: "changename <NEW BOT NAME>",
  description: "Changes the Name of the BOT",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if (!config.ownerIDS.some(r => r.includes(message.author?.id)))
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable2"]))
        ]});
    try {
     
      if(!args[0])
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable4"]))
        ]});

      if(args.join(" ").length > 32)
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable5"]))
        ]});
      client.user.setUsername(args.join(" "))
      .then(user => {
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable6"]))
        ]});
      })
      .catch(e=>{
        return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable7"]))
        ]});
      });
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable8"]))
       ]} );
    }
  },
};
