const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "tornado",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "tornado <TEXT1 ++ TEXT2>",
  type: "text",
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
      var tempmsg = await message.reply({embeds :[new MessageEmbed()
        .setColor(ee.color)
        .setAuthor( 'Getting Image Data..', 'https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif')
      ]});
      //get the additional text
      var text1 = args.join(" ").split("++")[0];
      var text2 = args.join(" ").split("++")[1];
      //If no text added, return error
      if(!text1 || !text2) return tempmsg.edit({embeds :[tempmsg.embeds[0]
        .setTitle(eval(client.la[ls]["cmds"]["fun"]["tornado"]["variable2"]))
        .setColor("RED")
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["tornado"]["variable3"]))
      ]}).catch(() => null)
      
      //get the memer image
      client.memer.tornado(text1, text2).then(image => {
        //make an attachment
        var attachment = new MessageAttachment(image, "tornado.png");
        //delete old message
        tempmsg.delete();
        //send new Message
        message.reply({embeds :[tempmsg.embeds[0]
          .setAuthor(`Meme for: ${message.author.tag}`, message.author.displayAvatarURL())
          .setColor(es.color)
          .setImage("attachment://tornado.png")
        ],files : [attachment]}).catch(() => null)
      })
      
  }
}

