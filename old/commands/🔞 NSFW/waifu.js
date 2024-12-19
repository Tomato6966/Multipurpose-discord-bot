const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const config = require(`${process.cwd()}/botconfig/config.json`)
const {MessageEmbed} = require('discord.js')
module.exports = {
      name: "waifu",
      category: "🔞 NSFW",
      usage: "waifu",
      type: "anime",
      run: async (client, message, args, cmduser, text, prefix) => {
    
            let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
            if (!client.settings.get(message.guild.id, "NSFW")) {
                  const x = new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                  .setTitle(client.la[ls].common.disabled.title)
                  .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
                  return message.reply({embeds: [x]});
            }

            if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["2danal"]["variable1"])).then(msg => { message.react('💢'); msg.delete({ timeout: 3000 }) })

            let owo = (await neko.sfw.waifu());
            message.reply({content: `${owo.url}`});


      }
};