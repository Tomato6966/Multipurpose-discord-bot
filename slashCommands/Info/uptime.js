const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration
} = require(`${process.cwd()}/handlers/functions`)
const moment = require("moment")
module.exports = {
  name: "uptime",
  description: "Returns the duration on how long the Bot is online",  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //things u can directly access in an interaction!
    const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    
    try {
      let date = new Date()
      let timestamp = date.getTime() - Math.floor(client.uptime);
      interaction?.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["info"]["uptime"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["info"]["uptime"]["variable2"]))
        .addField(eval(client.la[ls]["cmds"]["info"]["uptime"]["variablex_3"]), eval(client.la[ls]["cmds"]["info"]["uptime"]["variable3"])
        )]}
      );
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
  }
}

