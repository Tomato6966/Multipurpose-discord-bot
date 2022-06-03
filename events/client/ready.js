//here the event starts
let config = require(`${process.cwd()}/botconfig/config.json`)
const Discord = require("discord.js")
const moment = require("moment")
const { nFormatter } = require(`${process.cwd()}/handlers/functions`)
module.exports = async (client) => {
  //SETTING ALL GUILD DATA FOR THE DJ ONLY COMMANDS for the DEFAULT
  //client.guilds.cache.forEach(guild=>client.settings.set(guild.id, ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"], "djonlycmds"))
  try{
    try{
      const stringlength = 69;
      console.log("\n")
      console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen+ " ".repeat(-1+stringlength-` ┃ `.length-` /--/ ${client.user.tag} /--/ `.length)+ "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
      console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
    } catch { /* */ }
    console.table({ 
      //'info': `${client.guilds.cache.get("880881865114935296")?.name} SERVER`,
      'Cluster:' : `#${client.cluster.id}` ,
      'Shards:' : `${client.cluster.ids.map(d => `#${d.id}`).join(", ")}` ,
      'Bot User:' : `${client.user.tag}` ,
      'Guild(s):' : `${client.guilds.cache.size} Servers` ,
      'Watching:' : `${client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0)} Members` ,
      'Prefix:' : `${config.prefix}` ,
      'Commands:' : `${client.commands.size}` ,
      'Discord.js:' : `v${Discord.version}` ,
      'Node.js:' : `${process.version}` ,
      'Plattform:' : `${process.platform} ${process.arch}` ,
      'Memory:' : `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
    });
    client.user.setPresence( { 
      activities: [ { 
      name: ".help" , 
    type: 'LISTENING' 
  } 
  ], 
    status: "idle" // online, idle, invisible, dnd 
  } )
    change_status(client);
    //loop through the status per each 10 minutes
    setInterval(()=>{
      change_status(client);
    }, 90 * 1000);
  
  } catch (e){
    console.log(String(e.stack).grey.bgRed)
  }
}
var state = false;
async function change_status(client){
  let stats = await client.stats.get("global");
  config = require(`${process.cwd()}/botconfig/config.json`)
  if(!state){
    for(id of client.cluster.ids.map(s => s.id)){
      client.user.setActivity(`${config.status.text}`
      .replace("{prefix}", config.prefix)
      .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
      .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
      .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
      .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
      .replace("{name}", client.user.username)
      .replace("{tag}", client.user.tag)
      .replace("{commands}", client.commands.size)
      .replace("{usedcommands}", Math.ceil(stats.commands))
      .replace("{songsplayed}", Math.ceil(stats.songs)), {type: config.status.type1, url: config.status.url, shardId: id});
    }
  } else {
    for(id of client.cluster.ids.map(s => s.id)){
      client.user.setActivity(`${config.status.text2}`
      .replace("{prefix}", config.prefix)
      .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
      .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
      .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
      .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
      .replace("{name}", client.user.username)
      .replace("{tag}", client.user.tag)
      .replace("{commands}", client.commands.size)
      .replace("{usedcommands}", Math.ceil(stats.commands))
      .replace("{songsplayed}", Math.ceil(stats.songs)), {type: config.status.type2, url: config.status.url, shardId: id});
    }
    
  }
  state = !state;
  if(client.ad.enabled){
    setTimeout(()=>{
      client.user.setActivity(client.ad.statusad);
    }, (90 - 15) * 1000);
  }
}