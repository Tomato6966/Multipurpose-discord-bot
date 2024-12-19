/*
 **** EXAMPLE DB STRUCTURE:
    //Create the database:
    const Enmap = require("enmap");
    // ... create the bot client
    client.reactionrole = new Enmap({
        name: "reactionrole-db",
        dataDir: "./databases/reactionroleDB", // OPTIONAL, define where the db should be saved (create folders first)
    })


    const guildId = message.guild.id; // key in the database

    //how to "ensure the db" for each guild
    client.reactionrole.ensure(guildId, {
        reactionroles: []
    });


    // Example data of a reactionrole
    const ReactionRoleData = {
        MESSAGE_ID: '871019011452850276',
        remove_others: false, // if true, it means that only 1 reaction role can be used at once
        Parameters: [ // Technically you could add infnite parameters (emojis), but discord just allows 20 at once on 1 message ...
            { Emoji: '🛑', Emojimsg: '🛑', Role: '831972743280590848' }, // Unicode emoji
            { Emoji: '866089513654419466', Emojimsg: '<:Builder:866089513654419466>', Role: '845952370889981952' }, // Discord Custom Emoji
            { Emoji: '🔥', Emojimsg: '🔥', Role: '844512850395398155' }, 
        ]
    }

    // Add the data to the db
    client.reactionrole.push(guildId, ReactionRoleData, "reactionrole");
    // You do not need to remove the data from the db as it's only available as long as the message exists


    //EDITING:  const messageId = "The ReactionRole Message to edit:"

    const data = client.reactionrole.get(guildId, "reactionrole");
    const index = data.findIndex(r => r.MESSAGE_ID == messageId);
    if(index > -1) {
        data[index] = newReactionRoleData;
        client.reactionrole.set(guildId, data, "reactionrole")
    } else {
        console.log("No reactionrole found")
    }
*/

