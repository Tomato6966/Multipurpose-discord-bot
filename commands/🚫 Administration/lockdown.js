const {
  MessageEmbed,
  Permissions
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: "lockdown",
  category: "🚫 Administration",
  aliases: ["hardlock", "hardlockdown", "lockall"],
  cooldown: 2,
  usage: "lockdown",
  description: "Locks all Text Channels instantly",
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.channellock || [];
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
              const File = `channellock`;
              let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
              if(index > -1) {
                GuildSettings.cmdadminroles[File].splice(index, 1);
                client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
            }
          }
        }
      if (!message.member?.permissions?.has([Permissions.FLAGS_ADMINISTRATOR]))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(":x: This Command is very dangerous")
          .setDescription("You **have to** have the `ADMINISTRATOR` PERMISSION!")
        ]});

      let channels = message.guild.channels.cache.filter(c => !c.isThread() && c.isText());
      let success = [];
      let failed = [];
      for(const channel of channels) {
        if(channel.permissionOverwrites.cache.size < 1){ 
          await channel.permissionOverwrites.set(
            [{
              id: message.guild.roles.everyone.id,
              deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
            }]
          ).then(() => { success.push(channel.id); }).catch(e => { failed.push(channel.id); });
        } else {
          // if already locked
          if(channel.permissionOverwrites.cache.filter(permission => permission.allow.toArray().includes("SEND_MESSAGES")).size < 1)
            continue;

          await channel.permissionOverwrites.set(
            channel.permissionOverwrites.cache.map(permission => {
              let Obj = {
                id: permission.id,
                deny: permission.deny.toArray(),
                allow: permission.allow.toArray(),
              };
              if(Obj.allow.includes("SEND_MESSAGES")){
                Obj.deny.push("SEND_MESSAGES");
                let index = Obj.allow.indexOf("SEND_MESSAGES");
                if(index > -1){
                  Obj.allow.splice(index, 1);
                }
              }
              if(Obj.allow.includes("ADD_REACTIONS")){
                Obj.deny.push("ADD_REACTIONS");
                let index = Obj.allow.indexOf("ADD_REACTIONS");
                if(index > -1){
                  Obj.allow.splice(index, 1);
                }
              }
              return Obj;
            })).then(e => { success.push(channel.id); }).catch(e => { failed.push(channel.id); });
        }
      }

      message.reply({embeds :[new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setDescription(`<a:yes:833101995723194437> **Successfully locked \`${success.length} Channels\`**${failed.length > 0 ? `\nFailed at: ${failed.map(c => `<#${c}>`).join(" | ")}` : ``}`.substring(0, 2000))
      ]});


      if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
        try{
          var ch = message.guild.channels.cache.get(GuildSettings.adminlog)
          if(!ch) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          ch.send({embeds :[new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable5"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.error(e)
        }
      }
    } catch (e) {
      console.error(e)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["say"]["variable8"]))
      ]});
    }
  }
}