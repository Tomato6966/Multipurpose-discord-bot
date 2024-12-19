//Importing Packages
const Discord = require("discord.js")
var superagent = require('superagent');
const rp = require('request-promise-native'); 
var CronJob = require('cron').CronJob;
const CClient = require("nekos.life");
const neko = new CClient();
//starting the module
module.exports = client => {
    //Loop through every setupped guild every single minute and call the dailyfact command
    client.Jobdailyfact = new CronJob('30 0 0 * * *', function() {
        //get all guilds which are setupped
        var guilds = client.settings.filter(v => v.dailyfact && v.dailyfact != "no").keyArray();
        //Loop through all guilds and send a random auto-generated-nsfw setup
        for(const guildid of guilds){
            dailyfact(guildid)
        } 
    }, null, true, 'Europe/Berlin');
    client.Jobdailyfact.start();

    //function for sending automatic nsfw
    async function dailyfact(guildid){
        try{
            //get the Guild
            var guild = client.guilds.cache.get(guildid)
            //if no guild, return
            if(!guild) return;
            //define a variable for the channel
            var channel;
            //get the settings 
            let set = client.settings.get(guild.id, "dailyfact");
            //If no settings found, or defined on "no" return
            if(!set || set == "no") return
            //try to fetch the channel if no channel found throw error and return
            try{
                channel = await client.channels.fetch(set).catch(() => {})
                if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) throw "Channel not found"
            }catch (e){
                return;
            }
            let owo;
            owo = await neko.sfw.fact();
            channel.send( "***〔📢〕Daily Fact***\n>>> " + owo.fact).catch(() => {});
        } catch (e){
            console.log(String(e).grey)
        }
    }


}