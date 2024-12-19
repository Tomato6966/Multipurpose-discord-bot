const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "epic",
  aliases: ["epicinfo"],
  category: "🔰 Info",
  description: "Get the Epic Information About the User",
  usage: "epic [@USER]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.epicgamesDB.ensure(message.guild.id, { 
        logChannel: "",
        verifychannel: "",
      });
      let serverdata = client.epicgamesDB.get(message.guild.id);
      if(!serverdata.verifychannel || serverdata.verifychannel.length < 5) return message.reply(`:not: Verification System not setupped! An Admin can enable it via: \`${prefix}setup-epicgamesverify\``);
      
      //"HELLO"
      var user;
      let customavatar = false;
      try {
        if (args[1] && args[1].toLowerCase() == "global") {
          args.pop()
          user = await GetGlobalUser(message, args)
        } else {
          user = await GetUser(message, args)
        }
      } catch (e) {
        return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
      }
      if(!user) user = message.author;
      client.epicgamesDB.ensure(user.id, { 
        epic: "",
        user: user.id,
        guild: message.guild.id,
        Platform: "",
        InputMethod: "",
      });
      let data = client.epicgamesDB.get(user.id);
      if(!data.epic || data.epic.length < 5) return message.reply(`❌ **${user.tag}** did not verify/connect their Epic Games Account`)
      message.reply({
        embeds: [
            new Discord.MessageEmbed().setColor(es.color)
                .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
                .setTitle(`Epic Games Account!`)
                .addField("**Epic Games Name:**", `\`\`\`${data.epic}\`\`\``)
                .addField("**Platform:**", `\`\`\`${data.Platform}\`\`\``)
                .addField("**Input Method:**", `\`\`\`${data.InputMethod}\`\`\``)
                .setFooter("ID: " + user.id, user.displayAvatarURL({dynamic: true}))
        ]
      }).catch(() => {})
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
      ]});
    }
  }
}
/*
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
