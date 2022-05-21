const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `removedupes`,
  category: `🎶 Music`,
  aliases: [`removedupe`, `removedupetrack`, `rdt`, `removeduplicated`, `removeduplicateds`],
  description: `Removes all duplicated tracks in the Queue`,
  usage: `removedupes`,
  cooldown: 10,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queue",
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
      //make a new array of each single song which is not a dupe
      let tracks = player.queue;
      const newtracks = [];
      for (let i = 0; i < tracks.length; i++) {
        let exists = false;
        for (j = 0; j < newtracks.length; j++) {
          if (tracks[i].uri === newtracks[j].uri) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          newtracks.push(tracks[i]);
        }
      }
      //clear the Queue
      player.queue.clear();
      //now add every not dupe song again
      for (const track of newtracks)
        player.queue.add(track);
      //Send Success Message
      return message.reply({embeds : [new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["music"]["removedupes"]["variable1"]))
        .setColor(es.color)

      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["removedupes"]["variable2"]))
      ]});
    }
  }
};

