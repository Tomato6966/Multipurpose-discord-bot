const Discord = require("discord.js");
const fs = require("fs")
const moment = require('moment');
module.exports = (c) => {
      c.on("channelCreate", async function (channel) {
          send_log(c,
            channel.guild,
            "GREEN",
            "Channel CREATED",
            `**Channel:** \`${channel?.name}\`\n**ChannelID:** \`${channel.id}\`\n**ChannelTYPE:** \`${channel.type}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869531337411952670/845717716559593512.png"
          )
          return;
      })
      c.on("channelDelete", async function (channel) {
          send_log(c,
            channel.guild,
            "RED",
            "Channel DELETED",
            `**Channel:** \`${channel?.name}\`\n**ChannelID:** \`${channel.id}\`\n**ChannelTYPE:** \`${channel.type}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
          )
          return;
      })
      c.on("channelPinsUpdate", async function (channel, time) {
        send_log(c,
          channel.guild,
          "YELLOW",
          "Channel PINS UPDATE",
          `Channel: \`${channel?.name}\`\nChannelID: \`${channel.id}\`\nPinned at \`${time}\``, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/pushpin_1f4cc.png"
        )
        return;
      })
      c.on("channelPinsUpdate", async function (channel, time) {
        send_log(c,
          channel.guild,
          "YELLOW",
          "Channel PINS UPDATE",
          `Channel: \`${channel?.name}\`\nChannelID: \`${channel.id}\`\nPinned at \`${time}\``, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/pushpin_1f4cc.png"
        )
        return;
      })
      c.on("channelUpdate", async function (oldChannel, newChannel) {
        if (oldChannel?.name != newChannel?.name) {
          send_log(c,
            oldChannel.guild,
            "YELLOW",
            "Channel UPDATED - NAME",
            `**Channel:** \`${oldChannel?.name}\`\n**ChannelID**: \`${oldChannel.id}\`\n\n` +
            `**Channel:** \`${newChannel?.name}\`\n**ChannelID**: \`${newChannel.id}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
          )
        } else if (oldChannel.type != newChannel.type) {
          send_log(c,
            oldChannel.guild,
            "YELLOW",
            "Channel UPDATED - TYPE",
            `**Channel:** \`${oldChannel?.name}\`\n**ChannelID**: \`${oldChannel.id}\`\n\n` +
            `**Channel:** \`${newChannel?.name}\`\n**ChannelID**: \`${newChannel.id}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
          )
        } else if (oldChannel.topic != newChannel.topic) {
          send_log(c,
            oldChannel.guild,
            "YELLOW",
            "Channel UPDATED - TOPIC",
            `**Channel:** \`${oldChannel?.name}\`\n**ChannelID**: \`${oldChannel.id}\`\n\n` +
            `**Channel:** \`${newChannel?.name}\`\n**ChannelID**: \`${newChannel.id}\`\n\n**ChannelTOPIC:** \`${newChannel.topic}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
          )
        }
        return;


      })

      c.on("emojiCreate", async function (emoji) {
        send_log(c,
          emoji?.guild,
          "GREEN",
          "EMOJI CREATED",
          `EMOJI: ${emoji}\nEMOJINAME: ${emoji?.name}\nEMOJIID: ${emoji?.id}\nEMOJIURL: ${emoji?.url}`,
          "https://cdn.discordapp.com/attachments/849047781276647425/869531337411952670/845717716559593512.png"
        )
        return;
      });
      c.on("emojiDelete", async function (emoji) {
        send_log(c,
          emoji?.guild,
          "RED",
          "EMOJI DELETED",
          `EMOJI: ${emoji}\nEMOJINAME: ${emoji?.name}\nEMOJIID: ${emoji?.id}\nEMOJIURL: ${emoji?.url}`,
          "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
        )
        return;
      });
      c.on("emojiUpdate", async function (oldEmoji, newEmoji) {
        send_log(c,
          newEmoji?.guild,
          "ORANGE",
          "EMOJI NAME CHANGED",
          `__Emoji: ${newEmoji}__ \n\n**Before:** \`${oldEmoji?.name}\`\n**After:** \`${newEmoji?.name}\`\n**Emoji ID:** \`${newEmoji?.id}\``,
          "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
        )
        return;
      });
      
      
      c.on("guildBanAdd", async function ({guild, user}) {
        send_log(c,
          guild,
          "RED",
          "USER BANNED",
          `User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
          user ? user?.displayAvatarURL({dynamic: true}) : null,
        )
        return;
      });
      c.on("guildBanRemove", async function ({guild, user}) {
        send_log(c,
          guild,
          "YELLOW",
          "USER UNBANNED",
          `User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
          user ? user?.displayAvatarURL({dynamic: true}) : null,
        )
        return;
      });

      c.on("guildMemberAdd", async function (member) {
        if (!member.user.bot) {
          send_log(c,
            member.guild,
            "GREEN",
            "MEMBER JOINED",
            `Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\`\n\n**Account created:** \`${moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\` | " + "`"+ moment(member.user.createdTimestamp).format("hh:mm:ss")}`,
              member && member.user ? member.user?.displayAvatarURL({dynamic: true}) : member ? member?.displayAvatarURL({dynamic: true}) : null
            )
        } else {
          send_log(c,
            member.guild,
            "ORANGE",
            "BOT ADDED",
            `**Bot:** ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\`\n\n**Bot created:** \`${moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\` | " + "`"+ moment(member.user.createdTimestamp).format("hh:mm:ss")}`,
          )
          return;
        }
      });
      let banMap = new Map();
      //LEAVES
      c.on("guildMemberRemove", async function (member) {
          setTimeout(()=>{
            if(banMap.has(member.id)) {
              banMap.delete(member.id)
              return;
            }
            send_log(c,
              member.guild,
              "RED",
              "MEMBER LEFT",
              `Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
              member && member.user ? member.user?.displayAvatarURL({dynamic: true}) : member ? member?.displayAvatarURL({dynamic: true}) : null
            )
          }, 500)
      });
      //BAN
      c.on("guildBanAdd", async function (ban) {
          //set it that it's a ban
          banMap.set(ban.user.id, true);
          send_log(c,
            ban.guild,
            "RED",
            "⚠️ MEMBER GOT BANNED ⚠️",
            `Member: ${ban.user} (\`${ban.user.id}\`)\n\`${ban.user.tag}\`\n\nReason: ${ban.reason ? ban.reason : "No Reason provided!"}`,
            ban && ban.user ? ban.user?.displayAvatarURL({dynamic: true}) : ban ? ban?.displayAvatarURL({dynamic: true}) : null
          )
      });
      //UNBAN
      c.on("guildBanAdd", async function (ban) {
        //set it that it's a ban
        banMap.set(ban.user.id, true);
        send_log(c,
          ban.guild,
          "ORANGE",
          "⛔ MEMBER GOT __UN__BANNED ⛔",
          `Member: ${ban.user} (\`${ban.user.id}\`)\n\`${ban.user.tag}\`\n\nReason was: ${ban.reason ? ban.reason : "No Reason provided!"}`,
          ban && ban.user ? ban.user?.displayAvatarURL({dynamic: true}) : ban ? ban?.displayAvatarURL({dynamic: true}) : null
        )
    });
    c.on("guildMembersChunk", async function (members, guild, chunk) {
      send_log(c,
        guild,
        "RED",
        `MEMBER CHUNK / RAID - [${members.size}] Members`,
        members.size < 20 ? members.map((member, index) => `${index}) - ${member.user} - ${member.user.tag} - \`${member.user.id}\``).join("\n") : [...members.values()].slice(0, 20).map((member, index) => `${index}) - ${member.user} - ${member.user.tag} - \`${member.user.id}\`\n${members.size - 20} more...`).join("\n"),
      )
    });
    c.on("guildMemberUpdate", async function (oldMember, newMember) {
      let options = {}
      if (options[newMember.guild.id]) {
        options = options[newMember.guild.id]
      }
      // Add default empty list
      if (typeof options.excludedroles === "undefined") options.excludedroles = new Array([])
      if (typeof options.trackroles === "undefined") options.trackroles = true
      const oldMemberRoles = [...oldMember.roles.cache.keys()];
      const newMemberRoles = [...newMember.roles.cache.keys()];
      const oldRoles = oldMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !newMemberRoles.includes(x))
      const newRoles = newMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !oldMemberRoles.includes(x))
      const rolechanged = (newRoles.length || oldRoles.length)
      if (rolechanged) {
        let roleadded = ""
        if (newRoles.length > 0) {
          for (let i = 0; i < newRoles.length; i++) {
            if (i > 0) roleadded += ", "
            roleadded += `<@&${newRoles[i]}>`
          }
        }
        let roleremoved = ""
        if (oldRoles.length > 0) {
          for (let i = 0; i < oldRoles.length; i++) {
            if (i > 0) roleremoved += ", "
            roleremoved += `<@&${oldRoles[i]}>`
          }
        }
        let text = `${roleremoved ? `❌ ROLE REMOVED: \n${roleremoved}` : ""}${roleadded ? `✅ ROLE ADDED:\n${roleadded}` : ""}`
        send_log(c,
          newMember.guild,
          `${roleadded ? "GREEN" : "RED"}`,
          "Member ROLES Changed",
          `Member: ${newMember.user}\nUser: \`${oldMember.user.tag}\`\n\n${text}`,
          "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
        )
      }
    });

    c.on("messageDelete", async function (message) {
        send_log(c,
          message.guild,
          "ORANGE",
          "Message Deleted", 
          `**Author : ** <@${message.author?.id}> - *${message.author?.tag}*\n**Date : ** ${message.createdAt}\n**Channel : ** <#${message.channel?.id}> - *${message.channel?.name}*\n\n**Deleted Message : **\n\`\`\`\n${message.content?.replace(/`/g, "'").substring(0, 1800)}\n\`\`\``,
          "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png",
          `**Attachment URL(s): **`, `>>> ${[...message.attachments?.values()].map(x => x.proxyURL).join("\n\n")}`
        )
        return;
    });

    c.on("messageDeleteBulk", async function (messages) {
      send_log(c,
        messages.guild,
        "RED",
        `[${messages.size}] Messages Deleted BULK`,
        `${messages.size} Messages deleted in: ${messages.channel}`,
        "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
        )
        return;
    });

    c.on("messageUpdate", async function (oldMessage, newMessage) {
        if (oldMessage.author && oldMessage.author?.bot) return;
        if (newMessage.author && newMessage.author?.bot) return;
        if (oldMessage.channel.type !== "GUILD_TEXT") return
        if (newMessage.channel.type !== "GUILD_TEXT") return
        if (oldMessage.content === newMessage.content) return
        send_log(c, newMessage.guild,
          "YELLOW",
          "Message UPDATED", 
          ` **Author:** <@${newMessage.author.id}> - *${newMessage.author.tag}*\n**Date:** ${newMessage.createdAt}\n**Channel:** <#${newMessage.channel?.id}> - *${newMessage.channel?.name}*\n**Orignal Message:**\n\`\`\`\n${oldMessage.content ? oldMessage.content.replace(/`/g, "'") : "UNKNOWN CONTENT"}\n\`\`\`\n**Updated Message :**\n\`\`\`\n${newMessage.content ? newMessage.content.replace(/`/g, "'") : "UNKNOWN CONTENT"}\n\`\`\``,
          "https://cdn.discordapp.com/attachments/849047781276647425/869530575411773440/857128740198023190.png",
          `**Attachment BEFORE: URL(s): **`, `>>> ${[...newMessage.attachments?.values()].map(x => x.proxyURL).join("\n\n")}`,
          `**Attachment AFTER: URL(s): **`, `>>> ${[...newMessage.attachments?.values()].map(x => x.proxyURL).join("\n\n")}`
        )
    });

    c.on("roleCreate", async function (role) {
      send_log(c,
        role.guild,
        "GREEN",
        "ROLE CREATED",
        `ROLE: ${role}\nROLENAME: ${role?.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`,
        "https://cdn.discordapp.com/attachments/849047781276647425/869531337411952670/845717716559593512.png"
      )
      return;
      });

      c.on("roleDelete", async function (role) {
        send_log(c,
          role.guild,
          "RED",
          "ROLE DELETED",
          `ROLE: ${role}\nROLENAME: ${role?.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`,
          "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
        )
        return;
      });

      c.on("roleUpdate", async function (oldRole, newRole) {
        if (oldRole?.name !== newRole?.name) {
          send_log(c,
            oldRole.guild,
            "ORANGE",
            "ROLE NAME CHANGED",
            `__ROLE: ${newRole}__ \n\n**Before:** \`${oldRole.color.toString(16)}\`\n**After:** \`${newRole.color.toString(16)}\`\n**ROLE ID:** \`${newRole.id}\``)

        } else if (oldRole.color !== newRole.color) {
          send_log(c,
            oldRole.guild,
            "ORANGE",
            "ROLE COLOR CHANGED",
            `__ROLE: ${newRole}__ \n\n**Before:** \`${oldRole.color.toString(16)}\`\n**After:** \`${newRole.color.toString(16)}\`\n**ROLE ID:** \`${newRole.id}\``)

        }
        return;
      });
      c.on("voiceStateUpdate", (oldState, newState) => {
        if (!oldState.channelId && newState.channelId) {
          if (
              (!oldState.streaming && newState.streaming)   ||
              (oldState.streaming && !newState.streaming)   ||
              (!oldState.serverDeaf && newState.serverDeaf) ||
              (oldState.serverDeaf && !newState.serverDeaf) ||
              (!oldState.serverMute && newState.serverMute) ||
              (oldState.serverMute && !newState.serverMute) || 
              (!oldState.selfDeaf && newState.selfDeaf)     ||
              (oldState.selfDeaf && !newState.selfDeaf)     ||
              (!oldState.selfMute && newState.selfMute)     ||
              (oldState.selfMute && !newState.selfMute)     ||
              (!oldState.selfVideo && newState.selfVideo)   ||
              (oldState.selfVideo && !newState.selfVideo) 
           ) return;
          return send_log(c,
            newState.guild,
            "GREEN",
            "CHANNEL JOINED",
            `**User:** <@${newState.member.user.id}> (\`${newState.member.user.id}\`) (**${newState.member.user.tag}**)\n\nCHANNEL: <#${newState.channelId}> (\`${newState.channelId}\`)  ${newState.channel ? `(**${newState.channel?.name}**)` : ""}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869529604296159282/863876115584385074.gif"
            )
        }
        if (oldState.channelId && !newState.channelId) {
          if (
              (!oldState.streaming && newState.streaming)   ||
              (oldState.streaming && !newState.streaming)   ||
              (!oldState.serverDeaf && newState.serverDeaf) ||
              (oldState.serverDeaf && !newState.serverDeaf) ||
              (!oldState.serverMute && newState.serverMute) ||
              (oldState.serverMute && !newState.serverMute) || 
              (!oldState.selfDeaf && newState.selfDeaf)     ||
              (oldState.selfDeaf && !newState.selfDeaf)     ||
              (!oldState.selfMute && newState.selfMute)     ||
              (oldState.selfMute && !newState.selfMute)     ||
              (!oldState.selfVideo && newState.selfVideo)   ||
              (oldState.selfVideo && !newState.selfVideo) 
           ) return;
          return send_log(c,
            newState.guild,
            "RED",
            "CHANNEL LEFT",
            `**User:** <@${newState.member.user.id}> (\`${newState.member.user.id}\`) (**${newState.member.user.tag}**)\n\nCHANNEL: <#${oldState.channelId}> (\`${oldState.channelId}\` ${oldState.channel ? `(**${oldState.channel?.name}**)` : ""}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869529603562172456/850830662897762324.png"
            )
        }
        if (oldState.channelId && newState.channelId) {
          if (
              (!oldState.streaming && newState.streaming)   ||
              (oldState.streaming && !newState.streaming)   ||
              (!oldState.serverDeaf && newState.serverDeaf) ||
              (oldState.serverDeaf && !newState.serverDeaf) ||
              (!oldState.serverMute && newState.serverMute) ||
              (oldState.serverMute && !newState.serverMute) || 
              (!oldState.selfDeaf && newState.selfDeaf)     ||
              (oldState.selfDeaf && !newState.selfDeaf)     ||
              (!oldState.selfMute && newState.selfMute)     ||
              (oldState.selfMute && !newState.selfMute)     ||
              (!oldState.selfVideo && newState.selfVideo)   ||
              (oldState.selfVideo && !newState.selfVideo) 
           ) return;
          return  send_log(c,
            newState.guild,
            "GREEN",
            "CHANNEL SWITCHED",
            `**User:** <@${newState.member.user.id}> (\`${newState.member.user.id}\`) (**${newState.member.user.tag}**)\n\nTO CHANNEL: <#${newState.channelId}> (\`${newState.channelId}\`) ${newState.channel ? `(**${newState.channel?.name}**)` : ""}\n\nFROM CHANNEL: <#${oldState.channelId}> (\`${oldState.channelId}\`) ${oldState.channel ? `(**${oldState.channel?.name}**)` : ""}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869529684805840896/841989410978398218.gif"
            )
        }
      });

    }

async function send_log(c, guild, color, title, description, thumb, fieldt, fieldv, fieldt2, fieldv2) {
  try {
    if(!c) return
    if(!guild || guild.available === false) return
    let icon = null; 
    try{
      icon = guild ? guild.iconURL({ format: "png" }) : c.user?.displayAvatarURL() || c.user?.displayAvatarURL();
    } catch {
      icon = c.user?.displayAvatarURL();
    }
    //CREATE THE EMBED
    const LogEmbed = new Discord.MessageEmbed()
      .setColor(color ? color : "BLACK")
      .setDescription(description ? description.substring(0, 2048) : "\u200b")
      .setTitle(title ? title.substring(0, 256) : "\u200b")
      .setTimestamp()
      .setThumbnail(thumb ? thumb : icon)
      .setFooter(c.getFooter(guild?.name, icon))
    if(fieldt && fieldv){
      if(fieldv.trim() !== ">>>") {
        LogEmbed.addField(fieldt.substring(0, 256), fieldv.substring(0, 1024))
      }
    }2
    if(fieldt2 && fieldv2){
      if(fieldv2.trim() !== ">>>") {
        LogEmbed.addField(fieldt2.substring(0, 256), fieldv2.substring(0, 1024))
      }
    }
    //GET THE CHANNEL
    let loggersettings = await c.settings.get(guild?.id+".logger")
    if (!loggersettings || loggersettings.channel === "no") return;
    const logger = await guild?.channels.fetch(loggersettings.channel).catch(()=>null) || await c.channels.fetch(loggersettings.channel).catch(()=>null)
    if (!logger || !logger.type) return // throw new SyntaxError(`CHANNEL ${loggersettings.channel} NOT FOUND ON THIS SHARD`)
    try {logger.send({embeds: [LogEmbed]}).catch(() => null)}catch{}
    return;
  } catch (e) {
    console.error(e)
  }
}