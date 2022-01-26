
const { Sudo } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "sudo",
    category: "🎮 MiniGames",
    description: "Allows you to play a Game1",
    usage: "sudo @MEMBER <TEXT> --> Play the Game",
    type: "text",
     run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        const opponent = message.mentions.members.first();
        if (!opponent) return message.reply(eval(client.la[ls]["cmds"]["minigames"]["sudo"]["variable1"]));
        if (!args[1]) return message.reply(eval(client.la[ls]["cmds"]["minigames"]["sudo"]["variable2"]));
        await Sudo({
          message: message,
          member: opponent,
          text: args.slice(1).join(" "),
          deleteMessage: false
        });
         
    }
  }