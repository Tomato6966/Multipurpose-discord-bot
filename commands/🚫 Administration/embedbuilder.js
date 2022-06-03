const {
  MessageEmbed,
  Permissions
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  databasing
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow } = require("discord.js") // using discord.js but edited!
module.exports = {
  name: "embedbuilder",
  category: "🚫 Administration",
  aliases: ["embedb"],
  cooldown: 2,
  usage: "embedbuilder --> follow Steps",
  description: "Resends a message from u as an Embed\n\n To have forexample no title do that:  embed ++ This is what an Embed without Image Looks like",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.embedbuilder || [];
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
              const File = `embedbuilder`;
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
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["embedbuilder"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["embedbuilder"]["variable2"]))
        ]});
    let embedToBuild = new MessageEmbed()
    .setAuthor(message.member.user.tag, message.member.user.avatarURL({dynamic:true}))

let title = new MessageButton()
    .setLabel("Title")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_title`)

let description = new MessageButton()
    .setLabel("Description")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_desc`)

let footer = new MessageButton()
    .setLabel("Footer")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_footer`)

  
let footerImage = new MessageButton()
    .setLabel("Footer Image")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_footerimg`)

let image = new MessageButton()
    .setLabel("Image")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_img`)

let thumbnail = new MessageButton()
    .setLabel("Thumbnail")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_thumb`)

let timestamp = new MessageButton()
    .setLabel("Timestamp")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_timestamp`)

let color = new MessageButton()
    .setLabel("Color")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_color`)

let save = new MessageButton()
    .setLabel("📨 Send")
    .setStyle('DANGER')
    .setCustomId(`buildEmbed_save`)

let cancel = new MessageButton()
    .setLabel("❌ Cancel")
    .setStyle('DANGER')
    .setCustomId(`buildEmbed_cancel`)

let channel = new MessageButton()
    .setLabel("💬 Select Channel")
    .setStyle('PRIMARY')
    .setCustomId(`buildEmbed_builder_channel`)

let buttonRow = new MessageActionRow().addComponents([title, description])
let buttonRow1 = new MessageActionRow().addComponents([footer, color, timestamp])
let buttonRow2 = new MessageActionRow().addComponents([footerImage, image, thumbnail])
let buttonRow3 = new MessageActionRow().addComponents([save, cancel, channel])

let msg = await message.reply({
    embeds: [embedToBuild],
    components: [buttonRow, buttonRow1, buttonRow2, buttonRow3]
})
let buttonEvent = async (interaction) => {
  if(!interaction || !interaction?.isButton()) return;
  if (interaction?.message.id === msg.id) {
    if (interaction?.user.id === message.member.id) {
      embedEditing(interaction);
    } else {
      await interaction?.reply({content : `:x: You are not allowed to do that! Only: <@${message.author?.id}>`, ephemeral : true}); //ephemeral message
    }
  }
}
let channel2send = false;
client.on("interactionCreate", buttonEvent)

let embedEditing = async(button) => {
    if(!button?.customId.startsWith(`buildEmbed`) && button?.message.id == msg.id) return;
    await button?.deferUpdate();

    let id = button?.customId.split(`buildEmbed_`)[1]
    if(id.startsWith(`builder`)) {
        let builderId = id.split(`builder_`)[1]
        let noInput = ["timestamp"]
        let noInputFinal = !noInput.some(a => a == builderId);
        let ifUrl = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');

        button?.message.edit({content : `<a:Loading:950883677255118898> **Please send me Your Input now!**`,
            components: [new MessageActionRow().addComponents([new MessageButton().setLabel("Cancel").setStyle('DANGER').setCustomId(`buildEmbed_cancel`)])]
        })

        let input;
        if(noInputFinal) {
            let filter = async(message) => button?.user.id == message.author?.id
            input = await button?.channel.awaitMessages({filter,  max: 1, time: 30000, errors: ['time'] }).catch(e => {
                return client.emit(`interactionCreate`, {
                    id: `buildEmbed_cancel`,
                    message: button?.message,
                    channel: button?.channel
                })
            })
        }

        let finalInput = input && input.size > 0 ? input.first() : "";
        if(builderId == "channel") channel2send = finalInput.mentions.channels.first() || false;
        if(builderId == "title") embedToBuild.setTitle(finalInput.content)
        if(builderId == "desc") embedToBuild.setDescription(finalInput.content)
        if(builderId == "footer") embedToBuild.setFooter(finalInput.content)
        
        if(builderId == "color") {
            if(!/^#[0-9A-F]{6}$/i?.test(finalInput.content)) embedToBuild.setColor("RANDOM")
            else embedToBuild.setColor(finalInput.content)
        }
        if(builderId == "footerimg") {
            if(ifUrl.test(finalInput)) {
                embedToBuild.setFooter(client.getFooter(`${embedToBuild.footer ? embedToBuild.footer.text : "\u200B"}`, finalInput.content))
            }
        }
        if(builderId == "img") {
            if(ifUrl.test(finalInput)) {
                embedToBuild.setImage(finalInput.content)
            }
        }
        if(builderId == "thumb") {
            if(ifUrl.test(finalInput)) {
                embedToBuild.setThumbnail(finalInput.content)
            }
        }

        if(builderId == "timestamp") {
          embedToBuild.setTimestamp()
        }
        button?.message.edit({
            embeds: [embedToBuild],
            components: [buttonRow, buttonRow1, buttonRow2, buttonRow3]
        })
        if(finalInput) finalInput.delete().catch(e=>{ });
    }

    if(id == `cancel`) {
        button?.message.edit({content :`Canceling...` ,components:null}) 

        setTimeout(async() => {
            let message = await button?.channel.messages.fetch(button?.message.id).catch(() => null)
            message.delete();
        }, 3000)

        await client.removeListener("interactionCreate", buttonEvent);
    }

    if(id == `save`) {
        let messageToDelete = await button?.channel.messages.fetch(button?.message.id).catch(() => null);

        messageToDelete.delete();
          embedToBuild = Object.keys(embedToBuild).reduce((object, key) => {
            if(key !== "author") {
              object[key] = embedToBuild[key]
            }
            return object
          }, {})

        if(channel2send) 
        channel2send.send({embeds:[embedToBuild],components:null}) 
        else
        button?.channel.send({embeds:[embedToBuild],components:null}) 
        await client.removeListener("interactionCreate", buttonEvent);
    }

    setTimeout(() => {
        button?.message.edit({embeds:[embedToBuild], components:null})
        client.removeListener("interactionCreate", buttonEvent);
    }, 300000)
  }

    if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
      try{
        var channel2 = message.guild.channels.cache.get(GuildSettings.adminlog)
        if(!channel2) return client.settings.set(`${message.guild.id}.adminlog`, "no");
        channel2.send({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
          .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["embedbuilder"]["variable3"]))
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
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["embedbuilder"]["variable6"]))
      ]});
    }
  }
}

