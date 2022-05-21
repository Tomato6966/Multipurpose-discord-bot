const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `cleareq`,
  category: `👀 Filter`,
  aliases: [`ceq`, `reseteq`, `clearequalizer`, `resetequalizer`, `restoreequalizer`, `req`],
  description: `Clears the Equalizer`,
  usage: `clearEQ`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      player.clearEQ();
      player.set("eq", "💣 None");
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable1"]))
        .addField(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variablex_2"]),eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable2"]))
        .addField(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variablex_3"]),eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable4"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable5"]))
      ]});
    }
  }
};

