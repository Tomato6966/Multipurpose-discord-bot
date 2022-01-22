var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-boostlog",
  category: "💪 Setup",
  aliases: ["setupboostlog", "boostlogsetup"],
  cooldown: 5,
  usage: "setup-boostlog <#Channel/disable>",
  description: "Log the Server Boosts",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    
    try {
      client.settings.ensure(message.guild.id, {
        boost: {
          enabled: false,
          message: "",
        }
      })
      const channel = message.mentions.channels.first();

      if(!args[0]) return message.reply("Usage: setup-boostlog <#Channel/disable>");
      if(args[0].toLowerCase() == "disable") {
        client.settings.set(message.guild.id, false, "boost.log")
        message.reply("Disabled the boost log");
      }
      else if(channel) {
        message.reply(`I will now log the boosts in <#${channel.id}>`.substring(0, 2000));
        client.settings.set(message.guild.id, channel.id, "boost.log")
      } else {
        message.reply(":x: You have to ping a channel! Usage: setup-boostlog <#Channel/disable>")
      }
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */