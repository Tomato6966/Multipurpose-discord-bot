const {
  MessageEmbed, MessageAttachment,
  Permissions
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: "editembed",
  category: "🚫 Administration",
  aliases: ["edite", "editmessage", "editmsg"],
  cooldown: 2,
  usage: "editembed <OLDEMBED_ID> ++ <TITLE> ++ <DESCRIPTION>\n\n To have forexample no title do that:  editembed 822435791775072266 ++ ++ This is what an Embed without Title Looks like",
  description: "DONT FORGET TO ADD THE \"++\"! They are needed, and used to declare where the TITLE and where the DESCRIPTION is!\nEdits an already existing Embed",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.editembed || [];
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
              const File = `editembed`;
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
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable2"]))
        ]});
        if (!args[0])
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable3"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable4"]))
          ]});
        let userargs = args.join(" ").split("++");
        if (!userargs[0])
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable3"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable4"]))
          ]});
        let oldembedid = userargs[0];
        let title = userargs[1];
        let desc = userargs.slice(2).join(" ")
        let attachment = false;
        let name = false;
        if (message.attachments.size > 0) {
          if (message.attachments.every(attachispng)) {
            name = Date.now() + ".png"
            attachment = new MessageAttachment(url, name)
          }
          if (message.attachments.every(attachisjpg)) {
            name = Date.now() + ".jpg"
            attachment = new MessageAttachment(url, name)
          }
          if (message.attachments.every(attachisgif)) {
            name = Date.now() + ".gif"
            attachment = new MessageAttachment(url, name)
          }
        }
        message.delete().catch(e => console.log("Couldn't delete msg, this is a catch to prevent crash"))
        let sendembed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setTitle(title && desc ? title.substring(0, 256) : "")
          .setDescription(desc ? desc : title ? title.substring(0, 2048) : "")
        if(attachment) {
          sendembed.setImage("attachment://" + name)
        }
        let sendData = {embeds: [sendembed]};
  
        if(attachment){
          sendData.files = [attachment]
        }
      message.channel.messages.fetch(oldembedid).then(msg=>{
        if(!attachment){
          if (msg.attachments.size > 0) {
            if (msg.attachments.every(attachispng)) {
              name = "image.png"
              attachment = new MessageAttachment(url, name)
            }
            if (msg.attachments.every(attachisjpg)) {
              name = "image.jpg"
              attachment = new MessageAttachment(url, name)
            }
            if (msg.attachments.every(attachisgif)) {
              name = "image.gif"
              attachment = new MessageAttachment(url, name)
            }
            if(attachment) {
              sendData.embeds[0].setImage("attachment://" + name)
              sendData.files = [attachment]
            }
          }
        }
        msg.edit(sendData).then(async d => {
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
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable5"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.error(e)
        }
      } 

      function attachispng(msgAttach) {
        url = msgAttach.url;
        return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1;
      }
      function attachisjpg(msgAttach) {
        url = msgAttach.url;
        return url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
      }
      function attachisgif(msgAttach) {
        url = msgAttach.url;
        return url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1;
      }

      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["editembed"]["variable8"]))
      ]});
    }
  }
}

