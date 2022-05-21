const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const anime = require('anime-actions');
module.exports = {
  name: "a-stare",
  aliases: ["astare", "animestare", "anime-stare"],
  category: "😳 Anime-Emotions",
  description: "Shows an Emotion-Expression in an Anime style",
  usage: "a-stare",
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
        .setImage(await anime.stare())
        .setAuthor(`${message.author.username} stares${message.mentions.users.first() ? " at " + message.mentions.users.first().username : " at nothing.."}`, message.author.displayAvatarURL({ dynamic: true }))
    ]}).catch(() => null)
      
  }
}

