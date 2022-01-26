const { MessageEmbed } = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
    name: `removebotchat`,
    aliases: [`removebotchat`],
    category: `⚙️ Settings`,
    description: `Let's you delete the channel for the bot commands`,
    usage: `removebotchat`,
    memberpermissions: [`ADMINISTRATOR`],
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
    
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try{
      
      //get the mentioned channel
      let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
      if (!channel)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable1"]))
      ]});
      //try to find it, just incase user pings channel from different server
      try {
          message.guild.channels.cache.get(channel.id)
      } catch {
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable2"]))
        ]});
      }
      //if its not in the database return error
      if(!client.settings.get(message.guild.id,`botchannel`).includes(channel.id))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable3"]))
        ]});
      //remove the Channel from the Database
      client.settings.remove(message.guild.id, channel.id, `botchannel`);
      //these lines creates the string for all botchannels
      let leftb = ``;
      if(client.settings.get(message.guild.id, `botchannel`).join(``) ===``) leftb = `no Channels, aka all Channels are Bot Channels`
      else
      for(let i = 0; i < client.settings.get(message.guild.id, `botchannel`).length; i++){
        leftb += `<#` +client.settings.get(message.guild.id, `botchannel`)[i] + `> | `
      }
      //send informational message
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable4"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable5"]))
      ]});
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
						.setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable6"]))
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
