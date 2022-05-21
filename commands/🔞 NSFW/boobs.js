const superagent = require("node-fetch");
const Discord = require('discord.js')

const rp = require('request-promise-native');
const config = require(`../../botconfig/config.json`)
const {
  MessageEmbed, MessageAttachment
} = require('discord.js')
module.exports = {
  name: "boobs",
  category: "🔞 NSFW",
  description: "Sends boobs",
  usage: "boobs",
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
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))
    return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function (res) {
      return rp.get({
        url: 'http://media.oboobs.ru/' + res[0].preview,
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