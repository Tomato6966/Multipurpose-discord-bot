const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const config = require(`../../botconfig/config.json`)
const {
  MessageEmbed, MessageAttachment
} = require('discord.js')
var superagent = require('superagent');

module.exports = {
  name: "bj",
  category: "🔞 NSFW",
  usage: "bj",
  type: "anime",
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
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))
    superagent.get('https://nekos.life/api/v2/img/blowjob')
      .end((err, response) => {
        message.reply({
          content: `${response.body.url}`
        });
      });
  }
};