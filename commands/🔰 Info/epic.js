const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg, dbEnsure
} = require(`../../handlers/functions`)
module.exports = {
  name: "epic",
  aliases: ["epicinfo"],
  category: "🔰 Info",
  description: "Get the Epic Information About the User",
  usage: "epic [@USER]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      await dbEnsure(client.epicgamesDB, message.guild.id, { 
        logChannel: "",
        verifychannel: "",
      });
      let serverdata = await client.epicgamesDB.get(message.guild.id);
      if(!serverdata || !serverdata.verifychannel || serverdata.verifychannel.length < 5) return message.reply(`❌ Verification System not setupped! An Admin can enable it via: \`${prefix}setup-epicgamesverify\``);
      
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
      await dbEnsure(client.epicgamesDB, user.id, { 
        epic: "",
        user: user.id,
        guild: message.guild.id,
        Platform: "",
        InputMethod: "",
      });
      let data = await client.epicgamesDB.get(user.id);
      if(!data || !data.epic || data.epic.length < 5) return message.reply(`❌ **${user.tag}** did not verify/connect their Epic Games Account`)
      message.reply({
        embeds: [
            new Discord.MessageEmbed().setColor(es.color)
                .setAuthor(client.getAuthor(user.tag, user.displayAvatarURL({dynamic: true})))
                .setTitle(`Epic Games Account!`)
                .addField("**Epic Games Name:**", `\`\`\`${data.epic}\`\`\``)
                .addField("**Platform:**", `\`\`\`${data.Platform}\`\`\``)
                .addField("**Input Method:**", `\`\`\`${data.InputMethod}\`\`\``)
                .setFooter(client.getFooter("ID: " + user.id, user.displayAvatarURL({dynamic: true})))
        ]
      }).catch(() => null)
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

