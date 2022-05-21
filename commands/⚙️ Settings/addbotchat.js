const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
    name: `addbotchat`,
    aliases: [`addbotchannel`],
    category: `⚙️ Settings`,
    description: `Let's you enable a bot only chat where the community is allowed to use commands`,
    usage: `addbotchat <#chat>`,
    memberpermissions: [`ADMINISTRATOR`],
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    try {
      //get the channel from the Ping
      let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
      //if no channel pinged return error
      if (!channel)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["variable1"]))
      ]});
      //try to find it, just incase user pings channel from different server
      try {
          message.guild.channels.cache.get(channel.id)
      } catch {
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["variable2"]))
        ]});
      }
      let botChannels = GuildSettings.botchannel;
      //if its already in the database return error
      if(botChannels.includes(channel.id))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["variable3"]))
        ]});
      //push it into the database
      await client.settings.push(`${message.guild.id}.botchannel`, channel.id);
      //these lines create the string of the Bot Channels
      botChannels = await client.settings.get(`${message.guild.id}.botchannel`);
      let leftb = botChannels.length == 0 ? `no Channels, aka all Channels are Bot Channels`: botChannels.map(b => `<#${b}>`).join(" | ");
      //send informational message
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["variable4"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["variable5"]))
      ]});
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
						.setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["variable6"]))
        ]});
    }
  }
};

