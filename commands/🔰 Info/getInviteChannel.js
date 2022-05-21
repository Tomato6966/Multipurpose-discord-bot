const {
  MessageEmbed, Permissions
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { MessageButton } = require('discord.js')
const { handlemsg } = require(`../../handlers/functions`)
module.exports = {
  name: "getinvitechannel",
  category: "🔰 Info",
  usage: "getinvitechannel",
  description: "Gives you an Invite link for an Channel",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
      if(!Channel)  return message.reply(handlemsg(client.la[ls].cmds.info.getinvitechannel.error)) 
      if(!Channel.permissionsFor(Channel.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE)){
        return `:x: **I am missing the CREATE_INSTANT_INVITE PERMISSION for \`${Channel.name}\`**`
      }
      await Channel.createInvite().then(invite => {
        if(invite.error){
          let e = invite.error;
          console.log(String(e.stack).grey.bgRed)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
          ]});
        }
        message.reply(`https://discord.gg/${invite.code}`);
      }).catch(e=>{
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
        ]});
      })
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

