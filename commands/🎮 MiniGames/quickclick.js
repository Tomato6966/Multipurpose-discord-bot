const { QuickClick } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);

module.exports = {
    name: "quickclick",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    aliases: ["quickclicker"],
    type: "buttons",
    usage: "quickclick --> Play the Game",
     run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        
        if(GuildSettings.FUN === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        await QuickClick({
          message: message,
          embed: {
            title: 'Quick Click',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          time: 60000,
          waitMessage: 'The buttons may appear anytime now!',
          startMessage:
            'First person to press the correct button will win. You have **{{time}}**!',
          winMessage: 'GG, <@{{winner}}> pressed the button in **{{time}} seconds**.',
          loseMessage: 'No one pressed the button in time. So, I dropped the game!',
          emoji: '👆',
          ongoingMessage:
            "A game is already runnning in <#{{channel}}>. You can't start a new one!",
        });
        
    }
  }