const {
  MessageEmbed, Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  dbEnsure, dbRemove
} = require(`../../handlers/functions`);
module.exports = {
  name: `unwarn`,
  category: `🚫 Administration`,
  aliases: [`removewarn`, `warnremove`],
  description: `Removes a Warn from a Member with the ID`,
  usage: `unwarn @User <WARN_ID>`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.unwarn || [];
      var cmdrole = []
        if(cmdroles.length > 0){
          for await (const r of cmdroles){
            if(message.guild.roles.cache.get(r)){
              cmdrole.push(` | <@&${r}>`)
            }
            else if(message.guild.members.cache.get(r)){
              cmdrole.push(` | <@${r}>`)
            }
            else {
              const File = `unwarn`;
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
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable2"]))
        ]});
      let warnmember = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``);
      if (!warnmember)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable4"]))
        ]});

      if (!args[1])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable6"]))
        ]});

      const memberPosition = warnmember.roles.highest.position;
      const moderationPosition = message.member.roles.highest.position;

      if (moderationPosition <= memberPosition)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable7"]))
        ]});

      try {
        await dbEnsure(client.userProfiles, message.author?.id, {
          id: message.author?.id,
          guild: message.guild.id,
          totalActions: 0,
          warnings: [],
          kicks: []
        });

        const warnIDs = await client.userProfiles.get(message.author?.id + '.warnings')
        const modActions = await client.modActions.all();
        const warnData = warnIDs.map(id => modActions.find(d => d.ID == id)?.data);
        let warnings = warnData.filter(v => v.guild == message.guild.id);

        if (!warnIDs || !dwarnData || !dwarnData.length || !warnData || !warnData.length)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable8"]))
          ]});
        if (Number(args[1]) >= warnData.length || Number(args[1]) < 0)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable9"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable10"]))
          ]});

        let warning = warnData[parseInt(args[1])]
        let warned_by = message.guild.members.cache.get(warning.moderator) ? message.guild.members.cache.get(warning.moderator).user.tag : warning.moderator;
        let warned_at = warning.when;
        let warned_in = await client.getGuildData(warning.guild).then(g => g.name) || warning.guild;

        warnmember.send({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable11"]))
          .addField(`Warned by:`, `\`${warned_by}\``, true)
          .addField(`Warned at:`, `\`${warned_at}\``, true)
          .addField(`Warned in:`, `\`${warned_in}\``, true)
          .addField(`Warn Reason:`, `\`${warning.reason.length > 900 ? warning.reason.substring(0, 900) + ` ...` : warning.reason}\``, true)

        ]}).catch(e => console.log(e.message))

        message.reply({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable12"]))
          .addField(`Warned by:`, `\`${warned_by}\``, true)
          .addField(`Warned at:`, `\`${warned_at}\``, true)
          .addField(`Warned in:`, `\`${warned_in}\``, true)
          .addField(`Warn Reason:`, `\`${warning.reason.length > 900 ? warning.reason.substring(0, 900) + ` ...` : warning.reason}\``, true)
        ]});
        await dbRemove(client.userProfiles, warnmember.user.id+'.warnings', warnIDs[parseInt(args[1])])

        if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
          try{
            var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
            if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
            channel.send({embeds :[new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
              .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable13"]))
              .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
             .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
              .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
             ]} )
          }catch (e){
            console.error(e)
          }
        } 
      } catch (e) {
        console.error(e);
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable16"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable17"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["unwarn"]["variable18"]))
      ]});
    }
  }
};

