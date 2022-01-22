const {
  MessageEmbed, Collection, MessageAttachment, Permissions
} = require("discord.js");
const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const moment = require("moment")
const fs = require('fs')
const {
  databasing, delay, create_transcript, GetUser, GetRole
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
  name: "instantclose",
  category: "🚫 Administration",
  aliases: ["instantclose", "instantcl", "fastclose", "fastcl", "quickclose", "quickcl", "iclose", "fclose", "forceclose", "forcecl"],
  cooldown: 2,
  usage: "instantclose",
  description: "Instant Closes the Ticket",
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix) => {
    const guild = message.guild;
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.ticket")
      let cmdroles2 = client.settings.get(message.guild.id, "cmdadminroles.close")
      try{for (const r of cmdroles2) cmdrole.push(r)}catch{}
     
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
              try{ client.settings.remove(message.guild.id, r, `cmdadminroles.ticket`) }catch{ }
              try{ client.settings.remove(message.guild.id, r, `cmdadminroles.close`) }catch{ }
            }
          }
        }
      if(!client.setups.has(message.channel.id) || !client.setups.has(message.channel.id, "ticketdata")) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["close"]["variable2"])})
      let Ticketdata = client.setups.get(message.channel.id, "ticketdata");
      if(!Ticketdata) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["close"]["variable2"])})
      let ticketSystemNumber = String(Ticketdata.type).split("-");
      ticketSystemNumber = ticketSystemNumber[ticketSystemNumber.length - 1];
      let ticket = client.setups.get(message.guild.id, `${String(Ticketdata.type).includes("menu") ? "menu": ""}ticketsystem${ticketSystemNumber}`)
      
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && !message.member.roles.cache.some(r => ticket.adminroles.includes(r ? r.id : r)))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["close"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["close"]["variable4"]))
        ]});
      let data = client.setups.get(message.channel.id, "ticketdata");
      let buttonuser = cmduser.user;
      if (data.state === "closed") {
        return message.reply({
            content: `<@${buttonuser.id}>`,
            embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable5"]))
                .setColor(es.wrongcolor)
            ]
        })
      }
      let button_ticket_verify = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_verify').setLabel("Verify this Step").setEmoji("833101995723194437")
      message.reply({
          content: `<@${buttonuser.id}>`,
          embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable6"]))
              .setColor(es.color)
          ],
          components: [new MessageActionRow().addComponents(button_ticket_verify)]
      }).then(async msg => {
          const collector = msg.createMessageComponentCollector(bb => !bb?.user.bot, {
              time: 30000
          }); //collector for 5 seconds
          collector.on('collect', async b => {
              if (b?.user.id !== buttonuser.id)
                  return b?.reply(`<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, true)


              //page forward
              if (b?.customId == "ticket_verify") {
                edited = true;
                msg.edit({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new Discord.MessageEmbed()
                        .setTitle("Verified!")
                        .setColor(es.color)
                    ],
                    components: [new MessageActionRow().addComponents(button_ticket_verify.setDisabled(true))]
                }).catch((e) => {
                    console.log(String(e).grey)
                });
                  let index = String(data.type).slice(-1);
                  if (data.type.includes("apply")) {
                      client.setups.remove("TICKETS", data.user, `applytickets${index}`);
                      client.setups.remove("TICKETS", data.channel, `applytickets${index}`);
                  } else if (data.type.includes("menu")) {
                      client.setups.remove("TICKETS", data.user, `menutickets${index}`);
                      client.setups.remove("TICKETS", data.channel, `menutickets${index}`);
                  }  else {
                      client.setups.remove("TICKETS", data.user, `tickets${index}`);
                      client.setups.remove("TICKETS", data.channel, `tickets${index}`);
                  }
                  client.setups.set(msg.channel.id, "closed", "ticketdata.state");
                  data = client.setups.get(msg.channel.id, "ticketdata");
                  
                  if(msg.channel.permissionsFor(msg.channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                      await msg.channel.permissionOverwrites.edit(data.user, {
                          SEND_MESSAGES: false,
                          VIEW_CHANNEL: false,
                      });
                  }
                  msg.channel.send({
                      content: `<@${buttonuser.id}>`,
                      embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable7"]))
                          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                          .setDescription(`Closed the Ticket of <@${data.user}> and removed him from the Channel!`.substr(0, 2000))
                          .addField("User: ", `<@${data.user}>`)
                          .addField(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variablex_8"]), eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable8"]))
                          .addField("State: ", `${data.state}`)
                          .setFooter(client.getFooter(es))
                      ]
                  })
                  try { msg.channel.setName(String(msg.channel.name).replace("ticket", "closed").substr(0, 32)).catch((e)=>{console.log(e)}); } catch (e) { console.log(e) }
                  if (client.settings.get(guild.id, `adminlog`) != "no") {
                      let message = msg; //NEEDED FOR THE EVALUATION!
                      try {
                          var adminchannel = guild.channels.cache.get(client.settings.get(guild.id, `adminlog`))
                          if (!adminchannel) return client.settings.set(guild.id, "no", `adminlog`);
                          adminchannel.send({
                              embeds: [new MessageEmbed()
                                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                  .setAuthor(`ticket --> LOG | ${message.author.tag}`, message.author.displayAvatarURL({
                                      dynamic: true
                                  }))
                                  .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable9"]))
                                  .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                  .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                  .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
                              ]
                          })
                      } catch (e) {
                          console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      }
                  }
              } else {
                edited = true;
                msg.edit({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new Discord.MessageEmbed()
                        .setTitle("Cancelled!")
                        .setColor(es.wrongcolor)
                    ],
                    components: [new MessageActionRow().addComponents(button_ticket_verify.setDisabled(true))]
                }).catch((e) => {
                    console.log(String(e).grey)
                });
            }
          });
          let endedembed = new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable12"]))
              .setColor(es.wrongcolor)
          collector.on('end', collected => {
              if (!edited) {
                  edited = true;
                  msg.edit({
                      content: `<@${buttonuser.id}>`,
                      embeds: [endedembed],
                      components: [new MessageActionRow().addComponents(button_ticket_verify.setDisabled(true).setLabel("FAILED TO VERIFY").setEmoji("833101993668771842").setStyle('DANGER'))]
                  }).catch((e) => {
                      console.log(String(e).grey)
                  });
              }
          });
      })
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["close"]["variable6"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["close"]["variable7"]))
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
