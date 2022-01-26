const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const {
  MessageEmbed
} = require('discord.js')
const config = require(`${process.cwd()}/botconfig/config.json`)
var superagent = require('superagent');

module.exports = {
  name: "hass",
  category: "🔞 NSFW",
  usage: "hass",
  type: "anime",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "NSFW")) {
      const x = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
          prefix: prefix
        }))
      return message.reply({
        embeds: [x]
      });
    }
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["pussy"]["variable2"]))

    superagent.get('https://nekobot.xyz/api/image').query({
      type: 'hass'
    }).end((err, response) => {
      message.reply({
        content: `${response.body.message}`
      });
    });

  }
};