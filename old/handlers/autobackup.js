//Importing Packages
const Discord = require("discord.js")
var CronJob = require('cron').CronJob;
const backup = require("discord-backup");
//starting the module
module.exports = client => {
    //Loop through every setupped guild every single minute and call the dailyfact command
    client.Jobautobackup = new CronJob('0 0 */2 * *', function() {
        //get all guilds which are setupped
        var guilds = client.settings.filter(v => v.autobackup).keyArray();
        //Loop through all guilds and send a random auto-generated-nsfw setup
        for(const guildid of guilds){
            autobackup(guildid)
        } 
    }, null, true, 'Europe/Berlin');
    client.Jobautobackup.start();

    //function for sending automatic nsfw
    async function autobackup(guildid){
        try{
            //get the Guild
            var guild = client.guilds.cache.get(guildid)
            //if no guild, return
            if(!guild) return;
            if(!guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
                return
            }
            client.backupDB.ensure(guild.id, {
                backups: [ ]
            })
            backup.create(guild, {
                maxMessagesPerChannel: 10,
                jsonSave: false,
                saveImages: "base64",
                jsonBeautify: true
            }).then((backupData) => {
                let backups = client.backupDB.get(guild.id, "backups")
                backups.push(backupData);
                backups = backups.sort((a,b)=>b?.createdTimestamp - a.createdTimestamp)
                if(backups.length > 5) backups = backups.slice(0, 5);
                client.backupDB.set(guild.id, backups, "backups")
            }).catch(e=>{
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
        } catch (e){
            console.log(String(e).grey)
        }
    }


}