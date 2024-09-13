import { Collection, ColorResolvable, EmbedBuilder, Events, Message } from "discord.js";
import { ExtendedClient } from "../..";
import { check_if_dj, databasing, delay, escapeRegex, handlemsg, simple_databasing } from "../../handlers/functions";
import config from "../../botconfig/config.json" assert { type: "json" };
import ee from "../../botconfig/embed.json" assert { type: "json" };
import chalk from "chalk";

export default {
    name: Events.MessageCreate,
    async execute(message: Message, client: ExtendedClient) {
        try {
            console.log("Message Received")
            if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;
            console.log("Debug 1");
            if (message.channel.partial) await message.channel.fetch().catch(() => { });
            console.log("Debug 2");
            if (message.member?.partial) await message.member.fetch().catch(() => { });

            console.log("Starting DB");
            simple_databasing(client, message.guild.id, message.author.id);
            var not_allowed = false;
            const guild_settings = client.settings.get(message.guild.id);
            let es = guild_settings.embed;
            let ls = guild_settings.language;

            console.log("Getting Guild Settings")
            let { prefix, botchannel, unkowncmdmessage } = guild_settings;

            console.log(guild_settings);
            console.log(prefix);

            if (message.author.bot) return;

            if (prefix === null) prefix = config.prefix;

            console.log("Checks Prefix")
            const prefixRegex = new RegExp(`^(<@!?${client.user?.id}>|${escapeRegex(prefix)})\\s*`);

            if (!prefixRegex.test(message.content)) return

            const [, matchedPrefix] = message.content.match(prefixRegex) ?? [];

            if (!message.guild.members.me?.permissions.has("UseExternalEmojis")) {
                return message.reply(`:x: **I am missing the Permission to USE EXTERNAL EMOJIS**`).catch(() => { })
            };

            if (!message.guild.members.me.permissions.has("EmbedLinks")) {
                return message.reply(`<:no:833101993668771842> **I am missing the Permission to EMBED LINKS (Sending Embeds)**`).catch(() => { })
            };

            if (!message.guild.members.me.permissions.has("AddReactions")) {
                return message.reply(`<:no:833101993668771842> **I am missing the Permission to ADD REACTIONS**`).catch(() => { })
            };

            console.log("Start the run process");
            if (botchannel.toString() !== "") {
                if (!botchannel.includes(message.channel.id) && !message.member?.permissions.has("Administrator")) {
                    for (const channelId of botchannel) {
                        let channel = message.guild.channels.cache.get(channelId);
                        if (!channel) {
                            client.settings.remove(message.guild.id, channelId, `botchannel`);
                        };
                    };

                    try {
                        message.react("833101993668771842").catch(() => { })
                    } catch { };
                    not_allowed = true;
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].common.botchat.title)
                            .setDescription(`${client.la[ls].common.botchat.description}\n> ${botchannel.map(c => `<#${c}>`).join(", ")}`)
                        ]
                    }).then(async msg => {
                        setTimeout(() => {
                            try {
                                if (msg.deletable) {
                                    message.delete().catch(() => { });
                                }
                            } catch { }
                        }, 5000)
                    }).catch(() => { })
                }
            }

            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

            const cmd = args.shift()?.toLowerCase();

            if (!cmd) return;

            if (cmd.length === 0) {
                if (matchedPrefix.includes(client.user?.id ?? "")) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(es.color)
                            .setTitle(handlemsg(client.la[ls].common.ping, { prefix: prefix }))
                        ]
                    }).catch(() => { });
                };
                return;
            }

            let command = client.commands.get(cmd);

            if (!command) command = client.commands.get(client.aliases.get(cmd) ?? "");

            console.log(command);
            var customcmd = false;
            var cuc = client.customcommands.get(message.guild.id, "commands");
            for (const cmd of cuc) {
                if (cmd.name.toLowerCase() === message.content.slice(prefix.length).split(" ")[0]) {
                    customcmd = true;
                    if (cmd.embed) {
                        return message.reply({
                            embeds: [new EmbedBuilder()
                                .setColor(es.color)
                                .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user?.displayAvatarURL() : null)
                                .setFooter(client.getFooter(es))
                                .setDescription(cmd.output)
                            ]
                        });
                    } else {
                        message.reply(cmd.output);
                    };
                }
            }

            if (command && !customcmd) {
                var musicData = client.musicsettings.get(message.guild.id);
                if (musicData.channel && musicData.channel === message.channel.id) {
                    return message.reply("<:no:833101993668771842> **Please use a Command Somewhere else!**").then(msg => {
                        setTimeout(() => {
                            if (msg.deletable) {
                                msg.delete().catch(() => { });
                            }
                        }, 3000);
                    }).catch(() => { });
                };

                if (command.length === 0) {
                    if (unkowncmdmessage) {
                        message.reply({
                            embeds: [new EmbedBuilder()
                                .setColor(es.wrongcolor)
                                .setFooter(client.getFooter(es))
                                .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, { prefix: prefix }))
                                .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, { prefix: prefix }))
                            ]
                        }).then(async msg => {
                            setTimeout(() => {
                                try {
                                    if (msg.deletable) {
                                        msg.delete().catch(() => { });
                                    };
                                } catch { };
                            }, 5000);
                        }).catch(() => { });
                    };

                    return;
                }

                if (!client.cooldowns.has(command.name)) {
                    client.commands.set(command.name, new Collection());
                };
                const now = Date.now();
                const timestamps = client.cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown || 1) * 1000;

                if (timestamps.has(message.author.id)) {
                    let expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                    if (now < expirationTime) {
                        let timeLeft = (expirationTime - now) / 1000;
                        if (timeLeft < 1) {
                            timeLeft = Math.round(timeLeft);
                        };

                        if (timeLeft && timeLeft != 0) {
                            not_allowed = true;
                            return message.reply({
                                embeds: [new EmbedBuilder()
                                    .setColor(es.wrongcolor)
                                    .setTitle(handlemsg(client.la[ls].common.cooldown, { time: timeLeft.toFixed(1), commandname: command.name }))
                                ]
                            }).catch(() => { })
                        }
                    }
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => {
                    timestamps.delete(message.author.id);
                }, cooldownAmount);

                try {
                    client.stats.inc(message.guild.id, "commands");
                    client.stats.inc("global", "commands");

                    if (command.memberpermissions) {
                        if (!message.member?.permissions.has(command.memberpermissions)) {
                            not_allowed = true;
                            try {
                                message.react("833101993668771842").catch(() => { });
                            } catch { }

                            message.reply({
                                embeds: [new EmbedBuilder()
                                    .setColor(es.wrongcolor)
                                    .setFooter(client.getFooter(es))
                                    .setTitle(client.la[ls].common.permissions.title)
                                    .setDescription(`${client.la[ls].common.permissions.description}\n> \`${command.memberpermissions.join("`, ``")}\``)
                                ]
                            }).then(async msg => {
                                setTimeout(() => {
                                    try {
                                        if (msg.deletable) {
                                            msg.delete().catch(() => { })
                                        }
                                    } catch { }
                                }, 5000)
                            }).catch(() => { })
                        }
                    }

                    ///////////////////////////////
                    ///////////////////////////////
                    ///////////////////////////////
                    ///////////////////////////////

                    const player = client.manager.players.get(message.guild.id);

                    if (player && player.node && !player.node.connected) player.node.connect();

                    if (message.guild.members.me.voice.channel && player) {
                        //destroy the player if there is no one
                        if (!player.queue) await player.destroy();
                        await delay(350);
                    }

                    ///////////////////////////////
                    ///////////////////////////////
                    ///////////////////////////////
                    ///////////////////////////////
                    if (command.parameters) {
                        if (command.parameters.type == "music") {
                            //get the channel instance
                            if (!message.member) return;
                            const { channel } = message.member.voice;
                            const mechannel = message.guild.members.me.voice.channel;
                            //if not in a voice Channel return error
                            if (!channel) {
                                not_allowed = true;
                                return message.reply({
                                    embeds: [new EmbedBuilder()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(client.la[ls].common.join_vc)]
                                }).catch(() => { })
                            }
                            //If there is no player, then kick the bot out of the channel, if connected to
                            if (!player && mechannel) {
                                await message.guild.members.me.voice.disconnect().catch(e => { });
                                await delay(350);
                            }
                            if (player && player.queue && player.queue.current && command.parameters.check_dj) {
                                if (check_if_dj(client, message.member, player.queue.current)) {
                                    const color = ee.wrongcolor as ColorResolvable
                                    return message.reply({
                                        embeds: [new EmbedBuilder()
                                            .setColor(color)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(`<:no:833101993668771842> **You are not a DJ and not the Song Requester!**`)
                                            .setDescription(`**DJ-ROLES:**\n${check_if_dj(client, message.member, player.queue.current)}`)
                                        ],
                                    }).catch(() => { })
                                }
                            }

                            //if no player available return error | aka not playing anything
                            if (command.parameters.activeplayer) {
                                if (!player) {
                                    not_allowed = true;
                                    return message.reply({
                                        embeds: [new EmbedBuilder()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(client.la[ls].common.nothing_playing)]
                                    }).catch(() => { })
                                }
                                if (!mechannel) {
                                    if (player) try { await player.destroy(); await delay(350); } catch { }
                                    not_allowed = true;
                                    return message.reply({
                                        embeds: [new EmbedBuilder()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(client.la[ls].common.not_connected)]
                                    }).catch(() => { })
                                }
                                if (!player.queue || !player.queue.current) {
                                    return message.reply({
                                        embeds: [new EmbedBuilder()
                                            .setColor(es.wrongcolor)
                                            .setTitle(":x: There is no current Queue / Song Playing!")
                                        ]
                                    }).catch(() => { })
                                }
                            }
                            //if no previoussong
                            if (command.parameters.previoussong) {
                                if (!player?.queue.previous || player.queue.previous === null) {
                                    not_allowed = true;
                                    return message.reply({
                                        embeds: [new EmbedBuilder()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(client.la[ls].common.nothing_playing)]
                                    }).catch(() => { })
                                }
                            }
                            //if not in the same channel --> return
                            if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
                                return message.reply({
                                    embeds: [new EmbedBuilder()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(client.la[ls].common.wrong_vc)
                                        .setDescription(`Channel: <#${player.voiceChannel}>`)]
                                }).catch(() => { })
                            }
                            //if not in the same channel --> return
                            if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
                                return message.reply({
                                    embeds: [new EmbedBuilder()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(client.la[ls].common.wrong_vc)
                                        .setDescription(`Channel: <#${player?.voiceChannel}>`)]
                                }).catch(() => { })
                            }
                        }
                    }

                    ///////////////////////////////
                    ///////////////////////////////
                    ///////////////////////////////
                    ///////////////////////////////

                    if (not_allowed) return;

                    if (command.category === "💪 Setup") {
                        databasing(client, message.guild.id, message.author.id);
                    };

                    command.run(client, message, args, message.member, args.join(" "), prefix, player);
                } catch (e) {
                    console.log(e.stack ? chalk.grey(String(e.stack)) : chalk.grey(String(e)));
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].commong.somethingwentwrong)
                            .setDescription(`\`\`\`${e.message ? e.message : e.stack ? chalk.grey(String(e.stack)).substring(0, 2000) : chalk.grey(String(e)).substring(0, 2000)}\`\`\``)
                        ]
                    }).then(async msg => {
                        setTimeout(() => {
                            try {
                                if (msg.deletable) {
                                    msg.delete().catch(() => { });
                                }
                            } catch { };
                        }, 5000);
                    }).catch(() => { })
                }
            } else if (!customcmd) {
                if (unkowncmdmessage) {
                    message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, { prefix: prefix }))
                            .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, { prefix: prefix }))
                        ]
                    }).then(async msg => {
                        setTimeout(() => {
                            try {
                                if (msg.deletable) {
                                    msg.delete().catch(() => { });
                                }
                            } catch { }
                        }, 5000);
                    }).catch(() => { })
                }
                return;
            }
        } catch (e) {
            console.log(e.stack ? chalk.grey(String(e.stack)) : chalk.grey(String(e)));
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(":x: An error occurred")
                    .setDescription(`\`\`\`${e.message ? e.message : chalk.grey(String(e)).substring(0, 2000)}\`\`\``)
                ]
            }).catch(() => { })
        }
    }
}

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */