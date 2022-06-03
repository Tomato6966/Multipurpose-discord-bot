const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const moment = require("moment")
const { swap_pages2, handlemsg } = require(`../../handlers/functions`)
module.exports = {
  name: "oserverinfo",
  aliases: ["osinfo"],
  type: "info",
  category: "👑 Owner",
  description: "Shows info about a server (for owner only)",
  usage: "oserverinfo <guild id>",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    if (!config.ownerIDS.some(r => r.includes(message.author?.id)))
    return message.channel.send({embeds : [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable1"]))
      .setDescription(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable2"]))
    ]});
    
    try {
      if (!args[0])
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable2"]))
        ]});

      var guild = client.guilds.cache.get(args[0]);
      
      function trimArray(arr, maxLen = 40) {
        if ([...arr.values()].length > maxLen) {
          const len = [...arr.values()].length - maxLen;
          arr = [...arr.values()].sort((a, b) => b?.rawPosition - a.rawPosition).slice(0, maxLen);
          arr.map(role => `<@&${role.id}>`)
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }
      guild.owner = await guild.fetchOwner().then(m => m.user).catch(() => null)
      await guild.members.fetch().catch(() => null);
      function emojitrimarray(arr, maxLen = 35) {
        if (arr.length > maxLen) {
          const len = arr.length - maxLen;
          arr = arr.slice(0, maxLen);
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }
      let boosts = guild.premiumSubscriptionCount;
      var boostlevel = 0;
      if (boosts >= 2) boostlevel = "1";
      if (boosts >= 7) boostlevel = "2";
      if (boosts >= 14) boostlevel = "3 / ∞";
      let maxbitrate = 96000;
      if (boosts >= 2) maxbitrate = 128000;
      if (boosts >= 7) maxbitrate = 256000;
      if (boosts >= 14) maxbitrate = 384000;
      let embed = new Discord.MessageEmbed()
      .setAuthor(client.getAuthor(client.la[ls].cmds.info.serverinfo.author + " " +  guild.name, guild.iconURL({
        dynamic: true
      }), "https://discord.com/api/oauth2/authorize?client_id=924922244436750406&permissions=8&scope=bot%20applications.commands"))
      .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      embed.addField(client.la[ls].cmds.info.serverinfo.field1, `${guild.owner}\n\`${guild.owner.tag}\``, true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field2, "\`" + moment(guild.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(guild.createdTimestamp).format("hh:mm:ss") +"`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field3, "\`" + moment(message.member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.member.joinedTimestamp).format("hh:mm:ss") +"`", true)
    
      embed.addField(client.la[ls].cmds.info.serverinfo.field4, "👁‍🗨 \`" + guild.channels.cache.size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field5, "💬 \`" + guild.channels.cache.filter(channel => channel.type == "GUILD_TEXT").size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field6, "🔈 \`" + guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").size + "\`", true)
     
      embed.addField(client.la[ls].cmds.info.serverinfo.field7, `😀 \`${guild.memberCount}\`/${guild.maximumMembers ? "100.000": guild.maximumMembers}`, true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field8, "👤 \`" + guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field9, "🤖 \`" + guild.members.cache.filter(member => member.user.bot).size + "\`", true)
      

      embed.addField("**<a:arrow:943027097348227073> Rules Channel:**", `${guild.rulesChannel ? `<#${guild.rulesChannelId}>`: ":x: \`No Channel\`"}`, true)
      embed.addField("**<a:arrow:943027097348227073> Public Updates Channel:**", `${guild.publicUpdatesChannel ? `<#${guild.publicUpdatesChannelId}>`: ":x: \`No Channel\`"}`, true)
      embed.addField("**<a:arrow:943027097348227073> AFK Channel:**", `${guild.afkChannel ? `<#${guild.afkChannelId}>`: ":x: \`No Channel\`"}`, true)

      embed.addField("**<a:arrow:943027097348227073> NSFW Level:**", `\`${guild.nsfwLevel}\``, true)
      embed.addField("**<a:arrow:943027097348227073> Verifcation Level:**", `\`${guild.verificationLevel}\``, true)
      embed.addField("**<a:arrow:943027097348227073> Explicit Content Filter:**", `\`${guild.explicitContentFilter}\``, true)

      embed.addField(client.la[ls].cmds.info.serverinfo.field10, "🟢 \`" + guild.members.cache.filter(member => member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field11, ":black_circle:\`" + guild.members.cache.filter(member => !member.presence || member.presence && member.presence.status == "offline").size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field12, "<a:nitro_logo:950884854684336159> \`" + guild.premiumSubscriptionCount + "\`", true)

      embed.addField(client.la[ls].cmds.info.serverinfo.field13, `<a:nitro:950885057768341504> \`${boostlevel}\``, true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field14, "👾 \`" + maxbitrate + " kbps\`", true)
      let guildpremiumdat = await client.premium.get(`${guild.id}.enabled`)
      if(guildpremiumdat === true){
        var gildpremiumdata = ":white_check_mark:"
      }else{
        var gildpremiumdata = ":x:"
      }
      embed.addField(client.la[ls].cmds.info.serverinfo.field15, `${gildpremiumdata}`, true)
      if(boosts >= 14){
          embed.addField(`**<a:arrow:943027097348227073> Vanity:**`, `${guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : ":x: No Vanity-Invite"}`)
      }

      let embeds = [];
      embeds.push(embed);
      let embed_emojis = new Discord.MessageEmbed()
      let embed_roles = new Discord.MessageEmbed()
      
      //emoji
      embed_emojis.setTitle(eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variablex_1"]))
      embed_emojis.setDescription(eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variable1"]))
      embeds.push(embed_emojis);
      //Roles
      embed_roles.setTitle(eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variablex_2"]))
      embed_roles.setDescription(`>>> ${guild.roles.cache.size <= 40 ?
        [...guild.roles.cache.values()].sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') 
        : guild.roles.cache.size > 40 ? trimArray(guild.roles.cache) : 'None'}`
      )
      embeds.push(embed_roles);
      

      if(guild.banner) {
        let embed2 = new Discord.MessageEmbed()
        .setTitle(`**<a:arrow:943027097348227073> SERVER BANNER:**`)
        .setDescription(`[Download Link](${guild.bannerURL({size: 1024})})${guild.discoverySplash ? ` | [Link of Discovery Splash Image](${guild.discoverySplashURL({size: 4096})})`: ""}\n> This is the Image which is shown on the Top left Corner of this Server, where you see the Channels!`)
        .setImage(guild.bannerURL({size: 4096}))
        embeds.push(embed2);
      }
      else if(guild.discoverySplash) {
        let embed2 = new Discord.MessageEmbed()
        .setTitle(`**<a:arrow:943027097348227073> SERVER DISCOVERY SPLASH:**`)
        .setDescription(`[Download Link](${guild.discoverySplashURL({size: 1024})})${guild.banner ? ` | [Link of Discovery Splash Image](${guild.bannerURL({size: 4096})})`: ""}\nThis is the Image you see when you get invited to this Server on the official Discord Website!`)
        .setImage(guild.discoverySplashURL({size: 4096}))
        embeds.push(embed2);
      }
      //add the footer to the end
      embeds.forEach((embed, index)=>{
        if(index < embeds.length - 1) {
          embed.setThumbnail(guild.iconURL({
            dynamic: true
          }));
        }
        embed.setColor(es.color);
        embed.setFooter(client.getFooter("ID: " + guild.id, guild.iconURL({
          dynamic: true
        })))
      })
      if(embeds.length == 1) return message.reply({embeds});
      return swap_pages2(client, message, embeds);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}

