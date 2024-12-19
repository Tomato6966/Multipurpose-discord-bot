const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `speed`,
  category: `👀 Filter`,
  aliases: [``],
  description: `Allows you to change the SPEED of the TRACK`,
  usage: `speed <Multiplicator>   |   Multiplicator could be: 0  -  3`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, cmduser, text, prefix, player) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      if (!args.length)
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable2"]))
        ]});
      if(isNaN(args[0]))
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(ee.wrongcolor)
          
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable4"]))
        ]});
      if(Number(args[0]) >= 3 || Number(args[0]) <= 0)
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(ee.wrongcolor)
          
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable6"]))
        ]});
      player.node.send({
        op: "filters",
        guildId: message.guild.id,
        equalizer: player.bands.map((gain, index) => {
            var Obj = {
              "band": 0,
              "gain": 0,
            };
            Obj.band = Number(index);
            Obj.gain = Number(gain)
            return Obj;
          }),
        timescale: {
              "speed": Number(args[0]),
              "pitch": 1.0,
              "rate": 1.0
          },
      });
      player.set("filter", "📉 Rate");
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable7"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable8"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(ee.wrongcolor)
        
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable9"]))
      ]});
    }
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
