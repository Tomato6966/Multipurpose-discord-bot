const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "bed",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "bed @User @User2",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
        if(GuildSettings.FUN === false){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
      //send loading message
      var tempmsg = await message.reply({embeds : [new MessageEmbed()
        .setColor(ee.color)
        .setAuthor( 'Getting Image Data..', 'https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif')
      ]});
     //find the USER
     let user = message.mentions.users.first();
     if(!user && args[0] && args[0].length == 18) {
       let tmp = await client.users.fetch(args[0]).catch(() => null)
       if(tmp) user = tmp;
       if(!tmp) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["bed"]["variable2"])})
     }
     else if(!user && args[0]){
       let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
       user = alluser.find(user => user.includes(args[0].toLowerCase()))
       user = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == user).user
       if(!user || user == null || !user.id) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["bed"]["variable3"])})
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
     if(user.id == user2.id) user2 == message.author;
     if(user.id == user2.id) 
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(":x: You forgot to ping at least one Member!")
          .setDescription(`Usage: \`${prefix}bed <@User1> [@User2]\``)
        ]});
     let avatar1 = user.displayAvatarURL({
       dynamic: false,
       format: "png"
     });
     let avatar2 = user2.displayAvatarURL({
       dynamic: false,
       format: "png"
     });
    client.memer.bed(avatar1, avatar2).then(image => {
      //make an attachment
      var attachment = new MessageAttachment(image, "bed.png");
      //delete old message
      tempmsg.delete();
      //send new Message
      message.reply({embeds : [tempmsg.embeds[0]
        .setAuthor(`Meme for: ${user1.tag} | ${user2.tag}`, avatar1)
        .setColor(es.color)          
        .setImage("attachment://bed.png") 
      ], files : [attachment]}).catch(() => null)
    })
      
  }
}

