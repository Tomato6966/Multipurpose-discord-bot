var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
const fs = require('fs');
const fetch = require('node-fetch');
var {
  dbEnsure, isValidURL
} = require(`../../handlers/functions`);
module.exports = {
  name: "changeavatar",
  category: "👑 Owner",
  type: "bot",
  aliases: ["changebotavatar", "botavatar", "botprofilepicture", "botpfp"],
  cooldown: 5,
  usage: "changeavatar <Imagelink/Image>",
  description: "Changes the Avatar of the BOT: I SUGGEST YOU TO DO IT LIKE THAT: Type the command in the Chat, attach an Image to the Command (not via link, just add it) press enter",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if (!config.ownerIDS.some(r => r.includes(message.author?.id)))
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable2"]))
        ]});
    try {
      var url;
      if (message.attachments.size > 0) {
        if (message.attachments.every(attachIsImage)) {
          const response = await fetch(url);
          const buffer = await response.buffer();
          fs.writeFile(`./image.jpg`, buffer, () => 
          console.log('finished downloading!'));
          client.user.setAvatar(`./image.jpg`)
          .then(user => {
            return message.channel.send({embeds : [new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable3"]))
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            ]});
          })
          .catch(e=>{
            return message.channel.send({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable4"]))
            ]});
          });
        } else {
          return message.channel.send({embeds :[new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable5"]))
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
          ]});
        }
      } else if (message.content && textIsImage(message.content)) {
        url = args.join(" ")
        const response = await fetch(url);
        const buffer = await response.buffer();
        await fs.writeFile(`./image.jpg`, buffer, () => 
          console.log('finished downloading!'));
        client.user.setAvatar(`./image.jpg`)
        .then(user => {
          try{
            fs.unlinkSync()
          }catch{

          }
          return message.channel.send({embeds : [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable6"]))
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          ]});
        })
        .catch(e=>{
          return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable7"]))
          ]});
        });
        
      } else {
        return message.channel.send({embeds :[new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable8"]))
            .setDescription(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable9"]))
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
        ]});
      }

      function attachIsImage(msgAttach) {
        url = msgAttach.url;

        //True if this url is a png image.
        return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
          url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
          url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
      }
      function textIsImage(url) {
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
     
     
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["changeavatar"]["variable10"]))
      ]});
    }
  },
};

