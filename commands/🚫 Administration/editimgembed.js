const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: "editimgembed",
  category: "🚫 Administration",
  aliases: ["editimge"],
  cooldown: 2,
  usage: "editembed <OLDEMBED_ID> ++ <TITLE> ++ <IMAGELINK> ++ <DESCRIPTION>\n\n To have forexample no title do that:  editembed 822435791775072266 ++ ++ This is what an Embed without Title Looks like",
  description: "DONT FORGET TO ADD THE \"++\"! They are needed, and used to declare where the TITLE and where the DESCRIPTION is!\nEdits an already existing Embed",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.editimgembed || [];
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
              const File = `editimgembed`;
              let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
              if(index > -1) {
                GuildSettings.cmdadminroles[File].splice(index, 1);
                client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
            }
          }
        }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has("ADMINISTRATOR"))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["editimgembed"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["editimgembed"]["variable2"]))
        ]});
      if (!args[0])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["editimgembed"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["editimgembed"]["variable4"]))
        ]});
      let userargs = args.join(" ").split("++");
      let oldembedid = userargs[0];
      let title = userargs[1];
      let image = userargs[2];
      let desc = userargs.slice(3).join(" ")
      message.delete().catch(e => console.log("Couldn't delete msg, this is a catch to prevent crash"))
      var ee = "Here is your Command, if you wanna use it again!";
      if(message.content.length > 2000){
        ee = "Here is your Command"
      }
      if(message.content.length > 2020){
        ee = ""
      }
      if(await client.settings.get(message.author?.id, "dm"))
      message.author.send(`${ee}\`\`\`${message.content}`.substring(0, 2040) + "\`\`\`").catch(e => console.log("Couldn't Dm Him this log prevents a crash"))

      message.channel.messages.fetch(oldembedid).then(msg=>{
        msg.edit({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setImage(image ? image.includes("http") ? image : message.author.displayAvatarURL : message.author.displayAvatarURL)
        .setTitle(title ? title.substring(0, 256) : "")
        .setDescription(desc ? desc.substring(0, 2048) : "")
        ]}).then(async d => {
        var ee = "Here is your Command, if you wanna use it again!";
        if(message.content.length > 2000){
          ee = "Here is your Command"
        }
        if(message.content.length > 2020){
          ee = ""
        }
        if(await client.settings.get(message.author?.id, "dm"))
          message.author.send({content : `${ee}\`\`\`${message.content}`.substring(0, 2040) + "\`\`\`"}).catch(e => console.log("Couldn't Dm Him this log prevents a crash"))
      })
    }).catch(e=>{
      return message.reply({content : `${e.message ? String(e.message).substring(0, 1900) : String(e).grey.substring(0, 1900)}`, code: "js"});
    })
      
      await client.stats.push(message.guild.id+message.author?.id+".says", new Date().getTime()); 
      if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
        try{
          var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
          if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          channel.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["editimgembed"]["variable5"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
          ]})
        }catch (e){
          console.error(e)
        }
      } 

      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["editimgembed"]["variable8"]))
      ]});
    }
  }
}

