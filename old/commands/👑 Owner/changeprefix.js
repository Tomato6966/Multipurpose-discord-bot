const { MessageEmbed } = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require("fs")
module.exports = {
    name: `changeprefix`,
    category: `👑 Owner`,
    type: "bot",
    description: `Let's you change the Prefix of the BOT GLOBALLY (Unless a Guild has a different Setting)`,
    usage: `changeprefix <NEW PREFIX>`,
    memberpermissions: [`ADMINISTRATOR`],
    run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable2"]) + `\n\nIf you want to change the Settings for **this Server** then type use the \`${prefix}prefix <newprefix>\` Command`)
        ]});
    try {
    //if no args return error
    if (!args[0])
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable1"]))
        .setDescription(`Current global Prefix: \`${config.prefix}\``)
      ]});
    //if there are multiple arguments
    if (args[1])
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable3"]))
      ]});
    //if the prefix is too long
    if (args[0].length > 5)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable4"]))
      ]});
    let status = config;
    status.prefix = args[0];
    fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
      if (e) {
        console.log(e.stack ? String(e.stack).dim : String(e).dim);
        return message.channel.send({embeds: [new MessageEmbed()
          .setFooter(client.getFooter(es))
          .setColor(es.wrongcolor)
          .setTitle(`<:no:833101993668771842> Something went wrong`)
          .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
        ]})
      }
      return message.channel.send({embeds: [new MessageEmbed()
        .setFooter(client.getFooter(es))
        .setColor(es.color)
        .setTitle(`<a:yes:833101995723194437> Successfully changed the Prefix`)
        .setDescription(`**To change it in this Server use the: \`${prefix}prefix <newprefix>\` Command!**`)
        ]})
    });
  } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable6"]))
      ]});
  }
  }
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
