const { ShuffleGuess } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var randomWords = require('random-words');

module.exports = {
    name: "shuffleguess",
    aliases: ["sg"],
    category: "🎮 MiniGames",
    description: "Allows you to play a Game1",
    usage: "shuffleguess --> Play the Game",
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
        const word = randomWords();

        await ShuffleGuess({
          message: message,
          embed: {
            title: 'Shuffle Guess',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          word: ['Milrato'],
          button: { cancel: 'Cancel', reshuffle: 'Reshuffle' },
          startMessage:
            'I shuffled a word it is **`{{word}}`**. You have **{{time}}** to find the correct word!',
          winMessage:
            'GG, It was **{{word}}**! You gave the correct answer in **{{time}}.**',
          loseMessage: 'Better luck next time! The correct answer was **{{answer}}**.',
          incorrectMessage: "No {{author}}! The word isn't `{{answer}}`",
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          time: 60000,
        });
        
    }
  }