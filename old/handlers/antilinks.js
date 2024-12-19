//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ms = require("ms");
var {
    MessageEmbed, Permissions
} = require(`discord.js`);
let countermap = new Map();
module.exports = client => {
    const {
        isValidURL, delay
    } = require(`./functions`);

    client.on("messageUpdate", (oldMessage, newMessage) => {
        checkAntiLinks(newMessage)
    })
    client.on("messageCreate", message => {
        checkAntiLinks(message)
    })
    async function checkAntiLinks(message){
        try {
            if (!message.guild || message.guild.available === false || message.guild.available === false || !message.channel || message.author.bot) return;
            if (!client.settings.has(message.guild.id, "language")) client.settings.ensure(message.guild.id, {
                language: "en"
            });
            let ls = client.settings.get(message.guild.id, "language")
            client.settings.ensure(message.guild.id, {
                adminroles: [],
            });
            var adminroles = client.settings.get(message.guild.id, "adminroles")
            try {
                if (((adminroles && adminroles.length > 0) && [...message.member.roles.cache.values()].length > 0 && message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) || Array(message.guild.ownerId, config.ownerid).includes(message.author.id) || message.member.permissions.has("ADMINISTRATOR")) return;
                client.settings.ensure(message.guild.id, {
                    antilink: {
                        enabled: false,
                        whitelistedchannels: [],
                        mute_amount: 2,
                        whitelistedlinks: [
                            "giphy.com/gifs",
                            "c.tenor.com",
                            "tenor.com/view",
                            "milrato.dev",
                            "milrato.eu",
                            "github?.com",
                            "mozilla.org",
                            "w3schools.com",
                        ]
                    },
                });
                client.settings.ensure(message.guild.id,{
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
                let autowarn = client.settings.get(message.guild.id, "autowarn");
                let antisettings = client.settings.get(message.guild.id, `antilink`)
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
                let es = client.settings.get(message.guild.id, "embed");
                try {
                    if (!message.content) return;
                    for (let arg of message.content.toLowerCase().split(" ")) {
                        if (isValidURL(arg) && isAllowedUrl(arg, antisettings)) {


                            if (antisettings.whitelistedchannels.some(r => message.channel.parentId == r || message.channel.id == r)) return;
                            if (message.content.includes("```")) {
                                try {
                                    message.author.send(message.content.substring(0, 2000)).catch((e) => {
                                        console.log(String(e))
                                    })
                                    message.author.send(`It seems like you sent a code in ${message.channel} **${message.guild.name}**, but it contains a Link, which isn't allowed!`).catch((e) => {
                                        console.log(String(e))
                                    })
                                } catch (e) {
                                    console.log(String(e))
                                }
                            }
                            if(autowarn.antilinks){
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
                                        reason: "Antilinks Autowarn",
                                        when: new Date().toLocaleString(`de`),
                                        oldhighesrole: message.member.roles ? message.member.roles.highest : `Had No Roles`,
                                        oldthumburl: message.author.displayAvatarURL({
                                            dynamic: true
                                        })
                                    });
                                    // Push the action to the user's warnings
                                    client.userProfiles.push(message.author.id, newActionId, 'warnings');
                                    client.userProfiles.inc(message.author.id, 'totalActions');
                                    client.stats.push(message.guild.id+message.author.id, new Date().getTime(), "warn"); 
                                    const warnIDs = client.userProfiles.get(message.author.id, 'warnings')
                                    const warnData = warnIDs.map(id => client.modActions.get(id));
                                    let warnings = warnData.filter(v => v.guild == message.guild.id);
                                    message.channel.send({
                                        embeds: [
                                            new MessageEmbed().setAuthor(client.getAuthor(message.author.tag, message.member.displayAvatarURL({dynamic: true})))
                                            .setColor("ORANGE").setFooter(client.getFooter("ID: "+ message.author.id, message.author.displayAvatarURL({dynamic:true})))
                                            .setDescription(`> <@${message.author.id}> **received an autogenerated Warn - \`antilinks\`**!\n\n> **He now has \`${warnings.length} Warnings\`**`)
                                        ]
                                    });
                                    let warnsettings = client.settings.get(message.guild.id, "warnsettings")
                                    if(warnsettings.kick && warnsettings.kick == warnings.length){
                                    if (!message.member.kickable)
                                        message.channel.send({embeds :[new MessageEmbed()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
                                        ]});
                                    else {
                                        try{
                                        message.member.send({embeds : [new MessageEmbed()
                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
                                        ]});
                                        } catch{
                                        return message.channel.send({embeds :[new MessageEmbed()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
                                        ]});
                                        }
                                        try {
                                        message.member.kick({
                                            reason: `Reached ${warnings.length} Warnings`
                                        }).then(() => {
                                            message.channel.send({embeds :[new MessageEmbed()
                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                                            ]});
                                        });
                                        } catch (e) {
                                        console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                        message.channel.send({embeds : [new MessageEmbed()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(client.la[ls].common.erroroccur)
                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
                                        ]});
                                        }
                                    }
                                        
                                    }
                                    if(warnsettings.ban && warnsettings.ban == warnings.length){
                                    if (!message.member.bannable)
                                        message.channel.send({embeds : [new MessageEmbed()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
                                        ]});
                                        else {
                                        try{
                                        message.member.send({embeds :[new MessageEmbed()
                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
                                        ]});
                                        } catch {
                                        message.channel.send({embeds :[new MessageEmbed()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable18"]))
                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable19"]))
                                        ]});
                                        }
                                        try {
                                        message.member.ban({
                                            reason: `Reached ${warnings.length} Warnings`
                                        }).then(() => {
                                            message.channel.send({embeds :[new MessageEmbed()
                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                                            ]});
                                        });
                                        } catch (e) {
                                        console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                        message.channel.send({embeds :[new MessageEmbed()
                                            .setColor(es.wrongcolor)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
                                        ]});
                                        }}
                                    }
                                    for(const role of warnsettings.roles){
                                    if(role.warncount == warnings.length){
                                        if(!message.member.roles.cache.has(role.roleid)){
                                        message.member.roles.add(role.roleid).catch((O)=>{})
                                        }
                                    }
                                    }
                            }
                            await message.delete().catch(e => console.log("PREVENTED A BUG"))

                            if (!countermap.get(message.author.id)) countermap.set(message.author.id, 1)
                            setTimeout(() => {
                                countermap.set(message.author.id, Number(countermap.get(message.author.id)) - 1)
                                if (Number(countermap.get(message.author.id)) < 1) countermap.set(message.author.id, 1)
                            }, 15000)
                            countermap.set(message.author.id, Number(countermap.get(message.author.id)) + 1)



                            if (Number(countermap.get(message.author.id)) > mute_amount) {
                                let time = 10 * 60 * 1000; let mutetime = time;
                                let reason = "Sending too many Links in a Short Time";
                                
                                member.timeout(mutetime, reason).then(() => {
                                    message.channel.send({
                                        embeds: [new MessageEmbed()
                                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                            .setFooter(client.getFooter(es))
                                            .setTitle(eval(client.la[ls]["handlers"]["antilinksjs"]["antilinks"]["variable1"]))
                                            .setDescription(eval(client.la[ls]["handlers"]["antilinksjs"]["antilinks"]["variable2"]))
                                        ]
                                    }).catch(() => {});
                                }).catch(() => {
                                    return message.channel.send(`:x: **I could not timeout ${member.user.tag}**`).then(m => {
                                        setTimeout(() => { m.delete().catch(() => {}) }, 5000);
                                    });
                                });

                                countermap.set(message.author.id, 1)
                            } else {
                                await message.channel.send({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls]["handlers"]["antilinksjs"]["antilinks"]["variable5"]))
                                    ]
                                }).then(msg => setTimeout(() => {
                                    msg.delete().catch(() => {})
                                }, 3000)).catch(() => {});
                            }
                        } else {
                            // Do nothing ;)
                        }

                    }
                } catch (e) {
                    console.log(String(e.stack).grey.bgRed)
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].common.erroroccur)
                            .setDescription(eval(client.la[ls]["handlers"]["antilinksjs"]["antilinks"]["variable6"]))
                        ]
                    }).catch(() => {});
                }
            } catch {
                return;
            }
        } catch (e) {
            console.log(String(e).grey)
        }
    }
}
function isAllowedUrl(arg, s) {
    if (!arg.includes("discord.com") &&
        !s.whitelistedlinks.some(link => arg.toLowerCase().includes(link.toLowerCase()) || link.toLowerCase().includes(arg.toLowerCase())) &&
        !arg.includes("discordapp.com") &&
        !arg.includes("discord.gg") &&
        !arg.includes("discord.gg") &&
        !arg.toLowerCase().includes(".gif") &&
        !arg.toLowerCase().includes(".mp4") &&
        !arg.toLowerCase().includes(".png") &&
        !arg.toLowerCase().includes(".jpg") &&
        !arg.toLowerCase().includes(".webp") &&
        !arg.toLowerCase().includes(".gifv") &&
        !arg.toLowerCase().includes(".webm"))
        return true;
    else return false;
}