const config = require(`${process.cwd()}/botconfig/config.json`);
const ms = require(`ms`);
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  MessageEmbed,
  Permissions
} = require(`discord.js`)
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `permamute`,
  category: `🚫 Administration`,
  aliases: [``],
  cooldown: 4,
  usage: `permamute @User [REASON]`,
  description: `Mutes a User forever / until you unmute him!`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      if (!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES]))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable1"]))
        ]})
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.permamute")
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            
            //console.log(r)
            client.settings.remove(message.guild.id, r, `cmdadminroles.permamute`)
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.MANAGE_ROLES]))
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
          console.log(e.stack ? String(e.stack).grey : String(e).grey);
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
            }).catch(() => {})
            await delay(1500);
          }
        } catch (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey);
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
      client.stats.push(message.guild.id + message.author.id, new Date().getTime(), "mute");
      //Send information to the MUTE - MEMBER
      member.send({
        embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable12"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable13"]))
    ]}).catch((_) => {})
      
      if (client.settings.get(message.guild.id, `adminlog`) != "no") {
        try {
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if (!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
            }))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["permamute"]["variable14"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
           ]} )
        } catch (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
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
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
