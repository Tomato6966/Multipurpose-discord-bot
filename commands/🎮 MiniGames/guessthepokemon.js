const { GuessThePokemon } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "guessthepokemon",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    aliases: ["guesspokemon"],
    usage: "guessthepokemon --> Play the Game",
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
        await GuessThePokemon({
          message: message,
          embed: {
            title: 'Guess The Pokémon',
            description:
              '**Type:**\n{{type}}\n\n**Abilities:**\n{{abilities}}\n\nYou only have **{{time}}** to guess the pokémon.',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          thinkMessage: 'I am thinking',
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          winMessage:
            'GG, It was a **{{answer}}**. You got it correct in **{{time}}**.',
          loseMessage: 'Better luck next time! It was a **{{answer}}**.',
          time: 60000,
          incorrectMessage: "No {{author}}! The pokémon isn't `{{answer}}`",
          buttonText: 'Cancel',
        });
        
        
    }
  }