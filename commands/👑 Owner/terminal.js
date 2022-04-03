const child = require("child_process");
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
  name: "terminal",
  category: "👑 Owner",
  aliases: ["terminal"],
  cooldown: 2,
  usage: "terminal",
  type: "bot",
  description: "Restarts the Bot, if it`s not working as intended or so..",
  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
   run: async (client, message, args, cmduser, text, prefix) => {
    if(message.author.id !== '495255698548981770') return;
 
    const command = args.join(" ");
    if(!command)
    return message.reply('Please specify a command to execute!');
    child.exec(command, (err, result) => {
        if (err) return console.error(err);
        message.channel.send(result.slice(0, 2000), { code: "js"});
        });
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