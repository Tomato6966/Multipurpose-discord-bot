const Discord = require('discord.js'),
CronJob = require('cron').CronJob;
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ms = require("ms")
const moment = require("moment")
module.exports = async client => {
 //function that will run the checks
    client.on("guildMemberAdd", async member => {
        client.mutes.ensure("MUTES", {
          MUTES: []
        })
        let data = client.mutes.get("MUTES")
        var unmutes = data.MUTES.filter(d => d.guild == member.guild.id && d.user == member.user.id)
        if(unmutes) {
            for(const unmute of unmutes){
                try{
                    member.roles.add(unmute.role).catch(() => {});
                }catch (e){
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                }
            }
        }
    })
    client.Jobmute = new CronJob('*/5 * * * * *', async function() {
        client.mutes.ensure("MUTES", {
            MUTES: []
        })
        let data = client.mutes.get("MUTES")
        var unmutes = data.MUTES.filter(v=>{
            return v.mutetime > 0 && v.mutetime - (Date.now() - v.timestamp) <= 0
        })
        if(unmutes && unmutes.length > 0){
            unmutes.forEach(async muteuser => {
                try{
                    let es = client.settings.get(muteuser.guild, "embed")
                    if(!client.settings.has(muteuser.guild, "language")) client.settings.ensure(muteuser.guild, { language: "en" });
                    let ls = client.settings.get(muteuser.guild, "language");
                    let guild = client.guilds.cache.get(muteuser.guild)
                    let member = guild.members.cache.get(muteuser.user);
                    if(!member) member = await guild.members.fetch(muteuser.user).catch(() => {});
                    if(member && member.roles.cache.has(muteuser.role)) {
                        member.roles.remove(muteuser.role)
                        let channel = guild.channels.cache.get(muteuser.channel);
                        channel.send({embeds: [new Discord.MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["handlers"]["mutejs"]["mute"]["variable1"]))
                            .setDescription(eval(client.la[ls]["handlers"]["mutejs"]["mute"]["variable2"]))]
                        }).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
                    } else if(member){
                        try{
                            member.roles.remove(muteuser.role)
                        }catch (e){ }
                    }
                    client.mutes.remove("MUTES", v => v.user == muteuser.user, "MUTES")
                }catch (e){
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    client.mutes.remove("MUTES", v=>v.user == muteuser.user, "MUTES")
                }
            })
        }
    }, null, true, 'America/Los_Angeles');
    client.Jobremind = new CronJob("*/5 * * * * *", async function(){
        let data = client.afkDB.get("REMIND")
        if(!data) {
            client.afkDB.ensure("REMIND", {
                REMIND: []
            });
            data = [];
        }
        var reminds_now = data.REMIND.filter(v=>{
            return v.time - (Date.now() - v.timestamp) <= 0
        })
       if(reminds_now && reminds_now.length > 0){
            reminds_now.forEach(async userData => {
                let {content, at, time, guild, user, timestamp, channel, string_of_time} = userData;
                try{
                    let es = client.settings.get(guild, "embed")
                    let ls = client.settings.get(guild, "language");
                    
                    guild = client.guilds.cache.get(guild)  
                    let member = await guild.members.fetch(user).catch(() => {});
                    let message = {
                        guild: {
                            name: guild.name
                        },
                        channel: {
                            id: channel
                        }
                    }
                    member.send({embeds: [new Discord.MessageEmbed()
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable12"]))
                      .addField(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variablex_13"]), eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable13"]))
                      .addField("Created at:", `\`${at}\``)
                      .setDescription(content)
                    ]}).catch(e=>{
                        console.log(e.stack ? String(e.stack).grey : String(e).grey);
                        let channel = guild.channels.cache.get(channel);
                        if(channel){
                            channel.send({embeds: [new Discord.MessageEmbed()
                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                .setFooter(client.getFooter(es))
                                .setTitle(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable12"]))
                                .addField(eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variablex_13"]), eval(client.la[ls]["cmds"]["schoolcommands"]["remind"]["variable13"]))
                                .addField("Created at:", `\`${now}\``)
                                .setDescription(content)
                              ], content: `<@${member.id}>`})
                        }
                    })
                    client.afkDB.remove("REMIND", v => v.at == at && v.user == user, "REMIND")
                }catch (e){
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    client.afkDB.remove("REMIND", v => v.at == at && v.user == user, "REMIND")
                }
            })
        }
    }, null, true, "America/Los_Angeles")


    client.on("ready", () => {
        client.Jobmute.start();
        client.Jobremind.start();
    })
}