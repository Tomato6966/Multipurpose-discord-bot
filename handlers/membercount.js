var CronJob = require('cron').CronJob;
const { delay, dbKeys, dbEnsure } = require(`./functions`)
module.exports = function (client, options) {


  //Loop through every setupped guild every 1 Hour and call membercount
  client.Jobmembercount = new CronJob('0 0 * * * *', async function() {
    //get all guilds which are setupped
    var guilds = await dbKeys(client.setups, v => {
      if(v.data && v.data.membercount){
        let returnvalue = false;
        for (let i = 1; i <= 25; i++){
          if(v.data.membercount[`channel${i}`] && v.data.membercount[`channel${i}`].length > 5) returnvalue = true;
        }
        return returnvalue;
      } else {
        return false;
      }
    }) || [];
    var logguilds = guilds;
    console.log(JSON.stringify(logguilds.map(guild => `${guild}`)).italic.yellow + " MEMBERCOUNTER ALL GUILDS")
    //Loop through all guilds and send a random auto-generated-nsfw setup
    for await (const guildid of guilds.filter(g => client.guilds.cache.has(g))){
        memberCount(guildid)
        await delay(1000);
    }
  }, null, true, 'Europe/Berlin');

  client.on("ready", async () => {
    client.Jobmembercount.start();
  })


  async function memberCount(guildid){
    //ensure the database
    let ensureobject = { }
    for (let i = 1; i <= 25; i++){
      ensureobject[`channel${i}`] = "no";
      ensureobject[`message${i}`] = "🗣 Members: {member}";
    }
    await dbEnsure(client.setups, guildid+".membercount", ensureobject);
    //get the Guild
    var guild = client.guilds.cache.get(guildid)
    //if no guild, return
    if(!guild) return
    //get all guilds
    await guild.members.fetch().catch(() => null);
    //get the settings 
    let set = await client.setups.get(guild.id+".membercount");
    //If no settings found, or defined on "no" return
    if(!set) return
    for (let i = 1; i <= 25; i++){
      if(set[`channel${i}`] && set[`channel${i}`].length == 18){
        if(await Channel(set[`channel${i}`], set[`message${i}`])){
          await delay(1000 * 60 * 6)
        }
      }
    }
    async function Channel(chId, channelName){
      console.log(`MemberCount - Channel - ${guild.name} - ${chId}, ${channelName}`.italic.yellow)
      //define a variable for the channel
      var channel;
      //try to fetch the channel if no channel found throw error and return
      try{
          channel = await client.channels.fetch(chId).catch(() => null)
          if(!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) return;
          let newname = String(channelName)
            
          .replace(/{user}/i, guild.memberCount)
          .replace(/{users}/i,  guild.memberCount)

          .replace(/{member}/i, guild.members.cache.filter(member => !member.user.bot).size)
          .replace(/{members}/i, guild.members.cache.filter(member => !member.user.bot).size)

          .replace(/{bots}/i, guild.members.cache.filter(member => member.user.bot).size)
          .replace(/{bot}/i, guild.members.cache.filter(member => member.user.bot).size)

          .replace(/{online}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "online").size)
          .replace(/{offline}/i, guild.members.cache.filter(member => member.presence).size)
          .replace(/{idle}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "idle").size)
          .replace(/{dnd}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "dnd").size)
          .replace(/{allonline}/i, guild.members.cache.filter(member => member.presence).size)

          .replace(/{onlinemember}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "online").size)
          .replace(/{offlinemember}/i, guild.members.cache.filter(member => !member.user.bot && !member.presence).size)
          .replace(/{idlemember}/i, guild.members.cache.filter(member =>!member.user.bot &&  member.presence && member.presence.status == "idle").size)
          .replace(/{dndmember}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "dnd").size)
          .replace(/{allonlinemember}/i, guild.members.cache.filter(member => !member.user.bot && member.presence).size)

          .replace(/{role}/i, guild.roles.cache.size)
          .replace(/{roles}/i, guild.roles.cache.size)

          .replace(/{channel}/i, guild.channels.cache.size)
          .replace(/{channels}/i, guild.channels.cache.size)

          .replace(/{text}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
          .replace(/{voice}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
          .replace(/{stage}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
          .replace(/{thread}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
          .replace(/{news}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_NEWS").size)
          .replace(/{category}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
          .replace(/{openthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
          .replace(/{archivedthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)

          .replace(/{texts}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
          .replace(/{voices}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
          .replace(/{stages}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
          .replace(/{threads}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
          .replace(/{parent}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
          .replace(/{openthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
          .replace(/{archivedthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
          if(channel.name != newname){
            channel.setName(newname).catch(() => null)
            return true;
          } else {
            return false;
          }
      }catch (e){
        console.error(e)
      }
    }
  }
}
