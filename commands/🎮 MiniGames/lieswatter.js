const { LieSwatter } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
module.exports = {
    name: "lieswatter",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    usage: "lieswatter --> Play the Game",
    type: "buttons",
     run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        
        if(GuildSettings.FUN === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        const { LieSwatter } = require("weky")
        await LieSwatter({
          message: message,
          embed: {
            title: 'Lie Swatter',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          thinkMessage: 'I am thinking',
          winMessage:
            'GG, It was a **{{answer}}**. You got it correct in **{{time}}**.',
          loseMessage: 'Better luck next time! It was a **{{answer}}**.',
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          buttons: { true: 'Truth', lie: 'Lie' },
        });
    }
  }