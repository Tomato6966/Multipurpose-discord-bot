const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "afkmusic",
  category: "⚙️ Settings",
  aliases: ["awayfromkeyboard", "24/7"],
  cooldown: 10,
  usage: "afkmusic",
  description: "Toggles if the Current Queue should be stated on 'afk' or not [DEFAULT: false]",
  memberpermissions: ["ADMINISTRATOR"],
  parameters: {"type":"music", "activeplayer": true, },
  type: "music",
  run: async (client, message, args, user, text, prefix, player) => {
    let settings = await client.settings.get(message.guild.id)
    let es = settings.embed;
    let ls = settings.language;
    try {
      await player.set(`afk`, !player.get(`afk`))
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["afk"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["afk"]["variable2"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["afk"]["variable3"]))
      ]});
    }
  }
}

