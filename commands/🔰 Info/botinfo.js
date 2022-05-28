const Discord = require("discord.js");
const moment = require("moment");
let os = require("os");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const ms = require("ms");
const { nFormatter, swap_pages, swap_pages2 } = require("../../handlers/functions");
const emoji = require(`../../botconfig/emojis.json`);
const { duration, handlemsg } = require(`../../handlers/functions`);
module.exports = {
    name: "botinfo",
    aliases: ["info", "about", "stats", "shards", "shard", "shardinfo", "cluster", "clusters", "clusterinfo"],
    category: "🔰 Info",
    description: "Sends detailed info about the client",
    usage: "botinfo",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try{
        const oldDate = Date.now();
        let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed().setColor(es.color)
          .setAuthor(client.getAuthor(client.la[ls].cmds.info.botinfo.loading, "https://cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/milrato"))
        ]}).catch(console.error)
        let botPing = Math.round(Date.now() - oldDate) - client.ws.ping;
        if(botPing < 0) botPing *= -1;


        // Simple cache for broadCastEval
        const cacheDuration = 10 * 60_000;
        const CacheLeft = cacheDuration - (Date.now() - client.broadCastCache.get("botinfo_timestamp"));
        if(client.broadCastCache.has("botinfo") && CacheLeft > 0) {
          return swap_pages2(client, message, client.broadCastCache.get("botinfo"), tempmsg);
        }

          
        const promises = [
          client.cluster.fetchClientValues('cluster.id'),
          client.cluster.broadcastEval(c => c.cluster.ids.map(d => `#${d.id}`).join(", ")),
          client.cluster.fetchClientValues('guilds.cache.size'),
          client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
          client.cluster.broadcastEval(c => (process.memoryUsage().heapUsed/1024/1024).toFixed(0)),
          client.cluster.broadcastEval(c => (process.memoryUsage().rss/1024/1024).toFixed(0)),
          client.cluster.fetchClientValues('ws.ping'),
          client.cluster.broadcastEval(async c => {let ping = await c.database.ping(); return ping}),
          client.cluster.fetchClientValues('manager.players.size'),
          client.cluster.fetchClientValues('uptime'),
        ];
          
        return Promise.all(promises)
          .then(([cluster, shards, guilds, members, ram, rssRam, ping, dbPing, players, uptime]) => {
              const totalGuilds = guilds.reduce((acc, guildCount) => acc + guildCount, 0);
              const totalMembers = members.reduce((acc, guildCount) => acc + guildCount, 0);
              const connectedchannelsamount = players.reduce((acc, playerAmount) => acc + playerAmount, 0);
              const embeds = [];
              // For each shard data
              for(let index = 0; index<shards.length; index++) {
                const shardEmbed = new Discord.MessageEmbed()
                .setAuthor(client.getAuthor(client.user.tag + " Information", es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL(), `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)) 
                .setDescription(`\`\`\`yml\nName: ${client.user.tag} [${client.user.id}]\nBot Latency: ${botPing}ms\nApi Latency: ${Math.round(client.ws.ping)}ms\nRuntime: ${duration(client.uptime).join("︲")}\`\`\``)
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .addField(client.la[ls].cmds.info.botinfo.field1.title, `\`\`\`yml\nServers: ${nFormatter(totalGuilds, 2)}\nUsers: ${nFormatter(totalMembers, 2)}\nConnections: ${connectedchannelsamount}\nClusters: ${client.cluster.count}\nShards: ${client.cluster.info.TOTAL_SHARDS}\`\`\``, true)
                .addField(client.la[ls].cmds.info.botinfo.field2.title, `\`\`\`yml\nNode.js: ${process.version}\nDiscord.js: v${Discord.version}\nEnmap-DB: v5.8.4\`\`\``, true)
                .addField(client.la[ls].cmds.info.botinfo.field4.title, `\`\`\`yml\nName: Tomato#6966\nID: [442355791412854784]\`\`\``, true)
                .setFooter(client.getFooter(es.footertext+ ` ︲ You're on Cluster #${client.cluster.id} and Shard #${message.guild.shard.id}`, es.footericon))
                .addField(
                  `${uptime[index] < 1000 || members[index] < 1 || guilds[index] < 1 ? `<:error:862306766338523166>` : `<:online:862306785007632385>`} Cluster #${cluster[index]}${cluster[index] == client.cluster.id ? ` | **Cluster of __this Guild__**` : ``}`, 
                  `\`\`\`yml\n Shards: ${shards[index]}\nServers: ${guilds[index]}\nMembers: ${nFormatter(members[index], 1)}\n Memory: ${ram[index]}mb / ${rssRam[index]}mb\n   Ping: ${ping[index]}ms\nDB-Ping: ${dbPing[index]}ms\nPlayers: ${players[index] ? players[index] : "'None'"}\n Uptime: ${duration(uptime[index]).map(d => d.split(" ")[1] ? d.split(" ")[0] + d.split(" ")[1].slice(0, 1).toLowerCase() : "0m").join("")}\n\`\`\``,
                  false
                )
                .setTimestamp()
                .addField(client.la[ls].cmds.info.botinfo.field5.title, handlemsg(client.la[ls].cmds.info.botinfo.field5.value, {invitelink: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`})+"\n> [**Dashboard**](https://milrato.com/)")
                
                embeds.push(shardEmbed)
              }
              client.broadCastCache.set("botinfo", embeds);
              client.broadCastCache.set("botinfo_timestamp", Date.now());
              swap_pages2(client, message, embeds, tempmsg);
          })
          .catch(e => {
            console.error(e)
            tempmsg.edit({embeds: [tempmsg.embeds[0]
              .setTitle("An error occurred!")
              .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
            ]}).catch(console.error)
          });          
    } catch (e) {
        console.error(e)
        return message.reply({embeds: [new Discord.MessageEmbed()
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
