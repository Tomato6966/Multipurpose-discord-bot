const {
  MessageEmbed,
  splitMessage
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require('fs');
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
const {
  inspect
} = require(`util`);
module.exports = {
  name: `deployslash`,
  type: "info",
  category: `👑 Owner`,
  aliases: [`deployslash`, "deploy", "loadslash", "deployslashcommands", "deployslashcmds", "loadslashcommands", "loadslashcmds"],
  description: `Deploy and Enable the Slash Commands of this Bot! Either GLOBALLY or for ONE GUILD ONLY`,
  usage: `deployslash [GUILDID]`,
  cooldown: 360,
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed"); let ls = client.settings.get(message.guild.id, "language")
    if (message.author.id != "442355791412854784")
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.user.username, es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL())
          .setTitle("Only Tomato is allowed to deploy the SLASH-COMMANDS")
          .setDescription(`Go to the [Discord-Server](https://discord.gg/milrato), open a Ticket and ask for it!`)
        ]
      });
    try {
      let loadSlashsGlobal = true;
      let guildId = args[0];
      if(guildId){
        let guild = client.guilds.cache.get(guildId);
        if(guild){
          loadSlashsGlobal = false;
          guildId = guild.id;
        }
      }
      if(loadSlashsGlobal){
        let themsg = await message.reply(`<a:Loading:833101350623117342> **Attempting to set the Global Slash Commands in \`${client.guilds.cache.size} Guilds\`...**`)
        client.application.commands.set(client.allCommands)
          .then(slashCommandsData => {
            themsg.edit(`**\`${slashCommandsData.size} Slash-Commands\`** (\`${slashCommandsData.map(d => d.options).flat().length} Subcommands\`) loaded for all **possible Guilds**\n> Those Guilds are those, who invited me with the **SLASH COMMAND INVITE LINK** from \`${prefix}invite\`\n> *Because u are using Global Settings, it can take up to 1 hour until the Commands are changed!*`); 
          }).catch(() => {});
      } else {
        let guild = client.guilds.cache.get(guildId);
        let themsg = await message.reply(`<a:Loading:833101350623117342> **Attempting to set the GUILD Slash Commands in \`${guild.name}\`...**`)
        await guild.commands.set(client.allCommands).then((slashCommandsData) => {
          themsg.edit(`**\`${slashCommandsData.size} Slash-Commands\`** (\`${slashCommandsData.map(d => d.options).flat().length} Subcommands\`) loaded for all **${guild.name}**\n> Those Guilds are those, who invited me with the **SLASH COMMAND INVITE LINK** from \`${prefix}invite\`\n> *Because u are using Global Settings, it can take up to 1 hour until the Commands are changed!*`); 
        }).catch((e) => {
          console.log(e)
          themsg.edit(`**Could not load the Slahs Commands for ${guild.name}**\n\n**Did you invite me with this Link in that Server?**\n> $https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot%20applications.commands`)
        });
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable6"]))
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
