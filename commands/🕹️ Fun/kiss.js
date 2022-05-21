const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
const path = require("path");
module.exports = {
  name: path.parse(__filename).name,
  category: "🕹️ Fun",
  usage: `${path.parse(__filename).name} <@User> [@User2]`,
  type: "user",
  description: "*Image cmd in the style:* " + path.parse(__filename).name,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
        if(GuildSettings.FUN === false){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
    try {
      let tempmsg = await message.reply({embeds  : [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setAuthor( 'Getting Image Data..', 'https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif')
      ]});
      //find the USER
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        let tmp = await client.users.fetch(args[0]).catch(() => null)
        if(tmp) user = tmp;
        if(!tmp) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["kiss"]["variable2"])})
      }
      else if(!user && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
        user = alluser.find(user => user.includes(args[0].toLowerCase()))
        user = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == user).user
        if(!user || user == null || !user.id) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["kiss"]["variable3"])})
      }
      else {
        user = message.mentions.users.first() || message.author;
      }
      //find the USER
      let user2 = message.mentions.users.last();
      if(!user2 && args[1] && args[1].length == 18) {
        let tmp = await client.users.fetch(args[1]).catch(() => null)
        if(tmp) user2 = tmp;
        if(!tmp) user2 = message.author;
      }
      else if(!user2 && args[1]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
        user2 = alluser.find(user => user.includes(args[1].toLowerCase()))
        user2 = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == user2).user
        if(!user2 || user2 == null || !user2.id) user2 = message.author;
      }
      else {
        user2 = message.mentions.users.last() || message.author;
      }
      if(user.id == user2.id){
        user2 == message.author;
      }
      if(user.id == user2.id) 
         return message.reply({embeds : [new MessageEmbed()
           .setColor(es.wrongcolor)
           .setFooter(client.getFooter(es))
           .setTitle(":x: You forgot to ping at least one Member!")
           .setDescription(`Usage: \`${prefix}kiss <@User1> [@User2]\``)
         ]});
      let avatar = user.displayAvatarURL({
        dynamic: false,
        format: "png"
      });
      let avatar2 = user2.displayAvatarURL({
        dynamic: false,
        format: "png"
      });
      let image = await canvacord.Canvas.kiss(avatar, avatar2);
      let attachment = await new Discord.MessageAttachment(image, "kiss.png");
      let fastembed2 = new Discord.MessageEmbed().setColor(es.color).setFooter(client.getFooter(es))
      .setImage("attachment://kiss.png")
      await message.reply({embeds : [fastembed2], files: [attachment]});
      await tempmsg.delete().catch(() => null)
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["kiss"]["variable4"]))
      ]});
    }
  },
};

