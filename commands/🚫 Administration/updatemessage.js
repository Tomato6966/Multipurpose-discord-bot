const {
  MessageEmbed, Message, Permissions
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: "updatemessage",
  category: "🚫 Administration",
  aliases: ["updatemsg", "updateembed", "uembed"],
  cooldown: 2,
  usage: "updatemessage <#Channel> <Message_ID>",
  description: "Allows you to update already send messages automatically!",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.updatemessage || [];
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
              const File = `updatemessage`;
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
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable2"]))
        ]});
      var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(args[0]) || message.channel;
      var id = args[1]
      if (!channel || channel == null || !channel.id || channel.id == 0)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable4"]))
        ]});
        if (!id || id.length != 18)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable6"]))
        ]});

      message.delete().catch(e => console.log("Couldn't delete msg, this is a catch to prevent crash"))
     
   
      channel.messages.fetch(id).then(msg=>{
        if(msg.content && !msg.embeds[0]){
          return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable7"]))
          ]});
        }
        if(msg.embeds[0]){
          var embed = msg.embeds[0]
          embed.footer ? embed.footer.text = es.footertext : embed.setFooter(client.getFooter(es));
          embed.footer ? embed.footer.iconURL = es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL()  : embed.setFooter(client.getFooter(es));
          embed.thumbnail ? embed.thumbnail.url = es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null : embed
          embed.color = es.color;
          msg.edit({embeds :[embed]})
        }
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable9"]))
        ]}).then(msg=>{
          setTimeout(()=>{try{
            msg.delete().catch(e=>{console.log("Prevented a bug".gray)})
            }catch {}
          }, 5000)
        })
      }).catch(e=>{
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable10"]))
        ]});
      })
      

      if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
        try{
          var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
          if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          channel.send({embeds :[new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable11"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.error(e)
        }
      } 

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable14"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["updatemessage"]["variable15"]))
      ]});
    }
  }
}

