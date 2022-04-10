const { MessageEmbed, MessageActionRow } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const { CheckGuild, clearDBData, swap_pages_data } = require(`./functions`);
const { spawn } = require('child_process');
module.exports = async (client) => {
  
  client.disableComponentMessage = (C) => {
    if(C && C.message && C.message.components.length > 0) {
      if(C.replied) {
        C.edit({
          components: client.getDisabledComponents(C.message.components)
        }).catch(() => null);
      } else {
        C.update({
          components: client.getDisabledComponents(C.message.components)
        }).catch(() => null);
      }
      return true;
    } else {
      return;
    }
  }
  client.getDisabledComponents = (MessageComponents) => {
    if(!MessageComponents) return []; // Returning so it doesn't crash

    return MessageComponents.map(({components}) => {
        return new MessageActionRow()
            .addComponents(components.map(c => c.setDisabled(true)))
    });
  }
  client.consoleExec = (_, cmd) => {
      if(!_) return;
      if(!cmd) return _.reply("Please provide the command!")
      const ls = spawn(cmd.split(" ")[0], cmd.split(" ").slice(1));
      ls.stdout.on('data', (data) => {
          if(data.toString().length > 2048) {
              swap_pages_data(client, _, data.toString(), "Success", cmd);
          } else {
              const embed = new MessageEmbed().setDescription("\`\`\`" + data.toString().substr(0, 2030) + "\`\`\`").setTitle("Success")
              _.reply({embeds: [embed] });
          }
      });
      ls.stderr.on('data', (data) => {
          if(data.toString().length > 2048) {
              swap_pages_data(client, _, data.toString(), "Error", cmd);
          } else {
              const embed = new MessageEmbed().setDescription("\`\`\`" + data.toString().substr(0, 2030) + "\`\`\`").setTitle("Error")
              _.reply({embeds: [embed] });
          }
      });
  }
  client.skipMusic = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) return null;
    p.stop();
    return true;
  }
  client.pauseMusic = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) return null;
    p.pause(true);
    return true;
  }
  client.resumeMusic = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) return null;
    p.pause(false);
    return true;
  }
  client.shuffleMusic = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) return null;
    p.queue?.shuffle();
    return true;
  }
  client.stopMusic = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) console.log("NO P")
    if(!p) return null;
    p.destroy();
    console.log("Player destroy")
    return true;
  }

  client.toggleAutoplay = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) return null;
    if(!p.get("autoplay")) {
      p.set("autoplay", true);
    } else {
      p.set("autoplay", false);
    }
    return true;
  } 

  client.clearQueue = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) return null;
    p.queue?.clear();
    return true;
  }
  client.removeQueueTrack = (guildId, songIndex) => {
    const p = client.manager.players.get(guildId);
    if(!p) return null;
    if(p.queue?.[songIndex]) {
      p.queue?.remove(songIndex)
    }
    return true;
  }
  client.getPlayerData = (guildId) => {
    const p = client.manager.players.get(guildId);
    if(!p) return "o player";
    else return {
        voiceChannel: p.voiceChannel,
        queue: p.queue ? {
            current: p.queue.current,
            duration: p.queue.duration,
            size: p.queue.size,
            totalSize: p.queue.totalSize,
            tracks: [...p.queue],
        } : null,
        textChannel: p.textChannel,
        guild: p.guild,
        paused: p.paused,
        playing: p.playing,
        position: p.position,
        queueRepeat: p.queueRepeat,
        trackRepeat: p.trackRepeat,
        state: p.state,
        volume: p.volume,
        autoplay: p.get("autoplay"),
    }
  }
  
  client.getMemberVoiceChannel = async (guildId, userId) => {
      const guild = client.guilds.cache.get(guildId);
      if(!guild) return false;
      const member = guild.members.cache.get(userId) || await guild.members.fetch(userId).catch(() => null);
      return member?.voice?.channelId || false;
  }
  client.getMemberRoleIds = async (guildId, userId) => {
    const guild = client.guilds.cache.get(guildId);
    if(!guild) return false;
    const member = guild.members.cache.get(userId) || await guild.members.fetch(userId).catch(() => null);
    return member?.roles?.cache.map(r => r.id) || false;
  }

  client.updateClusterDbCache = async (db, key, guildId) => {
    // update db-cache on that Cluster
    await client.cluster.evalOnCluster((c, data) => {
        if(data.key.includes(".")) c[data.db]?.get(data.key.split(".")[0], true); 
        // fetch the T_Key
        c[data.db]?.get(data.key, true);
        // return some value 
        return true; 
    }, { guildId: guildId, context: { db, key } }).catch(console.error);
    return true;
  }


  // on this shard
  client.getGuild = (id) => {
    return new Promise((res, rej) => {
      if(!id) rej(new Error("No guildId Provided"));
      if(client.guilds.cache.has(id)) return res(client.guilds.cache.get(id));
      rej(new Error("NO GUILD FOUND"));
    })
  }
  // on all shards
  client.getGuildData = (guildId) => {
    return new Promise((res, rej) => {
      if(!guildId) rej(new Error("No guildId Provided"));
      if(client.guilds.cache.has(id)) return res(client.guilds.cache.get(guildId));
      console.log(`Getting Guild Data for: ${guildId}`)
      client.cluster.evalOnCluster(`this.guilds.cache.get(${guildId})`, { guildId }).catch(rej).then(d => res(d))
    })
  }
  // on this shard
  client.getInvite = async (id) => {
    if (!id || id.length != 18) return "INVALID CHANNELID";
    let ch = await client.channels.fetch("802914917874663454").catch(() => { })
    if (!ch) return `COULD NOT CREATE INVITE FOR: <#802914917874663454> in **${ch.guild.name}**`
    if (!ch.permissionsFor(ch.guild.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
      return `:x: **I am missing the CREATE_INSTANT_INVITE PERMISSION for \`${ch.name}\`**`
    }
    let inv = await ch.createInvite();
    if (!inv) return `COULD NOT CREATE INVITE FOR: <#802914917874663454> in **${ch.guild.name}**`
    return `<#802914917874663454> | discord.gg/${inv.code}`
  }
  // on this shard
  client.getUser = (id) => {
    return new Promise(async (res, rej) => {
      if(!id) rej(new Error("No userId Provided"));
      let user = client.users.cache.get(id) || await client.users.fetch(id).catch(e => rej(e));
      if(user) res(user); else rej(new Error("No User found"))
    })
  }
  // on all shards
  client.getUserData = (id) => {
    return new Promise(async (res, rej) => {
      if(!id) rej(new Error("No userId Provided"));
      let user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if(user) res(user); else {
        await client.cluster.broadcastEval(async (c, ctx) => c.users.cache.get(ctx) || await c.users.fetch(ctx).catch(() => null), {context: id
        }).catch(rej).then(d => res(d.filter(Boolean)[0]))
        rej(new Error("No User found"))
      }
    })
  }
  // on this shard
  client.getChannel = (id) => {
    return new Promise(async (res, rej) => {
      if(!id) rej(new Error("No channelId Provided"));
      let channel = client.channels.cache.get(id) || await client.channels.fetch(id).catch(e => rej(e));
      if(channel) res(channel); else rej(new Error("No Channel found"))
    })
  }
  // on all shards
  client.getChannelData = (id) => {
    return new Promise(async (res, rej) => {
      if(!id) rej(new Error("No channelId Provided"));
      let channel = client.channels.cache.get(id) || await client.channels.fetch(id).catch(() => null);
      if(channel) res(channel); else {
        await client.cluster.broadcastEval(async (c, ctx) => c.channels.cache.get(ctx) || await c.channels.fetch(ctx).catch(() => null), {context: id
        }).catch(rej).then(d => res(d.filter(Boolean)[0]))
        rej(new Error("No Channel found"))
      }
    })
  }

  
  client.isTicket = (id) => {
    return new Promise(async (res, rej) => {
      let obj = {};
      for (let i = 0; i<= 100; i++) {
        obj[`tickets${i != 0 ? i : ""}`] = [];
        obj[`menutickets${i != 0 ? i : ""}`] = [];
        obj[`applytickets${i != 0 ? i : ""}`] = [];
      }
      let dbData = await client.setups.get("TICKETS");
      for await (const [key, value] of Object.entries(obj)) {
        if(dbData && dbData[key] && Array.isArray(dbData[key]) && dbData[key].includes(id)) {
          return res(true);
        } else {
          continue
        }
      }
      return res(false);
    })
  }
  client.getUniqueID = (ExtraId = 0) => {
    const firstNumber = () => String(Date.now() / Math.floor(Math.random() * Math.floor(((Math.PI * (Date.now() / 1000000) * Math.E) - Math.PI) + Math.PI))).replace(".", "")
    return `${firstNumber().slice(0, 4)}_${firstNumber().slice(0, 4)}_${firstNumber().slice(0, 3)}_${ExtraId}`;
  }

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
    text = text.trim().substring(0, 2000);
    
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
    if(message.guild && message.author?.id == client.user.id && message.embeds.length > 0){
      if(message.channel.type == "GUILD_NEWS"){
        setTimeout(() => {
          if(message.crosspostable){
            message.crosspost().then(msg => console.log("Message got Crossposted".green)).catch(e=>console.error(e))
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
        newState.setDeaf(true).catch(() => null);
      } catch (e){
        //console.error(e)
      }
    }
  });

  client.on("guildCreate", async guild => {
    if(!guild || guild.available === false) return
    let theowner = "NO OWNER DATA! ID: ";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => null)
    await CheckGuild(client, guild.id); //CHECK THE GUILD DB
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
    for await (const owner of config.ownerIDS){
      //If the Owner is Tomato, and the Bot is in not a Milrato Development, Public Bot, then dont send information!
      if(owner == "442355791412854784"){
        let milratoGuild = client.guilds.cache.get("773668217163218944");
        if(milratoGuild && !milratoGuild.me.roles.cache.has("779021235790807050")){
          continue; 
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => null)
      }).catch(() => null);
    }
  });

  client.on("guildDelete", async guild => {
    if(!guild || guild.available === false) return
    
    clearDBData(client, guild.id);
    let theowner = "NO OWNER DATA! ID: ";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => null)
    let embed = new MessageEmbed()
      .setColor("RED")
      .setTitle(`<:leaves:866356598356049930> Left a Server`)
      .addField("Guild Info", `>>> \`\`\`${guild.name} (${guild.id})\`\`\``)
      .addField("Owner Info", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``)
      .addField("Member Count", `>>> \`\`\`${guild.memberCount}\`\`\``)
      .addField("Servers Bot is in", `>>> \`\`\`${client.guilds.cache.size}\`\`\``)
      .setThumbnail(guild.iconURL({dynamic: true}));
    for await (const owner of config.ownerIDS){
      //If the Owner is Tomato, and the Bot is in not a Milrato Development, Public Bot, then dont send information!
      if(owner == "442355791412854784"){
        let milratoGuild = client.guilds.cache.get("773668217163218944");
        if(milratoGuild && !milratoGuild.me.roles.cache.has("779021235790807050")){
          continue; 
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => null)
      }).catch(() => null);
    }
  });  
  return;
}