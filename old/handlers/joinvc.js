
module.exports = client => {
  var { MessageEmbed } = require(`discord.js`);
  let thumbs = {
    "join": "https://cdn.discordapp.com/emojis/866356465299488809.png?size=128",
    "leave": "https://cdn.discordapp.com/emojis/866356598356049930.png?size=128"
  } 
  //voice state update event to check joining/leaving channels
  client.on("voiceStateUpdate", async (oldState, newState) => {
    //if not in a guild return or if it's from a bot
    if(!newState.guild || (newState.member && newState.member.user.bot)) return;
    
    //ensure the database
    client.joinvc.ensure(newState.guild.id, {
      vcmessages: [
        /*
         {
          channelId: "",
          textChannelId: "",
          message: "",
         }
        */
      ],
      vcroles: [
        /*
          {
            channelId: "",
            roleId: "",
          }
        */
      ],
    })


    //get the setup data
    let { vcmessages, vcroles } = client.joinvc.get(newState.guild.id)



    // Make sure it's really the right voice State Update...
    if (  (!oldState.streaming && newState.streaming) || (oldState.streaming && !newState.streaming) || (!oldState.serverDeaf && newState.serverDeaf) || (oldState.serverDeaf && !newState.serverDeaf) || (!oldState.serverMute && newState.serverMute) || (oldState.serverMute && !newState.serverMute) || (!oldState.selfDeaf && newState.selfDeaf) || (oldState.selfDeaf && !newState.selfDeaf) || (!oldState.selfMute && newState.selfMute) || (oldState.selfMute && !newState.selfMute) || (!oldState.selfVideo && newState.selfVideo) || (oldState.selfVideo && !newState.selfVideo)   ) return 



    // There is an old channel aka if he leaves / switches
    if(oldState.channelId){
      if(vcmessages.map(d => d.channelId).includes(oldState.channelId)){
        let theData = vcmessages.find(d => d.channelId == oldState.channelId);
        if(theData){
          let channel = oldState.guild.channels.cache.get(theData.textChannelId)
          if(!channel) channel = await oldState.guild.channels.fetch(theData.textChannelId).catch(()=>{}) || false;
          if(!channel) return // console.log("Channel got deleted / unable to find the channel in this guild..")
          
          let vcMember = oldState.member;
          if(!vcMember) vcMember = oldState.guild.members.cache.get(oldState.id);
          if(!vcMember) vcMember = await oldState.guild.members.fetch(oldState.id) .catch(()=>{}) || false;
          if(!vcMember) return // console.log("There is no VC MEMBER .. vcMessages")
          if(client.joinvc.has("msg-"+oldState.id)) {
            let theMsg = channel.messages.cache.get(client.joinvc.get("msg-"+oldState.id))
            if(!theMsg) theMsg = await channel.messages.fetch(client.joinvc.get("msg-"+oldState.id));
            if(!theMsg) {
              channel.send({
                embeds: [
                  new MessageEmbed()
                  .setColor("RED")
                  .setFooter(client.getFooter(`ID: ${vcMember.id}`, vcMember.displayAvatarURL({dynamic: true})))
                  .setThumbnail(thumbs.leave)
                  .setDescription(`<@${vcMember.id}> **(\`${vcMember.user.tag}\`) left the VC:** <#${oldState.channelId}>`)
                ],
                content: `**\`${vcMember.user.tag}\` LEFT!** *Removed the MESSAGE*`.substring(0, 2000)
              }).catch(() => {}).then(msg => {
                client.joinvc.delete("msg-"+oldState.id);
              })
            } else {
              theMsg.edit({
                embeds: [
                  new MessageEmbed()
                  .setColor("RED")
                  .setFooter(client.getFooter(`ID: ${vcMember.id}`, vcMember.displayAvatarURL({dynamic: true})))
                  .setThumbnail(thumbs.leave)
                  .setDescription(`<@${vcMember.id}> **(\`${vcMember.user.tag}\`) left the VC:** <#${oldState.channelId}> **again...**`)
                ],
                content: `**\`${vcMember.user.tag}\` LEFT!** *Removed the MESSAGE*`.substring(0, 2000)
              }).catch(() => {}).then(msg => {
                client.joinvc.delete("msg-"+oldState.id);
              })
            }
          }
        } else {
          // console.log("Somehow unable to find the vcMessages Data ")
        }
      }
      if(vcroles.map(d => d.channelId).includes(oldState.channelId)){
        let theData = vcroles.find(d => d.channelId == oldState.channelId);
        if(theData){
          let role = oldState.guild.roles.cache.get(theData.roleId)
          if(!role) role = await oldState.guild.roles.fetch(theData.roleId).catch(()=>{}) || false;
          if(!role) return // console.log("role got deleted / unable to find the role in this guild..")
          
          let vcMember = oldState.member;
          if(!vcMember) vcMember = oldState.guild.members.cache.get(oldState.id);
          if(!vcMember) vcMember = await oldState.guild.members.fetch(oldState.id) .catch(()=>{}) || false;
          if(!vcMember) return // console.log("There is no VC MEMBER .. vcroles")
          
          if(vcMember.roles.cache.has(role.id)){
            vcMember.roles.remove(role.id).catch(() => {})
          } else {
            // console.log("VCMEMBER does not have the ROLE")
          }
        } else {
          // console.log("Somehow unable to find the vcroles Data ")
        }
      }
    }



    // There is a new Channel aka if he joins / switches 
    if(newState.channelId){
        
      if(vcmessages.map(d => d.channelId).includes(newState.channelId)){
        let theData = vcmessages.find(d => d.channelId == newState.channelId);
        if(theData){
          let channel = newState.guild.channels.cache.get(theData.textChannelId)
          if(!channel) channel = await newState.guild.channels.fetch(theData.textChannelId).catch(()=>{}) || false;
          if(!channel) return // console.log("Channel got deleted / unable to find the channel in this guild..")
          
          let vcMember = newState.member;
          if(!vcMember) vcMember = newState.guild.members.cache.get(newState.id);
          if(!vcMember) vcMember = await newState.guild.members.fetch(newState.id) .catch(()=>{}) || false;
          if(!vcMember) return // console.log("There is no VC MEMBER .. vcMessages")
          
          channel.send({
            embeds: [
              new MessageEmbed()
              .setColor("GREEN")
              .setFooter(client.getFooter(`ID: ${vcMember.id}`, vcMember.displayAvatarURL({dynamic: true})))
              .setThumbnail(thumbs.join)
              .setDescription(`<@${vcMember.id}> **(\`${vcMember.user.tag}\`) joined the VC:** <#${newState.channelId}>`)
            ],
            content: `${theData.message && theData.message.length > 10 ? theData.message : "*No __VALID__ Message Added*"}`.substring(0, 2000)
          }).catch(() => {}).then(msg => {
            client.joinvc.set("msg-"+newState.id, msg.id);
          })
        } else {
          // console.log("Somehow unable to find the vcMessages Data ")
        }
      }
      if(vcroles.map(d => d.channelId).includes(newState.channelId)){
        let theData = vcroles.find(d => d.channelId == newState.channelId);
        if(theData){
          let role = newState.guild.roles.cache.get(theData.roleId)
          if(!role) role = await newState.guild.roles.fetch(theData.roleId).catch(()=>{}) || false;
          if(!role) return // console.log("role got deleted / unable to find the role in this guild..")
          
          let vcMember = newState.member;
          if(!vcMember) vcMember = newState.guild.members.cache.get(newState.id);
          if(!vcMember) vcMember = await newState.guild.members.fetch(newState.id) .catch(()=>{}) || false;
          if(!vcMember) return // console.log("There is no VC MEMBER .. vcroles")
          
          if(!vcMember.roles.cache.has(role.id)){
            vcMember.roles.add(role.id).catch(() => {})
          } else {
            // console.log("VCMEMBER already has the ROLE")
          }
        } else {
          // console.log("Somehow unable to find the vcroles Data ")
        }
      }
    }
  })
}