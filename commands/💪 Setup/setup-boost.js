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
  name: "setup-boost",
  category: "💪 Setup",
  aliases: ["setupboost", "boostsetup"],
  cooldown: 5,
  usage: "setup-boost <Message/disable>",
  description: "Send a Boost 'Thank you' Message in the dm of a booster",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      await dbEnsure(client.settings, message.guild.id, {
        boost: {
          enabled: false,
          message: "",
          log: false,
          stopBoost: "<a:Server_Boosts:950881838539354173> {member} **stopped Boosting us..** <:Cat_Sad:950882209512951869>",
          startBoost: "<a:Server_Boosts:950881838539354173> {member} **has boosted us!** <a:Light_Saber_Dancce:950882992161697853>",
          againBoost: "<a:Server_Boosts:950881838539354173> {member} **has boosted us again!** <:Tada_WON:950883211347640401>",
        }
      })

      if(!args[0]) return message.reply("Usage: setup-boost <Message/disable>");
      if(args[0].toLowerCase() == "disable") {
        await client.settings.set(message.guild.id+".boost.enabled", false)
        message.reply("Disabled the boost messages");
      }
      else {
        message.reply(`I will send a dm to each user if they boost this server with this message:\n${args.join(" ")}`.substring(0, 2000));
        await client.settings.set(message.guild.id+".boost.enabled", true)
        client.settings.set(message.guild.id+".boost.message", args.join(" "))
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
      ]});
    }
  },
};
