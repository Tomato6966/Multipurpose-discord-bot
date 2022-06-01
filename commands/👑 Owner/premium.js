var {
    MessageEmbed
  } = require(`discord.js`);
  var Discord = require(`discord.js`);
  var config = require(`../../botconfig/config.json`);
  var ee = require(`../../botconfig/embed.json`);
  var emoji = require(`../../botconfig/emojis.json`);
  var {
    dbEnsure, isValidURL
  } = require(`../../handlers/functions`);
  module.exports = {
    name: "premium",
    category: "👑 Owner",
    aliases: [],
    cooldown: 5,
    usage: "premium <guild_id>",
    type: "bot",
    description: "Gives premium for guild",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        if (!config.ownerIDS.some(r => r.includes(message.author?.id)))
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable2"]))
        ]});
        if(!args[0]){
            var tempmsg = await message.reply("No guild is provided, using this guild")
            var guild = message.guild.id
        }else{
            var tempmsg = await message.reply("Adding this to premium guilds")
            var guild = args[0]
        }
      try {
        var guildData = await client.premium.get(`${guild}.enabled`)
        if(guildData === true){
            await client.premium.set(`${guild}.enabled`, false);
            return tempmsg.edit(":x: Disabled premium for this guild")
        }else{
            await client.premium.set(`${guild}.enabled`, true);
            return tempmsg.edit(":white_check_mark: Enabled premium for this guild")
        }
      } catch (e) {
        console.log(String(e.stack).dim.bgRed)
        return message.reply("Error");
      }
    },
  };

  /*

in top of run to make premium cmd


    var guildpremData = await client.premium.get(`${message.guild.id}.enabled`)
    if(guildpremData === false){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.premium.title)
        .setDescription(handlemsg(client.la[ls].common.premium.description))
      ]});
    }
  */
  