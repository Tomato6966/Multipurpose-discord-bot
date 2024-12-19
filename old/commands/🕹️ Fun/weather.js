const weather = require("weather-js");
const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const path = require("path");
module.exports = {
    name: path.parse(__filename).name,
    category: "🕹️ Fun",
    usage: `${path.parse(__filename).name} <C/F> <Location>`,
    description: "*Image cmd in the style:* " + path.parse(__filename).name,
    type: "text",
    run: async (client, message, args, cmduser, text, prefix) => {
    
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "FUN")){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
        let degree;
        if (!args[0]) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["weather"]["variable1"])});
        if (args[0].toLowerCase() === "c" || args[0].toLowerCase() === "f") {
            degree = args[0].toUpperCase();
        } else {
            return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["weather"]["variable2"])});
        }
        if (!args[1]) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["weather"]["variable3"])});
        weather.find({
            search: args[1],
            degreeType: degree
        }, function (e, result) {
            if (e) return console.log(e.stack ? String(e.stack).grey : String(e).grey);
            try {
                let embed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["fun"]["weather"]["variable4"]))
                    .setThumbnail(result[0].current.imageUrl)
                    .setDescription(eval(client.la[ls]["cmds"]["fun"]["weather"]["variable5"]))
                    .addField("**Temp:**", `${result[0].current.temperature}°${result[0].location.degreetype}`, true)
                    .addField("**Weather:**", `${result[0].current.skytext}`, true)
                    .addField("**Day:**", `${result[0].current.shortday}`, true)
                    .addField("**Feels like:**", `${result[0].current.feelslike}°${result[0].location.degreetype}`, true)
                    .addField("**Humidity:**", `${result[0].current.humidity}%`, true)
                    .addField("**Wind:**", `${result[0].current.winddisplay}`, true);
                message.reply({embeds : [embed]});
            } catch (e) {
                console.log(String(e.stack).grey.bgRed)
                return message.reply({embeds : [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.erroroccur)
                    .setDescription(eval(client.la[ls]["cmds"]["fun"]["weather"]["variable6"]))
                ]});
            }
        });
    },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
