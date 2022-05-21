//Importing Packages
const Discord = require("discord.js")
var superagent = require('superagent');
const rp = require('request-promise-native'); 
var CronJob = require('cron').CronJob;
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
//starting the module
module.exports = async (client) => {
    //Loop through every setupped guild every single minute and call the autonsfw command
    client.Jobautonsfw = new CronJob('0 * * * * *', async function() {
        //get all guilds which are setupped
        const guilds = await dbKeys(client.settings, d => d.data?.autonsfw && d.data?.autonsfw != "no");
        //Loop through all guilds and send a random auto-generated-nsfw setup
        if(guilds.filter(d => client.guilds.cache.has(d)).length <= 0) return;
        for await (const guildid of guilds.filter(d => client.guilds.cache.has(d))){
            await autonsfw(guildid)
        }
    }, null, true, 'Europe/Berlin');
    
    client.Jobautonsfw.start();

    //function for sending automatic nsfw
    async function autonsfw(guildid){
        return new Promise(async (res) => {
            try{
                //get the Guild
                var guild = client.guilds.cache.get(guildid)
                //if no guild, return
                if(!guild) return res(false);
                //define a variable for the channel
                var channel;
                //get the settings 
                let set = await client.settings.get(guild.id+ ".autonsfw");
                //If no settings found, or defined on "no" return
                if(!set || set == "no") return
                //try to fetch the channel if no channel found throw error and return
                try{
                    channel = await client.channels.fetch(set).catch(() => null)
                    if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) throw "Channel not found"
                }catch (e){
                    return res(false);
                }
                //if the Channel is not an nsfw Channel, return
                if (!channel.nsfw) return res(false)
                //define the array with all possible nsfw cmds methods
                var methodarray = ["ass", "porn", "boobs"]
                //get a random method from the array
                var method = methodarray[Math.floor(Math.random() * methodarray.length)]
                //if the method is "ass"
                if(method == "ass"){
                    rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function (res) {
                        return rp.get({
                            url: 'http://media.obutts.ru/' + res[0].preview,
                            encoding: null
                        });
                    }).then(function (res) {
                        const attach = new Discord.MessageAttachment(res);
                        channel.send({files: [attach]}).catch(() => null);
                    });
                    return res(false)
                }
                //if the method is "porn"
                else if(method == "porn"){
                    superagent.get('https://nekobot.xyz/api/image').query({ type: 'pgif'}).end((err, response) => {
                        const attach = new Discord.MessageAttachment(response.body.message);
                        channel.send({files: [attach]}).catch(() => null);
                    });
                    return res(false);
                }
                //if the method is "boobs"
                else if(method == "boobs"){
                    rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function (res) {
                        return rp.get({
                            url: 'http://media.oboobs.ru/' + res[0].preview,
                            encoding: null
                            });
                    }).then(function (res) {
                        const attach = new Discord.MessageAttachment(res);
                        channel.send({files: [attach]}).catch(() => null);
                    });
                    return res(false);
                }
                //else call "porn"
                else {                    
                    superagent.get('https://nekobot.xyz/api/image').query({ type: 'pgif'}).end((err, response) => {
                        const attach = new Discord.MessageAttachment(response.body.message);
                        channel.send({files: [attach]}).catch(() => null);
                    });
                    return res(false);
                }
            }catch (e){
                console.error(e)
                return res(false);
            }
            return res(true)
        })
    }


}