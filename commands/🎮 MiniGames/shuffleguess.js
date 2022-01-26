const { ShuffleGuess } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var randomWords = require('random-words');

module.exports = {
    name: "shuffleguess",
    aliases: ["sg"],
    category: "🎮 MiniGames",
    description: "Allows you to play a Game1",
    usage: "shuffleguess --> Play the Game",
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