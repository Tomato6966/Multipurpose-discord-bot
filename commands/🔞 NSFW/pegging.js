const Discord = require('discord.js')
const {
      MessageEmbed
} = require('discord.js')
const config = require(`${process.cwd()}/botconfig/config.json`)

const CmdName = require("path").parse(__filename).name;
module.exports = {
      name: `${CmdName}`,
      category: "🔞 NSFW",
      usage: `${CmdName}`,
      aliases: ["petting"],
      type: "real",
      run: async (client, message, args, cmduser, text, prefix) => {
            let es = client.settings.get(message.guild.id, "embed");
            let ls = client.settings.get(message.guild.id, "language")
            let files = require(`./db/${CmdName.replace("-db", "")}.json`);
            let link = files[Math.floor(Math.random() * files.length)];
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
            message.reply({
                  content: `${link}`
            });
      }
};