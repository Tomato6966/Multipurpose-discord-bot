const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const {
  MessageEmbed
} = require('discord.js')
const config = require(`${process.cwd()}/botconfig/config.json`)
module.exports = {
  name: "nekoapiclassic",
  category: "🔞 NSFW",
  description: "Sends a random image from the neko.life api nsfw classic endpoint",
  usage: "nekoapiclassic",
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
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))

    let owo = (await neko.nsfw.classic());
    message.reply({
      content: `${owo.url}`
    });
  }
};