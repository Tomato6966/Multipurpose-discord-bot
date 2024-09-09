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

export function simple_databasing(client: ExtendedClient, guildid: string, userid: string) {
    if (!client || client == undefined || !client.user || client.user == undefined) return;
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