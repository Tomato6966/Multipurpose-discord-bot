const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
const ms = require("ms");
const {
    databasing
} = require(`${process.cwd()}/handlers/functions`);
const backup = require("discord-backup");
module.exports = {
    name: "createbackup",
    aliases: ["create-backup", "cbackup", "backup"],
    category: "🚫 Administration",
    description: "Create a Backup of the Server",
    usage: "createbackup",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix) => {
    
        if(!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply("<:no:833101993668771842> **I am missing the ADMINISTRATOR Permission!**")
        }
        let owner = await message.guild.fetchOwner().catch(e=>{
            return message.reply("Could not get owner of target guild")
        })
        if(owner.id != cmduser.id) {
            return message.reply(`<:no:833101993668771842> **You need to be the Owner of this Server!**`)
        }
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        let adminroles = client.settings.get(message.guild.id, "adminroles")
        let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.createbackup")
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    
                    //console.log(r)
                    client.settings.remove(message.guild.id, r, `cmdadminroles.createbackup`)
                }
            }
        }
        if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
            return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable1"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable2"]))
            ]});
        client.backupDB.ensure(message.guild.id, {
            backups: [ ]
        })
        message.channel.send({
            content: `⚠️ **THIS WILL SAVE ALL DATA** ⚠️\n> If there are more then 6 Backups, the oldest one will get deleted!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`,
            components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setStyle("DANGER").setLabel("Continue").setCustomId("verified")])]
        }).then(msg => {
            //Create the collector
            const collector = msg.createMessageComponentCollector({ 
                filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                time: 90000
            })
            //Menu Collections
            collector.on('collect', button => {
                if (button?.user.id === cmduser.id) {
                    collector.stop();
                    button?.reply({content: `<a:Loading:833101350623117342> **Now saving the Backup!**\nThis could take up to 2 Minutes (belongs to your data amount)`}).catch(() => {})
                    // Create the backup
                    backup.create(message.guild, {
                        maxMessagesPerChannel: 10,
                        jsonSave: false,
                        saveImages: "base64",
                        jsonBeautify: true
                    }).then((backupData) => {
                        let backups = client.backupDB.get(message.guild.id, "backups")
                        backups.push(backupData);
                        backups = backups.sort((a,b)=>b?.createdTimestamp - a.createdTimestamp)
                        if(backups.length > 5) backups = backups.slice(0, 5);
                        client.backupDB.set(message.guild.id, backups, "backups")
                        // And send informations to the backup owner
                        message.author.send(`<a:yes:833101995723194437> **Backup successfully created.**\n\n**To Load it type:**\n> \`${prefix}loadbackup ${message.guild.id} 1\` ... note 1 is the latest backup, the higher the number the older (5 is the highest) \`${prefix}listbackups ${message.guild.id}\`!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`).catch(e=>{
                            message.channel.send(`<a:yes:833101995723194437> **Backup successfully created.**\n\n**To Load it type:**\n> \`${prefix}loadbackup ${message.guild.id} 1\` ... note 1is the latest backup, the higher the number the older (5 is the highest) \`${prefix}listbackups ${message.guild.id}\`!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`);
                        }).then(()=>{
                            message.channel.send(`<a:yes:833101995723194437> **Backup successfully created.** The backup ID was sent in dm!\n\n> *Have you tried: \`${prefix}setup-autobackup\`, to enable auto backups?*`);
                        })
                    }).catch(e=>{
                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                }
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
                msg.edit({components: [], content: msg.content}).catch(() => {})
            });
        })

        if(client.settings.get(message.guild.id, `adminlog`) != "no"){
            try{
              var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
              if(!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
              channel.send({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable49"]))
                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
               .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
              ]})
            }catch (e){
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
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