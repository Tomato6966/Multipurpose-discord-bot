const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "keepdistance",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "keepdistance <TEXT>",
  type: "text",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
        if(GuildSettings.FUN === false){
          return message.reply({embeds :[new MessageEmbed()
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
      //get the additional text
      var text = args.join(" ");
      //If no text added, return error
      if(!text) return tempmsg.edit({embeds : [tempmsg.embeds[0]
        .setTitle(eval(client.la[ls]["cmds"]["fun"]["keepdistance"]["variable2"]))
        .setColor("RED")
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["keepdistance"]["variable3"]))
      ]}).catch(() => null)
      
      //get the memer image
      client.memer.keepdistance(text).then(image => {
        //make an attachment
        var attachment = new MessageAttachment(image, "keepdistance.png");
        //delete old message
        tempmsg.delete();
        //send new Message
        message.reply({embeds : [tempmsg.embeds[0]
          .setAuthor(`Meme for: ${user.tag}`,avatar)
          .setColor(es.color)
          .setImage("attachment://keepdistance.png")
        ], files : [attachment]}).catch(() => null)
      })
      
  }
}

