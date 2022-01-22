const {
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    Collection,
    MessageAttachment,
    Permissions
} = require("discord.js");
const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const moment = require("moment")
const fs = require('fs')
const {
    databasing,
    delay,
    create_transcript,
    GetUser,
    GetRole,
    create_transcript_buffer
} = require(`${process.cwd()}/handlers/functions`);

module.exports = client => {
    
    //Event
    client.on("interactionCreate", async (interaction) => {
        if (!interaction?.isButton()) return;
        var {
            guild,
            channel,
            user,
            message
        } = interaction;
        if (!guild || !channel || !message || !user) return;
        if (!interaction?.customId.includes("ticket_")) return;
        if (interaction?.customId.includes("create_a_ticket")) return;
        let temptype = interaction?.customId.replace("ticket_", "")
        let buttonuser = user;
        await guild.members.fetch().catch(() => {});
        let member = guild.members.cache.get(user.id);
        if (!client.settings.has(guild.id, "language")) client.settings.ensure(guild.id, {
            language: "en"
        });
        let ls = client.settings.get(guild.id, "language");
        if (!member) member = await guild.members.fetch(user.id).catch((e) => {
            return interaction?.reply(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable1"]))
        });
        if (!member) return interaction?.reply(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable2"]))

        let prefix = client.settings.get(interaction?.guild.id, "prefix")
        let adminroles = client.settings.get(guild.id, "adminroles")
        let cmdroles = client.settings.get(guild.id, "cmdadminroles.ticket")
        let cmdroles2 = client.settings.get(guild.id, "cmdadminroles.close")
        let es = client.settings.get(guild.id, "embed");
        try {
            for (const r of cmdroles2) cmdrole.push(r)
        } catch {}

        if(!client.setups.has(channel.id)){
            if(interaction.customId != "ticket_verify"){
                interaction?.reply({content: ":x: This channel is not a Ticket", ephemeral: true})
            }
            return;
        }
        interaction?.deferUpdate();
        let Ticketdata = client.setups.get(channel.id, "ticketdata");
        let ticketSystemNumber = String(Ticketdata.type).split("-");
        ticketSystemNumber = ticketSystemNumber[ticketSystemNumber.length - 1];

        let ticket = client.setups.get(guild.id, `${String(Ticketdata.type).includes("menu") ? "menu": ""}ticketsystem${ticketSystemNumber}`)
        let theadminroles = ticket.adminroles;
        if(String(Ticketdata.type).includes("menu") && Ticketdata.menutickettype && Ticketdata.menutickettype > 0) {
            let adminRoles = client[`menuticket${Ticketdata.menutickettype}`].get(guild.id, "access");
            theadminroles = adminRoles;
        }

        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    try {
                        client.settings.remove(guild.id, r, `cmdadminroles.ticket`)
                    } catch {}
                    try {
                        client.settings.remove(guild.id, r, `cmdadminroles.close`)
                    } catch {}
                }
            }
        }
        let edited = false;
        if (temptype == "close") {
            let data = client.setups.get(channel.id, "ticketdata");
            if (data.state === "closed") {
                return channel.send({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable5"]))
                        .setColor(es.wrongcolor)
                    ]
                })
            }
            let button_ticket_verify = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_verify').setLabel("Verify this Step").setEmoji("833101995723194437")
            channel.send({
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
                    if (b?.user.id !== user.id)
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
                                        .setAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                            dynamic: true
                                        }))
                                        .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable9"]))
                                        .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                        .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                        .setTimestamp().setFooter({text: `ID: ${user.id}`})
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
        } else if (temptype == "delete") {
            let ticketspecific = [];
            if(theadminroles.length == 0) {
                ticketspecific = ["No Ticket Specific Roles/Users specified"];
            } else {
                for(const a of theadminroles) {
                    if(message.guild.roles.cache.has(a)) {
                        ticketspecific.push(`<@&${a}>`);
                    } else if(message.guild.members.cache.has(a)){
                        ticketspecific.push(`<@${a}>`);
                    }
                }
            }
            if (([...member.roles.cache.values()] && !member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(interaction?.user.id) && ([...member.roles.cache.values()] && !member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) && !member.permissions.has("ADMINISTRATOR") && !member.roles.cache.some(r => theadminroles.includes(r ? r.id : r))&& !theadminroles.includes(member.id)) {
                return channel.send({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle("<:no:833101993668771842> You are not allowed to delete this Ticket")
                        .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join(" | ") + theadminroles.join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\` You can also add Ticket only Roles with \`${prefix}setup-ticket\``}`)
                        .addField("Ticket Specific Role(s)/User(s):", `${ticketspecific.join(", ")}`.substr(0, 1024))
                    ]
                });
            }
            let button_ticket_verify = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_verify').setLabel("Verify this Step").setEmoji("833101995723194437")
            let msg = await channel.send({
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
                if (b?.user.id !== user.id)
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
                                }).catch(() => {}); //catch any error
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
                                    }).catch(() => {}); //Fetch again, 100 messages above the already fetched messages
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
                                        }).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
                                        await logChannel.send({
                                            files: [attachment]
                                        }).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
                                        //await tmmpmsg.delete().catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
                                        await fs.unlinkSync(path)
                                    } catch (error) { //if the file is to big to be sent, then catch it!
                                        console.log(error)
                                    }
                                }).catch(e => {
                                    console.log(String(e).grey)
                                })
                            }
                        } catch (e){
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        }
                    }

                    await msg.channel.send({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable14"]))
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setDescription(`Deleting Ticket in less then **\`3 Seconds\`** ....\n\n*If not you can do it manually*`.substr(0, 2000))
                            .setFooter(client.getFooter(es))
                        ]
                    })
                    setTimeout(() => {
                        msg.channel.delete().catch((e) => {
                            console.log(String(e).grey)
                        });
                    }, 3500)

                    if (client.settings.get(guild.id, `adminlog`) != "no") {
                        let message = msg; //NEEDED FOR THE EVALUATION!
                        try {
                            var adminchannel = guild.channels.cache.get(client.settings.get(guild.id, `adminlog`))
                            if (!adminchannel) return client.settings.set(guild.id, "no", `adminlog`);
                            adminchannel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                    .setAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                        dynamic: true
                                    }))
                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable15"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                    .setTimestamp().setFooter({text: `ID: ${user.id}`})
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
                .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable18"]))
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
        } else if (temptype == "log" || temptype == "transcript") {
            msglimit = 1000;
            let data = client.setups.get(channel.id, "ticketdata");
            //The text content collection
            let messageCollection = new Collection(); //make a new collection
            let channelMessages = await channel.messages.fetch({ //fetch the last 100 messages
                limit: 100
            }).catch(() => {}); //catch any error
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
                }).catch(() => {}) //Fetch again, 100 messages above the already fetched messages
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
                    await channel.send({
                        content: `<@${buttonuser.id}>`,
                        embeds: [sendembed]
                    })
                    await channel.send({
                        files: [attachment]
                    })
                    //await tmmpmsg.delete().catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
                    await fs.unlinkSync(path)
                    if (client.settings.get(guild.id, `adminlog`) != "no") {
                        try {
                            var adminchannel = guild.channels.cache.get(client.settings.get(guild.id, `adminlog`))
                            if (!adminchannel) return client.settings.set(guild.id, "no", `adminlog`);
                            adminchannel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                    .setAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                        dynamic: true
                                    }))
                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable22"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                    .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                ]
                            })
                        } catch (e) {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        }
                    }
                } catch (error) { //if the file is to big to be sent, then catch it!
                    console.log(error)
                    channel.send({
                        content: `<@${buttonuser.id}>`,
                        embeds: [new MessageEmbed().setAuthor("ERROR! Transcript is to big, to be sent into the Channel!", user.displayAvatarURL({
                            dynamic: true
                        })).setFooter({text: `${eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable25"])}`})]
                    })
                }
            }).catch(e => {
                console.log(String(e).grey)
            })
        } else if (temptype == "user") {
            if (([...member.roles.cache.values()] && !member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(interaction?.user.id) && ([...member.roles.cache.values()] && !member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) && !member.permissions.has("ADMINISTRATOR") && !member.roles.cache.some(r => theadminroles.includes(r ? r.id : r))) {
                return channel.send({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle("<:no:833101993668771842> You are not allowed to add/remove Users to/from this Ticket")
                        .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join(" | ") + theadminroles.join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\` You can also add Ticket only Roles with \`${prefix}setup-ticket\``}`)
                    ]
                });
            }
            channel.send({
                content: `<@${buttonuser.id}>`,
                embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable32"]))
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setDescription(`Either with <@USERID> or with the USERNAME, or with the USERID`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                ]
            }).then(async msg => {
                msg.channel.awaitMessages({filter: m => m.author.id === buttonuser.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                }).then(async collected => {
                    var message = collected.first();
                    var args = message.content.split(" ")
                    var user;
                    try {
                        user = await GetUser(message, args)
                    } catch (e) {
                        if (!e) return channel.send(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable33"]))
                        return channel.send(e)
                    }
                    if (!user || user == null || user.id == null || !user.id) channel.send(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable34"]))
                    var mapped = msg.channel.permissionOverwrites.cache.map(p => {
                        if (p.type == "member") {
                            var obj = {
                                id: "",
                                allow: []
                            };
                            obj.id = p.id;
                            obj.allow = p.allow ? p.allow.toArray() : []
                            return obj;
                        } else {
                            return {
                                id: "",
                                allow: []
                            };
                        }
                    })
                    var oldmapped = mapped;
                    var undermapped = mapped.map(p => p.id)
                    if (undermapped.includes(user.id)) {
                        oldmapped.forEach((element) => {
                            if (element.id == user.id) {
                                if (!element.allow.includes("VIEW_CHANNEL")) {
                                    if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                                        return channel.send(`:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`);
                                    }
                                    channel.permissionOverwrites.edit(user.id, {
                                            SEND_MESSAGES: true,
                                            VIEW_CHANNEL: true,
                                        }).then(channel => {
                                            channel.send({
                                                content: `<@${buttonuser.id}>`,
                                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable35"]))
                                                ]
                                            })
                                            if (client.settings.get(guild.id, `adminlog`) != "no") {
                                                try {
                                                    var adminchannel = guild.channels.cache.get(client.settings.get(guild.id, `adminlog`))
                                                    if (!adminchannel) return client.settings.set(guild.id, "no", `adminlog`);
                                                    adminchannel.send({
                                                        embeds: [new MessageEmbed()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                                            .setAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                                dynamic: true
                                                            }))
                                                            .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable36"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                                            .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                                        ]
                                                    })
                                                } catch (e) {
                                                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                                }
                                            }
                                        })
                                        .catch(e => {
                                            return channel.send({
                                                embeds: [new MessageEmbed()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable39"]))
                                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable40"]))
                                                ]
                                            });
                                        });
                                } else {
                                    if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                                        return channel.send(`:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`);
                                    }
                                    channel.permissionOverwrites.edit(user.id, {
                                            SEND_MESSAGES: false,
                                            VIEW_CHANNEL: false,
                                        }).then(channel => {
                                            return channel.send({
                                                content: `<@${buttonuser.id}>`,
                                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable41"]))
                                                ]
                                            })
                                        })
                                        .catch(e => {
                                            return channel.send({
                                                embeds: [new MessageEmbed()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable42"]))
                                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable43"]))
                                                ]
                                            });
                                        });
                                }
                            }
                        });
                    } else {
                        if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                            return channel.send(`:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`);
                        }
                        channel.permissionOverwrites.edit(user.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                        }).then(channel => {
                            channel.send({
                                content: `<@${buttonuser.id}>`,
                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                    .setFooter(client.getFooter(es))
                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable44"]))
                                ]
                            })
                            if (client.settings.get(guild.id, `adminlog`) != "no") {
                                try {
                                    var adminchannel = guild.channels.cache.get(client.settings.get(guild.id, `adminlog`))
                                    if (!adminchannel) return client.settings.set(guild.id, "no", `adminlog`);
                                    adminchannel.send({
                                        embeds: [new MessageEmbed()
                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                            .setAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                dynamic: true
                                            }))
                                            .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable45"]))
                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                            .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                        ]
                                    })
                                } catch (e) {
                                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                }
                            }
                        }).catch(e => {
                            return channel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(client.getFooter(es))
                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable48"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable49"]))
                                ]
                            });
                        }).catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return channel.send({
                                content: `<@${buttonuser.id}>`,
                                embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable50"]))
                                    .setColor(es.wrongcolor)
                                    .setDescription(`"Cancelled"`.substr(0, 2000))
                                    .setFooter(client.getFooter(es))
                                ]
                            });
                        })
                    }
                }).catch(e => {
                    console.log(String(e).grey)
                })
            })
        } else if (temptype == "role") {
            if (([...member.roles.cache.values()] && !member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(interaction?.user.id) && ([...member.roles.cache.values()] && !member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) && !member.permissions.has("ADMINISTRATOR") && !member.roles.cache.some(r => theadminroles.includes(r ? r.id : r))) {
                return channel.send({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle("<:no:833101993668771842> You are not allowed to add/remove Roles to/from this Ticket")
                        .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join(" | ") + theadminroles.join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\` You can also add Ticket only Roles with \`${prefix}setup-ticket\``}`)
                    ]
                });
            }
            channel.send({
                content: `<@${buttonuser.id}>`,
                embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable51"]))
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setDescription(`Either with <@&ROLEID> or with the ROLEID or with the ROLENAME`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                ]
            }).then(async msg => {
                msg.channel.awaitMessages({filter: m => m.author.id === buttonuser.id, 
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                }).then(async collected => {
                    var message = collected.first();
                    var args = message.content.split(" ")
                    var user;
                    try {
                        user = await GetRole(message, args)
                    } catch (e) {
                        if (!e) return channel.send(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable52"]))
                        return channel.send("ERROR" + e)
                    }
                    if (!user || user == null || user.id == null || !user.id) channel.send(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable53"]))
                    var mapped = msg.channel.permissionOverwrites.cache.map(p => {
                        if (p.type == "role") {
                            var obj = {
                                id: "",
                                allow: []
                            };
                            obj.id = p.id;
                            obj.allow = p.allow ? p.allow.toArray() : []
                            return obj;
                        } else {
                            return {
                                id: "",
                                allow: []
                            };
                        }
                    })
                    var oldmapped = mapped;
                    var undermapped = mapped.map(p => p.id)
                    if (undermapped.includes(user.id)) {
                        oldmapped.forEach((element) => {
                            if (element.id == user.id) {
                                if (!element.allow.includes("VIEW_CHANNEL")) {
                                    if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                                        return channel.send(`:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`);
                                    }
                                    channel.permissionOverwrites.edit(user.id, {
                                            SEND_MESSAGES: true,
                                            VIEW_CHANNEL: true,
                                        }).then(channel => {
                                            channel.send({
                                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable54"]))
                                                ]
                                            })
                                            if (client.settings.get(guild.id, `adminlog`) != "no") {
                                                try {
                                                    var adminchannel = guild.channels.cache.get(client.settings.get(guild.id, `adminlog`))
                                                    if (!adminchannel) return client.settings.set(guild.id, "no", `adminlog`);
                                                    adminchannel.send({
                                                        embeds: [new MessageEmbed()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                                            .setAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                                dynamic: true
                                                            }))
                                                            .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable55"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                                            .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                                        ]
                                                    })
                                                } catch (e) {
                                                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                                }
                                            }
                                        })
                                        .catch(e => {
                                            return channel.send({
                                                embeds: [new MessageEmbed()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable58"]))
                                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable59"]))
                                                ]
                                            });
                                        });
                                } else {
                                    if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                                        return channel.send(`:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`);
                                    }
                                    channel.permissionOverwrites.edit(user.id, {
                                            SEND_MESSAGES: false,
                                            VIEW_CHANNEL: false,
                                        }).then(channel => {
                                            return channel.send({
                                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable60"]))
                                                ]
                                            })
                                        })
                                        .catch(e => {
                                            return channel.send({
                                                embeds: [new MessageEmbed()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable61"]))
                                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable62"]))
                                                ]
                                            });
                                        });
                                }
                            }
                        });
                    } else {
                        if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                            return channel.send(`:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`);
                        }
                        channel.permissionOverwrites.edit(user.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                            }).then(channel => {
                                channel.send({
                                    embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable63"]))
                                    ]
                                })
                                if (client.settings.get(guild.id, `adminlog`) != "no") {
                                    try {
                                        var adminchannel = guild.channels.cache.get(client.settings.get(guild.id, `adminlog`))
                                        if (!adminchannel) return client.settings.set(guild.id, "no", `adminlog`);
                                        adminchannel.send({
                                            embeds: [new MessageEmbed()
                                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                                .setAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                    dynamic: true
                                                }))
                                                .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable64"]))
                                                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                                .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                            ]
                                        })
                                    } catch (e) {
                                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                    }
                                }
                            })
                            .catch(e => {
                                return channel.send({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable67"]))
                                        .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable68"]))
                                    ]
                                });
                            });
                    }
                }).catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return channel.send({
                        content: `<@${buttonuser.id}>`,
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable69"]))
                            .setColor(es.wrongcolor)
                            .setDescription(`"Cancelled"`.substr(0, 2000))
                            .setFooter(client.getFooter(es))
                        ]
                    });
                })
            })
        } else if (temptype == "claim") {
            if (([...member.roles.cache.values()] && !member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(interaction?.user.id) && ([...member.roles.cache.values()] && !member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) && !member.permissions.has("ADMINISTRATOR") && !member.roles.cache.some(r => theadminroles.includes(r ? r.id : r))) {
                return channel.send({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle("<:no:833101993668771842> You are not allowed to claim this Ticket")
                        .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join(" | ") + theadminroles.join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\` You can also add Ticket only Roles with \`${prefix}setup-ticket\``}`)
                    ]
                });
            }
            let data = client.setups.get(channel.id, "ticketdata");
            if(!channel.permissionsFor(member).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
                if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                    return channel.send(`:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`);
                }
                channel.permissionOverwrites.edit(member.user, {
                    SEND_MESSAGES: true
                }).catch(e=>{
                    return interaction?.reply({ephemeral: true, content: ":x: **Can't change the Permissions of you!**"});
                });
            }
            message.edit({content: message.content, embeds: [message.embeds[0]], components: message.components}).catch(e => {console.log(e.stack ? String(e.stack).grey : String(e).grey)});
            let messageClaim = "";
            if(String(Ticketdata.type).includes("menu")) {
                messageClaim = client[`menuticket${Ticketdata.menutickettype}`].get(guild.id, "claim.messageClaim")
            } else {
                messageClaim = ticket.claim.messageClaim;
            }
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(es.color)
                        .setAuthor(member.user.tag, member.displayAvatarURL({dynamic: true}))
                        .setDescription(messageClaim.replace(/\{claimer\}/ig, `${member.user}`).replace(/\{user\}/ig, `<@${data.user}>`))
                ]
            }).catch(e => {console.log(e.stack ? String(e.stack).grey : String(e).grey)});
        
        }
    });


    //menu Ticket
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.menuticket1.ensure(message.guild.id, {
                messageId: "",
                channelId: "",
                claim: {
                  enabled: false,
                  messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                  messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
                },
                access: [],
                data: [
                  /*
                    {
                      value: "",
                      description: "",
                      category: null,
                      replyMsg: "{user} Welcome to the Support!",
                    }
                  */
                ]
              });
            let settings = client.menuticket1.get(guild.id);
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
               let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
                }
                let data = settings.data[index];
                let replyMsg = data.replyMsg;

                let systempath = `menuticketsystem${index > 0 ? index : ""}`; 
                let ticketspath = `menutickets${index > 0 ? index : ""}`; 
                let idpath = `menuticketid${index > 0 ? index : ""}`; 
                let tickettypepath = `menu-ticket-setup-${index > 0 ? index : ""}`; 
  
                client.setups.ensure(guild.id, {
                    enabled: false,
                    guildid: guild.id,
                    messageid: "",
                    channelid: "",
                    parentid: "",
                    message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
                    adminroles: []
                }, systempath);
                if (client.setups.get("TICKETS", ticketspath).includes(user.id)) {
                    try {
                      var ticketchannel = guild.channels.cache.get(client.setups.get(user.id, idpath))
                      if (!ticketchannel || ticketchannel == null || !ticketchannel.id || ticketchannel.id == null) throw {
                        message: "NO TICKET CHANNEL FOUND AKA NO ANTISPAM"
                      }
                      if(client.setups.has(ticketchannel.id) && client.setups.has(ticketchannel.id, "ticketdata"))
                      {
                        let data = client.setups.get(ticketchannel.id, "ticketdata");
                        if(data.state != "closed" && data.menutickettype == 1){
                          return interaction?.reply({content: `<:no:833101993668771842> **You already have an Ticket!** <#${ticketchannel.id}>`, ephemeral: true});
                        }
                      }
                    } catch {
                      client.setups.remove("TICKETS", user.id, ticketspath)
                    }
                }
              
                client.stats.ensure(guild.id, {
                    ticketamount: 0
                });
                client.stats.inc(guild.id, "ticketamount");
                let ticketamount = client.stats.get(guild.id, "ticketamount");
                
                if(!data.defaultname) data.defaultname = "🎫・{count}・{member}";

                let channelname = data.defaultname.replace("{member}", user.username).replace("{count}", ticketamount).replace(/\s/igu, "-").substr(0, 31);
                let optionsData = {
                topic: `📨 Ticket for: ${user.tag} (${user.id}) | ${values[0]} | ✅ Created at: ${moment().format("LLLL")}`,
                    type: "GUILD_TEXT",
                    reason: `Menu Ticket System for: ${user.tag}`,
                }
                guild.channels.create(channelname.substr(0, 31), optionsData).then(async ch => {
                await interaction?.reply({content: `<a:Loading:833101350623117342> **Creating your Ticket...** (Usually takes 0-2 Seconds)`, ephemeral: true});
                try {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(cat){
                        if(cat.type == "GUILD_CATEGORY"){
                        if(cat.children.size < 50){
                            await ch.setParent(String(cat.id)).catch(() => {});
                        }
                        }
                    } else {
                        if(ch.parent){
                        if(ch.parent.children.size < 50){
                            await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => {});
                        }
                        }
                    }
                } catch (e){
                    if(ch.parent){
                        if(ch.parent.children.size < 50){
                        await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => {});
                        }
                    }
                }
                
                if(!settings.data[index].category || settings.data[index].category.length < 5){
                    await ch.permissionOverwrites.create(guild.id, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                        EMBED_LINKS: false,
                        ADD_REACTIONS: false,
                        ATTACH_FILES: false
                    }).catch(() => {});
                } else {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(!cat) {
                        await ch.permissionOverwrites.create(guild.id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false,
                            EMBED_LINKS: false,
                            ADD_REACTIONS: false,
                            ATTACH_FILES: false
                        }).catch(() => {});
                    }
                }

                await ch.permissionOverwrites.create(user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    EMBED_LINKS: true,
                    ADD_REACTIONS: true,
                    ATTACH_FILES: true
                }).catch(() => {});
                

                await message.guild.members.fetch().catch(() => {});
                let realaccess = [];
                for(const a of settings.access) {
                    if(message.guild.roles.cache.has(a)) {
                        realaccess.push(a);
                    } else if(message.guild.members.cache.has(a)){
                        realaccess.push(a);
                    }
                }
                for(const a of realaccess) {
                    if(a == ch.guild.id) continue;
                    await ch.permissionOverwrites.create(a, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        EMBED_LINKS: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    }).catch(() => {});
                }
                if(settings.claim.enabled){
                    let ids = ch.permissionOverwrites.cache.filter(p => p.type == "role" && !p.deny.toArray().includes("SEND_MESSAGES")).map(d => d.id);
                    for(const id of ids){
                        if(id == ch.guild.id) continue;
                        await ch.permissionOverwrites.edit(id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: true,
                            EMBED_LINKS: true,
                            ADD_REACTIONS: true,
                            ATTACH_FILES: true
                        }).catch(console.warn);
                        await delay(client.ws.ping)
                    }
                }
                
                let es = client.settings.get(guild.id, "embed")
                client.setups.push("TICKETS", user.id, ticketspath);
                client.setups.push("TICKETS", ch.id, ticketspath);
                client.setups.set(user.id, ch.id, idpath);
                client.setups.set(ch.id, {
                    user: user.id,
                    channel: ch.id,
                    guild: guild.id,
                    menutickettype: 1,
                    type: tickettypepath,
                    state: "open",
                    date: Date.now(),
                }, "ticketdata");
            
                let extrastring = "";
                for(const a of realaccess){
                    if(message.guild.roles.cache.has(a)) {
                        extrastring += ` | <@&${a}>`
                    } else if(message.guild.members.cache.has(a)){
                        extrastring += ` | <@${a}>`
                    }
                }   
                
                var ticketembed = new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(`To close/manage this ticket react with the buttons\nYou can also type: ${client.settings.get(guild.id, "prefix")}ticket`, es.footericon))
                    .setAuthor(client.getAuthor(`Ticket for: ${user.tag}`, user.displayAvatarURL({
                    dynamic: true
                    }), "https://discord.gg/milrato"))
                    .setDescription(replyMsg.replace(/\{user\}/igu, `${user}`).substr(0, 2000))
                var ticketembeds = [ticketembed]
                if(settings.claim.enabled){
                    var claimEmbed = new MessageEmbed()
                    .setColor("ORANGE").setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setAuthor(client.getAuthor(`A Staff Member will claim the Ticket soon!`, "https://cdn.discordapp.com/emojis/833101350623117342.gif?size=44", "https://discord.gg/milrato"))
                    .setDescription(settings.claim.messageOpen.replace(/\{user\}/igu, `${user}`).substr(0, 2000))
                    ticketembeds.push(claimEmbed)
                }
                const {
                    MessageButton
                } = require('discord.js')
                let button_close = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_close').setLabel('Close').setEmoji("🔒")
                let button_delete = new MessageButton().setStyle('SECONDARY').setCustomId('ticket_delete').setLabel("Delete").setEmoji("🗑️")
                let button_transcript = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_transcript').setLabel("Transcript").setEmoji("📑")
                let button_user = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_user').setLabel("Users").setEmoji("👤")
                let button_role = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_role').setLabel("Roles").setEmoji("📌")
                const allbuttons = [new MessageActionRow().addComponents([button_close, button_delete, button_transcript, button_user, button_role])]
                if(settings.claim.enabled){
                    allbuttons.push(new MessageActionRow().addComponents([new MessageButton().setStyle('SECONDARY').setCustomId('ticket_claim').setLabel("Claim the Ticket").setEmoji("✅")]))
                }
                if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
                    if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.EMBED_LINKS)){
                        await ch.send({
                            content: `<@${user.id}>${extrastring}`,
                            embeds: ticketembeds,
                            components: allbuttons
                        }).catch((O) => {
                            console.log(String(O).grey)
                        }).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch((O) => {
                                    console.log(String(O).grey)
                                })
                            }
                        })
                    } else {
                        await ch.send({
                            content: `<@${user.id}>${extrastring}\n${ticketembeds[0].description}`.substr(0, 2000),
                            components: allbuttons
                        }).catch((O) => {
                            console.log(String(O).grey)
                        }).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch((O) => {
                                    console.log(String(O).grey)
                                })
                            }
                        })
                    }
                }
                await interaction?.editReply({content: `<a:yes:833101995723194437> **Your Ticket is created!** <#${ch.id}>`, ephemeral: true});
                })
            }
        }
    })

    //menu Ticket
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.menuticket2.ensure(message.guild.id, {
                messageId: "",
                channelId: "",
                claim: {
                  enabled: false,
                  messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                  messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
                },
                access: [],
                data: [
                  /*
                    {
                      value: "",
                      description: "",
                      category: null,
                      replyMsg: "{user} Welcome to the Support!",
                    }
                  */
                ]
              });
            let settings = client.menuticket2.get(guild.id);
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
               let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
                }
                let data = settings.data[index];
                let replyMsg = data.replyMsg;

                let systempath = `menuticketsystem${index > 0 ? index : ""}`; 
                let ticketspath = `menutickets${index > 0 ? index : ""}`; 
                let idpath = `menuticketid${index > 0 ? index : ""}`; 
                let tickettypepath = `menu-ticket-setup-${index > 0 ? index : ""}`; 
  
                client.setups.ensure(guild.id, {
                    enabled: false,
                    guildid: guild.id,
                    messageid: "",
                    channelid: "",
                    parentid: "",
                    message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
                    adminroles: []
                }, systempath);
                if (client.setups.get("TICKETS", ticketspath).includes(user.id)) {
                    try {
                      var ticketchannel = guild.channels.cache.get(client.setups.get(user.id, idpath))
                      if (!ticketchannel || ticketchannel == null || !ticketchannel.id || ticketchannel.id == null) throw {
                        message: "NO TICKET CHANNEL FOUND AKA NO ANTISPAM"
                      }
                      if(client.setups.has(ticketchannel.id) && client.setups.has(ticketchannel.id, "ticketdata"))
                      {
                        let data = client.setups.get(ticketchannel.id, "ticketdata");
                        if(data.state != "closed" && data.menutickettype == 2){
                          return interaction?.reply({content: `<:no:833101993668771842> **You already have an Ticket!** <#${ticketchannel.id}>`, ephemeral: true});
                        }
                      }
                    } catch {
                      client.setups.remove("TICKETS", user.id, ticketspath)
                    }
                }
              
                client.stats.ensure(guild.id, {
                    ticketamount: 0
                });
                client.stats.inc(guild.id, "ticketamount");
                let ticketamount = client.stats.get(guild.id, "ticketamount");
                
                if(!data.defaultname) data.defaultname = "🎫・{count}・{member}";

                let channelname = data.defaultname.replace("{member}", user.username).replace("{count}", ticketamount).replace(/\s/igu, "-").substr(0, 31);
                let optionsData = {
                topic: `📨 Ticket for: ${user.tag} (${user.id}) | ${values[0]} | ✅ Created at: ${moment().format("LLLL")}`,
                    type: "GUILD_TEXT",
                    reason: `Menu Ticket System for: ${user.tag}`,
                }
                guild.channels.create(channelname.substr(0, 31), optionsData).then(async ch => {
                await interaction?.reply({content: `<a:Loading:833101350623117342> **Creating your Ticket...** (Usually takes 0-2 Seconds)`, ephemeral: true});
                try {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(cat){
                        if(cat.type == "GUILD_CATEGORY"){
                        if(cat.children.size < 50){
                            await ch.setParent(String(cat.id)).catch(() => {});
                        }
                        }
                    } else {
                        if(ch.parent){
                        if(ch.parent.children.size < 50){
                            await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => {});
                        }
                        }
                    }
                } catch (e){
                    if(ch.parent){
                        if(ch.parent.children.size < 50){
                        await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => {});
                        }
                    }
                }
                
                if(!settings.data[index].category || settings.data[index].category.length < 5){
                    await ch.permissionOverwrites.create(guild.id, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                        EMBED_LINKS: false,
                        ADD_REACTIONS: false,
                        ATTACH_FILES: false
                    }).catch(() => {});
                } else {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(!cat) {
                        await ch.permissionOverwrites.create(guild.id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false,
                            EMBED_LINKS: false,
                            ADD_REACTIONS: false,
                            ATTACH_FILES: false
                        }).catch(() => {});
                    }
                }

                await ch.permissionOverwrites.create(user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    EMBED_LINKS: true,
                    ADD_REACTIONS: true,
                    ATTACH_FILES: true
                }).catch(() => {});

                

                await message.guild.members.fetch().catch(() => {});
                let realaccess = [];
                for(const a of settings.access) {
                    if(message.guild.roles.cache.has(a)) {
                        realaccess.push(a);
                    } else if(message.guild.members.cache.has(a)){
                        realaccess.push(a);
                    }
                }
                for(const a of realaccess) {
                    if(a == ch.guild.id) continue;
                    await ch.permissionOverwrites.create(a, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        EMBED_LINKS: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    }).catch(() => {});
                }
                if(settings.claim.enabled){
                    let ids = ch.permissionOverwrites.cache.filter(p => p.type == "role" && !p.deny.toArray().includes("SEND_MESSAGES")).map(d => d.id);
                    for(const id of ids){
                        if(id == ch.guild.id) continue;
                        await ch.permissionOverwrites.edit(id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: true,
                            EMBED_LINKS: true,
                            ADD_REACTIONS: true,
                            ATTACH_FILES: true
                        }).catch(console.warn);
                        await delay(client.ws.ping)
                    }
                }
                
                let es = client.settings.get(guild.id, "embed")
                client.setups.push("TICKETS", user.id, ticketspath);
                client.setups.push("TICKETS", ch.id, ticketspath);
                client.setups.set(user.id, ch.id, idpath);
                client.setups.set(ch.id, {
                    user: user.id,
                    channel: ch.id,
                    guild: guild.id,
                    menutickettype: 2,
                    type: tickettypepath,
                    state: "open",
                    date: Date.now(),
                }, "ticketdata");
            
                let extrastring = "";
                for(const a of realaccess){
                    if(message.guild.roles.cache.has(a)) {
                        extrastring += ` | <@&${a}>`
                    } else if(message.guild.members.cache.has(a)){
                        extrastring += ` | <@${a}>`
                    }
                }
                
                var ticketembed = new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(`To close/manage this ticket react with the buttons\nYou can also type: ${client.settings.get(guild.id, "prefix")}ticket`, es.footericon))
                    .setAuthor(client.getAuthor(`Ticket for: ${user.tag}`, user.displayAvatarURL({
                    dynamic: true
                    }), "https://discord.gg/milrato"))
                    .setDescription(replyMsg.replace(/\{user\}/igu, `${user}`).substr(0, 2000))
                var ticketembeds = [ticketembed]
                if(settings.claim.enabled){
                    var claimEmbed = new MessageEmbed()
                    .setColor("ORANGE").setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setAuthor(client.getAuthor(`A Staff Member will claim the Ticket soon!`, "https://cdn.discordapp.com/emojis/833101350623117342.gif?size=44", "https://discord.gg/milrato"))
                    .setDescription(settings.claim.messageOpen.replace(/\{user\}/igu, `${user}`).substr(0, 2000))
                    ticketembeds.push(claimEmbed)
                }
                const {
                    MessageButton
                } = require('discord.js')
                let button_close = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_close').setLabel('Close').setEmoji("🔒")
                let button_delete = new MessageButton().setStyle('SECONDARY').setCustomId('ticket_delete').setLabel("Delete").setEmoji("🗑️")
                let button_transcript = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_transcript').setLabel("Transcript").setEmoji("📑")
                let button_user = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_user').setLabel("Users").setEmoji("👤")
                let button_role = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_role').setLabel("Roles").setEmoji("📌")
                const allbuttons = [new MessageActionRow().addComponents([button_close, button_delete, button_transcript, button_user, button_role])]
                if(settings.claim.enabled){
                    allbuttons.push(new MessageActionRow().addComponents([new MessageButton().setStyle('SECONDARY').setCustomId('ticket_claim').setLabel("Claim the Ticket").setEmoji("✅")]))
                }
                if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
                    if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.EMBED_LINKS)){
                        await ch.send({
                            content: `<@${user.id}>${extrastring}`,
                            embeds: ticketembeds,
                            components: allbuttons
                        }).catch((O) => {
                            console.log(String(O).grey)
                        }).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch((O) => {
                                    console.log(String(O).grey)
                                })
                            }
                        })
                    } else {
                        await ch.send({
                            content: `<@${user.id}>${extrastring}\n${ticketembeds[0].description}`.substr(0, 2000),
                            components: allbuttons
                        }).catch((O) => {
                            console.log(String(O).grey)
                        }).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch((O) => {
                                    console.log(String(O).grey)
                                })
                            }
                        })
                    }
                }
                await interaction?.editReply({content: `<a:yes:833101995723194437> **Your Ticket is created!** <#${ch.id}>`, ephemeral: true});
                })
            }
        }
    })

    //menu Ticket
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.menuticket3.ensure(message.guild.id, {
                messageId: "",
                channelId: "",
                claim: {
                  enabled: false,
                  messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                  messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
                },
                access: [],
                data: [
                  /*
                    {
                      value: "",
                      description: "",
                      category: null,
                      replyMsg: "{user} Welcome to the Support!",
                    }
                  */
                ]
              });
            let settings = client.menuticket3.get(guild.id);
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
               let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
                }
                let data = settings.data[index];
                let replyMsg = data.replyMsg;

                let systempath = `menuticketsystem${index > 0 ? index : ""}`; 
                let ticketspath = `menutickets${index > 0 ? index : ""}`; 
                let idpath = `menuticketid${index > 0 ? index : ""}`; 
                let tickettypepath = `menu-ticket-setup-${index > 0 ? index : ""}`; 
  
                client.setups.ensure(guild.id, {
                    enabled: false,
                    guildid: guild.id,
                    messageid: "",
                    channelid: "",
                    parentid: "",
                    message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
                    adminroles: []
                }, systempath);
                if (client.setups.get("TICKETS", ticketspath).includes(user.id)) {
                    try {
                      var ticketchannel = guild.channels.cache.get(client.setups.get(user.id, idpath))
                      if (!ticketchannel || ticketchannel == null || !ticketchannel.id || ticketchannel.id == null) throw {
                        message: "NO TICKET CHANNEL FOUND AKA NO ANTISPAM"
                      }
                      if(client.setups.has(ticketchannel.id) && client.setups.has(ticketchannel.id, "ticketdata"))
                      {
                        let data = client.setups.get(ticketchannel.id, "ticketdata");
                        if(data.state != "closed" && data.menutickettype == 3){
                          return interaction?.reply({content: `<:no:833101993668771842> **You already have an Ticket!** <#${ticketchannel.id}>`, ephemeral: true});
                        }
                      }
                    } catch {
                      client.setups.remove("TICKETS", user.id, ticketspath)
                    }
                }
              
                client.stats.ensure(guild.id, {
                    ticketamount: 0
                });
                client.stats.inc(guild.id, "ticketamount");
                let ticketamount = client.stats.get(guild.id, "ticketamount");
                
                if(!data.defaultname) data.defaultname = "🎫・{count}・{member}";

                let channelname = data.defaultname.replace("{member}", user.username).replace("{count}", ticketamount).replace(/\s/igu, "-").substr(0, 31);
                let optionsData = {
                topic: `📨 Ticket for: ${user.tag} (${user.id}) | ${values[0]} | ✅ Created at: ${moment().format("LLLL")}`,
                    type: "GUILD_TEXT",
                    reason: `Menu Ticket System for: ${user.tag}`,
                }
                guild.channels.create(channelname.substr(0, 31), optionsData).then(async ch => {
                await interaction?.reply({content: `<a:Loading:833101350623117342> **Creating your Ticket...** (Usually takes 0-2 Seconds)`, ephemeral: true});
                try {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(cat){
                        if(cat.type == "GUILD_CATEGORY"){
                        if(cat.children.size < 50){
                            await ch.setParent(String(cat.id)).catch(() => {});
                        }
                        }
                    } else {
                        if(ch.parent){
                        if(ch.parent.children.size < 50){
                            await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => {});
                        }
                        }
                    }
                } catch (e){
                    if(ch.parent){
                        if(ch.parent.children.size < 50){
                        await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => {});
                        }
                    }
                }
                
                if(!settings.data[index].category || settings.data[index].category.length < 5){
                    await ch.permissionOverwrites.create(guild.id, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                        EMBED_LINKS: false,
                        ADD_REACTIONS: false,
                        ATTACH_FILES: false
                    }).catch(() => {});
                } else {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(!cat) {
                        await ch.permissionOverwrites.create(guild.id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false,
                            EMBED_LINKS: false,
                            ADD_REACTIONS: false,
                            ATTACH_FILES: false
                        }).catch(() => {});
                    }
                }

                await ch.permissionOverwrites.create(user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    EMBED_LINKS: true,
                    ADD_REACTIONS: true,
                    ATTACH_FILES: true
                }).catch(() => {});
               

                await message.guild.members.fetch().catch(() => {});
                let realaccess = [];
                for(const a of settings.access) {
                    if(message.guild.roles.cache.has(a)) {
                        realaccess.push(a);
                    } else if(message.guild.members.cache.has(a)){
                        realaccess.push(a);
                    }
                }
                for(const a of realaccess) {
                    if(a == ch.guild.id) continue;
                    await ch.permissionOverwrites.create(a, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        EMBED_LINKS: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    }).catch(() => {});
                }
                if(settings.claim.enabled){
                    let ids = ch.permissionOverwrites.cache.filter(p => p.type == "role" && !p.deny.toArray().includes("SEND_MESSAGES")).map(d => d.id);
                    for(const id of ids){
                        if(id == ch.guild.id) continue;
                        await ch.permissionOverwrites.edit(id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: true,
                            EMBED_LINKS: true,
                            ADD_REACTIONS: true,
                            ATTACH_FILES: true
                        }).catch(console.warn);
                        await delay(client.ws.ping)
                    }
                }
                let es = client.settings.get(guild.id, "embed")
                client.setups.push("TICKETS", user.id, ticketspath);
                client.setups.push("TICKETS", ch.id, ticketspath);
                client.setups.set(user.id, ch.id, idpath);
                client.setups.set(ch.id, {
                    user: user.id,
                    channel: ch.id,
                    guild: guild.id,
                    menutickettype: 3,
                    type: tickettypepath,
                    state: "open",
                    date: Date.now(),
                }, "ticketdata");
            
                let extrastring = "";
                for(const a of realaccess){
                    if(message.guild.roles.cache.has(a)) {
                        extrastring += ` | <@&${a}>`
                    } else if(message.guild.members.cache.has(a)){
                        extrastring += ` | <@${a}>`
                    }
                }
                
                var ticketembed = new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(`To close/manage this ticket react with the buttons\nYou can also type: ${client.settings.get(guild.id, "prefix")}ticket`, es.footericon))
                    .setAuthor(client.getAuthor(`Ticket for: ${user.tag}`, user.displayAvatarURL({
                    dynamic: true
                    }), "https://discord.gg/milrato"))
                    .setDescription(replyMsg.replace(/\{user\}/igu, `${user}`).substr(0, 2000))
                var ticketembeds = [ticketembed]
                if(settings.claim.enabled){
                    var claimEmbed = new MessageEmbed()
                    .setColor("ORANGE").setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setAuthor(client.getAuthor(`A Staff Member will claim the Ticket soon!`, "https://cdn.discordapp.com/emojis/833101350623117342.gif?size=44", "https://discord.gg/milrato"))
                    .setDescription(settings.claim.messageOpen.replace(/\{user\}/igu, `${user}`).substr(0, 2000))
                    ticketembeds.push(claimEmbed)
                }
                const {
                    MessageButton
                } = require('discord.js')
                let button_close = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_close').setLabel('Close').setEmoji("🔒")
                let button_delete = new MessageButton().setStyle('SECONDARY').setCustomId('ticket_delete').setLabel("Delete").setEmoji("🗑️")
                let button_transcript = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_transcript').setLabel("Transcript").setEmoji("📑")
                let button_user = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_user').setLabel("Users").setEmoji("👤")
                let button_role = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_role').setLabel("Roles").setEmoji("📌")
                const allbuttons = [new MessageActionRow().addComponents([button_close, button_delete, button_transcript, button_user, button_role])]
                if(settings.claim.enabled){
                    allbuttons.push(new MessageActionRow().addComponents([new MessageButton().setStyle('SECONDARY').setCustomId('ticket_claim').setLabel("Claim the Ticket").setEmoji("✅")]))
                }
                if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
                    if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.EMBED_LINKS)){
                        await ch.send({
                            content: `<@${user.id}>${extrastring}`,
                            embeds: ticketembeds,
                            components: allbuttons
                        }).catch((O) => {
                            console.log(String(O).grey)
                        }).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch((O) => {
                                    console.log(String(O).grey)
                                })
                            }
                        })
                    } else {
                        await ch.send({
                            content: `<@${user.id}>${extrastring}\n${ticketembeds[0].description}`.substr(0, 2000),
                            components: allbuttons
                        }).catch((O) => {
                            console.log(String(O).grey)
                        }).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch((O) => {
                                    console.log(String(O).grey)
                                })
                            }
                        })
                    }
                }
                await interaction?.editReply({content: `<a:yes:833101995723194437> **Your Ticket is created!** <#${ch.id}>`, ephemeral: true});
                })
            }
        }
    })
    
    
    //auto support System
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.autosupport1.ensure(guild.id, {
                messageId: "",
                channelId: "",
                data: [ //all menus in there
                    /*
                        {
                            value: "",
                            description: "",
                            sendEmbed: true,
                            replyMsg: "Welcome to the Support!"
                        }
                    */
                ],
            });
            let settings = client.autosupport1.get(guild.id);
            let es = client.settings.get(guild.id, "embed")
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
                let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Auto-Support-Data-Settings for this Option**"});
                }
                let data = settings.data[index];
                let {sendEmbed, replyMsg} = data;
                if(sendEmbed){
                    interaction?.reply({ephemeral: true, embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                        .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setDescription(String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substr(0, 2000))
                    ]});
                }else {
                    interaction?.reply({ephemeral: true, content: String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substr(0, 2000)});
                }
            }
        }
    })
    //auto support System
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.autosupport2.ensure(guild.id, {
                messageId: "",
                channelId: "",
                data: [ //all menus in there
                    /*
                        {
                            value: "",
                            description: "",
                            sendEmbed: true,
                            replyMsg: "Welcome to the Support!"
                        }
                    */
                ],
            });
            let settings = client.autosupport2.get(guild.id);
            let es = client.settings.get(guild.id, "embed")
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
                let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Auto-Support-Data-Settings for this Option**"});
                }
                let data = settings.data[index];
                let {sendEmbed, replyMsg} = data;
                if(sendEmbed){
                    interaction?.reply({ephemeral: true, embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                        .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setDescription(String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substr(0, 2000))
                    ]});
                }else {
                    interaction?.reply({ephemeral: true, content: String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substr(0, 2000)});
                }
            }
        }
    })
    //auto support System
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.autosupport3.ensure(guild.id, {
                messageId: "",
                channelId: "",
                data: [ //all menus in there
                    /*
                        {
                            value: "",
                            description: "",
                            sendEmbed: true,
                            replyMsg: "Welcome to the Support!"
                        }
                    */
                ],
            });
            let settings = client.autosupport3.get(guild.id);
            let es = client.settings.get(guild.id, "embed")
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
                let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Auto-Support-Data-Settings for this Option**"});
                }
                let data = settings.data[index];
                let {sendEmbed, replyMsg} = data;
                if(sendEmbed){
                    interaction?.reply({ephemeral: true, embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                        .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setDescription(String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substr(0, 2000))
                    ]});
                }else {
                    interaction?.reply({ephemeral: true, content: String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substr(0, 2000)});
                }
            }
        }
    })

    
    //menu apply
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.menuapply1.ensure(guild.id, {
                messageId: "",
                channelId: "",
                data: [ //all menus in there
                    /*
                        {
                            value: "",
                            description: "",
                            applySystemExecution: "",
                        }
                    */
                ],
            });
            let es = client.settings.get(guild.id, "embed")
            let ls = client.settings.get(guild.id, "language")
            let settings = client.menuapply1.get(guild.id);
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
                let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
                }
                let data = settings.data[index];
                if(!data) return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Data for this System**"});
                var { applySystemExecution } = data;
                require(`../handlers${applySystemExecution > 5 ? "/applies" : ""}/apply${applySystemExecution == 1 ? "" : applySystemExecution}`).ApplySystem({ guild: guild, channel: message.channel, user: user, message: message, interaction: interaction, es: es, ls: ls })
            }
        }
    })
    //menu apply
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.menuapply2.ensure(guild.id, {
                messageId: "",
                channelId: "",
                data: [ //all menus in there
                    /*
                        {
                            value: "",
                            description: "",
                            applySystemExecution: "",
                        }
                    */
                ],
            });
            let es = client.settings.get(guild.id, "embed")
            let ls = client.settings.get(guild.id, "language")
            let settings = client.menuapply2.get(guild.id);
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
                let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
                }
                let data = settings.data[index];
                if(!data) return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Data for this System**"});
                var { applySystemExecution } = data;
                require(`../handlers${applySystemExecution > 5 ? "/applies" : ""}/apply${applySystemExecution == 1 ? "" : applySystemExecution}`).ApplySystem({ guild: guild, channel: message.channel, user: user, message: message, interaction: interaction, es: es, ls: ls })
            }
        }
    })
    //menu apply
    client.on("interactionCreate", interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            client.menuapply3.ensure(guild.id, {
                messageId: "",
                channelId: "",
                data: [ //all menus in there
                    /*
                        {
                            value: "",
                            description: "",
                            applySystemExecution: "",
                        }
                    */
                ],
            });
            let es = client.settings.get(guild.id, "embed")
            let ls = client.settings.get(guild.id, "language")
            let settings = client.menuapply3.get(guild.id);
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
                let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
                }
                let data = settings.data[index];
                if(!data) return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Data for this System**"});
                var { applySystemExecution } = data;
                require(`../handlers${applySystemExecution > 5 ? "/applies" : ""}/apply${applySystemExecution == 1 ? "" : applySystemExecution}`).ApplySystem({ guild: guild, channel: message.channel, user: user, message: message, interaction: interaction, es: es, ls: ls })
            }
        }
    })
}