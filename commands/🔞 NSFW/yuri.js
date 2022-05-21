const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const {
      MessageEmbed
} = require('discord.js')
const config = require(`../../botconfig/config.json`)
module.exports = {
      name: "yuri",
      category: "🔞 NSFW",
      usage: "yuri",
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
            let owo = (await neko.nsfw.yuri());
            message.reply({
                  content: `${owo.url}`
            });
      }
};