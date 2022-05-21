const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const ms = require("ms");
const {
  databasing, duration
} = require(`../../handlers/functions`);
module.exports = {
  name: `timeout`,
  category: `🚫 Administration`,
  description: `Timeouts a Member from a Guild`,
  usage: `timeout @User <Timespan> [Reason] | e.g: timeout @User 10h+20min Stop spamming!`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    

    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.timeout || [];
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `timeout`;
            let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
            if(index > -1) {
              GuildSettings.cmdadminroles[File].splice(index, 1);
              client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
            }
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable3"]))
        ]}).catch(() => null);
      let kickmember = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``) || await message.guild.members.fetch(args[0] ? args[0] : ``).catch(() => null) || false;
      if (!kickmember) 
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable5"]))
        ]}).catch(() => null);
      if(!message.member || message.member.roles ||!message.member.roles.highest) await message.member.fetch().catch(() => null);
      if(kickmember.communicationDisabledUntilTimestamp) return message.reply(":x: **This User is already timeouted!**");
      let time = 0;
      if(!args[1]) return message.reply(`:x: **No time added!**\nTry something like this:\n> \`${prefix}timeout ${kickmember.id} 1h+15min Stop spamming!\``)
      let timeargs = [args[1]];
      if(timeargs[0].includes("+")) {
        timeargs = timeargs[0].split("+");
      }
      for await (const a of timeargs.filter(Boolean)){
        time += ms(a)
      }
      if(!time || isNaN(time)) return message.reply(`:x: **You added a invalid time!**\nTry something like this:\n> \`${prefix}timeout ${kickmember.id} 1h+15min Stop spamming!\``)
      
      let reason = args.slice(2).join(` `);
      if (!reason) {
        reason = `No Reason added | Timeout by: ${message.author.tag} (${message.author?.id})`
      }

      const memberPosition = kickmember.roles.highest.rawPosition;
      const moderationPosition = message.member.roles.highest.rawPosition;

      if (moderationPosition <= memberPosition)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable6"]))
        ]}).catch(() => null);

      if (!kickmember.manageable)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(":x: **I am not able to manage this User**")
        ]}).catch(() => null);
      try{
        if(!kickmember.user.bot){
          kickmember.user.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setTitle(`You got timeouted by \`${message.author.tag}\` for ${duration(time).map(t => `\`${t}\``).join(" ")}`)
            .setDescription(`Reason:\n>>> ${reason}`.substring(0, 2048))
          ]}).catch((e)=>{
            console.error(e)
          });
        }
      } catch (e){
        console.error(e)
        message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable10"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable11"]))
        ]}).catch(() => null);
      }
      try {
        kickmember.timeout(time, reason).then(async () => {
          await client.stats.push(message.guild.id+message.author?.id+".mute", new Date().getTime()); 
          message.reply({embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setTitle(`**${kickmember.user.tag}** got timeouted by \`${message.author.tag}\` for ${duration(time).map(t => `\`${t}\``).join(" ")}`)
            .setDescription(`Reason:\n>>> ${reason}`.substring(0, 2048))
          ]}).catch((e)=>{console.error(e)})
          if (GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no") {
            try {
              var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
              if (!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
              channel.send({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
                  dynamic: true
                }))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable14"]))
                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
              ]})
            } catch (e) {
              console.error(e)
            }
          }
        });
      } catch (e) {
        console.error(e);
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable17"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable18"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable19"]))
      ]});
    }
  }
};

