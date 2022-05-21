const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const moment = require("moment")
const { GetUser, GetGlobalUser, handlemsg } = require(`../../handlers/functions`)
module.exports = {
  name: "emojiinfo",
  aliases: ["infoemoji"],
  category: "🔰 Info",
  description: "See Information about an emji",
  usage: "emojiinfo <EMOJI>",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let hasEmoteRegex = /<a?:.+:\d+>/gm
      let emoteRegex = /<:.+:(\d+)>/gm
      let animatedEmoteRegex = /<a:.+:(\d+)>/gm

      if(!message.content.match(hasEmoteRegex))
        return message.reply(handlemsg(client.la[ls].cmds.info.emojiinfo.error1))
        
      if (emoji1 = emoteRegex.exec(message)) {
        let url = "https://cdn.discordapp.com/emojis/" + emoji1[1] + ".png?v=1"
        let emoji = message.guild.emojis.cache.find((emj) => emj.name === emoji1[1] || emj.id == emoji1[1]) || await client.cluster.broadcastEval((c, emoji) => 
          c.emojis.cache.find((emj) => emj.name === emoji || emj.id == emoji), { context: emoji1[1]}
        ).catch(() => null).then(e => e.filter(Boolean)[0])
        if(!emoji) return message.reply(handlemsg(client.la[ls].cmds.info.emojiinfo.error2))
        let authorFetch = "Emoji not fetchable";
        try {
          authorFetch = await emoji?.fetchAuthor();
        }catch{

        }
        const guild = client.guilds.cache.get(emoji.guildId) || message.guild;
        const checkOrCross = (bool) => bool ? "✅" : "❌" ;
        const embed = new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["info"]["emojiinfo"]["variable1"]))
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setThumbnail(emoji?.url)
        .addField(handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.title), [
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[0])} \`${emoji?.id }\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[1])} [\`LINK\`](${emoji?.url})`,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[2])} ${authorFetch} (\`${authorFetch.id}\`)`,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[3])} \`${moment(emoji?.createdTimestamp).format("DD/MM/YYYY") + " | " +  moment(emoji?.createdTimestamp).format("hh:mm:ss")}\``
        ].join("\n"))
        .addField(handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.title), [
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[0])} \`${checkOrCross(emoji?.requireColons)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[1])} \`${checkOrCross(emoji?.animated)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[2])} \`${checkOrCross(emoji?.deleteable)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[3])} \`${checkOrCross(emoji?.managed)}\``,
        ].join("\n")).setFooter(client.getFooter(guild.name, `${guild.icon}`))
        message.reply({embeds: [embed]})
      }
      else if (emoji1 = animatedEmoteRegex.exec(message)) {
        let url2 = "https://cdn.discordapp.com/emojis/" + emoji1[1] + ".gif?v=1"
        let attachment2 = new Discord.MessageAttachment(url2, "emoji?.gif")
        const emoji = message.guild.emojis.cache.find((emj) => emj.name === emoji1[1] || emj.id == emoji1[1])
        if(!emoji) return message.reply(handlemsg(client.la[ls].cmds.info.emojiinfo.error2))
      
        const authorFetch = await emoji?.fetchAuthor();
        const checkOrCross = (bool) => bool ? "✅" : "❌" ;
        const embed = new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["info"]["emojiinfo"]["variable2"]))
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setThumbnail(emoji?.url)
        .addField(handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.title), [
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[0])} \`${emoji?.id }\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[1])} [\`LINK\`](${emoji?.url})`,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[2])} ${authorFetch} (\`${authorFetch.id}\`)`,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[3])} \`${moment(emoji?.createdTimestamp).format("DD/MM/YYYY") + " | " +  moment(emoji?.createdTimestamp).format("hh:mm:ss")}\``
        ].join("\n"))
        .addField(handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.title), [
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[0])} \`${checkOrCross(emoji?.requireColons)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[1])} \`${checkOrCross(emoji?.animated)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[2])} \`${checkOrCross(emoji?.deleteable)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field2.value[3])} \`${checkOrCross(emoji?.managed)}\``,
        ].join("\n")).setFooter(client.getFooter(es))
        message.reply({embeds: [embed]})
      }
      else {return message.reply(handlemsg(client.la[ls].cmds.info.emojiinfo.error3))
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

