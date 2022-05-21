const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const anime = require('anime-actions');
module.exports = {
  name: "a-hug",
  aliases: ["ahug", "animehug", "anime-hug"],
  category: "😳 Anime-Emotions",
  description: "Shows an Emotion-Expression in an Anime style",
  usage: "a-hug",
  type: "mention",
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
        .setImage(await anime.hug())
        .setAuthor(`${message.author.username} hugs${message.mentions.users.first() ? " " + message.mentions.users.first().username : " him-/herself.."}`, message.author.displayAvatarURL({ dynamic: true }))
    ]}).catch(() => null)
      
  }
}

