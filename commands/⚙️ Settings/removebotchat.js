const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
    name: `removebotchat`,
    aliases: [`removebotchat`],
    category: `⚙️ Settings`,
    description: `Let's you delete the channel for the bot commands`,
    usage: `removebotchat`,
    memberpermissions: [`ADMINISTRATOR`],
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
      
    try{
      //get the mentioned channel
      let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
      if (!channel)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable1"]))
        ]});
      //try to find it, just incase user pings channel from different server
      if(!message.guild.channels.cache.get(channel.id))    
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable2"]))
        ]});
      let botchannel = GuildSettings.botchannel;
      //if its not in the database return error
      if(!botchannel.includes(channel.id))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["removebotchat"]["variable3"]))
        ]});
      
      //remove the Channel from the Database
      let index = botchannel.indexOf(channel.id);
      if(index > -1) botchannel.splice(index, 1);
      await client.settings.set(`${message.guild.id}.botchannel`, botchannel);
      botchannel = await client.settings.get(`${message.guild.id}.botchannel`)
      //these lines creates the string for all botchannels
      let leftb = botChannels.length == 0 ? `no Channels, aka all Channels are Bot Channels`: botChannels.map(b => `<#${b}>`).join(" | ");
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

