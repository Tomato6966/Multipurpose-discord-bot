var {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "setup-serverstats",
  category: "💪 Setup",
  aliases: ["setupserverstats", "serverstats-setup", "serverstatssetup", "setup-serverstatser", "setupserverstatser"],
  cooldown: 5,
  usage: "setup-serverstats  -->  Follow the Steps",
  description: "This Setup allows you to specify a Channel which Name should be renamed every 10 Minutes to a Member Counter of Bots, Users, or Members",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      message.reply(`Redirecting to: \`setup-membercount\` ...`).then((msg)=>{
        setTimeout(()=>{msg.delete().catch(() => {})}, 3000)
      }).catch(() => {})
      require("./setup-membercount").run(client, message, args, cmduser, text, prefix);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable15"]))
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
        ]
      });
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */