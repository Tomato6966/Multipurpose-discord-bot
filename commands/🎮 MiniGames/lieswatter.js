const { LieSwatter } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "lieswatter",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    usage: "lieswatter --> Play the Game",
    type: "buttons",
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