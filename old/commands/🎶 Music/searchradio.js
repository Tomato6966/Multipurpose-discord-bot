const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const radios = require(`../../botconfig/radiostations.json`);
const playermanager = require(`../../handlers/playermanager`);
const RadioBrowser = require('radio-browser')
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `searchradio`,
  category: `🎶 Music`,
  aliases: [`searchr`],
  description: `Searches for a Radio station`,
  usage: `searchradio `,
  parameters: {
    "type": "music",
    "activeplayer": false,
    "previoussong": false
  },
  type: "queue",
  run: async (client, message, args, cmduser, text, prefix, player) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //if no args send all stations
      if (!args[0]) return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable2"]))
      ]});
      if (!args[1]) return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable4"]))
      ]});

      let filter = false;
      switch (args[0].toLowerCase()) {
        case "tag":
        case "genre": {
          filter = {
            limit: 60, // list max 5 items
            by: 'tag', // search in tag
            searchterm: args.slice(1).join(" ") // term in tag
          }
        }
        break;
      case "name": {
        filter = {
          limit: 60, // list max 5 items
          by: 'name', // search in tag
          searchterm: args.slice(1).join(" ") // term in tag
        }
      }
      break;
      case "city": {
        filter = {
          limit: 60, // list max 5 items
          by: 'state', // search in tag
          searchterm: args.slice(1).join(" ") // term in tag
        }
      }
      break;
      case "country": {
        filter = {
          limit: 60, // list max 5 items
          by: 'country', // search in tag
          searchterm: args.slice(1).join(" ") // term in tag
        }
      }
      break;
      default:
        filter = false;
        break;
      }
      if (!filter) return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable5"]))
        .setDescription(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable6"]))
      ]});

      RadioBrowser.getStations(filter)
        .then(async data => {
          let string = "";
          let counter = 0;
          let array = [];

          for (const track of data) {
            string += `**${++counter})** [\`${String(track.name).substring(0, 15).split("[").join("{").split("]").join("}")}\`](${track.url})\n`
            if (counter % 10 === 0) {
              array.push(string);
              string = "";
            }
          }

          let embed = new MessageEmbed()
            .setTitle(`Search result for: 🔎 **\`${filter.searchterm}`.substring(0, 256 - 3) + "`**")
            .setColor(es.color)
            .setFooter(client.getFooter(`Search-Request by: ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
            })))

          for (const item of array) embed.addField("\u200b", item, true)

          message.reply({embeds : [embed]})

          await message.reply({embeds : [new MessageEmbed()
            .setColor(es.color)

            .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable7"]))
          ]})

          try {
            collected = await message.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 30e3,
              errors: ['time']
            });
          } catch (e) {
            if (!player.queue.current) player.destroy();
            return message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable8"]))
              .setColor(es.wrongcolor)

            ]});
          }
          const first = collected.first().content;
          if (first.toLowerCase() === 'end') {
            if (player && !player.queue.current) player.destroy();
            return message.reply({embeds : [new MessageEmbed()
              .setColor(es.wrongcolor)

              .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable9"]))
            ]});
          }
          const index = Number(first) - 1;
          if (isNaN(index))
            return message.reply({embeds : [new MessageEmbed()
              .setColor(es.wrongcolor)

              .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable10"]))
            ]});
          if (index < 0 || index > counter - 1)
            return message.reply({embeds :[new MessageEmbed()
              .setColor(es.wrongcolor)

              .setTitle(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable11"]))
            ]});

          playermanager(client, message, Array(data[index].url), `song:radio`);

        })
        .catch(e => {
          console.log(String(e.stack).dim.bgRed)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)

            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable12"]))
          ]});
        })
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["searchradio"]["variable13"]))
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
