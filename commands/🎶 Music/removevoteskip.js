/*const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `removevoteskip`,
  category: `🎶 Music`,
  aliases: [`rvs`, `removeskip`, `removevs`, `votestop`, `stopvote`],
  description: `Removes your Vote of the VoteSkip!`,
  usage: `removevoteskip`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
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
      //Check if there is a Dj Setup
      if (client.settings.get(message.guild.id, `djroles`).toString() !== ``) {
        let channelmembersize = channel.members.size;
        let voteamount = 0;
        if (channelmembersize <= 3) voteamount = 1;

        voteamount = Math.ceil(channelmembersize / 3);

        if (player.get(`vote-${message.author?.id}`)) {
          player.set(`vote-${message.author?.id}`, false)
          player.set(`votes`, String(Number(player.get(`votes`)) - 1));
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.color)

            .setTitle(eval(client.la[ls]["cmds"]["music"]["removevoteskip"]["variable1"]))
            .setDescription(eval(client.la[ls]["cmds"]["music"]["removevoteskip"]["variable2"]))
          ]});
        } else {
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)

            .setTitle(eval(client.la[ls]["cmds"]["music"]["removevoteskip"]["variable3"]))
            .setDescription(eval(client.la[ls]["cmds"]["music"]["removevoteskip"]["variable4"]))
          ]});
        }
      } else
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)

          .setTitle(eval(client.la[ls]["cmds"]["music"]["removevoteskip"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["removevoteskip"]["variable6"]))
        ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["removevoteskip"]["variable7"]))
      ]});
    }
  }
};
*/

