const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const radios = require(`../../botconfig/radiostations.json`);
const playermanager = require(`../../handlers/playermanager`);
const {
  stations
} = require(`../../handlers/functions`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `radio`,
  category: `🎶 Music`,
  aliases: [`stream`],
  description: `Plays a defined radiostream`,
  usage: `radio <1-183>`,
  parameters: {
    "type": "music",
    "activeplayer": false,
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
      //if no args send all stations
      if (!args[0]) return stations(client, config.prefix, message);
      //if not a number error
      if (isNaN(args[0])) {
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["radio"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["radio"]["variable2"]))
        ]});
      }
      //if the volume number is not valid
      if (Number(args[1]) > 150 || Number(args[1]) < 1)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["radio"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["radio"]["variable4"]))
        ]});
      //define the volume
      let volume;
      //if its not a number for volume, set it to 50
      if (isNaN(args[1])) {
        volume = 50;
      }
      //otherwise set it to the args
      else {
        volume = args[1];
      }
      //define args 2 of each single input
      let args2;
      function lengthUntil(array) {
        let lastitem = array[array.length - 1];
        let flatObject = [, ...Object.values(radios.REYFM), ...Object.values(radios.ILOVERADIO), ...Object.values(radios.EU), ...Object.values(radios.OTHERS)];
        let allArray = [];
        for (const element of flatObject){
          if(Array.isArray(element)) for (const e of element) allArray.push(e);
          else allArray.push(element);
        }
        return allArray.indexOf(lastitem);
      }


      if (Number([args[0]]) > 0 && Number([args[0]]) <= lengthUntil(radios.REYFM)) args2 = radios.REYFM[Number([args[0]]) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.REYFM) && Number([args[0]]) <= lengthUntil(radios.ILOVERADIO)) args2 = radios.ILOVERADIO[Number([args[0]]) - 1 - lengthUntil(radios.REYFM)].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.ILOVERADIO) && Number([args[0]]) <= lengthUntil(radios.EU.United_Kingdom)) args2 = radios.EU.United_Kingdom[Number([args[0]]) - 1 - lengthUntil(radios.ILOVERADIO)].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.United_Kingdom) && Number([args[0]]) <= lengthUntil(radios.EU.Austria)) args2 = radios.EU.Austria[Number([args[0]]) - 1 - lengthUntil(radios.EU.United_Kingdom)].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Austria) && Number([args[0]]) <= lengthUntil(radios.EU.Belgium)) args2 = radios.EU.Belgium[Number([args[0]]) - lengthUntil(radios.EU.Austria) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Belgium) && Number([args[0]]) <= lengthUntil(radios.EU.Bosnia)) args2 = radios.EU.Bosnia[Number([args[0]]) - lengthUntil(radios.EU.Belgium) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Bosnia) && Number([args[0]]) <= lengthUntil(radios.EU.Czech)) args2 = radios.EU.Czech[Number([args[0]]) - lengthUntil(radios.EU.Bosnia) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Czech) && Number([args[0]]) <= lengthUntil(radios.EU.Denmark)) args2 = radios.EU.Denmark[Number([args[0]]) - lengthUntil(radios.EU.Czech) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Denmark) && Number([args[0]]) <= lengthUntil(radios.EU.Germany)) args2 = radios.EU.Germany[Number([args[0]]) - lengthUntil(radios.EU.Denmark) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Germany) && Number([args[0]]) <= lengthUntil(radios.EU.Hungary)) args2 = radios.EU.Hungary[Number([args[0]]) - lengthUntil(radios.EU.Germany) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Hungary) && Number([args[0]]) <= lengthUntil(radios.EU.Ireland)) args2 = radios.EU.Ireland[Number([args[0]]) - lengthUntil(radios.EU.Hungary) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Ireland) && Number([args[0]]) <= lengthUntil(radios.EU.Italy)) args2 = radios.EU.Italy[Number([args[0]]) - lengthUntil(radios.EU.Ireland) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Italy) && Number([args[0]]) <= lengthUntil(radios.EU.Luxembourg)) args2 = radios.EU.Luxembourg[Number([args[0]]) - lengthUntil(radios.EU.Italy) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Luxembourg) && Number([args[0]]) <= lengthUntil(radios.EU.Romania)) args2 = radios.EU.Romania[Number([args[0]]) - lengthUntil(radios.EU.Luxembourg) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Romania) && Number([args[0]]) <= lengthUntil(radios.EU.Serbia)) args2 = radios.EU.Serbia[Number([args[0]]) - lengthUntil(radios.EU.Romania) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Serbia) && Number([args[0]]) <= lengthUntil(radios.EU.Spain)) args2 = radios.EU.Spain[Number([args[0]]) - lengthUntil(radios.EU.Serbia) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Spain) && Number([args[0]]) <= lengthUntil(radios.EU.Sweden)) args2 = radios.EU.Sweden[Number([args[0]]) - lengthUntil(radios.EU.Spain) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Sweden) && Number([args[0]]) <= lengthUntil(radios.EU.Ukraine)) args2 = radios.EU.Ukraine[Number([args[0]]) - lengthUntil(radios.EU.Sweden) - 1].split(` `);
      else if (Number([args[0]]) > lengthUntil(radios.EU.Ukraine) && Number([args[0]]) <= lengthUntil(radios.OTHERS.request)) args2 = radios.OTHERS.request[Number([args[0]]) - lengthUntil(radios.EU.Ukraine) - 1].split(` `);
      //if not found send an error
      else
        return message.channel.send({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`${emoji.msg.ERROR} Error | Radio Station not found`)
          .setDescription(`Please use a Station between \`1\` and \`${lengthUntil(radios.OTHERS.request)}\``)
        ]});
      //get song information of it
      const song = {
        title: args2[0].replace(`-`, ` `),
        url: args2[1]
      };
      //define an embed
      let embed = new MessageEmbed()
        .setColor(es.color)

        .setTitle(`Searching: ${emoji?.msg.search}` + song.title)
      try {
        embed.setURL(song.url)
      } catch {}
      //send the message of the searching
      message.reply({embeds :[embed]})
      //play the radio but make the URL to an array ;) like that: [ `urlhere` ]
      playermanager(client, message, Array(song.url), `song:radio`);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["radio"]["variable7"]))
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
