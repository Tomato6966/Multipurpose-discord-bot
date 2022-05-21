var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-auditlog",
  category: "💪 Setup",
  aliases: ["setupauditlog", "auditlog-setup", "auditlogsetup"],
  cooldown: 5,
  usage: "setup-auditlog  -->  Follow the Steps",
  description: "Activate a Logger which logs every action in your Server which could be critical!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    try {
      message.reply(`Redirecting to: \`setup-logger\` ...`).then((msg)=>{
        setTimeout(()=>{msg.delete().catch(() => null)}, 3000)
      }).catch(() => null)
      require("./setup-logger").run(client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable13"]))]
      });
    }
  },
};

