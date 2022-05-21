const Discord = require('discord.js'),
CronJob = require('cron').CronJob;
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ms = require("ms")
const moment = require("moment")
const { dbKeys, dbEnsure, dbRemove } = require("./functions")
module.exports = async client => {
    //function that will run the checks
    client.on("guildMemberAdd", async member => {
        let data = await client.mutes.get("MUTES")
        var unmutes = data?.MUTES?.filter(d => client.guilds.cache.has(d.guild))?.filter(d => d.guild == member.guild.id && d.user == member.user.id)
        if(unmutes) {
            for await (const unmute of unmutes){
                try{
                    await member.roles.add(unmute.role).catch(() => null);
                }catch (e){
                    console.error(e)
                }
            }
        }
    })
    client.Jobmute = new CronJob('*/10 * * * * *', async function() {
        let data = await client.mutes.get("MUTES")
        var unmutes = data?.MUTES?.filter(d => client.guilds.cache.has(d.guild))?.filter(v=>{
            return v.mutetime > 0 && v.mutetime - (Date.now() - v.timestamp) <= 0
        })
        if(unmutes && unmutes.length > 0){
            unmutes.forEach(async muteuser => {
                try{
                    let settings = await client.settings.get(muteuser.guild);
                    let es = settings.embed
                    let ls = settings.language;
                    let guild = client.guilds.cache.get(muteuser.guild)
                    if(!guild) return;
                    let member = guild.members.cache.get(muteuser.user) || await guild.members.fetch(muteuser.user).catch(() => null);
                    if(member && member.roles.cache.has(muteuser.role)) {
                        member.roles.remove(muteuser.role)
                        let channel = guild.channels.cache.get(muteuser.channel);
                        channel.send({embeds: [new Discord.MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["handlers"]["mutejs"]["mute"]["variable1"]))
                            .setDescription(eval(client.la[ls]["handlers"]["mutejs"]["mute"]["variable2"]))]
                        }).catch(() => null)
                    } else if(member){
                        try{
                            member.roles.remove(muteuser.role)
                        }catch (e){ }
                    }
                    await dbRemove(client.mutes, "MUTES.MUTES", v => v.user == muteuser.user)
                }catch (e){
                    console.error(e)
                    await dbRemove(client.mutes, "MUTES.MUTES", v=>v.user == muteuser.user)
                }
            })
        }
    }, null, true, 'Europe/Berlin');
    client.Jobremind = new CronJob("*/10 * * * * *", async function(){
        let data = await client.afkDB.get("REMIND.REMIND") || []
        var reminds_now = data.filter(v => {
            return v.time - (Date.now() - v.timestamp) <= 0
        })
       if(reminds_now && reminds_now.length > 0){
            reminds_now.forEach(async userData => {
                let {content, at, time, guild, user, timestamp, channel, string_of_time} = userData;
                try{
                    let settings = await client.settings.get(guild);
                    let es = settings.embed
                    let ls = settings.language;
                    guild = client.guilds.cache.get(guild)  
                    if(!guild) return;
                    let member = await guild.members.fetch(user).catch(() => null);
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
                        console.error(e)
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
                    await dbRemove(client.afkDB, "REMIND.REMIND", v => v.at == at && v.user == user)
                }catch (e){
                    console.error(e)
                    await dbRemove(client.afkDB, "REMIND.REMIND", v => v.at == at && v.user == user)
                }
            })
        }
    }, null, true, "Europe/Berlin")


    client.on("ready", () => {
        client.Jobmute.start();
        client.Jobremind.start();
    })
}