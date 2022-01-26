const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const { simple_databasing } = require(`./functions`);
module.exports = client => {
    
  client.getFooter = (es, stringurl = null) => {
    //allow inputs: ({footericon, footerurl}) and (footericon, footerurl);
    let embedData = { };
    if(typeof es !== "object") embedData = { footertext: es, footericon: stringurl };
    else embedData = es;

    let text = embedData.footertext;
    let iconURL = embedData.footericon;
    if(!text || text.length < 1) text = `${client.user.username} | By: Tomato#6966`;
    if(!iconURL || iconURL.length < 1) iconURL = `${client.user.displayAvatarURL()}`;
    
    //Change the lengths
    iconURL = iconURL.trim();
    text = text.trim().substring(0, 2048);
    
    //verify the iconURL
    if(!iconURL.startsWith("https://") && !iconURL.startsWith("http://")) iconURL = client.user.displayAvatarURL();
    if(![".png", ".jpg", ".wpeg", ".webm", ".gif"].some(d => iconURL.toLowerCase().endsWith(d))) iconURL = client.user.displayAvatarURL();
    //return the footerobject
    return { text, iconURL }
  }

  client.getAuthor = (authorname = null, authoricon = null, authorurl = null) => {
    //allow inputs: ({footericon, footerurl}) and (footericon, footerurl);
    let name = authorname;
    let iconURL = authoricon;
    let url = authorurl;

    if(!name || name.length < 1) name = `${client.user.username} | By: Tomato#6966`;
    if(!iconURL || iconURL.length < 1) iconURL = `${client.user.displayAvatarURL()}`;
    if(!url || url.length < 1) url = `https://discord.gg/milrato`;

    //Change the lengths
    iconURL = iconURL.trim();
    name = name.trim().substring(0, 2048);
    
    //verify the iconURL
    if(!url.startsWith("https://") && !url.startsWith("http://")) url = `https://discord.gg/milrato`;
    if(!iconURL.startsWith("https://") && !iconURL.startsWith("http://")) iconURL = client.user.displayAvatarURL();
    if(![".png", ".jpg", ".wpeg", ".webm", ".gif"].some(d => iconURL.toLowerCase().endsWith(d))) iconURL = client.user.displayAvatarURL();
    //return the footerobject
    return { name, iconURL, url }
  }

  process.on('unhandledRejection', (reason, p) => {
    console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow.dim);
    console.log('Reason: ', reason.stack ? String(reason.stack).gray : String(reason).gray);
    console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  });
  process.on("uncaughtException", (err, origin) => {
    console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  })
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('=== uncaught Exception Monitor ==='.toUpperCase().yellow.dim);
  });
  process.on('multipleResolves', (type, promise, reason) => {
   /* console.log('\n\n\n\n\n=== multiple Resolves ==='.toUpperCase().yellow.dim);
    console.log(type, promise, reason);
    console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  */
  });
  
  client.on("messageCreate", (message) => {
    if(!message.guild || message.guild.available === false) return
    if(message.guild && message.author.id == client.user.id && message.embeds.length > 0){
      if(message.channel.type == "GUILD_NEWS"){
        setTimeout(() => {
          if(message.crosspostable){
            message.crosspost().then(msg => console.log("Message got Crossposted".green)).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
          }
        }, client.ws.ping)
      }
    }
  })
  //ALWAYS SERVER DEAF THE BOT WHEN JOING
  client.on("voiceStateUpdate", (oldState, newState) => {
      try{
        //skip if not the bot
        if(client.user.id != newState.id) return;
        if (
            (!oldState.streaming && newState.streaming)   ||
            (oldState.streaming && !newState.streaming)   ||
            (!oldState.serverDeaf && newState.serverDeaf) ||
            (oldState.serverDeaf && !newState.serverDeaf) ||
            (!oldState.serverMute && newState.serverMute) ||
            (oldState.serverMute && !newState.serverMute) || 
            (!oldState.selfDeaf && newState.selfDeaf)     ||
            (oldState.selfDeaf && !newState.selfDeaf)     ||
            (!oldState.selfMute && newState.selfMute)     ||
            (oldState.selfMute && !newState.selfMute)     ||
            (!oldState.selfVideo && newState.selfVideo)   ||
            (oldState.selfVideo && !newState.selfVideo) 
         )
        if ((!oldState.channelId && newState.channelId) || (oldState.channelId && newState.channelId)) {
            try{ newState.setDeaf(true);  }catch{ }
            return;
        }
      }catch{

      }
    
  });
  //ANTI UNMUTE THING
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if(newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false){
      try{
        newState.setDeaf(true).catch(() => {});
      } catch (e){
        //console.log(e)
      }
    }
  });

  client.on("guildCreate", async guild => {
    if(!guild || guild.available === false) return
    let theowner = "NO OWNER DATA! ID: ";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => {})
    simple_databasing(client, guild.id)
    let ls = client.settings.get(guild.id, "language")
    let embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`<a:Join_vc:863876115584385074> Joined a New Server`)
      .addField("Guild Info", `>>> \`\`\`${guild.name} (${guild.id})\`\`\``)
      .addField("Owner Info", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``)
      .addField("Member Count", `>>> \`\`\`${guild.memberCount}\`\`\``)
      .addField("Servers Bot is in", `>>> \`\`\`${client.guilds.cache.size}\`\`\``)
      .addField("Leave Server:", `>>> \`\`\`${config.prefix}leaveserver ${guild.id}\`\`\``)
      .setThumbnail(guild.iconURL({dynamic: true}));
    for(const owner of config.ownerIDS){
      //If the Owner is Tomato, and the Bot is in not a Milrato Development, Public Bot, then dont send information!
      if(owner == "442355791412854784"){
        let milratoGuild = client.guilds.cache.get("773668217163218944");
        if(milratoGuild && !milratoGuild.me.roles.cache.has("779021235790807050")){
          continue; 
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => {})
      }).catch(() => {});
    }
  });

  client.on("guildDelete", async guild => {
    if(!guild || guild.available === false) return
    function clearDBData(key) {
      function cleardb(db, theKey) {
        if(db && db?.has(theKey)) {
          db?.delete(theKey);
        }
      }
      cleardb(client.notes, key)
      cleardb(client.economy, key)
      cleardb(client.invitesdb, key)
      cleardb(client.youtube_log, key)
      cleardb(client.premium, key)
      cleardb(client.snipes, key)
      cleardb(client.afkDB, key)
      // cleardb(client.stats, key) //dont clear stats
      // cleardb(client.modActions, key) //dont clear modactions
      // cleardb(client.userProfiles, key) //dont clear userprofiles
      cleardb(client.musicsettings, key)
      cleardb(client.settings, key)
      for (let i = 0; i <= 100; i++) {
          let index = i + 1;
          cleardb(client[`jtcsettings${index != 1 ? index : ""}`], key)
          cleardb(client[`roster${index != 1 ? index : ""}`], key)
          cleardb(client[`autosupport${i}`], key)
          cleardb(client[`menuticket${i}`], key)
          cleardb(client[`menuapply${i}`], key)
          cleardb(client[`apply${i}`], key)
      }
      cleardb(client.jointocreatemap, key)
      cleardb(client.joinvc, key)
      cleardb(client.setups, key)
      cleardb(client.queuesaves, key)
      cleardb(client.points, key)
      cleardb(client.voicepoints, key)
      cleardb(client.reactionrole, key)
      cleardb(client.social_log, key)
      cleardb(client.blacklist, key)
      cleardb(client.customcommands, key)
      cleardb(client.keyword, key)
    }
    clearDBData(guild.id);
    let theowner = "NO OWNER DATA! ID: ";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => {})
    let embed = new MessageEmbed()
      .setColor("RED")
      .setTitle(`<:leaves:866356598356049930> Left a Server`)
      .addField("Guild Info", `>>> \`\`\`${guild.name} (${guild.id})\`\`\``)
      .addField("Owner Info", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``)
      .addField("Member Count", `>>> \`\`\`${guild.memberCount}\`\`\``)
      .addField("Servers Bot is in", `>>> \`\`\`${client.guilds.cache.size}\`\`\``)
      .setThumbnail(guild.iconURL({dynamic: true}));
    for(const owner of config.ownerIDS){
      //If the Owner is Tomato, and the Bot is in not a Milrato Development, Public Bot, then dont send information!
      if(owner == "442355791412854784"){
        let milratoGuild = client.guilds.cache.get("773668217163218944");
        if(milratoGuild && !milratoGuild.me.roles.cache.has("779021235790807050")){
          continue; 
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => {})
      }).catch(() => {});
    }
  });
  return;
}