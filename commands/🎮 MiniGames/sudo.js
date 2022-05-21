
const { Sudo } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);

module.exports = {
    name: "sudo",
    category: "🎮 MiniGames",
    description: "Allows you to play a Game1",
    usage: "sudo @MEMBER <TEXT> --> Play the Game",
    type: "text",
     run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        
        if(GuildSettings.FUN === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
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