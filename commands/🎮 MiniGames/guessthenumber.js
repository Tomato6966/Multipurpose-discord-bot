const { GuessTheNumber } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "guessthenumber",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    aliases: ["guessnumber"],
    usage: "guessthenumber --> Play the Game",
    type: "text",
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
        await GuessTheNumber({
          message: message,
          embed: {
            footer: es.footertext,
            title: 'Guess The Number',
            description: 'You have **{{time}}** to guess the number. (1-100)',
            color: es.color,
            timestamp: true,
          },
          publicGame: true,
          number: Math.floor(Math.random() * 100) + 1,
          time: 60000,
          winMessage: {
            publicGame:
              'GG, The number which I guessed was **{{number}}**. <@{{winner}}> made it in **{{time}}**.\n\n__**Stats of the game:**__\n**Duration**: {{time}}\n**Number of participants**: {{totalparticipants}} Participants\n**Participants**: {{participants}}',
            privateGame:
              'GG, The number which I guessed was **{{number}}**. You made it in **{{time}}**.',
          },
          loseMessage:
            'Better luck next time! The number which I guessed was **{{number}}**.',
          bigNumberMessage: 'No {{author}}! My number is greater than **{{number}}**.',
          smallNumberMessage:
            'No {{author}}! My number is smaller than **{{number}}**.',
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          buttonText: 'Cancel',
          ongoingMessage:
            "A game is already runnning in <#{{channel}}>. You can't start a new one!",
          returnWinner: false,
        });
        
    }
  }