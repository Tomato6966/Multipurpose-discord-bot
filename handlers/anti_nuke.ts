import Enmap from "enmap";
import { ExtendedClient } from "..";
import { EmbedBuilder, GuildMember, PermissionsBitField } from "discord.js";
import { simple_databasing } from "./functions";
import chalk from "chalk";
import { AuditLogEvent } from "discord.js";

export default (client: ExtendedClient) => {
    client.Anti_Nuke_System = new Enmap({
        name: "antinuke",
        dataDir: "./databases/antinuke"
    });

    function antinuke_databasing(GUILDID) {
        client.Anti_Nuke_System.ensure(GUILDID, {
            all: {
                enabled: false,
                logger: "no",
                whitelisted: {
                    roles: [],
                    users: []
                },
                showwhitelistlog: true,
                quarantine: false,
            },
            antibot: {
                enabled: true,
                whitelisted: {
                    roles: [],
                    users: []
                },
                punishment: {
                    bot: {
                        kick: true,
                        ban: false,
                    },
                    member: {
                        removeroles: {
                            neededdaycount: 1, //he is allowed to add 1 Bot / Day
                            neededweekcount: 4, //he is allowed to add 4 Bots / Week
                            neededmonthcount: 10, //he is allowed to add 10 Bot / Month
                            noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                            enabled: true
                        },
                        kick: {
                            neededdaycount: 2, //he is allowed to add 2 Bot / Day
                            neededweekcount: 7, //he is allowed to add 5 Bots / Week
                            neededmonthcount: 20, //he is allowed to add 11 Bot / Month
                            noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                            enabled: true
                        },
                        ban: {
                            neededdaycount: 4, //he is allowed to add 3 Bot / Day
                            neededweekcount: 10, //he is allowed to add 6 Bots / Week
                            neededmonthcount: 25, //he is allowed to add 12 Bot / Month
                            noeededalltimecount: 0, //0 means that he is allowed to add infinite Bots for all time
                            enabled: true
                        },
                    }
                },
            },
            //Anti Kick & Ban
            antideleteuser: {
                enabled: true,
                whitelisted: {
                    roles: [],
                    users: []
                },
                punishment: {
                    member: {
                        removeroles: {
                            neededdaycount: 1, //he is allowed to do it 1 / Day
                            neededweekcount: 4, //he is allowed to do it 4 / Week
                            neededmonthcount: 10, //he is allowed to do it 10 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        kick: {
                            neededdaycount: 2, //he is allowed to to do it 2 / Day
                            neededweekcount: 7, //he is allowed to to do it 5 / Week
                            neededmonthcount: 20, //he is allowed to to do it 11 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        ban: {
                            neededdaycount: 4, //he is allowed to to do it 3 / Day
                            neededweekcount: 10, //he is allowed to to do it 6 / Week
                            neededmonthcount: 25, //he is allowed to to do it 12 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                    }
                },
            },
            //ANTI CREATE ROLE
            anticreaterole: {
                enabled: true,
                whitelisted: {
                    roles: [],
                    users: []
                },
                punishment: {
                    removeaddedrole: true,
                    member: {
                        removeroles: {
                            neededdaycount: 1, //he is allowed to do it 1 / Day
                            neededweekcount: 4, //he is allowed to do it 4 / Week
                            neededmonthcount: 10, //he is allowed to do it 10 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        kick: {
                            neededdaycount: 2, //he is allowed to to do it 2 / Day
                            neededweekcount: 7, //he is allowed to to do it 5 / Week
                            neededmonthcount: 20, //he is allowed to to do it 11 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        ban: {
                            neededdaycount: 4, //he is allowed to to do it 3 / Day
                            neededweekcount: 10, //he is allowed to to do it 6 / Week
                            neededmonthcount: 25, //he is allowed to to do it 12 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                    }
                },
            },
            //Anti DELETE Role
            antideleterole: {
                enabled: true,
                whitelisted: {
                    roles: [],
                    users: []
                },
                punishment: {
                    readdrole: true,
                    member: {
                        removeroles: {
                            neededdaycount: 1, //he is allowed to do it 1 / Day
                            neededweekcount: 4, //he is allowed to do it 4 / Week
                            neededmonthcount: 10, //he is allowed to do it 10 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        kick: {
                            neededdaycount: 2, //he is allowed to to do it 2 / Day
                            neededweekcount: 7, //he is allowed to to do it 5 / Week
                            neededmonthcount: 20, //he is allowed to to do it 11 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        ban: {
                            neededdaycount: 4, //he is allowed to to do it 3 / Day
                            neededweekcount: 10, //he is allowed to to do it 6 / Week
                            neededmonthcount: 25, //he is allowed to to do it 12 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                    }
                },
            },
            //ANTI DELETE CHANNEL
            antichanneldelete: {
                enabled: true,
                whitelisted: {
                    roles: [],
                    users: []
                },
                punishment: {
                    member: {
                        removeroles: {
                            neededdaycount: 1, //he is allowed to do it 1 / Day
                            neededweekcount: 4, //he is allowed to do it 4 / Week
                            neededmonthcount: 10, //he is allowed to do it 10 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        kick: {
                            neededdaycount: 2, //he is allowed to to do it 2 / Day
                            neededweekcount: 7, //he is allowed to to do it 5 / Week
                            neededmonthcount: 20, //he is allowed to to do it 11 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        ban: {
                            neededdaycount: 4, //he is allowed to to do it 3 / Day
                            neededweekcount: 10, //he is allowed to to do it 6 / Week
                            neededmonthcount: 25, //he is allowed to to do it 12 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                    }
                },
            },
            //ANTI CREATE CHANNEL
            antichannelcreate: {
                enabled: true,
                whitelisted: {
                    roles: [],
                    users: []
                },
                punishment: {
                    deletecreatedchannel: true,
                    member: {
                        removeroles: {
                            neededdaycount: 1, //he is allowed to do it 1 / Day
                            neededweekcount: 4, //he is allowed to do it 4 / Week
                            neededmonthcount: 10, //he is allowed to do it 10 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        kick: {
                            neededdaycount: 2, //he is allowed to to do it 2 / Day
                            neededweekcount: 7, //he is allowed to to do it 5 / Week
                            neededmonthcount: 20, //he is allowed to to do it 11 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                        ban: {
                            neededdaycount: 4, //he is allowed to to do it 3 / Day
                            neededweekcount: 10, //he is allowed to to do it 6 / Week
                            neededmonthcount: 25, //he is allowed to to do it 12 / Month
                            noeededalltimecount: 0, //0 means that he is allowed to do it infinite for all time
                            enabled: true
                        },
                    }
                },
            },
        })
    };

    function usr_antinuke_databasing(GUILDIDUSERID) {
        client.Anti_Nuke_System.ensure(GUILDIDUSERID, {
            antibot: [], //ANTI INVITE BOT
            antideleteuser: [], // ANTI Kick & Ban

            anticreaterole: [], //ANTI CREATE ROLE
            antideleterole: [], //ANTI DELETE Role

            antichannelcreate: [], //ANTI CREATE CHANNEL
            antichanneldelete: [], //ANTI DELETE CHANNEL
        })
    };

    // Anti Bot
    client.on("guildMemberAdd", async (member) => {
        try {
            if (!member.guild) return;
            simple_databasing(client, member.guild.id);

            let ls = client.settings.get(member.guild.id, "language");

            const eventsTimestamp = Date.now().toString();

            antinuke_databasing(member.guild.id);

            let data = client.Anti_Nuke_System.get(member.guild.id)
            if (!data.all.enabled || !data.antibot.enabled) return;

            if (member.user.bot) {
                if (!member.guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.guild.members.me?.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    try {
                        let ch = member.guild.channels.cache.get(data.all.logger);

                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: "This is a Warn",
                                        iconURL: "https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png"
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                                ]
                            }).catch(() => { })
                        };
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan("ANTI-NUKE SYSTEM - ERROR-CATCHER"), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                };

                let AuditData = await member.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.BotAdd
                }).then((audit) => {
                    return audit.entries.first();
                }).catch((e) => {
                    if (data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("Yellow")
                                        .setAuthor({
                                            name: `This is a Warn`,
                                            iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                        })
                                        .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                                    ]
                                }).catch(() => { })
                            }
                            return;
                        } catch (e) {
                            console.log(chalk.dim.cyan("ANTI-NUKE SYSTEM - ERROR-CATCHER"), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            return;
                        }
                    }
                });

                let AddedUserID = AuditData?.executor?.id ?? "";
                let LogTimeString = AuditData?.createdTimestamp.toString();

                const EventExecution = eventsTimestamp;
                const logtime = LogTimeString?.slice(0, -3);
                const eventtime = EventExecution.slice(0, -3);

                if (logtime !== eventtime) return;
                let AddedMember = await member.guild.members.fetch(AddedUserID).catch((e) => {
                    if (data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("Yellow")
                                        .setAuthor({
                                            name: `This is a Warn`,
                                            iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                        })
                                        .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable5"]))
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable6"]))
                                    ]
                                }).catch(() => { });
                            }
                            return;
                        } catch (e) {
                            console.log(chalk.dim.cyan("ANTI-NUKE SYSTEM - ERROR-CATCHER"), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            return;
                        }
                    }
                });

                if (AddedMember) {
                    if (AddedUserID == AddedMember.guild.ownerId) {
                        if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                            try {
                                let ch = member.guild.channels.cache.get(data.all.logger);
                                if (ch && ch.isSendable()) {
                                    ch.send({
                                        embeds: [new EmbedBuilder()
                                            .setColor("#FFFFF9")
                                            .setAuthor({
                                                name: `ANTI ADD BOT - ${AddedMember.user.tag}`,
                                                iconURL: AddedMember.user.displayAvatarURL()
                                            })
                                            .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable7"]))
                                            .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                        ]
                                    }).catch(() => { });
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        };

                        return;
                    };

                    if (!AddedMember.guild.members.me) return;
                    if (AddedMember.roles.cache.size > 0 && AddedMember.guild.members.me.roles.cache.size > 0 && AddedMember.roles.highest.rawPosition >= AddedMember.guild.members.me.roles.highest.rawPosition) {
                        if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                            try {
                                let ch = member.guild.channels.cache.get(data.all.logger);
                                if (ch && ch.isSendable()) {
                                    ch.send({
                                        embeds: [new EmbedBuilder()
                                            .setColor("#FFFFF9")
                                            .setAuthor({
                                                name: `ANTI ADD BOT - ${AddedMember.user.tag}`,
                                                iconURL: AddedMember.user.displayAvatarURL()
                                            })
                                            .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable8"]))
                                            .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                        ]
                                    }).catch(() => { });
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        }
                        return;
                    };

                    if (data.all.whitelisted.users.includes(AddedUserID)) {
                        if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                            try {
                                let ch = member.guild.channels.cache.get(data.all.logger);
                                if (ch && ch.isSendable()) {
                                    ch.send({
                                        embeds: [new EmbedBuilder()
                                            .setColor("#FFFFF9")
                                            .setAuthor({
                                                name: `ANTI ADD BOT - ${AddedMember.user.tag}`,
                                                iconURL: AddedMember.user.displayAvatarURL()
                                            })
                                            .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable9"]))
                                            .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                        ]
                                    }).catch(() => { });
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        }
                        return;
                    };

                    if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.all.whitelisted.roles.includes(r.id))) {
                        if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                            try {
                                let ch = member.guild.channels.cache.get(data.all.logger);
                                if (ch && ch.isSendable()) {
                                    ch.send({
                                        embeds: [new EmbedBuilder()
                                            .setColor("#FFFFF9")
                                            .setAuthor({
                                                name: `ANTI ADD BOT - ${AddedMember.user.tag}`,
                                                iconURL: AddedMember.user.displayAvatarURL()
                                            })
                                            .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable10"]))
                                            .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                        ]
                                    }).catch(() => { });
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        }
                        return;
                    };

                    if (data.antibot.whitelisted.users.includes(AddedUserID)) {
                        if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                            try {
                                let ch = member.guild.channels.cache.get(data.all.logger);
                                if (ch && ch.isSendable()) {
                                    ch.send({
                                        embeds: [new EmbedBuilder()
                                            .setColor("#FFFFF9")
                                            .setAuthor({
                                                name: `ANTI ADD BOT - ${AddedMember.user.tag}`,
                                                iconURL: AddedMember.user.displayAvatarURL()
                                            })
                                            .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable11"]))
                                            .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                        ]
                                    }).catch(() => { });
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        }
                        return;
                    };

                    if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.antibot.whitelisted.roles.includes(r.id))) {
                        if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                            try {
                                let ch = member.guild.channels.cache.get(data.all.logger);
                                if (ch && ch.isSendable()) {
                                    ch.send({
                                        embeds: [new EmbedBuilder()
                                            .setColor("#FFFFF9")
                                            .setAuthor({
                                                name: `ANTI ADD BOT - ${AddedMember.user.tag}`,
                                                iconURL: AddedMember.user.displayAvatarURL()
                                            })
                                            .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable12"]))
                                            .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                        ]
                                    }).catch(() => { });
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        }
                        return;
                    };

                    // Ensure The Data
                    usr_antinuke_databasing(member.guild.id + AddedMember.id);
                    let memberData = client.Anti_Nuke_System.get(member.guild.id + AddedMember.id);
                    // Increast the Stats
                    client.Anti_Nuke_System.push(member.guild.id + AddedMember.id, Date.now(), "antibot");
                    memberData = client.Anti_Nuke_System.get(member.guild.id + AddedMember.id);
                    try {
                        if (data.antibot.punishment.member.removeroles.enabled &&
                            ( // 1 Day check
                                (data.antibot.punishment.member.removeroles.neededdaycount > 0 && memberData.antibot.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length > data.antibot.punishment.member.removeroles.neededdaycount) ||
                                // 1 Week Check
                                (data.antibot.punishment.member.removeroles.neededweekcount > 0 && memberData.antibot.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length > data.antibot.punishment.member.removeroles.neededweekcount) ||
                                // 1 Month Check
                                (data.antibot.punishment.member.removeroles.neededmonthcount > 0 && memberData.antibot.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length > data.antibot.punishment.member.removeroles.neededmonthcount) ||
                                //All Time Check
                                (data.antibot.punishment.member.removeroles.noeededalltimecount > 0 && memberData.antibot.length > data.antibot.punishment.member.removeroles.noeededalltimecount)
                            )
                        ) {
                            // KICK THE BOT
                            try {
                                if (!data.antibot.punishment.bot.ban && data.antibot.punishment.bot.kick) {
                                    // If there is a logger enabled then log the data
                                    if (data.all.logger && data.all.logger.length > 5) {
                                        try {
                                            let ch = member.guild.channels.cache.get(data.all.logger);
                                            if (ch && ch.isSendable()) {
                                                ch.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor("Green")
                                                        .setAuthor({
                                                            name: `ANTI BOT - I Kicked: ${member.user.tag}`,
                                                            iconURL: `https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png`
                                                        })
                                                        .setThumbnail(member.user.displayAvatarURL())
                                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable13"]))
                                                    ]
                                                }).catch(() => { });
                                            }
                                        } catch (e) {
                                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                        }
                                    }

                                    // Kick the Bot
                                    member.kick(`Anti Bot - Added by: ${AddedUserID}`).catch((e) => {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    });
                                };

                                if (data.antibot.punishment.bot.ban) {
                                    // If there is a logger enabled then log the data
                                    if (data.all.logger && data.all.logger.length > 5) {
                                        try {
                                            let ch = member.guild.channels.cache.get(data.all.logger);
                                            if (ch && ch.isSendable()) {
                                                ch.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor("Green")
                                                        .setAuthor({
                                                            name: `ANTI BOT - I Banned: ${member.user.tag}`,
                                                            iconURL: `https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png`
                                                        })
                                                        .setThumbnail(member.user.displayAvatarURL())
                                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable14"]))
                                                    ]
                                                }).catch(() => { });
                                            }
                                        } catch (e) {
                                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                        }
                                    }

                                    // Ban the Bot
                                    member.ban({
                                        reason: `Anti Bot - Added by: ${AddedUserID}`
                                    }).catch((e) => {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    });
                                };
                            } catch (e) {
                                console.log("ANTI-NUKE SYSTEM - ERROR-CATCHER", e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            };

                            //Remove his/her roles
                            let roles2set: string[] = [];
                            if (data.all.quarantine && data.all.quarantine.length > 5) {
                                try {
                                    let therole = AddedMember.guild.roles.cache.get(data.all.quarantine);
                                    if (therole && therole.id) {
                                        roles2set.push(therole.id);
                                    };
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            };

                            AddedMember.roles.set(roles2set).then(member => {
                                //If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = member.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Blurple")
                                                    .setAuthor({
                                                        name: `ANTI ADD BOT - Removed Roles of ${AddedMember.user.tag} for adding ${member.user.tag}`,
                                                        iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                    })
                                                    .setThumbnail(member.user.displayAvatarURL())
                                                    .setThumbnail(member.user.displayAvatarURL())
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable15"]))
                                                    .setFooter(client.getFooter(`ID: ${AddedUserID}`, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { });
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                };
                            });
                        }

                        // Kick Member (Punishment 4)
                        if (AddedMember.kickable && data.antibot.punishment.member.kick.enabled &&
                            ( // 1 Day check
                                (data.antibot.punishment.member.kick.neededdaycount > 0 && memberData.antibot.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length > data.antibot.punishment.member.kick.neededdaycount) ||
                                // 1 Week Check
                                (data.antibot.punishment.member.kick.neededweekcount > 0 && memberData.antibot.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length > data.antibot.punishment.member.kick.neededweekcount) ||
                                // 1 Month Check
                                (data.antibot.punishment.member.kick.neededmonthcount > 0 && memberData.antibot.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length > data.antibot.punishment.member.kick.neededmonthcount) ||
                                // All Time Check
                                (data.antibot.punishment.member.kick.noeededalltimecount > 0 && memberData.antibot.length > data.antibot.punishment.member.kick.noeededalltimecount)) &&
                            (!data.antibot.punishment.member.ban.enabled ||
                                ( // 1 Day check
                                    (data.antibot.punishment.member.ban.neededdaycount > 0 && memberData.antibot.filter(v => {
                                        return v - (Date.now() - 8640000000) > 0
                                    }).length < data.antibot.punishment.member.ban.neededdaycount) ||
                                    // 1 Week Check
                                    (data.antibot.punishment.member.ban.neededweekcount > 0 && memberData.antibot.filter(v => {
                                        return v - (Date.now() - 7 * 8640000000) > 0
                                    }).length < data.antibot.punishment.member.ban.neededweekcount) ||
                                    // 1 Month Check
                                    (data.antibot.punishment.member.ban.neededmonthcount > 0 && memberData.antibot.filter(v => {
                                        return v - (Date.now() - 30 * 8640000000) > 0
                                    }).length < data.antibot.punishment.member.ban.neededmonthcount) ||
                                    // All Time Check
                                    (data.antibot.punishment.member.ban.noeededalltimecount > 0 && memberData.antibot.length < data.antibot.punishment.member.ban.noeededalltimecount))
                            ) //Only do the kick if no ban is enabled or if he doesnt have enough counts for getting banned
                        ) {
                            // Kick the BOT
                            try {
                                if (!data.antibot.punishment.bot.ban && data.antibot.punishment.bot.kick) {
                                    // If there is a logger enabled then log the data
                                    if (data.all.logger && data.all.logger.length > 5) {
                                        try {
                                            let ch = member.guild.channels.cache.get(data.all.logger);
                                            if (ch && ch.isSendable()) {
                                                ch.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor("Green")
                                                        .setAuthor({
                                                            name: `ANTI BOT - I Kicked: ${member.user.tag}`,
                                                            iconURL: `https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png`
                                                        })
                                                        .setThumbnail(member.user.displayAvatarURL())
                                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable16"]))
                                                    ]
                                                }).catch(() => { });
                                            }
                                        } catch (e) {
                                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                        }
                                    }

                                    // Kick the Bot
                                    member.kick(`Anti Bot - Added by: ${AddedUserID}`).catch((e) => {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    });
                                };

                                if (data.antibot.punishment.bot.ban) {
                                    // If there is a logger enabled then log the data
                                    if (data.all.logger && data.all.logger.length > 5) {
                                        try {
                                            let ch = member.guild.channels.cache.get(data.all.logger);
                                            if (ch && ch.isSendable()) {
                                                ch.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor("Green")
                                                        .setAuthor({
                                                            name: `ANTI BOT - I Banned: ${member.user.tag}`,
                                                            iconURL: `https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png`
                                                        })
                                                        .setThumbnail(member.user.displayAvatarURL())
                                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable17"]))
                                                    ]
                                                }).catch(() => { });
                                            }
                                        } catch (e) {
                                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                        }
                                    }

                                    // Ban the Bot
                                    member.ban({
                                        reason: `Anti Bot - Added by: ${AddedUserID}`
                                    }).catch((e) => {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    });
                                };
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            };

                            // Kick the Member
                            AddedMember.kick(`Anti Bot - Added Bot: ${member.user.id} | ${member.user.tag}`).then(member => {
                                //If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = member.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Blurple")
                                                    .setAuthor({
                                                        name: `ANTI ADD BOT - Kicked ${AddedMember.user.tag} for adding ${member.user.tag}`,
                                                        iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                    })
                                                    .setThumbnail(member.user.displayAvatarURL())
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable18"]))
                                                    .setFooter(client.getFooter(`ID: ${AddedUserID}`, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { });
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                };
                            }).catch((e) => {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            });
                        };

                        if (AddedMember.bannable && data.antibot.punishment.member.ban.enabled && ( //for 1 Day check
                            (data.antibot.punishment.member.ban.neededdaycount > 0 && memberData.antibot.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antibot.punishment.member.ban.neededdaycount) ||
                            //for 1 Week Check
                            (data.antibot.punishment.member.ban.neededweekcount > 0 && memberData.antibot.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antibot.punishment.member.ban.neededweekcount) ||
                            //for 1 Month Check
                            (data.antibot.punishment.member.ban.neededmonthcount > 0 && memberData.antibot.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antibot.punishment.member.ban.neededmonthcount) ||
                            //for All Time Check
                            (data.antibot.punishment.member.ban.noeededalltimecount > 0 && memberData.antibot.length > data.antibot.punishment.member.ban.noeededalltimecount))) {
                            // Kick the BOT
                            try {
                                if (!data.antibot.punishment.bot.ban && data.antibot.punishment.bot.kick) {
                                    // If there is a logger enabled then log the data
                                    if (data.all.logger && data.all.logger.length > 5) {
                                        try {
                                            let ch = member.guild.channels.cache.get(data.all.logger);
                                            if (ch && ch.isSendable()) {
                                                ch.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor("Green")
                                                        .setAuthor({
                                                            name: `ANTI BOT - I Kicked: ${member.user.tag}`,
                                                            iconURL: `https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png`
                                                        })
                                                        .setThumbnail(member.user.displayAvatarURL())
                                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable19"]))
                                                    ]
                                                }).catch(() => { });
                                            }
                                        } catch (e) {
                                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                        }
                                    }

                                    // Kick the Bot
                                    member.kick(`Anti Bot - Added by: ${AddedUserID}`).catch((e) => {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    });
                                };

                                if (data.antibot.punishment.bot.ban) {
                                    // If there is a logger enabled then log the data
                                    if (data.all.logger && data.all.logger.length > 5) {
                                        try {
                                            let ch = member.guild.channels.cache.get(data.all.logger);
                                            if (ch && ch.isSendable()) {
                                                ch.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor("Green")
                                                        .setAuthor({
                                                            name: `ANTI BOT - I Banned: ${member.user.tag}`,
                                                            iconURL: `https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png`
                                                        })
                                                        .setThumbnail(member.user.displayAvatarURL())
                                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable20"]))
                                                    ]
                                                }).catch(() => { });
                                            }
                                        } catch (e) {
                                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                        }
                                    }

                                    // Ban the Bot
                                    member.ban({
                                        reason: `Anti Bot - Added by: ${AddedUserID}`
                                    }).catch((e) => {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    });
                                };
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            };

                            // Ban the Member
                            AddedMember.ban({
                                reason: `Anti Bot - Added Bot: ${member.user.id} | ${member.user.tag}`
                            })
                                .then(member => {
                                    //If there is the logger enabled, send information
                                    if (data.all.logger && data.all.logger.length > 5) {
                                        try {
                                            let ch = member.guild.channels.cache.get(data.all.logger);
                                            if (ch && ch.isSendable()) {
                                                ch.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor("Blurple")
                                                        .setAuthor({
                                                            name: `ANTI ADD BOT - Banned ${AddedMember.user.tag} for adding ${member.user.tag}`,
                                                            iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                        })
                                                        .setThumbnail(member.user.displayAvatarURL())
                                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable21"]))
                                                        .setFooter(client.getFooter(`ID: ${AddedUserID}`, AddedMember.user.displayAvatarURL()))
                                                    ]
                                                }).catch(() => { });
                                            }
                                        } catch (e) {
                                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                        }
                                    };
                                })
                                .catch((e) => {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                });
                        }
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                    }
                }
            }
        } catch (e) {
            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
        }
    });

    // Anti Kick
    client.on("guildMemberRemove", async (member) => {
        try {
            if (!member.guild) return;
            simple_databasing(client, member.guild.id);

            let ls = client.settings.get(member.guild.id, "language");

            const eventsTimestamp = Date.now().toString();

            antinuke_databasing(member.guild.id);
            let data = client.Anti_Nuke_System.get(member.guild.id);
            if (!data.all.enabled || !data.antideleteuser.enabled) return;

            if (!member.guild.members.me) return;
            if (!member.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    let ch = member.guild.channels.cache.get(data.all.logger);
                    if (ch && ch.isSendable()) {
                        ch.send({
                            embeds: [new EmbedBuilder()
                                .setColor("Yellow")
                                .setAuthor({
                                    name: `This is a Warn`,
                                    iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                })
                                .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                            ]
                        }).catch(() => { })
                    }
                    return;
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                    return;
                }
            };

            let AuditData = await member.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberKick,
            }).then((audit => {
                return audit.entries.first()
            })).catch((e) => {
                //send information
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = member.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable23"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable24"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });


            if (!AuditData) return;
            let AddedUserID = AuditData?.executor?.id ?? "";
            let LogTimeString = AuditData.createdTimestamp.toString();

            const EventExecution = eventsTimestamp;
            const logtime = LogTimeString.slice(0, -3);
            const eventtime = EventExecution.slice(0, -3);

            if (logtime !== eventtime) return;
            if (!client.user) return;
            if (AddedUserID == client.user.id) return;

            let AddedMember = await member.guild.members.fetch(AddedUserID).catch((e) => {
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = member.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable26"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable27"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            if (AddedMember) {
                if (!AddedMember.guild.members.me) return;

                // If guild owner, he is whitelisted
                if (AddedUserID == AddedMember.guild.ownerId) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI KICK - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable28"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // If his highest role is above mine, he is whitelisted
                if (AddedMember.roles.cache.size > 0 && AddedMember.guild.members.me.roles.cache.size > 0 && AddedMember.roles.highest.rawPosition >= AddedMember.guild.members.me.roles.highest.rawPosition) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI KICK - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable29"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // All Whitelist is above Module Whitelist
                if (data.all.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI KICK - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable30"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.all.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI KICK - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable31"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // Module Whitelist Checker
                if (data.antideleteuser.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI KICK - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable32"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.antideleteuser.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI KICK - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable33"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // Ensure the Data
                usr_antinuke_databasing(member.guild.id + AddedMember.id);
                let memberData = client.Anti_Nuke_System.get(member.guild.id + AddedMember.id);
                //increment the stats
                client.Anti_Nuke_System.push(member.guild.id + AddedMember.id, Date.now(), "antideleteuser")
                memberData = client.Anti_Nuke_System.get(member.guild.id + AddedMember.id);
                try {
                    if (data.antideleteuser.punishment.member.removeroles.enabled &&
                        ( // 1 Day check
                            (data.antideleteuser.punishment.member.removeroles.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.removeroles.neededdaycount) ||
                            // 1 Week Check
                            (data.antideleteuser.punishment.member.removeroles.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.removeroles.neededweekcount) ||
                            // 1 Month Check
                            (data.antideleteuser.punishment.member.removeroles.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.removeroles.neededmonthcount) ||
                            // All Time Check
                            (data.antideleteuser.punishment.member.removeroles.noeededalltimecount > 0 && memberData.antideleteuser.length > data.antideleteuser.punishment.member.removeroles.noeededalltimecount))
                    ) {
                        //Remove his/her roles
                        let roles2set: string[] = [];
                        if (data.all.quarantine && data.all.quarantine.length > 5) {
                            try {
                                let therole = AddedMember.guild.roles.cache.get(data.all.quarantine);
                                if (therole && therole.id) {
                                    roles2set.push(therole.id)
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        };

                        AddedMember.roles.set(roles2set).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = member.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Blurple")
                                                .setAuthor({
                                                    name: `ANTI KICK - Removed Roles of ${AddedMember.user.tag} for kicking ${member.user.tag}`,
                                                    iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                })
                                                .setThumbnail(member.user.displayAvatarURL())
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable34"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch(() => { });
                    }

                    //Kick Member (Punishment 4)
                    if (AddedMember.kickable && data.antideleteuser.punishment.member.kick.enabled &&
                        ( // 1 Day check
                            (data.antideleteuser.punishment.member.kick.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.kick.neededdaycount) ||
                            // 1 Week Check
                            (data.antideleteuser.punishment.member.kick.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.kick.neededweekcount) ||
                            // 1 Month Check
                            (data.antideleteuser.punishment.member.kick.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.kick.neededmonthcount) ||
                            // All Time Check
                            (data.antideleteuser.punishment.member.kick.noeededalltimecount > 0 && memberData.antideleteuser.length > data.antideleteuser.punishment.member.kick.noeededalltimecount)) &&
                        (!data.antideleteuser.punishment.member.ban.enabled ||
                            ( // 1 Day check
                                (data.antideleteuser.punishment.member.ban.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length < data.antideleteuser.punishment.member.ban.neededdaycount) ||
                                // 1 Week Check
                                (data.antideleteuser.punishment.member.ban.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length < data.antideleteuser.punishment.member.ban.neededweekcount) ||
                                // 1 Month Check
                                (data.antideleteuser.punishment.member.ban.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length < data.antideleteuser.punishment.member.ban.neededmonthcount) ||
                                // All Time Check
                                (data.antideleteuser.punishment.member.ban.noeededalltimecount > 0 && memberData.antideleteuser.length < data.antideleteuser.punishment.member.ban.noeededalltimecount))
                        ) //Only do the kick if no ban is enabled or if he doesnt have enough counts for getting banned
                    ) {
                        //Kick the Member
                        AddedMember.kick(`Anti Kick - He/She kicked: ${member.user.id} | ${member.user.tag}`).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = member.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Orange")
                                                .setAuthor({
                                                    name: `ANTI KICK - Kicked ${AddedMember.user.tag} for kicking ${member.user.tag}`,
                                                    iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                })
                                                .setThumbnail(member.user.displayAvatarURL())
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable35"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch((e) => {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        });
                    };

                    if (AddedMember.bannable && data.antideleteuser.punishment.member.ban.enabled && ( //for 1 Day check
                        (data.antideleteuser.punishment.member.ban.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                            return v - (Date.now() - 8640000000) > 0
                        }).length > data.antideleteuser.punishment.member.ban.neededdaycount) ||
                        // 1 Week Check
                        (data.antideleteuser.punishment.member.ban.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                            return v - (Date.now() - 7 * 8640000000) > 0
                        }).length > data.antideleteuser.punishment.member.ban.neededweekcount) ||
                        // 1 Month Check
                        (data.antideleteuser.punishment.member.ban.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                            return v - (Date.now() - 30 * 8640000000) > 0
                        }).length > data.antideleteuser.punishment.member.ban.neededmonthcount) ||
                        // All Time Check
                        (data.antideleteuser.punishment.member.ban.noeededalltimecount > 0 && memberData.antideleteuser.length > data.antideleteuser.punishment.member.ban.noeededalltimecount))) {

                        //Ban the Member
                        AddedMember.ban({
                            reason: `Anti Kick - He/She kicked: ${member.user.id} | ${member.user.tag}`
                        })
                            .then(member => {
                                //If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = member.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setAuthor({
                                                        name: `ANTI KICK - Banned ${AddedMember.user.tag} for kicking ${member.user.tag}`,
                                                        iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                    })
                                                    .setThumbnail(member.user.displayAvatarURL())
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable36"]))
                                                    .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                            })
                            .catch((e) => {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            });
                    }
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                }
            }
        } catch (e) {
            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
        }
    });

    // Anti Ban
    client.on("guildMemberRemove", async (member) => {
        try {
            if (!member.guild) return;
            simple_databasing(client, member.guild.id);

            let ls = client.settings.get(member.guild.id, "language");
            const eventsTimestamp = Date.now().toString();

            antinuke_databasing(member.guild.id);
            let data = client.Anti_Nuke_System.get(member.guild.id);

            if (!data.all.enabled || !data.antideleteuser.enabled) return;
            if (!member.guild.members.me) return;

            if (!member.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    let ch = member.guild.channels.cache.get(data.all.logger);
                    if (ch && ch.isSendable()) {
                        ch.send({
                            embeds: [new EmbedBuilder()
                                .setColor("Yellow")
                                .setAuthor({
                                    name: `This is a Warn`,
                                    iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                })
                                .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                            ]
                        }).catch(() => { })
                    }

                    return;
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                    return;
                }
            }
            let AuditData = await member.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd,
            }).then((audit => {
                return audit.entries.first()
            })).catch((e) => {

                //send information
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = member.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable38"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable39"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            })

            if (!AuditData) return;

            let AddedUserID = AuditData?.executor?.id ?? "";
            let LogTimeString = AuditData.createdTimestamp.toString();

            const EventExecution = eventsTimestamp;

            const logtime = LogTimeString.slice(0, -3);
            const eventtime = EventExecution.slice(0, -3);

            if (logtime !== eventtime) return;
            if (!client.user) return;
            if (AddedUserID == client.user.id) return;

            let AddedMember = await member.guild.members.fetch(AddedUserID).catch((e) => {
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = member.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable41"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable42"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            if (AddedMember) {
                // If Guild Owner (Whitelisted)
                if (AddedUserID == AddedMember.guild.ownerId) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI BAN - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable43"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // If his highest role is above mine (Whitelisted)
                if (!AddedMember.guild.members.me) return;
                if (AddedMember.roles.cache.size > 0 && AddedMember.guild.members.me.roles.cache.size > 0 && AddedMember.roles.highest.rawPosition >= AddedMember.guild.members.me.roles.highest.rawPosition) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI BAN - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable44"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // All Whitelist above Module
                if (data.all.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI BAN - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable45"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.all.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI BAN - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable46"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (data.antideleteuser.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI BAN - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable47"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.antideleteuser.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = member.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI BAN - ${AddedMember.user.tag} kicked ${member.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable48"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // Ensure the Data
                usr_antinuke_databasing(member.guild.id + AddedMember.id);
                let memberData = client.Anti_Nuke_System.get(member.guild.id + AddedMember.id);

                // Increase the Stats
                client.Anti_Nuke_System.push(member.guild.id + AddedMember.id, Date.now(), "antideleteuser");
                memberData = client.Anti_Nuke_System.get(member.guild.id + AddedMember.id);

                try {
                    if (data.antideleteuser.punishment.member.removeroles.enabled &&
                        ( // 1 Day check
                            (data.antideleteuser.punishment.member.removeroles.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.removeroles.neededdaycount) ||
                            // 1 Week Check
                            (data.antideleteuser.punishment.member.removeroles.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.removeroles.neededweekcount) ||
                            // 1 Month Check
                            (data.antideleteuser.punishment.member.removeroles.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.removeroles.neededmonthcount) ||
                            // All Time Check
                            (data.antideleteuser.punishment.member.removeroles.noeededalltimecount > 0 && memberData.antideleteuser.length > data.antideleteuser.punishment.member.removeroles.noeededalltimecount))
                    ) {
                        // Remove his/her roles
                        let roles2set: string[] = [];
                        if (data.all.quarantine && data.all.quarantine.length > 5) {
                            try {
                                let therole = AddedMember.guild.roles.cache.get(data.all.quarantine);
                                if (therole && therole.id) {
                                    roles2set.push(therole.id)
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        };

                        AddedMember.roles.set(roles2set).then(member => {
                            // If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = member.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Blurple")
                                                .setAuthor({
                                                    name: `ANTI BAN - Removed Roles of ${AddedMember.user.tag} for banning ${member.user.tag}`,
                                                    iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                })
                                                .setThumbnail(member.user.displayAvatarURL())
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable49"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch(() => { });
                    };

                    // Kick Member (Punishment 4)
                    if (AddedMember.kickable && data.antideleteuser.punishment.member.kick.enabled &&
                        ( // 1 Day check
                            (data.antideleteuser.punishment.member.kick.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.kick.neededdaycount) ||
                            // 1 Week Check
                            (data.antideleteuser.punishment.member.kick.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.kick.neededweekcount) ||
                            // 1 Month Check
                            (data.antideleteuser.punishment.member.kick.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antideleteuser.punishment.member.kick.neededmonthcount) ||
                            // All Time Check
                            (data.antideleteuser.punishment.member.kick.noeededalltimecount > 0 && memberData.antideleteuser.length > data.antideleteuser.punishment.member.kick.noeededalltimecount)) &&
                        (!data.antideleteuser.punishment.member.ban.enabled ||
                            ( // 1 Day check
                                (data.antideleteuser.punishment.member.ban.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length < data.antideleteuser.punishment.member.ban.neededdaycount) ||
                                // 1 Week Check
                                (data.antideleteuser.punishment.member.ban.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length < data.antideleteuser.punishment.member.ban.neededweekcount) ||
                                // 1 Month Check
                                (data.antideleteuser.punishment.member.ban.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length < data.antideleteuser.punishment.member.ban.neededmonthcount) ||
                                // All Time Check
                                (data.antideleteuser.punishment.member.ban.noeededalltimecount > 0 && memberData.antideleteuser.length < data.antideleteuser.punishment.member.ban.noeededalltimecount))
                        ) // Only do the kick if no ban is enabled or if he doesnt have enough counts for getting banned
                    ) {
                        //Kick the Member
                        AddedMember.kick(`Anti Ban - He/She banned: ${member.user.id} | ${member.user.tag}`).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = member.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Orange")
                                                .setAuthor({
                                                    name: `ANTI BAN - Kicked ${AddedMember.user.tag} for banning ${member.user.tag}`,
                                                    iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                })
                                                .setThumbnail(member.user.displayAvatarURL())
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable50"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch((e) => {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        });
                    };

                    if (AddedMember.bannable && data.antideleteuser.punishment.member.ban.enabled && ( // 1 Day check
                        (data.antideleteuser.punishment.member.ban.neededdaycount > 0 && memberData.antideleteuser.filter(v => {
                            return v - (Date.now() - 8640000000) > 0
                        }).length > data.antideleteuser.punishment.member.ban.neededdaycount) ||
                        // 1 Week Check
                        (data.antideleteuser.punishment.member.ban.neededweekcount > 0 && memberData.antideleteuser.filter(v => {
                            return v - (Date.now() - 7 * 8640000000) > 0
                        }).length > data.antideleteuser.punishment.member.ban.neededweekcount) ||
                        // 1 Month Check
                        (data.antideleteuser.punishment.member.ban.neededmonthcount > 0 && memberData.antideleteuser.filter(v => {
                            return v - (Date.now() - 30 * 8640000000) > 0
                        }).length > data.antideleteuser.punishment.member.ban.neededmonthcount) ||
                        // All Time Check
                        (data.antideleteuser.punishment.member.ban.noeededalltimecount > 0 && memberData.antideleteuser.length > data.antideleteuser.punishment.member.ban.noeededalltimecount))) {

                        // Ban the Member
                        AddedMember.ban({
                            reason: `Anti Ban - He/She banned: ${member.user.id} | ${member.user.tag}`
                        })
                            .then(member => {
                                //If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = member.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setAuthor({
                                                        name: `ANTI BAN - Banned ${AddedMember.user.tag} for banning ${member.user.tag}`,
                                                        iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                    })
                                                    .setThumbnail(member.user.displayAvatarURL())
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable51"]))
                                                    .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                            })
                            .catch((e) => {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            });
                    }
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                }
            }
        } catch (e) {
            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
        }
    });

    // Auto Add Anti Nuke Role
    client.on("channelCreate", async (channel) => {
        if (!channel.guild) return;
        simple_databasing(client, channel.guild.id);

        let ls = client.settings.get(channel.guild.id, "language");
        antinuke_databasing(channel.guild.id);

        let data = client.Anti_Nuke_System.get(channel.guild.id);
        if (!data || !data.all) return;

        if (!channel.guild.members.me) return;

        if (data.all.quarantine && data.all.quarantine.length > 5) {
            try {
                let therole = channel.guild.roles.cache.get(data.all.quarantine);
                if (therole && therole.id) {
                    try {
                        if (channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.ManageChannels)) {
                            channel.permissionOverwrites.edit(therole.id, {
                                ViewChannel: false,
                                SendMessages: false,
                                AddReactions: false,
                                Connect: false,
                                Speak: false
                            });
                        }
                    } catch (e) {
                        console.log(chalk.grey.red(String(e.stack)));
                    }
                }
            } catch (e) {
                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
            }
        }
    });

    // Anti Channel Create
    client.on("channelCreate", async (channel) => {
        try {
            if (!channel.guild) return;
            simple_databasing(client, channel.guild.id);

            let ls = client.settings.get(channel.guild.id, "language");
            const eventsTimestamp = Date.now().toString();

            if (!channel.guild) return;
            antinuke_databasing(channel.guild.id);

            let data = client.Anti_Nuke_System.get(channel.guild.id);
            if (!data.all.enabled || !data.antichannelcreate.enabled) return;
            if (!channel.guild.members.me) return;

            if (!channel.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) && !channel.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    let ch = channel.guild.channels.cache.get(data.all.logger);
                    if (ch && ch.isSendable()) {
                        ch.send({
                            embeds: [new EmbedBuilder()
                                .setColor("Yellow")
                                .setAuthor({
                                    name: `This is a Warn`,
                                    iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                })
                                .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                            ]
                        }).catch(() => { })
                    }
                    return;
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                    return;
                }
            };

            let AuditData = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelCreate,
            }).then((audit => {
                return audit.entries.first()
            })).catch((e) => {
                // Send Information
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = channel.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable53"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable54"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                };

                return;
            });

            let AddedUserID = AuditData?.executor?.id ?? "";
            let LogTimeString = AuditData?.createdTimestamp.toString();

            const EventExecution = eventsTimestamp;

            const logtime = LogTimeString?.slice(0, -3);
            const eventtime = EventExecution.slice(0, -3);
            if (logtime !== eventtime) return;

            if (!client.user) return;
            if (AddedUserID == client.user.id) return;

            let AddedMember = await channel.guild.members.fetch(AddedUserID).catch((e) => {
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = channel.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable56"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable57"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            if (AddedMember) {
                // If guild owner (Whitelisted)
                if (AddedUserID == AddedMember.guild.ownerId) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL CREATE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable58"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // If his highest role is above mine (Whitelisted)
                if (!AddedMember.guild.members.me) return;
                if (AddedMember.roles.cache.size > 0 && AddedMember.guild.members.me.roles.cache.size > 0 && AddedMember.roles.highest.rawPosition >= AddedMember.guild.members.me.roles.highest.rawPosition) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL CREATE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable59"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // All Whitelist above Module
                if (data.all.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL CREATE - ${AddedMember.user.tag} created ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable60"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.all.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL CREATE - ${AddedMember.user.tag} created ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable61"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (data.antichannelcreate.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL CREATE - ${AddedMember.user.tag} created ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable62"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.antichannelcreate.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL CREATE - ${AddedMember.user.tag} created ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable63"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // Ensure the Data
                usr_antinuke_databasing(channel.guild.id + AddedMember.id);
                let memberData = client.Anti_Nuke_System.get(channel.guild.id + AddedMember.id);

                // Increase the Stats
                client.Anti_Nuke_System.push(channel.guild.id + AddedMember.id, Date.now(), "antichannelcreate")
                memberData = client.Anti_Nuke_System.get(channel.guild.id + AddedMember.id);

                try {
                    if (data.antichannelcreate.punishment.member.removeroles.enabled &&
                        ( // 1 Day check
                            (data.antichannelcreate.punishment.member.removeroles.neededdaycount > 0 && memberData.antichannelcreate.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antichannelcreate.punishment.member.removeroles.neededdaycount) ||
                            // 1 Week Check
                            (data.antichannelcreate.punishment.member.removeroles.neededweekcount > 0 && memberData.antichannelcreate.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antichannelcreate.punishment.member.removeroles.neededweekcount) ||
                            // 1 Month Check
                            (data.antichannelcreate.punishment.member.removeroles.neededmonthcount > 0 && memberData.antichannelcreate.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antichannelcreate.punishment.member.removeroles.neededmonthcount) ||
                            // All Time Check
                            (data.antichannelcreate.punishment.member.removeroles.noeededalltimecount > 0 && memberData.antichannelcreate.length > data.antichannelcreate.punishment.member.removeroles.noeededalltimecount)
                        )
                    ) {
                        try {
                            if (data.antichannelcreate.punishment.deletecreatedchannel) {
                                //if there is a logger enabled then log the data
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = channel.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Green")
                                                    .setAuthor({
                                                        name: `ANTI CHANNEL-CREATE - I Delete: ${channel.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable64"]))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }

                                // Kick the Bot
                                channel.delete(`ANTI CHANNEL CREATE - Created by: ${AddedUserID}`).catch((e) => {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                });
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                        //Remove his/her roles
                        let roles2set: string[] = [];
                        if (data.all.quarantine && data.all.quarantine.length > 5) {
                            try {
                                let therole = AddedMember.guild.roles.cache.get(data.all.quarantine);
                                if (therole && therole.id) {
                                    roles2set.push(therole.id)
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        }
                        AddedMember.roles.set(roles2set).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = channel.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Blurple")
                                                .setAuthor({
                                                    name: `ANTI CHANNEL CREATE - Removed Roles of ${AddedMember.user.tag} for creating ${channel.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable65"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch(() => { })
                    };

                    // Kick Member (Punishment 4)
                    if (AddedMember.kickable && data.antichannelcreate.punishment.member.kick.enabled &&
                        ( // 1 Day check
                            (data.antichannelcreate.punishment.member.kick.neededdaycount > 0 && memberData.antichannelcreate.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antichannelcreate.punishment.member.kick.neededdaycount) ||
                            // 1 Week Check
                            (data.antichannelcreate.punishment.member.kick.neededweekcount > 0 && memberData.antichannelcreate.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antichannelcreate.punishment.member.kick.neededweekcount) ||
                            // 1 Month Check
                            (data.antichannelcreate.punishment.member.kick.neededmonthcount > 0 && memberData.antichannelcreate.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antichannelcreate.punishment.member.kick.neededmonthcount) ||
                            // All Time Check
                            (data.antichannelcreate.punishment.member.kick.noeededalltimecount > 0 && memberData.antichannelcreate.length > data.antichannelcreate.punishment.member.kick.noeededalltimecount)) &&
                        (!data.antichannelcreate.punishment.member.ban.enabled ||
                            ( // 1 Day check
                                (data.antichannelcreate.punishment.member.ban.neededdaycount > 0 && memberData.antichannelcreate.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length < data.antichannelcreate.punishment.member.ban.neededdaycount) ||
                                // 1 Week Check
                                (data.antichannelcreate.punishment.member.ban.neededweekcount > 0 && memberData.antichannelcreate.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length < data.antichannelcreate.punishment.member.ban.neededweekcount) ||
                                // 1 Month Check
                                (data.antichannelcreate.punishment.member.ban.neededmonthcount > 0 && memberData.antichannelcreate.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length < data.antichannelcreate.punishment.member.ban.neededmonthcount) ||
                                // All Time Check
                                (data.antichannelcreate.punishment.member.ban.noeededalltimecount > 0 && memberData.antichannelcreate.length < data.antichannelcreate.punishment.member.ban.noeededalltimecount))
                        ) //Only do the kick if no ban is enabled or if he doesnt have enough counts for getting banned
                    ) {
                        try {
                            if (data.antichannelcreate.punishment.deletecreatedchannel) {
                                //if there is a logger enabled then log the data
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = channel.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Green")
                                                    .setAuthor({
                                                        name: `ANTI CHANNEL-CREATE - I Delete: ${channel.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable66"]))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                                //kick the Bot
                                channel.delete(`ANTI CHANNEL CREATE - Created by: ${AddedUserID}`).catch((e) => {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                });
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }

                        //Kick the Member
                        AddedMember.kick(`ANTI CHANNEL CREATE - He created: ${channel.id} | ${channel.name}`).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = channel.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Orange")
                                                .setAuthor({
                                                    name: `ANTI CHANNEL CREATE - Kicked ${AddedMember.user.tag} for creating ${channel.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable67"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch((e) => {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        });
                    };

                    if (AddedMember.bannable && data.antichannelcreate.punishment.member.ban.enabled && ( // 1 Day check
                        (data.antichannelcreate.punishment.member.ban.neededdaycount > 0 && memberData.antichannelcreate.filter(v => {
                            return v - (Date.now() - 8640000000) > 0
                        }).length > data.antichannelcreate.punishment.member.ban.neededdaycount) ||
                        // 1 Week Check
                        (data.antichannelcreate.punishment.member.ban.neededweekcount > 0 && memberData.antichannelcreate.filter(v => {
                            return v - (Date.now() - 7 * 8640000000) > 0
                        }).length > data.antichannelcreate.punishment.member.ban.neededweekcount) ||
                        // 1 Month Check
                        (data.antichannelcreate.punishment.member.ban.neededmonthcount > 0 && memberData.antichannelcreate.filter(v => {
                            return v - (Date.now() - 30 * 8640000000) > 0
                        }).length > data.antichannelcreate.punishment.member.ban.neededmonthcount) ||
                        // All Time Check
                        (data.antichannelcreate.punishment.member.ban.noeededalltimecount > 0 && memberData.antichannelcreate.length > data.antichannelcreate.punishment.member.ban.noeededalltimecount))) {

                        try {
                            if (data.antichannelcreate.punishment.deletecreatedchannel) {
                                //if there is a logger enabled then log the data
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = channel.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Green")
                                                    .setAuthor({
                                                        name: `ANTI CHANNEL-CREATE - I Delete: ${channel.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable68"]))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                };

                                // Kick the Bot
                                channel.delete(`ANTI CHANNEL CREATE - Created by: ${AddedUserID}`).catch((e) => {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                });
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        };

                        //Ban the Member
                        AddedMember.ban({
                            reason: `ANTI CHANNEL CREATE - He created: ${channel.id} | ${channel.name}`
                        })
                            .then(member => {
                                // If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = channel.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setAuthor({
                                                        name: `ANTI CHANNEL CREATE - Banned ${AddedMember.user.tag} for creating ${channel.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable69"]))
                                                    .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                            })
                            .catch((e) => {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            });
                    }

                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                }
            }
        } catch (e) {
            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
        }
    });

    // Anti Channel Delete
    client.on("channelDelete", async (channel) => {
        try {
            if (channel.isDMBased()) return;

            if (!channel.guild) return;
            simple_databasing(client, channel.guild.id);

            let ls = client.settings.get(channel.guild.id, "language");
            const eventsTimestamp = Date.now().toString();

            antinuke_databasing(channel.guild.id);
            let data = client.Anti_Nuke_System.get(channel.guild.id);

            if (!data.all.enabled || !data.antichanneldelete.enabled) return;
            if (!channel.guild.members.me) return;

            if (!channel.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) && !channel.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    let ch = channel.guild.channels.cache.get(data.all.logger);
                    if (ch && ch.isSendable()) {
                        ch.send({
                            embeds: [new EmbedBuilder()
                                .setColor("Yellow")
                                .setAuthor({
                                    name: `This is a Warn`,
                                    iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                })
                                .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                            ]
                        }).catch(() => { })
                    }
                    return;
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                    return;
                }
            };

            let AuditData = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelDelete,
            }).then((audit => {
                return audit.entries.first()
            })).catch((e) => {
                // Send Information
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = channel.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable71"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable72"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            let AddedUserID = AuditData?.executor?.id ?? "";
            let LogTimeString = AuditData?.createdTimestamp.toString();

            const EventExecution = eventsTimestamp;
            const logtime = LogTimeString?.slice(0, -3);
            const eventtime = EventExecution.slice(0, -3);
            if (logtime !== eventtime) return;

            if (!client.user) return;

            if (AddedUserID == client.user.id) return console.log("I AM THE DELETER - NO ANTI");

            let AddedMember = await channel.guild.members.fetch(AddedUserID).catch((e) => {
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = channel.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable74"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable75"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            if (AddedMember) {
                // If Guild Owner (Whitelisted)
                if (AddedUserID == AddedMember.guild.ownerId) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL DELETE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable76"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // If his highest role is above mine (Whitelisted)
                if (!AddedMember.guild.members.me) return;
                if (AddedMember.roles.cache.size > 0 && AddedMember.guild.members.me.roles.cache.size > 0 && AddedMember.roles.highest.rawPosition >= AddedMember.guild.members.me.roles.highest.rawPosition) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL DELETE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable77"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                }

                // All Whitelist above Module
                if (data.all.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL DELETE - ${AddedMember.user.tag} delete ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable78"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.all.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL DELETE - ${AddedMember.user.tag} delete ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable79"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (data.antichanneldelete.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL DELETE - ${AddedMember.user.tag} delete ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable80"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.antichanneldelete.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = channel.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI CHANNEL DELETE - ${AddedMember.user.tag} delete ${channel.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable81"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // Ensure the Data
                usr_antinuke_databasing(channel.guild.id + AddedMember.id);
                let memberData = client.Anti_Nuke_System.get(channel.guild.id + AddedMember.id);

                // Increase the stats
                client.Anti_Nuke_System.push(channel.guild.id + AddedMember.id, Date.now(), "antichanneldelete")
                memberData = client.Anti_Nuke_System.get(channel.guild.id + AddedMember.id);

                try {
                    if (data.antichanneldelete.punishment.member.removeroles.enabled &&
                        ( // 1 Day check
                            (data.antichanneldelete.punishment.member.removeroles.neededdaycount > 0 && memberData.antichanneldelete.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antichanneldelete.punishment.member.removeroles.neededdaycount) ||
                            // 1 Week Check
                            (data.antichanneldelete.punishment.member.removeroles.neededweekcount > 0 && memberData.antichanneldelete.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antichanneldelete.punishment.member.removeroles.neededweekcount) ||
                            // 1 Month Check
                            (data.antichanneldelete.punishment.member.removeroles.neededmonthcount > 0 && memberData.antichanneldelete.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antichanneldelete.punishment.member.removeroles.neededmonthcount) ||
                            // All Time Check
                            (data.antichanneldelete.punishment.member.removeroles.noeededalltimecount > 0 && memberData.antichanneldelete.length > data.antichanneldelete.punishment.member.removeroles.noeededalltimecount))
                    ) {
                        // Remove his/her roles
                        let roles2set: string[] = [];
                        if (data.all.quarantine && data.all.quarantine.length > 5) {
                            try {
                                let therole = AddedMember.guild.roles.cache.get(data.all.quarantine);
                                if (therole && therole.id) {
                                    roles2set.push(therole.id)
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        };

                        AddedMember.roles.set(roles2set).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = channel.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Blurple")
                                                .setAuthor({
                                                    name: `ANTI CHANNEL DELETE - Removed Roles of ${AddedMember.user.tag} for deleting ${channel.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable82"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch(() => { })
                    };

                    // Kick Member (Punishment 4)
                    if (AddedMember.kickable && data.antichanneldelete.punishment.member.kick.enabled &&
                        ( // 1 Day check
                            (data.antichanneldelete.punishment.member.kick.neededdaycount > 0 && memberData.antichanneldelete.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antichanneldelete.punishment.member.kick.neededdaycount) ||
                            // 1 Week Check
                            (data.antichanneldelete.punishment.member.kick.neededweekcount > 0 && memberData.antichanneldelete.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antichanneldelete.punishment.member.kick.neededweekcount) ||
                            // 1 Month Check
                            (data.antichanneldelete.punishment.member.kick.neededmonthcount > 0 && memberData.antichanneldelete.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antichanneldelete.punishment.member.kick.neededmonthcount) ||
                            // All Time Check
                            (data.antichanneldelete.punishment.member.kick.noeededalltimecount > 0 && memberData.antichanneldelete.length > data.antichanneldelete.punishment.member.kick.noeededalltimecount)) &&
                        (!data.antichanneldelete.punishment.member.ban.enabled ||
                            ( // 1 Day check
                                (data.antichanneldelete.punishment.member.ban.neededdaycount > 0 && memberData.antichanneldelete.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length < data.antichanneldelete.punishment.member.ban.neededdaycount) ||
                                // 1 Week Check
                                (data.antichanneldelete.punishment.member.ban.neededweekcount > 0 && memberData.antichanneldelete.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length < data.antichanneldelete.punishment.member.ban.neededweekcount) ||
                                // 1 Month Check
                                (data.antichanneldelete.punishment.member.ban.neededmonthcount > 0 && memberData.antichanneldelete.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length < data.antichanneldelete.punishment.member.ban.neededmonthcount) ||
                                // All Time Check
                                (data.antichanneldelete.punishment.member.ban.noeededalltimecount > 0 && memberData.antichanneldelete.length < data.antichanneldelete.punishment.member.ban.noeededalltimecount))
                        ) //O nly do the kick if no ban is enabled or if he doesnt have enough counts for getting banned
                    ) {
                        // Kick the Member
                        AddedMember.kick(`Anti CHANNEL DELETE - He created: ${channel.id} | ${channel.name}`).then(member => {
                            // If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = channel.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Orange")
                                                .setAuthor({
                                                    name: `ANTI CHANNEL DELETE - Kicked ${AddedMember.user.tag} for deleting ${channel.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable83"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch((e) => {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        });
                    };

                    if (AddedMember.bannable && data.antichanneldelete.punishment.member.ban.enabled && ( // 1 Day check
                        (data.antichanneldelete.punishment.member.ban.neededdaycount > 0 && memberData.antichanneldelete.filter(v => {
                            return v - (Date.now() - 8640000000) > 0
                        }).length > data.antichanneldelete.punishment.member.ban.neededdaycount) ||
                        // 1 Week Check
                        (data.antichanneldelete.punishment.member.ban.neededweekcount > 0 && memberData.antichanneldelete.filter(v => {
                            return v - (Date.now() - 7 * 8640000000) > 0
                        }).length > data.antichanneldelete.punishment.member.ban.neededweekcount) ||
                        // 1 Month Check
                        (data.antichanneldelete.punishment.member.ban.neededmonthcount > 0 && memberData.antichanneldelete.filter(v => {
                            return v - (Date.now() - 30 * 8640000000) > 0
                        }).length > data.antichanneldelete.punishment.member.ban.neededmonthcount) ||
                        // All Time Check
                        (data.antichanneldelete.punishment.member.ban.noeededalltimecount > 0 && memberData.antichanneldelete.length > data.antichanneldelete.punishment.member.ban.noeededalltimecount))) {
                        //Ban the Member
                        AddedMember.ban({
                            reason: `Anti CHANNEL DELETE - He deleting: ${channel.id} | ${channel.name}`
                        })
                            .then(member => {
                                //If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = channel.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setAuthor({
                                                        name: `ANTI CHANNEL DELETE - Banned ${AddedMember.user.tag} for deleting ${channel.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/samsung/395/exclamation-mark_2757.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable84"]))
                                                    .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                            })
                            .catch((e) => {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            });
                    };
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                }
            }
        } catch (e) {
            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
        }
    });

    // Anti Role Create
    client.on("roleCreate", async (role) => {
        try {
            if (!role.guild) return;

            simple_databasing(client, role.guild.id);
            antinuke_databasing(role.guild.id);
            let ls = client.settings.get(role.guild.id, "language");

            const eventsTimestamp = Date.now().toString()

            let data = client.Anti_Nuke_System.get(role.guild.id);

            if (!data.all.enabled || !data.anticreaterole.enabled) return;
            if (!role.guild.members.me) return;

            if (!role.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) && !role.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    let ch = role.guild.channels.cache.get(data.all.logger);
                    if (ch && ch.isSendable()) {
                        ch.send({
                            embeds: [new EmbedBuilder()
                                .setColor("Yellow")
                                .setAuthor({
                                    name: `This is a Warn`,
                                    iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                })
                                .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                            ]
                        }).catch(() => { })
                    }
                    return;
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                    return;
                }
            };

            let AuditData = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleCreate,
            }).then((audit => {
                return audit.entries.first()
            })).catch((e) => {

                //send information
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = role.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable86"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable87"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });


            let AddedUserID = AuditData?.executor?.id ?? "";
            let LogTimeString = AuditData?.createdTimestamp.toString();

            const EventExecution = eventsTimestamp;
            const logtime = LogTimeString?.slice(0, -3);
            const eventtime = EventExecution.slice(0, -3);
            if (logtime !== eventtime) return;

            if (!client.user) return;
            if (AddedUserID == client.user.id) return;

            let AddedMember = await role.guild.members.fetch(AddedUserID).catch((e) => {
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = role.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable89"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable90"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            if (AddedMember) {
                // If Guild Owner, (Whitelisted)
                if (AddedUserID == AddedMember.guild.ownerId) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE CREATE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable91"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // If his highest role is above mine (Whitelisted)
                if (!AddedMember.guild.members.me) return;
                if (AddedMember.roles.cache.size > 0 && AddedMember.guild.members.me.roles.cache.size > 0 && AddedMember.roles.highest.rawPosition >= AddedMember.guild.members.me.roles.highest.rawPosition) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE CREATE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable92"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                //all whitelist above module
                if (data.all.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE CREATE - ${AddedMember.user.tag} created ${role.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable93"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.all.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE CREATE - ${AddedMember.user.tag} created ${role.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable94"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (data.anticreaterole.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE CREATE - ${AddedMember.user.tag} created ${role.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable95"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.anticreaterole.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE CREATE - ${AddedMember.user.tag} created ${role.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable96"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // Ensure the Data
                usr_antinuke_databasing(role.guild.id + AddedMember.id);
                let memberData = client.Anti_Nuke_System.get(role.guild.id + AddedMember.id);

                // Increase the Stats
                client.Anti_Nuke_System.push(role.guild.id + AddedMember.id, Date.now(), "anticreaterole");
                memberData = client.Anti_Nuke_System.get(role.guild.id + AddedMember.id);

                try {
                    if (data.anticreaterole.punishment.member.removeroles.enabled &&
                        ( // 1 Day check
                            (data.anticreaterole.punishment.member.removeroles.neededdaycount > 0 && memberData.anticreaterole.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.anticreaterole.punishment.member.removeroles.neededdaycount) ||
                            // 1 Week Check
                            (data.anticreaterole.punishment.member.removeroles.neededweekcount > 0 && memberData.anticreaterole.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.anticreaterole.punishment.member.removeroles.neededweekcount) ||
                            // 1 Month Check
                            (data.anticreaterole.punishment.member.removeroles.neededmonthcount > 0 && memberData.anticreaterole.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.anticreaterole.punishment.member.removeroles.neededmonthcount) ||
                            // All Time Check
                            (data.anticreaterole.punishment.member.removeroles.noeededalltimecount > 0 && memberData.anticreaterole.length > data.anticreaterole.punishment.member.removeroles.noeededalltimecount))
                    ) {
                        try {
                            if (data.anticreaterole.punishment.removeaddedrole) {
                                // If there is a logger enabled then log the data
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = role.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Green")
                                                    .setAuthor({
                                                        name: `ANTI ROLE CREATE - I Deleted: ${role.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/check-mark_2714-fe0f.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable97"]))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }

                                // Kick the Bot
                                role.delete(`Anti ROLECREATE - Created by: ${AddedUserID}`).catch((e) => {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                });
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        };

                        // Remove his/her roles
                        let roles2set: string[] = [];
                        if (data.all.quarantine && data.all.quarantine.length > 5) {
                            try {
                                let therole = AddedMember.guild.roles.cache.get(data.all.quarantine);
                                if (therole && therole.id) {
                                    roles2set.push(therole.id)
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        };

                        AddedMember.roles.set(roles2set).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = role.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Blurple")
                                                .setAuthor({
                                                    name: `ANTI ROLE CREATE - Removed roles of ${member.user.tag} for creating ${role.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable98"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch(() => { })
                    };

                    //Kick Member (Punishment 4)
                    if (AddedMember.kickable && data.anticreaterole.punishment.member.kick.enabled &&
                        ( // 1 Day check
                            (data.anticreaterole.punishment.member.kick.neededdaycount > 0 && memberData.anticreaterole.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.anticreaterole.punishment.member.kick.neededdaycount) ||
                            // 1 Week Check
                            (data.anticreaterole.punishment.member.kick.neededweekcount > 0 && memberData.anticreaterole.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.anticreaterole.punishment.member.kick.neededweekcount) ||
                            // 1 Month Check
                            (data.anticreaterole.punishment.member.kick.neededmonthcount > 0 && memberData.anticreaterole.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.anticreaterole.punishment.member.kick.neededmonthcount) ||
                            // All Time Check
                            (data.anticreaterole.punishment.member.kick.noeededalltimecount > 0 && memberData.anticreaterole.length > data.anticreaterole.punishment.member.kick.noeededalltimecount)) &&
                        (!data.anticreaterole.punishment.member.ban.enabled ||
                            ( // 1 Day check
                                (data.anticreaterole.punishment.member.ban.neededdaycount > 0 && memberData.anticreaterole.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length < data.anticreaterole.punishment.member.ban.neededdaycount) ||
                                // 1 Week Check
                                (data.anticreaterole.punishment.member.ban.neededweekcount > 0 && memberData.anticreaterole.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length < data.anticreaterole.punishment.member.ban.neededweekcount) ||
                                //or 1 Month Check
                                (data.anticreaterole.punishment.member.ban.neededmonthcount > 0 && memberData.anticreaterole.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length < data.anticreaterole.punishment.member.ban.neededmonthcount) ||
                                //or All Time Check
                                (data.anticreaterole.punishment.member.ban.noeededalltimecount > 0 && memberData.anticreaterole.length < data.anticreaterole.punishment.member.ban.noeededalltimecount))
                        ) // Only do the kick if no ban is enabled or if he doesnt have enough counts for getting banned
                    ) {
                        try {
                            if (data.anticreaterole.punishment.removeaddedrole) {
                                // If there is a logger enabled then log the data
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = role.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Green")
                                                    .setAuthor({
                                                        name: `ANTI ROLE CREATE - I Deleted: ${role.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable99"]))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                                //kick the Bot
                                role.delete(`Anti ROLECREATE - Created by: ${AddedUserID}`).catch((e) => {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                });
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        };

                        //Kick the Member
                        AddedMember.kick(`ANTI ROLE CREATE - He/She created: ${role.id} | ${role.name}`).then(member => {
                            // If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = role.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Orange")
                                                .setAuthor({
                                                    name: `ANTI ROLE CREATE - Kicked ${AddedMember.user.tag} for creating ${role.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable100"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch((e) => {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        });
                    };

                    if (AddedMember.bannable && data.anticreaterole.punishment.member.ban.enabled && ( // 1 Day check
                        (data.anticreaterole.punishment.member.ban.neededdaycount > 0 && memberData.anticreaterole.filter(v => {
                            return v - (Date.now() - 8640000000) > 0
                        }).length > data.anticreaterole.punishment.member.ban.neededdaycount) ||
                        // 1 Week Check
                        (data.anticreaterole.punishment.member.ban.neededweekcount > 0 && memberData.anticreaterole.filter(v => {
                            return v - (Date.now() - 7 * 8640000000) > 0
                        }).length > data.anticreaterole.punishment.member.ban.neededweekcount) ||
                        // 1 Month Check
                        (data.anticreaterole.punishment.member.ban.neededmonthcount > 0 && memberData.anticreaterole.filter(v => {
                            return v - (Date.now() - 30 * 8640000000) > 0
                        }).length > data.anticreaterole.punishment.member.ban.neededmonthcount) ||
                        // All Time Check
                        (data.anticreaterole.punishment.member.ban.noeededalltimecount > 0 && memberData.anticreaterole.length > data.anticreaterole.punishment.member.ban.noeededalltimecount))) {
                        try {
                            if (data.anticreaterole.punishment.removeaddedrole) {
                                // If there is a logger enabled then log the data
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = role.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Green")
                                                    .setAuthor({
                                                        name: `ANTI ROLE CREATE - I Deleted: ${role.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable101"]))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                };

                                // Kick the Bot
                                role.delete(`Anti ROLECREATE - Created by: ${AddedUserID}`).catch((e) => {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                });
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        };

                        // Ban the Member
                        AddedMember.ban({
                            reason: `ANTI ROLE CREATE - He/She created: ${role.id} | ${role.name}`
                        })
                            .then(member => {
                                //If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = role.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setAuthor({
                                                        name: `ANTI ROLE CREATE - Banned ${AddedMember.user.tag} for creating ${role.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable102"]))
                                                    .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                            })
                            .catch((e) => {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            });
                    }
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                }
            }
        } catch (e) {
            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
        }
    });

    // Anti Role Delete
    client.on("roleDelete", async (role) => {
        try {
            simple_databasing(client, role.guild.id);
            let ls = client.settings.get(role.guild.id, "language");

            const eventsTimestamp = Date.now().toString()

            if (!role.guild) return

            antinuke_databasing(role.guild.id);
            let data = client.Anti_Nuke_System.get(role.guild.id)

            if (!data.all.enabled || !data.antideleterole.enabled) return;
            if (!role.guild.members.me) return;
            if (!role.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) && !role.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    let ch = role.guild.channels.cache.get(data.all.logger);
                    if (ch && ch.isSendable()) {
                        ch.send({
                            embeds: [new EmbedBuilder()
                                .setColor("Yellow")
                                .setAuthor({
                                    name: `This is a Warn`,
                                    iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                })
                                .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable2"]))
                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable3"]))
                            ]
                        }).catch(() => { })
                    }
                    return;
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                    return;
                }
            };

            let AuditData = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleDelete,
            }).then((audit => {
                return audit.entries.first()
            })).catch((e) => {

                //send information
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = role.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable104"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable105"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            let AddedUserID = AuditData?.executor?.id ?? "";
            let LogTimeString = AuditData?.createdTimestamp.toString();

            const EventExecution = eventsTimestamp;
            const logtime = LogTimeString?.slice(0, -3);
            const eventtime = EventExecution.slice(0, -3);
            if (logtime !== eventtime) return;

            if (!client.user) return;
            if (AddedUserID == client.user.id) return;

            let AddedMember = await role.guild.members.fetch(AddedUserID).catch((e) => {
                if (data.all.logger && data.all.logger.length > 5) {
                    try {
                        let ch = role.guild.channels.cache.get(data.all.logger);
                        if (ch && ch.isSendable()) {
                            ch.send({
                                embeds: [new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setAuthor({
                                        name: `This is a Warn`,
                                        iconURL: `https://em-content.zobj.net/source/facebook/355/warning_26a0-fe0f.png`
                                    })
                                    .setTitle(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable107"]))
                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable108"]))
                                ]
                            }).catch(() => { })
                        }
                        return;
                    } catch (e) {
                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        return;
                    }
                }
                return;
            });

            if (AddedMember) {
                // If Guild Owner, (Whitelisted)
                if (AddedUserID == AddedMember.guild.ownerId) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE DELETE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable109"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // If his highest role is above mine (Whitelisted)
                if (!AddedMember.guild.members.me) return;
                if (AddedMember.roles.cache.size > 0 && AddedMember.guild.members.me.roles.cache.size > 0 && AddedMember.roles.highest.rawPosition >= AddedMember.guild.members.me.roles.highest.rawPosition) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE DELETE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable110"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // All Whitelist above Module
                if (data.all.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE DELETE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable111"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.all.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE DELETE - ${AddedMember.user.tag}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable112"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (data.antideleterole.whitelisted.users.includes(AddedUserID)) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE DELETE - ${AddedMember.user.tag} deleted ${role.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable113"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                if (AddedMember.roles.cache.size > 0 && AddedMember.roles.cache.some(r => data.antideleterole.whitelisted.roles.includes(r.id))) {
                    if (data.all.showwhitelistlog && data.all.logger && data.all.logger.length > 5) {
                        try {
                            let ch = role.guild.channels.cache.get(data.all.logger);
                            if (ch && ch.isSendable()) {
                                ch.send({
                                    embeds: [new EmbedBuilder()
                                        .setColor("#fffff9")
                                        .setAuthor({
                                            name: `ANTI ROLE DELETE - ${AddedMember.user.tag} deleted ${role.name}`,
                                            iconURL: AddedMember.user.displayAvatarURL()
                                        })
                                        .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable114"]))
                                        .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                    ]
                                }).catch(() => { })
                            }
                        } catch (e) {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        }
                    }
                    return;
                };

                // Ensure the Data
                usr_antinuke_databasing(role.guild.id + AddedMember.id);
                let memberData = client.Anti_Nuke_System.get(role.guild.id + AddedMember.id);

                // Increase the Stats
                client.Anti_Nuke_System.push(role.guild.id + AddedMember.id, Date.now(), "antideleterole")
                memberData = client.Anti_Nuke_System.get(role.guild.id + AddedMember.id);

                try {
                    if (data.antideleterole.punishment.member.removeroles.enabled &&
                        ( // 1 Day check
                            (data.antideleterole.punishment.member.removeroles.neededdaycount > 0 && memberData.antideleterole.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antideleterole.punishment.member.removeroles.neededdaycount) ||
                            // 1 Week Check
                            (data.antideleterole.punishment.member.removeroles.neededweekcount > 0 && memberData.antideleterole.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antideleterole.punishment.member.removeroles.neededweekcount) ||
                            // 1 Month Check
                            (data.antideleterole.punishment.member.removeroles.neededmonthcount > 0 && memberData.antideleterole.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antideleterole.punishment.member.removeroles.neededmonthcount) ||
                            // All Time Check
                            (data.antideleterole.punishment.member.removeroles.noeededalltimecount > 0 && memberData.antideleterole.length > data.antideleterole.punishment.member.removeroles.noeededalltimecount))
                    ) {
                        // Remove his/her roles
                        let roles2set: string[] = [];
                        if (data.all.quarantine && data.all.quarantine.length > 5) {
                            try {
                                let therole = AddedMember.guild.roles.cache.get(data.all.quarantine);
                                if (therole && therole.id) {
                                    roles2set.push(therole.id)
                                }
                            } catch (e) {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            }
                        };

                        AddedMember.roles.set(roles2set).then(member => {
                            //If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = role.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Blurple")
                                                .setAuthor({
                                                    name: `ANTI ROLE DELETE - Removed roles of ${member.user.tag} for deleting ${role.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable115"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                            console.log(`ANTI Role DELETE - Removed roles of ${member.user.tag} | ${member.user.id}`)
                        }).catch(() => { });
                    };

                    // Kick Member (Punishment 4)
                    if (AddedMember.kickable && data.antideleterole.punishment.member.kick.enabled &&
                        ( // 1 Day check
                            (data.antideleterole.punishment.member.kick.neededdaycount > 0 && memberData.antideleterole.filter(v => {
                                return v - (Date.now() - 8640000000) > 0
                            }).length > data.antideleterole.punishment.member.kick.neededdaycount) ||
                            // 1 Week Check
                            (data.antideleterole.punishment.member.kick.neededweekcount > 0 && memberData.antideleterole.filter(v => {
                                return v - (Date.now() - 7 * 8640000000) > 0
                            }).length > data.antideleterole.punishment.member.kick.neededweekcount) ||
                            // 1 Month Check
                            (data.antideleterole.punishment.member.kick.neededmonthcount > 0 && memberData.antideleterole.filter(v => {
                                return v - (Date.now() - 30 * 8640000000) > 0
                            }).length > data.antideleterole.punishment.member.kick.neededmonthcount) ||
                            // All Time Check
                            (data.antideleterole.punishment.member.kick.noeededalltimecount > 0 && memberData.antideleterole.length > data.antideleterole.punishment.member.kick.noeededalltimecount)) &&
                        (!data.antideleterole.punishment.member.ban.enabled ||
                            ( // 1 Day check
                                (data.antideleterole.punishment.member.ban.neededdaycount > 0 && memberData.antideleterole.filter(v => {
                                    return v - (Date.now() - 8640000000) > 0
                                }).length < data.antideleterole.punishment.member.ban.neededdaycount) ||
                                // 1 Week Check
                                (data.antideleterole.punishment.member.ban.neededweekcount > 0 && memberData.antideleterole.filter(v => {
                                    return v - (Date.now() - 7 * 8640000000) > 0
                                }).length < data.antideleterole.punishment.member.ban.neededweekcount) ||
                                // 1 Month Check
                                (data.antideleterole.punishment.member.ban.neededmonthcount > 0 && memberData.antideleterole.filter(v => {
                                    return v - (Date.now() - 30 * 8640000000) > 0
                                }).length < data.antideleterole.punishment.member.ban.neededmonthcount) ||
                                // All Time Check
                                (data.antideleterole.punishment.member.ban.noeededalltimecount > 0 && memberData.antideleterole.length < data.antideleterole.punishment.member.ban.noeededalltimecount))
                        ) // Only do the kick if no ban is enabled or if he doesnt have enough counts for getting banned
                    ) {
                        // Kick the Member
                        AddedMember.kick(`ANTI ROLE DELETE - He/She created: ${role.id} | ${role.name}`).then(member => {
                            // If there is the logger enabled, send information
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    let ch = role.guild.channels.cache.get(data.all.logger);
                                    if (ch && ch.isSendable()) {
                                        ch.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor("Orange")
                                                .setAuthor({
                                                    name: `ANTI ROLE DELETE - Kicked ${AddedMember.user.tag} for deleting ${role.name}`,
                                                    iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                })
                                                .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable116"]))
                                                .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                            ]
                                        }).catch(() => { })
                                    }
                                } catch (e) {
                                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                }
                            }
                        }).catch((e) => {
                            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                        });
                    }
                    if (AddedMember.bannable && data.antideleterole.punishment.member.ban.enabled && ( // 1 Day check
                        (data.antideleterole.punishment.member.ban.neededdaycount > 0 && memberData.antideleterole.filter(v => {
                            return v - (Date.now() - 8640000000) > 0
                        }).length > data.antideleterole.punishment.member.ban.neededdaycount) ||
                        // 1 Week Check
                        (data.antideleterole.punishment.member.ban.neededweekcount > 0 && memberData.antideleterole.filter(v => {
                            return v - (Date.now() - 7 * 8640000000) > 0
                        }).length > data.antideleterole.punishment.member.ban.neededweekcount) ||
                        // 1 Month Check
                        (data.antideleterole.punishment.member.ban.neededmonthcount > 0 && memberData.antideleterole.filter(v => {
                            return v - (Date.now() - 30 * 8640000000) > 0
                        }).length > data.antideleterole.punishment.member.ban.neededmonthcount) ||
                        // All Time Check
                        (data.antideleterole.punishment.member.ban.noeededalltimecount > 0 && memberData.antideleterole.length > data.antideleterole.punishment.member.ban.noeededalltimecount))) {
                        // Ban the Member
                        AddedMember.ban({
                            reason: `ANTI ROLE DELETE - He/She created: ${role.id} | ${role.name}`
                        })
                            .then(member => {
                                // If there is the logger enabled, send information
                                if (data.all.logger && data.all.logger.length > 5) {
                                    try {
                                        let ch = role.guild.channels.cache.get(data.all.logger);
                                        if (ch && ch.isSendable()) {
                                            ch.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setAuthor({
                                                        name: `ANTI ROLE DELETE - Banned ${AddedMember.user.tag} for deleting ${role.name}`,
                                                        iconURL: "https://em-content.zobj.net/source/huawei/375/exclamation-mark_2757.png"
                                                    })
                                                    .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable117"]))
                                                    .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL()))
                                                ]
                                            }).catch(() => { })
                                        }
                                    } catch (e) {
                                        console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                                    }
                                }
                            })
                            .catch((e) => {
                                console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                            });
                    }
                } catch (e) {
                    console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
                }

            }
        } catch (e) {
            console.log(chalk.dim.cyan(`ANTI-NUKE SYSTEM - ERROR-CATCHER`), e.stack ? chalk.grey.grey(String(e.stack)) : chalk.grey.grey(String(e)));
        }
    });
}