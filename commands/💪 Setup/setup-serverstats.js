var {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
module.exports = {
  name: "setup-serverstats",
  category: "💪 Setup",
  aliases: ["setupserverstats", "serverstats-setup", "serverstatssetup", "setup-serverstatser", "setupserverstatser"],
  cooldown: 5,
  usage: "setup-serverstats  -->  Follow the Steps",
  description: "This Setup allows you to specify a Channel which Name should be renamed every 10 Minutes to a Member Counter of Bots, Users, or Members",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {

    try {
      message.reply(`Redirecting to: \`setup-membercount\` ...`).then((msg)=>{
        setTimeout(()=>{msg.delete().catch(() => null)}, 3000)
      }).catch(() => null)
      require("./setup-membercount").run(client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable15"]))
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
        ]
      });
    }
  },
};
