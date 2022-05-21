const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const anime = require('anime-actions');
module.exports = {
  name: "a-baka",
  aliases: ["abaka", "animebaka", "anime-baka"],
  category: "😳 Anime-Emotions",
  description: "Shows an Emotion-Expression in an Anime style",
  usage: "a-baka",
  type: "self",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.ANIME === false){
        return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
        ]});
    }
    //send new Message
    message.reply({embeds : [
        new MessageEmbed()
        .setColor(es.color)
        .setImage(await anime.baka())
        .setAuthor(`${message.author.username} bakas...`, message.author.displayAvatarURL({ dynamic: true }))
    ]}).catch(() => null)
      
  }
}

