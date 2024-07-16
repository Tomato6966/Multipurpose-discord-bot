const { ChaosWords } = require('@m3rcena/weky');
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "chaoswords",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    usage: "chaoswords [wordcount] --> Play the Game",
    type: "buttons",
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        //executes if fun commands are disabled
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        var randomWords = require('random-words');
        const words = randomWords(args[0] && !isNaN(args[0]) && Number(args[0]) > 0 ? Number(args[0]) : 3) // generating 3 words
        await ChaosWords({
          interaction: message,
          client: client,
          embed: {
              title: 'ChaosWords',
              footer: {
                text: es.footertext
              },
              description: 'You have **{{time}}** to find the hidden words in the below sentence.',
              color: es.color,
              timestamp: new Date()
          },
          winMessage: 'GG, You won! You made it in **{{time}}**.',
          loseMessage: 'Better luck next time!',
          wrongWord: 'Wrong Guess! You have **{{remaining_tries}}** tries left.',
          correctWord: 'GG, **{{word}}** was correct! You have to find **{{remaining}}** more word(s).',
          time: 60000,
          words: words,
          charGenerated: 17,
          maxTries: 10,
          buttonText: 'Cancel',
          othersMessage: 'Only <@{{author}}> can use the buttons!'
      });
    }
  }