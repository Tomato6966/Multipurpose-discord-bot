const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require("moment")
const { swap_pages, handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "serverinfo",
  aliases: ["sinfo"],
  category: "🔰 Info",
  description: "Shows info about a server",
  usage: "serverinfo",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      function trimArray(arr, maxLen = 40) {
        if ([...arr.values()].length > maxLen) {
          const len = [...arr.values()].length - maxLen;
          arr = [...arr.values()].sort((a, b) => b?.rawPosition - a.rawPosition).slice(0, maxLen);
          arr.map(role => `<@&${role.id}>`)
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }
      message.guild.owner = await message.guild.fetchOwner().then(m => m.user).catch(() => {})
      await message.guild.members.fetch().catch(() => {});
      function emojitrimarray(arr, maxLen = 35) {
        if (arr.length > maxLen) {
          const len = arr.length - maxLen;
          arr = arr.slice(0, maxLen);
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }
      let boosts = message.guild.premiumSubscriptionCount;
      var boostlevel = 0;
      if (boosts >= 2) boostlevel = "1";
      if (boosts >= 7) boostlevel = "2";
      if (boosts >= 14) boostlevel = "3 / ∞";
      let maxbitrate = 96000;
      if (boosts >= 2) maxbitrate = 128000;
      if (boosts >= 7) maxbitrate = 256000;
      if (boosts >= 14) maxbitrate = 384000;
      let embed = new Discord.MessageEmbed()
      .setAuthor(client.la[ls].cmds.info.serverinfo.author + " " +  message.guild.name, message.guild.iconURL({
        dynamic: true
      }), "https://discord.com/api/oauth2/authorize?client_id=734513783338434591&permissions=8&scope=bot%20applications.commands")
      .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
      embed.addField(client.la[ls].cmds.info.serverinfo.field1, `${message.guild.owner}\n\`${message.guild.owner.tag}\``, true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field2, "\`" + moment(message.guild.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.guild.createdTimestamp).format("hh:mm:ss") +"`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field3, "\`" + moment(message.member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.member.joinedTimestamp).format("hh:mm:ss") +"`", true)
    
      embed.addField(client.la[ls].cmds.info.serverinfo.field4, "👁‍🗨 \`" + message.guild.channels.cache.size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field5, "💬 \`" + message.guild.channels.cache.filter(channel => channel.type == "GUILD_TEXT").size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field6, "🔈 \`" + message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").size + "\`", true)
     
      embed.addField(client.la[ls].cmds.info.serverinfo.field7, `😀 \`${message.guild.memberCount}\`/${message.guild.maximumMembers ? "100.000": message.guild.maximumMembers}`, true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field8, "👤 \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field9, "🤖 \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)
      

      embed.addField("**<:arrow:832598861813776394> Rules Channel:**", `${message.guild.rulesChannel ? `<#${message.guild.rulesChannelId}>`: "<:no:833101993668771842> \`No Channel\`"}`, true)
      embed.addField("**<:arrow:832598861813776394> Public Updates Channel:**", `${message.guild.publicUpdatesChannel ? `<#${message.guild.publicUpdatesChannelId}>`: "<:no:833101993668771842> \`No Channel\`"}`, true)
      embed.addField("**<:arrow:832598861813776394> AFK Channel:**", `${message.guild.afkChannel ? `<#${message.guild.afkChannelId}>`: "<:no:833101993668771842> \`No Channel\`"}`, true)

      embed.addField("**<:arrow:832598861813776394> NSFW Level:**", `\`${message.guild.nsfwLevel}\``, true)
      embed.addField("**<:arrow:832598861813776394> Verifcation Level:**", `\`${message.guild.verificationLevel}\``, true)
      embed.addField("**<:arrow:832598861813776394> Explicit Content Filter:**", `\`${message.guild.explicitContentFilter}\``, true)

      embed.addField(client.la[ls].cmds.info.serverinfo.field10, "🟢 \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field11, ":black_circle:\`" + message.guild.members.cache.filter(member => !member.presence || member.presence && member.presence.status == "offline").size + "\`", true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field12, "<a:nitro_logo:833402717950836806> \`" + message.guild.premiumSubscriptionCount + "\`", true)

      embed.addField(client.la[ls].cmds.info.serverinfo.field13, `<a:nitro:833402717506502707> \`${boostlevel}\``, true)
      embed.addField(client.la[ls].cmds.info.serverinfo.field14, "👾 \`" + maxbitrate + " kbps\`", true)
      if(boosts >= 14){
          embed.addField(`**<:arrow:832598861813776394> Vanity:**`, `${message.guild.vanityURLCode ? `https://discord.gg/${message.guild.vanityURLCode}` : "<:no:833101993668771842> No Vanity-Invite"}`)
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
      embed_roles.setDescription(eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variable2"]))
      embeds.push(embed_roles);
      

      if(message.guild.banner) {
        let embed2 = new Discord.MessageEmbed()
        .setTitle(`**<:arrow:832598861813776394> SERVER BANNER:**`)
        .setDescription(`[Download Link](${message.guild.bannerURL({size: 1024})})${message.guild.discoverySplash ? ` | [Link of Discovery Splash Image](${message.guild.discoverySplashURL({size: 4096})})`: ""}\n> This is the Image which is shown on the Top left Corner of this Server, where you see the Channels!`)
        .setImage(message.guild.bannerURL({size: 4096}))
        embeds.push(embed2);
      }
      else if(message.guild.discoverySplash) {
        let embed2 = new Discord.MessageEmbed()
        .setTitle(`**<:arrow:832598861813776394> SERVER DISCOVERY SPLASH:**`)
        .setDescription(`[Download Link](${message.guild.discoverySplashURL({size: 1024})})${message.guild.banner ? ` | [Link of Discovery Splash Image](${message.guild.bannerURL({size: 4096})})`: ""}\nThis is the Image you see when you get invited to this Server on the official Discord Website!`)
        .setImage(message.guild.discoverySplashURL({size: 4096}))
        embeds.push(embed2);
      }
      //add the footer to the end
      embeds[embeds.length - 1].setFooter("ID: " + message.guild.id, message.guild.iconURL({
        dynamic: true
      }))
      //color each embed with thumbnail, except the last one
      embeds.forEach((embed, index)=>{
        if(index < embeds.length - 1) {
          embed.setThumbnail(message.guild.iconURL({
            dynamic: true
          }));
        }
        embed.setColor(es.color);
      })

      message.reply({embeds});
     
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
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
