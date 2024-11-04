import { EmbedBuilder, Guild, Message } from "discord.js";
import { ExtendedClient } from "..";
import config from "../botconfig/config.json" assert { type: "json" };
import {
    databasing,
    check_voice_channels,
    create_join_to_create_Channel,
    isValidURL, delay
} from "../handlers/functions"
import chalk from "chalk";

const countermap = new Map();
export default (client: ExtendedClient) => {
    const isInvite = async (guild: Guild, code: string) => {
        return await new Promise((resolve) => {
            guild.invites.fetch().then((invites) => {
                for (const invite of [...invites.values()]) {
                    if (code === invite[0]) {
                        resolve(true)
                        return;
                    }
                }
                resolve(false)
            }).catch(() => { })
        })
    };

    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if (!oldMessage.inGuild() || !newMessage.inGuild()) return;
        if (oldMessage && newMessage) {
            checkAntiDiscord(newMessage);
        }
    });

    client.on("messageCreate", async (message) => {
        if (!message.inGuild()) return;
        checkAntiDiscord(message);
    });

    async function checkAntiDiscord(message: Message) {
        try {
            if (!message.member || !message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            if (!client.settings.has(message.guild.id, "language")) client.settings.ensure(message.guild.id, { language: "en" });
            let ls = client.settings.get(message.guild.id, "language")
            client.settings.ensure(message.guild.id, {
                adminroles: [],
            });
            var adminroles = client.settings.get(message.guild.id, "adminroles")
            // @ts-expect-error
            if (((adminroles && adminroles.length > 0) && [...message.member.roles.cache.values()].length > 0 && message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) || Array(message.guild.ownerId, config.ownerIDS).includes(message.author.id) || message.member.permissions.has("Administrator"))
                return;
            client.settings.ensure(message.guild.id, {
                antidiscord: {
                    enabled: false,
                    whitelistedchannels: [],
                    mute_amount: 2,
                    whitelistedlinks: [
                        "discord.gg/milrato",
                        "discord.gg/djs",
                    ]
                },
            });
            client.settings.ensure(message.guild.id, {
                autowarn: {
                    antispam: false,
                    antiselfbot: false,
                    antimention: false,
                    antilinks: false,
                    antidiscord: false,
                    anticaps: false,
                    blacklist: false,
                    ghost_ping_detector: false,
                }
            });

            let autowarn = client.settings.get(message.guild.id, "autowarn");
            let antisettings = client.settings.get(message.guild.id, "antidiscord")
            let mute_amount = antisettings.mute_amount
            let member = message.member
            if (!antisettings.enabled) return;

            if (client.setups.get("TICKETS", "tickets")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets1")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets2")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets3")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets4")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets5")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets6")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets7")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets8")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets9")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets10")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets11")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets12")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets13")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets14")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets15")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets16")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets17")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets18")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets19")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets20")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets21")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets22")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets23")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets24")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "tickets25")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets1")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets2")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets3")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets4")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets5")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets6")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets7")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets8")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets9")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets10")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets11")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets12")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets13")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets14")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets15")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets16")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets17")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets18")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets19")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets20")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets21")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets22")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets23")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets24")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "menutickets25")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets1")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets2")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets3")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets4")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets5")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets6")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets7")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets8")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets9")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets10")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets11")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets12")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets13")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets14")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets15")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets16")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets17")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets18")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets19")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets20")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets21")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets22")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets23")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets24")?.includes(message.channel.id) ||
                client.setups.get("TICKETS", "applytickets25")?.includes(message.channel.id)
            ) return; //it is a ticket

            if (message.channel.isDMBased()) return;
            // @ts-ignore
            if (antisettings.whitelistedchannels.some(r => message.channel.parentId == r || message.channel.id == r)) return;

            let es = client.settings.get(message.guild.id, "embed");

            try {
                const {
                    guild,
                    content
                } = message;
                if (content.includes('discord.gg/')) {
                    for (let arg of message.content.toLowerCase().split(" ")) {
                        if (isAllowedURL(arg, antisettings)) {
                            const code = content.split('discord.gg/')[1];
                            const isOurInvite = await isInvite(guild, code);
                            if (!isOurInvite) {
                                if (!message.deletable) return;
                                if (autowarn.antidiscord) {
                                    client.userProfiles.ensure(message.author.id, {
                                        id: message.author.id,
                                        guild: message.guild.id,
                                        totalActions: 0,
                                        warnings: [],
                                        kicks: []
                                    });
                                    const newActionId = client.modActions.autonum;
                                    client.modActions.set(newActionId, {
                                        user: message.author.id,
                                        guild: message.guild.id,
                                        type: 'warning',
                                        moderator: message.author.id,
                                        reason: "AntiDiscord Autowarn",
                                        when: new Date().toLocaleString(`de`),
                                        oldhighesrole: message.member.roles ? message.member.roles.highest : `Had No Roles`,
                                        oldthumburl: message.author.displayAvatarURL()
                                    });
                                    // Push the action to the user's warnings
                                    client.userProfiles.push(message.author.id, newActionId, 'warnings');
                                    client.userProfiles.inc(message.author.id, 'totalActions');
                                    client.stats.push(message.guild.id + message.author.id, new Date().getTime(), "warn");
                                    const warnIDs = client.userProfiles.get(message.author.id, 'warnings')
                                    const warnData = warnIDs.map(id => client.modActions.get(id));
                                    if (!message.guild) return;
                                    // @ts-ignore
                                    let warnings = warnData.filter(v => v.guild == message.guild.id);

                                    message.channel.send({
                                        embeds: [
                                            new EmbedBuilder().setAuthor(client.getAuthor(message.author.tag, message.member.displayAvatarURL()))
                                                .setColor("Orange").setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL()))
                                                .setDescription(`> <@${message.author.id}> **received an autogenerated Warn - \`antidiscord\`**!\n\n> **He now has \`${warnings.length} Warnings\`**`)
                                        ]
                                    });

                                    let warnsettings = client.settings.get(message.guild.id, "warnsettings")
                                    if (warnsettings.kick && warnsettings.kick == warnings.length) {
                                        if (!message.member.kickable)
                                            message.channel.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
                                                ]
                                            });
                                        else {
                                            try {
                                                if (!client.user) return;
                                                message.member.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
                                                    ]
                                                });
                                            } catch {
                                                return message.channel.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor(es.wrongcolor)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
                                                    ]
                                                });
                                            }
                                            try {
                                                message.member.kick(`Reached ${warnings.length} Warnings`).then(() => {
                                                    if (message.channel.isDMBased()) return;
                                                    if (!client.user) return;
                                                    message.channel.send({
                                                        embeds: [new EmbedBuilder()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                            .setFooter(client.getFooter(es))
                                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                                                        ]
                                                    });
                                                });
                                            } catch (e) {
                                                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                                message.channel.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor(es.wrongcolor)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(client.la[ls].common.erroroccur)
                                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
                                                    ]
                                                });
                                            }
                                        }
                                    }

                                    if (warnsettings.ban && warnsettings.ban == warnings.length) {
                                        if (!message.member.bannable)
                                            message.channel.send({
                                                embeds: [new EmbedBuilder()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
                                                ]
                                            });
                                        else {
                                            try {
                                                if (!client.user) return;
                                                message.member.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
                                                    ]
                                                });
                                            } catch {
                                                message.channel.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor(es.wrongcolor)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable18"]))
                                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable19"]))
                                                    ]
                                                });
                                            }
                                            try {
                                                message.member.ban({
                                                    reason: `Reached ${warnings.length} Warnings`
                                                }).then(() => {
                                                    if (message.channel.isDMBased()) return;
                                                    if (!client.user) return
                                                    message.channel.send({
                                                        embeds: [new EmbedBuilder()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                            .setFooter(client.getFooter(es))
                                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                                                        ]
                                                    });
                                                });
                                            } catch (e) {
                                                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                                message.channel.send({
                                                    embeds: [new EmbedBuilder()
                                                        .setColor(es.wrongcolor)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
                                                    ]
                                                });
                                            }
                                        }
                                    }
                                    for (const role of warnsettings.roles) {
                                        if (role.warncount == warnings.length) {
                                            if (!message.member.roles.cache.has(role.roleid)) {
                                                message.member.roles.add(role.roleid).catch((O) => { })
                                            }
                                        }
                                    }
                                }
                                message.delete().catch(() => { });
                                if (!countermap.get(message.author.id)) countermap.set(message.author.id, 1)
                                setTimeout(() => {
                                    countermap.set(message.author.id, Number(countermap.get(message.author.id)) - 1)
                                    if (Number(countermap.get(message.author.id)) < 1) countermap.set(message.author.id, 1)
                                }, 15000)
                                countermap.set(message.author.id, Number(countermap.get(message.author.id)) + 1)

                                if (Number(countermap.get(message.author.id)) > mute_amount) {
                                    let time = 10 * 60 * 1000; let mutetime = time;
                                    let reason = "Sending too many Discord Links in a Short Time";

                                    member.timeout(mutetime, reason).then(() => {
                                        if (message.channel.isDMBased()) return;
                                        if (!client.user) return;
                                        message.channel.send({
                                            embeds: [new EmbedBuilder()
                                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                .setFooter(client.getFooter(es))
                                                .setTitle(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable1"]))
                                                .setDescription(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable2"]))
                                            ]
                                        }).catch(() => { });

                                    }).catch(() => {
                                        if (message.channel.isDMBased()) return;
                                        return message.channel.send(`:x: **I could not timeout ${member.user.tag}**`).then(m => {
                                            setTimeout(() => { m.delete().catch(() => { }) }, 5000);
                                        });
                                    });

                                    countermap.set(message.author.id, 1)
                                }
                                else {
                                    return message.channel.send({
                                        embeds: [new EmbedBuilder()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable5"]))
                                        ]
                                    }).then(msg => {
                                        setTimeout(() => { msg.delete().catch(() => { }) }, 3000)
                                    }).catch(() => { });
                                }
                            } else {
                                // Do nothing ;) by @Tomato6966
                            }
                        }
                    }
                } else {
                    // Do nothing ;) by @Tomato6966
                }
            } catch (e) {
                console.log(chalk.bgRed.grey(String(e.stack)));

                return message.channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.erroroccur)
                        .setDescription(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable6"]))
                    ]
                }).catch(() => { });
            }
        } catch (e) {
            console.log(chalk.grey(String(e)))
        }
    }
}

function isAllowedURL(arg, s) {
    if (!s.whitelistedlinks.some(link => arg.toLowerCase().includes(link.toLowerCase()) || link.toLowerCase().includes(arg.toLowerCase()))) {
        return true;
    } else {
        return false;
    }
}