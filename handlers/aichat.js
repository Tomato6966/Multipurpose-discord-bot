//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
    MessageEmbed, MessageAttachment, User, Permissions
} = require(`discord.js`);
const { databasing } = require(`./functions`)
const fetch = require("node-fetch")
module.exports = client => {
    // CMD
    client.on("messageCreate", async message => {
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            client.settings.ensure(message.guild.id, {
                aichat: "no",
            });
            let chatbot = client.settings.get(message.guild.id, "aichat");
            if(!chatbot || chatbot == "no") return;
            if(message.channel.id == chatbot){
              if(message.attachments.size > 0)
              {
                  const attachment = new MessageAttachment("https://cdn.discordapp.com/attachments/816645188461264896/826736269509525524/I_CANNOT_READ_FILES.png")
                  return message.channel.send({files: [attachment]})
              }
              try{
                fetch(`http://api.brainshop.ai/get?bid=153861&key=0ZjvbPWKAxJvcJ96&uid=1&msg=${encodeURIComponent(message)}`)
                .then(res => res.json())
                .then(data => {
                  message.channel.send({content: data.cnt}).catch(() => {})
                });
              }catch (e){
                message.channel.send({content: "<:no:833101993668771842> AI CHAT API IS DOWN"}).catch(() => {})
              }
            }
        }catch(e){console.log(String(e).grey)}
    })
    // AFK SYSTEM
    client.on("messageCreate", async message => {
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot ) return;
            for(const user of [...message.mentions.users.values()]){
                if(client.afkDB.has(message.guild.id + user.id)){
                    await message.reply({content: `<:Crying:867724032316407828> **${user.tag}** went AFK <t:${Math.floor(client.afkDB.get(message.guild.id+user.id, "stamp") / 1000)}:R>!${client.afkDB.get(message.guild.id+user.id, "message") && client.afkDB.get(message.guild.id+user.id, "message").length > 1 ? `\n\n__His Message__\n>>> ${String(client.afkDB.get(message.guild.id+user.id, "message")).substring(0, 1800).split(`@`).join(`\`@\``)}` : "" }`}).then(msg=>{
                        setTimeout(()=>{
                            try{
                                msg.delete().catch(() => {});
                            }catch{  }
                        }, 5000)
                    }).catch(() => {})
                }
            }
        }catch(e){
            console.log(String(e).grey)
        }
    });
    // AFK SYSTEM
    client.on("messageCreate", async message => {
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            if(message.content && !message.content.toLowerCase().startsWith("[afk]") && client.afkDB.has(message.guild.id + message.author.id)){
                if(Math.floor(client.afkDB.get(message.guild.id+message.author.id, "stamp") / 10000) == Math.floor(Date.now() / 10000)) return console.log("AFK CMD");
                await message.reply({content: `:tada: Welcome back **${message.author.username}!** :tada:\n> You went <t:${Math.floor(client.afkDB.get(message.guild.id+message.author.id, "stamp") / 1000)}:R> Afk`}).then(msg=>{
                    setTimeout(()=>{ msg.delete().catch(() => {}) }, 5000)
                }).catch(() => {})
                client.afkDB.delete(message.guild.id + message.author.id)
            }
        }catch(e){
            console.log(String(e).grey)
        }
    });
    // autodelete
    client.on("messageCreate", async message => {
        if(message.guild){
            client.setups.ensure(message.guild.id, {
                autodelete: [/*{ id: "840330596567089173", delay: 15000 }*/]
            })
            let channels = client.setups.get(message.guild.id, "autodelete")
            if(channels && channels.some(ch => ch.id == message.channel.id) && message.channel.type == "GUILD_TEXT"){
                setTimeout(() => {
                    try { 
                        if(!message.deleted) {
                            if(message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                message.delete().catch(() => {
                                    //Try a second time
                                    setTimeout(()=>{message.delete().catch(() => { })}, 1500)
                                })
                            } else {
                                message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                                    setTimeout(()=>{m.delete().catch(()=>{})}, 3500)
                                })
                            }
                        }
                    } catch(e){ console.log(e.stack ? String(e.stack).grey : String(e).grey); }
                }, channels.find(ch => ch.id == message.channel.id).delay || 30000)
            }
        }
    })
    // sniping System
    client.on("messageDelete", async message => {
        if (!message.guild || message.guild.available === false || !message.channel || !message.author) return;
        let snipes = client.snipes.has(message.channel.id) ? client.snipes.get(message.channel.id) : [];
        if(snipes.length > 15) snipes.splice(0, 14);
        snipes.unshift({
            tag: message.author.tag,
            id: message.author.id,
            avatar: message.author.displayAvatarURL(),
            content: message.content,
            image: message.attachments.first()?.proxyURL || null,
            time: Date.now(),
        });
        client.snipes.set(message.channel.id, snipes)
    })
}