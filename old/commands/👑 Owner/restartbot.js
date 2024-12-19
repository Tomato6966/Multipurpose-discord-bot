var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, isValidURL
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "restartbot",
  category: "👑 Owner",
  aliases: ["botrestart"],
  cooldown: 5,
  usage: "restartbot",
  type: "bot",
  description: "Restarts the Bot, if it`s not working as intended or so..",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      await message.reply("NOW RESTARTING!");
      require("child_process").exec(`pm2 restart ID_OF_THE_BOT_PROCESS_IN_PM2_LIST`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          message.reply({content : eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable4"])})
          return;
        }
        message.reply({content : eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable5"])})
      });
      message.reply({content : eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable6"])})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable7"]))
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