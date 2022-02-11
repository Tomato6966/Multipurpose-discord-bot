
const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
const fetch = require("node-fetch");
var CronJob = require('cron').CronJob;
const subreddits = [
  "memes",
  "DeepFriedMemes",
  "bonehurtingjuice",
  "surrealmemes",
  "dankmemes",
  "meirl",
  "me_irl",
  "funny"
];
const path = require("path");
//starting the module
module.exports = async (client) => {
    //Loop through every setupped guild every single minute (30 second delay) and call the automeme command
    client.Jobautomeme = new CronJob('30 * * * * *', async function() {
        //Loop through all guilds and send a random auto-generated-meme setup
        const guilds = await dbKeys(client.settings, d => d.data?.automeme && d.data?.automeme != "no");
        //Loop through all guilds and send a random auto-generated-meme setup
        for(const guildid of guilds.filter(d => client.guilds.cache.has(d))){
            await automeme(guildid)
        }
    }, null, true, 'America/Los_Angeles');
    
    client.Jobautomeme.start();

    //function for sending automatic nsfw
    async function automeme(guildid){
        return new Promise(async (res) => {
            try{
                //get the Guild
                var guild = client.guilds.cache.get(guildid);
                //if no guild, return
                if(!guild) return;
                //define a variable for the channel
                var channel;
                //get the settings 
                let set = await client.settings.get(guild.id+".automeme");
                //If no settings found, or defined on "no" return
                if(!set || set == "no") return
                //try to fetch the channel if no channel found throw error and return
                try{
                    channel = await client.channels.fetch(set).catch(() => {})
                    if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) throw "Channel not found"
                }catch (e){
                    return;
                }
                const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
                    .then(response => response.json())
                    .then(body => body.data);
                const selected = data.filter(d => d.hash)[Math.floor(Math.random() * data.length)];
                if(!selected) return;
                return channel.send(`https://imgur.com/${selected.hash}${selected.ext.replace(/\\?.*/, '')}`);
            }catch (e){
                console.error(e)
            }
        })
    }


}