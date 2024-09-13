import chalk from 'chalk';
import { ExtendedClient } from "..";
import { GuildMember } from 'discord.js';
import config from "../botconfig/config.json" assert { type: "json" };
import * as ee from "../botconfig/embed.json" assert { type: "json"};

export function delay(delayInms: number) {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayInms);
        })
    } catch (e) {
        console.log(chalk.grey.bgRed(e.stack));
    }
};

export function nFormatter(num: number, digits = 2) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
};

export function dbEnsure(db, key, data) {
    if (!db?.has(key)) {
        db?.ensure(key, data);
    } else {
        for (const [Okey, value] of Object.entries(data)) {
            if (!db?.has(key, Okey)) {
                db?.ensure(key, value, Okey);
            } else {
            }
        }
    }
};

export function simple_databasing(client: ExtendedClient, guildid: string, userid?: string) {
    if (!client || client == undefined) return;
    try {
        if (guildid && userid) {
            dbEnsure(client.stats, guildid + userid, {
                ban: [],
                kick: [],
                mute: [],
                ticket: [],
                says: [],
                warn: [],
            })
        }

        if (userid) {
            dbEnsure(client.settings, userid, {
                dm: true,
            })
        }
        if (guildid) {

            dbEnsure(client.musicsettings, guildid, { "channel": "", "message": "" });
            dbEnsure(client.customcommands, guildid, { commands: [] });
            dbEnsure(client.stats, guildid, { commands: 0, songs: 0 });
            dbEnsure(client.settings, guildid, {
                prefix: config.prefix,
                pruning: true,
                requestonly: true,
                autobackup: false,
                unkowncmdmessage: false,
                defaultvolume: 30,
                channel: "773836425678422046",
                language: "en",
                warnsettings: {
                    ban: false,
                    kick: false,
                    roles: [
                        /*
                        { warncount: 0, roleid: "1212031723081723"}
                        */
                    ]
                },
                mute: {
                    style: "timeout",
                    roleId: "",
                    defaultTime: 60000,
                },
                embed: {
                    "color": ee.color,
                    "thumb": true,
                    "wrongcolor": ee.wrongcolor,
                    "footertext": client.guilds.cache.has(guildid) ? client.guilds.cache.get(guildid)?.name : ee.footertext,
                    "footericon": client.guilds.cache.has(guildid) ? client.guilds.cache.get(guildid)?.iconURL() : ee.footericon,
                },
                adminlog: "no",
                reportlog: "no",
                autonsfw: "no",
                dailyfact: "no",
                autoembeds: [],
                adminroles: [],

                volume: "69",

                showdisabled: true,

                MUSIC: true,
                FUN: true,
                ANIME: true,
                MINIGAMES: true,
                ECONOMY: true,
                SCHOOL: true,
                NSFW: false,
                VOICE: true,
                RANKING: true,
                PROGRAMMING: true,
                CUSTOMQUEUE: true,
                FILTER: true,
                SOUNDBOARD: true,

                cmdadminroles: {
                    removetimeout: [],
                    timeout: [],
                    idban: [],
                    snipe: [],
                    addroletorole: [],
                    addroletobots: [],
                    addroletohumans: [],
                    removerolefromrole: [],
                    removerolefrombots: [],
                    removerolefromhumans: [],
                    removerolefromeveryone: [],
                    listbackups: [],
                    loadbackup: [],
                    createbackup: [],
                    embed: [],
                    editembed: [],
                    editimgembed: [],
                    imgembed: [],
                    useridban: [],
                    addrole: [],
                    addroletoeveryone: [],
                    ban: [],
                    channellock: [],
                    channelunlock: [],
                    clear: [],
                    clearbotmessages: [],
                    close: [],
                    copymessage: [],
                    deleterole: [],
                    detailwarn: [],
                    dm: [],
                    editembeds: [],
                    editimgembeds: [],
                    embeds: [],
                    embedbuilder: [],
                    esay: [],
                    giveaway: [],
                    image: [],
                    imgembeds: [],
                    kick: [],
                    mute: [],
                    nickname: [],
                    unlockthread: [],
                    unarchivethread: [],
                    lockthread: [],
                    archivethread: [],
                    leavethread: [],
                    lockchannel: [],
                    unlockchannel: [],
                    jointhread: [],
                    jointhreads: [],
                    setautoarchiveduration: [],
                    tempmute: [],
                    permamute: [],
                    poll: [],
                    react: [],
                    removeallwarns: [],
                    removerole: [],
                    report: [],
                    say: [],
                    slowmode: [],
                    suggest: [],
                    ticket: [],
                    unmute: [],
                    unwarn: [],
                    updatemessage: [],
                    warn: [],
                    warnings: [],
                },
                djroles: [],
                djonlycmds: ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"],
                botchannel: [],
            });
        }
        return;
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
};

export function check_if_dj(client: ExtendedClient, member: GuildMember, song) {
    if (!client) return false;
    var roleid = client.settings.get(member.guild.id, `djroles`);
    if (String(roleid) == "") return false;
    var isdj = false;
    for (const djRole of roleid) {
        if (!member.guild.roles.cache.get(djRole)) {
            client.settings.remove(member.guild.id, djRole, `djroles`);
            continue;
        }
        if (member.roles.cache.has(djRole)) isdj = true;
    }
    if (!isdj && !member.permissions.has("Administrator") && song?.requester?.id != member.id) {
        return roleid.map(i => `<@&${i}>`).join(", ");
    } else {
        return false;
    }
};

export function handlemsg(txt, options) {
    let text = String(txt);
    for (const option in options) {
        var toreplace = new RegExp(`{${option.toLowerCase()}}`, "ig");
        text = text.replace(toreplace, options[option]);
    }
    return text;
};

export function escapeRegex(str: string) {
    console.log(str);
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(chalk.grey.bgRed(e.stack));
    }
};

