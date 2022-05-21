const Discord = require(`discord.js`)
const {
    MessageEmbed
} = require(`discord.js`)
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`)
const {
    createBar,
    format
} = require(`../../handlers/functions`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
    name: `searchplaylist`,
    category: `🎶 Music`,
    aliases: [`searchpl`],
    description: `Searches a playlist from youtube`,
    usage: `searchplaylist <Name / URL>`,
    cooldown: 10,
    parameters: {
        "type": "music",
        "activeplayer": false,
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
            //search the song for YOUTUBE
            //playermanager(client, message, args, `searchplaylist:youtube`);
            message.reply({content : eval(client.la[ls]["cmds"]["music"]["searchplaylist"]["variable1"])})
        } catch (e) {
            console.log(String(e.stack).dim.bgRed)
            return message.reply({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["music"]["searchplaylist"]["variable2"]))
            ]});
        }
    }
};

