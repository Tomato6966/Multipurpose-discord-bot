const { MessageEmbed } = require("discord.js");
const { dbEnsure } = require("./functions")
module.exports = async client => {
    let messageIds = new Map();
    module.exports.messageCreate = async (client, message, guild_settings) => {
        if (!message.guild || message.guild.available === false || message.author?.bot) return;
        if(!message.guild || message.guild.available === false) return;
        let data = guild_settings
        if(!data.ghost_ping_detector_max_time) {
            await dbEnsure(client.settings, message.guild.id, {
                ghost_ping_detector: false,
                ghost_ping_detector_max_time: 10000,
            })
            data = {
                ghost_ping_detector: false,
                ghost_ping_detector_max_time: 10000,
            }
        }
        if(data.ghost_ping_detector && message.mentions && ((message.mentions.users && message.mentions.users.size > 0)))
        {
            messageIds.set(message.id, Date.now());
            setTimeout(() => {
                if(messageIds.has(message.id)){
                    messageIds.delete(message.id);
                }
            }, data.ghost_ping_detector_max_time)
        }
    }
    client.on("messageDelete", async (message) => {
        if(!message.guild || message.guild.available === false || !message.author) return;

        // Define the Settings
        let data = await client.settings.get(message.guild.id)
        //if one of the settings isn't available, ensure and re-get it!
        if (!data || !data.warnsettings || !data.embed || !data.language || !data.adminroles || !data.ghost_ping_detector_max_time || !data.ghost_ping_detector || !data.autowarn) {
            if (!data || !data.autowarn) {
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
            if (!data || !data.warnsettings) {
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
            if (!data || !data.adminroles) {
                await dbEnsure(client.settings, message.guild.id, {
                    adminroles: [],
                });
            }
            if (!data || !data.language) {
                await dbEnsure(client.settings, message.guild.id, {
                    language: "en"
                });
            }
            if (!data || !data.embed) {
                await dbEnsure(client.settings, message.guild.id, {
                    embed: ee
                });
            }
            if (!data || !data.ghost_ping_detector_max_time || !data.ghost_ping_detector) {
                await dbEnsure(client.settings, message.guild.id, {
                    ghost_ping_detector: false,
                    ghost_ping_detector_max_time: 10000,
                });
            }
            data = await client.settings.get(message.guild.id);
        }
        //get the constant variables
        let adminroles = data.adminroles
        let ls = data.language
        let es = data.embed;
        let autowarn = data.autowarn;
        let member = message.member
        let warnsettings = data.warnsettings

        // If it's an admin user
        if (((adminroles && adminroles.length > 0) && [...message.member.roles.cache.values()].length > 0 && message.member.roles.cache?.some(r => adminroles?.includes(r ? r.id : r))) || message.guild.ownerId == message.author?.id || message.member?.permissions?.has("ADMINISTRATOR")) return;
        
        if(data.ghost_ping_detector && messageIds.has(message.id) && Date.now() - messageIds.get(message.id) <= data.ghost_ping_detector_max_time){
           
            if(autowarn.ghost_ping_detector){
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
                    reason: "Ghostping Autowarn",
                    when: new Date().toLocaleString(`de`),
                    oldhighesrole: message.member.roles ? message.member.roles.highest : `Had No Roles`,
                    oldthumburl: message.author.displayAvatarURL({
                        dynamic: true
                    })
                });
                // Push the action to the user's warnings
                await client.userProfiles.push(message.author?.id+'.warnings', newActionId);
                await client.userProfiles.add(message.author?.id+'.totalActions', 1);
                await client.stats.push(message.guild.id+message.author?.id+".warn", new Date().getTime()); 
                const warnIDs = await client.userProfiles.get(message.author?.id+'.warnings')
                const modActions = await client.modActions.all();
                const warnData = warnIDs.map(id => modActions.find(d => d.ID == id)?.data);
                let warnings = warnData.filter(v => v.guild == message.guild.id);
                    message.channel.send({
                        embeds: [
                            new MessageEmbed().setAuthor(client.getAuthor(message.author.tag, message.member.displayAvatarURL({dynamic: true})))
                            .setColor("ORANGE").setFooter(client.getFooter("ID: "+ message.author?.id, message.author.displayAvatarURL({dynamic:true})))
                            .setDescription(`> <@${message.author?.id}> **received an autogenerated Warn - \`Ghost Ping Detector\`**!\n\n> **He now has \`${warnings.length} Warnings\`**`)
                        ]
                    });
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
                        }).then(async () => {
                            message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                            ]});
                        });
                        } catch (e) {
                        console.error(e);
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
                        }).then(async () => {
                            message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                            ]});
                        });
                        } catch (e) {
                        console.error(e);
                        message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
                        ]});
                        }}
                    }
                    for await (const role of warnsettings.roles){
                    if(role.warncount == warnings.length){
                        if(!message.member.roles.cache.has(role.roleid)){
                        message.member.roles.add(role.roleid).catch(() => null)
                        }
                    }
                    }
            }
            let channel = message.guild.channels.cache.get(data.ghost_ping_detector);
            if(!channel) channel = await message.guild.channels.fetch(data.ghost_ping_detector).catch(() => null) || false;
            if(!channel) return client.settings.set(message.guild.id, false, "ghost_ping_detector");
            channel.send({embeds: [
                new MessageEmbed()
                .setFooter(client.getFooter("ID:" + message.author?.id, message.member.displayAvatarURL({dynamic: true})))
                .setColor("ORANGE").setTitle("GHOST-PING-DETECTED").setDescription(`**Message-Author:**\n> ${message.author} | ${message.author.tag} (\`${message.author?.id}\`)\n**Channel:**\n> ${message.channel} | ${message.channel.name} (\`${message.channel.id}\`)\n**Time-for-Deletion:**\n> \`${Math.floor((Date.now() - messageIds.get(message.id)) / 1000)} Seconds\`\n\n**[${message.mentions.users.size}] Ping${message.mentions.users.size == 1 ? "" : "s"}:**\n> ${message.mentions.users.map(p => `${p}`).join(", ")}`.substring(0, 2048)).setTimestamp()
            ]}).catch(console.log);
            if(messageIds.has(message.id)){
                messageIds.delete(message.id);
            }
        }
    })
}