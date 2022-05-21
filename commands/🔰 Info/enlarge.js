const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const { handlemsg } = require(`../../handlers/functions`)
module.exports = {
  name: "enlarge",
  aliases: ["enlargeemoji"],
  category: "🔰 Info",
  description: "Make the Emoji, just larger",
  usage: "enlarge <EMOJI>",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    let hasEmoteRegex = /<a?:.+:\d+>/gm
    let emoteRegex = /<:.+:(\d+)>/gm
    let animatedEmoteRegex = /<a:.+:(\d+)>/gm
    if(!message.content.match(hasEmoteRegex))
    return message.reply(handlemsg(client.la[ls].cmds.info.enlarge.error1)) 
    if (emoji = emoteRegex.exec(message)) {
      let url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"
      let attachment = new Discord.MessageAttachment(url, "emoji.png")
      message.reply({files: [attachment]});
    }
    else if (emoji = animatedEmoteRegex.exec(message)) {
      let url2 = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1"
      let attachment2 = new Discord.MessageAttachment(url2, "emoji?.gif")
      message.reply({files: [attachment2]});
    }
    else {
      return message.reply(handlemsg(client.la[ls].cmds.info.enlarge.error2)) 
    }
  }
}

