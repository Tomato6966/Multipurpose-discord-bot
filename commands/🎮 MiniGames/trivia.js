const { Trivia } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "trivia",
    category: "🎮 MiniGames",
    description: "Allows you to play a Game1",
    usage: "trivia --> Play the Game",
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
        await Trivia({
          message: message,
          embed: {
            title: 'Trivia',
            description: 'You only have **{{time}}** to guess the answer!',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          difficulty: 'medium',
          thinkMessage: 'I am thinking',
          winMessage:
            'GG, It was **{{answer}}**. You gave the correct answer in **{{time}}**.',
          loseMessage: 'Better luck next time! The correct answer was **{{answer}}**.',
          emojis: {
            one: '1️⃣',
            two: '2️⃣',
            three: '3️⃣',
            four: '4️⃣',
          },
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          returnWinner: false,
        });
        
         
    }
  }