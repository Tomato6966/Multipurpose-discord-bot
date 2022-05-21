/*const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
    name: "togglerequestonly",
    aliases: ["togglerequest", "tro"],
    category: "⚙️ Settings",
    description: "Toggles if u are allowed to use MUSIC and FILTER Comamnds in different channels too! Default: true == Not allowed",
    usage: "togglerequestonly",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
      
    try{
      
      //set the new prefix
      client.settings.set(message.guild.id, !client.settings.get(message.guild.id, `requestonly`), `requestonly`);
      //return success embed
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["togglerequestonly"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["togglerequestonly"]["variable2"]))
      ]});
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
						.setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["togglerequestonly"]["variable3"]))
        ]});
    }
  }
};*/

