const {
  MessageEmbed, MessageAttachment,
  Permissions
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "embed",
  category: "🚫 Administration",
  aliases: ["embed"],
  cooldown: 2,
  usage: "embed <TITLE> ++ <DESCRIPTION>",
  description: "Resends a message from u as an Embed\n\n To have forexample no title do that:  embed ++ This is what an Embed without Image Looks like",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.embed")
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
              client.settings.remove(message.guild.id, r, `cmdadminroles.embed`)
            }
          }
        }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["embed"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["embed"]["variable2"]))
        ]});
      if (!args[0])
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["embed"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["embed"]["variable4"]))
        ]});
      let userargs = args.join(" ").split("++");
      let title = userargs[0];
      let desc = userargs.slice(1).join(" ")
      let attachment = false;
      let name = false;
      if (message.attachments.size > 0) {
        if (message.attachments.every(attachispng)) {
          name = "image.png"
          attachment = new MessageAttachment(url, name)
        }
        if (message.attachments.every(attachisjpg)) {
          name = "image.jpg"
          attachment = new MessageAttachment(url, name)
        }
        if (message.attachments.every(attachisgif)) {
          name = "image.gif"
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
      message.channel.send(sendData).then(d=>{
        var ee = "Here is your Command, if you wanna use it again!";
        if(message.content.length > 2000){
          ee = "Here is your Command"
        }
        if(message.content.length > 2020){
          ee = ""
        }
        if(client.settings.get(message.author.id, "dm"))
          message.author.send({content : `${ee}\`\`\`${message.content}`.substring(0, 2040) + "\`\`\`"}).catch(e => console.log("Couldn't Dm Him this log prevents a crash"))
      }).catch(e=>{
        return message.reply({content : `${e.message ? String(e.message).substring(0, 1900) : String(e).grey.substring(0, 1900)}`, code: "js"});
      })
      
      client.stats.push(message.guild.id+message.author.id, new Date().getTime(), "says"); 
      
      if(client.settings.get(message.guild.id, `adminlog`) != "no"){
        try{
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if(!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["embed"]["variable5"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
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
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["embed"]["variable8"]))
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
