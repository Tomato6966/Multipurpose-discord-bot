//Importing Packages
const Discord = require("discord.js")
var CronJob = require('cron').CronJob;
const ee = require("../botconfig/embed.json");
const { dbKeys } = require("./functions")
//starting the module
module.exports = async (client) => {
    //Loop through every setupped guild every single minute and call the dailyfact command
    client.JobTimesMessages = new CronJob('10 * * * * *', async function() {
        //get all guilds which are setupped
        var currentMinute = new Date().getMinutes()
        var currentHour = new Date().getHours();
        var Days = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ]
        var currentDay = Days[new Date().getDay()];
        //console.log("TIMED MESSAGES :: get keys".magenta.dim)
        var guilds = await dbKeys(client.settings, v => v.timedmessages 
            && v.timedmessages.length > 0 
            && v.timedmessages.filter(msg => 
                msg.days.includes(currentDay)
                && Number(msg.minute) == Number(currentMinute) && Number(msg.hour) == Number(currentHour)).length > 0 
        ).then(gs => gs.filter(g => client.guilds.cache.has(g)))
        //console.log("TIMED MESSAGES :: GUILDS:".magenta.dim, guilds)
        //Loop through all guilds and send a random auto-generated-nsfw setup
        if(guilds.length == 0) return;
        for await (const guildid of guilds){
            await timedmessage(guildid)
        } 
        return;
    }, null, true, 'Europe/Berlin');
    client.JobTimesMessages.start();

    //function for sending automatic nsfw
    async function timedmessage(guildid){
        try{
            //get all guilds which are setupped
            var currentMinute = new Date().getMinutes()
            var currentHour = new Date().getHours();
            var Days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
            var currentDay = Days[new Date().getDay()];
            //get the Guild
            var guild = client.guilds.cache.get(guildid)
            //if no guild, return
            if(!guild) return;
            //get the settings 
            let timedmessages = await client.settings.get(guild.id+".timedmessages")
            //If no settings found, or defined on "no" return
            if(!timedmessage || timedmessage.length == 0) return
            let timedmessages_to_send = timedmessages.filter(msg => 
                msg.days.includes(currentDay)
                && Number(msg.minute) == Number(currentMinute) && Number(msg.hour) == Number(currentHour));
            if(timedmessages_to_send.length > 0){
                for await (const msg of timedmessages_to_send){
                    let channel = guild.channels.cache.get(msg.channel) || await guild.channels.fetch(msg.channel).catch(() => null) || false;
                    if(!channel) return 
                    if(msg.embed){
                        var es = await client.settings.get(guild.id+".embed") || ee;
                        channel.send({embeds : [
                            new Discord.MessageEmbed()
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setDescription(msg.content.substring(0, 2000))
                        ]}).catch(()=>null)
                    } else {
                        channel.send({content : msg.content.substring(0, 2000)}).catch(() => null)
                    }
                }
            }
        } catch (e){
            console.error(e)
        }
        return true;
    }
}