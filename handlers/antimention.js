//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const ms = require("ms");
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
    MessageEmbed, Permissions
} = require(`discord.js`);
const { databasing, delay } = require(`./functions`)
const countermap = new Map()
module.exports = client => {
  
    client.on("messageUpdate", (oldMessage, newMessage) => {
        checkAntiMention(newMessage)
    })
    client.on("messageCreate", message => {
        checkAntiMention(message)
    })
    async function checkAntiMention(message){
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            let ls = client.settings.get(message.guild.id, "language")
            client.settings.ensure(message.guild.id, {
                adminroles: [],
            });
            var adminroles = client.settings.get(message.guild.id, " ")
            if ( ((adminroles && adminroles.length > 0) && [...message.member.roles.cache.values()].length > 0 && message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) || Array(message.guild.ownerId, config.ownerid).includes(message.author.id) || message.member.permissions.has("ADMINISTRATOR") )
                return;
            client.settings.ensure(message.guild.id, {
                antimention: {
                    enabled: true,
                    whitelistedchannels: [],
                    mute_amount: 2,
                    limit: 5
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
            let antimention = client.settings.get(message.guild.id, "antimention")
            if (antimention.whitelistedchannels.some(r=> message.channel.parentId == r || message.channel.id == r)) return;
            let mute_amount = antimention.mute_amount
            let member = message.member
            if(!antimention.enabled) return;
            let es = client.settings.get(message.guild.id, "embed");
            if(!message.content) return;
            try {
                let rolementions = message.mentions.roles.size;
                let usermentions = message.mentions.users.size;
                let allmentions = rolementions + usermentions;
                if(allmentions > antimention.limit){
                    if(autowarn.antimention){
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
                                reason: "Antimention Autowarn",
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
                                    .setDescription(`> <@${message.author.id}> **received an autogenerated Warn - \`antimention\`**!\n\n> **He now has \`${warnings.length} Warnings\`**`)
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
                    await message.delete().catch(() => {})

                    if (!countermap.get(message.author.id)) countermap.set(message.author.id, 1)
                    setTimeout(() => {
                        countermap.set(message.author.id, Number(countermap.get(message.author.id)) - 1)
                        if (Number(countermap.get(message.author.id)) < 1) countermap.set(message.author.id, 1)
                    }, 15000)
                    countermap.set(message.author.id, Number(countermap.get(message.author.id)) + 1)

                    if (Number(countermap.get(message.author.id)) > mute_amount) {
                        let time = 10 * 60 * 1000; let mutetime = time;
                        let reason = "Mentioning too Many People in a short period of time";
                        
                        member.timeout(mutetime, reason).then(() => {   
                            message.channel.send({embeds: [new MessageEmbed()
                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                .setFooter(client.getFooter(es))
                                .setTitle(`${member.user.tag} got muted for spamming pings`)
                                .setDescription(`He/She/They will get unmuted after 10 Mins`)
                            ]}).catch(() => {});
                        }).catch(() => {
                            return message.channel.send(`:x: **I could not timeout ${member.user.tag}**`).then(m => {
                                setTimeout(() => { m.delete().catch(() => {}) }, 5000);
                            });
                        });

                        countermap.set(message.author.id, 1)
                    }
                    else {
                        return message.channel.send({embeds: [new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(`${member.user.tag} Stop pinging so many Members/Roles`)
                            .setDescription(`You pinged ${allmentions} but you are allowed to only ping ${antimention.limit} Roles/Members / Message`)
                        ]}).then(msg => setTimeout(()=>{msg.delete().catch(() => {})}, 3000)).catch(() => {});
                    }
                } else {
                    // Do nothing ;)
                }
            } catch (e) {
                console.log(String(e.stack).grey.bgRed)
                return message.channel.send({embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.erroroccur)
                    .setDescription(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable7"]))
                ]}).catch(() => {});
            }
        }catch(e){console.log(String(e).grey)}
    }
}