module.exports = (client) => {
    //ADDING ROLES    
    client.on("messageReactionAdd", async (reaction, user) => {
        try {
            const {
                message
            } = reaction;
            if (user.bot || !message.guild) return;
            if (message && message.partial) await message.fetch().catch(() => {});
            if (reaction.partial) await reaction.fetch().catch(() => {});
            if (user.bot) return;
            client.reactionrole.ensure(reaction.message.guild.id, {
                reactionroles: []
            });
            const reactionsetup = client.reactionrole.get(reaction.message.guild.id, "reactionroles");
            if (!reactionsetup || reactionsetup == undefined || reactionsetup == null) return;
            for (let k = 0; k < reactionsetup.length; k++) {
                if (reaction.message.id === reactionsetup[k].MESSAGE_ID) {
                    let messagereaction = await reaction.message.guild.members.fetch(user.id).catch(() => {});
                    let rr = reactionsetup[k].Parameters;
                    let currrole;
                    for (let j = 0; j < rr.length; j++) {
                        if (reaction.emoji?.id == rr[j].Emoji) {
                            try {
                                currrole = rr[j].Role;
                                let guildRole = messagereaction.guild.roles.cache.get(rr[j].Role)
                                if (guildRole) {
                                    if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                        if (!messagereaction.roles.cache.has(rr[j].Role))
                                            await messagereaction.roles.add(rr[j].Role).catch(() => {});
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't give it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => {}), 3000)
                                        }).catch(() => {})
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't give it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => {}), 3000)
                                    }).catch(() => {})
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => msg.delete().catch(() => {}), 3000)
                                }).catch(() => {})
                            }
                        } else if (reaction.emoji?.name == rr[j].Emoji) {
                            try {
                                currrole = rr[j].Role;
                                let guildRole = messagereaction.guild.roles.cache.get(rr[j].Role)
                                if (guildRole) {
                                    if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                        if (!messagereaction.roles.cache.has(rr[j].Role))
                                            await messagereaction.roles.add(rr[j].Role).catch(() => {});
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't give it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => {}), 3000)
                                        }).catch(() => {})
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't give it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => {}), 3000)
                                    }).catch(() => {})
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => {});
                                    }, 3000)
                                }).catch(() => {});
                            }
                        } else {
                            continue;
                        }
                    }

                    if (reactionsetup[k].remove_others) {
                        let rr2 = reactionsetup[k].Parameters;
                        //REMOVE REACTIONS
                        let oldreact = reaction;
                        await reaction.message.fetch().catch(() => {});
                        const userReactions = reaction.message.reactions.cache;
                        try {
                            for (const reaction of userReactions.values()) {
                                if (reaction.users.cache.has(user.id) && oldreact.emoji?.name != reaction.emoji?.name) {
                                    reaction.users.remove(user.id);
                                }
                            }
                        } catch {}
                        //REMOVE THE ROLE
                        for (let z = 0; z < rr2.length; z++) {
                            try {
                                if (rr2[z].Role != currrole) {
                                    let guildRole = messagereaction.guild.roles.cache.get(rr2[z].Role)
                                    if (guildRole) {
                                        if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                            if (!messagereaction.roles.cache.has(rr[z].Role))
                                                await messagereaction.roles.remove(rr[z].Role).catch(() => {});
                                        } else {
                                            reaction.message.channel.send("The Role is above my highest Role, I can't remove it to you!").then(msg => {
                                                setTimeout(() => msg.delete().catch(() => {}), 3000)
                                            }).catch(() => {})
                                        }
                                    } else {
                                        reaction.message.channel.send("This Role got deleted, I can't remove it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => {}), 3000)
                                        }).catch(() => {})
                                    }
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => {});
                                    }, 3000)
                                }).catch(() => {});
                            }
                        }
                    }
                } else {
                    continue;
                }
            }
        } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
    });

    //REMOVING ROLES
    client.on("messageReactionRemove", async (reaction, user) => {
        try {
            if (reaction.message && reaction.message.partial) await reaction.message.fetch().catch(() => {});
            if (reaction.partial) await reaction.fetch().catch(() => {});
            if (user.bot) return;
            if (!reaction.message.guild) return;
            client.reactionrole.ensure(reaction.message.guild.id, {
                reactionroles: []
            });
            const reactionsetup = client.reactionrole.get(reaction.message.guild.id, "reactionroles");

            for (let k = 0; k < reactionsetup.length; k++) {
                if (reaction.message.id === reactionsetup[k].MESSAGE_ID) {
                    let messagereaction = await reaction.message.guild.members.fetch(user.id).catch(() => {});
                    let rr = reactionsetup[k].Parameters;
                    for (let j = 0; j < rr.length; j++) {
                        if (reaction.emoji?.id === rr[j].Emoji) {
                            try {
                                let guildRole = messagereaction.guild.roles.cache.get(rr[j].Role)
                                if (guildRole) {
                                    if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                        if (messagereaction.roles.cache.has(rr[j].Role))
                                            await messagereaction.roles.remove(rr[j].Role).catch(() => {});
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't remove it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => {}), 3000)
                                        }).catch(() => {})
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't remove it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => {}), 3000)
                                    }).catch(() => {})
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => {});
                                    }, 3000)
                                }).catch(() => {});
                            }
                        } else if (reaction.emoji?.name === rr[j].Emoji) {
                            try {
                                let guildRole = messagereaction.guild.roles.cache.get(rr[j].Role)
                                if (guildRole) {
                                    if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                        if (messagereaction.roles.cache.has(rr[j].Role))
                                            await messagereaction.roles.remove(rr[j].Role).catch(() => {});
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't remove it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => {}), 3000)
                                        }).catch(() => {})
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't remove it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => {}), 3000)
                                    }).catch(() => {})
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => {});
                                    }, 3000)
                                }).catch(() => {});
                            }
                        } else {
                            continue;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
    });
}