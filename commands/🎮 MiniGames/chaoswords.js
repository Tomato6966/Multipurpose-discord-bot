const { ChaosWords } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
module.exports = {
    name: "chaoswords",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    usage: "chaoswords [wordcount] --> Play the Game",
    type: "buttons",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        //executes if fun commands are disabled
        if(GuildSettings.FUN === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        var randomWords = require('random-words');
        const words = randomWords(args[0] && !isNaN(args[0]) && Number(args[0]) > 0 ? Number(args[0]) : 3) // generating 3 words
        await ChaosWords({
          message: message,
          embed: {
              title: 'ChaosWords',
              footer: es.footertext,
              description: 'You have **{{time}}** to find the hidden words in the below sentence.',
              color: es.color,
              field1: 'Sentence:',
              field2: 'Words Found/Remaining Words:',
              field3: 'Words found:',
              field4: 'Words:',
              timestamp: true
          },
          winMessage: 'GG, You won! You made it in **{{time}}**.',
          loseMessage: 'Better luck next time!',
          wrongWordMessage: 'Wrong Guess! You have **{{remaining_tries}}** tries left.',
          correctWordMessage: 'GG, **{{word}}** was correct! You have to find **{{remaining}}** more word(s).',
          time: 60000,
          words: words,
          charGenerated: 17,
          maxTries: 10,
          buttonText: 'Cancel',
          othersMessage: 'Only <@{{author}}> can use the buttons!'
      });
    }
  }