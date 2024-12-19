const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
const ms = require("ms");
const moment = require("moment");
const {
    databasing, swap_pages
} = require(`${process.cwd()}/handlers/functions`);
const backup = require("discord-backup");
module.exports = {
    name: "listbackups",
    aliases: ["list-backups"],
    category: "🚫 Administration",
    description: "Shows all Backups of the Server",
    usage: "listbackups [ServerID]",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix) => {
        
        let server = client.guilds.cache.get(args[0]) || message.guild;
        if(!server.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply(`<:no:833101993668771842> **I am missing the ADMINISTRATOR Permission in ${server.name}!**`)
        }

        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        let adminroles = client.settings.get(message.guild.id, "adminroles")
        let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.listbackups")
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    
                    //console.log(r)
                    client.settings.remove(message.guild.id, r, `cmdadminroles.listbackups`)
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
            return message.reply(`<:no:833101993668771842> **There are no Backups in ${server.name}**`)
        }
        message.reply({embeds: [
            new MessageEmbed()
            .setColor(es.color)
            .setTitle(`Backups of ${server.name}`)
            .setThumbnail(server.iconURL({dynamic: true}))
            .setFooter(client.getFooter("ID: " + server.id, server.iconURL({dynamic: true})))
            .setDescription(backups.sort((a,b)=>b?.createdTimestamp - a.createdTimestamp).map((b, index)=>`> **Created at:** \`${moment(b?.createdTimestamp).format("DD/MM/YYYY HH:mm")}\`\n> **Roles:** \`${b?.roles.length}\`\n> **Channels:** \`${(b?.channels.categories && b?.channels.categories.length > 0 ? b?.channels.categories.map(c=>c.children.length).reduce((a, b) => a + b) : 0) + b?.channels.categories.length + b?.channels.others.length}\`\n> **\`${prefix}loadbackup ${server.id} ${index + 1}\`**\n`).join("\n"))
        ]})
    

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