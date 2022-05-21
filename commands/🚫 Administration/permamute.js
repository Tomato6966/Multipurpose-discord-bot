const config = require(`../../botconfig/config.json`);
const ms = require(`ms`);
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const {
  MessageEmbed,
  Permissions
} = require(`discord.js`)
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `permamute`,
  category: `🚫 Administration`,
  aliases: [``],
  cooldown: 4,
  usage: `permamute @User [REASON]`,
  description: `Mutes a User forever / until you unmute him!`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      if (!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES]))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable1"]))
        ]})
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.permamute || [];
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `permamute`;
            let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
            if(index > -1) {
              GuildSettings.cmdadminroles[File].splice(index, 1);
              client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
            }
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.MANAGE_ROLES]))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable3"]))
        ]});
      let member = message.mentions.members.filter(member => member.guild.id == message.guild.id).first();
      if (!member)
        return message.reply({embeds:  [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable5"]))
        ]});
      args.shift();
      if (member.roles.highest.position >= message.member.roles.highest.position)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable6"]))
        ]});
      let reason = args.join(` `);
      let allguildroles = [...message.guild.roles.cache.values()];
      let mutedrole = false;
      for (let i = 0; i < allguildroles.length; i++) {
        if (allguildroles[i].name.toLowerCase().includes(`muted`)) {
          mutedrole = allguildroles[i];
          break;
        }
      }
      //if no mutedrole found, do things here
      if (!mutedrole) {
        let highestrolepos = message.guild.me.roles.highest.position;
        mutedrole = await message.guild.roles.create({
          data: {
            name: `muted`,
            color: `#222222`,
            hoist: true,
            position: Number(highestrolepos) - 1
          },
          reason: `This role got created, to mute Members!`
        }).catch((e) => {
          console.error(e);
          message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable7"]))
          ]});
        });
      }
      //if the muted role position is bigger then the bots highest position
      if (mutedrole.position > message.guild.me.roles.highest.position)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable8"]))
        ]});
      //for each channel which does not have the mutedrole in it, update the permissions
      await message.guild.channels.cache.filter(c => !c.permissionOverwrites.cache.has(mutedrole.id)).forEach(async (ch) => {
        try {
          if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            await ch.permissionOverwrites.edit(mutedrole, {
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
      //try to add him the role
      try {
        await member.roles.add(mutedrole)
      } catch (e) {
        return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable9"]))
        ]});
      }

      //send Information in the Chat
      message.reply({
        embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable10"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable11"]))
      ]});
      //increase the Mod Stats
      await client.stats.push(message.guild.id + message.author?.id+".mute", new Date().getTime());
      //Send information to the MUTE - MEMBER
      member.send({
        embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable12"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable13"]))
    ]}).catch(() => null)
      
      if (GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no") {
        try {
          var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
          if (!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          channel.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
            }))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable14"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
           ]} )
        } catch (e) {
          console.error(e)
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable17"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable18"]))
      ]});
    }
  }
};

