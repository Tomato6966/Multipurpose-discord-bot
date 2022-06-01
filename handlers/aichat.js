//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
    MessageEmbed, MessageAttachment, User, Permissions, CommandInteractionOptionResolver
} = require(`discord.js`);
const { databasing, dbEnsure } = require(`./functions`)
const fetch = require("node-fetch")

module.exports = async (client) => {
    // CMD
    
    module.exports.messageCreate = (client, message, guild_settings, setups) => {
        AICHAT(client, message, guild_settings, setups);
        AFK_SYSTEM_Ping(client, message, guild_settings, setups);
        AFK_SYSTEM_Come_back(client, message, guild_settings, setups);
        AUTO_DELETE(client, message, guild_settings, setups);
    }
    // Ai Chat System
    async function AICHAT(client, message, guild_settings, setups) {
        try{
            if(!message.guild) return;
            let chatbot = guild_settings.aichat;
            if(!chatbot || chatbot == "no") return;
            if(message.channel.id == chatbot){
                if(message.author.id == client.user.id) return;
                if(message.author.bot) return message.reply(":x: I don't talk with **BOTS**!")
              if(message.attachments.size > 0)
              {
                  return message.channel.send("I CANNOT READ FILES!")
              }
              try{
                fetch(`http://api.brainshop.ai/get?bid=166923&key=UHH4ewDAMkrhzWQT&uid=1&msg=${encodeURIComponent(message)}`)
                .then(res => res.json())
                .then(data => {
                  message.channel.send({content: data.cnt}).catch(() => null)
                });
              }catch (e){
                message.channel.send({content: ":x: AI CHAT API IS DOWN"}).catch(() => null)
              }
            }
        }catch(e){console.log(String(e).grey)}
    }
    // AFK SYSTEM
    async function AFK_SYSTEM_Ping(client, message, guild_settings, setups) {
        try{
            for await (const user of [...message.mentions.users.values()]){
                let d = await client.afkDB.get(message.guild.id + user.id)
                if(d){
                    await message.reply({content: `<:Crying:950887629661036554> **${user.tag}** went AFK <t:${Math.floor(d.stamp / 1000)}:R>!${d.message && d.message.length > 1 ? `\n\n__His Message__\n>>> ${String(d.message).substring(0, 1800).split(`@`).join(`\`@\``)}` : "" }`}).then(msg=>{
                        setTimeout(()=>{
                            try{
                                msg.delete().catch(() => null);
                            }catch{  }
                        }, 5000)
                    }).catch(() => null)
                }
            }
        }catch(e){
            console.log(String(e).grey)
        }
    }
    // AFK SYSTEM
    async function AFK_SYSTEM_Come_back(client, message, guild_settings, setups) {
        try{
            if(!setups) return;
            let d = await client.afkDB.get(message.guild.id + message.author?.id)
            if(message.content && !message.content.toLowerCase().startsWith("[afk]") && d){
                if(d && Math.floor(d.stamp / 10000) == Math.floor(Date.now() / 10000)) return 
                await message.reply({content: `:tada: Welcome back **${message.author.username}!** :tada:\n> You went <t:${Math.floor(d.stamp / 1000)}:R> Afk`}).then(msg=>{
                    setTimeout(()=>{ msg.delete().catch(() => null) }, 5000)
                }).catch(() => null)
                await client.afkDB.set(message.guild.id + message.author?.id, null)
            }
        }catch(e){
            console.log(String(e).grey)
        }
    }

    /**
     * AUTO DELETE
     */
    const D_ = new Map();
    let T_ = null; // for the timeout - resetting 

    async function AUTO_DELETE(client, message, guild_settings, setups) {
        if(!setups) return;
        let chs = setups.autodelete || [];
        if(chs && chs.some(ch => ch?.id == message.channel.id) && message.channel.type == "GUILD_TEXT"){
            const key = message.channel.id;
            const delay = chs.find(ch => ch.id == key).delay || 30000;
            // ensure the Map datas
            if(!D_.has(key)) D_.set(key, []);
            if(!D_.has(key+"c")) D_.set(key+"c", false);
            //add the message
            D_.set(key, [...D_.get(key), { id: message.id, time: Date.now() }]);
            // if the message was not checked since the last delay, check it!
            // or if the last check was under 1 sec ago aka spam...
            if(!D_.get(key+"c") || Math.floor(D_.get(key+"c") / 1_000) == Math.floor(Date.now() / 1_000)){
                D_.set(key+"c", Date.now()); //update the key
                // if there was a timeout set before, clear it
                if(T_) clearTimeout(T_); 
                // create a timeout
                T_ = setTimeout(() => checkToDelete(), delay + 2_000);
            }
            
            function checkToDelete(){
                D_.set(key+"c", false); // Update that it can get checked again
                // get the msgs which needs to get deleted
                const delMsgs = D_.get(key)
                    .filter(m => Math.floor(Math.floor(delay / 1_000) - Math.floor((Date.now() - m.time) / 1_000)) <= 0)
                    .map(m => m.id);
                // delete the messages if existing
                if(delMsgs.length > 0) {
                    D_.set(key, D_.get(key).filter(d => !delMsgs.includes(d.id))) // keep undeleted ones
                    message.channel.bulkDelete(delMsgs.filter(m => message.channel.messages.cache.has(m))).catch(console.error);
                }
                // check again if it wasn't checked before (aka no messages sent)
                setTimeout(() => !D_.get(key+"c") ? checkToDelete() : null, delay);
            }
        }
    }

    // sniping System
    client.on("messageDelete", async message => {
        if (!message.guild || message.guild.available === false || !message.channel || !message.author) return;
        let snipes = await client.snipes.get(message.channel.id) || [];
        if(snipes.length > 15) snipes.splice(0, 14);
        snipes.unshift({
            tag: message.author.tag,
            id: message.author?.id,
            avatar: message.author.displayAvatarURL(),
            content: message.content,
            image: message.attachments.first()?.proxyURL || null,
            time: Date.now(),
        });
        await client.snipes.set(message.channel.id, snipes)
    })
}
