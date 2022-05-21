const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `nickname`,
  category: `🚫 Administration`,
  aliases: [`changenickname`],
  description: `Change the Nickname of a Member`,
  usage: `nickname @User [New Nickname]`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    

    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_NICKNAMES]))      
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(`:x: **I am missing the Permission to Manage Nicknames of others**`)
        ]})
      //databasing(client, message.guild.id, message.author?.id);
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.nickname || [];
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `nickname`;
            let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
            if(index > -1) {
              GuildSettings.cmdadminroles[File].splice(index, 1);
              client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
            }
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.MANAGE_NICKNAMES]))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable3"]))
        ]});
      let kickmember = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``);
      if (!kickmember)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`:x: **You forgot to ping a Member**`)
          .setDescription(`Usage: \`${prefix}nickname @User newnickname\``)
        ]});
      if(!args[1])
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`:x: **You forgot to add a Nickname**`)
          .setDescription(`Usage: \`${prefix}nickname @User newnickname\``)
        ]});
      let nickname = args.slice(1).join(" ");
      if(nickname.length > 32)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`:x: **The Nickname must have smaller then 32 Characters**`)
          .setDescription(`Usage: \`${prefix}nickname @User newnickname\``)
        ]});
      kickmember.setNickname(nickname).then(member => {
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setTitle(`:white_check_mark: **Successfully changed the username of \`${kickmember.user.tag}\` to \`${nickname}\`**`)
        ]});
      }).catch(e=>{
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable18"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable19"]))
        ]});
      })
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

