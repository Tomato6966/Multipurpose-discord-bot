
const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

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
module.exports = client => {
    //Loop through every setupped guild every single minute (30 second delay) and call the automeme command
    client.Jobautomeme = new CronJob('30 * * * * *', function() {
        //get all guilds which are setupped
        var guilds = client.settings.filter(v => v.automeme && v.automeme != "no").keyArray();
        //Loop through all guilds and send a random auto-generated-nsfw setup
        for(const guildid of guilds){
            automeme(guildid)
        }
    }, null, true, 'America/Los_Angeles');
    
    client.Jobautomeme.start();

    //function for sending automatic nsfw
    async function automeme(guildid){
        try{
            //get the Guild
            var guild = client.guilds.cache.get(guildid)
            //if no guild, return
            if(!guild) return;
            //define a variable for the channel
            var channel;
            //define the embed settings
            let es = client.settings.get(guild.id, "embed");
            //get the settings 
            let set = client.settings.get(guild.id, "automeme");
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
            const selected = data[Math.floor(Math.random() * data.length)];
            
            if(!client.settings.has(channel.guild.id, "language")) client.settings.ensure(channel.guild.id, { language: "en" });
            let ls = client.settings.get(channel.guild.id, "language")
            return channel.send(eval(client.la[ls]["handlers"]["automemejs"]["automeme"]["variable1"]));
        }catch{

        }
    }


}