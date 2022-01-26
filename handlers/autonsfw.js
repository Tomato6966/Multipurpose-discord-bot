//Importing Packages
const Discord = require("discord.js")
var superagent = require('superagent');
const rp = require('request-promise-native'); 
var CronJob = require('cron').CronJob;


//starting the module
module.exports = client => {
    //Loop through every setupped guild every single minute and call the autonsfw command
    client.Jobautonsfw = new CronJob('0 * * * * *', function() {
        //get all guilds which are setupped
        var guilds = client.settings.filter(v => v.autonsfw && v.autonsfw != "no").keyArray();
        //Loop through all guilds and send a random auto-generated-nsfw setup
        for(const guildid of guilds){
            autonsfw(guildid)
        }
    }, null, true, 'America/Los_Angeles');
    
    client.Jobautonsfw.start();

    //function for sending automatic nsfw
    async function autonsfw(guildid){
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
            let set = client.settings.get(guild.id, "autonsfw");
            //If no settings found, or defined on "no" return
            if(!set || set == "no") return
            //try to fetch the channel if no channel found throw error and return
            try{
                channel = await client.channels.fetch(set).catch(() => {})
                if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) throw "Channel not found"
            }catch (e){
                return;
            }
            //if the Channel is not an nsfw Channel, return
            if (!channel.nsfw) return
            //define the array with all possible nsfw cmds methods
            var methodarray = ["ass", "porn", "boobs"]
            //get a random method from the array
            var method = methodarray[Math.floor(Math.random() * methodarray.length)]
            //if the method is "ass"
            if(method == "ass"){
                return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function (res) {
                    return rp.get({
                    url: 'http://media.obutts.ru/' + res[0].preview,
                    encoding: null
                    });
                }).then(function (res) {
                    const attach = new Discord.MessageAttachment(res);
                    channel.send({files: [attach]}).catch(() => {});
                });
            }
            //if the method is "porn"
            else if(method == "porn"){
                superagent.get('https://nekobot.xyz/api/image').query({ type: 'pgif'}).end((err, response) => {
                    const attach = new Discord.MessageAttachment(response.body.message);
                    channel.send({files: [attach]}).catch(() => {});
                });
            }
            //if the method is "boobs"
            else if(method == "boobs"){
                return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function (res) {
                    return rp.get({
                        url: 'http://media.oboobs.ru/' + res[0].preview,
                        encoding: null
                    });
                    }).then(function (res) {
                        const attach = new Discord.MessageAttachment(res);
                        channel.send({files: [attach]}).catch(() => {});
                    });
            }
            //else call "porn"
            else {                    
                superagent.get('https://nekobot.xyz/api/image').query({ type: 'pgif'}).end((err, response) => {
                    const attach = new Discord.MessageAttachment(response.body.message);
                    channel.send({files: [attach]}).catch(() => {});
                });
            }
        }catch{

        }
    }


}