const { dbEnsure, dbRemove, } = require("./functions")
module.exports = (client) => {
    //ADDING ROLES    
    client.on("messageReactionAdd", async (reaction, user) => {
        try {
            const {
                message
            } = reaction;
            if (user.bot || !message.guild) return;
            if (message && message.partial) await message.fetch().catch(() => null);
            if (reaction.partial) await reaction.fetch().catch(() => null);
            if (user.bot) return;
            await dbEnsure(client.reactionrole, reaction.message.guild.id, {
                reactionroles: []
            });
            const reactionsetup = await client.reactionrole.get(reaction.message.guild.id+".reactionroles");
            if (!reactionsetup || reactionsetup == undefined || reactionsetup == null) return;
            for (let k = 0; k < reactionsetup.length; k++) {
                if (reaction.message.id === reactionsetup[k].MESSAGE_ID) {
                    let messagereaction = await reaction.message.guild.members.fetch(user.id).catch(() => null);
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
                                            await messagereaction.roles.add(rr[j].Role).catch(() => null);
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't give it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => null), 3000)
                                        }).catch(() => null)
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't give it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => null), 3000)
                                    }).catch(() => null)
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => msg.delete().catch(() => null), 3000)
                                }).catch(() => null)
                            }
                        } else if (reaction.emoji?.name == rr[j].Emoji) {
                            try {
                                currrole = rr[j].Role;
                                let guildRole = messagereaction.guild.roles.cache.get(rr[j].Role)
                                if (guildRole) {
                                    if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                        if (!messagereaction.roles.cache.has(rr[j].Role))
                                            await messagereaction.roles.add(rr[j].Role).catch(() => null);
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't give it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => null), 3000)
                                        }).catch(() => null)
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't give it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => null), 3000)
                                    }).catch(() => null)
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => null);
                                    }, 3000)
                                }).catch(() => null);
                            }
                        } else {
                            continue;
                        }
                    }

                    if (reactionsetup[k].remove_others) {
                        let rr2 = reactionsetup[k].Parameters;
                        //REMOVE REACTIONS
                        let oldreact = reaction;
                        await reaction.message.fetch().catch(() => null);
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
                                                await messagereaction.roles.remove(rr[z].Role).catch(() => null);
                                        } else {
                                            reaction.message.channel.send("The Role is above my highest Role, I can't remove it to you!").then(msg => {
                                                setTimeout(() => msg.delete().catch(() => null), 3000)
                                            }).catch(() => null)
                                        }
                                    } else {
                                        reaction.message.channel.send("This Role got deleted, I can't remove it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => null), 3000)
                                        }).catch(() => null)
                                    }
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => null);
                                    }, 3000)
                                }).catch(() => null);
                            }
                        }
                    }
                } else {
                    continue;
                }
            }
        } catch (e) {
            console.error(e)
        }
    });

    //REMOVING ROLES
    client.on("messageReactionRemove", async (reaction, user) => {
        try {
            if (reaction.message && reaction.message.partial) await reaction.message.fetch().catch(() => null);
            if (reaction.partial) await reaction.fetch().catch(() => null);
            if (user.bot) return;
            if (!reaction.message.guild) return;
            await dbEnsure(client.reactionrole, reaction.message.guild.id, {
                reactionroles: []
            });
            const reactionsetup = await client.reactionrole.get(reaction.message.guild.id+".reactionroles");

            for (let k = 0; k < reactionsetup.length; k++) {
                if (reaction.message.id === reactionsetup[k].MESSAGE_ID) {
                    let messagereaction = await reaction.message.guild.members.fetch(user.id).catch(() => null);
                    let rr = reactionsetup[k].Parameters;
                    for (let j = 0; j < rr.length; j++) {
                        if (reaction.emoji?.id === rr[j].Emoji) {
                            try {
                                let guildRole = messagereaction.guild.roles.cache.get(rr[j].Role)
                                if (guildRole) {
                                    if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                        if (messagereaction.roles.cache.has(rr[j].Role))
                                            await messagereaction.roles.remove(rr[j].Role).catch(() => null);
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't remove it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => null), 3000)
                                        }).catch(() => null)
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't remove it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => null), 3000)
                                    }).catch(() => null)
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => null);
                                    }, 3000)
                                }).catch(() => null);
                            }
                        } else if (reaction.emoji?.name === rr[j].Emoji) {
                            try {
                                let guildRole = messagereaction.guild.roles.cache.get(rr[j].Role)
                                if (guildRole) {
                                    if (messagereaction.guild.me.roles.highest.rawPosition > guildRole.rawPosition) {
                                        if (messagereaction.roles.cache.has(rr[j].Role))
                                            await messagereaction.roles.remove(rr[j].Role).catch(() => null);
                                    } else {
                                        reaction.message.channel.send("The Role is above my highest Role, I can't remove it to you!").then(msg => {
                                            setTimeout(() => msg.delete().catch(() => null), 3000)
                                        }).catch(() => null)
                                    }
                                } else {
                                    reaction.message.channel.send("This Role got deleted, I can't remove it to you!").then(msg => {
                                        setTimeout(() => msg.delete().catch(() => null), 3000)
                                    }).catch(() => null)
                                }
                            } catch (error) {
                                reaction.message.channel.send({
                                    content: `\`\`\`${error.message}\`\`\``,
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch(() => null);
                                    }, 3000)
                                }).catch(() => null);
                            }
                        } else {
                            continue;
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e)
        }
    });
}