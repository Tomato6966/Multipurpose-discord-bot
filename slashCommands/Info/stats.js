const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  getRandomInt, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "stats",
  description: "Shows music Stats, like amount of Commands and played Songs etc.",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //things u can directly access in an interaction!
    const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    
    
    try {
      let global = await client.stats.get("global");
      let guild = await client.stats.get(message.guild.id);
      
      let embed =new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es.footertext + ` | Stats apply for Cluster #${client.cluster.id}`, es.footericon))
        .addField(client.la[ls].cmds.info.stats.field1.title, handlemsg(client.la[ls].cmds.info.stats.field1.value, { allcommands: Math.ceil(global.commands) }), true)
        .addField(client.la[ls].cmds.info.stats.field2.title, handlemsg(client.la[ls].cmds.info.stats.field2.value, { allsongs: Math.ceil(global.songs) }), true)
        .addField(eval(client.la[ls]["cmds"]["info"]["stats"]["variablex_1"]), eval(client.la[ls]["cmds"]["info"]["stats"]["variable1"]))
        .addField(client.la[ls].cmds.info.stats.field3.title, handlemsg(client.la[ls].cmds.info.stats.field3.value, { guildcommands: guild.commands }), true)
        .addField(client.la[ls].cmds.info.stats.field4.title, handlemsg(client.la[ls].cmds.info.stats.field4.value, { guildsongs: guild.songs }), true)
        .setTitle(handlemsg(client.la[ls].cmds.info.stats.title, { botname: client.user.username }))
      interaction?.reply({ephemeral: true, embeds: [embed]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
  }
}

