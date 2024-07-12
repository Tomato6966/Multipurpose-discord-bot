const { LieSwatter } = require('@m3rcena/weky')
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
        await LieSwatter({
          interaction: message,
          client: client,
          embed: {
            title: 'Lie Swatter',
            color: es.color,
            footer: {
              text: es.footertext
            },
            timestamp: new Date(),
          },
          thinkMessage: 'I am thinking...',
          winMessage: 'GG, It was a **{{answer}}**. You got it correct in **{{time}}**.',
          loseMessage: 'Better luck next time! It was a **{{answer}}**.',
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          buttons: { true: 'Truth', lie: 'Lie' },
          time: 60000
        });
    }
  }