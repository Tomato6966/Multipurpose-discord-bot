const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg, getRandomNum } = require(`${process.cwd()}/handlers/functions`);
var cp = require('child_process');
module.exports = {
  name: "ping",
  description: "Gives you information on how fast the Bot can respond to you",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    try {
      let oldate = Math.floor(Date.now() / 10)
      interaction?.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es.footertext, es.footericon))
        .setTitle(handlemsg(client.la[ls].cmds.info.ping.m1))
      ]}).then(async (msg) => {
        let newtime = Math.floor(Math.floor(Date.now() / 10) - oldate);
        const dbping = await client.database.ping();
        console.log(`[${dbping}ms] | "ping" | DB PING RECEIVED`.brightRed);
        if(newtime < 0) newtime*=-1;
        interaction?.editReply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter("It Takes longer, because i am getting my host ping!", es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL()))
          .setTitle(handlemsg(client.la[ls].cmds.info.ping.m2, { botping: Math.floor(client.ws.ping + newtime), ping: Math.floor(newtime) + "ms", wsping: Math.floor(client.ws.ping)})+`\n\n<:online:970050105338130433> Database Ping: \`${dbping}ms\``)
        ]}).catch(console.error)
      })
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return interaction?.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}