export function databasing(client: ExtendedClient, guildid: string, userid: string) {
    if (!client || client == undefined || !client.user || client.user == undefined) return;
    try {
        if (guildid) {
            dbEnsure(client.customcommands, guildid, {
                commands: []
            });
            dbEnsure(client.keyword, guildid, {
                commands: []
            })
            /**
            * @INFO
            * Bot Coded by Tomato#6966 | https://discord.gg/milrato
            * @INFO
            * Work for Milrato Development | https://milrato.eu
            * @INFO
            * Please mention him / Milrato Development, when using this Code!
            * @INFO
            */

            dbEnsure(client.social_log, guildid, {
                tiktok: {
                    channels: [],
                    dc_channel: ""
                },
                youtube: {
                    channels: [],
                    dc_channel: ""
                },
                twitter: {
                    TWITTER_USER_ID: "",
                    TWITTER_USER_NAME_ONLY_THOSE: "",
                    DISCORD_CHANNEL_ID: "",
                    latesttweet: "",
                    REETWET: false,
                    infomsg: "**{Twittername}** posted a new Tweet:\n\n{url}"
                },
                secondtwitter: {
                    TWITTER_USER_ID: "",
                    TWITTER_USER_NAME_ONLY_THOSE: "",
                    DISCORD_CHANNEL_ID: "",
                    latesttweet: "",
                    REETWET: false,
                    infomsg: "**{Twittername}** posted a new Tweet:\n\n{url}"
                },
                twitch: {
                    DiscordServerId: guildid,
                    channelId: "",
                    roleID_PING: "",
                    roleID_GIVE: "",
                    channels: [],
                }
            })

            for (let i = 0; i <= 25; i++) {
                let index = i + 1;
                dbEnsure(client[`roster${index != 1 ? index : ""}`], guildid, {
                    rosterchannel: "notvalid",
                    rosteremoji: "➤",
                    rostermessage: "",
                    rostertitle: "Roster",
                    rosterstyle: "1",
                    rosterroles: [],
                    inline: false,
                })
            };

            dbEnsure(client.stats, guildid, {
                commands: 0,
                songs: 0
            });
            dbEnsure(client.premium, guildid, {
                enabled: false,
            });

            const ensureData = {
                textchannel: "0",
                voicechannel: "0",
                category: "0",
                message_cmd_info: "0",
                message_queue_info: "0",
                message_track_info: "0",
                blacklist: {
                    whitelistedroles: [],
                    words: [],
                    enabled: true
                }
            };

            for (let i = 0; i <= 100; i++) {
                ensureData[`ticketsystem${i}`] = {
                    enabled: false,
                    guildid: guildid,
                    defaultname: "🎫・{count}・{member}",
                    messageid: "",
                    channelid: "",
                    parentid: "",
                    claim: {
                        enabled: false,
                        messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                        messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
                    },
                    message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
                    adminroles: []
                }
            };

            dbEnsure(client.setups, guildid, ensureData);
            dbEnsure(client.blacklist, guildid, {
                words: [],
                mute_amount: 5,
                whitelistedchannels: [],
            });

            dbEnsure(client.settings, guildid, {
                prefix: config.prefix,
                pruning: true,
                requestonly: true,
                autobackup: false,
                defaultvolume: 30,
                channel: "773836425678422046",
                adminlog: "no",
                dailyfact: "no",
                reportlog: "no",
                autoembeds: [],
                volume: "69",
                adminroles: [],
                language: "en",

                mute: {
                    style: "timeout",
                    roleId: "",
                    defaultTime: 60000,
                },

                warnsettings: {
                    ban: false,
                    kick: false,
                    roles: [
                        /*
                        { warncount: 0, roleid: "1212031723081723"}
                        */
                    ]
                },

                /**
                 * @INFO
                 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
                 * @INFO
                 * Work for Milrato Development | https://milrato.eu
                 * @INFO
                 * Please mention him / Milrato Development, when using this Code!
                 * @INFO
                 */

                showdisabled: true,

                MUSIC: true,
                FUN: true,
                ANIME: true,
                MINIGAMES: true,
                ECONOMY: true,
                SCHOOL: true,
                NSFW: false,
                VOICE: true,
                RANKING: true,
                PROGRAMMING: true,
                CUSTOMQUEUE: true,
                FILTER: true,
                SOUNDBOARD: true,
                antispam: {
                    enabled: true,
                    whitelistedchannels: [],
                    limit: 7,
                    mute_amount: 2,
                },
                antimention: {
                    enabled: true,
                    whitelistedchannels: [],
                    limit: 5,
                    mute_amount: 2,
                },
                antiemoji: {
                    enabled: true,
                    whitelistedchannels: [],
                    limit: 10,
                    mute_amount: 2,
                },
                anticaps: {
                    enabled: true,
                    whitelistedchannels: [],
                    percent: 75,
                    mute_amount: 2,
                },
                cmdadminroles: {
                    removetimeout: [],
                    timeout: [],
                    idban: [],
                    snipe: [],
                    listbackups: [],
                    loadbackup: [],
                    createbackup: [],
                    embed: [],
                    editembed: [],
                    editimgembed: [],
                    imgembed: [],
                    useridban: [],
                    addrole: [],
                    addroletoeveryone: [],
                    ban: [],
                    channellock: [],
                    channelunlock: [],
                    clear: [],
                    clearbotmessages: [],
                    close: [],
                    copymessage: [],
                    deleterole: [],
                    detailwarn: [],
                    dm: [],
                    editembeds: [],
                    editimgembeds: [],
                    embeds: [],
                    embedbuilder: [],
                    esay: [],
                    giveaway: [],
                    image: [],
                    imgembeds: [],
                    kick: [],
                    mute: [],
                    nickname: [],
                    unlockthread: [],
                    unarchivethread: [],
                    lockthread: [],
                    archivethread: [],
                    leavethread: [],
                    lockchannel: [],
                    unlockchannel: [],
                    jointhread: [],
                    jointhreads: [],
                    setautoarchiveduration: [],
                    tempmute: [],
                    permamute: [],
                    poll: [],
                    react: [],
                    removeallwarns: [],
                    removerole: [],
                    report: [],
                    say: [],
                    slowmode: [],
                    suggest: [],
                    ticket: [],
                    unmute: [],
                    unwarn: [],
                    updatemessage: [],
                    warn: [],
                    warnings: [],
                },
                antilink: {
                    enabled: false,
                    whitelistedchannels: [],
                    mute_amount: 2,
                },
                antidiscord: {
                    enabled: false,
                    whitelistedchannels: [],
                    mute_amount: 2,
                },
                embed: {
                    "color": ee.color,
                    "thumb": true,
                    "wrongcolor": ee.wrongcolor,
                    "footertext": client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid)?.name : ee.footertext,
                    "footericon": client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid)?.iconURL() : ee.footericon,
                },
                logger: {
                    "channel": "no",
                    "webhook_id": "",
                    "webhook_token": ""
                },
                welcome: {
                    captcha: false,
                    roles: [],
                    channel: "nochannel",

                    secondchannel: "nochannel",
                    secondmsg: ":wave: {user} **Welcome to our Server!** :v:",


                    image: true,
                    custom: "no",
                    background: "transparent",
                    frame: true,
                    framecolor: "white",
                    pb: true,
                    invite: true,
                    discriminator: true,
                    membercount: true,
                    servername: true,
                    msg: "{user} Welcome to this Server",


                    dm: false,
                    imagedm: false,
                    customdm: "no",
                    backgrounddm: "transparent",
                    framedm: true,
                    framecolordm: "white",
                    pbdm: true,
                    invitedm: true,
                    discriminatordm: true,
                    membercountdm: true,
                    servernamedm: true,
                    dm_msg: "{user} Welcome to this Server"
                },
                leave: {
                    channel: "nochannel",

                    image: true,
                    custom: "no",
                    background: "transparent",
                    frame: true,
                    framecolor: "white",
                    pb: true,
                    invite: true,
                    discriminator: true,
                    membercount: true,
                    servername: true,
                    msg: "{user} left this Server",


                    dm: true,

                    imagedm: true,
                    customdm: "no",
                    backgrounddm: "transparent",
                    framedm: true,
                    framecolordm: "white",
                    pbdm: true,
                    invitedm: true,
                    discriminatordm: true,
                    membercountdm: true,
                    servernamedm: true,
                    dm_msg: "{user} left this Server"
                },
                song: "https://streams.ilovemusic.de/iloveradio14.mp3",
                djroles: [],
                djonlycmds: ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"],
                botchannel: [],
            });

            dbEnsure(client.jtcsettings, guildid, {
                prefix: ".",
                channel: "",
                channelname: "{user}' Room",
                guild: guildid,
            });
            dbEnsure(client.jtcsettings2, guildid, {
                channel: "",
                channelname: "{user}' Channel",
                guild: guildid,
            });
            dbEnsure(client.jtcsettings3, guildid, {
                channel: "",
                channelname: "{user}' Lounge",
                guild: guildid,
            });
        };

        if (userid) {
            dbEnsure(client.premium, userid, {
                enabled: false,
            })
            dbEnsure(client.queuesaves, userid, {
                "TEMPLATEQUEUEINFORMATION": ["queue", "sadasd"]
            });
            dbEnsure(client.settings, userid, {
                dm: true,
            })
            dbEnsure(client.stats, guildid + userid, {
                ban: [],
                kick: [],
                mute: [],
                ticket: [],
                says: [],
                warn: [],
            })
        };

        if (userid && guildid) {
            dbEnsure(client.stats, guildid + userid, {
                ban: [],
                kick: [],
                mute: [],
                ticket: [],
                says: [],
                warn: [],
            });
            dbEnsure(client.userProfiles, userid, {
                id: userid,
                guild: guildid,
                totalActions: 0,
                warnings: [],
                kicks: []
            });
        };
        return;
    } catch (e) {
        console.log(chalk.grey.bgRed(String(e.stack)));
    }
}