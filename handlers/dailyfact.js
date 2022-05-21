//Importing Packages
const Discord = require("discord.js")
var superagent = require('superagent');
const rp = require('request-promise-native'); 
var CronJob = require('cron').CronJob;
const CClient = require("nekos.life");
const neko = new CClient();
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
//starting the module
module.exports = async (client) => {
    // Loop through every setupped guild every single minute and call the dailyfact command
    
    client.Jobdailyfact = new CronJob('30 0 0 * * *', async function() {
        //get all guilds which are setupped
        const guilds = await dbKeys(client.settings, d => d.data?.dailyfact && d.data?.dailyfact != "no");
        //Loop through all guilds and send a random auto-generated-nsfw setup
        for await (const guildid of guilds.filter(d => client.guilds.cache.has(d))){
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
            let set = await client.settings.get(guild.id+".dailyfact");
            //If no settings found, or defined on "no" return
            if(!set || set == "no") return
            //try to fetch the channel if no channel found throw error and return
            try{
                channel = await client.channels.fetch(set).catch(() => null)
                if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) throw "Channel not found"
            }catch (e){
                return;
            }
            let owo;
            owo = await neko.sfw.fact();
            channel.send( "***〔📢〕Daily Fact***\n>>> " + owo.fact).catch(() => null);
        } catch (e){
            console.log(String(e).grey)
        }
    }


}