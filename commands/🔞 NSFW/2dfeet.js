const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const config = require(`../../botconfig/config.json`)
const {
  MessageEmbed, MessageAttachment
} = require('discord.js')
module.exports = {
  name: "2dfeet",
  category: "🔞 NSFW",
  usage: "2dfeet",
  type: "anime",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    if(GuildSettings.NSFW === false) {
      const x = new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.disabled.title)
      .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      return message.reply({embeds: [x]});
    }
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["2danal"]["variable1"])).then(async (msg) => { message.react('💢'); msg.delete({ timeout: 3000 }) })
    let owo = (await neko.nsfw.feet());
    message.reply({content: `${owo.url}`});
  }
};