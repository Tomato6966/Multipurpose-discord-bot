const {
  MessageEmbed,
  MessageAttachment
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `nowplaying`,
  category: `🎶 Music`,
  aliases: [`np`, "trackinfo"],
  description: `Shows detailled information about the current Song`,
  usage: `nowplaying`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //if no current song return error
      if (!player.queue.current)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["nowplaying"]["variable1"]))
        ]});
        const embed = new MessageEmbed()
          .setAuthor(`${client.la[ls]["cmds"]["music"]["nowplaying"]["curt"]}`, message.guild.iconURL({
            dynamic: true
          }))
        .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setURL(player.queue.current.uri)
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["music"]["nowplaying"]["variable2"]))
        .addField(`${client.la[ls]["cmds"]["music"]["forward"]["field"]} `, createBar(player))
        .addField(`${client.la[ls]["cmds"]["music"]["musicsystem"]["dur"]} `, `\`${format(player.queue.current.duration).split(" | ")[0]}\` | \`${format(player.queue.current.duration).split(" | ")[1]}\``, true)
        .addField(`${emoji?.msg.song_by} By: `, `\`${player.queue.current.author}\``, true)
        .addField(`${client.la[ls]["cmds"]["music"]["musicsystem"]["ql"]} `, `\`${player.queue.length} ${client.la[ls]["cmds"]["music"]["musicsystem"]["songg"]}\``, true) 
        .setFooter(client.getFooter(`${client.la[ls]["cmds"]["music"]["musicsystem"]["by"]} ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
          dynamic: true
        })))
      //Send Now playing Message
      return message.reply({embeds :[embed]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["nowplaying"]["variable3"]))
      ]});
    }
  }
};

