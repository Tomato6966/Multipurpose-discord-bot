const { MessageEmbed } = require("discord.js");
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
module.exports = function (client, options) {

  client.on("guildMemberUpdate", async (oM, nM) => {
    
    await dbEnsure(client.settings, nM.guild.id, {
      boost: {
        enabled: false,
        message: "",
        log: false,
        stopBoost: "<a:Server_Boosts:950881838539354173> {member} **stopped Boosting us..** <:Cat_Sad:950882209512951869>",
        startBoost: "<a:Server_Boosts:950881838539354173> {member} **has boosted us!** <a:Light_Saber_Dancce:950882992161697853>",
        againBoost: "<a:Server_Boosts:950881838539354173> {member} **has boosted us again!** <:Tada_WON:950883211347640401>",
      }
    })
    const GuildSettings = await client.settings.get(nM.guild.id)
    if(!GuildSettings) return;
    if(!GuildSettings.boost) return;

    let settings = GuildSettings.boost;
    if(settings && settings?.enabled) {
      //if he/she starts boosting    
      if(!oM.premiumSince && nM.premiumSince) {
        nM.send(settings.message.substring(0, 2000)).catch(() => null);
      }
      //if he/she boosts again
      if(oM.premiumSince && oM.premiumSinceTimestamp != nM.premiumSinceTimestamp) {
        nM.send(settings.message.substring(0, 2000)).catch(() => null);
      }
    }



    if(settings && settings.log) {
      let boostLogChannel = nM.guild.channels.cache.get(settings.log);
      if(!boostLogChannel) boostLogChannel = await nM.guild.channels.fetch(settings.log).catch(() => null) || false;
      if(!boostLogChannel) return;
      
      let stopBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("RED")
          .setDescription(`${String(settings.stopBoost).replace(/\{member\}/igu, `${nM.user}`)}`)
      let startBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("#ff8afb")
          .setDescription(`${String(settings.startBoost).replace(/\{member\}/igu, `${nM.user}`)}`)
      let againBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("#ff8afb")
          .setDescription(`${String(settings.againBoost).replace(/\{member\}/igu, `${nM.user}`)}`)
          
      //if he/she stops boosting
      if(oM.premiumSince && !nM.premiumSince) {
        return boostLogChannel.send({embeds: [stopBoost]}).catch(console.warn)
      } 
      //if he/she starts boosting
      if(!oM.premiumSince && nM.premiumSince) {
        return boostLogChannel.send({embeds: [startBoost]}).catch(console.warn);
      }
      //if he/she starts boosting
      if(oM.premiumSince && oM.premiumSinceTimestamp != nM.premiumSinceTimestamp) {
        return boostLogChannel.send({embeds: [againBoost]}).catch(console.warn);
      }
    }
  });
}
