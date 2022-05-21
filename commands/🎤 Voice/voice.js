const { MessageEmbed, Permissions } = require("discord.js");
const Discord = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const { dbEnsure } = require("../../handlers/functions");
module.exports = {
    name: "voice",
    category: "🎤 Voice",
    aliases: [""],
    cooldown: 5,
    extracustomdesc: "`voice add`, `voice ban`, `voice bitrate`, `voice invite`, `voice kick`, `voice limit`, `voice lock`, `voice promote`, `voice trust`, `voice trust`, `voice unban`, `voice unlock`, `voice untrust`, `voice stage`, `voice unstage`, `voice stage`, `voice unstage`, `vocie hide`, `voice unhide`, `voice help`",
    usage: "`voice <CMD_TYPE> [Options]`\n\nValid CMD_TYPES: `lock`, `invite`, `add`, `kick`, `unlock`, `ban`, `unban`, `trust`, `untrust`, `limit`, `bitrate`, `promote`, `stage`, `unstage`, `hide`, `unhide`",
    description: "The Voice Commands are there for the JOIN TO CREATE COMMANDS, use them to adjust your hosted channel!",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
      
    if(!GuildSettings.VOICE){
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }

    try {
      let newargs = message.content.slice(prefix.length).split(/ +/).slice(1);
      let args = newargs;
      let cmd = args.shift()
      if(cmd && cmd.length > 0) cmd = cmd.toLowerCase();
      if(cmd == "help") {

        return message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(`HELP FOR: **The Voice Command System**`)
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setDescription(`It is for the **JOIN TO CREATE** System of this BOT!\n> So, you can execute the \`voice\` Commands only in a TEMP-VOICE-CHANNEL\n> With those Commands you can manage the Channel and set it private or locked etc. etc.\n\nThese are the Types you can add after \`voice\`\n>>> \`lock\`,\`invite\`,\`add\`,\`kick\`,\`unlock\`,\`ban\`,\`unban\`,\`trust\`,\`untrust\`,\`limit\`,\`bitrate\`,\`promote\`, \`stage\`, \`unstage\`, \`hide\`, \`unhide\`, \`help\`\nUsage: \`${prefix}voice <CMD_TYPE> [Options]\``)
          .setFooter(client.getFooter(es))
          
        ]})
      }else if (cmd === "lock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable1"]))
          .setFooter(client.getFooter(es))
        ]})
        
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
    
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable2"]))
              .setFooter(client.getFooter(es))
            ]})
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.set([{
              id: message.guild.id,
              allow: ['VIEW_CHANNEL'],
              deny: ['CONNECT'],
            }])
            .then(lol => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(message.author?.id, {
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: true,
                CONNECT: true
              })
              return message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable3"]))
                .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable4"]))
                .setFooter(client.getFooter(es))
              ]})
            })
    
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable5"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "unlock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable6"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds :[new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable7"]))
              .setFooter(client.getFooter(es))
            ]})
            
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author?.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable8"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable9"]))
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable10"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "stage") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable1"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
    
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable2"]))
              .setFooter(client.getFooter(es))
            ]})
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.set([{
              id: message.guild.id,
              allow: ['VIEW_CHANNEL', 'CONNECT'],
              deny: ['SPEAK'],
            }])
            .then(lol => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(message.author?.id, {
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: true,
                CONNECT: true
              })
              return message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTitle("✅ STAGED your Channel!")
                .setDescription(`Noone can speak anymore!`)
                .setFooter(client.getFooter(es))
              ]})
            })
    
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable5"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "unstage") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable6"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds :[new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable7"]))
              .setFooter(client.getFooter(es))
            ]})
            
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: true,
            CONNECT: true,
            SPEAK: true,
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author?.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              SPEAK: true,
              CONNECT: true
            })
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle("✅ UNSTAGED your Channel!")
              .setDescription(`Everyone can speak in your Channel now!`)
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable10"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "hide") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable1"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
    
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable2"]))
              .setFooter(client.getFooter(es))
            ]})
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.set([{
              id: message.guild.id,
              allow: ['CONNECT'],
              deny: ['SPEAK', "VIEW_CHANNEL"],
            }])
            .then(lol => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(message.author?.id, {
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: true,
                CONNECT: true
              })
              return message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTitle("✅ HIDED your Channel!")
                .setDescription(`Noone can see you anymore!`)
                .setFooter(client.getFooter(es))
              ]})
            })
    
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable5"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "unhide") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable6"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds :[new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable7"]))
              .setFooter(client.getFooter(es))
            ]})
            
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: true,
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author?.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              SPEAK: true,
              CONNECT: true
            })
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle("✅ UNHIDED your Channel!")
              .setDescription(`Everyone can see your Channel now!`)
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable10"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "kick") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable11"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable12"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable13"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable14"]))
            .setFooter(client.getFooter(es))
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable15"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable16"]))
            .setFooter(client.getFooter(es))
          ]})
          if (!member.voice.channel)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable17"]))
              .setFooter(client.getFooter(es))
            ]})
          if (member.voice.channel.id != channel.id)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable18"]))
              .setFooter(client.getFooter(es))
            ]})
          try {
            member.voice.disconnect();
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable19"]))
              .setFooter(client.getFooter(es))
            ]})
          } catch (e) {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable20"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable21"]))
              .setFooter(client.getFooter(es))
            ]})
          }
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable22"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (["invite", "add"].includes(cmd)) {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable23"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable24"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable25"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable26"]))
            .setFooter(client.getFooter(es))
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable27"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable28"]))
            .setFooter(client.getFooter(es))
          ]})
          let txt = args.slice(1).join(" ");
          try {
            
            if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE)){
              return message.reply(`:x: **I am missing the CREATE_INSTANT_INVITE PERMISSION for \`${channel.name}\`**`)
            }
            channel.createInvite().then(invite => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(member.user.id, {
                VIEW_CHANNEL: true,
                CONNECT: true
              }).then(lol => {
                if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                  return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
                }
                vc.permissionOverwrites.edit(message.author?.id, {
                  MANAGE_CHANNELS: true,
                  VIEW_CHANNEL: true,
                  MANAGE_ROLES: true,
                  CONNECT: true
                })
                member.user.send({embeds : [new Discord.MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable29"]))
                  .setDescription(`[Click here](${invite.url}) to join **${channel.name}**\n\n${txt ? txt : ""}`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]}).catch(e => {
                  return message.reply({embeds : [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable30"]))
                    .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable31"]))
                    .setFooter(client.getFooter(es))
                  ]})
                })
              })
              return message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable32"]))
                .setFooter(client.getFooter(es))
              ]})
            })
    
          } catch (e) {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable33"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable34"]))
              .setFooter(client.getFooter(es))
            ]})
          }
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable35"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "ban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable36"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable37"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable38"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable39"]))
            .setFooter(client.getFooter(es))
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable40"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable41"]))
            .setFooter(client.getFooter(es))
          ]})
          if (member.voice.channel && member.voice.channel.id == channel.id)
            try {
              member.voice.disconnect();
              message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable42"]))
                .setFooter(client.getFooter(es))
              ]})
            } catch (e) {
              message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable43"]))
                .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable44"]))
                .setFooter(client.getFooter(es))
              ]})
            }
            
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {
            
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author?.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable45"]))
              .setFooter(client.getFooter(es))
            ]})
          })
    
    
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable46"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "unban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable47"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable48"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable49"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable50"]))
            .setFooter(client.getFooter(es))
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable51"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable52"]))
            .setFooter(client.getFooter(es))
          ]})
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author?.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable53"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable54"]))
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable55"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "trust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable56"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable57"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable58"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable59"]))
            .setFooter(client.getFooter(es))
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable60"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable61"]))
            .setFooter(client.getFooter(es))
          ]})
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author?.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable62"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable63"]))
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable64"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "untrust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds: [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable65"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable66"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable67"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable68"]))
            .setFooter(client.getFooter(es))
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable69"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable70"]))
            .setFooter(client.getFooter(es))
          ]})
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author?.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable71"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable72"]))
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable73"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "limit") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable74"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable75"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable76"]))
            ]});
          if (isNaN(args[0])) return message.reply(
            {embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable77"]))
            ]});
          let userlimit = Number(args[0]);
          if (userlimit > 99 || userlimit < 0) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable78"]))
            ]});
          channel.setUserLimit(userlimit).then(vc => {
            return message.reply({embeds :[new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable79"]))
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable80"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "bitrate") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable81"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable82"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply(
            {embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable83"]))
            ]});
          if (isNaN(args[0])) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable84"]))
            ]});
          let maxbitrate = 96000;
          let boosts = message.guild.premiumSubscriptionCount;
          if (boosts >= 2) maxbitrate = 128000;
          if (boosts >= 15) maxbitrate = 256000;
          if (boosts >= 30) maxbitrate = 384000;
          let userlimit = Number(args[0]);
          if (userlimit > maxbitrate || userlimit < 8000) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable85"]))
            ]});
          channel.setBitrate(userlimit).then(vc => {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable86"]))
              .setFooter(client.getFooter(es))
            ]})
          })
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable87"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else if (cmd === "promote") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable88"]))
          .setFooter(client.getFooter(es))
        ]})
        await dbEnsure(client.jointocreatemap, `tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        await dbEnsure(client.jointocreatemap, `owner_${message.guild.id}_${channel.id}`, false);
        if (await client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author?.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (await client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author?.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable89"]))
              .setFooter(client.getFooter(es))
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable90"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable91"]))
            .setFooter(client.getFooter(es))
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable92"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable93"]))
            .setFooter(client.getFooter(es))
          ]})
          if (!member.voice.channel)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable94"]))
              .setFooter(client.getFooter(es))
            ]})
          if (member.voice.channel.id != channel.id)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable95"]))
              .setFooter(client.getFooter(es))
            ]})
          try {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(member.user.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            }).then(l => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(message.author?.id, {
                  MANAGE_CHANNELS: false,
                  VIEW_CHANNEL: true,
                  MANAGE_ROLES: false,
                  CONNECT: true
                })
                .then(lol => {
                  client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, member.user.id);
                  return message.reply({embeds : [new Discord.MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable96"]))
                    .setFooter(client.getFooter(es))
                  ]})
                })
            })
          } catch (e) {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable97"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable98"]))
              .setFooter(client.getFooter(es))
            ]})
          }
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable99"]))
            .setFooter(client.getFooter(es))
          ]})
        }
      } else{
        return message.reply({embeds : [new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable100"]))
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setDescription(`Usage: \`${prefix}voice <CMD_TYPE> [Options]\`\nValid CMD_TYPES: \`lock\`,\`invite\`,\`add\`,\`kick\`,\`unlock\`,\`ban\`,\`unban\`,\`trust\`,\`untrust\`,\`limit\`,\`bitrate\`,\`promote\`, \`stage\`, \`unstage\`, \`hide\`, \`unhide\`, \`help\``)
        .setFooter(client.getFooter(es))
        ]});
      }
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable102"]))
        ]});
    }
  }
}

