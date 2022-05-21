const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `clearfilter`,
  category: `👀 Filter`,
  aliases: [`cf`],
  description: `Clears the Equalizer`,
  usage: `clearfilter`,
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
      });
      player.set("eq", "💣 None");
      player.set("filter", "💣 None");
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["clearfilter"]["variable1"]))
        .addField(eval(client.la[ls]["cmds"]["filter"]["clearfilter"]["variablex_2"]),eval(client.la[ls]["cmds"]["filter"]["clearfilter"]["variable2"]))
        .addField(eval(client.la[ls]["cmds"]["filter"]["clearfilter"]["variablex_3"]),eval(client.la[ls]["cmds"]["filter"]["clearfilter"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["clearfilter"]["variable4"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["clearfilter"]["variable5"]))
      ]});
    }
  }
};

