const superagent = require("node-fetch");
const Discord = require('discord.js')
const {
  MessageEmbed,
  MessageAttachment
} = require('discord.js')
const rp = require('request-promise-native');
const config = require(`${process.cwd()}/botconfig/config.json`)
module.exports = {
  name: "ass",
  category: "🔞 NSFW",
  description: "Sends ass",
  usage: "ass",
  type: "real",
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
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function (res) {
      return rp.get({
        url: 'http://media.obutts.ru/' + res[0].preview,
        encoding: null
      });
    }).then(function (res) {
      let attachment = new MessageAttachment(res, "file.png");
      message.reply({
        files: [attachment]
      });
    });
  }
};