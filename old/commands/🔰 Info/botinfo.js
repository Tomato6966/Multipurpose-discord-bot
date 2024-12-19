const Discord = require("discord.js");
const moment = require("moment");
let os = require("os");
let cpuStat = require("cpu-stat");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { duration, handlemsg } = require(`${process.cwd()}/handlers/functions`);
const { connected } = require("process");
module.exports = {
    name: "botinfo",
    aliases: ["info", "about", "stats"],
    category: "🔰 Info",
    description: "Sends detailed info about the client",
    usage: "botinfo",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    
    try{
      let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed().setColor(es.color)
      .setAuthor(client.la[ls].cmds.info.botinfo.loading, "https://cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/milrato")]})
      cpuStat.usagePercent(function (e, percent, seconds) {
          if (e) {
              return console.log(e.stack ? String(e.stack).grey : String(e).grey);
          }
          let connectedchannelsamount = 0;
          let guilds = client.guilds.cache.map((guild) => guild);
          for (let i = 0; i < guilds.length; i++) {
              if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
          }
        const totalGuilds = client.guilds.cache.size;
        const totalMembers = client.users.cache.size;
        countertest = 0;
        const botinfo = new Discord.MessageEmbed()
            .setAuthor(client.user.tag + " Information", es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL(), `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`) 
            .setDescription(eval(client.la[ls]["cmds"]["info"]["botinfo"]["variable1"]))
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .addField(client.la[ls].cmds.info.botinfo.field1.title, handlemsg(client.la[ls].cmds.info.botinfo.field1.value, {totalGuilds: totalGuilds, totalMembers: totalMembers, connections: connectedchannelsamount, connectedchannelsamount: connectedchannelsamount}), true)
            .addField(client.la[ls].cmds.info.botinfo.field2.title, `\`\`\`yml\nNode.js: ${process.version}\nDiscord.js: v${Discord.version}\nEnmap: v5.8.4\`\`\``, true)
            .addField(client.la[ls].cmds.info.botinfo.field3.title, handlemsg(client.la[ls].cmds.info.botinfo.field3.value, {cpu: percent.toFixed(2), ram: (process.memoryUsage().heapUsed/1024/1024).toFixed(2)}))
            .addField(client.la[ls].cmds.info.botinfo.field4.title, `\`\`\`yml\nName: Tomato#6966\nID: [442355791412854784]\`\`\``, true)
            .addField(client.la[ls].cmds.info.botinfo.field5.title, handlemsg(client.la[ls].cmds.info.botinfo.field5.value, {invitelink: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`}))
            .setFooter(client.getFooter(es));
        tempmsg.edit({embeds: [botinfo]});
      });
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
        ]});
    }
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
