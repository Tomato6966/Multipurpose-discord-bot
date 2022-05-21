const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const ms = require(`ms`);
const {
  MessageEmbed, Permissions
} = require(`discord.js`)
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `unmute`,
  category: `🚫 Administration`,
  aliases: [``],
  cooldown: 4,
  usage: `unmute @User`,
  description: `Unmutes a User!`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      if(!message.guild.me.permissions.has("MANAGE_ROLES"))      
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable1"]))
      ]})
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.unmute || [];
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
              const File = `unmute`;
              let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
              if(index > -1) {
                GuildSettings.cmdadminroles[File].splice(index, 1);
                client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
            }
          }
        }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable3"]))
        ]});
      let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``);
      if (!member)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable5"]))
        ]});
      args.shift();
      if (member.roles.highest.position >= message.member.roles.highest.position)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable6"]))
        ]});

      let allguildroles = [...message.guild.roles.cache.values()];
      let mutedrole = false;
      for (let i = 0; i < allguildroles.length; i++) {
        if (allguildroles[i].name.toLowerCase().includes(`muted`)) {
          mutedrole = allguildroles[i];
          break;
        }
      }
      if (!mutedrole) {
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable7"]))
        ]});
      }
      if (mutedrole.position > message.guild.me.roles.highest.position) {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable8"]))
        ]});
      }
      try {
        member.roles.remove(mutedrole);
      } catch (e) {
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable9"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable10"]))
        ]});
      }
      message.reply({embeds :[new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable11"]))
      ]});
      member.send({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable12"]))
      ]});

      if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
        try{
          var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
          if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          channel.send({embeds :[new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable13"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
           ]} )
        }catch (e){
          console.error(e)
        }
      } 
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["unmute"]["variable16"]))
      ]});
    }
  }
};

