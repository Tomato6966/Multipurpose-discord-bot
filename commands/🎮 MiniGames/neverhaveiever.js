const { NeverHaveIEver } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);

module.exports = {
    name: "neverhaveiever",
    category: "🎮 MiniGames",
    description: "Plays a Game",
    aliases: ["neverever"],
    usage: "neverhaveiever --> Play the Game",
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
        await NeverHaveIEver({
          message: message,
          embed: {
            title: 'Never Have I Ever',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          thinkMessage: 'I am thinking',
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          buttons: { optionA: 'Yes', optionB: 'No' },
        });
        
    }
  }