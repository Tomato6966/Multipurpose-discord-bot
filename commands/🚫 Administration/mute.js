const config = require(`../../botconfig/config.json`);
const ms = require(`ms`);
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const {
  MessageEmbed,
  Permissions
} = require(`discord.js`)
const {
  databasing,delay, dbEnsure
} = require(`../../handlers/functions`);
module.exports = {
  name: `mute`,
  category: `🚫 Administration`,
  aliases: [``],
  cooldown: 4,
  usage: `mute @User <Time+Format(e.g: 10m) / perma> [REASON]`,
  description: `Mutes a User for a specific Time!`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    try {
      if (!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES]))
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable1"]))
        ]})
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.mute || [];
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `mute`;
            let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
            if(index > -1) {
              GuildSettings.cmdadminroles[File].splice(index, 1);
              client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
            }
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable3"]))
        ]});
      let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``);
      if (!member)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable5"]))
        ]});

      if(!message.member || message.member.roles ||!message.member.roles.highest) await message.member.fetch().catch(() => null);
      args.shift();
      if (member.roles.highest.position >= message.member.roles.highest.position)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable6"]))
        ]});

      let mutesettings = GuildSettings.mute;
      if(!mutesettings) {
        mutesettings = {
          style: "timeout",
          roleId: "",
          defaultTime: 60000,  
        };
        await dbEnsure(client.settings, message.guild.id, mutesettings)
      } 
      /*
          mute: {
            style: "timeout",
            roleId: "",
            defaultTime: 60000,  
          }
      */
      let time = args[0];
      if (!time) {
          message.reply(`No Time added, now using the default time: \`${mutesettings.defaultTime / 1000} ms\``);
          time = mutesettings.default;
      }
      let mutedRole = mutesettings.roleId ? message.guild.roles.cache.get(mutesettings.roleId) || false : false;

      if(!mutedRole || mutesettings.style == "timeout") {
        if (!member.manageable)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(":x: **I am not able to manage this User**")
          ]}).catch(() => null);

        args.shift();

        let reason = args.join(` `);

        if(String(time).toLowerCase().includes("pe")) {
          message.reply("In the `timeout` mute-style you can't mute permament, using the maximum: `1 Week`")
          time = "1 Week";
        }
        
        let mutetime;
        try {
          mutetime = ms(time);
        } catch (e) {
          mutetime = mutesettings.defaultTime;
        }
        console.log(mutetime);
        member.timeout(mutetime, reason).then(async () => {  
          console.log("SUCCESS")
            //send Information in the Chat
            message.reply({
              content: `||**Timeout until <t:${Math.floor((mutetime + Date.now()) / 1000)}:F>** - *Because no valid Role*||`,
              embeds: [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setTitle(String(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable14"])).replace("MUTED", "TIMEOUTED"))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable15"]))
            ]}).catch(() => null)
            //increase the Mod Stats
            await client.stats.push(message.guild.id + message.author?.id+".mute", new Date().getTime());
            //Send information to the MUTE - MEMBER
            member.send({
              embeds:[ new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable16"]))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable17"]))
            ]}).catch(() => null)
        }).catch((e) => {
            console.error(e)
            return message.reply(`:x: **I could not timeout ${member.user.tag}**`).then(m => {
                setTimeout(() => { m.delete().catch(() => null) }, 5000);
            });
        });

      } else {
        let allguildroles = [...message.guild.roles.cache.values()];
        if (mutedRole.position > message.guild.me.roles.highest.position)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable10"]))
          ]});
        if (String(time).toLowerCase().includes("pe")) {
          try{
            args.shift();
            let reason = args.join(` `);
            await member.roles.add(mutedRole).catch(e=>{
              console.error(e)
            })
            //send Information in the Chat
            message.reply({
              embeds: [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable14"]))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable15"]))
            ]});
            //increase the Mod Stats
            await client.stats.push(message.guild.id + message.author?.id+".mute", new Date().getTime());
            //Send information to the MUTE - MEMBER
            member.send({
              embeds:[ new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable16"]))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable17"]))
            ]}).catch(() => null)
            //Add the Member to the Mute DB
            await client.mutes.push("MUTES.MUTES", {
              timestamp: Date.now(),
              mutetime: -1,
              role: mutedRole.id,
              user: member.user.id,
              guild: message.guild.id,
              channel: message.channel.id,
              reason: reason,
            })
            //increase the Mod Stats
            await client.stats.push(message.guild.id + message.author?.id+".mute", new Date().getTime());
            
            await message.guild.channels.cache
              .filter(c => c.permissionOverwrites)
              .filter(c => 
                !c.permissionOverwrites.cache.has(mutedRole.id) || 
                (c.permissionOverwrites.cache.has(mutedRole.id) && !c.permissionOverwrites.cache.get(mutedRole.id).deny.toArray().includes("SEND_MESSAGES")) ||
                (c.permissionOverwrites.cache.has(mutedRole.id) && !c.permissionOverwrites.cache.get(mutedRole.id).deny.toArray().includes("ADD_REACTIONS"))
            ).forEach(async (ch) => {
              try {
                if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                  await ch.permissionOverwrites.edit(mutedRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false,
                    SPEAK: false
                  }).catch(() => null)
                  await delay(1500);
                }
              } catch (e) {
                console.error(e);
              }
            });
          }catch(e){
            return message.reply({
              embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.erroroccur)
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable13"]))
           ] });
          }
        } else {
          args.shift();
          let reason = args.join(` `);
          let mutetime;
          try {
            mutetime = ms(time);
          } catch (e) {
            return message.reply({
              embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable11"]))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable12"]))
            ]});
          }
          try {
            
            await member.roles.add(mutedRole).catch(e=>{
              console.error(e)
            })
            if (!mutetime || mutetime === undefined) {
              return message.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor).setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable18"]))
                  .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable19"]))
              ]});
            }
            //Send information in the Chat
            message.reply({
              embeds: [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable20"]))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable21"]))
            ]});
            //Add the Member to the Mute DB
            await client.mutes.push("MUTES.MUTES", {
              timestamp: Date.now(),
              mutetime: mutetime,
              role: mutedRole.id,
              user: member.user.id,
              guild: message.guild.id,
              channel: message.channel.id,
              reason: reason,
            })
            //increase the Mod Stats
            await client.stats.push(message.guild.id + message.author?.id+".mute", new Date().getTime());
            //Send information to the MUTE - MEMBER
            member.send({
              embeds: (new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable22"]))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable23"]))
            )}).catch(() => null)
  
            await message.guild.channels.cache
              .filter(c => c.permissionOverwrites)
              .filter(c => 
                !c.permissionOverwrites.cache.has(mutedRole.id) || 
                (c.permissionOverwrites.cache.has(mutedRole.id) && !c.permissionOverwrites.cache.get(mutedRole.id).deny.toArray().includes("SEND_MESSAGES")) ||
                (c.permissionOverwrites.cache.has(mutedRole.id) && !c.permissionOverwrites.cache.get(mutedRole.id).deny.toArray().includes("ADD_REACTIONS"))
            ).forEach(async (ch) => {
              try {
                if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                  await ch.permissionOverwrites.edit(mutedRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false,
                    SPEAK: false
                  }).catch(() => null)
                  await delay(1500);
                }
              } catch (e) {
                console.error(e);
              }
            });
          } catch (e) {
            return message.reply({
              embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.erroroccur)
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable13"]))
          ] });
          }
            
        }
      }



      if (GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no") {
        try {
          var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
          if (!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          channel.send({embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
          })))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable24"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
        ]})
        } catch (e) {
          console.error(e)
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable27"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["mute"]["variable28"]))
      ]});
    }
  }
};

