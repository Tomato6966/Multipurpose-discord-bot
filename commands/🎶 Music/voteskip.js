const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  autoplay
} = require(`../../handlers/functions`);
const { handlemsg } = require(`../../handlers/functions`);
module.exports = {
  name: `voteskip`,
  category: `🎶 Music`,
  aliases: [`vs`],
  description: `Skips the track, but if there is a DJ Setup u will have to vote first!`,
  usage: `voteskip`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      return message.reply("In development")
      //Check if there is a Dj Setup
      if (client.settings.get(message.guild.id, `djroles`).toString() !== ``) {

        let channelmembersize = channel.members.size;
        let voteamount = 0;
        if (channelmembersize <= 3) voteamount = 1;
        voteamount = Math.ceil(channelmembersize / 3);

        if (!player.get(`vote-${message.author?.id}`)) {
          player.set(`vote-${message.author?.id}`, true);
          player.set(`votes`, String(Number(player.get(`votes`)) + 1));
          if (voteamount <= Number(player.get(`votes`))) {
            message.reply({embeds : [new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable1"]))
              .setDescription(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable2"]))
            ]});
            if (player.queue.size == 0) {
              player.destroy();
            } else {
              player.stop();
            }
          } else {
            return message.reply({embeds : [new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable3"]))
              .setDescription(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable4"]))
            ]});
          }
        } else {
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable5"]))
            .setDescription(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable6"]))
          ]});
        }
      } else {
        //if ther is nothing more to skip then stop music and leave the Channel
        if (player.queue.size == 0) {
          //if its on autoplay mode, then do autoplay before leaving...
          if (player.get(`autoplay`)) return autoplay(client, player, `skip`);
          //stop playing
          player.destroy();
          //send success message
          return message.reply({embeds :[new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable7"]))
            .setColor(es.color)
            .setFooter(client.getFooter(es))
          ]});
        }
        //skip the track
        player.stop();
        //send success message
        return message.reply({embeds : [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable8"]))
          .setColor(es.color)
          .setFooter(client.getFooter(es))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["voteskip"]["variable9"]))
      ]});
    }
  }
};

