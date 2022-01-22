const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
const ms = require("ms");
const {
    databasing
} = require(`${process.cwd()}/handlers/functions`);
const backup = require("discord-backup");
module.exports = {
    name: "loadbackup",
    aliases: ["load-backup", "lbackup", "backupload"],
    category: "🚫 Administration",
    description: "Load a Backup of the Server",
    usage: "loadbackup <serverId (usually the same server)> <backupid>",
    type: "server",
    cooldown: 120,
    run: async (client, message, args, cmduser, text, prefix) => {
    
        let server = client.guilds.cache.get(args[0]);
        if(!server) return message.reply(`<:no:833101993668771842> **You forgot to add from which Server i should load the Backup in here**\n> Type: \`${prefix}loadbackup <ServerId> <BackupId>\``)
        if(!server.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply(`<:no:833101993668771842> **I am missing the ADMINISTRATOR Permission in ${server.name}!**`)
        }
        if(!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply(`<:no:833101993668771842> **I am missing the ADMINISTRATOR Permission in ${server.name}!**`)
        }
        let owner = await server.fetchOwner().catch(e=>{
            return message.reply("Could not get owner of target guild")
        })
        let owner2 = await message.guild.fetchOwner().catch(e=>{
            return message.reply("Could not get owner of this guild")
        })
        if(owner.id != cmduser.id || owner2.id != cmduser.id) {
            return message.reply(`<:no:833101993668771842> **You need to be Owner in both Servers!**`)
        }
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        let adminroles = client.settings.get(message.guild.id, "adminroles")
        let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.loadbackup")
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    
                    //console.log(r)
                    client.settings.remove(message.guild.id, r, `cmdadminroles.loadbackup`)
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
        client.backupDB.ensure(server.id, {
            backups: [ ]
        })
        let backups = client.backupDB.get(server.id, "backups")
        if(!backups || backups.length == 0) {
            return message.reply(`<:no:833101993668771842> **There are no Backups in ${server.name}**\nCreate one with: \`${prefix}createbackup\``)
        }
        if(!args[1]) return message.reply(`<:no:833101993668771842> **You forgot to add the Backup Id**\n> Type: \`${prefix}loadbackup <ServerId> <BackupId>\``)
        if(isNaN(args[1]) || Number(args[1]) < 1 || Number(args[1]) > 5) return message.reply(`<:no:833101993668771842> **The Backup Id Must be a Number between 1 and 5**\n> Type: \`${prefix}loadbackup <ServerId> <BackupId>\``)
        if(backups.length < Number(args[1])) {
            return message.reply(`<:no:833101993668771842> **The Provided Backup Id does not exist!**\n> Type: \`${prefix}listbackups\` to see all Backups`)
        }
        let backupData = backups[Number(args[1]) - 1];
        if(!backupData) {
            return message.reply(`<:no:833101993668771842> **The __Provided__ Backup Id does not exist!**\n> Type: \`${prefix}listbackups\` to see all Backups`)
        }
        if(Array.isArray(backupData)) backupData = backupData[0];
        message.channel.send({
            content: `⚠️ **THIS WILL CLEAR ALL CURRENT GUILD DATA!** ⚠️\n> This cannot be undone!`,
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
                    button?.reply({content: `<a:Loading:833101350623117342> Now loading the Backup from \`${server.name}\` to \`${message.guild.name}\`!`}).catch(() => {})
                    // Create the backup
                    backup.load(backupData, message.guild, {
                        clearGuildBeforeRestore: true
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