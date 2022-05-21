const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`../../botconfig/config.json`)
const ms = require("ms");
const {
    databasing, dbEnsure
} = require(`../../handlers/functions`);
const backup = require("discord-backup");
module.exports = {
    name: "loadbackup",
    aliases: ["load-backup", "lbackup", "backupload"],
    category: "🚫 Administration",
    description: "Load a Backup of the Server",
    usage: "loadbackup <serverId (usually the same server)> <backupid>",
    type: "server",
    cooldown: 120,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
        let server = await client.getGuildData(args[0]);
        if(!server) return message.reply(`:x: **You forgot to add from which Server i should load the Backup in here**\n> Type: \`${prefix}loadbackup <ServerId> <BackupId>\``)
        if(message.guild.me && !message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply(`:x: **I am missing the ADMINISTRATOR Permission in ${message.guild.name}!**`)
        }
        if(server.ownerId != cmduser.id || message.guild.ownerId != cmduser.id) {
            return message.reply(`:x: **You need to be Owner in both Servers!**`)
        }
        
        let adminroles = GuildSettings?.adminroles || [];
        let cmdroles = GuildSettings?.cmdadminroles?.loadbackup || [];
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    const File = `loadbackup`;
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
        await dbEnsure(client.backupDB, server.id, {
            backups: [ ]
        })
        let backups = await client.backupDB.get(server.id+".backups")
        if(!backups || backups.length == 0) {
            return message.reply(`:x: **There are no Backups in ${server.name}**\nCreate one with: \`${prefix}createbackup\``)
        }
        if(!args[1]) return message.reply(`:x: **You forgot to add the Backup Id**\n> Type: \`${prefix}loadbackup <ServerId> <BackupId>\``)
        if(isNaN(args[1]) || Number(args[1]) < 1 || Number(args[1]) > 5) return message.reply(`:x: **The Backup Id Must be a Number between 1 and 5**\n> Type: \`${prefix}loadbackup <ServerId> <BackupId>\``)
        if(backups.length < Number(args[1])) {
            return message.reply(`:x: **The Provided Backup Id does not exist!**\n> Type: \`${prefix}listbackups\` to see all Backups`)
        }
        let backupData = backups[Number(args[1]) - 1];
        if(!backupData) {
            return message.reply(`:x: **The __Provided__ Backup Id does not exist!**\n> Type: \`${prefix}listbackups\` to see all Backups`)
        }
        if(Array.isArray(backupData)) backupData = backupData[0];
        message.channel.send({
            content: `⚠️ **THIS WILL CLEAR ALL CURRENT GUILD DATA!** ⚠️\n> This cannot be undone!`,
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
                    button?.reply({content: `<a:Loading:950883677255118898> Now loading the Backup from \`${server.name}\` to \`${message.guild.name}\`!`}).catch(() => null)
                    // Create the backup
                    backup.load(backupData, message.guild, {
                        clearGuildBeforeRestore: true
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