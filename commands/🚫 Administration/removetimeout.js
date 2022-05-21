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
  name: `removetimeout`,
  category: `🚫 Administration`,
  description: `Removes the timeouts of a Member from a Guild`,
  usage: `removetimeout @User`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    

    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.removetimeout || [];
      //databasing(client, message.guild.id, message.author?.id);
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `removetimeout`;
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
      if(!kickmember.communicationDisabledUntilTimestamp) return message.reply(":x: **This User is not timeouted!**");
      
      let time = 0;
      

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
            .setTitle(`Your Timeout got removed by \`${message.author.tag}\``)
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
        kickmember.timeout(time).then(async () => {
          await client.stats.push(message.guild.id+message.author?.id+".mute", new Date().getTime()); 
          message.reply({embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setTitle(`**${kickmember.user.tag}'s** Timeout got removed by \`${message.author.tag}\` `)
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

