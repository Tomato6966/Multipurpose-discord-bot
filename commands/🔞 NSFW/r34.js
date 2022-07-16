const randomPuppy = require('random-puppy');
const request = require('node-fetch');
const fs = require("fs")
const {
    MessageEmbed
} = require('discord.js')
const config = require(`../../botconfig/config.json`)
const Discord = require('discord.js');
const booru = require('booru');

module.exports = {
    name: "r34",
    category: "🔞 NSFW",
    usage: "r34",
    aliases: ["rule34"],
    description: "Searches rule34",
    type: "anime",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        if(GuildSettings.NSFW === false) {
            const x = new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.disabled.title)
                .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
                    prefix: prefix
                }))
            return message.reply({
                embeds: [x]
            });
        }
        if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))

        var query = message.content.split(/\s+/g).slice(1).join(" ");
        booru.search('rule34', [query], {
                nsfw: true,
                limit: 1,
                random: true
            })
            .then(booru.commonfy)
            .then(images => {
                for (let image of images) {
                    return message.reply({
                        content: `${image.common.file_url}`
                    });
                }
            }).catch(err => {
                if (err.name === 'booruError') {
                    return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["r34"]["variable5"]));
                } else {
                    return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["r34"]["variable6"]));
                }
            })
    }
};