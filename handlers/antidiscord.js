//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
    MessageEmbed, Permissions
} = require(`discord.js`);
const countermap = new Map()
const ms = require("ms");
const { dbEnsure } = require("./functions");
// link of scam urls taken from: https://github.com/nikolaischunk/discord-phishing-links
const ScamUrls = require("./scamurls.json").links;
module.exports = async (client) => {
    module.exports.messageCreate = (client, message, guild_settings) => {
        checkAntiDiscord(client, message, guild_settings);
        checkAntiDiscordScam(client, message, guild_settings);
    }
    const isInvite = async (guild, code) => {
        return await new Promise((resolve) => {
            guild.invites.fetch().then((invites) => {
                for (const invite of [...invites.values()]) {
                    if (code === invite[0]) {
                        resolve(true)
                        return
                    }
                }
                resolve(false)
            }).catch(() => { })
        })
    }
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if (!newMessage.guild || newMessage.guild.available === false || !newMessage.channel || newMessage.author?.bot) return;
        let guild_settings = await client.settings.get(newMessage.guild.id);
        checkAntiDiscord(client, newMessage, guild_settings)
        checkAntiDiscordScam(client, newMessage, guild_settings);
    })
    async function checkAntiDiscord(client, message, guild_settings) {
        if (!message.guild || message.guild.available === false || message.author?.bot) return;
        try {
            // Define the Settings
            let theSettings = guild_settings;
            //if one of the settings isn't available, ensure and re-get it!
            if (!theSettings || !theSettings.warnsettings || !theSettings.embed || !theSettings.language || !theSettings.adminroles || !theSettings.antidiscord || !theSettings.autowarn) {
                if (!theSettings || !theSettings.autowarn) {
                    await dbEnsure(client.settings, message.guild.id, {
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
                    })
                }
                if (!theSettings || !theSettings.warnsettings) {
                    await dbEnsure(client.settings, message.guild.id, {
                        warnsettings: {
                            ban: false,
                            kick: false,
                            roles: [
                                /*
                                { warncount: 0, roleid: "1212031723081723"}
                                */
                            ]
                        }
                    })
                }
                if (!theSettings || !theSettings.adminroles) {
                    await dbEnsure(client.settings, message.guild.id, {
                        adminroles: [],
                    });
                }
                if (!theSettings || !theSettings.language) {
                    await dbEnsure(client.settings, message.guild.id, {
                        language: "en"
                    });
                }
                if (!theSettings || !theSettings.embed) {
                    await dbEnsure(client.settings, message.guild.id, {
                        embed: ee
                    });
                }
                if (!theSettings || !theSettings.antidiscord) {
                    await dbEnsure(client.settings, message.guild.id, {
                        antidiscord: {
                            enabled: false,
                            whitelistedchannels: [],
                            mute_amount: 2,
                            whitelistedlinks: [
                                "dsc.gg/banditcamp",
                                "discord.gg/djs",
                            ]
                        },
                    });
                }
                theSettings = await client.settings.get(message.guild.id);
            }
            //get the constant variables
            let adminroles = theSettings.adminroles
            let ls = theSettings.language
            let es = theSettings.embed;
            let autowarn = theSettings.autowarn;
            let antisettings = theSettings.antidiscord;
            let mute_amount = antisettings?.mute_amount
            let member = message.member
            let warnsettings = theSettings.warnsettings

            // If it's an admin user
            if (((adminroles && adminroles.length > 0) && [...message.member.roles.cache.values()].length > 0 && message.member.roles.cache?.some(r => adminroles?.includes(r ? r.id : r))) || message.guild.ownerId == message.author?.id || message.member?.permissions?.has("ADMINISTRATOR")) return
            if (!antisettings?.enabled) return
            // If it's a ticket return
            if (await client.isTicket(message.channel.id)) return
            // if It's a whitelisted Channel
            if (antisettings?.whitelistedchannels?.some(r => message.channel.parentId == r || message.channel.id == r)) return

            try {
                const {
                    guild,
                    content
                } = message
                if (content.includes('discord.gg/')) {
                    for (let arg of message.content.toLowerCase().split(" ")) {
                        if (isAllowedUrl(arg, antisettings)) {
                            const code = content.split('discord.gg/')[1]
                            const isOurInvite = await isInvite(guild, code)
                            if (!isOurInvite) {
                                if (!message || !message.deletable) return
                                if (autowarn.antidiscord) {
                                    await dbEnsure(client.userProfiles, message.author?.id, {
                                        id: message.author?.id,
                                        guild: message.guild.id,
                                        totalActions: 0,
                                        warnings: [],
                                        kicks: []
                                    });
                                    const newActionId = await client.modActions.stats().then(d => client.getUniqueID(d.count));
                                    await client.modActions.set(newActionId, {
                                        user: message.author?.id,
                                        guild: message.guild.id,
                                        type: 'warning',
                                        moderator: message.author?.id,
                                        reason: "AntiDiscord Autowarn",
                                        when: new Date().toLocaleString(`de`),
                                        oldhighesrole: message.member.roles ? message.member.roles.highest : `Had No Roles`,
                                        oldthumburl: message.author.displayAvatarURL({
                                            dynamic: true
                                        })
                                    });
                                    // Push the action to the user's warnings
                                    await client.userProfiles.push(message.author?.id + '.warnings', newActionId);
                                    await client.userProfiles.add(message.author?.id + '.totalActions', 1);
                                    await client.stats.push(message.guild.id + message.author?.id + ".warn", new Date().getTime());
                                    const warnIDs = await client.userProfiles.get(message.author?.id + '.warnings')
                                    const modActions = await client.modActions.all();
                                    const warnData = warnIDs.map(id => modActions.find(d => d.ID == id)?.data);
                                    let warnings = warnData.filter(v => v.guild == message.guild.id);
                                    message.channel.send({
                                        embeds: [
                                            new MessageEmbed().setAuthor(client.getAuthor(message.author.tag, message.member.displayAvatarURL({ dynamic: true })))
                                                .setColor("ORANGE").setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({ dynamic: true })))
                                                .setDescription(`> <@${message.author?.id}> **received an autogenerated Warn - \`antidiscord\`**!\n\n> **He now has \`${warnings.length} Warnings\`**`)
                                        ]
                                    }).catch(() => { })
                                    if (warnsettings && warnsettings.kick && warnsettings.kick == warnings.length) {
                                        if (!message.member.kickable)
                                            message.channel.send({
                                                embeds: [new MessageEmbed()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
                                                ]
                                            });
                                        else {
                                            try {
                                                message.member.send({
                                                    embeds: [new MessageEmbed()
                                                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
                                                    ]
                                                });
                                            } catch {
                                                return message.channel.send({
                                                    embeds: [new MessageEmbed()
                                                        .setColor(es.wrongcolor)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
                                                    ]
                                                });
                                            }
                                            try {
                                                message.member.kick({
                                                    reason: `Reached ${warnings.length} Warnings`
                                                }).then(async () => {
                                                    message.channel.send({
                                                        embeds: [new MessageEmbed()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                            .setFooter(client.getFooter(es))
                                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                                                        ]
                                                    });
                                                });
                                            } catch (e) {
                                                console.error(e);
                                                message.channel.send({
                                                    embeds: [new MessageEmbed()
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
                                                embeds: [new MessageEmbed()
                                                    .setColor(es.wrongcolor)
                                                    .setFooter(client.getFooter(es))
                                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
                                                ]
                                            });
                                        else {
                                            try {
                                                message.member.send({
                                                    embeds: [new MessageEmbed()
                                                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                        .setFooter(client.getFooter(es))
                                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
                                                    ]
                                                });
                                            } catch {
                                                message.channel.send({
                                                    embeds: [new MessageEmbed()
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
                                                }).then(async () => {
                                                    message.channel.send({
                                                        embeds: [new MessageEmbed()
                                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                            .setFooter(client.getFooter(es))
                                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                                                        ]
                                                    });
                                                });
                                            } catch (e) {
                                                console.error(e);
                                                message.channel.send({
                                                    embeds: [new MessageEmbed()
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
                                message.delete().catch(() => { })
                                if (!countermap.get(message.author?.id)) countermap.set(message.author?.id, 1)
                                setTimeout(() => {
                                    countermap.set(message.author?.id, Number(countermap.get(message.author?.id)) - 1)
                                    if (Number(countermap.get(message.author?.id)) < 1) countermap.set(message.author?.id, 1)
                                }, 15000)
                                countermap.set(message.author?.id, Number(countermap.get(message.author?.id)) + 1)



                                if (Number(countermap.get(message.author?.id)) > mute_amount) {
                                    let time = 10 * 60 * 1000; let mutetime = time;
                                    let reason = "Discord Links protection";

                                    member.timeout(mutetime, reason).then(async () => {

                                        message.channel.send({
                                            embeds: [new MessageEmbed()
                                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                                .setFooter(client.getFooter(es))
                                                .setTitle(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable1"]).replace("MUTED", "TIMEOUTED"))
                                                .setDescription(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable2"]))
                                            ]
                                        }).catch(() => { });

                                    }).catch(() => {
                                        return message.channel.send(`:x: **I could not timeout ${member.user.tag}**`).then(m => {
                                            setTimeout(() => { m.delete().catch(() => { }) }, 5000);
                                        });
                                    });

                                    countermap.set(message.author?.id, 1)
                                }
                                else {
                                    return message.channel.send({
                                        embeds: [new MessageEmbed()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable5"]))
                                        ]
                                    }).then(msg => {
                                        setTimeout(() => { msg.delete().catch(() => { }) }, 3000)
                                    }).catch(() => { });
                                }
                            } else {
                                // Do nothing ;)
                            }
                        } else {
                        }
                    }
                } else {
                    // Do nothing ;)
                }
            } catch (e) {
                console.log(String(e.stack).grey.bgRed)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.erroroccur)
                        .setDescription(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable6"]))
                    ]
                }).catch(() => { });
            }

        } catch (e) { console.log(String(e).grey) }
    }
    async function checkAntiDiscordScam(client, message, guild_settings) {
        if (!message.guild || message.guild.available === false || message.author?.bot) return;
        try {
            // Define the Settings
            let theSettings = guild_settings;
            //if one of the settings isn't available, ensure and re-get it!
            if (!theSettings || !theSettings.embed || !theSettings.language || !theSettings.antidiscordscam) {
                if (!theSettings || !theSettings.language) {
                    await dbEnsure(client.settings, message.guild.id, {
                        language: "en"
                    });
                }
                if (!theSettings || !theSettings.embed) {
                    await dbEnsure(client.settings, message.guild.id, {
                        embed: ee
                    });
                }
                if (!theSettings || !theSettings.antidiscordscam) {
                    await dbEnsure(client.settings, message.guild.id, {
                        antidiscordscam: {
                            enabled: true,
                            action: "kick", // "mute" / "ban"
                        },
                    });
                }
                theSettings = await client.settings.get(message.guild.id);
            }
            //get the constant variables
            let ls = theSettings.language
            let es = theSettings.embed;
            let antisettings = theSettings.antidiscordscam;
            let member = message.member
            // If it's an admin user
            if (!antisettings?.enabled) return
            try {
                if (!message.content) return;
                if (isScamContent(message.content)) {
                    await message.delete().catch(() => null)
                    
                    if (antisettings.action == "kick") {
                        if (!message.member.kickable){
                            message.channel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(client.getFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true })))
                                    .setTitle(`${message.author.tag} sent a SCAM LINK, but i cannot kick them!`)
                                ]
                            });
                            try { timeoutMember(); } catch (e) { }
                        } else {
                            try {
                                message.member.send({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(`You got kicked from ${message.guild.name} for sending a Scam link!`)
                                    ]
                                }).catch(() => null)
                            } catch { }
                            try {
                                message.member.kick({
                                    reason: `Sent a known Scam Link`
                                }).then(async () => {
                                    message.channel.send({
                                        embeds: [new MessageEmbed()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true })))
                                            .setTitle(`${message.author.tag} Got kicked, because they sent a Discord Scam link!`)
                                        ]
                                    });
                                });
                            } catch (e) {
                                console.error(e);
                                try { timeoutMember(); } catch (e) { }
                                message.channel.send({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(client.la[ls].common.erroroccur)
                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
                                    ]
                                });
                            }
                        }

                    } else if (antisettings.action == "ban") {
                        if (!message.member.bannable){
                            message.channel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(client.getFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true })))
                                    .setTitle(`${message.author.tag} sent a SCAM LINK, but i cannot ban them!`)
                                ]
                            });
                            try { timeoutMember(); } catch (e) { }
                        } else {
                            try {
                                message.member.send({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(`You got banned from ${message.guild.name} for sending a Scam link!`)
                                    ]
                                }).catch(() => null)
                            } catch { }
                            try {
                                message.member.ban({
                                    reason: `Sent a known Scam Link`
                                }).then(async () => {
                                    message.channel.send({
                                        embeds: [new MessageEmbed()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true })))
                                            .setTitle(`${message.author.tag} Got banned, because they sent a Discord Scam link!`)
                                        ]
                                    });
                                });
                            } catch (e) {
                                console.error(e);
                                try { timeoutMember(); } catch (e) { }
                                message.channel.send({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(client.la[ls].common.erroroccur)
                                        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
                                    ]
                                });
                            }
                        }

                    } else {
                        timeoutMember();
                    }
                    async function timeoutMember() {
                        let Mutetime = 24 * 60 * 60 * 1000; 
                        member.timeout(Mutetime, `Sent a known Scam Link`).then(async () => {
                            message.channel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(client.getFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true })))
                                    .setTitle(`${message.author.tag} Got timeouted until <t:${Math.floor((Date.now() + Mutetime) / 1000)}:F>, because they sent a Discord Scam link!`)
                                ]
                            });
                        }).catch(() => {
                            return message.channel.send(`:x: **I could not timeout ${member.user.tag}**`).then(m => {
                                setTimeout(() => { m.delete().catch(() => { }) }, 5000);
                            });
                        });
                    }
                } else {
                    // Do nothing ;)
                }
            } catch (e) {
                console.log(String(e.stack).grey.bgRed)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.erroroccur)
                        .setDescription(eval(client.la[ls]["handlers"]["antidiscordjs"]["antidiscord"]["variable6"]))
                    ]
                }).catch(() => { });
            }

        } catch (e) { console.log(String(e).grey) }
        
        function isScamContent(content) {
            function checkDomain(domainToCheck, susDomain) {
                const checkPath = /\/[^\s]+/;
                // Lets check if the susDomain has a path
                if (checkPath.test(susDomain)) {
                // If so then check for an exact match
                return domainToCheck[1] === susDomain;
                }
                else {
                // If not then check just the domain
                return domainToCheck[2] === susDomain;
                }
            }
            
            function susDomainsChecker(arg) {
            if (ScamUrls.some((domain) => checkDomain(arg, domain))) {
                return true;
            }
            return false;
            };

            // Match urls only
            // Example: https://discordapp.com/test/
            // Group 1: domain + path (discordapp.com/test)
            // Group 2: domain (discordapp.com)
            // Group 3: path (/test)
            const regex = /(?:(?:https?|ftp|mailto):\/\/)?(?:www\.)?(([^\/\s]+\.[a-z\.]+)(\/[^\s]*)?)(?:\/)?/ig;

            let m, susDomainsArgs = [];

            // Extract all the matched urls
            while ((m = regex.exec(content.toLowerCase())) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                susDomainsArgs.push(m);
            }
            
            if(message.guild.id == "748088208427974676") 
                if(susDomainsArgs.some(susDomainsChecker)) 
                    console.log(susDomainsArgs);

            return susDomainsArgs.some(susDomainsChecker);
        }
    }
}

function isAllowedUrl(arg, s) {
    const whiteListed = s.whitelistedlinks || [];
    if (
        !whiteListed.some(link => arg.toLowerCase().includes(link.toLowerCase()) || link.toLowerCase().includes(arg.toLowerCase()))
    )
        return true;
    else return false;
}
