const {
  MessageEmbed, Collection, MessageAttachment, Permissions
} = require("discord.js");
const Discord = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const moment = require("moment")
const fs = require('fs')
const {
  databasing, delay, create_transcript, GetUser, GetRole
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
  name: "instantdelete",
  category: "🚫 Administration",
  aliases: ["instantdelete", "instantdel","fastdelete", "fastdel", "quickdelete", "quickcl", "idelete", "fdelete", "forcedelete", "forcedel"],
  cooldown: 2,
  usage: "instantdelete",
  description: "Instant Deletes the Ticket",
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    const guild = message.guild;
    
    try {
        let adminroles = GuildSettings?.adminroles || [];
        let cmdroles = GuildSettings?.cmdadminroles?.ticket || [];
        let cmdroles2 = GuildSettings?.cmdadminroles?.close || [];
        try{for (const r of cmdroles2) cmdroles.push(r)}catch{}
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
                const File = `ticket`;
                let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
                if(index > -1) {
                  GuildSettings.cmdadminroles[File].splice(index, 1);
                  client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
                }
                const File2 = `close`;
                let index2 = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File2]?.indexOf(r) || -1 : -1;
                if(index2 > -1) {
                  GuildSettings.cmdadminroles[File2].splice(index2, 1);
                  client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
                }
            }
          }
        }
      if(!client.setups.has(message.channel.id) || !client.setups.has(message.channel.id, "ticketdata")) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["close"]["variable2"])})
      let Ticketdata = client.setups.get(message.channel.id, "ticketdata");
      if(!Ticketdata) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["close"]["variable2"])})
      let ticketSystemNumber = String(Ticketdata.type).split("-");
      ticketSystemNumber = ticketSystemNumber[ticketSystemNumber.length - 1];
      let ticket = client.setups.get(message.guild.id, `${String(Ticketdata.type).includes("menu") ? "menu": ""}ticketsystem${ticketSystemNumber}`)
      
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]) && !message.member.roles.cache.some(r => ticket.adminroles.includes(r ? r.id : r)))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["close"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["close"]["variable4"]))
        ]});
        let buttonuser = cmduser.user;
        let button_ticket_verify = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_verify').setLabel("Verify this Step").setEmoji("950884027320135711")
        let msg = await message.reply({
            content: `<@${buttonuser.id}>`,
            embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable13"]))
                .setColor(es.color)
            ],
            components: [new MessageActionRow().addComponents(button_ticket_verify)]
        })
        const collector = msg.createMessageComponentCollector(bb => !bb?.user.bot, {
            time: 30000
        }); //collector for 5 seconds
        collector.on('collect', async b => {
            if (b?.user.id !== buttonuser.id)
                return b?.reply(`:x: **Only the one who typed ${prefix}help is allowed to react!**`, true)


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
                let data = client.setups.get(msg.channel.id, "ticketdata");

                let index = String(data.type).slice(-1);
                if (data.type.includes("apply")) {
                    client.setups.remove("TICKETS", data.user, `applytickets${index != "-" ? index : ""}`);
                    client.setups.remove("TICKETS", data.channel, `applytickets${index != "-" ? index : ""}`);
                } else if (data.type.includes("menu")) {
                    client.setups.remove("TICKETS", data.user, `menutickets${index != "-" ? index : ""}`);
                    client.setups.remove("TICKETS", data.channel, `menutickets${index != "-" ? index : ""}`);
                } else {
                    client.setups.remove("TICKETS", data.user, `tickets${index != "-" ? index : ""}`);
                    client.setups.remove("TICKETS", data.channel, `tickets${index != "-" ? index : ""}`);
                }
                try {
                    client.setups.delete(msg.channel.id);
                } catch {

                }
                if(ticket.ticketlogid && ticket.ticketlogid.length > 5){
                    try {
                        let logChannel = guild.channels.cache.get(ticket.ticketlogid);
                        if(logChannel){
                            msglimit = 1000;
                            //The text content collection
                            let messageCollection = new Collection(); //make a new collection
                            let channelMessages = await channel.messages.fetch({ //fetch the last 100 messages
                                limit: 100
                            }).catch(() => null); //catch any error
                            messageCollection = messageCollection.concat(channelMessages); //add them to the Collection
                            let tomanymsgs = 1; //some calculation for the messagelimit
                            if (Number(msglimit) === 0) msglimit = 100; //if its 0 set it to 100
                            let messagelimit = Number(msglimit) / 100; //devide it by 100 to get a counter
                            if (messagelimit < 1) messagelimit = 1; //set the counter to 1 if its under 1
                            while (channelMessages.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
                                if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
                                tomanymsgs += 1; //add 1 to the counter
                                let lastMessageId = channelMessages.lastKey(); //get key of the already fetched messages above
                                channelMessages = await channel.messages.fetch({
                                    limit: 100,
                                    before: lastMessageId
                                }).catch(() => null); //Fetch again, 100 messages above the already fetched messages
                                if (channelMessages) //if its true
                                    messageCollection = messageCollection.concat(channelMessages); //add them to the collection
                            }
                            //reverse the array to have it listed like the discord chat
                            create_transcript_buffer([...messageCollection.values()], channel, guild).then(async path => {
                                try { // try to send the file
                                    const attachment = new MessageAttachment(path); //send it as an attachment
                                    //send the Transcript Into the Channel and then Deleting it again from the FOLDER
                                    let sendembed = new MessageEmbed()
                                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable20"]))
                                        .setColor(ee.color)
                                        .setFooter({text: `${ee.footertext}`, iconURL: `${ee.footericon}`})
                                    try {
                                        let user = guild.members.cache.get(data.user)
                                        sendembed.setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable21"]))
                                        sendembed.setThumbnail(user.user.displayAvatarURL({
                                            dynamic: true
                                        }))

                                    } catch {
                                        sendembed.setDescription(channel.topic)
                                    }
                                    await logChannel.send({
                                        content: `<@${buttonuser.id}>`,
                                        embeds: [sendembed]
                                    }).catch(e=>console.error(e))
                                    await logChannel.send({
                                        files: [attachment]
                                    }).catch(e=>console.error(e))
                                    //await tmmpmsg.delete().catch(e=>console.error(e))
                                    await fs.unlinkSync(path)
                                } catch (error) { //if the file is to big to be sent, then catch it!
                                    console.log(error)
                                }
                            }).catch(e => {
                                console.log(String(e).grey)
                            })
                        }
                    } catch (e){
                        console.error(e)
                    }
                }

                await msg.channel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable14"]))
                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setDescription(`Deleting Ticket in less then **\`3 Seconds\`** ....\n\n*If not you can do it manually*`.substring(0, 2000))
                        .setFooter(client.getFooter(es))
                    ]
                })
                setTimeout(() => {
                    msg.channel.delete().catch((e) => {
                        console.log(String(e).grey)
                    });
                }, 3500)

                if (GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no") {
                    let message = msg; //NEEDED FOR THE EVALUATION!
                    try {
                        var adminchannel = guild.channels.cache.get(GuildSettings.adminlog)
                        if (!adminchannel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
                        adminchannel.send({
                            embeds: [new MessageEmbed()
                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                .setAuthor(`ticket --> LOG | ${message.author.tag}`, message.author.displayAvatarURL({
                                    dynamic: true
                                }))
                                .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable15"]))
                                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
                            ]
                        })
                    } catch (e) {
                        console.error(e)
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
            .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable18"]))
            .setColor(es.wrongcolor)
        collector.on('end', collected => {
            if (!edited) {
                edited = true;
                msg.edit({
                    content: `<@${buttonuser.id}>`,
                    embeds: [endedembed],
                    components: [new MessageActionRow().addComponents(button_ticket_verify.setDisabled(true).setLabel("FAILED TO VERIFY").setEmoji("951013282607685632").setStyle('DANGER'))]
                }).catch((e) => {
                    console.log(String(e).grey)
                });
            }
        });
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


