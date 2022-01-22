const { MessageEmbed } = require("discord.js");
module.exports = function (client, options) {

  client.on("guildMemberUpdate", async (oM, nM) => {
    
    client.settings.ensure(nM.guild.id, {
      boost: {
        enabled: false,
        message: "",
        log: false,
      }
    })
    if(!client.settings.has(nM.guild.id)) return;
    if(!client.settings.has(nM.guild.id, "boost")) return;

    let settings = client.settings.get(nM.guild.id, "boost");
    if(settings && settings.enabled) {
      //if he/she starts boosting      
      if(!oM.premiumSince && nM.premiumSince) {
        //send the MEMBER a DM
        nM.send(settings.message.substr(0, 2000)).catch(() => {});
      }
    }



    if(settings && settings.log) {
      let boostLogChannel = nM.guild.channels.cache.get(settings.log);
      if(!boostLogChannel) boostLogChannel = await nM.guild.channels.fetch(settings.log).catch(()=>{}) || false;
      if(!boostLogChannel) return;
      
      let stopBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("RED")
          .setDescription(`<a:Server_Boosts:867777823468027924> ${nM.user} **stopped Boosting us..** <:Cat_Sad:867722685949804565>`)
      let startBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("GREEN")
          .setDescription(`<a:Server_Boosts:867777823468027924> ${nM.user} **has boosted us!** <a:Light_Saber_Dancce:867721861462229013>`)
          
      //if he/she starts boosting
      if(!oM.premiumSince && nM.premiumSince) {
        boostLogChannel.send({embeds: [startBoost]}).catch(console.warn);
      }
      //if he/she stops boosting
      if(oM.premiumSince && !nM.premiumSince) {
          boostLogChannel.send({embeds: [stopBoost]}).catch(console.warn)
      }
    }
  });
}
