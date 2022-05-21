const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
const path = require("path");
const { GetUser } = require(`../../handlers/functions`)
module.exports = {
  name: path.parse(__filename).name,
  category: "🕹️ Fun",
  usage: `${path.parse(__filename).name} [@User]`,
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
      //find the USER
      var user;
      try{
        user = await GetUser(message, args)
      }catch (e){
        return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
      }
      message.reply({embeds : [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["kill"]["variable1"]))
        .setImage("https://cdn.zerotwo.dev/SHOOT/028bfc32-c06b-4295-87a5-7ddaef08d5ef.gif")
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["kill"]["variable2"]))
      ]});
    }
  },
};

