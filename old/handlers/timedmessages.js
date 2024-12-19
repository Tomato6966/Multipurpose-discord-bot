//Importing Packages
const Discord = require("discord.js")
var CronJob = require('cron').CronJob;
//starting the module
module.exports = client => {
    //Loop through every setupped guild every single minute and call the dailyfact command
    client.JobTimesMessages = new CronJob('10 * * * * *', function() {
        //get all guilds which are setupped
        var currentMinute = new Date().getMinutes()
        var currentHour = new Date().getHours();
        var Days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        var currentDay = Days[new Date().getDay()];
        var guilds = client.settings.filter(v => v.timedmessages 
            && v.timedmessages.length > 0 
            && v.timedmessages.filter(msg => 
                msg.days.includes(currentDay)
                && Number(msg.minute) == Number(currentMinute) && Number(msg.hour) == Number(currentHour)).length > 0 
            ).keyArray();
        //Loop through all guilds and send a random auto-generated-nsfw setup
        for(const guildid of guilds){
            timedmessage(guildid)
        } 
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
            let timedmessages = client.settings.get(guild.id, "timedmessages")
            //If no settings found, or defined on "no" return
            if(!timedmessage || timedmessage.length == 0) return
            let timedmessages_to_send = timedmessages.filter(msg => 
                msg.days.includes(currentDay)
                && Number(msg.minute) == Number(currentMinute) && Number(msg.hour) == Number(currentHour));
            if(timedmessages_to_send.length > 0){
                for(const msg of timedmessages_to_send){
                    let channel = guild.channels.cache.get(msg.channel) || await guild.channels.fetch(msg.channel).catch(() => {}) || false;
                    if(!channel) return 
                    if(msg.embed){
                        var es = client.settings.get(guild.id, "embed");
                        channel.send({embeds : [
                            new Discord.MessageEmbed()
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setDescription(msg.content.substring(0, 2000))
                        ]}).catch((e) => { console.log(e) })
                    } else {
                        channel.send({content : msg.content.substring(0, 2000)}).catch(() => {})
                    }
                }
            }
        } catch (e){
            console.log(String(e).grey)
        }
    }
}