const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`../../botconfig/config.json`)
const ms = require("ms");
const {
    databasing, dbEnsure
} = require(`../../handlers/functions`);
const backup = require("discord-backup");
module.exports = {
    name: "createbackup",
    aliases: ["create-backup", "cbackup", "backup"],
    category: "🚫 Administration",
    description: "Create a Backup of the Server",
    usage: "createbackup",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
        if(!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply(":x: **I am missing the ADMINISTRATOR Permission!**")
        }
        let owner = await message.guild.fetchOwner().catch(e=>{
            return message.reply("Could not get owner of target guild")
        })
        if(owner.id != cmduser.id) {
            return message.reply(`:x: **You need to be the Owner of this Server!**`)
        }
        
        let adminroles = GuildSettings?.adminroles || [];
        let cmdroles = GuildSettings?.cmdadminroles?.createbackup || [];
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    const File = `createbackup`;
                    let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
                    if(index > -1) {
                      GuildSettings.cmdadminroles[File].splice(index, 1);
                      client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
                    }
                }
            }
        }
        if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
            return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable1"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable2"]))
            ]});
        await dbEnsure(client.backupDB, message.guild.id, {
            backups: [ ]
        })
        message.channel.send({
            content: `⚠️ **THIS WILL SAVE ALL DATA** ⚠️\n> If there are more then 6 Backups, the oldest one will get deleted!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`,
            components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setStyle("DANGER").setLabel("Continue").setCustomId("verified")])]
        }).then(async (msg) => {
            //Create the collector
            const collector = msg.createMessageComponentCollector({ 
                filter: i => i?.isButton() && i?.message.author?.id == client.user.id && i?.user,
                time: 90000
            })
            //Menu Collections
            collector.on('collect', button => {
                if (button?.user.id === cmduser.id) {
                    collector.stop();
                    button?.reply({content: `<a:Loading:950883677255118898> **Now saving the Backup!**\nThis could take up to 2 Minutes (belongs to your data amount)`}).catch(() => null)
                    // Create the backup
                    backup.create(message.guild, {
                        maxMessagesPerChannel: 10,
                        jsonSave: false,
                        saveImages: "base64",
                        jsonBeautify: true
                    }).then(async (backupData) => {
                        let backups = await client.backupDB.get(message.guild.id+".backups")
                        backups.push(backupData);
                        backups = backups.sort((a,b)=>b?.createdTimestamp - a.createdTimestamp)
                        if(backups.length > 5) backups = backups.slice(0, 5);
                        await client.backupDB.set(message.guild.id+".backups",backups)
                        // And send informations to the backup owner
                        message.author.send(`:white_check_mark: **Backup successfully created.**\n\n**To Load it type:**\n> \`${prefix}loadbackup ${message.guild.id} 1\` ... note 1 is the latest backup, the higher the number the older (5 is the highest) \`${prefix}listbackups ${message.guild.id}\`!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`).catch(e=>{
                            message.channel.send(`:white_check_mark: **Backup successfully created.**\n\n**To Load it type:**\n> \`${prefix}loadbackup ${message.guild.id} 1\` ... note 1is the latest backup, the higher the number the older (5 is the highest) \`${prefix}listbackups ${message.guild.id}\`!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`);
                        }).then(()=>{
                            message.channel.send(`:white_check_mark: **Backup successfully created.** The backup ID was sent in dm!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`);
                        })
                    }).catch(e=>{
                        console.error(e)
                    })
                }
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
                msg.edit({components: [], content: msg.content}).catch(() => null)
            });
        })

        if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
            try{
              var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
              if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
              channel.send({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable49"]))
                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
               .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
              ]})
            }catch (e){
              console.error(e)
            }
          } 
    }
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}