//Importing Packages
const Discord = require("discord.js")
var CronJob = require('cron').CronJob;
const backup = require("discord-backup");
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
//starting the module
module.exports = async (client) => {
    // Loop through every single guild at every second day, and create a backup
    client.Jobautobackup = new CronJob('0 0 */2 * *', async function() {
        //get all guilds which are setupped
        const guilds = await dbKeys(client.settings, d => d.data?.autobackup == true);
        //console.log("AUTO BACKUP", guilds)
        //Loop through all guilds and send a random auto-generated-nsfw setup
        if(guilds.filter(d => client.guilds.cache.has(d)).length == 0) return true;
        for await (const guildid of guilds.filter(d => client.guilds.cache.has(d))){
            await autobackup(guildid);
        } 
    }, null, true, 'Europe/Berlin');
    client.Jobautobackup.start();

    //function for sending automatic nsfw
    async function autobackup(guildid){
        return new Promise(async (res) => {
            try{
                //get the Guild
                var guild = client.guilds.cache.get(guildid)
                //if no guild, return

                if(!guild || !guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
                    return res(true)
                }

                await backup.create(guild, {
                    maxMessagesPerChannel: 10,
                    jsonSave: false,
                    saveImages: "base64",
                    jsonBeautify: true
                }).then(async (backupData) => {
                    let backups = await client.backupDB.get(guild.id+".backups") || [];
                    //add this backup
                    backups.push(backupData);
                    //sort the backups
                    backups = backups.sort((a,b)=>b?.createdTimestamp - a.createdTimestamp)
                    //if there are too many backups remove
                    if(backups.length > 5) backups = backups.slice(0, 5);
                    //update the DB
                    await client.backupDB.set(guild.id+".backups", backups)
                    //wait 50ms
                    await delay(50);
                    //return true
                    return res(true);
                }).catch(e=>{
                    console.error(e)
                    //return true
                    return res(true);
                })
            } catch (e){
                console.error(e)
                return res(true);
            }
        })
        
    }


}