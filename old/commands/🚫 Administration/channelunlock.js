const {
  MessageEmbed,
  Permissions
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "channelunlock",
  category: "🚫 Administration",
  aliases: ["chunlock", "unlockchannel", "unlockch"],
  cooldown: 2,
  usage: "channelunlock",
  description: "Unlocks a Text Channel instantly",
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.channelunlock")
      var cmdrole = []
        if(cmdroles.length > 0){
          for(const r of cmdroles){
            if(message.guild.roles.cache.get(r)){
              cmdrole.push(` | <@&${r}>`)
            }
            else if(message.guild.members.cache.get(r)){
              cmdrole.push(` | <@${r}>`)
            }
            else {
              
              //console.log(r)
              client.settings.remove(message.guild.id, r, `cmdadminroles.channelunlock`)
            }
          }
        }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["say"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable2"]))
        ]});
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
        if(channel.isThread())
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(`<:no:833101993668771842> **This Channel is a Thread u can't unlock it!**`)
          ]});
          if(channel.permissionOverwrites.cache.filter(permission => permission.deny.toArray().includes("SEND_MESSAGES")).size < 1)
            return message.reply({embeds :[new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(`<:no:833101993668771842> **This Channel is not locked!**`)
              .setDescription(`This usually means, that the Channel **PERMISSIONS** are so defined, that __all__ of them are ALLOWING to send a Message!`)
            ]});
            await channel.permissionOverwrites.set(
              channel.permissionOverwrites.cache.map(permission => {
                let Obj = {
                  id: permission.id,
                  deny: permission.deny.toArray(),
                  allow: permission.allow.toArray(),
                };
                if(Obj.deny.includes("SEND_MESSAGES")){
                  Obj.allow.push("SEND_MESSAGES");
                  let index = Obj.deny.indexOf("SEND_MESSAGES");
                  if(index > -1){
                    Obj.deny.splice(index, 1);
                  }
                }
                if(Obj.deny.includes("ADD_REACTIONS")){
                  Obj.allow.push("ADD_REACTIONS");
                  let index = Obj.deny.indexOf("ADD_REACTIONS");
                  if(index > -1){
                    Obj.deny.splice(index, 1);
                  }
                }
                return Obj;
            }))
          message.reply({embeds :[new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(`<a:yes:833101995723194437> **Successfully unlocked \`${channel.name}\`**`)
          ]});
      if(client.settings.get(message.guild.id, `adminlog`) != "no"){
        try{
          var ch = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if(!ch) return client.settings.set(message.guild.id, "no", `adminlog`);
          ch.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable5"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
      } 
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable8"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
