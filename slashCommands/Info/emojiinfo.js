const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const moment = require("moment")
const { GetUser, GetGlobalUser, handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "emojiinfo",
  description: "See Information about an emoji",
  options: [ 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		{"String": { name: "emoji", description: "From what Em oji do you want to get details?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "which_user", description: "From Which User do you want to get the Avatar?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    let emojiStr = options.getString("emoji");
    try {
      let hasEmoteRegex = /<a?:.+:\d+>/gm
      let emoteRegex = /<:.+:(\d+)>/gm
      let animatedEmoteRegex = /<a:.+:(\d+)>/gm

      if(!emojiStr.match(hasEmoteRegex))
        return interaction?.reply({ephemeral: true, content: handlemsg(client.la[ls].cmds.info.emojiinfo.error1)})
        
      if (emoji1 = emoteRegex.exec(emojiStr)) {
        let url = "https://cdn.discordapp.com/emojis/" + emoji1[1] + ".png?v=1"
        const emoji = guild.emojis.cache.find((emj) => emj.name === emoji1[1] || emj.id == emoji1[1])
        if(!emoji) return interaction?.reply({ephemeral: true, content: handlemsg(client.la[ls].cmds.info.emojiinfo.error2)})
      
        const authorFetch = await emoji?.fetchAuthor();
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
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[1])} \`${checkOrCross(emoji?.animated)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[2])} \`${checkOrCross(emoji?.deleteable)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[3])} \`${checkOrCross(emoji?.managed)}\``,
        ].join("\n")).setFooter(client.getFooter(es))
        interaction?.reply({ephemeral: true, embeds: [embed]})
      }
      else if (emoji1 = animatedEmoteRegex.exec(emojiStr)) {
        let url2 = "https://cdn.discordapp.com/emojis/" + emoji1[1] + ".gif?v=1"
        let attachment2 = new Discord.MessageAttachment(url2, "emoji?.gif")
        const emoji = guild.emojis.cache.find((emj) => emj.name === emoji1[1] || emj.id == emoji1[1])
        if(!emoji) return interaction?.reply({ephemeral: true, content: handlemsg(client.la[ls].cmds.info.emojiinfo.error2)})
      
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
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[1])} \`${checkOrCross(emoji?.animated)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[2])} \`${checkOrCross(emoji?.deleteable)}\``,
          `${handlemsg(client.la[ls].cmds.info.emojiinfo.embed.field1.value[3])} \`${checkOrCross(emoji?.managed)}\``,
        ].join("\n")).setFooter(client.getFooter(es))
        interaction?.reply({ephemeral: true, embeds: [embed]})
      }
      else {return interaction?.reply(handlemsg(client.la[ls].cmds.info.emojiinfo.error3))
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
  }
}

