const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const customEmojis = require(`${process.cwd()}/botconfig/customEmojis.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
    name: "togglerequestonly",
    aliases: ["togglerequest", "tro"],
    category: "⚙️ Settings",
    description: "Toggles if u are allowed to use MUSIC and FILTER Commands in different channels too! Default: true == Not allowed",
    usage: "togglerequestonly",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, cmduser, text, prefix) => {
    
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try{
      
      //set the new prefix
      client.settings.set(message.guild.id, !client.settings.get(message.guild.id, `requestonly`), `requestonly`);
      //return success embed
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["togglerequestonly"]["variable1"].replace(":yes:", customEmojis.general.yes)))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["togglerequestonly"]["variable2"]))
      ]});
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
						.setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur.replace(":no:", customEmojis.general.no))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["togglerequestonly"]["variable3"]))
        ]});
    }
  }
};
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://discord.gg/milrato
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
