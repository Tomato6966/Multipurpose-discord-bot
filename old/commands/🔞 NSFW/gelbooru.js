const randomPuppy = require('random-puppy');
const request = require('node-fetch');
const fs = require("fs")
const config = require(`${process.cwd()}/botconfig/config.json`)
const Discord = require('discord.js');
const {
    MessageEmbed
} = require('discord.js')
const booru = require('booru');

module.exports = {
    name: "gelbooru",
    category: "🔞 NSFW",
    usage: "gelbooru",
    description: "Searches gelbooru image board",
    type: "anime",
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");
        let ls = client.settings.get(message.guild.id, "language")
        if (!client.settings.get(message.guild.id, "NSFW")) {
            const x = new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.disabled.title)
                .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
                    prefix: prefix
                }))
            return message.reply({
                embeds: [x]
            });
        }

        //Checks channel for nsfw

        if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))

        var query = message.content.split(/\s+/g).slice(1).join(" ");
        booru.search('gb', [query], {
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
                    return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["gelbooru"]["variable5"]));
                } else {
                    return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["gelbooru"]["variable6"]));
                }
            })
    }
};