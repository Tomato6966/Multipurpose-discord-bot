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
    dbEnsure,
    dbRemove,
    dbKeys,
    delay,
    create_transcript,
    GetUser,
    GetRole,
    create_transcript_buffer
} = require(`./functions`);

module.exports = async (client) => {
    
    
    //Event
    client.on("interactionCreate", async (interaction) => {
        if (!interaction?.isButton()) return 
        //console.log(`${moment().format("HH:mm:ss.SSSS")} 0 check`)
        var {
            guild,
            channel,
            user,
            message
        } = interaction;
        if (!guild || !channel || !message || !user) return 
        if(!client.guilds.cache.get(interaction.guild.id)) return;
        if (!interaction?.customId.includes("ticket_")) return
        if (interaction?.customId.includes("create_a_ticket")) return

        const temptype = interaction?.customId.replace("ticket_", "")
        const buttonuser = user;

        //console.log(`${moment().format("HH:mm:ss.SSSS")} 1 check`)       

        const member = interaction.member || guild.members.cache.get(user.id) || await guild.members.fetch(user.id).catch(() => null);
        
        //console.log(`${moment().format("HH:mm:ss.SSSS")} 2 check`)
        const guild_settings = await client.settings.get(guild.id);
        //console.log(`${moment().format("HH:mm:ss.SSSS")} 3 check`)
        const ls = guild_settings.language || "en";
        const es = guild_settings.embed || ee;

        if (!member) return interaction?.reply({
            ephemeral: true,
            content: eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable2"])})

        const prefix = guild_settings.prefix || config.prefix
        const adminroles = guild_settings.adminroles || [];
        const cmdroles = guild_settings.cmdadminroles?.ticket || [];
        const cmdroles2 = guild_settings.cmdadminroles?.close || [];
        try {
            for (const r of cmdroles2) cmdrole.push(r)
        } catch {}

        const Ticketdata = await client.setups.get(`${channel.id}.ticketdata`);

        //console.log(`${moment().format("HH:mm:ss.SSSS")} 4 check`)
        if(!Ticketdata){
            if(interaction.customId != "ticket_verify"){
                interaction?.reply({content: ":x: This channel is not a Ticket", ephemeral: true})
            }
            return 
        }
        let ticketSystemNumber = String(Ticketdata.type).split("-");
        ticketSystemNumber = ticketSystemNumber[ticketSystemNumber.length - 1];
        const ticket = await client.setups.get(`${guild.id}.${String(Ticketdata.type).includes("menu") ? "menu": ""}ticketsystem${ticketSystemNumber}`)
        
        //console.log(`${moment().format("HH:mm:ss.SSSS")} 5 check`)
        let theadminroles = ticket?.adminroles;
        let closedParent = ticket?.closedParent;
        
        if(String(Ticketdata.type).includes("menu") && Ticketdata.menutickettype && Ticketdata.menutickettype > 0) {
            const settings = await client.menuticket.get(`${guild.id}.menuticket${Ticketdata.menutickettype}`);
            let adminRoles = settings.access;
            if(Ticketdata.menuticketIndex !== undefined) {
                if(settings.data) {
                    const data = settings.data[Ticketdata.menuticketIndex];
                    if(data.access) {
                        adminRoles = [...adminRoles, ...data.access];
                    }
                }
            }
            closedParent = settings.closedParent
            theadminroles = adminRoles;
        }

        //console.log(`${moment().format("HH:mm:ss.SSSS")} 6 check`)
        
        const cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    try {
                        dbRemove(client.settings, `${guild.id}.cmdadminroles.ticket`, r)
                    } catch {}
                    try {
                        dbRemove(client.settings, `${guild.id}.cmdadminroles.ticket`, r)
                    } catch {}
                }
            }
        }

        let edited = false;
        //console.log(`${moment().format("HH:mm:ss.SSSS")} 7 check`)

        if (temptype == "close") {
            interaction.deferUpdate().catch(() => null);
            let data = Ticketdata
            if (data.state === "closed") {
                return interaction.reply({
                    ephemeral: true,
                    content: `<@${buttonuser.id}>`,
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable5"]))
                        .setColor(es.wrongcolor)
                    ]
                })
            }
            let button_ticket_verifyRow = new MessageActionRow().addComponents([
                new MessageButton().setStyle('SUCCESS').setCustomId('ticket_verify').setLabel("Verify to Close").setEmoji("865962151649869834"),
                new MessageButton().setStyle('SECONDARY').setCustomId('ticket_cancel').setLabel("Cancel").setEmoji("866085733499797504"),
            ])
            const oldComponents = message.components;
            const oldEmbeds = message.embeds;
            let msg = await message.edit({
                embeds: [...oldEmbeds, new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable6"]))
                    .setColor(es.color)
                ],
                components: [...oldComponents, button_ticket_verifyRow]
            }).catch((e) => {console.error(e);msg = null});

            if(!msg) {
                msg = await channel.send({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable6"]))
                        .setColor(es.color)
                    ],
                    components: [...oldComponents, button_ticket_verifyRow]
                }).catch(console.warn)
            }

            const collector = msg.createMessageComponentCollector(bb => !bb?.user.bot && (bb.customId == "ticket_verify" || bb.customId == "ticket_cancel"), {
                time: 45_000
            }); 

            //console.log(`${moment().format("HH:mm:ss.SSSS")} 9 check`)
            collector.on('collect', async b => {
                let now = Date.now();
                if (b?.user.id !== user.id)
                    return b?.reply(`<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, true)

                
                //page forward
                if (b?.customId == "ticket_verify") {
                    edited = true;
                    await b.update({
                        embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                        components: msg.id == message.id ? oldComponents : []
                    }).catch(() => {
                        msg.edit({
                            embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                            components: msg.id == message.id ? oldComponents : []
                        }).catch(() => null);
                    })

                    let index = String(data.type).slice(-1);
                    if (data.type?.includes("apply")) {
                        dbRemove(client.setups, "TICKETS"+`.applytickets${index}`, data.user);
                        dbRemove(client.setups, "TICKETS"+`.applytickets${index}`, data.channel);
                    } else if (data.type?.includes("menu")) {
                        dbRemove(client.setups, "TICKETS"+`.menutickets${index}`, data.user);
                        dbRemove(client.setups, "TICKETS"+`.menutickets${index}`, data.channel);
                    }  else {
                        dbRemove(client.setups, "TICKETS"+`.tickets${index}`, data.user);
                        dbRemove(client.setups,"TICKETS"+`.tickets${index}`, data.channel);
                    }

                    await client.setups.set(msg.channel.id+".ticketdata.state", "closed");
                    data.state = "closed"

                    if(closedParent) {
                        let ticketCh = msg.guild.channels.cache.get(closedParent);
                        if(ticketCh && ticketCh.type == "GUILD_CATEGORY") {
                            if(ticketCh.children.size < 50) {
                                await msg.channel.setParent(ticketCh.id, { lockPermissions: false }).catch(async(e) => {
                                    await msg.channel.send(`Can't move to: ${ticketCh.name} (\`${ticketCh.id}\`) because an Error occurred:\n> \`\`\`${String(e.message ? e.message : e).substring(0, 100)}\`\`\``).catch(() => null);
                                })
                            } else {
                                await msg.channel.send(`Ticket Category ${ticketCh.name} (\`${ticketCh.id}\`) is full, can't move!`).catch(() => null);
                            }
                        } else {
                            await msg.channel.send(`Could not find ${closedParent} as a parent`).catch(() => null);
                        }
                    }

                    if(msg.channel.permissionsFor(msg.channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS) && data?.user){
                        await msg.channel.permissionOverwrites.edit(data.user, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false,
                        }).catch(() => {});
                    }
                    msg.channel.send({
                        content: `<@${buttonuser.id}>`,
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable7"]))
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setDescription(`Closed the Ticket of <@${data.user}> and removed him from the Channel!`.substring(0, 2000))
                            .addField("User: ", `<@${data.user}>`)
                            .addField(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variablex_8"]), eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable8"]))
                            .addField("State: ", `${data.state}`)
                            .setFooter(client.getFooter(es))
                        ]
                    })
                    try { msg.channel.setName(String(msg.channel.name).replace("ticket", "closed").substring(0, 32)).catch(() => null) } catch (e) { console.error(e) }
                   
                    let adminlog = await client.settings.get(`${guild.id}.adminlog`);
                    if (adminlog != "no") {
                        let message = msg; //NEEDED FOR THE EVALUATION!
                        try {
                            var adminchannel = guild.channels.cache.get(adminlog)
                            if (!adminchannel) return client.settings.set(`${guild.id}.adminlog`, "no");
                            adminchannel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                    .setAuthor(client.getAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                        dynamic: true
                                    })))
                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable9"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                    .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                ]
                            })
                        } catch (e) {
                            console.error(e)
                        }
                    }
                } else {
                    edited = true;
                    b.update({
                        embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                        components: msg.id == message.id ? oldComponents : []
                    }).catch(() => {
                        msg.edit({
                            embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                            components: msg.id == message.id ? oldComponents : []
                        }).catch(() => null);
                    })
                }
            });
            collector.on('end', collected => {
                if (!edited) {
                    edited = true;
                    msg.edit({
                        embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                        components: msg.id == message.id ? oldComponents : []
                    }).catch(() => null);
                }
            });
        } else if (temptype == "delete") {
            interaction.deferUpdate().catch(() => null);

            //console.log(`${moment().format("HH:mm:ss.SSSS")} 8 check`)
            let ticketspecific = [];
            if(!theadminroles) theadminroles = []
            if(theadminroles.length == 0) {
                ticketspecific = ["No Ticket Specific Roles/Users specified"];
            } else {
                for (const a of theadminroles) {
                    if(message.guild.roles.cache.has(a)) {
                        ticketspecific.push(`<@&${a}>`);
                    } else if(message.guild.members.cache.has(a)){
                        ticketspecific.push(`<@${a}>`);
                    }
                }
            }
            if (([...member.roles.cache.values()] && !member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(interaction?.user.id) && ([...member.roles.cache.values()] && !member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) && !member.permissions.has("ADMINISTRATOR") && !member.roles.cache.some(r => theadminroles.includes(r ? r.id : r))&& !theadminroles.includes(member.id)) {
                return interaction.reply({
                    content: `<@${buttonuser.id}>`,
                    ephemeral: true,
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle("<:no:833101993668771842> You are not allowed to delete this Ticket")
                        .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join(" | ") + theadminroles.join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\` You can also add Ticket only Roles with \`${prefix}setup-ticket\``}`)
                        .addField("Ticket Specific Role(s)/User(s):", `${ticketspecific.join(", ")}`.substring(0, 1024))
                    ]
                });
            }
            //console.log(`${moment().format("HH:mm:ss.SSSS")} 9 check`)

            let button_ticket_verifyRow = new MessageActionRow().addComponents([
                new MessageButton().setStyle('SUCCESS').setCustomId('ticket_verify').setLabel("Verify to Delete").setEmoji("865962151649869834"),
                new MessageButton().setStyle('SECONDARY').setCustomId('ticket_cancel').setLabel("Cancel").setEmoji("866085733499797504"),
            ])
            const oldComponents = message.components;
            const oldEmbeds = message.embeds;

            //console.log(`${moment().format("HH:mm:ss.SSSS")} 10 check`)

            let = msg = await message.edit({
                embeds: [...oldEmbeds, new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable6"]))
                    .setColor(es.color)
                ],
                components: [...oldComponents, button_ticket_verifyRow]
            }).catch((e) => {console.error(e);msg = null});
        
            //console.log(`${moment().format("HH:mm:ss.SSSS")} 11 check`)

            if(!msg) {
                msg = await channel.send({
                    content: `<@${buttonuser.id}>`,
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable6"]))
                        .setColor(es.color)
                    ],
                    components: [...oldComponents, button_ticket_verifyRow]
                }).catch(console.warn)
            }

            const collector = msg.createMessageComponentCollector(bb => !bb?.user.bot && (bb.customId == "ticket_verify" || bb.customId == "ticket_cancel"), {
                time: 45_000
            }); 



            collector.on('collect', async b => {
                if (b?.user.id !== user.id)
                    return b?.reply(`<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, true)

                //page forward
                if (b?.customId == "ticket_verify") {
                    edited = true;
                    b.update({
                        embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                        components: msg.id == message.id ? oldComponents : []
                    }).catch((e) => {
                        msg.edit({
                            embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                            components: msg.id == message.id ? oldComponents : []
                        }).catch(() => null);
                    })
                    
                    let data = Ticketdata
                    
                    let index = String(data.type).slice(-1);
                    if (data?.type?.includes("apply")) {
                        await dbRemove(client.setups, "TICKETS"+`.applytickets${index != "-" ? index : ""}`, data.user);
                        await dbRemove(client.setups, "TICKETS"+`.applytickets${index != "-" ? index : ""}`, data.channel);
                    } else if (data?.type?.includes("menu")) {
                        await dbRemove(client.setups, "TICKETS"+`.menutickets${index != "-" ? index : ""}`, data.user);
                        await dbRemove(client.setups, "TICKETS"+`.menutickets${index != "-" ? index : ""}`, data.channel);
                    } else {
                        await dbRemove(client.setups, "TICKETS"+`.tickets${index != "-" ? index : ""}`, data.user);
                        await dbRemove(client.setups, "TICKETS"+`.tickets${index != "-" ? index : ""}`, data.channel);
                    }
                    try {
                        client.setups.delete(msg.channel.id);
                    } catch (e) {
                        console.error(e);
                    }
                    if(ticket?.ticketlogid && ticket?.ticketlogid.length > 5){
                        try {
                            let logChannel = guild.channels.cache.get(ticket?.ticketlogid);
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
                                        }).catch(()=>null)
                                        await logChannel.send({
                                            files: [attachment]
                                        }).catch(()=>null)
                                        //await tmmpmsg.delete().catch(()=>null)
                                        try { fs.unlinkSync(path) } catch { }
                                    } catch (error) { //if the file is to big to be sent, then catch it!
                                        console.error(error)
                                    }
                                }).catch(e => {
                                    console.error(e)
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
                    }).catch(() => null)
                    setTimeout(() => {
                        msg.channel.delete().catch(() => null);
                    }, 3500)

                    let adminlog = await client.settings.get(`${guild.id}.adminlog`);
                    if (adminlog != "no") {
                        let message = msg; //NEEDED FOR THE EVALUATION!
                        try {
                            var adminchannel = guild.channels.cache.get(adminlog)
                            if (!adminchannel) return client.settings.set(`${guild.id}.adminlog`, "no");
                            adminchannel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                    .setAuthor(client.getAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                        dynamic: true
                                    })))
                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable15"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                    .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                ]
                            })
                        } catch (e) {
                            console.error(e)
                        }
                    }
                } else {
                    edited = true;
                    b.update({
                        embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                        components: msg.id == message.id ? oldComponents : []
                    }).catch(() => {
                        msg.edit({
                            embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                            components: msg.id == message.id ? oldComponents : []
                        }).catch(() => null);
                    })
                  }
            });
            collector.on('end', collected => {
                if (!edited) {
                    edited = true;
                    msg.edit({
                        embeds: msg.id == message.id ? oldEmbeds : msg.embeds,
                        components: msg.id == message.id ? oldComponents : []
                    }).catch(() => null);
                }
            });
        } else if (temptype == "log" || temptype == "transcript") {
            msglimit = 1000;
            let data = Ticketdata
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
                }).catch(() => null) //Fetch again, 100 messages above the already fetched messages
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
                    //await tmmpmsg.delete().catch(()=>null)
                    try { fs.unlinkSync(path) } catch { }
                    let adminlog = await client.settings.get(`${guild.id}.adminlog`);
                    if (adminlog != "no") {
                        try {
                            var adminchannel = guild.channels.cache.get(adminlog)
                            if (!adminchannel) return client.settings.set(`${guild.id}.adminlog`, "no");
                            adminchannel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                    .setAuthor(client.getAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                        dynamic: true
                                    })))
                                    .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable22"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                    .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                    .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                ]
                            })
                        } catch (e) {
                            console.error(e)
                        }
                    }
                } catch (error) { //if the file is to big to be sent, then catch it!
                    console.error(error)
                    channel.send({
                        content: `<@${buttonuser.id}>`,
                        embeds: [new MessageEmbed().setAuthor("ERROR! Transcript is to big, to be sent into the Channel!", user.displayAvatarURL({
                            dynamic: true
                        })).setFooter({text: `${eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable25"])}`})]
                    })
                }
            }).catch(e => {
                console.error(e)
            })
        } else if (temptype == "user") {
            if (([...member.roles.cache.values()] && ![...member.roles.cache.values()].some(r => cmdroles?.includes(r.id))) && !cmdroles?.includes(interaction?.user.id) && ([...member.roles.cache.values()] && ![...member.roles.cache.values()].some(r => adminroles.includes(r ? r.id : r))) && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) && !member.permissions.has("ADMINISTRATOR") && ![...member.roles.cache.values()].some(r => theadminroles?.includes(r ? r.id : r))) {
                return interaction.reply({
                    ephemeral: true,
                    content: `<@${buttonuser.id}>`,
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle("<:no:833101993668771842> You are not allowed to add/remove Users to/from this Ticket")
                        .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join(" | ") + theadminroles.join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\` You can also add Ticket only Roles with \`${prefix}setup-ticket\``}`)
                    ]
                });
            }
            interaction.deferUpdate().catch(() => null);
            channel.send({
                content: `<@${buttonuser.id}>`,
                embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable32"]))
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setDescription(`Either with <@USERID> or with the USERNAME, or with the USERID`.substring(0, 2000))
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
                                        }).then(async channel => {
                                            channel.send({
                                                content: `<@${buttonuser.id}>`,
                                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable35"]))
                                                ]
                                            })
                                            let adminlog = await client.settings.get(`${guild.id}.adminlog`);
                                            if (adminlog != "no") {
                                                try {
                                                    var adminchannel = guild.channels.cache.get(adminlog)
                                                    if (!adminchannel) return client.settings.set(`${guild.id}.adminlog`, "no");
                                                    adminchannel.send({
                                                        embeds: [new MessageEmbed()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                                            .setAuthor(client.getAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                                dynamic: true
                                                            })))
                                                            .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable36"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                                            .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                                        ]
                                                    })
                                                } catch (e) {
                                                    console.error(e)
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
                                        }).then(async channel => {
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
                        }).then(async channel => {
                            channel.send({
                                content: `<@${buttonuser.id}>`,
                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                    .setFooter(client.getFooter(es))
                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable44"]))
                                ]
                            })
                            let adminlog = await client.settings.get(`${guild.id}.adminlog`);
                            if (adminlog != "no") {
                                try {
                                    var adminchannel = guild.channels.cache.get(adminlog)
                                    if (!adminchannel) return client.settings.set(`${guild.id}.adminlog`, "no");
                                    adminchannel.send({
                                        embeds: [new MessageEmbed()
                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                            .setAuthor(client.getAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                dynamic: true
                                            })))
                                            .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable45"]))
                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                            .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                        ]
                                    })
                                } catch (e) {
                                    console.error(e)
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
                            console.error(e)
                            return channel.send({
                                content: `<@${buttonuser.id}>`,
                                embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable50"]))
                                    .setColor(es.wrongcolor)
                                    .setDescription(`"Cancelled"`.substring(0, 2000))
                                    .setFooter(client.getFooter(es))
                                ]
                            });
                        })
                    }
                }).catch(e => {
                    console.error(e)
                })
            })
        } else if (temptype == "role") {
            if (([...member.roles.cache.values()] && ![...member.roles.cache.values()].some(r => cmdroles?.includes(r.id))) && !cmdroles?.includes(interaction?.user.id) && ([...member.roles.cache.values()] && ![...member.roles.cache.values()].some(r => adminroles.includes(r ? r.id : r))) && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) && !member.permissions.has("ADMINISTRATOR") && ![...member.roles.cache.values()].some(r => theadminroles?.includes(r ? r.id : r))) {
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
            interaction.deferUpdate().catch(() => null);
            channel.send({
                content: `<@${buttonuser.id}>`,
                embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable51"]))
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setDescription(`Either with <@&ROLEID> or with the ROLEID or with the ROLENAME`.substring(0, 2000))
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
                                        }).then(async channel => {
                                            channel.send({
                                                embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable54"]))
                                                ]
                                            })
                                            let adminlog = await client.settings.get(`${guild.id}.adminlog`);
                                            if (adminlog != "no") {
                                                try {
                                                    var adminchannel = guild.channels.cache.get(adminlog)
                                                    if (!adminchannel) return client.settings.set(`${guild.id}.adminlog`, "no");
                                                    adminchannel.send({
                                                        embeds: [new MessageEmbed()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                                            .setAuthor(client.getAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                                dynamic: true
                                                            })))
                                                            .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable55"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                                            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                                            .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                                        ]
                                                    })
                                                } catch (e) {
                                                    console.error(e)
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
                                        }).then(async channel => {
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
                            }).then(async channel => {
                                channel.send({
                                    embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable63"]))
                                    ]
                                })
                                let adminlog = await client.settings.get(`${guild.id}.adminlog`);
                                if (adminlog != "no") {
                                    try {
                                        var adminchannel = guild.channels.cache.get(adminlog)
                                        if (!adminchannel) return client.settings.set(`${guild.id}.adminlog`, "no");
                                        adminchannel.send({
                                            embeds: [new MessageEmbed()
                                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                                                .setAuthor(client.getAuthor(`ticket --> LOG | ${user.tag}`, user.displayAvatarURL({
                                                    dynamic: true
                                                })))
                                                .setDescription(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable64"]))
                                                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
                                                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                                                .setTimestamp().setFooter({text: `ID: ${user.id}`})
                                            ]
                                        })
                                    } catch (e) {
                                        console.error(e)
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
                    console.error(e)
                    return channel.send({
                        content: `<@${buttonuser.id}>`,
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["handlers"]["ticketeventjs"]["ticketevent"]["variable69"]))
                            .setColor(es.wrongcolor)
                            .setDescription(`"Cancelled"`.substring(0, 2000))
                            .setFooter(client.getFooter(es))
                        ]
                    });
                })
            })
        } else if (temptype == "claim") {
            // if not allowed to claim the ticket
            if (([...member.roles.cache.values()] 
                && !member.roles.cache.some(r => cmdroles.includes(r.id))) 
                && !cmdroles.includes(interaction?.user.id) 
                && ([...member.roles.cache.values()] 
                && !member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) 
                && !Array(guild.ownerId, config.ownerid).includes(interaction?.user.id) 
                && !member.permissions.has("ADMINISTRATOR") 
                && !member.roles.cache.some(r => theadminroles.includes(r ? r.id : r))
            ) {
                return interaction.reply({
                    ephemeral: true,
                    content: `<@${buttonuser.id}>`,
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle("<:no:833101993668771842> You are not allowed to claim this Ticket")
                        .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join(" | ") + theadminroles.join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\` You can also add Ticket only Roles with \`${prefix}setup-ticket\``}`)
                    ]
                });
            }
            // interactioind
            
            let data = Ticketdata
            if(!channel.permissionsFor(member).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
                if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                    return interaction?.reply({ephemeral: true, content: `:x: **I am missing the Permissions MANAGE_CHANNELS for: \`${channel.name}\`**`});
                }
                channel.permissionOverwrites.edit(member.user, {
                    SEND_MESSAGES: true
                }).catch(e=>{
                    return interaction?.reply({ephemeral: true, content: ":x: **Can't change the Permissions of you!**"});
                });
            }
            interaction.update({content: message.content, embeds: [message.embeds[0]], components: message.components}).catch(() => {
                message.edit({content: message.content, embeds: [message.embeds[0]], components: message.components}).catch(e => {console.error(e)});
            })
            let messageClaim = ticket?.claim.messageClaim;
            if(String(Ticketdata.type).includes("menu")) {
                messageClaim = await client.menuticket.get(`${message.guild.id}.menuticket${Ticketdata.menutickettype}.claim.messageClaim`);
            }
            if(!messageClaim) messageClaim = `{claimer} **has claimed the Ticket!**\n> He will now give {user} support!`;
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(es.color)
                        .setAuthor(client.getAuthor(member.user.tag, member.displayAvatarURL({dynamic: true})))
                        .setDescription(messageClaim.replace(/\{claimer\}/ig, `${member.user}`).replace(/\{user\}/ig, `<@${data.user}>`))
                ]
            }).catch(e => {console.error(e)});
        
        }
    });


    //menu Ticket
    client.on("interactionCreate", async interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author?.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            if(!client.guilds.cache.get(guild.id)) return;
            let DBindex = false;
            let d = client.menuticket
            let rawData = await d.all();
            let guildData = rawData.find(d => d.ID == guild.id)?.data;
            if(!guildData) return;
            for (let i = 1; i<=100; i++) {
                let pre = `menuticket${i}`;
                if(guildData?.[pre]?.messageId === message.id && (channelId === guildData?.[pre]?.channelId || message.channelId === guildData?.[pre]?.channelId)) DBindex = i;
            }
            if(!DBindex) {
                if(interaction.placeholder) {
                    if(!interaction.placeholder.includes("Menu-Apply System!")) return
                }
                if(interaction?.replied) return interaction?.editReply(":x: Could not find the Database for your Application!");
                else return 
            }
            let pre = `menuticket${DBindex}`;
            let theDB = client.menuticket
            const obj = {};
            obj[pre] = {
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
            }
            await dbEnsure(theDB, message.guild.id, obj);
            let settings = await theDB.get(guild.id+"."+pre);
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
               let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
                }
                let data = settings.data[index];
                let replyMsg = data.replyMsg;

                let systempath = `menuticketsystem${index}`; 
                let ticketspath = `menutickets${index}`; 
                let idpath = `menuticketid${index}`; 
                let tickettypepath = `menu-ticket-setup-${index}`; 
                const obj = {};
                obj[systempath] = {
                    enabled: false,
                    guildid: guild.id,
                    messageid: "",
                    channelid: "",
                    parentid: "",
                    message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
                    adminroles: []
                }
                await dbEnsure(client.setups, guild.id,obj);
                let tickets = await client.setups.get("TICKETS."+ticketspath);
                if (tickets && tickets.includes(user.id)) {
                    try {
                      var ticketchannel = guild.channels.cache.get(await client.setups.get(user.id+"."+idpath))
                      if (!ticketchannel || ticketchannel == null || !ticketchannel.id || ticketchannel.id == null) throw {
                        message: "NO TICKET CHANNEL FOUND AKA NO ANTISPAM"
                      }
                      let data = await client.setups.get(ticketchannel.id+".ticketdata");
                      if(data)
                      {
                        if(data.state != "closed" && data.menutickettype == 3){
                          return interaction?.reply({content: `<:no:833101993668771842> **You already have an Ticket!** <#${ticketchannel.id}>`, ephemeral: true});
                        }
                      }
                    } catch (e){
                        console.error(e)
                        await dbRemove(client.setups, "TICKETS."+ticketspath, user.id)
                    }
                }
              
                await dbEnsure(client.stats, guild.id, {
                    ticketamount: 0
                });
                await client.stats.add(guild.id+".ticketamount", 1);
                let ticketamount = await client.stats.get(guild.id+".ticketamount");
                
                if(!data.defaultname) data.defaultname = "🎫・{count}・{member}";

                let channelname = data.defaultname.replace("{member}", user.username).replace("{count}", ticketamount).replace(/\s/igu, "-").substring(0, 31);
                let optionsData = {
                topic: `📨 Ticket for: ${user.tag} (${user.id}) | ${values[0]} | ✅ Created at: ${moment().format("LLLL")}`,
                    type: "GUILD_TEXT",
                    reason: `Menu Ticket System for: ${user.tag}`,
                }
                guild.channels.create(channelname.substring(0, 31), optionsData).then(async ch => {
                await interaction?.reply({content: `<a:Loading:833101350623117342> **Creating your ticket?...** (Usually takes 0-2 Seconds)`, ephemeral: true});
                try {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(cat){
                        if(cat.type == "GUILD_CATEGORY"){
                        if(cat.children.size < 50){
                            await ch.setParent(String(cat.id)).catch(() => null);
                        }
                        }
                    } else {
                        if(ch.parent){
                        if(ch.parent.children.size < 50){
                            await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => null);
                        }
                        }
                    }
                } catch (e){
                    if(ch.parent){
                        if(ch.parent.children.size < 50){
                        await ch.setParent(String(ch.parent.id), {lockPermissions: false}).catch(() => null);
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
                    }).catch(() => null);
                } else {
                    var cat = guild.channels.cache.get(settings.data[index].category)
                    if(!cat) {
                        await ch.permissionOverwrites.create(guild.id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false,
                            EMBED_LINKS: false,
                            ADD_REACTIONS: false,
                            ATTACH_FILES: false
                        }).catch(() => null);
                    }
                }

                await ch.permissionOverwrites.create(user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    EMBED_LINKS: true,
                    ADD_REACTIONS: true,
                    ATTACH_FILES: true
                }).catch(() => null);
               

                await message.guild.members.fetch().catch(() => null);
                let realaccess = [];
                for await (const a of settings.access) {
                    if(message.guild.roles.cache.has(a)) {
                        realaccess.push(a);
                    } else if(message.guild.members.cache.has(a)){
                        realaccess.push(a);
                    }
                }
                for await (const a of realaccess) {
                    if(a == ch.guild.id) continue;
                    await ch.permissionOverwrites.create(a, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        EMBED_LINKS: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    }).catch(() => null);
                }
                if(settings.claim.enabled){
                    let ids = ch.permissionOverwrites.cache.filter(p => p.type == "role" && !p.deny.toArray().includes("SEND_MESSAGES")).map(d => d.id);
                    for await (const id of ids){
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
                let guild_settings = await client.settings.get(message.guild.id)
                let es = guild_settings?.embed || ee
                await client.setups.push("TICKETS."+ticketspath, user.id);
                await client.setups.push("TICKETS."+ticketspath, ch.id);
                await client.setups.set(user.id+"."+idpath, ch.id);
                await client.setups.set(ch.id+".ticketdata", {
                    user: user.id,
                    channel: ch.id,
                    guild: guild.id,
                    menutickettype: DBindex,
                    menuticketIndex: index,
                    type: tickettypepath,
                    state: "open",
                    date: Date.now(),
                });
            
                let extrastring = "";
                for await (const a of realaccess){
                    if(message.guild.roles.cache.has(a)) {
                        extrastring += ` | <@&${a}>`
                    } else if(message.guild.members.cache.has(a)){
                        extrastring += ` | <@${a}>`
                    }
                }
                
                var ticketembed = new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(`To close/manage this ticket react with the buttons\nYou can also type: ${guild_settings.prefix || config.prefix}ticket`, es.footericon))
                    .setAuthor(client.getAuthor(`Ticket for: ${user.tag}`, user.displayAvatarURL({
                    dynamic: true
                    }), "https://discord.gg/milrato"))
                    .setDescription(replyMsg.replace(/\{user\}/igu, `${user}`).substring(0, 2000))
                var ticketembeds = [ticketembed]
                if(settings.claim.enabled){
                    var claimEmbed = new MessageEmbed()
                    .setColor("ORANGE").setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setAuthor(client.getAuthor(`A Staff Member will claim the Ticket soon!`, "https://cdn.discordapp.com/emojis/833101350623117342.gif?size=44", "https://discord.gg/milrato"))
                    .setDescription(settings.claim.messageOpen.replace(/\{user\}/igu, `${user}`).substring(0, 2000))
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
                        }).catch(()=>null).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch(()=>null)
                            }
                        })
                    } else {
                        await ch.send({
                            content: `<@${user.id}>${extrastring}\n${ticketembeds[0].description}`.substring(0, 2000),
                            components: allbuttons
                        }).catch(()=>null).then(msg => {
                            if(msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                msg.pin().catch(()=>null)
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
    client.on("interactionCreate", async interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author?.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            if(!client.guilds.cache.get(guild.id)) return;
            let DBindex = false;
            let d = client.autosupport
            let rawData = await d.all();
            let guildData = rawData.find(d => d.ID == guild.id)?.data;
            if(!guildData) return;
            for (let i = 1; i<=100; i++) {
                let pre = `autosupport${i}`;
                if(guildData?.[pre]?.messageId === message.id && (channelId === guildData?.[pre]?.channelId || message.channelId === guildData?.[pre]?.channelId)) DBindex = i;
            }
            if(!DBindex) {
                if(interaction.placeholder) {
                    if(!interaction.placeholder.includes("Menu-Apply System!")) return
                }
                if(interaction?.replied) return interaction?.editReply(":x: Could not find the Database for your Application!");
                else return
            }
            let theDB = client.autosupport
            let pre = `autosupport${DBindex}`;
            const obj = {};
            obj[pre] = {
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
            }
            await dbEnsure(theDB, guild.id, obj);
            let settings = await theDB.get(`${guild.id}.${pre}`);
            let es = await client.settings.get(`${guild.id}.embed`) || ee
            if(message.id == settings.messageId && (channelId == settings.channelId || message.channelId == settings.channelId)){
                let index = settings.data.findIndex(v => v.value == values[0]);
                if(index < 0) {
                    return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Auto-Support-Data-Settings for this Option**"});
                }
                let data = settings.data[index];
                let { sendEmbed, replyMsg } = data;
                if(sendEmbed){
                    interaction?.reply({ephemeral: true, embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                        .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setDescription(String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substring(0, 2000))
                    ]});
                }else {
                    interaction?.reply({ephemeral: true, content: String(replyMsg).replace(/\{user\}/igu, `<@${user.id}>`).substring(0, 2000)});
                }
            }
        }
    })

    
    //menu apply
    client.on("interactionCreate", async interaction => {
        if(interaction?.guildId && interaction?.isSelectMenu() && interaction?.message && interaction?.message.author?.id == client.user.id){
            let { user, message, channelId, values, guild } = interaction;
            if(!client.guilds.cache.get(guild.id)) return;
            let DBindex = false;
            let d = client.menuapply
            let rawData = await d.all();
            let guildData = rawData.find(d => d.ID == guild.id)?.data;
            if(!guildData) return;
            for (let i = 1; i<=100; i++) {
                let pre = `menuapply${i}`;
                if(guildData?.[pre]?.messageId === message.id && (channelId === guildData?.[pre]?.channelId || message.channelId === guildData?.[pre]?.channelId)) DBindex = i;
            }
            if(!DBindex) {
                if(interaction.placeholder) {
                    if(!interaction.placeholder.includes("Menu-Apply System!")) return
                }
                if(interaction?.replied) return interaction?.editReply(":x: Could not find the Database for your Application!");
                else return
            }
            let pre = `menuapply${DBindex}`;
            let theDB = client.menuapply
            const obj = {};
            obj[pre] = {
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
            };
            await dbEnsure(theDB, guild.id, obj);
            let guild_settings = await client.settings.get(guild.id)
            const es = guild_settings.embed || ee
            const ls = guild_settings.language || "en";
            const settings = await theDB.get(guild.id+"."+pre);
            const index = settings.data.findIndex(v => v.value == values[0]);
            if(index < 0) {
                return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Ticket-Settings for this Option**"});
            }
            const data = settings.data[index];
            if(!data) return interaction?.reply({ephemeral: true, content: ":x: **Could not find the Data for this System**"});
            require(`./apply.js`).ApplySystem({ guild: guild, channel: message.channel, user: user, message: message, interaction, es: es, ls: ls, preindex: Number(data.applySystemExecution) })
        }
    })
    
}