const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "fnshop",
  aliases: ["fortniteshop", "fshop"],
  category: "🔰 Info",
  description: "Shows the current Fortnite Shop",
  usage: "fnshop",
  type: "games",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let themsg = await message.reply("<a:Loading:833101350623117342> Getting the Shop-Data")
      const shop = new Canvas.FortniteShop();
      const image = await shop.setToken(process.env.fnbr || config.fnbr).setBackground("#23272A").toAttachment();
      let attachment = new Discord.MessageAttachment(image, "FortniteShop.png");
      themsg.edit({content: "Todays Fortnite Shop:", files: [attachment]}).catch(()=>{

      })
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
      ]});
    }
  }
}
/*
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
