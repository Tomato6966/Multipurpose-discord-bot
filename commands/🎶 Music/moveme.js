const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  format,
  arrayMove
} = require(`../../handlers/functions`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `moveme`,
  category: `🎶 Music`,
  aliases: [`mm`, "mvm", "my", "mvy", "moveyou"],
  description: `Moves you to the BOT, if playing something`,
  usage: `move`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false,
    "notsamechannel": true
  },
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      let channel = message.member.voice.channel;
      let botchannel = message.guild.me.voice.channel;
      if (!botchannel)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable1"]))
        ]});
      if (!channel)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable2"]))
        ]});
      if (botchannel.userLimit >= botchannel.members.length)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable3"]))
        ]});
      if (botchannel.id == channel.id)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable4"]))
        ]});
      message.member.voice.setChannel(botchannel);
      message.react("👌").catch(e => {});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable5"]))
      ]});
    }
  }
};

