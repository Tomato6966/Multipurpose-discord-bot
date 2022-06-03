var { MessageEmbed } = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var radios = require(`../../botconfig/radiostations.json`);
var playermanager = require(`../../handlers/playermanager`);
var { stations, dbEnsure } = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
    name: "setup-radio",
    category: "💪 Setup",
    aliases: ["setupradio", "setup-waitingroom", "setupwaitingroom", "radio-setup", "radiosetup", "waitingroom-setup", "waitingroomsetup"],
    cooldown: 10,
    usage: "setup-radio <RadioStation Num.>   -->    while beeing in a radio station",
    description: "Manage the Waitingroom System / 24/7 Radio System",
    memberpermissions: ["ADMINISTRATOR"],
    type: "fun",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
      try{
        var adminroles = GuildSettings.adminroles ? GuildSettings.adminroles : []
        var { guild } = message;
        //get the channel instance from the Member
        var { channel } = message.member.voice;
        //if the member is not in a channel, return
        if (!channel)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable1"]))
          ]});
        //get the player instance
        var player = client.manager.players.get(message.guild.id);
        //if there is a player and they are not in the same channel, return Error
        if (player && player.state === "CONNECTED") await player.destroy();
        //if no args send all stations
        if (!args[0]) return stations(client, config.prefix, message);
        //if not a number error
        if (isNaN(args[0])) {
            return message.reply({embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable2"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable3"]))
            ]});
        }
        //if the volume number is not valid
        if (Number(args[1]) > 150 || Number(args[1]) < 1)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable4"]))
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable5"]))
          ]});
        //define the volume
        var volume;
        //if its not a number for volume, set it to 50
        if (isNaN(args[1])) {
            volume = 50;
        }
        //otherwise set it to the args
        else {
            volume = args[1];
        }
        //define args 2 of each single input
        var args2;
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
        var song = { title: args2[0].replace(`-`, ` `), url: args2[1] };
        //define an embed
        var embed = new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setTitle(`Searching: ${emoji?.msg.search}` + song.title)
          try{embed.setURL(song.url)}catch{}
        //send the message of the searching <a:Playing_Audio:950884337669275658> <a:Playing_Audio:950884337669275658> 
        message.reply(
            new Discord.MessageEmbed()
                .setTitle("<a:Playing_Audio:950884337669275658> Setup Complete for Radio Station:  " + song.title)
                .setColor("#7fafe3")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable8"]))
                .setURL(song.url)
                .setFooter(client.getFooter(es))
            )

        await client.settings.set(message.guild.id+`.channel`, channel.id);
        await client.settings.set(message.guild.id+`.song`, song.url);
        await client.settings.set(message.guild.id+`.volume`, volume);
        //play the radio but make the URL to an array ;) like that: [ `urlhere` ]
        playermanager(client, message, Array(song.url), `song:radioraw`, channel, message.guild);
        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
    						.setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable9"]))
            ]});
        }
    },
};

