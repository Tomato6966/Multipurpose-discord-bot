const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "enlarge",
  aliases: ["enlargeemoji"],
  category: "🔰 Info",
  description: "Make the Emoji, just larger",
  usage: "enlarge <EMOJI>",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let hasEmoteRegex = /<a?:.+:\d+>/gm
      let emoteRegex = /<:.+:(\d+)>/gm
      let animatedEmoteRegex = /<a:.+:(\d+)>/gm

      if(!message.content.match(hasEmoteRegex))
      return message.reply(handlemsg(client.la[ls].cmds.info.enlarge.error1)) 
      if (emoji = emoteRegex.exec(message)) {
        let url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"
        let attachment = new Discord.MessageAttachment(url, "emoji?.png")
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
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
