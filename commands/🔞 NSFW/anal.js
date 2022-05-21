const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const config = require(`../../botconfig/config.json`)
const {
  MessageEmbed, MessageAttachment
} = require('discord.js')
module.exports = {
  name: "anal",
  category: "🔞 NSFW",
  usage: "anal",
  type: "real",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    if(GuildSettings.NSFW === false) {
      const x = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
          prefix: prefix
        }))
      return message.reply({
        embeds: [x]
      });
    }


    if (!message.channel.nsfw) {
      message.react('💢');

      return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable1"]))
        .then(async (msg) => {
          msg.delete({
            timeout: 3000
          })
        })

    }
    var superagent = require('superagent');
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))

    superagent.get('https://nekobot.xyz/api/image').query({
      type: 'anal'
    }).end((err, response) => {
      message.reply({
        content: `${response.body.message}`
      });
    });

  }
};