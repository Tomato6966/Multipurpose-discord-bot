const {
    MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
    format,
    delay,
    swap_pages,
    handlemsg
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
    name: `lyrics`,
    category: `🎶 Music`,
    aliases: [`songlyrics`, `ly`, `tracklyrics`],
    description: `Shows The Lyrics of the current track`,
    usage: `lyrics [Songtitle]`,
    cooldown: 15,
    parameters: {
        "type": "music",
        "activeplayer": true,
        "previoussong": false
    },
    type: "song",
    run: async (client, message, args, cmduser, text, prefix, player) => {
        
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if (!client.settings.get(message.guild.id, "MUSIC")) {
            return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.disabled.title)
                .setDescription(handlemsg(client.la[ls].common.disabled.description, {
                    prefix: prefix
                }))
            ]});
        }
        try {
            return message.reply("**Due to legal Reasons, Lyrics are disabled and won't work for an unknown amount of time!** :cry:");
        } catch (e) {
            console.log(String(e.stack).dim.bgRed)
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["music"]["lyrics"]["variable2"]))
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
