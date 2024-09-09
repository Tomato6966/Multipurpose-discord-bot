import { Collection, EmbedBuilder, Events, Interaction } from "discord.js";
import type { ColorResolvable } from "discord.js";
import { delay, simple_databasing, check_if_dj, handlemsg } from "../../handlers/functions";
import { ExtendedClient } from "../..";
import ee from "../../botconfig/embed.json" assert { type: "json" };

export default {
    name: Events.InteractionCreate,
    async execute(client: ExtendedClient, interaction: Interaction) {
        if (!interaction?.isCommand() || !interaction.inCachedGuild()) return;
        const {
            member,
            channelId,
            guildId,
            applicationId,
            commandName,
            deferred,
            replied,
            ephemeral,
            options,
            id,
            createdTimestamp
        } = interaction;

        if (!member) return;
        const {
            guild
        } = member;

        if (!guild) {
            return interaction.reply({ content: ":x: Interactions only Works inside of GUILDS!", ephemeral: true }).catch(() => { });
        };

        const CategoryName = interaction.commandName;
        simple_databasing(client, guild.id, member.id);
        var not_allowed = false;
        const guild_settings = client.settings.get(guild.id);
        let es = guild_settings.embed;
        let ls = guild_settings.language;
        let {
            prefix,
            botchannel,
            unkowncmdmessage
        } = guild_settings;
        let command: any = false;
        try {
            if (interaction.isChatInputCommand()) {
                if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
                    command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
                }
            }
        } catch {
            if (client.slashCommands.has("normal" + CategoryName)) {
                command = client.slashCommands.get("normal" + CategoryName);
            }
        };

        if (command) {
            if (!command.category?.toLowerCase().includes("nsfw") && botchannel.toString() !== "") {
                if (!botchannel.includes(channelId) && !member.permissions.has("Administrator")) {
                    for (const channelId of botchannel) {
                        let channel = guild.channels.cache.get(channelId);
                        if (!channel) {
                            client.settings.remove(guild.id, channelId, `botchannel`);
                        };
                    }
                    not_allowed = true;
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].common.botchat.title)
                            .setDescription(`${client.la[ls].common.botchat.description}\n> ${botchannel.map(c => `<#${c}>`).join(", ")}`)
                        ]
                    })
                }
            };

            if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
                client.cooldowns.set(command.name, new Collection())
            };

            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 1) * 1000;

            if (timestamps.has(member.id)) {
                const expirationTime = timestamps.get(member.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    not_allowed = true;
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setTitle(handlemsg(client.la[ls].common.cooldown, {
                                time: timeLeft.toFixed(1),
                                commandname: command.name
                            }))
                        ]
                    });
                }
            }
            timestamps.set(member.id, now);
            setTimeout(() => timestamps.delete(member.id), cooldownAmount);

            client.stats.inc(guild.id, "commands");
            client.stats.inc("global", "commands");

            if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction?.member.permissions.has(command.memberpermissions)) {
                return interaction.reply({
                    ephemeral: true,
                    embeds: [new EmbedBuilder()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.permissions.title)
                        .setDescription(`${client.la[ls].common.permissions.description}\n> \`${command.memberpermissions.join("`, ``")}\``)
                    ]
                });
            };
        }

        const player = client.manager.players.get(guild.id);

        if (player && player.node && !player.node.connected) {
            player.node.connect();
        };

        if (guild.members.me?.voice.channel && player) {
            if (!player.queue) await player.destroy();
            await delay(350);
        }

        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        if (command.parameters) {
            if (command.parameters.type == "music") {
                const { channel } = member.voice;
                const mechannel = guild.members.me?.voice.channel;

                if (!channel) {
                    not_allowed = true;
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].common.join_vc)
                        ]
                    });
                };

                if (!player && mechannel) {
                    await guild.members.me?.voice.disconnect().catch(e => { });
                    await delay(350);
                }
                if (player && player.queue && player.queue.current && command.parameters.check_dj) {
                    if (check_if_dj(client, interaction.member, player.queue.current)) {
                        const color = ee.wrongcolor as ColorResolvable;
                        return interaction.reply({
                            embeds: [new EmbedBuilder()
                                .setColor(color)
                                .setFooter({
                                    text: `${ee.footertext}`,
                                    iconURL: `${ee.footericon}`
                                })
                                .setTitle(`<:no: 833101993668771842 > ** You are not a DJ and not the Song Requester! **`)
                                .setDescription(`** DJ - ROLES: ** \n${check_if_dj(client, interaction?.member, player.queue.current)}`)
                            ],
                            ephemeral: true
                        });
                    }
                }

                if (command.parameters.activeplayer) {
                    if (!player) {
                        not_allowed = true;
                        return interaction.reply({
                            ephemeral: true,
                            embeds: [new EmbedBuilder()
                                .setColor(es.wrongcolor)
                                .setFooter(client.getFooter(es))
                                .setTitle(client.la[ls].common.nothing_playing)
                            ]
                        });
                    }
                    if (!mechannel) {
                        if (player) try {
                            await player.destroy;
                            await delay(350);
                        } catch { };
                        not_allowed = true;
                        return interaction.reply({
                            ephemeral: true,
                            embeds: [new EmbedBuilder()
                                .setColor(es.wrongcolor)
                                .setFooter(client.getFooter(es))
                                .setTitle(client.la[ls].common.not_connected)
                            ]
                        });
                    }
                }

                if (command.parameters.previoussong) {
                    if (!player?.queue.previous || player.queue.previous === null) {
                        not_allowed = true;
                        return interaction.reply({
                            ephemeral: true,
                            embeds: [new EmbedBuilder()
                                .setColor(es.wrongcolor)
                                .setFooter(client.getFooter(es))
                                .setTitle(client.la[ls].commong.nothing_playing)
                            ]
                        });
                    }
                }

                if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].common.wrong_vc)
                            .setDescription(`Channel: <#${player.voiceChannel}`)
                        ]
                    });
                };

                if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
                    return interaction.reply({
                        ephemeral: true, embeds: [new EmbedBuilder()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].common.wrong_vc)
                            .setDescription(`Channel: <#${player?.voiceChannel}>`)
                        ]
                    });
                }
            }
        }
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        if (not_allowed) return;
        let message = {
            applicationId: interaction?.applicationId,
            attachments: [],
            author: member.user,
            channel: guild.channels.cache.get(interaction?.channelId),
            channelId: interaction?.channelId,
            member: member,
            client: interaction?.client,
            components: [],
            content: null,
            createdAt: new Date(interaction?.createdTimestamp),
            createdTimestamp: interaction?.createdTimestamp,
            embeds: [],
            id: null,
            guild: interaction?.member.guild,
            guildId: interaction?.guildId,
        }

        command.run(client, interaction, interaction.member.user, es, ls, prefix, player, message);
    }
};

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */