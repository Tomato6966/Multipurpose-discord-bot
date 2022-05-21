const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { swap_pages } = require(`../../handlers/functions`)
module.exports = {
  name: "showblacklist",
  category: "🔰 Info",
  aliases: ["blacklist", "blacklistedwords", "bwords"],
  cooldown: 2,
  usage: "showblacklist",
  description: "Shows all blacklisted Words!",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let words = await client.blacklist.get(message.guild.id + ".words");
      if(!words || words.length <= 0) words = ["No Blacklisted Words added yet!"]
      return swap_pages(client, message, `${words.map(word => `\`${word}\``.split("`").join("\`"))}`, `${message.guild.name} | ${client.la[ls].cmds.info.showblacklist.info}`)
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}

